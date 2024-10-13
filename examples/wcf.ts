import * as pkg from '@zippybee/wechatcore'
// import { Message, UserInfo } from '@zippybee/wechatcore'

const { Wcferry } = pkg

const wcferry = new Wcferry()
try {
  wcferry.start()
  console.info('Wcferry started.')

  // 等待连接建立
  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.info('Connected:', wcferry.connected)

  if (wcferry.isLogin()) {
    console.info('已登录。')
    console.info('自己的 wxid:', wcferry.getSelfWxid())

    const userInfo = wcferry.getUserInfo()
    console.info('用户信息:', JSON.stringify(userInfo))

    const contacts = wcferry.getContacts()
    console.info('联系人数量:', contacts.length)
    console.info('联系人:', JSON.stringify(contacts.splice(0, 5)))

    if (contacts[1]?.wxid) {
      const wxid = contacts[1].wxid
      try {
        const contactInfo = wcferry.getContact(wxid)
        console.info('好友信息:', JSON.stringify(contactInfo))
      } catch (error) {
        console.error('获取好友信息错误:', error)
      }
    }

    const friends = wcferry.getFriends()
    console.info('好友数量:', friends.length)
    console.info('好友:', JSON.stringify(friends.splice(0, 5)))

    const rooms = wcferry.getChatRooms()
    console.info('群数量:', rooms.length)
    console.info('群:', JSON.stringify(rooms.splice(0, 5)))

    // if (rooms[0]?.wxid) {
    //   const members = await wcferry.getChatRoomMembers(rooms[0]?.wxid)
    //   console.info('群成员数量:', members)
    // }

    const dbs = wcferry.getDbNames()
    console.info('数据库数量:', dbs.length)

    const dbData = wcferry.getDbTables(dbs[0] || '')
    console.info('数据表数量:', dbData.length)

    // 示例：发送文本消息
    const sendStatus = wcferry.sendTxt('测试消息', 'filehelper')
    console.info('发送消息状态:', sendStatus)

    // 添加更多操作...
  } else {
    console.info('未登录。')
  }

  const msgType = wcferry.getMsgTypes()
  console.info('消息类型:', msgType)

  // 监听消息
  const unsubscribe = wcferry.listening((msg) => {
    console.info('收到消息:', msg)
    const roomId = msg.roomId.indexOf('@') !== -1 ? msg.roomId : ''
    const listenerId = roomId ? '' : msg.roomId
    const mseeage = {
      id: msg.id,
      listenerId,
      roomId,
      talkerId:msg.sender,
      text:msg.content,
      timestamp: Date.now(),
      type: msg.type,
    }
    console.info('消息:', mseeage)
  })
  console.info('开始监听消息。', unsubscribe)
  // // 等待一段时间接收消息
  // await new Promise((resolve) => setTimeout(resolve, 100000))
  // // 取消监听
  // unsubscribe()
  // console.info('取消消息监听。')
} catch (error) {
  console.error('错误:', error)
}
