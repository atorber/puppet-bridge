import { log } from 'wechaty-puppet'
import { Wxhelper } from '../src/agents/fused/atorber-fused-api.js'

// const testRoom1 = '21341182572@chatroom'
// const testRoom2 = '25172281579@chatroom'
const main = async () => {
  const wxhelper = new Wxhelper('http://127.0.0.1:19088')
  const res0 = await wxhelper.initDBInfo()
  log.info('res0:', JSON.stringify(res0.data, null, 2))
  // const res1 = await wxhelper.getChatRoomDetailInfo(testRoom1)
  // log.info('res1:', JSON.stringify(res1, null, 2))
  // //   await wxhelper.getChatRoomDetailInfo(testRoom2)
  // // await wxhelper.getMemberFromChatRoom(testRoom1)
  // const res2 = await wxhelper.getMemberFromChatRoom(testRoom2)
  // log.info('res2:', JSON.stringify(res2, null, 2))
  // const res3 = await wxhelper.getContactProfile('ledongmao')
  // log.info('res3:', JSON.stringify(res3, null, 2))
  const res4 = await wxhelper.getMsg()
  log.info('res4:', JSON.stringify(res4, null, 2))
  // const data  = res4.data.data as any
  // const buf = data.Buf // buf是一个base64，需要将buffer转换为string
  // const str = Buffer.from(buf, 'base64').toString('utf-8')
  // log.info('str:', str)
}
void main()
