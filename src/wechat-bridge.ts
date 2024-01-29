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
  MessageRaw,
} from './types.js'
import { log } from 'wechaty-puppet'
import * as fs from 'fs'

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

// 检测根目录下是否有messageTypeTest.json文件，如果没有，则创建一个，内容为{}
if (!fs.existsSync('messageTypeTest.json')) {
  fs.writeFileSync('messageTypeTest.json', '{}')
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

  constructor (options?: {
    wsUrl?: string
    httpUrl?:string
  }) {
    super()
    const that = this
    this.wsUrl = options?.wsUrl || 'ws://127.0.0.1:5555'
    this.httpUrl = options?.httpUrl || 'http://127.0.0.1:5555'
    this.ws = new WebSocket(this.wsUrl)

    // 收集消息类型，临时保存到文件'/messageTypeTest.json'
    this.messageTypeTest = JSON.parse(fs.readFileSync('messageTypeTest.json', 'utf-8'))
    this.ws.on('error', (error: Error) => {
      log.error('WebSocket error:', error)
    })
    this.ws.on('open', function open () {
      log.info('WebSocket connection established')
      that.emit('login', 'login')

      // ws.send(messageSendFile());
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
      // ws.send(messageSendText());
      // ws.send(get_chatroom_memberlist());
      // ws.send(messageSendTextAt());

      // ws.send(get_personal_detail());
      // ws.send(debug_switch()
      // ws.send(send_wxuser_list());
      // ws.send(messageSendText());

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
       * ws.send(messageSendTextAt());
       */

      /** 获取微信通讯录好友列表
       * ws.send(send_wxuser_list());
       */
      /** 向你的好友发送微信文本消息
       * ws.send(messageSendText());
       */

      /** 向你的好友发送图片
       * ws.send(send_pic_msg());
       */
      /* 发送信息调用上面两个函数即可，可自行改造 */

      // ws.send(send_pic_msg());
      // ws.send(messageSendText());

    })

    this.ws.on('message', function incoming (data: string) {
      log.info('WebSocket received:', data.toString())
      data = data.toString()
      // ws.send("hello world");
      // return;
      const j = JSON.parse(data)
      // log.info(j);
      let type = j.type
      log.info('ws message hook type:', type)
      log.info(JSON.stringify(j, undefined, 2))

      if (j.content && j.content.content) {
        try {
          const content = j.content.content
          // 从content中判断是否存在类似<type>6</type>的格式，并从其中取出type的值
          const m = content.match(/<type>(\d+)<\/type>/)
          if (m != null) {
            type = type + '_' + m[1]
          }
        } catch (e) {
          log.error('ws message hook error:', e)
        }
      }

      if (type === 10000) {
        const list10000 = that.messageTypeTest['10000'] || []
        list10000.push(j)
        that.messageTypeTest[type] = list10000
      } else {
        that.messageTypeTest[type] = j
      }

      try {
        fs.writeFileSync('messageTypeTest.json', JSON.stringify(that.messageTypeTest, undefined, 2))
      } catch (e) {
        log.error('write messageTypeTest.json error:', e)
      }

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
        // case messageSendText_SUCCSESS:
        // handle_recv_msg(j);
        // break;
        // case messageSendText_FAIL:
        // handle_recv_msg(j);
        // break;
        default:
          break
      }
      // log.info(`Roundtrip time: ${Date.now() - data} ms`);

      /* setTimeout(function timeout() {
        ws.send(Date.now());
      }, 500); */
    })
    this.ws.on('close', () => {
      log.info('WebSocket connection closed')
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
  handle_recv_msg (j: MessageRaw) {
    this.emit('message', j)
    // const content = j.content
    // const wxid = j.wxid
    // const sender = j.id1
    // log.info(j)
    // log.info('接收人:' + wxid)
    // log.info('内容：' + content)
    // log.info('发送人：' + sender) // 如果为空，那就是你自己发的
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
   * messageSendText : 发送消息给好友
   *
   */
  async messageSendTextAt (roomid: string, wxid: string, content: string, nickname: string) {
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

  /** getMemberNickName
   * 获取群成员昵称
   */

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

  /** getContactList  获取好友和群列表
   *
   */
  async getContactList () {
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
    // log.info('getContactList len:', contacts.length)
    return contacts
  }

  async getRoomList () {
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
  async messageSendText (wxid: string, content: string) {
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

  /** messageSendFile
   * send the attatchment
   */
  async messageSendFile (wxid: string, content: string) {

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
