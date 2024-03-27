/* eslint-disable camelcase */
/* eslint-disable sort-keys */
import net from 'net'
import http from 'http'
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
import * as wxhelper from './atorber-fused-api.js'

import sudo from 'sudo-prompt'

const __dirname = path.resolve(path.dirname(''))
log.info('当前文件的目录路径:', __dirname)

enum ApiEndpoint {
  Checklogin = '/api/checkLogin', // 检查登录状态
  SyncUrl = '/api/syncurl', // 获取二维码
  UserInfo = '/api/userinfo', // 获取登录用户信息
  Contacts = '/api/contacts', // 获取通讯录信息，不建议使用，请使用 DbContacts
  DbContacts = '/api/dbcontacts', // 从数据库中获取通讯录信息
  SendTxtMsg = '/api/sendtxtmsg', // 发送文本消息
  SendImgMsg = '/api/sendimgmsg', // 发送图片消息
  SendFileMsg = '/api/sendfilemsg', // 发送文件消息
  ChatRoom = '/api/chatroom', // 获取群聊组成员列表，不建议使用，请使用 DbChatRoom
  DbChatRoom = '/api/dbchatroom', // 从数据库中获取群聊组信息和成员列表
  AccountByWxid = '/api/accountbywxid', // WXID反查微信昵称，不建议使用，请使用 DbAccountByWxid
  DbAccountByWxid = '/api/dbaccountbywxid', // 从数据库中通过WXID反查微信昵称
  ForwardMsg = '/api/forwardmsg', // 消息转发
  DBS = '/api/dbs', // 获取支持查询的数据库句柄
  ExecSql = '/api/execsql', // 通过数据库句柄执行SQL语句
  Close = '/close', // 停止 wxbot-sidecar（停止http server，并中止程序运行）
}

// const HEART_BEAT = 5005 // 心跳
// const RECV_TXT_MSG = 1 // 文本消息
// const RECV_PIC_MSG = 3 // 图片消息
// const SEND_FILE_MSG = 49 // 文件消息
// const USER_LIST = 5000 // 微信联系人列表
// const GET_USER_LIST_SUCCSESS = 5001 // 获取联系人列表成功
// const GET_USER_LIST_FAIL = 5002 // 获取联系人列表失败
// const TXT_MSG = 555 // 发送文本消息
// const PIC_MSG = 500 // 发送图片消息
// const AT_MSG = 550 // 发送AT消息
// const CHATROOM_MEMBER = 5010 // 群成员列表
// const CHATROOM_MEMBER_NICK = 5020 // 群成员昵称
// const PERSONAL_INFO = 6500 // 个人信息
// const DEBUG_SWITCH = 6000 // 调试开关
// const PERSONAL_DETAIL = 6550 // 个人详细信息
// const NEW_FRIEND_REQUEST = 37// 微信好友请求消息
// const AGREE_TO_FRIEND_REQUEST = 10000// 同意微信好友请求消息

// 设置axios请求超时时间
axios.defaults.timeout = 5000

export const getid = () => {
  const id = Date.now()
  return id.toString()
}

class Bridge extends EventEmitter {

  private wsUrl: string = 'ws://127.0.0.1:19099'

  private httpUrl: string = 'http://127.0.0.1:8080'

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

    // 启动一个http server，监听8081端口
    this.createHttpServer()
    const execOptions = {
      name: 'Wechaty Puppet Bridge',
    }

    // 检测当前PC上安装的微信客户端的版本
    const checkWechatVersion = () => {

      // 这里可以添加获取 WeChat 版本的代码
      const filePath = 'C:\\Program Files (x86)\\Tencent\\WeChat\\WeChat.exe'
      const command = `(Get-Item '${filePath}').VersionInfo | Select-Object -ExpandProperty ProductVersion`

      exec(`powershell -command "${command}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`执行的错误: ${error}`)
          return
        }
        if (stderr) {
          console.error(`执行的错误: ${stderr}`)
          return
        }

        const wechatVersion = stdout.trim()
        log.info(`微信版本: ${wechatVersion}`)
      })
    }

    checkWechatVersion()

    // 结束所有名称为wxbot-sidecar-3.9.8.25.exe的进程
    // const killWxbotSidecar = 'taskkill /F /IM wxbot-sidecar-3.9.8.25.exe'
    // exec(killWxbotSidecar, (error: any, stdout: any, stderr: any) => {
    //   if (error) {
    //     log.error(`结束进程执行出错: ${error}`)
    //     log.error(`结束进程执行stderr: ${stderr}`)
    //   } else {
    //     log.info(`结束进程执行stdout: ${stdout}`)
    //   }
    // })

    // 启动wxbot-sidecar-
    const execString = join(__dirname, 'assets', 'wxbot-sidecar-3.9.8.25.exe')
    log.info('execString:', execString)

    // 在Windows上，使用cmd /k 执行exe并在执行完毕后保留窗口
    const command = `cmd /c "${execString} -q http://127.0.0.1:8081/qrcode-callback & pause"`
    // const command = `cmd /c "${execString} & pause"`
    // const command = `${execString} -q http://127.0.0.1:8081/qrcode-callback`
    log.info('command:', command)

    sudo.exec(command, execOptions, (error: any, stdout: any, stderr: any) => {
      log.info('command is called', command)
      if (error) {
        log.error(`command执行出错: ${error}`)
        log.error(`command执行stderr: ${stderr}`)
      } else {
        log.info(`command执行stdout: ${stdout}`)
      }
    })

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
          const injectorPath = join(__dirname, 'assets', 'Injector.exe')
          const dllPath = join(__dirname, 'assets', 'wxhelper-3.9.8.25-v2.dll')
          // const execString = `${injectorPath} --process-name WeChat.exe --inject ${dllPath}`
          const execString = `${injectorPath} -p ${pid} --inject ${dllPath}`

          log.info('execString:', execString)

          sudo.exec(execString, execOptions, (error: any, stdout: any, stderr: any) => {
            if (error) {
              console.error(`注入执行出错: ${error}`)
              log.error(`注入执行标准错误stderr: ${stderr}`)
              throw new Error(`注入执行出错: ${error}`)
            } else {
              log.info(`注入执行标准输出stdout: ${stdout}`)
              const doLogin = () => {
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
              // 如果未登录，则每隔5s获取一次登录二维码
              const timer = setInterval(() => {
                if (this.isLoggedIn) {
                  log.info('已登录，清除定时器...')
                  this.server = this.createWebSocket(this.wsUrl.split(':')[2] as string)
                  // 启动wxbot-sidecar-3.9.8.25.exe
                  clearInterval(timer)
                } else {
                  log.info('未登录，每隔5s获取一次登录二维码...')
                  doLogin()
                }
              }, 10000)
            }

          })
        }
      } catch (e) {
        log.error('获取微信进程号出错:', e)
      }
    })

  }

  private createHttpServer () {
    const server = http.createServer()

    server.on('close', () => {
      log.info('Server closed')
    })

    // qrcode-callback
    server.on('request', (req: any, res: any) => {
      log.info('request:', req.url)
      if (req.url === '/qrcode-callback') {
        log.info('qrcode-callback...', req)
        let data = ''
        req.on('data', (chunk: any) => {
          data += chunk
        })

        req.on('end', () => {
          log.info('http data:', data)
          res.writeHead(200, { 'Content-Type': 'text/plain' })
          res.end('Hello World\n')
        })
      }
    })

    server.listen(8081)
    log.info('Server running at http://127.0.0.1:8081/')
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

  // checklogin
  async checkLogin () {
    try {
      const options = {
        url: this.httpUrl + ApiEndpoint.Checklogin,
        body: {},
        json: true,
      }
      log.info('checkLogin options:', options.url)
      const res = await axios.get(options.url)
      // log.info('checkLogin res:', JSON.stringify(res.data))
      return res as unknown as wxhelper.ResponseData
    } catch (e) {
      log.error('checkLogin error:', e)
      return e
    }
  }

  // 47.获取群详情和群成员列表
  async getMemberListFromDb (wxid: string) {
    try {
      const options = {
        url: this.httpUrl + `${ApiEndpoint.DbChatRoom}?wxid=${wxid}`, //
        body: {},
        json: true,
      }
      const res = await axios.get(options.url)
      // log.info('getRoomList res:', JSON.stringify(res.data))
      return res as unknown as wxhelper.ResponseData
    } catch (e) {
      log.error('getRoomList error:', e)
      return e
    }

  }

  // 47-1.获取群详情(通过接口)
  async getMemberListFromApi (wxid: string) {
    try {
      const options = {
        url: this.httpUrl + `${ApiEndpoint.ChatRoom}?wxid=${wxid}`, //
        body: {},
        json: true,
      }
      const res = await axios.get(options.url)
      // log.info('getRoomList res:', JSON.stringify(res.data))
      return res as unknown as wxhelper.ResponseData
      // const rooms: RoomRaw[] = res.data.content
      // return rooms
    } catch (e) {
      log.error('getRoomList error:', e)
      return e
    }

  }

  // 从数据库中通过WXID反查信息 dbaccountbywxid
  async getContactByWxidFromDb (wxid: string) {
    try {
      const options = {
        url: this.httpUrl + `${ApiEndpoint.DbAccountByWxid}?wxid=${wxid}`, //
        body: {},
        json: true,
      }
      const res = await axios.get(options.url)
      // log.info('getDbAccountByWxid res:', JSON.stringify(res.data))
      return res as unknown as wxhelper.ResponseData
    } catch (e) {
      log.error('getDbAccountByWxid error:', e)
      return e
    }

  }

  // WXID反查信息 AccountByWxid
  async getContactByWxidFromApi (wxid: string) {
    try {
      const options = {
        url: this.httpUrl + `${ApiEndpoint.AccountByWxid}?wxid=${wxid}`, //
        body: {},
        json: true,
      }
      const res = await axios.get(options.url)
      // log.info('getAccountByWxid res:', JSON.stringify(res.data))
      return res as unknown as wxhelper.ResponseData
    } catch (e) {
      log.error('getAccountByWxid error:', e)
      return e
    }

  }

}

export { Bridge, log, wxhelper }
