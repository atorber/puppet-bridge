import { Client, xml2js } from './module/index.js'
import { Options } from './types/types.js'
import { log, logger } from './utils/logger.js'
import * as GeweTypes from './types/types.js'
import * as MessageTypes from './types/message.js'
import * as NoticeTypes from './types/notice.js'
import * as RoomTypes from './types/room.js'

export {
  Client,
  log,
  logger,
  xml2js,
  MessageTypes,
  NoticeTypes,
  RoomTypes,
}
export type { Options, GeweTypes }
