/* eslint-disable sort-keys */
import axios from 'axios'
import { log } from 'wechaty-puppet'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: 'http://127.0.0.1:19088',

  // 请求超时时间
  timeout: 120000,
})

/**
  * 异常拦截处理器
  *
  * @param {*} error
  */
export const errorHandler = (error: { response?: { status: number, config: any } }) => {
  // 判断是否是响应错误信息
  if (error.response) {
    if (error.response.status === 401) {
      return request(error.response.config)
    }
  }
  return Promise.reject(error)
}

/**
   * GET 请求
   *
   * @param {String} url
   * @param {Object} data
   * @param {Object} options
   * @returns {Promise<any>}
   */
export const get = (url: string, data = {}, options = {}) => {

  // request.interceptors.response.use((response) => response.data, errorHandler)
  return request({
    url,
    params: data,
    method: 'get',
    ...options,
  })
}

/**
   * POST 请求
   *
   * @param {String} url
   * @param {Object} data
   * @param {Object} options
   * @returns {Promise<any>}
   */
export const post = (url: string, data = {}, options = {}) => {
  // request.interceptors.response.use((response) => response.data, errorHandler)
  return request({
    url,
    method: 'post',
    data,
    ...options,
  })
}

/**
 * 定义用户账户信息接口
 */
export interface AccountInfo {
  /**
   * 用户的账号名
   */
  account: string;
  /**
   * 用户所在城市
   */
  city: string;
  /**
   * 用户所在国家的ISO代码
   */
  country: string;
  /**
   * 当前数据路径，通常指向用户的WeChat文件夹
   */
  currentDataPath: string;
  /**
   * 数据保存路径，通常指向用户的WeChat文件夹
   */
  dataSavePath: string;
  /**
   * 数据库密钥，用于加密本地数据库
   */
  dbKey: string;
  /**
   * 用户的头像图片URL
   */
  headImage: string;
  /**
   * 用户的手机号码
   */
  mobile: string;
  /**
   * 用户昵称或真实姓名
   */
  name: string;
  /**
   * 用户所在省份
   */
  province: string;
  /**
   * 用户个性签名，如果有的话
   */
  signature: string;
  /**
   * 用户的微信ID
   */
  wxid: string;
}

export interface ResponseData {
  code: number; // 状态码，例如 200
  data: any; // 用户数据，当前为空对象
  msg: string; // 响应消息，例如 "success"
}

export interface ContentRaw {
  content: string;
  detail: string;
  id1: string;
  id2: string;
  thumb: string;
}

// 联系人
export interface ContactRaw {
  /**
   * 用户自定义的账号
   */
  customAccount: string;
  /**
   * 加密名称，如果有的话
   */
  encryptName: string;
  /**
   * 用户的昵称
   */
  nickname: string;
  /**
   * 用户昵称的拼音首字母
   */
  pinyin: string;
  /**
   * 用户昵称的完整拼音
   */
  pinyinAll: string;
  /**
   * 预留字段1，具体用途未知
   */
  reserved1: number;
  /**
   * 预留字段2，具体用途未知
   */
  reserved2: number;
  /**
   * 联系人类型
   */
  type: number;
  /**
   * 验证标志，用于表示用户的验证状态
   */
  verifyFlag: number;
  /**
   * 用户的微信ID
   */
  wxid: string;
}

// 联系人详情
export interface MemberDetailRaw {
  /**
   * 用户账号，如果未设置则为空字符串
   */
  account: string;
  /**
   * 用户的头像图片URL，如果未设置则为空字符串
   */
  headImage: string;
  /**
   * 用户昵称
   */
  nickname: string;
  /**
   * 用户的V3信息，通常用于加密或验证，可能包含特定的加密字符串
   */
  v3: string;
  /**
   * 用户的微信ID
   */
  wxid: string;
}

export interface RoomRaw {
  /**
   * 管理员的用户ID，如果没有管理员则为空字符串
   */
  admin: string;
  /**
   * 聊天室ID，如果没有指定聊天室则为空字符串
   */
  chatRoomId: string;
  /**
   * 聊天室公告内容，如果没有设置公告则为空字符串
   */
  notice: string;
  /**
   * 聊天室相关的XML信息，通常包含聊天室的详细配置信息，如果没有则为空字符串
   */
  xml: string;
}

export interface RoomMembersRaw {
  /**
   * 聊天室管理员的微信ID
   */
  admin: string;
  /**
   * 聊天室管理员的昵称
   */
  adminNickname: string;
  /**
   * 聊天室的ID
   */
  chatRoomId: string;
  /**
   * 正在提及的成员昵称，可能包含特殊字符作为昵称的一部分
   */
  memberNickname: string;
  /**
   * 聊天室成员的微信ID列表，各ID之间使用特定字符分隔
   */
  members: string;
}

export interface MessageRaw {
  /**
   * 消息内容，可能包含用户ID和冒号之后的文本内容
   */
  content: string;
  /**
   * 消息创建时间的UNIX时间戳
   */
  createTime: number;
  /**
   * 完整的消息内容，如果有的话
   */
  displayFullContent: string;
  /**
   * 发送消息的用户或群组ID
   */
  fromUser: string;
  /**
   * 消息的唯一标识符
   */
  msgId: number;
  /**
   * 消息序列号
   */
  msgSequence: number;
  /**
   * 消息的PID
   */
  pid: number;
  /**
   * 消息签名，包含一系列的配置信息
   */
  signature: string;
  /**
   * 消息接收者的用户ID
   */
  toUser: string;
  /**
   * 消息类型
   */
  type: number;
}

export const getDBInfo = () => {
  return post('/api/getDBInfo')
}

export const execSql = (data:{dbHandle: number; sql: string}) => {
  return post('/api/execSql', data)
}

interface Table {
  /**
   * 任务名称
   */
  name: string;
  /**
   * 根页面
   */
  rootpage: string;
  /**
   * SQL 创建表的语句
   */
  sql: string;
  /**
   * 表名称
   */
  tableName: string;
}

interface DB {
  databaseName:'MicroMsg.db'|'ChatMsg.db'|'Misc.db'|'Emotion.db'|
  'Media.db'|'FunctionMsg.db'|'MSG0.db'|'MediaMSG0.db'|'PublicMsg.db'|'PublicMsgMedia.db'|'Favorite.db'|'';
  handle:number;
  tables:Table[]
}

interface DBInfoMap {
  [key:string]:number;
  'MicroMsg.db':number;
  'ChatMsg.db':number;
  'Misc.db':number;
  'Emotion.db':number;
  'Media.db':number;
  'FunctionMsg.db':number;
  'MSG0.db':number;
  'MediaMSG0.db':number;
  'PublicMsg.db':number;
  'PublicMsgMedia.db':number;
  'Favorite.db':number;
}

let dbInfo:DB[] = []
const dbInfoMap:DBInfoMap = {
  'MicroMsg.db': 0,
  'ChatMsg.db': 0,
  'Misc.db': 0,
  'Emotion.db': 0,
  'Media.db': 0,
  'FunctionMsg.db': 0,
  'MSG0.db': 0,
  'MediaMSG0.db': 0,
  'PublicMsg.db': 0,
  'PublicMsgMedia.db': 0,
  'Favorite.db': 0,
}

// DB数据格式化,单条数据
export const formatDBDataOne = (data:any[]) => {
  const res:{
    [key:string]:any
  } = {}
  const titles = data[0]
  const values = data[1]
  titles.forEach((title:string, index:number) => {
    res[title] = values[index]
  })
  return res
}

// DB数据格式化,多条数据
export const formatDBDataMulti = (data:any[]) => {
  const res:{
    [key:string]:any
  }[] = []
  const titles = data[0]
  const values = data.slice(1)
  values.forEach((item:any[]) => {
    const obj:{
      [key:string]:any
    } = {}
    titles.forEach((title:string, index:number) => {
      obj[title] = item[index]
    })
    res.push(obj)
  })
  return res
}

export const initDBInfo = async () => {
  const res = await getDBInfo()
  // log.info('initDBInfo:', JSON.stringify(res.data))
  dbInfo = res.data.data
  dbInfo.forEach((item, _index) => {
    dbInfoMap[item.databaseName] = item.handle
  })
  log.info('dbInfoMap:', JSON.stringify(dbInfoMap, null, 2))
  return res
}

export const getMsg = async () => {
  const query = {
    dbHandle: dbInfoMap['MediaMSG0.db'],
    // sql: `SELECT * FROM Media WHERE Reserved0 = ${msgId}`,
    // sql: "SELECT * FROM Media WHERE Type = '3'",
    // sql: 'SELECT * FROM Media LIMIT 2',
    sql: `SELECT GROUP_CONCAT(Dir, '/') AS imgSuffix  
    FROM (  
        SELECT Dir  
        FROM HardLinkImageID hlii  
        WHERE DirId = (  
            SELECT DirID2  
            FROM HardLinkImageAttribute hlia  
            WHERE hex(Md5) = UPPER(msg_xml_img_md5)  
        )  
        UNION ALL  
        SELECT Dir  
        FROM HardLinkImageID hlii  
        WHERE DirId = (  
            SELECT DirID1  
            FROM HardLinkImageAttribute hlia  
            WHERE hex(Md5) = UPPER(msg_xml_img_md5)  
        )  
        UNION ALL 
         SELECT FileName  
            FROM HardLinkImageAttribute hlia  
            WHERE hex(Md5) = UPPER(msg_xml_img_md5)  
    );`,
  }
  log.info('query:', JSON.stringify(query))
  const queryRes = await execSql(query)
  log.info('queryRes:', JSON.stringify(queryRes.data))
  if (queryRes.data && queryRes.data.data && queryRes.data.data.length > 0) {
    const msgInfo = formatDBDataOne(queryRes.data.data)
    // log.info('msgInfo:', JSON.stringify(msgInfo, null, 2))
    return {
      data:{
        code:1,
        msg:'success',
        data:msgInfo,
      },
    }
  } else {
    log.info('queryRes.data.data is empty')
    return {
      data:{
        code:0,
        msg:'success',
        data:null,
      },
    }
  }
}

export const checkLogin = () => {
  return post('/api/checkLogin')
}

export const userInfo = () => {
  return post('/api/userInfo')
}

export const sendTextMsg = (wxid: string, msg: string) => {
  return post('/api/sendTextMsg', { wxid, msg })
}

export const sendImagesMsg = (wxid: string, imagePath: string) => {
  return post('/api/sendImagesMsg', { wxid, imagePath })
}

export const sendFileMsg = (wxid: string, filePath: string) => {
  return post('/api/sendFileMsg', { wxid, filePath })
}

export const hookSyncMsg = (parm: {
  port: string
  ip: string
  url: string
  timeout: string
  enableHttp: boolean
}) => {
  return post('/api/hookSyncMsg', parm)
}

export const unhookSyncMsg = () => {
  return post('/api/unhookSyncMsg')
}

export const getContactList = () => {
  return post('/api/getContactList')
}

// 获取群详情
export const getChatRoomDetailInfo = async (chatRoomId: string) => {
  // return post('/api/getChatRoomDetailInfo', { chatRoomId })
  const query = {
    dbHandle: dbInfoMap['MicroMsg.db'],
    sql: `SELECT * FROM ChatRoomInfo WHERE ChatRoomName = '${chatRoomId}'`,
  }
  // log.info('query:', JSON.stringify(query))
  const chatRoomRes = await execSql(query)
  // log.info('chatRoomRes:', JSON.stringify(chatRoomRes.data))
  if (chatRoomRes.data && chatRoomRes.data.data && chatRoomRes.data.data.length > 0) {
    const chatRoomInfo = formatDBDataOne(chatRoomRes.data.data)
    // log.info('chatRoomInfo:', JSON.stringify(chatRoomInfo, null, 2))
    return {
      data:{
        code:1,
        msg:'success',
        data:{
          chatRoomId:chatRoomInfo['ChatRoomName'],
          notice:chatRoomInfo['Announcement'],
          xml:chatRoomInfo['Reserved2'],
          admin:chatRoomInfo['AnnouncementEditor'],
        },
      },
    }
  } else {
    log.info('chatRoomRes.data.data is empty')
    return {
      data:{
        code:0,
        msg:'success',
        data:null,
      },
    }
  }

}

export const addMemberToChatRoom = (chatRoomId: string, memberIds: string) => {
  return post('/api/addMemberToChatRoom', { chatRoomId, memberIds })
}

export const delMemberFromChatRoom = (chatRoomId: string, memberIds: string) => {
  return post('/api/delMemberFromChatRoom', { chatRoomId, memberIds })
}

export const modifyNickname = (chatRoomId: string, wxid: string, nickName: string) => {
  return post('/api/modifyNickname', { chatRoomId, wxid, nickName })
}

// 获取群成员
export const getMemberFromChatRoom = async (chatRoomId: string) => {
  // return post('/api/getMemberFromChatRoom', { chatRoomId })
  const query = {
    dbHandle: dbInfoMap['MicroMsg.db'],
    sql: `SELECT * FROM ChatRoom WHERE ChatRoomName = '${chatRoomId}'`,
  }
  // log.info('query:', JSON.stringify(query))
  const chatRoomRes = await execSql(query)
  // log.info('chatRoomRes:', JSON.stringify(chatRoomRes.data))
  if (chatRoomRes.data && chatRoomRes.data.data && chatRoomRes.data.data.length > 0) {
    const chatRoomInfo = formatDBDataOne(chatRoomRes.data.data)
    // log.info('chatRoomInfo:', JSON.stringify(chatRoomInfo, null, 2))
    return {
      data:{
        code:1,
        msg:'success',
        data:{
          chatRoomId:chatRoomInfo['ChatRoomName'],
          admin:chatRoomInfo['Reserved2'],
          adminNickname:'',
          memberNickname:chatRoomInfo['DisplayNameList'],
          members:chatRoomInfo['UserNameList'],
        },
      },
    }
  } else {
    log.info('chatRoomRes.data.data is empty')
    return {
      data:{
        code:0,
        msg:'success',
        data:null,
      },
    }
  }
}

export const topMsg = (msgId: number) => {
  return post('/api/topMsg', { msgId })
}

export const removeTopMsg = (chatRoomId: string, msgId: number) => {
  return post('/api/removeTopMsg', { chatRoomId, msgId })
}

export const InviteMemberToChatRoom = (chatRoomId: string, memberIds: string) => {
  return post('/api/InviteMemberToChatRoom', { chatRoomId, memberIds })
}

export const hookLog = () => {
  return post('/api/hookLog')
}

export const unhookLog = () => {
  return post('/api/unhookLog')
}

export const createChatRoom = (memberIds: string) => {
  return post('/api/createChatRoom', { memberIds })
}

export const quitChatRoom = (chatRoomId: string) => {
  return post('/api/quitChatRoom', { chatRoomId })
}

export const forwardMsg = (wxid: string, msgId: string) => {
  return post('/api/forwardMsg', { wxid, msgId })
}

export const getSNSFirstPage = () => {
  return post('/api/getSNSFirstPage')
}

export const getSNSNextPage = (snsId: string) => {
  return post('/api/getSNSNextPage', { snsId })
}

export const addFavFromMsg = (msgId: string) => {
  return post('/api/addFavFromMsg', { msgId })
}

export const addFavFromImage = (wxid: string, imagePath: string) => {
  return post('/api/addFavFromImage', { wxid, imagePath })
}

export const getContactProfile = async (wxid: string) => {
  // return post('/api/getContactProfile', { wxid })
  const query = {
    dbHandle: dbInfoMap['MicroMsg.db'],
    sql: `SELECT * FROM Contact WHERE UserName = '${wxid}'`,
  }
  // log.info('query:', JSON.stringify(query))
  const queryRes = await execSql(query)
  log.info('chatRoomRes:', JSON.stringify(queryRes.data))
  if (queryRes.data && queryRes.data.data && queryRes.data.data.length > 0) {
    const chatRoomInfo = formatDBDataOne(queryRes.data.data)
    log.info('chatRoomInfo:', JSON.stringify(chatRoomInfo, null, 2))
    return {
      data:{
        code:1,
        msg:'success',
        data:{
          account:chatRoomInfo['UserName'],
          headImage:chatRoomInfo['BigHeadImgUrl'],
          nickname:chatRoomInfo['NickName'],
          v3:chatRoomInfo['EncryptUserName'],
          wxid:chatRoomInfo['UserName'],
        },
      },
    }
  } else {
    log.info('chatRoomRes.data.data is empty')
    return {
      data:{
        code:0,
        msg:'success',
        data:null,
      },
    }
  }
}

export const sendAtText = (wxids: string, chatRoomId: string, msg: string) => {
  return post('/api/sendAtText', { wxids, chatRoomId, msg })
}

// sendMultiAtText
export const sendMultiAtText = (chatRoomId: string, at:{
  wxid:string;
  msg: string
}[]) => {
  return post('/api/sendMultiAtText', { chatRoomId, at })
}

export const forwardPublicMsg = (param: {
  appName: string;
  userName: string;
  title: string;
  url: string;
  thumbUrl: string;
  digest: string;
  wxid: string
}) => {
  return post('/api/forwardPublicMsg', param)
}

export const forwardPublicMsgByMsgId = (msgId: number, wxid: string) => {
  return post('/api/forwardPublicMsgByMsgId', { msgId, wxid })
}

export const downloadAttach = (msgId: number) => {
  return post('/api/downloadAttach', { msgId })
}

export const decodeImage = (filePath: string, storeDir: string) => {
  return post('/api/decodeImage', { filePath, storeDir })
}

export const getVoiceByMsgId = (msgId: number, storeDir: string) => {
  return post('/api/getVoiceByMsgId', { msgId, storeDir })
}

// /api/sendApplet
export const sendApplet = (param: {
  wxid: string
  waidConcat: string
  appletWxid: string
  jsonParam: string
  headImgUrl: string
  mainImg: string
  indexPage: string
}) => {
  return post('/api/sendApplet', param)
}

// /api/sendPatMsg
export const sendPatMsg = (receiver: string,
  wxid: string) => {
  return post('/api/sendPatMsg', { wxid, receiver })
}

// /api/ocr
export const ocr = (
  imagePath: string,
) => {
  return post('/api/ocr', { imagePath })
}

// getLoginUrl
export const getLoginUrl = () => {
  return post('/api/getLoginUrl')
}

// translateVoice
export const translateVoice = (msgId: string) => {
  return post('/api/translateVoice', { msgId })
}

// getTranslateVoiceText
export const getTranslateVoiceText = (msgId: string) => {
  return post('/api/getTranslateVoiceText', { msgId })
}

// openUrlByWeChat
export const openUrlByWeChat = (url: string, flag:0|1|2) => {
  return post('/api/openUrlByWeChat', { url, flag })
}

// lockWeChat
export const lockWeChat = () => {
  return post('/api/lockWeChat')
}

// unlockWeChat
export const unlockWeChat = () => {
  return post('/api/unlockWeChat')
}

// clickEnterWeChat
export const clickEnterWeChat = () => {
  return post('/api/clickEnterWeChat')
}
