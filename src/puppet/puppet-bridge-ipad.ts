/* eslint-disable sort-keys */
/* eslint-disable no-console */
import * as PUPPET from 'wechaty-puppet'
import { log } from 'wechaty-puppet'
import type {
  FileBoxInterface,
} from 'file-box'
import {
  FileBox,
} from 'file-box'

import {
  qrCodeForChatie,
  VERSION,
} from '../config.js'

import type {
  MessageRaw,
} from '../agents/wechat-bot/cixingguangming55555-wechat-bot.js'

import { XmlDecrypt } from '../pure-functions/xml-msgpayload.js'
import { Bridge } from '../agents/Devo919-Gewechat/bridge/mod.js'

export type PuppetBridgeOptions = PUPPET.PuppetOptions & {
  token: string
  appId: string
  host: string
  apiPort: string
  downloadPort: string
  callbackHost: string
}

class PuppetBridge extends PUPPET.Puppet {

  static override readonly VERSION = VERSION

  private messageStore: { [k: string]: PUPPET.payloads.Message }

  private roomStore: { [k: string]: PUPPET.payloads.Room }

  private contactStore: { [k: string]: PUPPET.payloads.Contact }

  private scanEventData?: PUPPET.payloads.EventScan

  private selfInfo: any

  private bridge: Bridge

  constructor (
    public override options: PuppetBridgeOptions) {

    log.info('options...', JSON.stringify(options))
    super(options)
    log.verbose('PuppetBridge', 'constructor(%s)', JSON.stringify(options))
    this.bridge = new Bridge(options)

    // FIXME: use LRU cache for message store so that we can reduce memory usage
    this.messageStore = {}
    this.roomStore = {}
    this.contactStore = {}
    this.selfInfo = {}
  }

  override version () {
    return VERSION
  }

  async onStart () {
    log.info('PuppetBridge onStart()')
    // await this.onLogin()

    this.bridge.checkOnline().then(async (res) => {
      log.info('checkOnline:', JSON.stringify(res))
      if (res.data) {
        await this.onLogin()
      } else {
        await this.getQrCode()
        await this.onScan()
      }
      return res
    }).catch((e) => {
      log.error('checkOnline fail:', e)
    })

    this.bridge.on('scan', (res) => {
      log.info('onScan...', JSON.stringify(res))
      if (res.ret === 200 && (res.data.status === 0 || res.data.status === null)) {
        this.scanEventData = {
          qrcode: this.scanEventData?.qrcode,
          status: PUPPET.types.ScanStatus.Waiting,
        }
        this.onScan().then(() => {
          log.info('onScan success:等待扫码')
          return ''
        }).catch(e => {
          log.error('onScan fail:', e)
        })
      } else if (res.ret === 200 && res.data.status === 1) {
        this.scanEventData = {
          qrcode: this.scanEventData?.qrcode,
          status: PUPPET.types.ScanStatus.Scanned,
        }
        this.onScan().then(() => {
          log.info('onScan success:等待确认登录')
          return ''
        }).catch(e => {
          log.error('onScan fail:', e)
        })
      } else if (res.ret === 500 && res.msg === '二维码已过期') {
        this.scanEventData = {
          qrcode: this.scanEventData?.qrcode,
          status: PUPPET.types.ScanStatus.Timeout,
        }
        this.onScan().then(async () => {
          log.info('onScan success：二维码已过期')
          await this.getQrCode()
          return ''
        }).catch(e => {
          log.error('onScan fail:', e)
        })
      } else if (res.ret === 500 && res.msg === '检测登录失败') {
        this.onScan().then(async () => {
          log.info('onScan success：二维码已过期,重新获取二维码')
          await this.getQrCode()
          return ''
        }).catch(e => {
          log.error('onScan fail:', e)
        })
      } else if (res.ret === 500 && res.msg === '已登录成功，请勿重复操作') {
        this.scanEventData = {
          qrcode: this.scanEventData?.qrcode,
          status: PUPPET.types.ScanStatus.Confirmed,
        }
        this.onScan().then(() => {
          log.info('onScan success：已登录成功，请勿重复操作')
          return ''
        }).catch(e => {
          log.error('onScan fail:', e)
        })
      } else {
        log.info('onScan success:', JSON.stringify(res))
      }
    })

    this.bridge.on('login', () => {
      // log.info('onMessage', message)
      this.onLogin().catch(e => {
        log.error('onLogin fail:', e)
      })
    })

    this.bridge.on('message', (message: MessageRaw) => {
      log.info('puppet onMessage...', JSON.stringify(message))
      this.onHookRecvMsg(message)
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

    this.bridge.on('hook', (message) => {
      log.info('onHook', message)
    })

  }

  async getQrCode () {
    log.verbose('PuppetBridge', 'getQrCode()')
    const { qrCode } = await this.bridge.getLoginQrCode()
    this.scanEventData = {
      qrcode: qrCode,
      status: PUPPET.types.ScanStatus.Waiting,
    }
    return qrCode
  }

  private async onAgentReady () {
    log.info('PuppetBridge onAgentReady()')
    this.emit('ready')
    this.bridge.startHttpServer()
    this.bridge.setCallback().then(() => {
      log.info('setCallback success')
      return ''
    }).catch(e => {
      log.error('setCallback fail:', e)
    })
  }

  private async onLogin () {
    try {
      const selfInfo: PUPPET.payloads.Contact = await this.bridge.getProfile()
      this.selfInfo = selfInfo
      await super.login(this.selfInfo.id)

      await this.loadContactList()
      await this.loadRoomList()
      log.info('onLogin success:', JSON.stringify(selfInfo))
      await this.onAgentReady()
    } catch (e) {
      log.error('onLogin fail:', e)
      throw e
    }
  }

  private async onLogout (reasonNum: number) {
    await super.logout(reasonNum ? 'Kicked by server' : 'logout')
  }

  private async onScan (args?: any) {
    log.verbose('PuppetBridge onScan()', args)
    this.emit('scan', this.scanEventData)
  }

  private onHookRecvMsg (messageRaw: any) {
    log.info('puppet onHookRecvMsg', JSON.stringify(messageRaw, undefined, 2))
    const payload: PUPPET.payloads.Message = messageRaw
    //  log.info('payloadType----------', PUPPET.types.Message[type])
    //  log.info('payload----------', payload)

    // if (talkerId && (!this.contactStore[talkerId] || !this.contactStore[talkerId]?.name)) {
    //   void this.loadContactList()
    // }

    // if (!this.roomStore[roomId] || !this.roomStore[roomId].topic) {
    //   void this.loadRoomList()
    // }

    try {
      if (this.isLoggedIn) {
        this.messageStore[payload.id] = payload
        this.emit('message', { messageId: payload.id })

      }
    } catch (e) {
      log.error('emit message fail:', e)
    }

  }

  async onStop () {
    log.verbose('PuppetBridge', 'onStop()')
    if (this.logonoff()) {
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

  private async loadContactList () {
    log.info('contactList get success, wait for contactList init ...')
    const { contactList } = await this.bridge.loadContactList()
    this.contactStore = contactList

    log.verbose('contactList count', Object.keys(this.contactStore).length)
  }

  private async loadRoomList () {

    // 重新加载群列表
    const { roomList } = await this.bridge.loadRoomList()
    const roomListNew = roomList as { [k: string]: PUPPET.payloads.Room }
    for (const roomId in roomListNew) {
      const memberList = await this.bridge.getRoomMemberList(roomId)
      for (const memberId in memberList) {
        const member = memberList[memberId] as PUPPET.payloads.Contact
        if (!this.contactStore[memberId]) {
          this.contactStore[memberId] = member
        }
      }
    }
    this.roomStore = roomListNew
  }

  /**
   *
   * ContactSelf
   *
   *
   */
  override async contactSelfQRCode (): Promise<string> {
    log.verbose('PuppetBridge', 'contactSelfQRCode()')
    const { qrCode } = await this.bridge.contactSelfQRCode()
    return  qrCode
  }

  override async contactSelfName (name: string): Promise<void> {
    log.verbose('PuppetBridge', 'contactSelfName(%s)', name)
    if (!name) {
      return this.selfInfo.name
    }
  }

  override async contactSelfSignature (signature: string): Promise<void> {
    log.verbose('PuppetBridge', 'contactSelfSignature(%s)', signature)
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
    if (this.contactStore[contactId]?.avatar) {
      return FileBox.fromDataURL(this.contactStore[contactId]?.avatar || '')
    }
    return FileBox.fromBase64(WECHATY_ICON_PNG)
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
    return await XmlDecrypt(message?.text || '', message?.type || PUPPET.types.Message.Unknown)
  }

  override async messageImage (
    messageId: string,
    imageType: PUPPET.types.Image,
  ): Promise<FileBoxInterface> {

    log.verbose('PuppetBridge', 'messageImage(%s, %s, %s)',
      messageId,
      imageType,
      PUPPET.types.Image[imageType],
    )

    const message = this.messageStore[messageId]
    const textJson = JSON.parse(message?.text || '')
    const fileName = textJson.fileName || ''
    const url = textJson.url || ''
    let base64 = textJson.base64 || ''
    if (url) {
      const file = await FileBox.fromUrl(url, { name: fileName })
      base64 = await file.toBase64()
    }

    return FileBox.fromBase64(
      base64,
      fileName,
    )
  }

  override async messageRecall (
    messageId: string,
  ): Promise<boolean> {
    log.verbose('PuppetBridge', 'messageRecall(%s)', messageId)
    this.notSupported('messageRecall')
    return false
  }

  override async messageFile (id: string): Promise<FileBoxInterface> {
    //  log.verbose('messageFile', String(message))

    const message = this.messageStore[id]
    const textJson = JSON.parse(message?.text || '')
    const fileName = textJson.fileName || ''
    const url = textJson.url || ''
    let base64 = textJson.base64 || ''
    if (url) {
      const file = await FileBox.fromUrl(url, { name: fileName })
      base64 = await file.toBase64()
    }

    return FileBox.fromFile(
      base64,
      fileName,
    )

  }

  override async messageUrl (messageId: string): Promise<PUPPET.payloads.UrlLink> {
    log.verbose('PuppetBridge', 'messageUrl(%s)', messageId)
    const message = this.messageStore[messageId]
    return await XmlDecrypt(message?.text || '', message?.type || PUPPET.types.Message.Unknown)
  }

  override async messageMiniProgram (messageId: string): Promise<PUPPET.payloads.MiniProgram> {
    log.verbose('PuppetBridge', 'messageMiniProgram(%s)', messageId)
    const message = this.messageStore[messageId]
    return await XmlDecrypt(message?.text || '', message?.type || PUPPET.types.Message.Unknown)
  }

  override async messageLocation (messageId: string): Promise<PUPPET.payloads.Location> {
    log.verbose('PuppetBridge', 'messageLocation(%s)', messageId)
    const message = this.messageStore[messageId]
    return await XmlDecrypt(message?.text || '', message?.type || PUPPET.types.Message.Unknown)
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
    try {
      await this.bridge.messageSendText(conversationId, text, mentionIdList)
    } catch (err) {
      log.error('messageSendText fail:', err)
    }
  }

  override async messageSendFile (
    conversationId: string,
    file: FileBoxInterface,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'messageSendFile(%s, %s)', conversationId, file.name, file.metadata)

    try {
      // 检测fileUrl的文件名后缀，判断是否是图片
      const ext = file.name.split('.').pop() as string
      const isImage = [ 'jpg', 'jpeg', 'png', 'gif', 'bmp' ].includes(ext)
      if (isImage) {
        await this.bridge.messageSendImage(conversationId, file)
      } else if (ext === 'mp4') {
        await this.bridge.messageSendVideo(conversationId, file)
      }  else if (ext === 'silk') {
        await this.bridge.messageSendVoice(conversationId, file)
      } else {
        await this.bridge.messageSendFile(conversationId, file)
      }
    } catch (err) {
      log.error('messageSendFile fail:', err)
    }
  }

  override async messageSendContact (
    conversationId: string,
    contactId: string,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'messageSendUrl(%s, %s)', conversationId, contactId)
    await this.bridge.messageSendContact(conversationId, contactId)
  }

  override async messageSendUrl (
    conversationId: string,
    urlLinkPayload: PUPPET.payloads.UrlLink,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'messageSendUrl(%s, %s)', conversationId, JSON.stringify(urlLinkPayload))
    await this.bridge.messageSendUrl(conversationId, urlLinkPayload)
  }

  override async messageSendMiniProgram (
    conversationId: string,
    miniProgramPayload: PUPPET.payloads.MiniProgram,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'messageSendMiniProgram(%s, %s)', conversationId, JSON.stringify(miniProgramPayload))
    await this.bridge.messageSendMiniProgram(conversationId, miniProgramPayload)
  }

  override async messageSendLocation (
    conversationId: string,
    locationPayload: PUPPET.payloads.Location,
  ): Promise<void | string> {
    log.verbose('PuppetBridge', 'messageSendLocation(%s, %s)', conversationId, JSON.stringify(locationPayload))
    await this.bridge.messageSendLocation(conversationId, locationPayload)
  }

  override async messageForward (
    conversationId: string,
    messageId: string,
  ): Promise<void> {
    log.verbose('PuppetBridge', 'messageForward(%s, %s)',
      conversationId,
      messageId,
    )
    await this.bridge.messageForward(conversationId, messageId)
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
    const room = this.roomStore[id]
    if (!room || !room.ownerId) {
      try {
        const res = await this.bridge.getRoomDetail(id)
        this.roomStore[id] = res as PUPPET.payloads.Room
      } catch (e) {
        log.error('roomRawPayload()', e)
      }
    }
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
