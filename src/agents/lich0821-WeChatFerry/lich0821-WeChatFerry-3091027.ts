/* eslint-disable camelcase */
/* eslint-disable sort-keys */
import { EventEmitter } from 'events'
import { log } from 'wechaty-puppet'
import {
  readMsgStore,
  writeMsgStore,
  // getTimeLocaleString,
} from '../../utils/messageStore.js'

import { Message, Wcferry } from '@zippybee/wechatcore'

export const getid = () => {
  const id = Date.now()
  return id.toString()
}

class Bridge extends EventEmitter {

  client: Wcferry

  messageTypeTest: any = {}

  currentUserId = ''

  isLoggedIn = false

  constructor () {
    super()

    this.messageTypeTest = readMsgStore()

    this.client = new Wcferry()
    this.client.start()

    // 等待连接建立
    new Promise((resolve) => setTimeout(resolve, 3000))
      .then(() => {
        // 如果未登录，则每隔5s检测一次是否已登录，未登录则获取登录二维码或操作登录
        const timer = setInterval(() => {
          this.isLoggedIn = this.client.isLogin()

          if (this.isLoggedIn) {
            log.info('已登录，清除定时器...')
            clearInterval(timer)
            this.emit('login', 'login')
            let messageStore = readMsgStore()

            try {
              this.client.listening((msg) => {
                console.info('收到消息:', msg.content)
                log.verbose(`Received data: ${msg}`)

                // 缓存消息
                messageStore = writeMsgStore(messageStore, msg)
                this.handleReceiveMessage(msg)
              })
            } catch (e) {
              log.error('Received data error:', e)
              this.emit('error', e)
            }
          } else {
            log.info('未登录，每隔5s检测一次...')
          }
        }, 5000)
        return timer
      }).catch(() => {})
  }

  // 处理消息hook
  handleReceiveMessage (messageRaw: Message) {
    // log.info('handleReceiveMessage...:', messageRaw)
    this.emit('message', messageRaw)
  }

  // 处理心跳消息
  handleHeartbeat (j: any) {
    this.emit('heartbeat', j)
    // log.info(utf16ToUtf8(wxid),utf16ToUtf8(name));
  }

}

export { Bridge, log }
