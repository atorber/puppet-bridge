/* eslint-disable sort-keys */
import type { BridgeInterface } from '../../../schemas/bridge.js'
import { Client, Options, log, GeweTypes, xml2js, logger, MessageTypes, NoticeTypes, RoomTypes } from '../client/mod.js'
import { createHttpServer } from './server.js'
import * as PUPPET from 'wechaty-puppet'
import { parseXml } from './util.js'
import {
  FileBox,
  FileBoxType,
  FileBoxInterface,
} from 'file-box'
import readXml from 'xmlreader'

class Bridge implements BridgeInterface {

  private client: Client
  timer: any
  uuid:string = ''
  options: Options

  constructor (options: Options) {
    console.info('Bridge constructor')
    this.options = options
    this.client = new Client(options)
    this.client.on('callback', (msg) => {
      this.handleCollectCallback(msg).then(() => {
        log.info('callback success')
        return ''
      }).catch((error) => {
        log.error('callback failed:', error)
      })
    })
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

        req.on('end', async () => {
          try {
            const data = JSON.parse(body)
            logger.info('bridge接收到的数据:' + JSON.stringify(data))
            // Handle the callback data
            await this.handleCollectCallback(data)

            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ ret: 200, status: 'success', msg: 'ok' }))
          } catch (error) {
            logger.error('bridge解析请求体时出错:' + error)
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ status: 'error', message: 'Invalid JSON' }))
          }
        })
      } else if (req.method === 'GET' && parsedUrl === '/v2/api/callback/collect') {
        res.writeHead(200, { 'Content-Type': 'text/plain' })
        res.end(this.client.token)
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('Not Found')
      }
    }

    const PORT = port || 2544
    createHttpServer(PORT, serverHandler)
      .then(async (res) => {
        // await this.setCallback()
        logger.info('HTTP Server started:', res)
        return `http://127.0.0.1:${PORT}/v2/api/callback/collect`
      }).catch((error) => {
        logger.error('HTTP Server failed to start:', error)
      })
  }

  private async handleCollectCallback (data: any) {
    const that = this
    const typeName = data.TypeName
    const initMsg = (Data:any) => {
      const FromUserName = Data.FromUserName.string
      const type = Data.MsgType
      const roomId = FromUserName.indexOf('@') !== -1 ? FromUserName : ''
      let listenerId = Data.ToUserName.string || ''
      const talkerId = FromUserName.indexOf('@') !== -1 ? Data.Content.string.split(':\n')[0] : FromUserName
      let text = Data.Content.string
      if (text.indexOf(':\n') !== -1) {
        text = text.replace(`${text.split(':\n')[0]}:\n`, '')
      }
      if (roomId) {
        listenerId = ''
      }
      const payload: PUPPET.payloads.Message = {
        id: Data.MsgId,
        listenerId,
        roomId,
        talkerId: talkerId || '',
        text,
        timestamp: Data.CreateTime,
        type,
      }
      return payload
    }
    try {
      if (typeName) {
        switch (data.TypeName) {
          case 'AddMsg':{
            switch (data.Data.MsgType) {
              case 1:{
                const msg = data as MessageTypes.MessageText
                const Data = msg.Data
                const payload = initMsg(Data)
                payload.type = PUPPET.types.Message.Text
                that.client.emit('message', payload)
                break
              }
              case 3:{
                const msg = data as MessageTypes.MessageImage
                const Data = msg.Data
                const payload = initMsg(Data)
                payload.type = PUPPET.types.Message.Image
                const xml = Data.Content.string
                const res = await that.client.messageModule.downloadImage(xml, 2)
                const fileUrl = res.data.fileUrl
                const url = this.client.getDownloadUrl(fileUrl)
                logger.info('fileUrl:', url)
                const file = FileBox.fromUrl(url)
                // const base64 = await file.toBase64()
                const base64 = ''
                payload.text = JSON.stringify({
                  base64,
                  url,
                  fileName: file.name,
                })
                that.client.emit('message', payload)
                break
              }
              case 34:{
                const msg = data as MessageTypes.MessageVoice
                const Data = msg.Data
                const payload = initMsg(Data)
                payload.type = PUPPET.types.Message.Audio
                const xml = Data.Content.string
                const res = await that.client.messageModule.downloadVoice(xml, Data.MsgId)
                const fileUrl = res.data.fileUrl
                const url = this.client.getDownloadUrl(fileUrl)
                logger.info('fileUrl:', url)

                that.client.emit('message', payload)
                break
              }
              case 43:{
                const msg = data as MessageTypes.MessageVideo
                const Data = msg.Data
                const payload = initMsg(Data)
                payload.type = PUPPET.types.Message.Video
                let xml = Data.Content.string
                if (xml.indexOf(':\n') !== -1) {
                  xml = xml.replace(`${xml.split(':\n')[0]}:\n`, '')
                }
                logger.info('xml:', xml)
                parseXml(xml).then(async (res) => {
                  logger.info('parseXml content:', JSON.stringify(res))
                  return res
                }).catch((error) => {
                  logger.error('parseXml err:', error)
                })

                const res = await that.client.messageModule.downloadVideo(xml)
                const fileUrl = res.data.fileUrl
                const url = this.client.getDownloadUrl(fileUrl)
                logger.info('fileUrl:', url)
                const file = FileBox.fromUrl(url)
                // const base64 = await file.toBase64()
                const base64 = ''
                payload.text = JSON.stringify({
                  base64,
                  url,
                  fileName: file.name,
                })
                that.client.emit('message', payload)
                break
              }
              case 47:{
                const msg = data as MessageTypes.MessageEmoji
                const Data = msg.Data
                const payload = initMsg(Data)
                payload.type = PUPPET.types.Message.Emoticon
                const xml = Data.Content.string
                parseXml(xml).then(async (res) => {
                  logger.info('parseXml content:', JSON.stringify(res))
                  const md5 = res.msg.emoji[0]['$'].md5
                  const res2 = await that.client.messageModule.downloadEmojiMd5(md5)
                  logger.info('downloadEmojiMd5:', JSON.stringify(res2))
                  // const fileUrl = res.data.fileUrl
                  // const url = this.client.getDownloadUrl(fileUrl)
                  // logger.info('fileUrl:', url)
                  return res
                }).catch((error) => {
                  logger.error('parseXml err:', error)
                })
                that.client.emit('message', payload)
                break
              }
              case 42:{
                const msg = data as MessageTypes.MessageText
                const Data = msg.Data
                const payload = initMsg(Data)
                payload.type = PUPPET.types.Message.Contact
                that.client.emit('message', payload)
                break
              }
              case 48:{
                const msg = data as MessageTypes.MessageText
                const Data = msg.Data
                const payload = initMsg(Data)
                payload.type = PUPPET.types.Message.Location
                that.client.emit('message', payload)
                break
              }
              case 49:{
                try {
                  const xml = data.Data.Content.string
                  xml2js.parseString(String(xml), { explicitArray: false, ignoreAttrs: true }, (err: any, json: any) => {
                    if (err) logger.info('xml2json err:', err)
                    logger.info('json content:', JSON.stringify(json))
                    if (json.msg && json.msg.appmsg) {
                      const curType = json.msg.appmsg.type
                      switch (curType) {
                        case '33':
                        case '39':{
                          const msg = data as MessageTypes.MessageText
                          const Data = msg.Data
                          const payload = initMsg(Data)
                          payload.type = PUPPET.types.Message.MiniProgram
                          that.client.emit('message', payload)
                          break
                        }
                        case '5':{
                          const msg = data as NoticeTypes.RoomInvite
                          if (json.msg.appmsg.title === '邀请你加入群聊') {
                            that.client.emit('room-invite', {
                              roomInvitationId: msg.Data.MsgId,
                            })
                          } else {
                            const msg = data as MessageTypes.MessageText
                            const Data = msg.Data
                            const payload = initMsg(Data)
                            payload.type = PUPPET.types.Message.Url
                            that.client.emit('message', payload)
                            break
                          }
                          break
                        }
                        case '74':{
                          const msg = data as MessageTypes.MessageText
                          const Data = msg.Data
                          const payload = initMsg(Data)
                          payload.type = PUPPET.types.Message.Attachment
                          that.client.emit('message', payload)
                          break
                        }
                        case '6':
                          // that.client.emit('message', { data, typeCode, typeName:'文件发送完成通知' })
                          logger.info('暂未有任何处理，文件发送完成通知')
                          break
                        case '57':{
                          const msg = data as MessageTypes.MessageText
                          const Data = msg.Data
                          const payload = initMsg(Data)
                          payload.type = PUPPET.types.Message.ChatHistory
                          that.client.emit('message', payload)
                          break
                        }
                        case '2000':{
                          const msg = data as MessageTypes.MessageText
                          const Data = msg.Data
                          const payload = initMsg(Data)
                          payload.type = PUPPET.types.Message.Transfer
                          that.client.emit('message', payload)
                          break
                        }
                        case '2001':{
                          const msg = data as MessageTypes.MessageText
                          const Data = msg.Data
                          const payload = initMsg(Data)
                          payload.type = PUPPET.types.Message.RedEnvelope
                          that.client.emit('message', payload)
                          break
                        }
                        case '51':{
                          const msg = data as MessageTypes.MessageText
                          const Data = msg.Data
                          const payload = initMsg(Data)
                          payload.type = PUPPET.types.Message.Post
                          that.client.emit('message', payload)
                          break
                        }
                        default:
                          break
                      }
                    }
                  })
                } catch (err) {
                  logger.error('xml2js.parseString fail:', err)
                }
                that.client.emit('message', data)
                break
              }
              case 37:
                that.client.emit('notice', { data, typeCode:37, typeName:'好友添加请求通知' })
                break
              case 10002:
                try {
                  const xml = data.Data.Content.string
                  xml2js.parseString(String(xml), { explicitArray: false, ignoreAttrs: true }, function (err: any, json: any) {
                    logger.info('xml2json err', err)
                    logger.info('json content:', JSON.stringify(json))
                    if (json.sysmsg && json.sysmsg.type === 'revokemsg') {
                      that.client.emit('message', { typeCode:'10002-revokemsg', data, typeName:'撤回消息' })
                    }
                    if (json.sysmsg && json.sysmsg.type === 'pat') {
                      that.client.emit('message', { typeCode:'10002-pat', data, typeName:'拍一拍消息' })
                    }
                    if (json.sysmsg && json.sysmsg.type === 'sysmsgtemplate' && xml.indexOf('移出了群聊') !== -1) {
                      that.client.emit('message', { typeCode:'10002-sysmsgtemplate', data, typeName:'踢出群聊通知' })
                    }
                    if (json.sysmsg && json.sysmsg.type === 'sysmsgtemplate' && xml.indexOf('已解散该群聊') !== -1) {
                      that.client.emit('message', { typeCode:'10002-sysmsgtemplate', data, typeName:'解散群聊通知' })
                    }
                    if (json.sysmsg && json.sysmsg.type === 'mmchatroombarannouncememt') {
                      const msg = data as MessageTypes.MessageText
                      const Data = msg.Data
                      const payload = initMsg(Data)
                      payload.type = PUPPET.types.Message.GroupNote
                      that.client.emit('message', payload)
                    }
                    if (json.sysmsg && json.sysmsg.type === 'roomtoolstips') {
                      that.client.emit('message', { typeCode:'10002-roomtoolstips', data, typeName:'群待办' })
                    }
                  })
                } catch (err) {
                  logger.error('xml2js.parseString fail:', err)
                }
                that.client.emit('xxx', data)
                break
              case 10000:
                try {
                  const xml = data.Data.Content.string
                  xml2js.parseString(String(xml), { explicitArray: false, ignoreAttrs: true }, function (err: any, json: any) {
                    logger.info('xml2json err:', err)
                    logger.info('json content:', JSON.stringify(json))
                    if (xml.indexOf('移出群聊') !== -1) {
                      that.client.emit('notice', { data, typeCode:'10000', typeName:'被移除群通知' })
                    }
                    if (xml.indexOf('修改群名为') !== -1) {
                      that.client.emit('room-topic', data.Data.FromUserName.string)
                    }
                    if (xml.indexOf('已成为新群主') !== -1) {
                      that.client.emit('notice', { data, typeCode:'10000', typeName:'更换群主通知' })
                    }
                  })
                } catch (err) {
                  logger.error('xml2js.parseString fail:', err)
                }
                that.client.emit('xxx', data)
                break
              default:
                logger.error('Unknown message type:' + data.Data.MsgType)
                break
            }
            break
          }
          case 'ModContacts':{
            if (data.Data.UserName.string.indexOf('@') !== -1) {
              that.client.emit('notice', { data, typeCode:'ModContacts', typeName:'群信息变更通知' })
            } else {
              that.client.emit('notice', { data, typeCode:'ModContacts', typeName:'好友通过验证及好友资料变更的通知消息' })
            }
            break
          }
          case 'DelContacts':
            if (data.Data.UserName.string.indexOf('@') !== -1) {
              that.client.emit('notice', { data, typeCode:'DelContacts', typeName:'退出群聊通知' })
            } else {
              that.client.emit('notice', { data, typeCode:'DelContacts', typeName:'删除好友通知' })
            }
            break
          case 'Offline':
            that.client.emit('logout', data)
            break
          default:
            logger.error('Unknown type:' + data.TypeName)
            break
        }
      } else {
        logger.info('No TypeName found...')
      }
    } catch (error) {
      logger.error('handleCollectCallback failed:', error)
      throw error
    }
  }

  async getLoginQrCode () {
    console.info('getLoginQrCode')
    const that = this
    const res = {
      message: 'success',
      qrCode: '',
    }
    try {
      const qrCodeRes = await this.client.loginModule.getLoginQrCode()
      if (qrCodeRes.ret === 200) {
        res.qrCode = qrCodeRes.data.qrData
        that.uuid = qrCodeRes.data.uuid
        if (this.timer) {
          clearInterval(this.timer)
          log.info('clearInterval', this.timer)
        }
        this.timer = setInterval(() => {
          this.checkLogin(that.uuid).then((res) => {
            log.info('checkLogin', JSON.stringify(res))
            that.client.emit('scan', res)
            return res
          }).catch((error) => {
            log.error('checkLogin failed:' + error)
            throw error
          })
        }, 15000)
        log.info('setInterval', this.timer)
      }
    } catch (error) {
      console.error('getLoginQrCode failed:', error)
      res.message = 'failed'
    }
    log.info('getLoginQrCode', JSON.stringify(res, null, 2))
    return res
  }

  async checkLogin (uuid:string) {
    console.info('checkLogin')
    const res = {
      message: 'success',
      login: false,
    }
    try {
      const checkLoginRes = await this.client.loginModule.checkLogin(uuid)
      res.login = this.client.loginModule.isLogin
      if (res.login) {
        clearInterval(this.timer)
        log.info('clearInterval', this.timer)
      }
      return checkLoginRes
    } catch (error) {
      console.error('checkLogin failed:', error)
      res.message = 'failed'
    }
    log.info('checkLogin', JSON.stringify(res, null, 2))
    return res
  }

  async login () {
    console.info('login')
  }

  async logout () {
    console.info('logout')
    await this.client.accountModule.logout()
  }

  async reconnection () {
    console.info('reconnection')
  }

  async checkOnline () {
    const res = await this.client.accountModule.checkOnline()
    return res
  }

  async getProfile () {
    const res = await this.client.selfModule.getProfile()
    const selfInfoRaw = res.data
    const selfInfo: PUPPET.payloads.Contact = {
      alias: selfInfoRaw.alias,
      avatar: selfInfoRaw.bigHeadImgUrl,
      friend: false,
      gender: selfInfoRaw.sex,
      id: selfInfoRaw.wxid,
      name: selfInfoRaw.nickName,
      phone: [ selfInfoRaw.mobile ],
      type: PUPPET.types.Contact.Individual,
    }
    return selfInfo
  }

  async setCallbackHost (host: string): Promise<any> {
    log.info('setCallbackHost')
    const res = await this.client.setCallbackHost(host)
    return res
  }

  async setCallback (url?:string): Promise<any> {
    log.info('setCallback')
    const res = await this.client.setCallback(url)
    return res
  }

  async contactSelfQRCode () {
    console.info('contactSelfQRCode')
    const res = {
      message: 'success',
      qrCode: '',
    }
    try {
      const qrCodeRes = await this.client.selfModule.getQrCode()
      res.qrCode = qrCodeRes.data.qrCode
    } catch (error) {
      console.error('contactSelfQRCode failed:', error)
      res.message = 'failed'
    }
    log.info('contactSelfQRCode', JSON.stringify(res, null, 2))
    return res
  }

  async loadContactList () {
    log.info('bridge loadContactList')
    const res = {
      message: 'success',
      contactList: {},
    }
    try {
      const contactListRes = await this.client.contactsModule.fetchContactsList()
      const contactList: {
        [k: string]: PUPPET.payloads.Contact
      } = {}

      const friends = contactListRes.data.friends
      // 每次截取80个好友，查询信息
      for (let i = 0; i < friends.length; i += 80) {
        const wxids = friends.slice(i, i + 80)
        const briefInfoRes = await this.client.contactsModule.getBriefInfo(wxids)
        const friendList = briefInfoRes.data
        for (const i  in friendList) {
          const friend:GeweTypes.Friend = friendList[i]
          let contactType = PUPPET.types.Contact.Individual
          if (friend.userName.indexOf('gh_') !== -1) {
            contactType = PUPPET.types.Contact.Official
          }

          if (friend.userName.indexOf('@openim') !== -1) {
            contactType = PUPPET.types.Contact.Corporation
          }
          const contact = {
            alias: friend.remark,
            avatar: friend.bigHeadImgUrl || friend.smallHeadImgUrl,
            friend: true,
            gender: friend.sex,
            id: friend.userName,
            name: friend.nickName,
            phone: friend.phoneNumList || [],
            type: contactType,
          }
          contactList[friend.userName] = contact
        }
      }

      res.contactList = contactList
    } catch (error) {
      console.error('loadContactList failed:', error)
      res.message = 'failed'
    }
    log.info('loadContactList', JSON.stringify(res))
    return res
  }

  async loadRoomList () {
    log.info('bridge loadRoomList')
    const res = {
      message: 'success',
      roomList: {},
    }
    try {
      const roomListRes = await this.client.contactsModule.fetchContactsList()
      const chatrooms = roomListRes.data.chatrooms
      const roomList: {
        [k: string]: PUPPET.payloads.Room
      } = {}

      // 每次截取80个好友，查询信息
      for (let i = 0; i < chatrooms.length; i += 80) {
        const roomids = chatrooms.slice(i, i + 80)
        const briefInfoRes = await this.client.contactsModule.getBriefInfo(roomids)
        const roomRawList = briefInfoRes.data
        for (const i  in roomRawList) {
          const chatroom:GeweTypes.Friend = roomRawList[i]
          log.info('chatroom:', JSON.stringify(chatroom))
          const room = {
            adminIdList: [],
            avatar: chatroom.bigHeadImgUrl || chatroom.smallHeadImgUrl,
            external: false,
            id: chatroom.userName,
            memberIdList: [],
            ownerId: '',
            topic: chatroom.nickName,
          }
          roomList[chatroom.userName] = room
        }
      }

      for (const key in roomList) {
        const room = roomList[key] as PUPPET.payloads.Room
        const roomDetailRes = await this.client.groupsModule.getChatroomInfo(key)
        const chatroom:RoomTypes.Room = roomDetailRes.data
        const memberList = chatroom.memberList
        const memberIdList = memberList.map((member) => member.wxid)
        room.adminIdList = [ chatroom.chatRoomOwner ]
        room.memberIdList = memberIdList
        room.ownerId = chatroom.chatRoomOwner
        roomList[key] = room
      }

      res.roomList = roomList
      log.info('loadRoomList success:', JSON.stringify(res))
    } catch (error) {
      log.error('loadRoomList failed:', error)
      res.message = 'failed'
    }
    return res
  }

  async getRoomDetail (roomId: string) {
    log.info('getRoomDetail')
    const res = {
      message: 'success',
      roomDetail: {},
    }
    try {
      const roomDetailRes = await this.client.groupsModule.getChatroomInfo(roomId)
      const chatroom:RoomTypes.Room = roomDetailRes.data
      const memberList = chatroom.memberList
      const memberIdList = memberList.map((member) => member.wxid)
      const room = {
        adminIdList: [ chatroom.chatRoomOwner ],
        avatar: chatroom.smallHeadImgUrl || '',
        external: false,
        id: chatroom.chatroomId,
        memberIdList,
        ownerId: chatroom.chatRoomOwner,
        topic: chatroom.nickName,
      }
      res.roomDetail = room
      return room
    } catch (error) {
      console.error('getRoomDetail failed:', error)
      res.message = 'failed'
    }
    log.info('getRoomDetail', JSON.stringify(res, null, 2))
    return res
  }

  async getRoomMemberList (roomId: string) {
    log.info('bridge getRoomMemberList')

    const roomMemberListRes = await this.client.groupsModule.getChatroomMemberList(roomId)
    const memberList:RoomTypes.Member[] = roomMemberListRes.data.memberList
    const roomMemberList: PUPPET.payloads.Contact[] = []
    for (const i in memberList) {
      const member = memberList[i]
      const contact = {
        alias: '',
        avatar: member?.bigHeadImgUrl || member?.smallHeadImgUrl || '',
        friend: false,
        gender: PUPPET.types.ContactGender.Unknown,
        id: member?.wxid || '',
        name: member?.nickName || '',
        phone: [],
        type: PUPPET.types.Contact.Individual,
      }
      roomMemberList.push(contact)
    }
    return roomMemberList
  }

  async messageSendText (
    wxid: string,
    text: string,
    mentionIdList?: string[],
  ): Promise<void> {
    if (mentionIdList && mentionIdList[0]) {
      await this.client.messageModule.postText(wxid, text, mentionIdList.join(','))
    } else {
      await this.client.messageModule.postText(wxid, text)
    }
  }

  async messageSendFile (
    wxid: string,
    file: FileBoxInterface,
  ): Promise<void> {
    const fileUrl = JSON.parse(JSON.stringify(file.toJSON())).url
    const fileName = file.name
    try {
      await this.client.messageModule.postFile(wxid, fileUrl, fileName)
    } catch (error) {
      console.error('messageSendFile failed:', error)
      throw error
    }
  }

  async messageSendImage (
    wxid: string,
    file: FileBoxInterface,
  ): Promise<void> {
    try {
      const fileUrl = JSON.parse(JSON.stringify(file.toJSON())).url
      await this.client.messageModule.postImage(wxid, fileUrl)
    } catch (error) {
      console.error('messageSendImage failed:', error)
      throw error
    }
  }

  async messageSendVoice (
    wxid: string,
    file: FileBoxInterface,
  ): Promise<void> {
    try {
      const fileUrl = JSON.parse(JSON.stringify(file.toJSON())).url
      const voiceDuration = 10
      await this.client.messageModule.postVoice(wxid, fileUrl, voiceDuration)
    } catch (error) {
      console.error('messageSendVoice failed:', error)
      throw error
    }
  }

  async messageSendVideo (
    wxid: string,
    file: FileBoxInterface,
  ): Promise<void> {
    try {
      const fileUrl = JSON.parse(JSON.stringify(file.toJSON())).url
      const thumbUrl = ''
      const videoDuration = 10
      await this.client.messageModule.postVideo(wxid, fileUrl, thumbUrl, videoDuration)
    } catch (error) {
      console.error('messageSendImage failed:', error)
      throw error
    }
  }

  async messageSendContact (
    wxid: string,
    contactId: string,
  ): Promise<void> {
    try {
      const { data } = await this.client.contactsModule.getBriefInfo([ contactId ]) as any
      const nickName = data[0].nickName
      await this.client.messageModule.postNameCard(wxid, nickName, contactId)
    } catch (error) {
      console.error('messageSendContact failed:', error)
      throw error
    }
  }

  async messageSendUrl (
    wxid: string,
    urlLinkPayload: PUPPET.payloads.UrlLink,
  ): Promise<void> {

    try {
      await this.client.messageModule.postLink(wxid, urlLinkPayload.title, urlLinkPayload.description || '', urlLinkPayload.url, urlLinkPayload.thumbnailUrl || '')
    } catch (error) {
      console.error('messageSendUrl failed:', error)
      throw error
    }
  }

  async messageSendMiniProgram (
    wxid: string,
    miniProgramPayload: PUPPET.payloads.MiniProgram,
  ): Promise<void> {
    try {
      await this.client.messageModule.postMiniApp(
        wxid,
        miniProgramPayload.appid || '',
        miniProgramPayload.username || '',
        miniProgramPayload.title || '',
        miniProgramPayload.thumbUrl || '',
        miniProgramPayload.pagePath || '',
        miniProgramPayload.description || '')
    } catch (error) {
      console.error('messageSendMiniProgram failed:', error)
      throw error
    }
  }

  async messageSendLocation (
    wxid: string,
    locationPayload: PUPPET.payloads.Location,
  ): Promise<void | string> {
    console.info('messageSendLocation', wxid, locationPayload)
    throw new Error('Method not implemented.')
  }

  async messageForward (
    wxid: string,
    messageId: string,
    messageType?: PUPPET.types.Message,
  ): Promise<void> {
    console.info('messageForward', wxid, messageId)
    const xml = messageId
    const text = ''
    switch (messageType) {
      case PUPPET.types.Message.Attachment:
        await this.client.messageModule.forwardFile(wxid, xml)
        break
      case PUPPET.types.Message.Image:
        await this.client.messageModule.forwardImage(wxid, xml)
        break
      case PUPPET.types.Message.Video:
        await this.client.messageModule.forwardVideo(wxid, xml)
        break
      case PUPPET.types.Message.Url:
        await this.client.messageModule.forwardUrl(wxid, xml)
        break
      case PUPPET.types.Message.MiniProgram:{
        const coverImgUrl = ''
        await this.client.messageModule.forwardMiniApp(wxid, xml, coverImgUrl)
        break
      }
      case PUPPET.types.Message.Text:
        await this.client.messageModule.postText(wxid, text)
        break
      default:
        console.error('messageForward failed: messageType not supported')
        break
    }
  }

  addListener (eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.')
  }

  on (eventName: string | symbol, listener: (...args: any[]) => void): this {
    log.info('on event:', eventName)
    this.client.on(eventName, listener)
    return this
  }

  once (eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.')
  }

  removeListener (eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.')
  }

  off (eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.')
  }

  removeAllListeners (event?: string | symbol): this {
    throw new Error('Method not implemented.')
  }

  setMaxListeners (n: number): this {
    throw new Error('Method not implemented.')
  }

  getMaxListeners (): number {
    throw new Error('Method not implemented.')
  }

  listeners (eventName: string | symbol): Function[] {
    throw new Error('Method not implemented.')
  }

  rawListeners (eventName: string | symbol): Function[] {
    throw new Error('Method not implemented.')
  }

  emit (eventName: string | symbol, ...args: any[]): boolean {
    log.info('emit event:', eventName)
    return true
  }

  listenerCount (eventName: string | symbol, listener?: Function): number {
    throw new Error('Method not implemented.')
  }

  prependListener (eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.')
  }

  prependOnceListener (eventName: string | symbol, listener: (...args: any[]) => void): this {
    throw new Error('Method not implemented.')
  }

  eventNames (): Array<string | symbol> {
    throw new Error('Method not implemented.')
  }

}

export {
  Bridge,
}
