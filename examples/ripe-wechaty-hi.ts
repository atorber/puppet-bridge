import {
  Contact,
  Message,
  WechatyBuilder,
  log,
  types,
} from 'wechaty'
import { FileBox } from 'file-box'

import { PuppetBridgeHi as PuppetBridge } from '../src/mod.js'
import * as fs from 'fs'

import 'dotenv/config.js'

// 初始化检查当前文件加下是否存在日志文件info.log，如果不存在则创建
const logPath = 'info.log'
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, '')
}

// 定义写日志的方法
export function writeLog (info: string) {
  fs.appendFileSync(logPath, info + '\n')
}

async function onLogin (user: Contact) {
  log.info('onLogin', JSON.stringify(user, null, 2))
  log.info('user.id：', user.id)
  log.info('user.name：', await user.name())
  log.info('bot.currentUser.id：', bot.currentUser.id)
  const contact = await bot.Contact.find({ id: 'luyuchao' })
  log.info('contact：', contact)
  const name = await bot.currentUser.name()
  await contact?.say(`Hi,我是数字员工${name}，很高兴认识你`)

  const room = await bot.Room.find({ id: '11837093' })
  log.info('room：', room)
  room?.say(`Hi,我是数字员工${name}，很高兴认识你`)
}

async function onMessage (msg: Message) {
  // log.info('onMessage', msg.toString())
  log.info('onMessage接收到消息：', JSON.stringify(msg, null, 2))
  const contact = msg.talker()
  log.info('当前联系人信息：', JSON.stringify(contact))
  const room = msg.room()
  let sendRes: any = ''
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
        room: await msg.room(),
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

const puppet = new PuppetBridge({
  apiBaseUrl: process.env['HI_API_BASE_URL'] || '',
  appKey: process.env['HI_APP_KEY'] || '',
  appSecret: process.env['HI_APP_SECRET'] || '',
  selfId: process.env['HI_SELF_ID'] || '',
  selfName: process.env['HI_SELF_NAME'] || '',
})

const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  puppet,
})

bot.on('login', onLogin)
bot.on('ready', async () => {
  log.info('bot已经准备好了')
  // 发送@好友消息
  log.info('bot.currentUser.id：', bot.currentUser.id)
  try {
    const room = await bot.Room.find({ id: '11837093' })
    log.info('room：', room)
    log.info('room.id：', room?.id)
  } catch (e) {
    log.error('处理群信息错误：', e)
  }

  try {
    const contact = await bot.Contact.find({ name: 'ledongmao' })
    log.info('contact：', contact)
    log.info('contact.id：', contact?.id)
  } catch (e) {
    log.error('处理联系人信息错误：', e)
  }
})

bot.on('message', onMessage)

bot.start()
  .then(() => {
    return log.info('ripe', 'Bot Started.')
  })
  .catch(log.error)
