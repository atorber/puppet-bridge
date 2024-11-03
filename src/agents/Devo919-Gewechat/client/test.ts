/* eslint-disable sort-keys */
// import qrcode from 'qrcode-terminal'
// import { Client } from './client.js'
import { log } from 'wechaty'
import { Client } from './mod.js'
import 'dotenv/config.js'

const options = {
  token: process.env['token'],
  appId: process.env['appId'] || '',
  host: process.env['host'] || 'http://127.0.0.1',
  apiPort: process.env['apiPort'] || '2531',
  downloadPort: process.env['downloadPort'] || '2532',
  callbackHost: process.env['callbackHost'],
}

const client = new Client(options)

// await client.getTokenId()

await client.messageModule.postLink(
  'tyutluyc',
  'test',
  '百度一下',
  'https://www.baidu.com',
  'https://pics3.baidu.com/feed/0824ab18972bd407a9403f336648d15c0db30943.jpeg@f_auto?token=d26f7f142871542956aaa13799ba1946')

const qrRes = await client.loginModule.getLoginQrCode()
if (qrRes.ret === 2001) {
  const uuid = qrRes.data.uuid
  setInterval(() => {
    client.loginModule.checkLogin(uuid).then((res) => {
      return res
    }).catch((error) => {
      log.error('checkLogin failed:' + error)
      throw error
    })
  }, 5000)
}
const isOnline = await client.accountModule.checkOnline()
if (isOnline.ret !== 200) {
  await client.accountModule.reconnection()
} else {
  log.info('isOnline', isOnline.data ? 'true' : 'false')
}
log.info('isLoggedIn', client.accountModule.isLoggedIn ? 'true' : 'false')
// await client.accountModule.logout()
// await client.accountModule.reconnection()
// await client.fetchContactsList()
// await client.fetchContactsListCache()
// await client.search('tyutluyc')
// await client.getBriefInfo([ 'tyutluyc' ])
// await client.getDetailInfo([ 'tyutluyc' ])
// await client.setFriendRemark('tyutluyc', '超哥啊啊啊')
// await client.contactsModule.fetchContactsList()

// await client.messageModule.postText('tyutluyc', '你好啊')

// await client.startHttpServer()
client.on('callback', (msg) => {
  log.info('onmessage', JSON.stringify(msg))
  if (msg.typeCode === 3) {
    client.messageModule.downloadImage(msg.data.Data.Content.string, 2).then((res) => {
      log.info('downloadImage', JSON.stringify(res))
      const url = client.getDownloadUrl(res.data.fileUrl)
      log.info('downloadImage', url)
      return res
    }).catch((error) => {
      log.error('downloadImage', error)
    })
  }
})
