/* eslint-disable camelcase */
/* eslint-disable sort-keys */
/* eslint-disable no-console */
import WebSocket from 'ws'
import axios from 'axios'
import { EventEmitter } from 'events'
import { log } from 'wechaty-puppet'
import * as fs from 'fs'
// import * as PUPPET from 'wechaty-puppet'
// import xml2js from 'xml2js'
// import readXml from 'xmlreader'
// import cuid from 'cuid'

const HEART_BEAT = 5005 // 心跳
const RECV_TXT_MSG = 1 // 文本消息
const RECV_PIC_MSG = 3 // 图片消息
const SEND_FILE_MSG = 49 // 文件消息
const USER_LIST = 5000 // 微信联系人列表
const GET_USER_LIST_SUCCSESS = 5001 // 获取联系人列表成功
const GET_USER_LIST_FAIL = 5002 // 获取联系人列表失败
const TXT_MSG = 555 // 发送文本消息
const PIC_MSG = 500 // 发送图片消息
const AT_MSG = 550 // 发送AT消息
const CHATROOM_MEMBER = 5010 // 群成员列表
const CHATROOM_MEMBER_NICK = 5020 // 群成员昵称
const PERSONAL_INFO = 6500 // 个人信息
const DEBUG_SWITCH = 6000 // 调试开关
const PERSONAL_DETAIL = 6550 // 个人详细信息
const NEW_FRIEND_REQUEST = 37// 微信好友请求消息
const AGREE_TO_FRIEND_REQUEST = 10000// 同意微信好友请求消息
const ATTATCH_FILE = 5003 // 发送文件

enum ApiEndpoint {
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

/**
 * 定义用户账户信息接口
 */
interface AccountInfo {
  accountName: string; // 账户名
  city: string; // 城市
  country: string; // 国家，例如 "CN"
  /**
   * 数据库键
   * 例如: f97759071ea042f684bded816ac4018dce83e7ba03bd420fb250d49cd49fc1ce
   */
  dbKey: string;
  nickname: string; // 昵称，例如 "瓦力"
  phone: string; // 电话号码，例如 "15600160103"
  phoneSystem: string; // 手机系统，例如 "android"
  privateKey: string; // 私钥
  /**
   * 用户头像URL
   * 例如: https://wx.qlogo.cn/mmhead/ver_1/sY4icwfC7Tu8IZzR5Cddia3qrXQ25v26ibrfTxC31bjQXorsBFnZGGGoVJeXYDPB67ic2rlibEL0d373iaAMkzPmTpaB8H1JXRicJcokEiaONTWOCic0/132
   */
  profilePicture: string;
  province: string; // 省份，例如 "Beijing"
  publicKey: string; // 公钥
  signature: string; // 签名
  wxid: string; // 微信ID，例如 "wxid_pnza7m7kf9tq12"
}

// 联系人
interface ContactRaw {
  Alias: string; // 别名
  BigHeadImgUrl: string; // 大头像URL
  ChatRoomNotify: string; // 聊天室通知设置
  ChatRoomType: string; // 聊天室类型
  DelFlag: string; // 删除标记
  DomainList: string; // 域名列表
  EncryptUserName: string; // 加密用户名
  /**
   * 额外的缓冲信息
   * 例如: 3fMmgwQCAAAAdHUsBgQAAAAAiOKPzgQAAAAAdhodLRgCAAAAAAACY6DLBAAAAAAEUf8SGAIAAAAAACKMZqgEAAAAAEbPEMQYAgAAAAAApNkCShgCAAAAAADi6qjRGAIAAAAAAB0CW78YAgAAAAAATWxFcAQAAAAA+Re8wBgCAAAAAABDNd/dGAIAAAAAAN5M2usYAgAAAAAApyvCCgT/////Bp/tUgQCAAAAmw9CmQQAAAAAPWQeIgQAAAAAEkmCLAQAAAAATrlthRgCAAAAAAC09zrLBAAAAAAJWeuSBAAAAAA89KMVGAIAAAAAAMlHesYCAeRM0OgEAAAAALes8PUEAAAAAFentagFAAAAAAAAAACBrhm0GAIAAAAAAGlfMXAYAgAAAAAA+wg92RgCAAAAAAACQON/GAIAAAAAADFdAqMYAgAAAAAAfewLwxgCAAAAAAAOcZ8TGAIAAAAAABZ5HJAXAgAAAAoA
   */
  ExtraBuf: string;
  HeadImgMd5: string; // 头像MD5
  LabelIDList: string; // 标签ID列表
  /**
   * 用户昵称
   * 例如: 双语互译聊天&顺风车消息检测
   */
  NickName: string;
  PYInitial: string; // 拼音缩写
  QuanPin: string; // 全拼
  Remark: string; // 备注
  RemarkPYInitial: string; // 备注的拼音缩写
  RemarkQuanPin: string; // 备注的全拼
  Reserved1: string; // 预留字段1
  Reserved10: string; // 预留字段10
  Reserved11: string; // 预留字段11
  Reserved2: string; // 预留字段2
  Reserved3: string; // 预留字段3
  Reserved4: string; // 预留字段4
  Reserved5: string; // 预留字段5
  Reserved6: string; // 预留字段6
  Reserved7: string; // 预留字段7
  Reserved8: string; // 预留字段8
  Reserved9: string; // 预留字段9
  SmallHeadImgUrl: string; // 小头像URL
  Type: string; // 类型
  UserName: string; // 用户名
  VerifyFlag: string; // 验证标记
  profilePicture: string; // 配置文件图片
  profilePictureSmall: string; // 小配置文件图片
}

type RoomRaw = {
  Alias: string; // 别名
  BigHeadImgUrl: string; // 大头像URL
  ChatRoomNotify: string; // 聊天室通知设置
  ChatRoomType: string; // 聊天室类型
  DelFlag: string; // 删除标记
  DomainList: string; // 域名列表
  EncryptUserName: string; // 加密用户名
  /**
   * 额外的缓冲信息
   * 例如: 3fMmgwQCAAAAdHUsBgQAAAAAiOKPzgQAAAAAdhodLRgCAAAAAAACY6DLBAAAAAAEUf8SGAIAAAAAACKMZqgEAAAAAEbPEMQYAgAAAAAApNkCShgCAAAAAADi6qjRGAIAAAAAAB0CW78YAgAAAAAATWxFcAQAAAAA+Re8wBgCAAAAAABDNd/dGAIAAAAAAN5M2usYAgAAAAAApyvCCgT/////Bp/tUgQCAAAAmw9CmQQAAAAAPWQeIgQAAAAAEkmCLAQAAAAATrlthRgCAAAAAAC09zrLBAAAAAAJWeuSBAAAAAA89KMVGAIAAAAAAMlHesYCAeRM0OgEAAAAALes8PUEAAAAAFentagFAAAAAAAAAACBrhm0GAIAAAAAAGlfMXAYAgAAAAAA+wg92RgCAAAAAAACQON/GAIAAAAAADFdAqMYAgAAAAAAfewLwxgCAAAAAAAOcZ8TGAIAAAAAABZ5HJAXAgAAAAoA
   */
  ExtraBuf: string;
  HeadImgMd5: string; // 头像MD5
  LabelIDList: string; // 标签ID列表
  /**
   * 用户昵称
   * 例如: 双语互译聊天&顺风车消息检测
   */
  NickName: string;
  PYInitial: string; // 拼音缩写
  QuanPin: string; // 全拼
  Remark: string; // 备注
  RemarkPYInitial: string; // 备注的拼音缩写
  RemarkQuanPin: string; // 备注的全拼
  Reserved1: string; // 预留字段1
  Reserved10: string; // 预留字段10
  Reserved11: string; // 预留字段11
  Reserved2: string; // 预留字段2
  Reserved3: string; // 预留字段3
  Reserved4: string; // 预留字段4
  Reserved5: string; // 预留字段5
  Reserved6: string; // 预留字段6
  Reserved7: string; // 预留字段7
  Reserved8: string; // 预留字段8
  Reserved9: string; // 预留字段9
  SmallHeadImgUrl: string; // 小头像URL
  Type: string; // 类型
  UserName: string; // 用户名
  VerifyFlag: string; // 验证标记
  profilePicture: string; // 配置文件图片
  profilePictureSmall: string; // 小配置文件图片
}

interface ResponseData {
  code: number; // 状态码，例如 200
  data: any; // 用户数据，当前为空对象
  msg: string; // 响应消息，例如 "success"
}

interface ContentRaw {
  content: string;
  detail: string;
  id1: string;
  id2: string;
  thumb: string;
}

interface MessageRaw {
 BytesExtra: string; // 额外字节
 BytesTrans: string; // 传输字节
 CompressContent?: string; // 压缩内容
 Content?: string; // 内容
 CreateTime: string; // 创建时间戳，例如 "1706701261"
 DisplayContent: string; // 显示内容
 FlagEx: string; // 扩展标记
 IsSender: string; // 是否为发送者，"0" 表示否，"1" 表示是
 MsgSequence: string; // 消息序列，例如 "773293755"
 MsgServerSeq: string; // 消息服务器序列，例如 "1"
 MsgSvrID: string; // 消息服务器ID，例如 "7239265696580383054"
 Reserved0: string; // 预留字段0
 Reserved1: string; // 预留字段1
 Reserved2: string; // 预留字段2
 Reserved3: string; // 预留字段3
 Reserved4: string; // 预留字段4
 Reserved5: string; // 预留字段5
 Reserved6: string; // 预留字段6
 Sender?: string; // 发送者ID，例如 "wxid_7ifvg0p9vkja22"
 Sequence: string; // 序列，例如 "1706701261000"
 Status: string; // 状态，例如 "2"
 StatusEx: string; // 扩展状态，例如 "0"
 StrContent: string; // 字符串内容
 StrTalker: string; // 说话者，例如 "22864238295@chatroom"
 SubType: string; // 子类型，例如 "0"
 TalkerId: string; // 说话者ID，例如 "5"
 Type: string; // 类型，例如 "1"
 localId: string; // 本地ID，例如 "7850"
}

const getid = () => {
  const id = Date.now()
  return id.toString()
}

class Bridge extends EventEmitter {

  private wsUrl: string

  private httpUrl: string

  ws: WebSocket

  messageTypeTest: any = {}

  currentUserId = ''

  contactList: ContactRaw[] = []

  roomList: RoomRaw[] = []

  isLoggedIn = false

  constructor (options?: {
    wsUrl?: string
    httpUrl?: string
  }) {
    super()
    const that = this
    this.wsUrl = options?.wsUrl ? `${options.wsUrl}/ws/generalMsg` : 'ws://127.0.0.1:8080/ws/generalMsg'
    this.httpUrl = options?.httpUrl ? `${options.httpUrl}` : 'http://127.0.0.1:8080'
    this.ws = new WebSocket(this.wsUrl)

    // 检测根目录下是否有msgStore.json文件，如果没有，则创建一个，内容为{}
    if (!fs.existsSync('msgStore.json')) {
      console.log('msgStore.json not exist')
      fs.writeFileSync('msgStore.json', '{}')
    } else {
      console.log('msgStore.json is exist')
    }

    // 收集消息类型，临时保存到文件'/msgStore.json'
    this.messageTypeTest = JSON.parse(fs.readFileSync('msgStore.json', 'utf-8'))

    this.ws.on('error', (error: Error) => {
      log.error('WebSocket error:', error)
    })
    this.ws.on('open', function open () {
      log.info('WebSocket connection established')
      that.isLoggedIn = true
      that.emit('login', 'login')
    })

    this.ws.on('message', function incoming (data: string) {

      // log.info('WebSocket received:', data.toString())
      data = data.toString()

      try {
        const dataJSON = JSON.parse(data)
        that.currentUserId = dataJSON.wxid
        const jList: MessageRaw[] = dataJSON.data

        for (const j of jList) {
          const type = Number(j.Type)
          let key = j.Type
          log.info('ws message hook:', type)
          log.info(JSON.stringify(j, undefined, 2))

          const subType = j.SubType
          try {
            if (subType) {
              key = key + '_' + subType
            }
          } catch (e) {
            log.error('ws message hook error:', e)
          }

          if (type === 10000) {
            const list10000 = that.messageTypeTest['10000'] || []
            list10000.push(j)
            that.messageTypeTest[key] = list10000
          } else {
            that.messageTypeTest[key] = j
          }

          // 将that.messageTypeTest保存到文件'/msgStore.json'
          fs.writeFileSync('msgStore.json', JSON.stringify(that.messageTypeTest, undefined, 2))

          switch (type) {
            case CHATROOM_MEMBER_NICK:
              log.info('群成员昵称')
              break
            case PERSONAL_DETAIL:
              log.info('个人详细信息')
              break
            case AT_MSG:
              log.info('AT消息')
              break
            case DEBUG_SWITCH:
              log.info('调试开关')
              break
            case PERSONAL_INFO:
              log.info('个人信息')
              break
            case TXT_MSG:
              log.info('文本消息')
              break
            case PIC_MSG:
              log.info('图片消息')
              break
            case CHATROOM_MEMBER:
              log.info('群成员列表')
              break
            case RECV_PIC_MSG:
              log.info('图片消息')
              that.handleReceiveMessage(j)
              break
            case SEND_FILE_MSG:
              log.info('文件消息')
              that.handleReceiveMessage(j)
              break
            case ATTATCH_FILE:
              log.info('文件消息')
              that.handleReceiveMessage(j)
              break
            case RECV_TXT_MSG:
              log.info('收到文本消息')
              that.handleReceiveMessage(j)
              break
            case HEART_BEAT:
              log.info('心跳')
              that.handleHeartbeat(j)
              break
            case USER_LIST:
              log.info('微信联系人列表')
              break
            case GET_USER_LIST_SUCCSESS:
              log.info('获取联系人列表成功')
              break
            case GET_USER_LIST_FAIL:
              log.info('获取联系人列表失败')
              break
            case NEW_FRIEND_REQUEST:
              log.info('微信好友请求消息')
              break
            case AGREE_TO_FRIEND_REQUEST:
              log.info('系统通知消息')
              break
            // case messageSendText_SUCCSESS:
            // handleReceiveMessage(j);
            // break;
            // case messageSendText_FAIL:
            // handleReceiveMessage(j);
            // break;
            default:
              break
          }
        }
      } catch (e) {
        log.error('WebSocket received error:', e)
      }
    })

    this.ws.on('close', () => {
      log.info('WebSocket connection closed')
      that.isLoggedIn = false
      that.emit('logout', 'logout')
      // reconnect after 1s
      setTimeout(() => {
        this.ws = new WebSocket(this.wsUrl)
      }, 1000)
    })

    this.ws.on('error', (err) => {
      log.info('WebSocket error:', err)
      that.emit('error', err)
    })
  }

  // 处理消息hook
  handleReceiveMessage (messageRaw: MessageRaw) {
    // log.info('handleReceiveMessage...:', messageRaw)
    this.emit('message', messageRaw)
  }

  // 处理心跳消息
  handleHeartbeat (j: any) {
    this.emit('heartbeat', j)
    // log.info(utf16ToUtf8(wxid),utf16ToUtf8(name));
  }

  // 1.获取登录微信信息
  async getPersonalInfo () {
    const options = {
      url: this.httpUrl + ApiEndpoint.UserInfo,
      body: {},
      json: true,
    }
    const res = await axios.get(options.url)
    const data: ResponseData = res.data
    return data
  }

  // 2.发送文本消息
  async messageSendText (wxid: string, content: string) {
    const jpara = {
      // id: getid(),
      // type: TXT_MSG,
      wxid, // roomid或wxid,必填
      // roomid: 'null', // 此处为空
      content,
      // nickname: 'null', // 此处为空
      // ext: 'null', // 此处为空
      // wxid:'22428457414@chatroom'
    }
    const options
      = {
      // method: 'GET',
      // url: 'https://apis.map.qq.com/ws/district/v1/list',
        url: this.httpUrl + ApiEndpoint.SendTxtMsg,
        body: jpara,
        json: true,
      }
    const res = await axios.post(options.url, options.body)
    console.log('messageSendText res:', res.data)
    return res.data

  }

  // 3.发送@文本
  async messageSendTextAt (roomid: string, wxid: string[], content: string, nickname: string[]) {
    const atName = nickname.map((name) => `@${name}`).join(' ')
    const jpara = {
      // id: getid(),
      // type: AT_MSG,
      // roomid, // not null  23023281066@chatroom
      wxid: roomid, // not null
      content: `@${atName} ${content}`, // not null
      atlist: wxid,
      // ext: 'null',
    }
    const options
      = {
      // method: 'GET',
      // url: 'https://apis.map.qq.com/ws/district/v1/list',
        url: this.httpUrl + ApiEndpoint.SendTxtMsg,
        body: jpara,
        json: true,
      }
    const res = await axios.post(options.url, options.body)
    console.log('messageSendTextAt res:', res.data)
    return res.data
  }

  // 5.发送图片
  async messageSendPicture (wxid: string, content: string) {

    const jpara = {
      wxid, // roomid或wxid,必填
      path: content, // 此处为空
    }
    const headers = {
      'Content-Type': 'application/json',
    }
    const options
      = {
      // method: 'GET',
      // url: 'https://apis.map.qq.com/ws/district/v1/list',
        url: this.httpUrl + ApiEndpoint.SendImgMsg,
        body: jpara,
        json: true,

      }
    const res = await axios.post(options.url, options.body, { headers })
    return res.data
  }

  // 6.发送文件
  async messageSendFile (wxid: string, content: string) {

    const jpara = {
      wxid, // roomid或wxid,必填
      path: content, // 此处为空
    }
    const headers = {
      'Content-Type': 'application/json',
    }
    const options
      = {
      // method: 'GET',
      // url: 'https://apis.map.qq.com/ws/district/v1/list',
        url: this.httpUrl + ApiEndpoint.SendFileMsg,
        body: jpara,
        json: true,

      }
    const res = await axios.post(options.url, options.body, { headers })
    const data: ResponseData = res.data
    return data
  }

  // 25.获取群成员
  async getMemberid () {

    const jpara = {
      id: getid(),
      type: CHATROOM_MEMBER,
      wxid: 'null',
      content: 'op:list member',
    }

    const options = {
      url: this.httpUrl + '/api/getmemberid',
      body: {
        para: jpara,
      },
      json: true,
    }
    const res = await axios.post(options.url, options.body)
    return res.data
  }

  // 26.获取群成员昵称
  async getMemberNickName (wxid: string, roomid: string) {
    const jpara = {
      id: getid(),
      type: CHATROOM_MEMBER_NICK,
      wxid,
      roomid,
      content: 'null',
      nickname: 'null',
      ext: 'null',
      // wxid:'22428457414@chatroom'

    }
    const options
      = {

        url: this.httpUrl + '/api/getmembernick',
        body: {
          para: jpara,
        },
        json: true,
      }
    const res = await axios.post(options.url, options.body)
    const data: ResponseData = res.data

    // log.info(j.id);
    // log.info(j.status);
    return data
  }

  // 40.转发消息
  async messageForward (wxid: string, msgId: string) {
    const jpara = {
      wxid,
      msgId,
    }
    const options
      = {
        url: this.httpUrl + ApiEndpoint.ForwardMsg,
        body: jpara,
        json: true,
      }
    const res = await axios.post(options.url, options.body)
    const data: ResponseData = res.data
    return data
  }

  // 46.联系人列表
  async getContactList () {
    // const jpara = {
    //   id: getid(),
    //   type: USER_LIST,
    //   roomid: 'null', // null
    //   wxid: 'null', // not null
    //   content: 'null', // not null
    //   nickname: 'null',
    //   ext: 'null',
    // }
    const options = {
      url: this.httpUrl + ApiEndpoint.DbContacts,
      body: {},
      json: true,
    }
    const res = await axios.get(options.url)
    // log.info('getContactList res:', JSON.stringify(res.data))
    const data: ResponseData = res.data
    return data
  }

  // 47.获取群详情
  async getRoomList (wxid: string) {
    try {
      // const jpara = {
      //   id: getid(),
      //   type: CHATROOM_MEMBER,
      //   roomid: 'null', // null
      //   wxid: 'null', // not null
      //   content: 'null', // not null
      //   nickname: 'null',
      //   ext: 'null',
      // }
      const options = {
        url: this.httpUrl + `${ApiEndpoint.DbChatRoom}?wxid=${wxid}`, //
        body: {},
        json: true,
      }
      const res = await axios.get(options.url)
      // log.info('getRoomList res:', JSON.stringify(res.data))
      const data:ResponseData = res.data
      return data
      // const rooms: RoomRaw[] = res.data.content
      // return rooms
    } catch (e) {
      log.error('getRoomList error:', e)
      return undefined
    }

  }

}

export { Bridge }

export type {
  ContactRaw,
  RoomRaw,
  ResponseData,
  MessageRaw,
  ContentRaw,
  AccountInfo,
}
