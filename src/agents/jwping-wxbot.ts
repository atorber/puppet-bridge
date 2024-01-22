/* eslint-disable camelcase */
/* eslint-disable sort-keys */
/* eslint-disable no-console */
import WebSocket from 'ws'
import axios from 'axios'
import { EventEmitter } from 'events'
import type {
  ContactRaw,
  RoomRaw,
  ResponseData,
} from '../types.js'
import { log } from 'wechaty-puppet'
import * as fs from 'fs'
import * as PUPPET from 'wechaty-puppet'
import xml2js from 'xml2js'
import readXml from 'xmlreader'
import cuid from 'cuid'

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
const DESTROY_ALL = 9999 // 销毁进程
const NEW_FRIEND_REQUEST = 37// 微信好友请求消息
const AGREE_TO_FRIEND_REQUEST = 10000// 同意微信好友请求消息
const ATTATCH_FILE = 5003 // 发送文件

/**
 * 定义微信消息的类型
 */
type MessageRaw = {
  BytesExtra: string; // 额外的字节信息，通常是一些编码或加密的内容
  BytesTrans: string; // 翻译的字节信息，如果有的话
  Content: string; // 消息内容，格式为 XML
  CreateTime: string; // 消息创建的时间戳
  DisplayContent: string; // 展示的消息内容，如果有的话
  FlagEx: string; // 额外的标志信息
  IsSender: string; // 是否是发送者，'0' 表示不是，'1' 表示是
  MsgSequence: string; // 消息序列号
  MsgServerSeq: string; // 服务器端的消息序列号
  MsgSvrID: string; // 服务器端的消息 ID
  Reserved0: string; // 保留字段0
  Reserved1: string; // 保留字段1
  Reserved2: string; // 保留字段2
  Reserved3: string; // 保留字段3
  Reserved4: string; // 保留字段4
  Reserved5: string; // 保留字段5
  Reserved6: string; // 保留字段6
  Sequence: string; // 序列号
  Sender?:string;
  Status: string; // 状态
  StatusEx: string; // 额外的状态信息
  StrContent: string; // 字符串形式的内容
  StrTalker: string; // 发言者的标识
  SubType: string; // 消息的子类型
  TalkerId: string; // 发言者的 ID
  Type: string; // 消息类型
  localId: string; // 本地 ID
};

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

  isLoggedIn = false

  constructor (options: {
    wsUrl?: string
    httpUrl?:string
  }) {
    super()
    const that = this
    this.wsUrl = options.wsUrl ? `${options.wsUrl}/ws/generalMsg` : 'ws://127.0.0.1:8080/ws/generalMsg'
    this.httpUrl = options.httpUrl ? `${options.httpUrl}/api` : 'http://127.0.0.1:8080/api'
    this.ws = new WebSocket(this.wsUrl)

    // 收集消息类型，临时保存到文件'/messageTypeTest.json'
    this.messageTypeTest = JSON.parse(fs.readFileSync('examples/messageTypeTest.json', 'utf-8'))
    this.ws.on('error', (error: Error) => {
      log.error('WebSocket error:', error)
    })
    this.ws.on('open', function open () {
      log.info('WebSocket connection established')
      that.isLoggedIn = true
      that.emit('login', 'login')

      // ws.send(send_attatch());
      // ws.send("hello world");
      // ws.send(destroy_all());
      // ws.send(get_chat_nick_p("zhanghua_cd","23023281066@chatroom"));
      // for(const item of roomid_list)
      // {
      // log.info(item);
      // ws.send(get_chat_nick_p(item));
      // }
      // ws.send(get_chat_nick());
      that.ws.send(that.get_personal_info())
      // ws.send(send_pic_msg());
      // ws.send(send_txt_msg());
      // ws.send(get_chatroom_memberlist());
      // ws.send(send_at_msg());

      // ws.send(get_personal_detail());
      // ws.send(debug_switch()
      // ws.send(send_wxuser_list());
      // ws.send(send_txt_msg());

      /** 获取chatroom 成员昵称
       * ws.send(get_chat_nick());
       */

      /**  通过wxid获取好友详细细腻
       * ws.send(get_personal_detail());
       */

      /** debugview调试信息开关，默认为关
       * ws.send(debug_switch());
       */

      /** 获取微信个人信息
       * ws.send(get_personal_info());
       */

      /** 获取群好友列表
       * ws.send(get_chatroom_memberlist());
       */

      /** 发送群AT消息
       * ws.send(send_at_msg());
       */

      /** 获取微信通讯录好友列表
       * ws.send(send_wxuser_list());
       */
      /** 向你的好友发送微信文本消息
       * ws.send(send_txt_msg());
       */

      /** 向你的好友发送图片
       * ws.send(send_pic_msg());
       */
      /* 发送信息调用上面两个函数即可，可自行改造 */

      // ws.send(send_pic_msg());
      // ws.send(send_txt_msg());

    })

    this.ws.on('message', function incoming (data: string) {
      // log.info('WebSocket received:', data.toString())
      data = data.toString()
      const dataJSON = JSON.parse(data)
      that.currentUserId = dataJSON.wxid
      const jList:any[] = dataJSON.data

      for (const j of jList) {
        let type = j.Type
        log.info('ws message hook:', type)
        log.info(JSON.stringify(j, undefined, 2))

        const subType = j.SubType
        try {
          if (subType) {
            type = type + '_' + subType
          }
        } catch (e) {
          log.error('ws message hook error:', e)
        }

        if (type === 10000) {
          const list10000 = that.messageTypeTest['10000'] || []
          list10000.push(j)
          that.messageTypeTest[type] = list10000
        } else {
          that.messageTypeTest[type] = j
        }

        // 将that.messageTypeTest保存到文件'/messageTypeTest.json'
        fs.writeFileSync('examples/messageTypeTest.json', JSON.stringify(that.messageTypeTest, undefined, 2))

        switch (type) {
          case CHATROOM_MEMBER_NICK:
            log.info('群成员昵称')
            // handle_nick(j);
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
            that.handle_memberlist(j)
            break
          case RECV_PIC_MSG:
            log.info('图片消息')
            that.handle_recv_msg(j)
            break
          case SEND_FILE_MSG:
            log.info('文件消息')
            that.handle_recv_msg(j)
            break
          case RECV_TXT_MSG:
            log.info('收到文本消息')
            that.handle_recv_msg(j)
            break
          case HEART_BEAT:
            log.info('心跳')
            that.heartbeat(j)
            break
          case USER_LIST:
            log.info('微信联系人列表')
            // handle_wxuser_list(j);
            break
          case GET_USER_LIST_SUCCSESS:
            log.info('获取联系人列表成功')
            that.handle_wxuser_list(j)
            break
          case GET_USER_LIST_FAIL:
            log.info('获取联系人列表失败')
            that.handle_wxuser_list(j)
            break
          case NEW_FRIEND_REQUEST:
            log.info('微信好友请求消息')

            // {
            //   content: { content: '"77"邀请"田国发"加入了群聊', id1: '22232811504@chatroom' },
            //   id: '20240121160114',
            //   receiver: 'CLIENT',
            //   sender: 'SERVER',
            //   srvid: 1,
            //   status: 'SUCCSESSED',
            //   time: '2024-01-21 16:01:14',
            //   type: 10000
            // }
            log.info(j)
            break
          case AGREE_TO_FRIEND_REQUEST:
            log.info('系统通知消息')

            // {
            //   "content": {
            //     "content": "群收款消息，请在手机上查看",
            //     "id1": "22232811504@chatroom"
            //   },
            //   "id": "20240121202300",
            //   "receiver": "CLIENT",
            //   "sender": "SERVER",
            //   "srvid": 1,
            //   "status": "SUCCSESSED",
            //   "time": "2024-01-21 20:23:00",
            //   "type": 10000
            // }

            // {
            //   "content": {
            //     "content": "\"大牛\"修改群名为“大牛羽毛球活动群”",
            //     "id1": "20409849030@chatroom"
            //   },
            //   "id": "20240121201745",
            //   "receiver": "CLIENT",
            //   "sender": "SERVER",
            //   "srvid": 1,
            //   "status": "SUCCSESSED",
            //   "time": "2024-01-21 20:17:45",
            //   "type": 10000
            // }

            // {
            //   content: { content: '收到红包，请在手机上查看', id1: '925360650@chatroom' },
            //   id: '20240121161956',
            //   receiver: 'CLIENT',
            //   sender: 'SERVER',
            //   srvid: 1,
            //   status: 'SUCCSESSED',
            //   time: '2024-01-21 16:19:56',
            //   type: 10000
            // }

            // {
            //   content: {
            //     content: '"田国发"与群里其他人都不是朋友关系，请注意隐私安全',
            //     id1: '22232811504@chatroom'
            //   },
            //   id: '20240121160114',
            //   receiver: 'CLIENT',
            //   sender: 'SERVER',
            //   srvid: 1,
            //   status: 'SUCCSESSED',
            //   time: '2024-01-21 16:01:14',
            //   type: 10000
            // }
            break
          // case SEND_TXT_MSG_SUCCSESS:
          // handle_recv_msg(j);
          // break;
          // case SEND_TXT_MSG_FAIL:
          // handle_recv_msg(j);
          // break;
          default:
            break
        }
        // log.info(`Roundtrip time: ${Date.now() - data} ms`);

        /* setTimeout(function timeout() {
          ws.send(Date.now());
        }, 500); */
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

  /**
 *
 * @param {*} j json对象
 */
  handle_recv_msg (messageRaw: MessageRaw) {
    let type = PUPPET.types.Message.Unknown
    let roomId = ''
    let toId = ''
    let talkerId = messageRaw.Sender || ''
    const wxid = messageRaw.StrTalker || ''
    let text = messageRaw.StrContent
    const code = Number(messageRaw.Type)
    const xml = messageRaw.Content
    switch (code) {
      case 1:
        try {
          xml2js.parseString(String(xml), { explicitArray: false, ignoreAttrs: true }, function (err: any, json: any) {
            log.verbose('PuppetBridge', 'xml2json err:%s', err)
            //  log.verbose('PuppetBridge', 'json content:%s', JSON.stringify(json))
            if (json.msgsource && json.msgsource.atuserlist === 'atuserlist') {
              type = PUPPET.types.Message.GroupNote
            } else {
              type = PUPPET.types.Message.Text
            }
          })
        } catch (err) {
          log.error('xml2js.parseString fail:', err)
        }
        break
      case 3:
        type = PUPPET.types.Message.Image
        // 图片地址暂未获得
        text = JSON.stringify([ 'content.thumb', 'content.thumb', 'content.detail', 'content.thumb' ])
        break
      case 4:
        type = PUPPET.types.Message.Video
        break
      case 5:
        type = PUPPET.types.Message.Url
        break
      case 34:
        type = PUPPET.types.Message.Audio
        break
      case 37:
        break
      case 40:
        break
      case 42:
        type = PUPPET.types.Message.Contact
        break
      case 43:
        type = PUPPET.types.Message.Video
        break
      case 47:
        type = PUPPET.types.Message.Emoticon
        try {
          readXml.read(xml, function (errors: any, xmlResponse: any) {
            if (errors !== null) {
              log.error(errors)
              return
            }
            const xml2json = xmlResponse.msg.emoji.attributes()
            //  log.info('xml2json', xml2json)
            text = JSON.stringify(xml2json)
          })

        } catch (err) {
          log.error('xml2js.parseString fail:', err)
        }
        break
      case 48:
        type = PUPPET.types.Message.Location
        break
      case 49:
        try {
          xml2js.parseString(xml, { explicitArray: false, ignoreAttrs: true }, function (err: any, json: { msg: { appmsg: { type: String } } }) {
            // log.error('xml2js.parseString fail:', err)
            // log.info(JSON.stringify(json))
            log.error('PuppetBridge', 'xml2json err:%s', err)
            log.info('PuppetBridge', 'json content:%s', JSON.stringify(json))
            switch (json.msg.appmsg.type) {
              case '5':
                type = PUPPET.types.Message.Url
                break
              case '4':
                type = PUPPET.types.Message.Url
                break
              case '1':
                type = PUPPET.types.Message.Url
                break
              case '6': // 文件
                type = PUPPET.types.Message.Attachment
                text = xml
                break
              case '19':
                type = PUPPET.types.Message.ChatHistory
                break
              case '33':
                type = PUPPET.types.Message.MiniProgram
                break
              case '2000':
                type = PUPPET.types.Message.Transfer
                break
              case '2001':
                type = PUPPET.types.Message.RedEnvelope
                break
              case '10002':
                type = PUPPET.types.Message.Recalled
                break
              default:
            }
          })
        } catch (err) {
          log.error('xml2js.parseString fail:', err)
        }
        break
      case 50:
        break
      case 51:
        break
      case 52:
        break
      case 53:
        type = PUPPET.types.Message.GroupNote
        break
      case 62:
        break
      case 9999:
        break
      case 10000:
        // 群事件
        //  type = PUPPET.types.Message.Unknown
        break
      case 10002:
        type = PUPPET.types.Message.Recalled
        break
      case 1000000000:
        type = PUPPET.types.Message.Post
        break
      default:
    }

    if (wxid.split('@').length !== 2) {
      toId = this.currentUserId
      talkerId = wxid
    } else {
      roomId = wxid
    }

    // revert talkerId and toId according to isMyMsg
    if (code === 1) {
      toId = talkerId
      talkerId = this.currentUserId
    }

    const payload: PUPPET.payloads.Message = {
      id: cuid(),
      listenerId: toId,
      roomId,
      talkerId,
      text,
      timestamp: Date.now(),
      // toId,
      type,
    }

    try {
      if (this.isLoggedIn) {
        if (code === 10000) {
          // 你邀请"瓦力"加入了群聊
          // "超超超哥"邀请"瓦力"加入了群聊
          // "luyuchao"邀请"瓦力"加入了群聊
          // "超超超哥"邀请你加入了群聊，群聊参与人还有：瓦力

          // 你将"瓦力"移出了群聊
          // 你被"luyuchao"移出群聊

          // 你修改群名为“瓦力专属”
          // 你修改群名为“大师是群主”
          // "luyuchao"修改群名为“北辰香麓欣麓园抗疫”

          //  log.info('room=========================', room)
          let topic = ''
          if (text.indexOf('修改群名为') !== -1) {
            const arrInfo = text.split('修改群名为')
            if (arrInfo[0]) {
              topic = arrInfo[1]?.split(/“|”|"/)[1] || ''
              //  topic = arrInfo[1] || ''
              if (arrInfo[0] === '你') {
                //  changer = this.selfInfo
              } else {
                const name = arrInfo[0].split(/“|”|"/)[1] || ''
                log.info('name', name)
              }
            }
            //  log.info(room)
            //  log.info(changer)
            //  log.info(oldTopic)
            //  log.info(topic)
            const changerId = ''
            const oldTopic = ''
            this.emit('room-topic', { changerId, newTopic: topic, oldTopic, roomId })

          }
          if (text.indexOf('加入了群聊') !== -1) {
            const inviteeList = []
            const inviter = { id:'' }
            const arrInfo = text.split(/邀请|加入了群聊/)

            if (arrInfo[0]) {
              topic = arrInfo[0]?.split(/“|”|"/)[1] || ''
              if (arrInfo[0] === '你') {
                //  changer = this.selfInfo
              } else {
                const name = arrInfo[0].split(/“|”|"/)[1] || ''
                log.info('name', name)
              }
            }

            if (arrInfo[1]) {
              topic = arrInfo[1]?.split(/“|”|"/)[1] || ''
              if (arrInfo[1] === '你') {
                inviteeList.push('this.selfInfo.id')
              } else {
                const name = arrInfo[1].split(/“|”|"/)[1] || ''
                log.info('name', name)

              }
            }
            //  log.info(inviteeList)
            //  log.info(inviter)
            //  log.info(room)

            this.emit('room-join', { inviteeIdList: inviteeList, inviterId: inviter.id, roomId })
          }
        } else {
          this.emit('message', { messageId: payload.id, payload })
        }
      }
    } catch (e) {
      log.error('emit message fail:', e)
    }

  }

  /**
 * handle_wxuser_list  : websocket返回的用户信息
 * @param {*} j json数组
 *              数组里面的wxid，要保存下来，供发送微信的时候用
 *
 */
  handle_wxuser_list (j: any) {
    const j_ary = j.content
    let i = 0
    for (const item of j_ary) {
      i = i + 1
      const id = item.wxid
      const m = id.match(/@/)
      if (m != null) {
        // log.info(id);
        log.info(item.wxid, item.name)
      }
      // log.info(m);
      //
    }
  }

  heartbeat (j: any) {
    this.emit('heartbeat', j)
    // log.info(utf16ToUtf8(wxid),utf16ToUtf8(name));
  }

  get_chat_nick_p (s_wxid: any, s_roomid: any) {

    const j = {
      id: getid(),
      type: CHATROOM_MEMBER_NICK,
      wxid: s_wxid,
      roomid: s_roomid,
      content: 'null',
      nickname: 'null',
      ext: 'null',

    }
    const s = JSON.stringify(j)
    return s

  }

  get_chat_nick (roomid: string) {
    const j = {
      id: getid(),
      type: CHATROOM_MEMBER_NICK,
      content: roomid,
      wxid: 'ROOT',
    }
    const s = JSON.stringify(j)
    return s
  }

  handle_nick (j: { content: any }) {
    const data = j.content
    for (const item of data) {
      log.info('---------------', item.room_id, '--------------------')
    }
  }

  handle_memberlist (j: { content: any }) {
    const data = j.content
    // get_chat_nick_p(j.roomid);
    for (const item of data) {
      log.info('---------------', item.room_id, '--------------------')
      // log.info("------"+item.roomid+"--------");
      // ws.send(get_chat_nick_p(item.roomid));
      const memberlist = item.member

      // log.info("hh",item.address,memberlist);

      // const len = memberlist.length();
      // log.info(memberlist);
      for (const m of memberlist) {
        log.info(m)// 获得每个成员的wxid
      }
      /* for(const n of nicklist)//目前不建议使用
      {
        log.info(n);//获得每个成员的昵称，注意，没有和wxi对应的关系
      } */
    }
  }

  get_chatroom_memberlist () {
    const j = {
      id: getid(),
      type: CHATROOM_MEMBER,
      roomid: 'null', // null
      wxid: 'null', // not null
      content: 'null', // not null
      nickname: 'null',
      ext: 'null',
    }

    const s = JSON.stringify(j)
    return s
  }

  destroy_all () {
    const j = {
      id: getid(),
      type: DESTROY_ALL,
      content: 'none',
      // wxid:'22428457414@chatroom'
      wxid: 'none',
    }

    const s = JSON.stringify(j)
    // log.info(s);
    return s
  }

  send_pic_msg (wxid: string, content: string) {
    const j = {
      id: getid(),
      type: PIC_MSG,
      wxid, // roomid或wxid,必填
      roomid: 'null',
      content, // 'C:\\tmp\\2.jpg'
      nickname: 'null',
      ext: 'null',
      // wxid:'22428457414@chatroom'

    }

    const s = JSON.stringify(j)
    // log.info(s);
    return s
  }

  get_personal_detail (wxid: string) {
    const j = {
      id: getid(),
      type: PERSONAL_DETAIL,
      content: 'op:personal detail',
      wxid,
    }
    const s = JSON.stringify(j)
    return s
  }

  get_personal_info () {
    const j = {
      id: getid(),
      type: PERSONAL_INFO,
      content: 'op:personal info',
      wxid: 'ROOT',
    }
    const s = JSON.stringify(j)
    return s
  }

  /**
   * send_txt_msg : 发送消息给好友
   *
   */
  async send_at_msg (roomid: string, wxid: string, content: string, nickname: string) {
    const jpara = {
      id: getid(),
      type: AT_MSG,
      roomid, // not null  23023281066@chatroom
      wxid, // not null
      content, // not null
      nickname,
      ext: 'null',
    }
    const options
      = {
      // method: 'GET',
      // url: 'https://apis.map.qq.com/ws/district/v1/list',
        url: this.httpUrl + '/api/sendatmsg',
        body: {
          para: jpara,
        },
        json: true,
      }
    const res = await axios.post(options.url, options.body)
    const data: ResponseData = res.data

    return data
  }

  /** send_pic
   *  发送图片
   */
  async send_pic () {
    const jpara = {
      id: getid(),
      type: PIC_MSG,
      wxid: '23023281066@chatroom',
      roomid: 'null',
      content: 'C:\\tmp\\2.jpg',
      nickname: 'null',
      ext: 'null',
      // wxid:'22428457414@chatroom'

    }

    const options
      = {
      // method: 'GET',
      // url: 'https://apis.map.qq.com/ws/district/v1/list',
        url: this.httpUrl + '/api/sendpic',
        body: {
          para: jpara,
        },
        json: true,
      }
    const data = await axios.post(options.url, options.body)
    // const j = JSON.parse(data);

    // log.info(j.id);
    // log.info(j.status);
    return data

  }

  /** get_member_nick
   * 获取群成员昵称
   */

  async get_member_nick (wxid: string, roomid: string) {

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

  /** get_getmemberid
   *   获取群成员id
   */
  async get_memberid () {

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
    const data = await axios.post(options.url, options.body)
    // const j = JSON.parse(data);

    // log.info(j.id);
    // log.info(j.status);
    return data
  }

  /** get_contact_list  获取好友和群列表
   *
   */
  async get_contact_list () {
    const jpara = {
      id: getid(),
      type: USER_LIST,
      roomid: 'null', // null
      wxid: 'null', // not null
      content: 'null', // not null
      nickname: 'null',
      ext: 'null',
    }
    const options = {
      url: this.httpUrl + '/api/getcontactlist',
      body: {
        para: jpara,
      },
      json: true,
    }
    const res = await axios.post(options.url, options.body)
    const contacts: ContactRaw[] = res.data.content
    // log.info('get_contact_list len:', contacts.length)
    return contacts
  }

  async get_chatroom_member_list () {
    const jpara = {
      id: getid(),
      type: CHATROOM_MEMBER,
      roomid: 'null', // null
      wxid: 'null', // not null
      content: 'null', // not null
      nickname: 'null',
      ext: 'null',
    }
    const options = {
      url: this.httpUrl + '/api/get_charroom_member_list', //
      body: {
        para: jpara,
      },
      json: true,
    }
    const res = await axios.post(options.url, options.body)
    const rooms: RoomRaw[] = res.data.content
    return rooms

  }

  /**
   * send txt message
   */
  async send_txt_msg (wxid: string, content: string) {
    const jpara = {
      id: getid(),
      type: TXT_MSG,
      wxid, // roomid或wxid,必填
      roomid: 'null', // 此处为空
      content,
      nickname: 'null', // 此处为空
      ext: 'null', // 此处为空
      // wxid:'22428457414@chatroom'
    }
    const options
      = {
      // method: 'GET',
      // url: 'https://apis.map.qq.com/ws/district/v1/list',
        url: this.httpUrl + '/api/sendtxtmsg',
        body: {
          para: jpara,
        },
        json: true,
      }
    const res = await axios.post(options.url, options.body)
    const data: ResponseData = res.data
    return data

  }

  /** send_attatch
   * send the attatchment
   */
  async send_attatch (wxid: string, content: string) {

    const jpara = {
      id: getid(),
      type: ATTATCH_FILE,
      wxid, // roomid或wxid,必填
      roomid: 'null', // 此处为空
      content, // : 'C:\\tmp\\log.7z'
      nickname: 'null', // 此处为空
      ext: 'null', // 此处为空
      // wxid:'22428457414@chatroom'

    }
    const options
      = {
      // method: 'GET',
      // url: 'https://apis.map.qq.com/ws/district/v1/list',
        url: this.httpUrl + '/api/sendattatch',
        body: {
          para: jpara,
        },
        json: true,

      }
    const res = await axios.post(options.url, options.body)
    const data: ResponseData = res.data
    return data
  }

}

export { Bridge }
