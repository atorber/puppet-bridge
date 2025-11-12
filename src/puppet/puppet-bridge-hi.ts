/* eslint-disable no-console */
// import cuid from 'cuid'
// import path from 'path'
// import fs from 'fs'
// import xml2js from 'xml2js'
// import readXml from 'xmlreader'

import * as PUPPET from 'wechaty-puppet'
import { log } from 'wechaty-puppet'
import type {
  FileBoxInterface,
} from 'file-box'
import {
  FileBox,
  // FileBoxType,
} from 'file-box'

import {
  CHATIE_OFFICIAL_ACCOUNT_QRCODE,
  qrCodeForChatie,
  VERSION,
} from '../config.js'

import {
  Bridge,
  MessageRaw,
  // ContentRaw,
} from '../agents/hi/hi-bot.js'

// 存储消息ID和撤回信息
interface MessageRecallInfo {
  msgkey?: string  // 单聊消息的msgkey
  groupId?: number  // 群聊消息的groupId
  messageid?: number  // 群聊消息的messageid
  msgseqid?: number  // 群聊消息的msgseqid
}

export type PuppetBridgeOptions = PUPPET.PuppetOptions & {
  appKey: string  // 如流应用 app_key
  appSecret: string  // 如流应用 app_secret
  apiBaseUrl: string  // API基础地址，如：http://xxx.com
  agentId?: number  // 机器人ID（撤回单聊消息时需要）
  selfId: string  // 机器人ID
  selfName: string  // 机器人名称
}

class PuppetBridge extends PUPPET.Puppet {

  static override readonly VERSION = VERSION

  private messageStore: { [k: string]: PUPPET.payloads.Message }

  private roomStore: { [k: string]: PUPPET.payloads.Room }

  private contactStore: { [k: string]: PUPPET.payloads.Contact }

  private scanEventData?: PUPPET.payloads.EventScan

  private selfInfo: PUPPET.payloads.Contact

  private bridge: Bridge

  // 存储消息ID和撤回信息的映射
  private messageRecallMap: { [messageId: string]: MessageRecallInfo } = {}

  constructor (
    public override options: PuppetBridgeOptions,
  ) {
    const missingParams: string[] = []
    if (!options.appKey || options.appKey.trim() === '') {
      missingParams.push('appKey')
    }
    if (!options.appSecret || options.appSecret.trim() === '') {
      missingParams.push('appSecret')
    }
    if (!options.apiBaseUrl || options.apiBaseUrl.trim() === '') {
      missingParams.push('apiBaseUrl')
    }
    if (missingParams.length > 0) {
      throw new Error(`Missing required parameters: ${missingParams.join(', ')}. Please set environment variables: HI_APP_KEY, HI_APP_SECRET, HI_API_BASE_URL`)
    }

    log.info('options...', JSON.stringify({ ...options, appSecret: '***' }))
    super(options)
    log.verbose('PuppetBridge', 'constructor initialized')

    this.bridge = new Bridge({
      agentId: options.agentId,
      apiBaseUrl: options.apiBaseUrl,
      appKey: options.appKey,
      appSecret: options.appSecret,
      selfId: options.selfId,
      selfName: options.selfName,
    })

    // FIXME: use LRU cache for message store so that we can reduce memory usage
    this.messageStore = {}
    this.roomStore = {}
    this.contactStore = {}
    this.selfInfo = {
      alias: '',
      avatar: '',
      gender: PUPPET.types.ContactGender.Unknown,
      id: options.selfId,
      name: options.selfName,
      phone: [],
      type: PUPPET.types.Contact.Individual,
    }
  }

  override version () {
    return VERSION
  }

  async onStart () {
    log.verbose('PuppetBridge', 'onStart()')

    // 如流机器人不需要扫码，直接触发scan事件
    this.scanEventData = {
      qrcode: '',
      status: PUPPET.types.ScanStatus.Unknown,
    }
    this.emit('scan', this.scanEventData)

    // 监听Bridge事件
    this.bridge.on('login', () => {
      this.onLogin().catch(e => {
        log.error('onLogin fail:', e)
      })
    })

    this.bridge.on('ready', () => {
      this.onAgentReady().catch(e => {
        log.error('onAgentReady fail:', e)
      })
    })

    this.bridge.on('logout', () => {
      void this.onLogout(0).catch(e => {
        log.error('onLogout fail:', e)
      })
    })

    this.bridge.on('error', e => {
      try {
        this.emit('error', { data: JSON.stringify(e as any) })
      } catch (e) {
        log.error('emit error fail:', e)
      }
    })

    // 如流机器人自动登录（获取token）
    await this.bridge.login()
  }

  private async onAgentReady () {
    log.verbose('PuppetBridge', 'onAgentReady()')
  }

  private async onLogin () {
    log.verbose('PuppetBridge', 'onLogin()')
    if (!this.isLoggedIn) {
      // 如流机器人不需要获取联系人列表，直接登录
      await super.login(this.selfInfo.id)
      await this.onAgentReady()
    } else {
      log.info('已处于登录状态，无需再次登录')
    }
  }

  private async onLogout (reasonNum: number) {
    await super.logout(reasonNum ? 'Kicked by server' : 'logout')
  }

  async onStop () {
    log.verbose('PuppetBridge', 'onStop()')
    if (this.logonoff()) {
      await this.bridge.logout()
      await this.logout()
    }
  }

  override login (contactId: string): void {
    log.verbose('PuppetBridge', 'login()')
    super.login(contactId)
  }

  override ding (data?: string): void {
    log.silly('PuppetBridge', 'ding(%s)', data || '')
    setTimeout(() => this.emit('dong', { data: data || '' }), 1000)
  }

  notSupported (name: string): void {
    log.info(`${name} is not supported by PuppetBridge yet.`)
  }

  /**
   * 判断conversationId是单聊还是群聊
   * 群聊ID是数字，单聊ID是字符串（uuapName）
   */
  private isGroupChat (conversationId: string): boolean {
    // 如果conversationId是纯数字，则是群聊
    return /^\d+$/.test(conversationId)
  }

  /**
   * 获取群成员列表（如流机器人支持）
   */
  private async loadRoomMemberList (groupId: number): Promise<void> {
    try {
      const memberList = await this.bridge.getRoomMemberList(groupId)
      const roomId = groupId.toString()

      // 更新roomStore
      if (!this.roomStore[roomId]) {
        this.roomStore[roomId] = {
          adminIdList: [],
          avatar: '',
          external: false,
          id: roomId,
          memberIdList: [],
          ownerId: '',
          topic: `Group ${groupId}`,
        }
      }

      const memberIdList: string[] = []
      // userInfoList 是必需的字段
      for (const userInfo of memberList.userInfoList) {
        const userId = userInfo.userId
        memberIdList.push(userId)

        // 如果联系人不存在，创建联系人
        if (!this.contactStore[userId]) {
          this.contactStore[userId] = {
            alias: '',
            avatar: '',
            friend: false,
            gender: PUPPET.types.ContactGender.Unknown,
            id: userId,
            name: userId,
            phone: [],
            type: PUPPET.types.Contact.Individual,
          }
        }
      }

      this.roomStore[roomId].memberIdList = memberIdList
      log.verbose('PuppetBridge', 'loadRoomMemberList success, groupId: %s, memberCount: %s', groupId, memberIdList.length)
    } catch (error: any) {
      log.error('PuppetBridge', 'loadRoomMemberList error: %s', error.message)
    }
  }

  /**
   * 处理接收到的消息（保留用于未来扩展）
   */
  private onHookRecvMsg (messageRaw: MessageRaw) {
    log.info('onHookRecvMsg', JSON.stringify(messageRaw, undefined, 2))
    const that = this
    const type = PUPPET.types.Message.Unknown
    const roomId = messageRaw.id1
    const listenerId = messageRaw.id2
    const talkerId = messageRaw.id2 || messageRaw.id1 || this.currentUserId || ''
    const wxid = messageRaw.wxid || messageRaw.id1
    const text = messageRaw.content as string
    const code = messageRaw.type

    const payload: PUPPET.payloads.Message = {
      id: messageRaw.id,
      listenerId: roomId ? '' : listenerId,
      roomId: roomId || '',
      talkerId,
      text,
      timestamp: Date.now(),
      // toId,
      type,
    }
    //  log.info('payloadType----------', PUPPET.types.Message[type])
    //  log.info('payload----------', payload)

    if (talkerId && (!this.contactStore[talkerId] || !this.contactStore[talkerId]?.name)) {
      void this.loadContactList()
    }

    if (roomId && (!this.roomStore[roomId] || !this.roomStore[roomId]?.topic)) {
      void this.loadRoomList()
    }

    try {
      if (this.isLoggedIn) {
        if (code === 10000 && roomId) {
          // 你邀请"瓦力"加入了群聊
          // "超超超哥"邀请"瓦力"加入了群聊
          // "ledongmao"邀请"瓦力"加入了群聊
          // "超超超哥"邀请你加入了群聊，群聊参与人还有：瓦力

          // 你将"瓦力"移出了群聊
          // 你被"ledongmao"移出群聊

          // 你修改群名为“瓦力专属”
          // 你修改群名为“大师是群主”
          // "ledongmao"修改群名为“北辰香麓欣麓园抗疫”

          const room = this.roomStore[roomId]
          //  log.info('room=========================', room)
          let topic = ''
          const oldTopic = room ? room.topic : ''

          if (text.indexOf('修改群名为') !== -1) {
            const arrInfo = text.split('修改群名为')
            let changer = this.selfInfo
            if (arrInfo[0] && room) {
              topic = arrInfo[1]?.split(/“|”|"/)[1] || ''
              //  topic = arrInfo[1] || ''
              this.roomStore[roomId] = room
              room.topic = topic
              if (arrInfo[0] === '你') {
                //  changer = this.selfInfo
              } else {
                const name = arrInfo[0].split(/“|”|"/)[1] || ''
                for (const i in this.contactStore) {
                  if (this.contactStore[i] && this.contactStore[i]?.name === name) {
                    changer = this.contactStore[i]
                  }
                }

              }
            }
            //  log.info(room)
            //  log.info(changer)
            //  log.info(oldTopic)
            //  log.info(topic)
            const changerId = changer.id
            this.emit('room-topic', { changerId, newTopic: topic, oldTopic, roomId })

          }
          if (text.indexOf('加入了群聊') !== -1) {
            const inviteeList = []
            let inviter = this.selfInfo
            const arrInfo = text.split(/邀请|加入了群聊/)

            if (arrInfo[0]) {
              topic = arrInfo[0]?.split(/“|”|"/)[1] || ''
              if (arrInfo[0] === '你') {
                //  changer = this.selfInfo
              } else {
                const name = arrInfo[0].split(/“|”|"/)[1] || ''
                for (const i in this.contactStore) {
                  if (this.contactStore[i] && this.contactStore[i]?.name === name) {
                    inviter = this.contactStore[i]
                  }
                }
              }
            }

            if (arrInfo[1]) {
              topic = arrInfo[1]?.split(/“|”|"/)[1] || ''
              if (arrInfo[1] === '你') {
                inviteeList.push(this.selfInfo.id)
              } else {
                const name = arrInfo[1].split(/“|”|"/)[1] || ''
                for (const i in this.contactStore) {
                  if (this.contactStore[i] && this.contactStore[i]?.name === name) {
                    if (this.contactStore[i]?.id && room?.memberIdList.includes(this.contactStore[i]?.id || '')) {
                      inviteeList.push(this.contactStore[i]?.id)
                    }
                  }
                }

              }
            }
            //  log.info(inviteeList)
            //  log.info(inviter)
            //  log.info(room)

            this.emit('room-join', { inviteeIdList: inviteeList, inviterId: inviter.id, roomId })
          }
        } else {
          this.messageStore[payload.id] = payload
          this.emit('message', { messageId: payload.id })
        }
      }
    } catch (e) {
      log.error('emit message fail:', e)
    }

  }

  private async loadContactList () {
    // 如流机器人暂不支持获取联系人列表
    log.verbose('PuppetBridge', 'loadContactList() - not supported for hi robot')
    // 不执行任何操作，避免报错
  }

  private async loadRoomList () {
    // 如流机器人暂不支持获取群列表
    log.verbose('PuppetBridge', 'loadRoomList() - not supported for hi robot')
    // 不执行任何操作，避免报错
  }

  /**
   *
   * ContactSelf
   *
   *
   */
  override async contactSelfQRCode (): Promise<string> {
    log.verbose('PuppetBridge', 'contactSelfQRCode()')
    return CHATIE_OFFICIAL_ACCOUNT_QRCODE
  }

  override async contactSelfName (name: string): Promise<void> {
    log.verbose('PuppetBridge', 'contactSelfName(%s)', name)
    if (!name) {
      // name 参数为空，直接返回，不做任何操作
      return this.selfInfo.name as unknown as void
    }
    // 实际环境下通常需要更新本地缓存或向服务端请求修改名称
    this.selfInfo.name = name
  }

  /**
 *
 * Contact
 *
 */
  override contactAlias(contactId: string): Promise<string>
  override contactAlias(contactId: string, alias: string | null): Promise<void>

  override async contactAlias (contactId: string, alias?: string | null): Promise<void | string> {
    log.verbose('PuppetBridge', 'contactAlias(%s, %s)', contactId, alias)
    const contact = await this.contactRawPayload(contactId)
    // if (typeof alias === 'undefined') {
    //   throw new Error('to be implement')
    // }
    return contact.alias
  }

  override async contactPhone(contactId: string): Promise<string[]>
  override async contactPhone(contactId: string, phoneList: string[]): Promise<void>

  override async contactPhone (contactId: string, phoneList?: string[]): Promise<string[] | void> {
    log.verbose('PuppetBridge', 'contactPhone(%s, %s)', contactId, phoneList)
    if (typeof phoneList === 'undefined') {
      return []
    }
  }

  override async contactCorporationRemark (contactId: string, corporationRemark: string) {
    log.verbose('PuppetBridge', 'contactCorporationRemark(%s, %s)', contactId, corporationRemark)
  }

  override async contactDescription (contactId: string, description: string) {
    log.verbose('PuppetBridge', 'contactDescription(%s, %s)', contactId, description)
  }

  override async contactList (): Promise<string[]> {
    log.verbose('PuppetBridge', 'contactList()')
    const idList = Object.keys(this.contactStore)
    return idList
  }

  override async contactAvatar(contactId: string): Promise<FileBoxInterface>
  override async contactAvatar(contactId: string, file: FileBoxInterface): Promise<void>

  override async contactAvatar (contactId: string, file?: FileBoxInterface): Promise<void | FileBoxInterface> {
    log.verbose('PuppetBridge', 'contactAvatar(%s)', contactId)

    /**
   * 1. set
   */
    if (file) {
      return
    }

    /**
   * 2. get
   */
    const WECHATY_ICON_PNG = 'data:image/png;base64,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'
    return FileBox.fromDataURL(WECHATY_ICON_PNG)
  }

  override async contactRawPayloadParser (payload: PUPPET.payloads.Contact) {
    // log.verbose('PuppetBridge', 'contactRawPayloadParser(%s)', JSON.stringify(payload))
    return payload
  }

  override async contactRawPayload (id: string): Promise<PUPPET.payloads.Contact> {
    //  log.verbose('PuppetBridge----------------------', 'contactRawPayload(%s,%s)', id, this.contactStore[id]?.name)
    return this.contactStore[id] || {} as any
  }

  /**
 *
 * Conversation
 *
 */
  override async conversationReadMark (conversationId: string, hasRead?: boolean): Promise<void> {
    log.verbose('PuppetService', 'conversationRead(%s, %s)', conversationId, hasRead)
  }

  /**
 *
 * Message
 *
 */
  override async messageContact (
    messageId: string,
  ): Promise<string> {
    log.verbose('PuppetBridge', 'messageContact(%s)', messageId)
    const message = this.messageStore[messageId]
    // 如流机器人暂不支持联系人消息解析
    this.notSupported('messageContact')
    return ''
  }

  override async messageImage (
    messageId: string,
    imageType: PUPPET.types.Image,
  ): Promise<FileBoxInterface> {
    log.verbose('PuppetBridge', 'messageImage(%s, %s)', messageId, imageType)
    const message = this.messageStore[messageId]

    // 如流机器人暂不支持图片消息解析
    // 如果消息中有图片URL，可以尝试从URL加载
    if (message?.text) {
      try {
        // 尝试解析为JSON格式的图片数据
        const picData = JSON.parse(message.text)
        if (picData.url || picData.thumb) {
          const imageUrl = picData.url || picData.thumb
          return FileBox.fromUrl(imageUrl)
        }
      } catch {
        // 如果不是JSON，可能是base64编码的图片
        try {
          return FileBox.fromBase64(message.text, `image-${messageId}.png`)
        } catch {
          // 忽略错误
        }
      }
    }

    // 返回默认图标
    log.warn('PuppetBridge', 'messageImage: unable to parse image, returning default icon')
    return qrCodeForChatie()
  }

  override async messageRecall (
    messageId: string,
  ): Promise<boolean> {
    log.verbose('PuppetBridge', 'messageRecall(%s)', messageId)

    const recallInfo = this.messageRecallMap[messageId]
    if (!recallInfo) {
      log.error('PuppetBridge', 'messageRecall: messageId %s not found in recall map', messageId)
      return false
    }

    try {
      if (recallInfo.msgkey) {
        // 单聊消息撤回
        await this.bridge.messageRecallSingle(recallInfo.msgkey)
        log.verbose('PuppetBridge', 'messageRecall: single chat message recalled, msgkey: %s', recallInfo.msgkey)
      } else if (recallInfo.groupId && recallInfo.messageid && recallInfo.msgseqid) {
        // 群聊消息撤回
        await this.bridge.messageRecallGroup(
          recallInfo.groupId,
          recallInfo.messageid,
          recallInfo.msgseqid,
        )
        log.verbose('PuppetBridge', 'messageRecall: group chat message recalled, groupId: %s, messageid: %s',
          recallInfo.groupId, recallInfo.messageid)
      } else {
        log.error('PuppetBridge', 'messageRecall: invalid recall info for messageId %s', messageId)
        return false
      }

      // 删除撤回信息
      delete this.messageRecallMap[messageId]
      return true
    } catch (error: any) {
      log.error('PuppetBridge', 'messageRecall error: %s', error.message)
      return false
    }
  }

  override async messageFile (id: string): Promise<FileBoxInterface> {
    const message = this.messageStore[id]
    //  log.verbose('messageFile', String(message))
    log.info('messageFile:', message)
    const dataPath = ''
    let fileName = ''

    if (message?.type === PUPPET.types.Message.Image) {
      return this.messageImage(
        id,
        PUPPET.types.Image.Thumbnail,
        // PUPPET.types.Image.HD,
      )
    }

    if (message?.type === PUPPET.types.Message.Attachment) {
      // 如流机器人暂不支持附件文件解析
      this.notSupported('messageFile for Attachment')
      throw new Error('messageFile for Attachment not supported')
    }

    if (message?.type === PUPPET.types.Message.Emoticon && message.text) {
      const text = JSON.parse(message.text)
      try {
        try {
          fileName = text.md5 + '.png'
          return FileBox.fromUrl(text.cdnurl, { name: fileName })
        } catch (err) {
          log.error('messageFile fail:', err)
        }
      } catch (err) {
        log.error('messageFile fail:', err)
      }
    }

    if ([ PUPPET.types.Message.Video, PUPPET.types.Message.Audio ].includes(message?.type || PUPPET.types.Message.Unknown)) {
      this.notSupported('Video/Audio')
      throw new Error('Video/Audio not supported')
    }

    // 如果无法解析，返回默认图标
    log.warn('PuppetBridge', 'messageFile: unable to parse file, returning default icon')
    return qrCodeForChatie()
  }

  override async messageUrl (messageId: string): Promise<PUPPET.payloads.UrlLink> {
    log.verbose('PuppetBridge', 'messageUrl(%s)', messageId)
    // 如流机器人暂不支持URL消息解析
    this.notSupported('messageUrl')
    throw new Error('messageUrl not supported')
  }

  override async messageMiniProgram (messageId: string): Promise<PUPPET.payloads.MiniProgram> {
    log.verbose('PuppetBridge', 'messageMiniProgram(%s)', messageId)
    // 如流机器人暂不支持小程序消息解析
    this.notSupported('messageMiniProgram')
    throw new Error('messageMiniProgram not supported')
  }

  override async messageLocation (messageId: string): Promise<PUPPET.payloads.Location> {
    log.verbose('PuppetBridge', 'messageLocation(%s)', messageId)
    // 如流机器人暂不支持位置消息解析
    this.notSupported('messageLocation')
    throw new Error('messageLocation not supported')
  }

  override async messageRawPayloadParser (payload: PUPPET.payloads.Message) {
    // log.info(payload)
    return payload
  }

  override async messageRawPayload (id: string): Promise<PUPPET.payloads.Message> {
    log.verbose('PuppetBridge', 'messageRawPayload(%s)', id)
    if (!this.isLoggedIn) {
      throw new Error('not logged in')
    }
    const payload = this.messageStore[id]
    if (!payload) {
      throw new Error('no payload')
    }
    return payload
  }

  override async messageSendText (
    conversationId: string,
    text: string,
    mentionIdList?: string[],
  ): Promise<void> {
    log.verbose('PuppetBridge', 'messageSendText(%s, %s)', conversationId, text)

    const messageId = conversationId
    const isGroup = this.isGroupChat(conversationId)

    try {
      if (isGroup) {
        // 群聊消息
        const groupId = parseInt(conversationId, 10)
        log.verbose('PuppetBridge', 'messageSendText - sending to group, groupId: %s', groupId)

        if (mentionIdList && mentionIdList.length > 0) {
          // 发送@消息
          const result = await this.bridge.messageSendTextAt(groupId, text, mentionIdList)

          // result 直接是 { messageid, msgseqid, ctime }
          log.verbose('PuppetBridge', 'messageSendText - @ message result: %s', JSON.stringify(result))

          // 保存撤回信息
          this.messageRecallMap[messageId] = {
            groupId,
            messageid: result.messageid,
            msgseqid: result.msgseqid,
          }
        } else {
          // 发送普通群聊消息
          const result = await this.bridge.messageSendTextToGroup(groupId, text)
          log.info('PuppetBridge', 'messageSendText - group message result: %s', JSON.stringify(result))
          // 保存撤回信息
          this.messageRecallMap[messageId] = {
            groupId,
            messageid: result.messageid,
            msgseqid: result.msgseqid,
          }
        }
      } else {
        // 单聊消息
        log.verbose('PuppetBridge', 'messageSendText - sending to single chat, touser: %s', conversationId)
        const msgkey = await this.bridge.messageSendTextWithKey(conversationId, text)

        // 保存撤回信息（只有当 msgkey 存在时才保存，空字符串表示无法撤回）
        if (msgkey) {
          this.messageRecallMap[messageId] = {
            msgkey,
          }
        } else {
          log.warn('PuppetBridge', 'messageSendText: message sent successfully but no msgkey, cannot recall')
        }
      }

      // 保存消息到messageStore（用于后续可能的查询）
      this.messageStore[messageId] = {
        id: messageId,
        listenerId: isGroup ? '' : conversationId,
        roomId: isGroup ? conversationId : '',
        talkerId: this.selfInfo.id,
        text,
        timestamp: Date.now(),
        type: PUPPET.types.Message.Text,
      }
    } catch (error: any) {
      log.error('PuppetBridge', 'messageSendText error: %s', error.message)
      throw error
    }
  }

  override async messageSendFile (
    conversationId: string,
    file: FileBoxInterface,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'messageSendFile(%s, %s)', conversationId, file.name)

    // 如流机器人文件发送需要先上传文件获取md5，然后使用文件消息API
    // 目前暂不支持文件发送功能
    this.notSupported('messageSendFile')
    throw new Error('messageSendFile not supported for hi robot. File messages require uploading file first to get md5.')
  }

  override async messageSendContact (
    conversationId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'messageSendUrl(%s, %s)', conversationId, contactId)

    this.notSupported('SendContact')

    // const contact = this.mocker.MockContact.load(contactId)
    // return this.messageSend(conversationId, contact)
  }

  override async messageSendUrl (
    conversationId: string,
    urlLinkPayload: PUPPET.payloads.UrlLink,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'messageSendUrl(%s, %s)', conversationId, JSON.stringify(urlLinkPayload))
    this.notSupported('SendUrl')
    // const url = new UrlLink(urlLinkPayload)
    // return this.messageSend(conversationId, url)
  }

  override async messageSendMiniProgram (
    conversationId: string,
    miniProgramPayload: PUPPET.payloads.MiniProgram,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'messageSendMiniProgram(%s, %s)', conversationId, JSON.stringify(miniProgramPayload))

    //   const xmlstr = `<?xml version="1.0" encoding="UTF-8" ?>
    //    <msg>
    //      <fromusername>${this.selfInfo.id}</fromusername>
    //      <scene>0</scene>
    //      <appmsg appid="${miniProgramPayload.appid}">
    //        <title>${miniProgramPayload.title}</title>
    //        <action>view</action>
    //        <type>33</type>
    //        <showtype>0</showtype>
    //        <url>${miniProgramPayload.pagePath}</url>
    //        <thumburl>${miniProgramPayload.thumbUrl}</thumburl>
    //        <sourcedisplayname>${miniProgramPayload.description}</sourcedisplayname>
    //        <appattach>
    //          <totallen>0</totallen>
    //        </appattach>
    //        <weappinfo>
    //          <username>${miniProgramPayload.username}</username>
    //          <appid>${miniProgramPayload.appid}</appid>
    //          <type>1</type>
    //          <weappiconurl>${miniProgramPayload.iconUrl}</weappiconurl>
    //          <appservicetype>0</appservicetype>
    //          <shareId>2_wx65cc950f42e8fff1_875237370_${new Date().getTime()}_1</shareId>
    //        </weappinfo>
    //      </appmsg>
    //      <appinfo>
    //        <version>1</version>
    //        <appname>Window wechat</appname>
    //      </appinfo>
    //    </msg>
    //  `
    // const xmlstr=`<msg><fromusername>${this.selfInfo.id}</fromusername><scene>0</scene><commenturl></commenturl><appmsg appid="wx65cc950f42e8fff1" sdkver=""><title>腾讯出行服务｜加油代驾公交</title><des></des><action>view</action><type>33</type><showtype>0</showtype><content></content><url>https://mp.weixin.qq.com/mp/waerrpage?appid=wx65cc950f42e8fff1&amp;amp;type=upgrade&amp;amp;upgradetype=3#wechat_redirect</url><dataurl></dataurl><lowurl></lowurl><lowdataurl></lowdataurl><recorditem><![CDATA[]]></recorditem><thumburl>http://mmbiz.qpic.cn/mmbiz_png/NM1fK7leWGPaFnMAe95jbg4sZAI3fkEZWHq69CIk6zA00SGARbmsGTbgLnZUXFoRwjROelKicbSp9K34MaZBuuA/640?wx_fmt=png&amp;wxfrom=200</thumburl><messageaction></messageaction><extinfo></extinfo><sourceusername></sourceusername><sourcedisplayname>腾讯出行服务｜加油代驾公交</sourcedisplayname><commenturl></commenturl><appattach><totallen>0</totallen><attachid></attachid><emoticonmd5></emoticonmd5><fileext></fileext><aeskey></aeskey></appattach><weappinfo><pagepath></pagepath><username>gh_ad64296dc8bd@app</username><appid>wx65cc950f42e8fff1</appid><type>1</type><weappiconurl>http://mmbiz.qpic.cn/mmbiz_png/NM1fK7leWGPaFnMAe95jbg4sZAI3fkEZWHq69CIk6zA00SGARbmsGTbgLnZUXFoRwjROelKicbSp9K34MaZBuuA/640?wx_fmt=png&amp;wxfrom=200</weappiconurl><appservicetype>0</appservicetype><shareId>2_wx65cc950f42e8fff1_875237370_1644979747_1</shareId></weappinfo><websearch /></appmsg><appinfo><version>1</version><appname>Window wechat</appname></appinfo></msg>`
    log.info('发送小程序功能暂不支持')
    // await this.Bridge.SendMiniProgram('', conversationId, xmlstr)
  }

  override async messageSendLocation (
    conversationId: string,
    locationPayload: PUPPET.payloads.Location,
  ): Promise<void | string> {
    log.verbose('PuppetBridge', 'messageSendLocation(%s, %s)', conversationId, JSON.stringify(locationPayload))
    this.notSupported('SendLocation')
  }

  override async messageForward (
    conversationId: string,
    messageId: string,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'messageForward(%s, %s)',
      conversationId,
      messageId,
    )
    const curMessage = this.messageStore[messageId]
    if (curMessage?.type === PUPPET.types.Message.Text) {
      await this.messageSendText(conversationId, curMessage.text || '')
    } else {
      log.info('only Text message forward is supported by xp.')
      PUPPET.throwUnsupportedError(conversationId, messageId)
    }
  }

  /**
 *
 * Room
 *
 */
  override async roomRawPayloadParser (payload: PUPPET.payloads.Room) { return payload }
  override async roomRawPayload (id: string): Promise<PUPPET.payloads.Room | undefined> {
    // log.info('PuppetBridge', 'roomRawPayload(%s)', id)
    //  log.verbose('PuppetBridge----------------------', 'roomRawPayload(%s%s)', id, this.roomStore[id]?.topic)
    return this.roomStore[id]
  }

  override async roomList (): Promise<string[]> {
    log.verbose('PuppetBridge', 'call roomList()')
    const idList = Object.keys(this.roomStore)
    return idList
  }

  override async roomDel (
    roomId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'roomDel(%s, %s)', roomId, contactId)
  }

  override async roomAvatar (roomId: string): Promise<FileBoxInterface> {
    log.verbose('PuppetBridge', 'roomAvatar(%s)', roomId)

    const payload = await this.roomPayload(roomId)

    if (payload.avatar) {
      return FileBox.fromUrl(payload.avatar)
    }
    log.warn('PuppetBridge', 'roomAvatar() avatar not found, use the chatie default.')
    return qrCodeForChatie()
  }

  override async roomAdd (
    roomId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'roomAdd(%s, %s)', roomId, contactId)
  }

  override async roomTopic(roomId: string): Promise<string>
  override async roomTopic(roomId: string, topic: string): Promise<void>

  override async roomTopic (
    roomId: string,
    topic?: string,
  ): Promise<void | string> {
    log.verbose('PuppetBridge', 'roomTopic(%s, %s)', roomId, topic)
    const payload = await this.roomPayload(roomId)
    if (!topic) {
      return payload.topic
    } else {
      return payload.topic
    }
  }

  override async roomCreate (
    contactIdList: string[],
    topic: string,
  ): Promise<string> {
    log.verbose('PuppetBridge', 'roomCreate(%s, %s)', contactIdList, topic)

    return 'mock_room_id'
  }

  override async roomQuit (roomId: string): Promise<void> {
    log.verbose('PuppetBridge', 'roomQuit(%s)', roomId)
  }

  override async roomQRCode (roomId: string): Promise<string> {
    log.verbose('PuppetBridge', 'roomQRCode(%s)', roomId)
    return roomId + ' mock qrcode'
  }

  override async roomMemberList (roomId: string): Promise<string[]> {
    log.verbose('PuppetBridge', 'roomMemberList(%s)', roomId)
    try {
      const roomRawPayload = await this.roomRawPayload(roomId)
      const memberIdList = roomRawPayload?.memberIdList
      return memberIdList || []
    } catch (e) {
      log.error('roomMemberList()', e)
      return []
    }

  }

  override async roomMemberRawPayload (roomId: string, contactId: string): Promise<PUPPET.payloads.RoomMember> {
    log.verbose('PuppetBridge', 'roomMemberRawPayload(%s, %s)', roomId, contactId)
    try {
      const contact = this.contactStore[contactId]
      const MemberRawPayload = {
        avatar: '',
        id: contactId,
        inviterId: contactId,   // "wxid_7708837087612",
        name: contact?.name || 'Unknow',
        roomAlias: contact?.name || '',
      }
      // log.info(MemberRawPayload)
      return MemberRawPayload
    } catch (e) {
      log.error('roomMemberRawPayload()', e)
      const member: PUPPET.payloads.RoomMember = {
        avatar: '',
        id: contactId,
        name: '',
      }
      return member
    }

  }

  override async roomMemberRawPayloadParser (rawPayload: PUPPET.payloads.RoomMember): Promise<PUPPET.payloads.RoomMember> {
    //  log.verbose('PuppetBridge---------------------', 'roomMemberRawPayloadParser(%s)', rawPayload)
    return rawPayload
  }

  override async roomAnnounce(roomId: string): Promise<string>
  override async roomAnnounce(roomId: string, text: string): Promise<void>

  override async roomAnnounce (roomId: string, text?: string): Promise<void | string> {
    if (text) {
      return
    }
    return 'mock announcement for ' + roomId
  }

  /**
 *
 * Room Invitation
 *
 */
  override async roomInvitationAccept (roomInvitationId: string): Promise<void> {
    log.verbose('PuppetBridge', 'roomInvitationAccept(%s)', roomInvitationId)
  }

  override async roomInvitationRawPayload (roomInvitationId: string): Promise<any> {
    log.verbose('PuppetBridge', 'roomInvitationRawPayload(%s)', roomInvitationId)
  }

  override async roomInvitationRawPayloadParser (rawPayload: any): Promise<PUPPET.payloads.RoomInvitation> {
    log.verbose('PuppetBridge', 'roomInvitationRawPayloadParser(%s)', JSON.stringify(rawPayload))
    return rawPayload
  }

  /**
 *
 * Friendship
 *
 */
  override async friendshipRawPayload (id: string): Promise<any> {
    return { id } as any
  }

  override async friendshipRawPayloadParser (rawPayload: any): Promise<PUPPET.payloads.Friendship> {
    return rawPayload
  }

  override async friendshipSearchPhone (
    phone: string,
  ): Promise<null | string> {
    log.verbose('PuppetBridge', 'friendshipSearchPhone(%s)', phone)
    return null
  }

  override async friendshipSearchWeixin (
    weixin: string,
  ): Promise<null | string> {
    log.verbose('PuppetBridge', 'friendshipSearchWeixin(%s)', weixin)
    return null
  }

  override async friendshipAdd (
    contactId: string,
    hello: string,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'friendshipAdd(%s, %s)', contactId, hello)
  }

  override async friendshipAccept (
    friendshipId: string,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'friendshipAccept(%s)', friendshipId)
  }

  /**
 *
 * Tag
 *
 */
  override async tagContactAdd (
    tagId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'tagContactAdd(%s)', tagId, contactId)
  }

  override async tagContactRemove (
    tagId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'tagContactRemove(%s)', tagId, contactId)
  }

  override async tagContactDelete (
    tagId: string,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'tagContactDelete(%s)', tagId)
  }

  override async tagContactList (
    contactId?: string,
  ): Promise<string[]> {
    log.verbose('PuppetBridge', 'tagContactList(%s)', contactId)
    return []
  }

}

export { PuppetBridge }
export default PuppetBridge
