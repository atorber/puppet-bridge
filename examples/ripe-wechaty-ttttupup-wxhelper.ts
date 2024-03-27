/**
 * Wechaty - Conversational RPA SDK for Chatbot Makers.
 *  - https://github.com/wechaty/wechaty
 */
import {
  Contact,
  Message,
  ScanStatus,
  WechatyBuilder,
  log,
  types,
} from 'wechaty'
import { FileBox } from 'file-box'

import { PuppetBridgeTtttupupWxhelperV3090581 as PuppetBridge } from '../src/mod.js'
import qrcodeTerminal from 'qrcode-terminal'
import * as fs from 'fs'

// 初始化检查当前文件加下是否存在日志文件info.log，如果不存在则创建
const logPath = 'info.log'
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, '')
}

// 定义写日志的方法
export function writeLog (info: string) {
  fs.appendFileSync(logPath, info + '\n')
}

function onScan (qrcode: string, status: ScanStatus) {
  if (qrcode) {
    const qrcodeImageUrl = [
      'https://wechaty.js.org/qrcode/',
      encodeURIComponent(qrcode),
    ].join('')
    log.info('onScan', '%s(%s) - %s', status, qrcodeImageUrl)

    qrcodeTerminal.generate(qrcode, { small: true })  // show qrcode on console
    log.info(`[${status}] ${qrcode}\nScan QR Code above to log in: `)
  } else {
    log.info(`[${status}]`)
  }
}

async function onLogin (user: Contact) {
  log.info('onLogin', JSON.stringify(user, null, 2))
}

function onLogout (user: Contact) {
  log.info('onLogout', '%s logout', user)
}

async function onMessage (msg: Message) {
  // log.info('onMessage', msg.toString())
  log.info('onMessage接收到消息：', JSON.stringify(msg, null, 2))
  const contact = msg.talker()
  log.info('当前联系人信息：', JSON.stringify(contact))
  const room = msg.room()
  let sendRes:any = ''
  if (room) {
    log.info('当前群名称：', await room.topic())
    log.info('当前群ID：', room.id)
    const owner = await room.owner()
    log.info('当前群群主：', JSON.stringify(owner) || 'undefined')
    log.info('当前群群主昵称：', owner && owner.name())
  }

  if (msg.text() === 'ding') {
    sendRes = await msg.say(new Date().toLocaleString() + ' dong')
    log.info('发送消息结果：', sendRes || 'undefined')
  }

  const basepath = 'examples/media/'
  /**
   * 发送文件
   */
  if (msg.text() === 'txt') {
    const newpath = basepath + 'test.txt'
    const fileBox = FileBox.fromFile(newpath)
    sendRes = await msg.say(fileBox)
    log.info('发送消息结果：', sendRes)
  }

  /**
   * 发送图片
   */
  if (msg.text() === 'jpg') {
    const newpath = 'https://bce.bdstatic.com/doc/IOTSTACK/IoTPlatform/0-0-1_abfce11.png'
    const fileBox = FileBox.fromUrl(newpath)
    sendRes = await msg.say(fileBox)
    log.info('发送消息结果：', sendRes)
  }

  /**
   * 发送本地图片
   */
  if (msg.text() === 'jpg_local') {
    const newpath = basepath + 'logo.jpg'
    const fileBox = FileBox.fromFile(newpath)
    sendRes = await msg.say(fileBox)
    log.info('发送消息结果：', sendRes)
  }

  /**
   * 发送表情
   */
  if (msg.text() === 'gif') {
    const newpath = basepath + 'test.gif'
    const fileBox = FileBox.fromFile(newpath)
    sendRes = await msg.say(fileBox)
    log.info('发送消息结果：', sendRes)
  }

  /**
   * 发送视频
   */
  if (msg.text() === 'mp4') {
    const newpath = basepath + 'test.mp4'
    const fileBox = FileBox.fromFile(newpath)
    sendRes = await msg.say(fileBox)
    log.info('发送消息结果：', sendRes)
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

const puppet = new PuppetBridge()
const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  puppet,
})

bot.on('scan', onScan)
bot.on('login', onLogin)
bot.on('ready', async () => {
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

  if (room && contact) {
    const contacts:Contact[] = [ contact ]
    await room.say(new Date().toLocaleString() + '：瓦力上线了！', ...contacts)
  }
})
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
    return log.info('ripe', 'Bot Started.')
  })
  .catch(log.error)
