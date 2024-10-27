/* eslint-disable sort-keys */
import {
  Contact,
  Message,
  WechatyBuilder,
  log,
} from 'wechaty'
import { FileBox } from 'file-box'
import { PuppetBridge } from '../src/puppet/puppet-bridge.js'

async function onLogin (user: Contact) {
  log.info('onLogin', '%s login', user)
  const roomList = await bot.Room.findAll()
  console.info('room count:', roomList.length)
  const contactList = await bot.Contact.findAll()
  console.info('contact count:', contactList.length)
}

async function onMessage (message: Message) {
  log.info('onMessage', JSON.stringify(message))

  // 1. send Image
  if (/^ding$/i.test(message.text())) {
    const fileBox = FileBox.fromUrl('https://wechaty.github.io/wechaty/images/bot-qr-code.png')
    await message.say(fileBox)
  }

  // 2. send Text

  if (/^dong$/i.test(message.text())) {
    await message.say('dingdingding')
  }

}

const puppet = new PuppetBridge({
  token: '大师',  // 登录微信的昵称
})
const bot = WechatyBuilder.build({
  name: 'ding-dong-bot',
  puppet,
})

bot.on('login', onLogin)
bot.on('message', onMessage)

bot.start()
  .then(() => {
    return log.info('StarterBot', 'Starter Bot Started.')
  })
  .catch(console.error)
