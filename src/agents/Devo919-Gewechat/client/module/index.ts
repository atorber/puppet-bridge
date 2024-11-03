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

  token: string
  private appId: string
  private host: string = 'http://127.0.0.1'
  private apiPort: string = '2531'
  private downloadPort: string = '2532'
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
  private baseUrl: string

  constructor (options: Options) {
    super()

    this.token = options.token || ''
    this.appId = options.appId || ''
    this.host = options.host || this.host
    this.apiPort = options.apiPort || this.apiPort
    this.downloadPort = options.downloadPort || this.downloadPort
    this.callbackHost = options.callbackHost || ''
    this.baseUrl = `${this.host}:${this.apiPort}`
    this.axiosInstance = setupAxios(this.baseUrl, this.token)

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

    // this.startHttpServer()
  }

  private updateModules () {
    this.axiosInstance = setupAxios(this.baseUrl, this.token)
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
    return `${this.host}:${this.downloadPort}/download/${path}`
  }

  // HTTP Server Setup
  startHttpServer (port?: number) {
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

    const PORT = port || 2544
    createHttpServer(PORT, serverHandler)
      .then(async (res) => {
        // await this.setCallback()
        return res
      }).catch((error) => {
        logger.error('HTTP Server failed to start:', error)
      })
  }

  private handleCollectCallback (data: any) {
    logger.info('处理接收到的数据:' + JSON.stringify(data))
    this.emit('callback', data)
  }

  async setCallback (callbackUrl?: string) {
    callbackUrl = callbackUrl || `http://${this.callbackHost}:2544/v2/api/callback/collect`
    const data = {
      token: this.token,
      callbackUrl,
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
