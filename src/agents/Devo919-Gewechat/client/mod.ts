import { Client, xml2js } from './module/index.js'
import { log, logger } from './utils/logger.js'
import type * as MessageTypes from './types/message.js'
import type * as NoticeTypes from './types/notice.js'
import type * as RoomTypes from './types/room.js'
import type * as GeweTypes from './types/types.js'

export {
  Client,
  log,
  logger,
  xml2js,
}
export type {
  MessageTypes,
  NoticeTypes,
  RoomTypes,
  GeweTypes,
}
