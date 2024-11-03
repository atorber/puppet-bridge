/* eslint-disable sort-keys */
import {
  Contact,
  Message,
  ScanStatus,
  WechatyBuilder,
  UrlLink,
  log,
  types,
  MiniProgram,
} from 'wechaty'
import { FileBox } from 'file-box'

import { PuppetBridge, PuppetBridgeOptions } from '../src/puppet-bridge.js'
import qrcodeTerminal from 'qrcode-terminal'
import * as fs from 'fs'
import 'dotenv/config.js'

function onScan (qrcode: string, status: ScanStatus) {
  if (qrcode) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    log.info('onScan', '%s(%s)', status, qrcodeImageUrl)

    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console
    log.info(`[${status}] ${qrcode}\nScan QR Code above to log in `)
  } else {
    log.info(`[${status}]`)
  }
}

async function onLogin (user: Contact) {
  log.info('ripe onLogin event:', JSON.stringify(user))
}

function onLogout (user: Contact) {
  log.info('onLogout', '%s logout', user)
}

async function onMessage (msg: Message) {
  // log.info('onMessage', msg.toString())
  log.info('ding-dong-bot onMessage接收到消息：', JSON.stringify(msg, null, 2))
  const contact = msg.talker()
  log.info('ding-dong-bot 当前联系人信息：', JSON.stringify(contact))
  const room = msg.room()
  let sendRes:any = ''
  if (room) {
    log.info('ding-dong-bot 当前群名称：', await room.topic())
    log.info('ding-dong-bot 当前群ID：', room.id)
    const owner = await room.owner()
    log.info('ding-dong-bot 当前群群主：', JSON.stringify(owner) || 'undefined')
    log.info('ding-dong-bot 当前群群主昵称：', owner && owner.name())
  }

  try {

    if (msg.text() === 'ding') {
      sendRes = await msg.say(new Date().toLocaleString() + ' dong')
      log.info('ding-dong-bot 发送消息结果：', sendRes || 'undefined')
    }

    const basepath = 'examples/media/'
    /**
   * 发送文件
   */
    if (msg.text() === 'txt') {
    // const newpath = basepath + 'test.txt'
    // const fileBox = FileBox.fromFile(newpath)
      const newpath = 'https://scrm-1308498490.cos.ap-shanghai.myqcloud.com/pkg/a909-99066ce80e03.xls'
      const fileBox = FileBox.fromUrl(newpath)
      // log.info('fileBox:', JSON.stringify(fileBox.toJSON()))
      // {"metadata":{},"name":"a909-99066ce80e03.xls","size":-1,"type":2,"url":"https://scrm-1308498490.cos.ap-shanghai.myqcloud.com/pkg/a909-99066ce80e03.xls","boxType":2}
      sendRes = await msg.say(fileBox)
      log.info('txt发送消息结果：', sendRes)
    }

    /**
   * 发送图片
   */
    if (msg.text() === 'jpg') {
      const newpath = 'https://pics3.baidu.com/feed/0824ab18972bd407a9403f336648d15c0db30943.jpeg'
      const fileBox = FileBox.fromUrl(newpath)
      sendRes = await msg.say(fileBox)
      log.info('jpg发送消息结果：', sendRes)
    }

    /**
   * 发送本地图片
   */
    if (msg.text() === 'jpg_local') {
      const newpath = basepath + 'logo.jpg'
      const fileBox = FileBox.fromFile(newpath)
      sendRes = await msg.say(fileBox)
      log.info('jpg_local发送消息结果：', sendRes)
    }

    /**
   * 发送音频
    */
    if (msg.text() === 'silk') {
      const newpath = 'https://scrm-1308498490.cos.ap-shanghai.myqcloud.com/pkg/response.silk'
      // const newpath = 'https://scrm-1308498490.cos.ap-shanghai.myqcloud.com/pkg/response.silk?q-sign-algorithm=sha1&q-ak=AKIDmOkqfDUUDfqjMincBSSAbleGaeQv96mB&q-sign-time=1703841529;1703848729&q-key-time=1703841529;1703848729&q-header-list=&q-url-param-list=&q-signature=781831fe71ad4bbb582715bf197a9cf86ec80c97'
      const fileBox = FileBox.fromUrl(newpath)
      // log.info('fileBox:', JSON.stringify(fileBox.toJSON()))
      // {"metadata":{},"name":"response.silk","size":-1,"type":2,"url":"https://scrm-1308498490.cos.ap-shanghai.myqcloud.com/pkg/response.silk?q-sign-algorithm=sha1&q-ak=AKIDmOkqfDUUDfqjMincBSSAbleGaeQv96mB&q-sign-time=1703841529;1703848729&q-key-time=1703841529;1703848729&q-header-list=&q-url-param-list=&q-signature=781831fe71ad4bbb582715bf197a9cf86ec80c97","boxType":2}
      sendRes = await msg.say(fileBox)
      log.info('silk发送消息结果：', sendRes)
    }

    /**
   * 发送表情
   */
    if (msg.text() === 'gif') {
      const newpath = basepath + 'test.gif'
      const fileBox = FileBox.fromFile(newpath)
      sendRes = await msg.say(fileBox)
      log.info('gif发送消息结果：', sendRes)
    }

    /**
   * 发送视频
   */
    if (msg.text() === 'mp4') {
      const newpath = basepath + 'test.mp4'
      const fileBox = FileBox.fromFile(newpath)
      sendRes = await msg.say(fileBox)
      log.info('mp4发送消息结果：', sendRes)
    }

    /**
   * 发送链接
   */
    if (msg.text() === 'link') {
      const urlPayload:UrlLink = new bot.UrlLink({
        description: 'Wechaty is a Conversational RPA SDK for Chatbot Makers',
        thumbnailUrl: 'https://pics3.baidu.com/feed/0824ab18972bd407a9403f336648d15c0db30943.jpeg@f_auto?token=d26f7f142871542956aaa13799ba1946',
        title: 'Wechaty',
        url: 'https://wechaty.js.org/',
      })
      sendRes = await msg.say(urlPayload)
      log.info('link发送消息结果：', sendRes)
    }

    /**
     * 发送联系人名片
     * */
    if (msg.text() === 'card') {
      const contact = msg.talker()
      sendRes = await msg.say(contact)
      log.info('card发送消息结果：', sendRes)
    }

    if (msg.text() === 'app') {
      const miniProgramPayload:MiniProgram = new bot.MiniProgram({
        appid: 'wx1f9ea355b47256dd',
        description: '百果园+',
        pagePath: 'pages/homeDelivery/index.html',
        iconUrl:'https://pics3.baidu.com/feed/0824ab18972bd407a9403f336648d15c0db30943.jpeg',
        shareId:'',
        thumbUrl:'https://pics3.baidu.com/feed/0824ab18972bd407a9403f336648d15c0db30943.jpeg',
        title: '最快29分钟 好吃水果送到家',
        username: 'gh_690acf47ea05@app',
        thumbKey:'',
      })
      sendRes = await msg.say(miniProgramPayload)
      log.info('link发送消息结果：', sendRes)
    }

  } catch (e) {
    log.error('发送消息失败：', e)
  }

  let filePath = 'file/'
  // 检查文件夹是否存在，不存在则创建
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(filePath)
  }

  try {
    if (msg.type() === types.Message.Image || msg.type() === types.Message.Attachment || msg.type() === types.Message.Video || msg.type() === types.Message.Audio || msg.type() === types.Message.Emoticon) {

      let file

      if (msg.type() === types.Message.Image) {
        file = await msg.toImage().thumbnail()  // Save the media message as a FileBox
      } else {
        file = await msg.toFileBox()  // Save the media message as a FileBox
      }
      filePath = filePath + file.name
      try {
        await file.toFile(filePath, true)
        log.info(`Saved file: ${filePath}`)
      } catch (e) {
        log.error('保存文件错误：', e)
      }
    } else {
      // Log other non-text messages
      const logData = {
        date: new Date(),
        listener: msg.listener(),
        room:await msg.room(),
        talker: msg.talker(),
        text: msg.text(),
        type: msg.type(),
      }

      const logPath = filePath + 'message.log'
      fs.appendFileSync(logPath, JSON.stringify(logData, null, 2) + '\n')

      log.info(`日志查看路径： ${logPath}`)
    }
  } catch (e) {
    log.error(`Error handling message: ${e}`)
  }

}

const onReady = async () => {
  log.info('bot已经准备好了')
  // const roomList = await bot.Room.findAll()
  // writeLog('群信息：' + JSON.stringify(roomList))
  // log.info('群数量：', roomList.length)
  // const contactList = await bot.Contact.findAll()
  // writeLog('联系人信息：' + JSON.stringify(contactList))
  // log.info('联系人数量：', contactList.length)
  // const friends = contactList.filter(c => c.friend())
  // log.info('好友数量：', friends.length)
  // 发送@好友消息
  const room = await bot.Room.find({ topic:'大师是群主' })
  log.info('room：', room)

  const contact = await bot.Contact.find({ name:'luyuchao' })
  log.info('contact', contact)

  if (contact) {
    const msg = `${new Date().toLocaleString()}${bot.currentUser.name()}上线了！`
    await contact.say(msg)
  }

  if (room && contact) {
    const contacts:Contact[] = [ contact ]
    const msg = `${new Date().toLocaleString()}${bot.currentUser.name()}上线了！`
    // await contact.say(msg)
    await room.say(msg, ...contacts)
  }

}

const ops:PuppetBridgeOptions = {
  token: process.env['token'] || '',
  appId: process.env['appId'] || '',
  host: 'http://127.0.0.1',
  apiPort: '2531',
  downloadPort: '2532',
  callbackHost: 'http://192.168.3.72:2544/v2/api/callback/collect',
}

const puppet = new PuppetBridge(ops)
const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  puppet,
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('ready', onReady)
bot.on('logout', onLogout)
bot.on('message', onMessage)
bot.on('room-join', async (room, inviteeList, inviter) => {
  const nameList = inviteeList.map(c => c.name()).join(',')
  log.info(`Room ${await room.topic()} got new member ${nameList}, invited by ${inviter}`)
})
bot.on('room-leave', async (room, leaverList, remover) => {
  const nameList = leaverList.map(c => c.name()).join(',')
  log.info(`Room ${await room.topic()} lost member ${nameList}, the remover is: ${remover}`)
})
bot.on('room-topic', async (room, topic, oldTopic, changer) => {
  log.info(`Room ${await room.topic()} topic changed from ${oldTopic} to ${topic} by ${changer.name()}`)
})
bot.on('room-invite', async roomInvitation => {
  log.info(JSON.stringify(roomInvitation))
  try {
    log.info('received room-invite event.')
    await roomInvitation.accept()
  } catch (e) {
    log.error('处理进群申请信息错误：', e)
  }
})

bot.start()
  .then(() => {
    return log.info('ripe Bot Started.')
  })
  .catch(log.error)
