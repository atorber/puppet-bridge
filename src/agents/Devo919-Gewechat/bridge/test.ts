/* eslint-disable sort-keys */
// import qrcode from 'qrcode-terminal'
import { log } from 'wechaty'
import { Bridge } from './mod.js'
import 'dotenv/config.js'

const options = {
  token: process.env['token'],
  appId: process.env['appId'] || '',
  host: '127.0.0.1',
  callbackHost: '192.168.3.72',
}

const bridge = new Bridge(options)
// await bridge.logout()
await bridge.getLoginQrCode()

// await client.setCallback()
// await client.loadContactList()
// await client.loadRoomList()

bridge.on('message', (msg) => {
  log.info('onmessage', JSON.stringify(msg))
})
