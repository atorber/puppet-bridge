/* eslint-disable no-console */
import {
  Bridge,
} from '../src/agents/jwping-wxbot/jwping-wxbot.js'
import os from 'os'

const userInfo = os.userInfo()
const rootPath = userInfo.homedir
console.log('rootPath:', rootPath)

async function main () {
  console.info('WeChat Bridge starting...')
  const bridge = new Bridge()

  // bridge.on('heartbeat', (message) => {
  //   console.log('heartbeat:', message)
  // });

  bridge.on('message', (message) => {
    console.log('onmessage:', message)
  })

  console.info('WeChat Bridge started.')

  const isLoggedIn = false
  console.log('isLoggedIn:', isLoggedIn)
  // const roomList: {
  //   [key:string]:ContactRaw
  // } = {}

  bridge.on('ready', () => {
    console.log('ready...')

    // ws.send(destroy_all());
    // 获取群成员昵称 success
    // bridge.ws.send(bridge.get_chat_nick_p("atorber", "21341182572@chatroom"));

    // 获取chatroom 成员昵称
    // const payload = bridge.get_chat_nick('21341182572@chatroom')
    // console.log('get_chat_nick_res:', payload)
    // bridge.ws.send(payload);

    // 获取微信个人信息 fail
    // const payload = bridge.getPersonalInfo()
    // console.log('getPersonalInfo_res:', payload)
    // bridge.ws.send(payload);

    // 获取群好友信息 fail
    // const payload = bridge.get_personal_detail('atorber')
    // console.log('get_personal_detail_res:', payload)
    // bridge.ws.send(payload);

    /** debugview调试信息开关，默认为关
     * ws.send(debug_switch());
     */

    // 获取群好友列表 success
    // bridge.ws.send(bridge.get_chatroom_memberlist());
  })

  const userinfo = await bridge.getPersonalInfo()
  console.log('onready userinfo:', JSON.stringify(userinfo, undefined, 2))

  // const contactsRes = await bridge.getContactList()
  // console.log('getContactList:', JSON.stringify(contactsRes, undefined, 2))

  // for (const contact of contacts) {
  //   // console.log('contact:', JSON.stringify(contact))
  //   if (contact.wxid.indexOf('@chatroom') > -1) {
  //     console.log('room:', contact.name)
  //     roomList[contact.wxid] = contact
  //   } else {
  //     console.log('contact:', contact.name, contact.wxid, contact.node)
  //   }
  // }

  // for (const key in roomList) {
  //   const room = roomList[key]
  //   const roomid = room?.wxid
  //   const roomName = room?.name

  //   const roomNew = await bridge.getRoomList(roomid as string)
  //   console.log('getRoomList_res:', roomNew)

  //   const roomMembers = roomNew?.member || {}
  //   const count = Object.keys(roomMembers).length
  //   if (count) {
  //     console.log('roomid:', roomid, 'roomName', roomName, 'roomMembers:', count)
  //     for (const key in roomMembers) {
  //       const roomMember = roomMembers[key]
  //       console.log('roomMember:', roomMember?.NickName, roomMember?.UserName)
  //     }
  //   }
  // }

  // // 发送文本消息
  // const messageSendText = await bridge.messageSendText('ledongmao', 'Bridge is ready!')
  // console.log('messageSendText_res:', messageSendText.id, messageSendText.status, messageSendText.content, messageSendText.time, messageSendText.type, messageSendText.sender, messageSendText.receiver)

  // // 发送@消息
  // const messageSendTextAt = await bridge.messageSendTextAt('21341182572@chatroom', ['ledongmao'], 'Bridge is ready!', ['超哥'])
  // console.log('messageSendTextAt:', messageSendTextAt)

  // // 发送图片
  // const messageSendFile1 = await bridge.messageSendPicture('ledongmao', rootPath + '\\Documents\\GitHub\\puppet-bridge\\examples\\media\\test.gif')
  // console.log('messageSendFile1:', messageSendFile1)

  // // 发送视频
  // const messageSendFile2 = await bridge.messageSendFile('ledongmao', rootPath + '\\Documents\\GitHub\\puppet-bridge\\examples\\media\\test.mp4')
  // console.log('messageSendFile2:', messageSendFile2)

  // // 发送文件
  // const messageSendFile3 = await bridge.messageSendFile('ledongmao', rootPath + '\\Documents\\GitHub\\puppet-bridge\\examples\\media\\test.txt')
  // console.log('messageSendFile3:', messageSendFile3)

  // bridge.on('hook', async ({ method, args }) => {
  //   // console.log(`onhook事件消息：${new Date().toLocaleString()}\n`, method, JSON.stringify(args))
  //   console.log(`onhook事件消息：${new Date().toLocaleString()}`, method)
  //   switch (method) {
  //     case 'recvMsg':
  //       void onRecvMsg(args)
  //       break
  //     case 'checkQRLogin':
  //       onScan(args)
  //       break
  //     case 'loginEvent':{
  //       if(!isLoggedIn){
  //         const loginRes = await Bridge.isLoggedIn()
  //         if(loginRes){
  //           onLogin()
  //         }
  //       }
  //       break
  //     }
  //     case 'agentReady':
  //       console.log('agentReady...')
  //       break
  //     case 'logoutEvent':
  //       onLogout(args[0] as number)
  //       break
  //     default:
  //       console.info('onHook没有匹配到处理方法:', method, JSON.stringify(args))
  //       break
  //   }

  // })

  // const onLogin = async () => {
  //   console.info('登陆事件触发')
  //   console.info(`登陆状态: ${isLoggedIn}`)
  //   // await Bridge.sendMsg('filehelper', 'Bridge is ready!')
  //   const contacts = await Bridge.getContact()
  //   // console.log(`contacts: ${contacts}`)
  //   const contactsJSON = JSON.parse(contacts)
  //   console.log('contacts列表:', contactsJSON.length)

  //   for (const contact of contactsJSON) {
  //     if(!contact.name) {
  //       console.info('好友:', JSON.stringify(contact))
  //     }
  //   }

  //   const roomList = await Bridge.getChatroomMemberInfo()
  //   // console.log(`roomList: ${roomList}`)
  //   const roomListJSON = JSON.parse(roomList)
  //   console.log('roomList列表:', roomListJSON.length)
  //   // for (const room of roomListJSON) {
  //   //   console.info('room:', room)
  //   // }
  // }

  // const onLogout = (bySrv: number) => {
  //   console.info('登出事件触发:', bySrv)
  //   console.info(`You are logged out${bySrv ? ' because you were kicked by server.' : ''}.`)
  // }

  // const onScan = (args: any) => {
  //   const status: number = args[0]
  //   const qrcodeUrl: string = args[1]
  //   const wxid: string = args[2]
  //   const avatarUrl: string = args[3]
  //   const nickname: string = args[4]
  //   const phoneType: string = args[5]
  //   const phoneClientVer: number = args[6]
  //   const pairWaitTip: string = args[7]

  //   const json = {
  //     avatarUrl,
  //     nickname,
  //     pairWaitTip,
  //     phoneClientVer,
  //     phoneType,
  //     qrcodeUrl,
  //     status,
  //     wxid,
  //   }

  //   console.info('onScan', JSON.stringify(json, null, 2))
  // }

  // const onRecvMsg = async (args: any) => {
  //   console.info('onRecvMsg事件触发:', JSON.stringify(args))

  //   if (args instanceof Error) {
  //     console.error('onRecvMsg: 参数错误 Error', args)
  //     return
  //   }

  //   const toId = String(args[1])
  //   const text = String(args[2])
  //   const talkerId = String(args[3])

  //   // const nickname = await Bridge.GetContactOrChatRoomNickname(talkerId)
  //   // console.log('发言人昵称：', nickname)

  //   const talker = await Bridge.getChatroomMemberNickInfo(talkerId,toId)
  //   console.log('发言人：', talker)
  //   if (talkerId && text === 'ding') {
  //     console.info('叮咚测试: ding found, reply dong')
  //     await Bridge.sendMsg(toId, 'dong')
  //     // await Bridge.sendAtMsg(toId, 'dong',talkerId)
  //   }
  // }
}

main()
  .catch(e => {
    console.error('主函数运行失败:', e)
  })
