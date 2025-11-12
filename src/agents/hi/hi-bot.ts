/* eslint-disable camelcase */
/* eslint-disable sort-keys */
import axios, { type AxiosInstance } from 'axios'
import { EventEmitter } from 'events'
import { log } from 'wechaty-puppet'
import crypto from 'crypto'
import mqtt, { type MqttClient } from 'mqtt'

// hiAPI响应类型
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
  // MQTT 客户端
  private mqttClient?: MqttClient
  private mqttBrokerUrl?: string
  private mqttUsername?: string
  private mqttPassword?: string
  private mqttTopic?: string

  constructor (options: {
    appKey: string
    appSecret: string
    apiBaseUrl: string
    agentId?: number
    selfId: string
    selfName: string
    // MQTT 配置
    mqttBrokerUrl?: string
    mqttUsername?: string
    mqttPassword?: string
    mqttTopic?: string
  }) {
    super()
    this.appKey = options.appKey
    this.appSecret = options.appSecret
    this.apiBaseUrl = options.apiBaseUrl
    this.agentId = options.agentId
    this.selfId = options.selfId
    this.mqttBrokerUrl = options.mqttBrokerUrl
    this.mqttUsername = options.mqttUsername
    this.mqttPassword = options.mqttPassword
    this.mqttTopic = options.mqttTopic

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

      // hi API 响应格式：{ code: "ok", data: { app_access_token: "xxx", expire: 7200 } }
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

      // hi API 响应是嵌套的
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

      // hi API 响应是嵌套的
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

      // hi API 响应是嵌套的：{ code: "ok", data: { errcode: 0, errmsg: "ok", msgkey: "..." } }
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

      // hi群聊 API 响应是三层嵌套：{ code: "ok", data: { errcode: 0, data: { messageid, msgseqid, ctime } } }
      log.verbose('Bridge', 'messageSendTextToGroup response: %s', JSON.stringify(response.data, null, 2))
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

      // hi群聊 API 响应是三层嵌套：{ code: "ok", data: { errcode: 0, data: { messageid, msgseqid, ctime } } }
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

      // hi群聊 API 响应是三层嵌套：{ code: "ok", data: { errcode: 0, data: { messageid, msgseqid, ctime } } }
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

      // hi群聊 API 响应是三层嵌套：{ code: "ok", data: { errcode: 0, data: { messageid, msgseqid, ctime } } }
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
   * 初始化 MQTT 连接
   */
  private initMqtt (): void {
    if (!this.mqttBrokerUrl || !this.mqttTopic) {
      log.warn('Bridge', 'MQTT not configured, message receiving disabled')
      return
    }

    try {
      // 确保 broker URL 有协议前缀
      let brokerUrl = this.mqttBrokerUrl
      if (!brokerUrl.startsWith('mqtt://') && !brokerUrl.startsWith('mqtts://') && !brokerUrl.startsWith('ws://') && !brokerUrl.startsWith('wss://')) {
        brokerUrl = `mqtt://${brokerUrl}`
        log.info('Bridge', 'Added mqtt:// prefix to broker URL: %s', brokerUrl)
      }

      log.info('Bridge', 'Initializing MQTT connection to %s', brokerUrl)
      log.info('Bridge', 'MQTT config: username=%s, topic=%s', this.mqttUsername || 'N/A', this.mqttTopic)

      const connectOptions: mqtt.IClientOptions = {
        clientId: `hi-robot-${this.selfId}-${Date.now()}`,
        clean: true,
        reconnectPeriod: 5000,
      }

      if (this.mqttUsername) {
        connectOptions.username = this.mqttUsername
      }
      if (this.mqttPassword) {
        connectOptions.password = this.mqttPassword
      }

      this.mqttClient = mqtt.connect(brokerUrl, connectOptions)
    } catch (error: any) {
      log.error('Bridge', '✗ Failed to initialize MQTT: %s', error.message)
      return
    }

    this.mqttClient.on('connect', () => {
      try {
        log.info('Bridge', '✓ MQTT connected successfully')
        if (this.mqttClient && this.mqttTopic) {
          this.mqttClient.subscribe(this.mqttTopic, (err) => {
            try {
              if (err) {
                log.error('Bridge', '✗ Failed to subscribe to topic %s: %s', this.mqttTopic, err.message)
              } else {
                log.info('Bridge', '✓ Subscribed to MQTT topic: %s', this.mqttTopic)
              }
            } catch (logError) {
              console.error('MQTT subscribe callback error:', logError)
            }
          })
        }
      } catch (error) {
        console.error('MQTT connect event error:', error)
      }
    })

    this.mqttClient.on('message', (topic, message) => {
      try {
        const messageStr = message.toString()
        log.info('Bridge', '==================== MQTT 消息接收开始 ====================')
        log.info('Bridge', 'MQTT topic: %s', topic)
        log.info('Bridge', 'MQTT message (raw): %s', messageStr)
        log.info('Bridge', 'MQTT message length: %s bytes', message.length)

        try {
          log.info('Bridge', '==================== MQTT 消息接收开始 ====================')
          log.info('Bridge', 'MQTT topic: %s', topic)
          log.info('Bridge', 'MQTT message (raw): %s', messageStr)
          log.info('Bridge', 'MQTT message length: %s bytes', message.length)
        } catch (logError) {
          log.error('Bridge', 'Log error, using console instead: %s', logError)
        }

        // 解析消息
        const messageData = JSON.parse(messageStr)
        log.info('Bridge', 'MQTT message (parsed): %s', JSON.stringify(messageData, null, 2))
        log.info('Bridge', '==================== MQTT 消息接收结束 ====================')

        try {
          log.info('Bridge', 'MQTT message (parsed): %s', JSON.stringify(messageData, null, 2))
          log.info('Bridge', '==================== MQTT 消息接收结束 ====================')
        } catch (logError) {
          log.error('Bridge', 'Log error in message handler: %s', logError)
        }

        this.handleMqttMessage(messageData)
      } catch (error: any) {
        log.error('Bridge', '✗ Error parsing MQTT message: %s', error.message)
        log.error('Bridge', 'Raw message that failed to parse: %s', message.toString())
      }
    })

    this.mqttClient.on('error', (error) => {
      log.error('Bridge', '✗ MQTT error: %s', error.message || error.toString())
      log.error('Bridge', 'MQTT error details: %s', error)
      // 不触发 error 事件，避免中断程序
    })

    this.mqttClient.on('close', () => {
      log.info('Bridge', 'MQTT connection closed')
      try {
        log.warn('Bridge', 'MQTT connection closed')
      } catch (e) {
        // ignore
      }
    })

    this.mqttClient.on('reconnect', () => {
      log.info('Bridge', 'MQTT reconnecting...')
      try {
        log.info('Bridge', 'MQTT reconnecting...')
      } catch (e) {
        // ignore
      }
    })
  }

  /**
   * 处理 MQTT 接收到的消息
   */
  private handleMqttMessage (messageData: any): void {
    log.info('Bridge', '========== handleMqttMessage 开始处理 ==========')
    log.info('Bridge', 'Message Data Type: %s', typeof messageData)
    log.info('Bridge', 'Message Data Keys: %s', Object.keys(messageData).join(', '))

    if (messageData.header) {
      log.info('Bridge', 'Header: %s', JSON.stringify(messageData.header, null, 2))
      log.info('Bridge', '  - fromuserid: %s', messageData.header.fromuserid)
      log.info('Bridge', '  - toid: %s', messageData.header.toid)
      log.info('Bridge', '  - totype: %s', messageData.header.totype)
      log.info('Bridge', '  - msgtype: %s', messageData.header.msgtype)
      log.info('Bridge', '  - messageid: %s', messageData.header.messageid)
    }

    if (messageData.body) {
      log.info('Bridge', 'Body (%s items): %s', messageData.body.length, JSON.stringify(messageData.body, null, 2))
    }

    log.info('Bridge', '========== handleMqttMessage 触发事件 ==========')

    // 触发 message 事件，由 puppet 层处理
    this.emit('message', messageData)
  }

  /**
   * 登录（hi机器人不需要登录，直接返回成功）
   */
  async login (): Promise<void> {
    log.verbose('Bridge', 'login() - hi机器人无需登录')
    await this.ensureToken()

    // 初始化 MQTT 连接
    this.initMqtt()

    this.emit('login')
    this.emit('ready')
  }

  /**
   * 登出
   */
  async logout (): Promise<void> {
    log.verbose('Bridge', 'logout()')

    // 断开 MQTT 连接
    if (this.mqttClient) {
      try {
        this.mqttClient.end(false, () => {
          log.info('Bridge', 'MQTT client closed')
        })
        this.mqttClient = undefined
      } catch (error: any) {
        log.error('Bridge', 'Error closing MQTT client: %s', error.message)
      }
    }

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
  async setCallback (_url: string): Promise<void> {
    log.warn('Bridge', 'setCallback not supported for hi robot')
  }

  /**
   * 设置回调主机（暂不支持）
   */
  async setCallbackHost (_host: string): Promise<void> {
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
  async getMemberNickName (wxid: string, _roomid: string | number): Promise<{ content: string }> {
    log.warn('Bridge', 'getMemberNickName not supported, use getRoomMemberList instead')
    return { content: JSON.stringify({ nick: wxid }) }
  }

  /**
   * 重连（hi机器人不需要重连）
   */
  async reconnection (): Promise<void> {
    log.verbose('Bridge', 'reconnection() - hi机器人无需重连')
    await this.ensureToken()
  }

  /**
   * 获取二维码（hi机器人不需要二维码）
   */
  async contactSelfQRCode (): Promise<string> {
    log.verbose('Bridge', 'contactSelfQRCode() - hi机器人无需二维码')
    return ''
  }

  /**
   * 发送联系人（暂不支持）
   */
  async messageSendContact (
    _wxid: string,
    _contactId: string,
  ): Promise<void> {
    log.warn('Bridge', 'messageSendContact not supported for hi robot')
    throw new Error('messageSendContact not supported')
  }

  /**
   * 发送链接（单聊）
   */
  async messageSendUrl (
    _wxid: string,
    _urlLinkPayload: any,
  ): Promise<void> {
    log.warn('Bridge', 'messageSendUrl for single chat not supported, use group chat instead')
    throw new Error('messageSendUrl for single chat not supported')
  }

  /**
   * 发送小程序（暂不支持）
   */
  async messageSendMiniProgram (
    _wxid: string,
    _miniProgramPayload: any,
  ): Promise<void> {
    log.warn('Bridge', 'messageSendMiniProgram not supported for hi robot')
    throw new Error('messageSendMiniProgram not supported')
  }

  /**
   * 发送位置（暂不支持）
   */
  async messageSendLocation (
    _wxid: string,
    _locationPayload: any,
  ): Promise<void | string> {
    log.warn('Bridge', 'messageSendLocation not supported for hi robot')
    throw new Error('messageSendLocation not supported')
  }

  /**
   * 转发消息（暂不支持）
   */
  async messageForward (
    _wxid: string,
    _messageId: string,
    _messageType: number,
  ): Promise<void> {
    log.warn('Bridge', 'messageForward not supported for hi robot')
    throw new Error('messageForward not supported')
  }

}

export { Bridge }
export default Bridge
