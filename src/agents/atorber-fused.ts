/* eslint-disable camelcase */
/* eslint-disable sort-keys */
import net from 'net'
import axios from 'axios'
import { EventEmitter } from 'events'
import { log } from 'wechaty-puppet'
import { exec } from 'child_process'
import path, { join } from 'path'
import {
  readMsgStore,
  writeMsgStore,
  // getTimeLocaleString,
} from '../utils/messageStore.js'
import {
  Wxhelper,
  MessageRaw,
} from './atorber-fused-api.js'

import sudo from 'sudo-prompt'

const dirname = path.resolve(path.dirname(''))
log.verbose('当前文件的目录路径:', dirname)

// 设置axios请求超时时间
axios.defaults.timeout = 5000

export const getid = () => {
  const id = Date.now()
  return id.toString()
}

class Bridge extends EventEmitter {

  private wsUrl: string = 'ws://127.0.0.1:19099'

  private httpUrl: string = 'http://127.0.0.1:19088'

  wxhelper: Wxhelper

  server: net.Server | undefined

  messageTypeTest: any = {}

  currentUserId = ''

  isLoggedIn = false

  constructor (options?: {
    wsUrl?: string
    httpUrl?: string
  }) {
    super()

    this.messageTypeTest = readMsgStore()
    this.wsUrl = options?.wsUrl || this.wsUrl
    this.httpUrl = options?.httpUrl || this.httpUrl

    this.wxhelper = new Wxhelper(this.httpUrl)

    // 如果未登录，则每隔5s检测一次是否已登录，未登录则获取登录二维码或操作登录
    const timer = setInterval(() => {
      if (this.isLoggedIn) {
        log.info('已登录，清除定时器...')
        this.server = this.createWebSocket(this.wsUrl.split(':')[2] as string)
        // 启动wxbot-sidecar-3.9.8.25.exe
        clearInterval(timer)
      } else {
        log.info('未登录，每隔5s获取一次登录二维码...')
        this.doLogin().then((res) => {
          log.info('doLogin success...')
          return res
        }).catch((e) => {
          log.error('doLogin error:', e)
        })
      }
    }, 5000)

    // 检查http server是否已经启动,如果未启动，则自动注入dll
    this.checkHttpServer().then((res) => {
      log.info('checkHttpServer成功：', res ? '已启动' : '未启动')
      // 如果http server未启动，且未指定httpUrl，则自动注入dll
      if (!res && !options?.httpUrl) {
        log.info('http server未启动，自动注入dll...')
        // this.checkWechatVersion()
        const execOptions = {
          name: 'Wechaty Puppet Bridge',
        }

        // 启动wxhelper
        let pid = 0
        const getWehcatPid = 'tasklist | findstr WeChat.exe'
        exec(getWehcatPid, (error: any, stdout, stderr) => {
          if (error) {
            log.error(`获取微信进程号出错: ${error}`)
            log.error(`获取微信进程号stderr: ${stderr}`)
            return
          }
          log.info('获取微信进程号stdout: ', stdout)

          try {
            pid = this.findLargestProcess(stdout)
            log.info('微信进程号:', pid)

            if (pid === 0) {
              log.error('获取微信进程号出错: 未找到微信进程号')
              throw new Error('获取微信进程号出错: 未找到微信进程号,请检查微信是否已经启动')
            } else {
              const injectorPath = join(dirname, 'src', 'assets', 'Injector.exe')
              const dllPath = join(dirname, 'src', 'assets', 'wxhelper-3.9.8.25-v2.dll')
              // const execString = `${injectorPath} --process-name WeChat.exe --inject ${dllPath}`
              const execString = `${injectorPath} -p ${pid} --inject ${dllPath}`

              log.info('execString:', execString)

              sudo.exec(execString, execOptions, (error: any, stdout: any, stderr: any) => {
                if (error) {
                  console.error(`注入执行出错: ${error}`)
                  log.error(`注入执行标准错误stderr: ${stderr}`)
                  throw new Error(`注入执行出错,确认客户端【以管理员身份运行】: ${error}`)
                } else {
                  log.info(`注入执行标准输出stdout: ${stdout}`)
                }
              })
            }
          } catch (e) {
            log.error('获取微信进程号出错:', e)
          }
        })
      } else if (!res && options?.httpUrl) {
        log.info('http server未启动，但已指定httpUrl，不自动注入dll...')
        throw new Error('由于指定了httpUrl，不自动注入dll，需要手动注入dll启动服务...')
      } else {
        log.info('http server已启动，无需注入dll...')
      }
      return res
    }).catch((e) => {
      log.error('checkHttpServer error:', e)
    })

  }

  private async checkHttpServer () {
    try {
      await axios.get(this.httpUrl)
      log.info('http server is running')
      return true
    } catch (e) {
      log.error('http server is not running:', e)
      return false
    }
  }

  private findLargestProcess = (input: string): number => {
    // 将输入字符串按行分割
    const lines = input.split('\n')
    // log.info('lines:', lines)
    // 初始化最大资源使用量及其对应的进程号
    let maxMemory = 0
    let processIdOfMaxMemory = 0

    // 遍历每一行
    for (const line of lines) {
      // 分割行以提取进程号和资源使用量
      const parts = line.split(/\s+/)
      // log.info('parts:', parts)
      let processIdString = parts.join('')
      // log.info('processIdString:', processIdString)
      processIdString = processIdString.replace(/,/g, '')
      // log.info('processIdString:', processIdString)
      // 使用一个正则提取出进程号和内存用量，例如：WeChat.exe47484Console1113308K提取出47484和1113308
      const reg = /WeChat\.exe(\d+)Console(\d+)K/
      const result = reg.exec(processIdString)
      // log.info('result:', result)
      if (!result || result.length < 3) {
        continue
      } else {
        const processId = parseInt(result[1] as string, 10)
        // 将资源使用量中的逗号移除，然后转换为数字
        const memory = parseInt(result[2] as string, 10)
        // 如果当前进程的资源使用量大于已记录的最大值，则更新最大值及其对应的进程号
        if (memory > maxMemory) {
          maxMemory = memory
          processIdOfMaxMemory = processId
        }
      }
    }

    // 返回占用资源最大的进程号
    return processIdOfMaxMemory
  }

  private createWebSocket (port: string) {
    const server = net.createServer((socket: any) => {
      let messageStore = readMsgStore()
      // const data = Buffer.from('')

      socket.on('data', (data: any) => {
        log.verbose(`Received data: ${data}`)

        try {
          data = data.toString()
          const dataJson = JSON.parse(data)

          // log.info('原始dataJson:\n', JSON.stringify(dataJson, undefined, 2))

          // 缓存消息
          messageStore = writeMsgStore(messageStore, dataJson)

          const j = JSON.parse(data)
          // log.info('ws message hook type:', j.type, JSON.stringify(j, undefined, 2))
          this.handleReceiveMessage(j)
        } catch (e) {
          log.error('Received data error:', e)
        }

      })

      socket.on('end', (data: any) => {
        log.verbose(`Received end: ${data}`)
      })

      socket.on('close', () => {
        log.verbose('Client disconnected')
      })

      socket.on('error', (err: any) => {
        log.error('Socket error:', err)
        this.emit('error', err)
      })
    })

    server.listen(Number(port), () => {
      log.info(`Server listening on port ${port}`)
    })

    const ip = this.wsUrl.split(':')[1]?.replace('//', '') as string
    log.info('ip:', ip)
    log.info('port:', port)

    // this.wxhelper.unhookSyncMsg().then((res) => {
    //   log.info('unhookSyncMsg success:', JSON.stringify(res.data))
    //   this.wxhelper.hookSyncMsg({
    //     port,
    //     ip,
    //     url: '',
    //     timeout: '3000',
    //     enableHttp: '0',
    //   })
    //     .then(async (res) => {
    //       log.info('hookSyncMsg success:', JSON.stringify(res.data))
    //       const checkLoginRes = await this.wxhelper.checkLogin()
    //       log.info('checkLogin success:', JSON.stringify(checkLoginRes.data))

    //       if (checkLoginRes.data && checkLoginRes.data.code === 1 && checkLoginRes.data.msg === 'success') {
    //         log.info('login success')
    //         // 如果非首次登录，且当前状态为未登录，则触发登录事件
    //         if (!this.isLoggedIn) {
    //           this.isLoggedIn = true
    //           this.emit('login', 'login')
    //         } else {
    //           this.emit('heartbeat', 'heartbeat')
    //         }
    //       } else {
    //         if (this.isLoggedIn) {
    //           this.isLoggedIn = false
    //           this.emit('logout', 'logout')
    //         } else {
    //           throw new Error('启动失败，请检查微信是否已经处于登录状态')
    //         }
    //       }
    //       return res
    //     })
    //     .catch((e) => {
    //       log.error('hookSyncMsg error:', e)
    //     })
    //   return res
    // }).catch((e) => {
    //   log.error('unhookSyncMsg error:', e)
    // })

    this.wxhelper.hookSyncMsg({
      port,
      ip,
      url: '',
      timeout: '3000',
      enableHttp: false,
    })
      .then(async (res) => {
        log.info('hookSyncMsg success:', JSON.stringify(res.data))
        const checkLoginRes = await this.wxhelper.checkLogin()
        log.info('checkLogin success:', JSON.stringify(checkLoginRes.data))

        if (checkLoginRes.data && checkLoginRes.data.code > 0 && checkLoginRes.data.msg === 'success') {
          log.info('agent login success')
          // 如果非首次登录，且当前状态为未登录，则触发登录事件
          if (!this.isLoggedIn) {
            this.isLoggedIn = true
            this.emit('login', 'login')
          } else {
            this.emit('heartbeat', 'heartbeat')
          }
        } else {
          if (this.isLoggedIn) {
            this.isLoggedIn = false
            // this.emit('logout', 'logout')
          } else {
            throw new Error('启动失败，请检查微信是否已经处于登录状态')
          }
        }
        return res
      })
      .catch((e) => {
        log.error('hookSyncMsg error:', e)
      })

    // 每隔30s发送心跳消息
    // setTimeout(() => {
    //   log.info('send heartbeat...')
    //   this.wxhelper.hookSyncMsg({
    //     port,
    //     ip,
    //     url: '',
    //     timeout: '3000',
    //     enableHttp: '0',
    //   })
    //     .then(async (res) => {
    //       log.info('hookSyncMsg success:', JSON.stringify(res.data))
    //       const checkLoginRes = await this.wxhelper.checkLogin()
    //       log.info('checkLogin success:', JSON.stringify(checkLoginRes.data))

    //       if (checkLoginRes.data && checkLoginRes.data.code !== 0 && checkLoginRes.data.msg === 'success') {
    //         log.info('login success')
    //         // 如果非首次登录，且当前状态为未登录，则触发登录事件
    //         if (!this.isLoggedIn) {
    //           this.isLoggedIn = true
    //           this.emit('login', 'login')
    //         } else {
    //           this.emit('heartbeat', 'heartbeat')
    //         }
    //       } else {
    //         if (this.isLoggedIn) {
    //           this.isLoggedIn = false
    //           this.emit('logout', 'logout')
    //         } else {
    //           throw new Error('启动失败，请检查微信是否已经处于登录状态')
    //         }
    //       }
    //       return res
    //     })
    //     .catch((e) => {
    //       log.error('hookSyncMsg error:', e)
    //     })
    // }, 10000)
    return server
  }

  private doLogin = async () => {
    // 初始化数据库信息
    await this.wxhelper.initDBInfo()
    this.wxhelper.checkLogin()
      .then((res:any) => {
        log.info('checkLogin success:', JSON.stringify(res.data))
        const checkLoginRes = res.data
        log.info('checkLoginRes:', JSON.stringify(checkLoginRes))
        const isLoggedIn = checkLoginRes.code > 0
        if (isLoggedIn) {
          log.info('agent login success...')
          this.isLoggedIn = true
          this.emit('login', 'login')
        } else {
          this.wxhelper.clickEnterWeChat()
            .then((res) => {
              log.info('clickEnterWeChat success:', JSON.stringify(res.data))
              const clickEnterWeChatRes = res.data
              if (clickEnterWeChatRes.code > 0) {
                this.isLoggedIn = true
                this.emit('login', 'login')
              } else {
                log.info('clickEnterWeChat success, but not login, getLoginUrl...')
                this.isLoggedIn = false
                this.wxhelper.getLoginUrl().then((res) => {
                  log.info('getLoginUrl_res:', JSON.stringify(res.data))
                  if (res.data && res.data.code > 0) {
                    this.emit('getLoginUrl', res.data)
                  }
                  return res
                }).catch((e) => {
                  log.error('getLoginUrl error:', e)
                })
              }
              return res
            })
            .catch((e) => {
              log.error('clickEnterWeChat error:', e)
            })
        }
        return res
      })
      .catch((e) => {
        log.error('checkLogin error:', e)
      })
  }

  // 处理消息hook
  handleReceiveMessage (messageRaw: MessageRaw) {
    // log.info('handleReceiveMessage...:', messageRaw)
    if (messageRaw.type === 3) {
      this.wxhelper.downloadAttach(messageRaw.msgId).then((res) => {
        log.info('downloadAttach success:', JSON.stringify(res.data))
        return res
      }).catch((e) => {
        log.error('downloadAttach error:', e)
      })
    }
    this.emit('message', messageRaw)
  }

  // 处理心跳消息
  handleHeartbeat (j: any) {
    this.emit('heartbeat', j)
    // log.info(utf16ToUtf8(wxid),utf16ToUtf8(name));
  }

}

export { Bridge, log }
