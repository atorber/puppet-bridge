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
import * as wxhelper from './ttttupup-wxhelper-api.js'

import sudo from 'sudo-prompt'
import type {
  AccountInfo,
} from './ttttupup-wxhelper-api.js'

export {
  AccountInfo,
}

const __dirname = path.resolve(path.dirname(''))
log.info('当前文件的目录路径:', __dirname)

// 设置axios请求超时时间
axios.defaults.timeout = 5000

export const getid = () => {
  const id = Date.now()
  return id.toString()
}

class Bridge extends EventEmitter {

  private wsUrl: string = 'ws://127.0.0.1:19099'

  private httpUrl: string = 'http://127.0.0.1:19088'

  wxhelper: typeof wxhelper = wxhelper

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
    let pid = 0
    const getWehcatPid = 'tasklist | findstr WeChat.exe'
    exec(getWehcatPid, (error: any, stdout, stderr) => {
      if (error) {
        log.error(`获取微信进程号出错: ${error}`)
        log.error(`获取微信进程号stderr: ${stderr}`)
        return
      }
      log.info('获取微信进程号stdout: ', stdout)

      // 解析stdout，获取微信进程号，去除空格、换行符
      function findLargestProcess (input: string): number {
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

      try {
        pid = findLargestProcess(stdout)
        log.info('微信进程号:', pid)
        if (pid === 0) {
          log.error('获取微信进程号出错: 未找到微信进程号')
          throw new Error('获取微信进程号出错: 未找到微信进程号,请检查微信是否已经启动')
        } else {
          const injectorPath = join(__dirname, 'src', 'assets', 'Injector.exe')
          const dllPath = join(__dirname, 'src', 'assets', 'wxhelper-3.9.5.81-v11.dll')
          // const execString = `${injectorPath} --process-name WeChat.exe --inject ${dllPath}`
          const execString = `${injectorPath} -p ${pid} --inject ${dllPath}`

          log.info('execString:', execString)
          const execOptions = {
            name: 'wechaty puppet bridge',
          }

          sudo.exec(execString, execOptions, (error: any, stdout: any, stderr: any) => {
            if (error) {
              console.error(`注入执行出错: ${error}`)
              log.error(`注入执行标准错误stderr: ${stderr}`)
              return
            }
            log.info(`注入执行标准输出stdout: ${stdout}`)
            this.server = this.createWebSocket(this.wsUrl.split(':')[2] as string)
          })
        }
      } catch (e) {
        log.error('获取微信进程号出错:', e)
      }
    })

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

          log.info('原始dataJson:\n', JSON.stringify(dataJson, undefined, 2))

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
      enableHttp: '0',
    })
      .then(async (res) => {
        log.info('hookSyncMsg success:', JSON.stringify(res.data))
        const checkLoginRes = await this.wxhelper.checkLogin()
        log.info('checkLogin success:', JSON.stringify(checkLoginRes.data))

        if (checkLoginRes.data && checkLoginRes.data.code === 1 && checkLoginRes.data.msg === 'success') {
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
            this.emit('logout', 'logout')
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

  // 处理消息hook
  handleReceiveMessage (messageRaw: wxhelper.MessageRaw) {
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

export { Bridge, log, wxhelper }
