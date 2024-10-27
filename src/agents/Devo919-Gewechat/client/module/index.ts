/* eslint-disable sort-keys */
import { EventEmitter } from 'events'
import type { Options } from '../types/types.js'
import { logger } from '../utils/logger.js'
import { createHttpServer } from '../utils/server.js'
import { setupAxios } from '../config/axiosConfig.js'
import { Account } from './account.js'
import { Contacts } from './contacts.js'
import { Favorite } from './favorite.js'
import { Groups } from './groups.js'
import { Lable } from './lable.js'
import { Login } from './login.js'
import { Message } from './message.js'
import { Self } from './self.js'
import xml2js from 'xml2js'
// import * as MessageTypes from '../types/message.js'
// import * as NoticeTypes  from '../types/notice.js'

class Client extends EventEmitter {

  private token: string
  private appId: string
  private host: string
  private callbackHost: string
  private axiosInstance: ReturnType<typeof setupAxios>
  private login: Login
  private contacts: Contacts
  private groups: Groups
  private favorite: Favorite
  private lable: Lable
  private account: Account
  private message: Message
  private self: Self

  constructor (options?: Options) {
    super()

    this.token = options?.token || ''
    this.appId = options?.appId || ''
    this.host = options?.host || '127.0.0.1'
    this.callbackHost = options?.callbackHost || ''
    this.axiosInstance = setupAxios(`http://${this.host}:2531`, this.token)

    // Initialize modules
    this.login = new Login({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.contacts = new Contacts({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.groups = new Groups({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.favorite = new Favorite({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.lable = new Lable({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.account = new Account({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.message = new Message({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.self = new Self({ appId: this.appId, axiosInstance: this.axiosInstance })

    this.setToken(this.token)
      .then((res) => {
        logger.info('setToken success...')
        return res
      })
      .catch((error) => {
        logger.error('setToken failed:' + error)
        throw error
      })

    this.startHttpServer()
  }

  private updateModules () {
    this.axiosInstance = setupAxios(`http://${this.host}:2531`, this.token)
    this.login = new Login({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.contacts = new Contacts({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.groups = new Groups({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.favorite = new Favorite({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.lable = new Lable({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.account = new Account({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.message = new Message({ appId: this.appId, axiosInstance: this.axiosInstance })
    this.self = new Self({ appId: this.appId, axiosInstance: this.axiosInstance })
  }

  async setToken (token?: string) {
    try {
      if (token) {
        this.token = token
      } else {
        this.token = await this.getTokenId()
      }
      this.axiosInstance.defaults.headers.post['X-GEWE-TOKEN'] = this.token
      // Update modules with new axios instance
      this.updateModules()
      return this.token
    } catch (error) {
      logger.error('setToken failed:' + error)
      throw error
    }
  }

  async getTokenId (): Promise<string> {
    try {
      const response = await this.axiosInstance.post('/v2/api/tools/getTokenId')
      logger.info('getTokenId success:', JSON.stringify(response.data))
      this.token = response.data.data
      return this.token
    } catch (error) {
      logger.error('getTokenId failed:', error)
      throw error
    }
  }

  setAppId (appId: string) {
    this.appId = appId
    this.updateModules()
    return this.appId
  }

  setCallbackHost (callbackHost: string) {
    this.callbackHost = callbackHost
    return this.callbackHost
  }

  getDownloadUrl (path: string) {
    return `http://${this.host}:2532/download/${path}`
  }

  // HTTP Server Setup
  private startHttpServer () {
    const serverHandler = (req: any, res: any) => {
      const parsedUrl = req.url

      if (req.method === 'POST' && parsedUrl === '/v2/api/callback/collect') {
        logger.info('收到回调请求...')
        let body = ''

        req.on('data', (chunk: any) => {
          body += chunk.toString()
        })

        req.on('end', () => {
          try {
            const data = JSON.parse(body)
            logger.info('接收到的数据:' + JSON.stringify(data))
            // Handle the callback data
            this.handleCollectCallback(data)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ret: 200, status: 'success', msg: 'ok' }))
          } catch (error) {
            logger.error('解析请求体时出错:' + error)
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ status: 'error', message: 'Invalid JSON' }))
          }
        })
      } else if (req.method === 'GET' && parsedUrl === '/v2/api/callback/collect') {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(this.token)
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not Found')
      }
    }

    const PORT = 2544
    createHttpServer(PORT, serverHandler)
      .then(async (res) => {
        await this.setCallback()
        return res
      }).catch((error) => {
        logger.error('HTTP Server failed to start:', error)
      })
  }

  private handleCollectCallback (data: any) {
    const that = this
    logger.info('处理接收到的数据:' + JSON.stringify(data))
    const typeName = data.TypeName
    if (typeName) {
      switch (data.TypeName) {
        case 'AddMsg':{
          switch (data.Data.MsgType) {
            case 1:
              that.emit('message', { typeCode:1, data, typeName:'文本消息' })
              break
            case 3:
              that.emit('message', { typeCode:3, data, typeName:'图片消息' })
              break
            case 34:
              that.emit('message', { typeCode:34, data, typeName:'语音消息' })
              break
            case 43:
              that.emit('message', { typeCode:43, data, typeName:'视频消息' })
              break
            case 47:
              that.emit('message', { typeCode:47, data, typeName:'表情消息' })
              break
            case 42:
              that.emit('message', { typeCode:42, data, typeName:'名片消息' })
              break
            case 48:
              that.emit('message', { typeCode:48, data, typeName:'地理位置消息' })
              break
            case 49:{
              try {
                const xml = data.Data.Content.string
                xml2js.parseString(String(xml), { explicitArray: false, ignoreAttrs: true }, (err: any, json: any) => {
                  logger.info('xml2json err:', err)
                  logger.info('json content:', JSON.stringify(json))
                  if (json.msg && json.msg.appmsg) {
                    const curType = json.msg.appmsg.type
                    const typeCode = curType ? Number('49' + curType) : ''
                    switch (curType) {
                      case '33':
                      case '39':
                        that.emit('message', { data, typeCode, typeName:'小程序消息' })
                        break
                      case '5':{
                        if (json.msg.appmsg.title === '邀请你加入群聊') {
                          that.emit('notice', { data, typeCode, typeName:'群聊邀请通知' })
                        } else {
                          that.emit('message', { data, typeCode, typeName:'公众号链接消息' })
                        }
                        break
                      }
                      case '74':
                        that.emit('message', { data, typeCode, typeName:'文件消息' })
                        break
                      case '6':
                        that.emit('message', { data, typeCode, typeName:'文件发送完成通知' })
                        break
                      case '57':
                        that.emit('message', { data, typeCode, typeName:'引用消息' })
                        break
                      case '2000':
                        that.emit('message', { data, typeCode, typeName:'转账消息' })
                        break
                      case '2001':
                        that.emit('message', { data, typeCode, typeName:'红包消息' })
                        break
                      case '51':
                        that.emit('message', { data, typeCode, typeName:'视频号消息' })
                        break
                      default:
                        break
                    }
                  }
                })
              } catch (err) {
                logger.error('xml2js.parseString fail:', err)
              }
              that.emit('message', data)
              break
            }
            case 37:
              that.emit('notice', { data, typeCode:37, typeName:'好友添加请求通知' })
              break
            case 10002:
              try {
                const xml = data.Data.Content.string
                xml2js.parseString(String(xml), { explicitArray: false, ignoreAttrs: true }, function (err: any, json: any) {
                  logger.verbose('xml2json err:%s', err)
                  logger.verbose('json content:%s', JSON.stringify(json))
                  if (json.msg.sysmsg && json.msg.sysmsg.type === 'revokemsg') {
                    that.emit('message', { typeCode:'10002-revokemsg', data, typeName:'撤回消息' })
                  }
                  if (json.msg.sysmsg && json.msg.sysmsg.type === 'pat') {
                    that.emit('message', { typeCode:'10002-pat', data, typeName:'拍一拍消息' })
                  }
                  if (json.msg.sysmsg && json.msg.sysmsg.type === 'sysmsgtemplate' && xml.indexOf('移出了群聊') !== -1) {
                    that.emit('message', { typeCode:'10002-sysmsgtemplate', data, typeName:'踢出群聊通知' })
                  }
                  if (json.msg.sysmsg && json.msg.sysmsg.type === 'sysmsgtemplate' && xml.indexOf('已解散该群聊') !== -1) {
                    that.emit('message', { typeCode:'10002-sysmsgtemplate', data, typeName:'解散群聊通知' })
                  }
                  if (json.msg.sysmsg && json.msg.sysmsg.type === 'mmchatroombarannouncememt') {
                    that.emit('message', { typeCode:'10002-mmchatroombarannouncememt', data, typeName:'发布群公告' })
                  }
                  if (json.msg.sysmsg && json.msg.sysmsg.type === 'roomtoolstips') {
                    that.emit('message', { typeCode:'10002-roomtoolstips', data, typeName:'群待办' })
                  }
                })
              } catch (err) {
                logger.error('xml2js.parseString fail:', err)
              }
              that.emit('xxx', data)
              break
            case 10000:
              try {
                const xml = data.Data.Content.string
                xml2js.parseString(String(xml), { explicitArray: false, ignoreAttrs: true }, function (err: any, json: any) {
                  logger.verbose('xml2json err:%s', err)
                  logger.verbose('json content:%s', JSON.stringify(json))
                  if (xml.indexOf('移出群聊') !== -1) {
                    that.emit('notice', { data, typeCode:'10000', typeName:'被移除群通知' })
                  }
                  if (xml.indexOf('修改群名为') !== -1) {
                    that.emit('notice', { data, typeCode:'10000', typeName:'修改群名称通知' })
                  }
                  if (xml.indexOf('已成为新群主') !== -1) {
                    that.emit('notice', { data, typeCode:'10000', typeName:'更换群主通知' })
                  }
                })
              } catch (err) {
                logger.error('xml2js.parseString fail:', err)
              }
              that.emit('xxx', data)
              break
            default:
              logger.error('Unknown message type:' + data.Data.MsgType)
              break
          }
          break
        }
        case 'ModContacts':{
          if (data.Data.UserName.string.indexOf('@') !== -1) {
            that.emit('notice', { data, typeCode:'ModContacts', typeName:'群信息变更通知' })

          } else {
            that.emit('notice', { data, typeCode:'ModContacts', typeName:'好友通过验证及好友资料变更的通知消息' })
          }
          break
        }
        case 'DelContacts':
          if (data.Data.UserName.string.indexOf('@') !== -1) {
            that.emit('notice', { data, typeCode:'DelContacts', typeName:'退出群聊通知' })
          } else {
            that.emit('notice', { data, typeCode:'DelContacts', typeName:'删除好友通知' })
          }
          break
        case 'Offline':
          that.emit('logout', data)
          break
        default:
          logger.error('Unknown type:' + data.TypeName)
          break
      }
    } else {
      logger.info('No TypeName found...')
    }
  }

  private async setCallback () {
    const data = {
      token: this.token,
      callbackUrl: `http://${this.callbackHost}:2544/v2/api/callback/collect`,
    }
    try {
      const response = await this.axiosInstance.post('/v2/api/tools/setCallback', data)
      logger.info('setCallback success:' + JSON.stringify(response.data))
      return response.data
    } catch (error) {
      logger.error('setCallback failed:' + error)
      throw error
    }
  }

  // Expose module instances for external usage
  get loginModule () {
    return this.login
  }

  get contactsModule () {
    return this.contacts
  }

  get groupsModule () {
    return this.groups
  }

  get favoriteModule () {
    return this.favorite
  }

  get lableModule () {
    return this.lable
  }

  get accountModule () {
    return this.account
  }

  get messageModule () {
    return this.message
  }

  get selfModule () {
    return this.self
  }

}

export {
  Client,
  xml2js,
}
