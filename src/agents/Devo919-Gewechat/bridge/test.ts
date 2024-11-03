/* eslint-disable sort-keys */
// import qrcode from 'qrcode-terminal'
import { log } from 'wechaty'
import { Bridge } from './mod.js'
import 'dotenv/config.js'

const options = {
  token: process.env['token'],
  appId: process.env['appId'] || '',
  host: 'http://127.0.0.1',
  apiPort: '2531',
  downloadPort: '2532',
  callbackHost: 'http://192.168.3.72:2544/v2/api/callback/collect',
}

async function main () {
  const bridge = new Bridge(options)
  // await bridge.logout()
  await bridge.getLoginQrCode()

  // await client.setCallback()
  // await client.loadContactList()
  // await client.loadRoomList()

  bridge.on('message', (msg) => {
    log.info('onmessage', JSON.stringify(msg))
  })
}

main().catch(err => {
  log.error('Main function error:', err)
})
