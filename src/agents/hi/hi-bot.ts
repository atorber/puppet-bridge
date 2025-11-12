/* eslint-disable camelcase */
/* eslint-disable sort-keys */
import axios, { type AxiosInstance } from 'axios'
import { EventEmitter } from 'events'
import { log } from 'wechaty-puppet'
import * as crypto from 'crypto'

// 如流API响应类型
interface ApiResponse<T = any> {
  code?: string
  errcode?: number
  errmsg?: string
  data?: T
  msgkey?: string
  invaliduser?: string
  invalidparty?: string
  invalidtag?: string
}

// Token响应
interface TokenResponse {
  app_access_token: string
  expire: number
}

// 群成员列表响应
interface RoomMemberResponse {
  userInfoList: Array<{ userId: string }>
  agentInfoList?: Array<{ agentId: number }>
}

// 群聊消息发送响应（方法返回的是解析后的最终数据）
interface GroupMessageResponse {
  messageid: number
  msgseqid: number
  ctime: number
}

// Bridge接口需要的数据类型
export type ContactRaw = {
  id: string
  name: string
  avatar?: string
}

export type RoomRaw = {
  room_id: string | number
  member: string[]
}

export type MessageRaw = {
  id: string
  type: number
  content: string | any
  wxid?: string
  id1?: string
  id2?: string
  id3?: string
  other?: string
  srvid?: number
  time?: string
}

export type ContentRaw = {
  content: string
  detail: string
  id1: string
  id2: string
  thumb: string
}

class Bridge extends EventEmitter {

  private appKey: string
  private appSecret: string
  private apiBaseUrl: string
  private httpClient: AxiosInstance
  private appAccessToken: string | null = null
  private tokenExpireTime: number = 0
  private agentId?: number
  private selfId: string
  private selfName: string

  constructor (options: {
    appKey: string
    appSecret: string
    apiBaseUrl: string
    agentId?: number
    selfId: string
    selfName: string
  }) {
    super()
    this.appKey = options.appKey
    this.appSecret = options.appSecret
    this.apiBaseUrl = options.apiBaseUrl
    this.agentId = options.agentId
    this.selfId = options.selfId
    this.selfName = options.selfName
    // 创建HTTP客户端
    this.httpClient = axios.create({
      baseURL: this.apiBaseUrl,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      timeout: 30000,
    })

    // 请求拦截器：自动添加Authorization头
    this.httpClient.interceptors.request.use(async (config) => {
      await this.ensureToken()
      // ensureToken 成功后会设置 appAccessToken，如果失败会抛出错误
      // 使用非空断言，因为 ensureToken 成功时 token 一定存在
      const token = this.appAccessToken as string
      // axios 的 config.headers 在拦截器中总是存在
      config.headers.Authorization = `Bearer-${token}`
      config.headers['LOGID'] = Date.now().toString()
      return config
    })

    log.verbose('Bridge', 'constructor initialized with apiBaseUrl: %s', this.apiBaseUrl)
  }

  /**
   * 确保token有效，如果过期则重新获取
   */
  private async ensureToken (): Promise<void> {
    const now = Date.now()
    // 提前5分钟刷新token
    if (!this.appAccessToken || now >= this.tokenExpireTime - 5 * 60 * 1000) {
      await this.getAppAccessToken()
    }
  }

  /**
   * 获取app_access_token
   * 响应格式：{ "code": "ok", "data": { "app_access_token": "xxx", "expire": 7200 } }
   */
  async getAppAccessToken (): Promise<string> {
    try {
      // 计算app_secret的md5值并转为小写
      const md5Secret = crypto.createHash('md5').update(this.appSecret).digest('hex').toLowerCase()

      const response = await axios.post<ApiResponse<TokenResponse>>(
        `${this.apiBaseUrl}/api/v1/auth/app_access_token`,
        {
          app_key: this.appKey,
          app_secret: md5Secret,
        },
        {
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
          },
        },
      )

      log.verbose('Bridge', 'getAppAccessToken response: %s', JSON.stringify(response.data, null, 2))

      // 如流 API 响应格式：{ code: "ok", data: { app_access_token: "xxx", expire: 7200 } }
      if (response.data.code === 'ok' && response.data.data) {
        const tokenData = response.data.data
        this.appAccessToken = tokenData.app_access_token
        this.tokenExpireTime = Date.now() + tokenData.expire * 1000
        log.verbose('Bridge', 'getAppAccessToken success, token: %s, expire in %s seconds',
          this.appAccessToken.substring(0, 10) + '...', tokenData.expire)
        return this.appAccessToken
      } else {
        const errorMsg = response.data.errmsg || (response.data.data as any)?.errmsg || 'unknown error'
        throw new Error(`Failed to get token: code=${response.data.code}, error=${errorMsg}`)
      }
    } catch (error: any) {
      log.error('Bridge', 'getAppAccessToken error: %s', error.message)
      if (error.response) {
        log.error('Bridge', 'getAppAccessToken error response: %s', JSON.stringify(error.response.data, null, 2))
      }
      throw error
    }
  }

  /**
   * 发送单聊文本消息
   * 兼容 BridgeInterface: messageSendText(wxid: string, text: string)
   */
  async messageSendText (wxid: string, text: string): Promise<void> {
    try {
      const response = await this.httpClient.post<ApiResponse>('/api/v1/app/message/send', {
        touser: wxid,
        msgtype: 'text',
        text: {
          content: text,
        },
      })

      // 如流 API 响应是嵌套的
      const result = response.data.data || response.data
      const isSuccess = response.data.code === 'ok' || result.errcode === 0

      if (!isSuccess) {
        throw new Error(`Failed to send message: ${result.errmsg || 'unknown error'}`)
      }
    } catch (error: any) {
      log.error('Bridge', 'messageSendText error: %s', error.message)
      throw error
    }
  }

  /**
   * 发送单聊图片消息
   */
  async messageSendPicture (touser: string, imageBase64: string): Promise<string> {
    try {
      const response = await this.httpClient.post<ApiResponse>('/api/v1/app/message/send', {
        touser,
        msgtype: 'image',
        image: {
          content: imageBase64,
        },
      })

      // 如流 API 响应是嵌套的
      const result = response.data.data || response.data
      const isSuccess = response.data.code === 'ok' || result.errcode === 0

      if (isSuccess && result.msgkey) {
        return String(result.msgkey)
      } else if (isSuccess) {
        return '' // 成功但没有 msgkey
      } else {
        throw new Error(`Failed to send image: ${result.errmsg || 'unknown error'}`)
      }
    } catch (error: any) {
      log.error('Bridge', 'messageSendPicture error: %s', error.message)
      throw error
    }
  }

  /**
   * 发送单聊文本消息（返回msgkey，用于撤回）
   */
  async messageSendTextWithKey (touser: string, text: string): Promise<string> {
    try {
      log.verbose('Bridge', 'messageSendTextWithKey: sending message to %s, text: %s', touser, text)

      const response = await this.httpClient.post<ApiResponse>('/api/v1/app/message/send', {
        touser,
        msgtype: 'text',
        text: {
          content: text,
        },
      })

      // 打印完整的响应数据用于调试
      log.verbose('Bridge', 'messageSendTextWithKey response: %s', JSON.stringify(response.data, null, 2))

      // 如流 API 响应是嵌套的：{ code: "ok", data: { errcode: 0, errmsg: "ok", msgkey: "..." } }
      const result = response.data.data || response.data

      log.verbose('Bridge', 'result.errcode: %s', result.errcode)
      log.verbose('Bridge', 'result.errmsg: %s', result.errmsg)
      log.verbose('Bridge', 'result.msgkey: %s', result.msgkey)

      // 检查外层 code 或内层 errcode
      const isSuccess = response.data.code === 'ok' || result.errcode === 0

      if (isSuccess) {
        // 如果有 msgkey，返回它；否则返回空字符串（表示无法撤回）
        const msgkey = result.msgkey
        if (msgkey) {
          log.info('Bridge', '✓ 单聊消息发送成功 - touser: %s, msgkey: %s', touser, msgkey)
          return String(msgkey) // 转为字符串，因为可能是数字
        } else {
          log.info('Bridge', '✓ 单聊消息发送成功 - touser: %s (无msgkey，无法撤回)', touser)
          return '' // 返回空字符串，表示消息发送成功但无法撤回
        }
      } else {
        const errorMsg = `Failed to send message: errcode=${result.errcode}, errmsg=${result.errmsg || 'unknown error'}`
        log.error('Bridge', '✗ 单聊消息发送失败 - touser: %s, error: %s', touser, errorMsg)
        throw new Error(errorMsg)
      }
    } catch (error: any) {
      log.error('Bridge', 'messageSendTextWithKey error: %s', error.message)
      if (error.response) {
        log.error('Bridge', 'messageSendTextWithKey error response status: %s', error.response.status)
        log.error('Bridge', 'messageSendTextWithKey error response data: %s', JSON.stringify(error.response.data, null, 2))
      }
      throw error
    }
  }

  /**
   * 发送群聊文本消息
   */
  async messageSendTextToGroup (groupId: number, text: string): Promise<GroupMessageResponse> {
    try {
      const clientmsgid = Date.now()
      const response = await this.httpClient.post<ApiResponse<{ data: GroupMessageResponse }>>(
        '/api/v1/robot/msg/groupmsgsend',
        {
          message: {
            header: {
              toid: groupId,
              totype: 'GROUP',
              msgtype: 'TEXT',
              clientmsgid,
              role: 'robot',
            },
            body: [
              {
                type: 'TEXT',
                content: text,
              },
            ],
          },
        },
      )

      // 打印完整的响应数据用于调试
      log.info('Bridge', '==================== messageSendTextToGroup 响应开始 ====================')
      log.info('Bridge', 'response.status: %s', response.status)
      log.info('Bridge', 'response.data (完整): %s', JSON.stringify(response.data, null, 2))
      log.info('Bridge', 'response.data.code: %s', response.data.code)
      log.info('Bridge', 'response.data.errcode: %s', response.data.errcode)
      log.info('Bridge', 'response.data.data: %s', JSON.stringify(response.data.data, null, 2))
      if (response.data.data) {
        log.info('Bridge', 'response.data.data.errcode: %s', (response.data.data as any).errcode)
        log.info('Bridge', 'response.data.data.data: %s', JSON.stringify((response.data.data as any).data, null, 2))
      }
      log.info('Bridge', '==================== messageSendTextToGroup 响应结束 ====================')

      // 如流群聊 API 响应是三层嵌套：{ code: "ok", data: { errcode: 0, data: { messageid, msgseqid, ctime } } }
      if (response.data.code !== 'ok' || !response.data.data) {
        throw new Error(`Failed to send group message: code=${response.data.code}, error=${response.data.errmsg || 'unknown error'}`)
      }

      // 第二层：response.data.data = { errcode: 0, errmsg: "ok", data: {...} }
      const innerData = response.data.data
      if ((innerData as any).errcode !== 0) {
        const errorMsg = `Failed to send group message: errcode=${(innerData as any).errcode}, errmsg=${(innerData as any).errmsg || 'unknown error'}`
        log.error('Bridge', '✗ 群聊消息发送失败 - groupId: %s, error: %s', groupId, errorMsg)
        throw new Error(errorMsg)
      }

      // 第三层：innerData.data = { messageid, msgseqid, ctime }
      const msgData = (innerData as any).data
      log.info('Bridge', '✓ 群聊消息发送成功 - groupId: %s, messageid: %s, msgseqid: %s',
        groupId, msgData.messageid, msgData.msgseqid)
      return msgData
    } catch (error: any) {
      log.error('Bridge', 'messageSendTextToGroup error: %s', error.message)
      throw error
    }
  }

  /**
   * 发送群聊@消息
   */
  async messageSendTextAt (
    groupId: number,
    text: string,
    atUserIds: string[],
  ): Promise<GroupMessageResponse> {
    try {
      const clientmsgid = Date.now()
      const body: any[] = [
        {
          type: 'TEXT',
          content: text,
        },
      ]

      if (atUserIds.length > 0) {
        body.push({
          type: 'AT',
          atall: false,
          atuserids: atUserIds,
        })
      }

      const response = await this.httpClient.post<ApiResponse<{ data: GroupMessageResponse }>>(
        '/api/v1/robot/msg/groupmsgsend',
        {
          message: {
            header: {
              toid: groupId,
              totype: 'GROUP',
              msgtype: 'TEXT',
              clientmsgid,
              role: 'robot',
            },
            body,
          },
        },
      )

      // 打印完整的响应数据用于调试
      log.verbose('Bridge', 'messageSendTextAt response: %s', JSON.stringify(response.data, null, 2))

      // 如流群聊 API 响应是三层嵌套：{ code: "ok", data: { errcode: 0, data: { messageid, msgseqid, ctime } } }
      if (response.data.code !== 'ok' || !response.data.data) {
        throw new Error(`Failed to send group @ message: code=${response.data.code}, error=${response.data.errmsg || 'unknown error'}`)
      }

      // 第二层：response.data.data = { errcode: 0, errmsg: "ok", data: {...} }
      const innerData = response.data.data
      if ((innerData as any).errcode !== 0) {
        const errorMsg = `Failed to send group @ message: errcode=${(innerData as any).errcode}, errmsg=${(innerData as any).errmsg || 'unknown error'}`
        log.error('Bridge', '✗ 群聊@消息发送失败 - groupId: %s, atUsers: %s, error: %s',
          groupId, atUserIds.join(','), errorMsg)
        throw new Error(errorMsg)
      }

      // 第三层：innerData.data = { messageid, msgseqid, ctime }
      const msgData = (innerData as any).data
      log.info('Bridge', '✓ 群聊@消息发送成功 - groupId: %s, atUsers: %s, messageid: %s, msgseqid: %s',
        groupId, atUserIds.join(','), msgData.messageid, msgData.msgseqid)
      return msgData
    } catch (error: any) {
      log.error('Bridge', 'messageSendTextAt error: %s', error.message)
      throw error
    }
  }

  /**
   * 发送群聊图片消息
   */
  async messageSendPictureToGroup (groupId: number, imageBase64: string): Promise<GroupMessageResponse> {
    try {
      const clientmsgid = Date.now()
      const response = await this.httpClient.post<ApiResponse<{ data: GroupMessageResponse }>>(
        '/api/v1/robot/msg/groupmsgsend',
        {
          message: {
            header: {
              toid: groupId,
              totype: 'GROUP',
              msgtype: 'IMAGE',
              clientmsgid,
              role: 'robot',
            },
            body: [
              {
                type: 'IMAGE',
                content: imageBase64,
              },
            ],
          },
        },
      )

      // 打印完整的响应数据用于调试
      log.verbose('Bridge', 'messageSendPictureToGroup response: %s', JSON.stringify(response.data, null, 2))

      // 如流群聊 API 响应是三层嵌套：{ code: "ok", data: { errcode: 0, data: { messageid, msgseqid, ctime } } }
      if (response.data.code !== 'ok' || !response.data.data) {
        throw new Error(`Failed to send group image: code=${response.data.code}, error=${response.data.errmsg || 'unknown error'}`)
      }

      // 第二层：response.data.data = { errcode: 0, errmsg: "ok", data: {...} }
      const innerData = response.data.data
      if ((innerData as any).errcode !== 0) {
        const errorMsg = `Failed to send group image: errcode=${(innerData as any).errcode}, errmsg=${(innerData as any).errmsg || 'unknown error'}`
        log.error('Bridge', '✗ 群聊图片发送失败 - groupId: %s, error: %s', groupId, errorMsg)
        throw new Error(errorMsg)
      }

      // 第三层：innerData.data = { messageid, msgseqid, ctime }
      const msgData = (innerData as any).data
      log.info('Bridge', '✓ 群聊图片发送成功 - groupId: %s, messageid: %s, msgseqid: %s',
        groupId, msgData.messageid, msgData.msgseqid)
      return msgData
    } catch (error: any) {
      log.error('Bridge', 'messageSendPictureToGroup error: %s', error.message)
      throw error
    }
  }

  /**
   * 发送群聊链接消息
   */
  async messageSendUrlToGroup (groupId: number, url: string): Promise<GroupMessageResponse> {
    try {
      const clientmsgid = Date.now()
      const response = await this.httpClient.post<ApiResponse<{ data: GroupMessageResponse }>>(
        '/api/v1/robot/msg/groupmsgsend',
        {
          message: {
            header: {
              toid: groupId,
              totype: 'GROUP',
              msgtype: 'TEXT',
              clientmsgid,
              role: 'robot',
            },
            body: [
              {
                type: 'LINK',
                href: url,
              },
            ],
          },
        },
      )

      // 打印完整的响应数据用于调试
      log.verbose('Bridge', 'messageSendUrlToGroup response: %s', JSON.stringify(response.data, null, 2))

      // 如流群聊 API 响应是三层嵌套：{ code: "ok", data: { errcode: 0, data: { messageid, msgseqid, ctime } } }
      if (response.data.code !== 'ok' || !response.data.data) {
        throw new Error(`Failed to send group url: code=${response.data.code}, error=${response.data.errmsg || 'unknown error'}`)
      }

      // 第二层：response.data.data = { errcode: 0, errmsg: "ok", data: {...} }
      const innerData = response.data.data
      if ((innerData as any).errcode !== 0) {
        const errorMsg = `Failed to send group url: errcode=${(innerData as any).errcode}, errmsg=${(innerData as any).errmsg || 'unknown error'}`
        log.error('Bridge', '✗ 群聊链接发送失败 - groupId: %s, url: %s, error: %s', groupId, url, errorMsg)
        throw new Error(errorMsg)
      }

      // 第三层：innerData.data = { messageid, msgseqid, ctime }
      const msgData = (innerData as any).data
      log.info('Bridge', '✓ 群聊链接发送成功 - groupId: %s, url: %s, messageid: %s, msgseqid: %s',
        groupId, url, msgData.messageid, msgData.msgseqid)
      return msgData
    } catch (error: any) {
      log.error('Bridge', 'messageSendUrlToGroup error: %s', error.message)
      throw error
    }
  }

  /**
   * 撤回单聊消息
   * 响应格式：{ "errcode": 0, "errmsg": "ok" }
   */
  async messageRecallSingle (msgkey: string): Promise<void> {
    try {
      if (!this.agentId) {
        throw new Error('agentId is required for recalling single chat message')
      }

      const response = await this.httpClient.post<ApiResponse>('/api/v1/app/message/revoke', {
        msgkey,
        agentid: this.agentId,
      })

      // 打印响应数据用于调试
      log.verbose('Bridge', 'messageRecallSingle response: %s', JSON.stringify(response.data, null, 2))

      // 单聊撤回响应格式：{ "errcode": 0, "errmsg": "ok" }（非嵌套）
      if (response.data.errcode !== 0) {
        const errorMsg = `Failed to recall message: errcode=${response.data.errcode}, errmsg=${response.data.errmsg || 'unknown error'}`
        log.error('Bridge', '✗ 单聊消息撤回失败 - msgkey: %s, error: %s', msgkey, errorMsg)
        throw new Error(errorMsg)
      }

      log.info('Bridge', '✓ 单聊消息撤回成功 - msgkey: %s', msgkey)
    } catch (error: any) {
      log.error('Bridge', 'messageRecallSingle error: %s', error.message)
      throw error
    }
  }

  /**
   * 撤回群聊消息
   * 响应格式：{ "errcode": 0, "errmsg": "ok" }
   */
  async messageRecallGroup (
    groupId: number,
    messageid: number,
    msgseqid: number,
  ): Promise<void> {
    try {
      const response = await this.httpClient.post<ApiResponse>('/api/v1/robot/group/msgRecall', {
        groupId,
        messageid,
        msgseqid,
      })

      // 打印响应数据用于调试
      log.verbose('Bridge', 'messageRecallGroup response: %s', JSON.stringify(response.data, null, 2))

      // 群聊撤回响应格式：{ "errcode": 0, "errmsg": "ok" }（非嵌套）
      if (response.data.errcode !== 0) {
        const errorMsg = `Failed to recall group message: errcode=${response.data.errcode}, errmsg=${response.data.errmsg || 'unknown error'}`
        log.error('Bridge', '✗ 群聊消息撤回失败 - groupId: %s, messageid: %s, error: %s',
          groupId, messageid, errorMsg)
        throw new Error(errorMsg)
      }

      log.info('Bridge', '✓ 群聊消息撤回成功 - groupId: %s, messageid: %s, msgseqid: %s',
        groupId, messageid, msgseqid)
    } catch (error: any) {
      log.error('Bridge', 'messageRecallGroup error: %s', error.message)
      throw error
    }
  }

  /**
   * 获取群成员列表
   * 响应格式：{ "errcode": 0, "errmsg": "ok", "data": { "userInfoList": [...], "agentInfoList": [...] } }
   */
  async getRoomMemberList (groupId: number, recallType: number = 0): Promise<RoomMemberResponse> {
    try {
      const response = await this.httpClient.post<ApiResponse<RoomMemberResponse>>(
        '/api/v1/robot/group/memberList',
        {
          groupId,
          recallType,
        },
      )

      // 群成员列表响应是非嵌套的
      if (response.data.errcode === 0 && response.data.data) {
        log.verbose('Bridge', 'getRoomMemberList success, groupId: %s, memberCount: %s',
          groupId, response.data.data.userInfoList.length || 0)
        return response.data.data
      } else {
        throw new Error(`Failed to get room member list: errcode=${response.data.errcode}, errmsg=${response.data.errmsg || 'unknown error'}`)
      }
    } catch (error: any) {
      log.error('Bridge', 'getRoomMemberList error: %s', error.message)
      throw error
    }
  }

  /**
   * 登录（如流机器人不需要登录，直接返回成功）
   */
  async login (): Promise<void> {
    log.verbose('Bridge', 'login() - 如流机器人无需登录')
    await this.ensureToken()
    this.emit('login')
    this.emit('ready')
  }

  /**
   * 登出
   */
  async logout (): Promise<void> {
    log.verbose('Bridge', 'logout()')
    this.appAccessToken = null
    this.tokenExpireTime = 0
    this.emit('logout')
  }

  /**
   * 检查在线状态
   */
  async checkOnline (): Promise<boolean> {
    try {
      await this.ensureToken()
      return !!this.appAccessToken
    } catch {
      return false
    }
  }

  /**
   * 设置回调地址（暂不支持）
   */
  async setCallback (url: string): Promise<void> {
    log.warn('Bridge', 'setCallback not supported for hi robot')
  }

  /**
   * 设置回调主机（暂不支持）
   */
  async setCallbackHost (host: string): Promise<void> {
    log.warn('Bridge', 'setCallbackHost not supported for hi robot')
  }

  /**
   * 获取联系人列表（暂不支持）
   */
  async loadContactList (): Promise<{ message: string; contactList: { [k: string]: any } }> {
    log.warn('Bridge', 'loadContactList not supported for hi robot')
    return {
      message: 'not supported',
      contactList: {},
    }
  }

  /**
   * 获取群列表（暂不支持）
   */
  async loadRoomList (): Promise<{ message: string; roomList: { [k: string]: any } }> {
    log.warn('Bridge', 'loadRoomList not supported for hi robot')
    return {
      message: 'not supported',
      roomList: {},
    }
  }

  /**
   * 获取群成员昵称（暂不支持，使用getRoomMemberList代替）
   */
  async getMemberNickName (wxid: string, roomid: string | number): Promise<{ content: string }> {
    log.warn('Bridge', 'getMemberNickName not supported, use getRoomMemberList instead')
    return { content: JSON.stringify({ nick: wxid }) }
  }

  /**
   * 重连（如流机器人不需要重连）
   */
  async reconnection (): Promise<void> {
    log.verbose('Bridge', 'reconnection() - 如流机器人无需重连')
    await this.ensureToken()
  }

  /**
   * 获取二维码（如流机器人不需要二维码）
   */
  async contactSelfQRCode (): Promise<string> {
    log.verbose('Bridge', 'contactSelfQRCode() - 如流机器人无需二维码')
    return ''
  }

  /**
   * 发送联系人（暂不支持）
   */
  async messageSendContact (
    wxid: string,
    contactId: string,
  ): Promise<void> {
    log.warn('Bridge', 'messageSendContact not supported for hi robot')
    throw new Error('messageSendContact not supported')
  }

  /**
   * 发送链接（单聊）
   */
  async messageSendUrl (
    wxid: string,
    urlLinkPayload: any,
  ): Promise<void> {
    log.warn('Bridge', 'messageSendUrl for single chat not supported, use group chat instead')
    throw new Error('messageSendUrl for single chat not supported')
  }

  /**
   * 发送小程序（暂不支持）
   */
  async messageSendMiniProgram (
    wxid: string,
    miniProgramPayload: any,
  ): Promise<void> {
    log.warn('Bridge', 'messageSendMiniProgram not supported for hi robot')
    throw new Error('messageSendMiniProgram not supported')
  }

  /**
   * 发送位置（暂不支持）
   */
  async messageSendLocation (
    wxid: string,
    locationPayload: any,
  ): Promise<void | string> {
    log.warn('Bridge', 'messageSendLocation not supported for hi robot')
    throw new Error('messageSendLocation not supported')
  }

  /**
   * 转发消息（暂不支持）
   */
  async messageForward (
    wxid: string,
    messageId: string,
    messageType: number,
  ): Promise<void> {
    log.warn('Bridge', 'messageForward not supported for hi robot')
    throw new Error('messageForward not supported')
  }

}

export { Bridge }
export default Bridge
