/* eslint-disable sort-keys */
import axios from 'axios'

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

// ----------wxbot-sidecar----------

// 从DB获取联系人信息
export interface ContactRawWxbotDb {
  /**
   * 微信号
   */
  Alias: string;
  /**
   * 昵称
   */
  NickName: string;
  /**
   * v3
   */
  EncryptUserName: string;
  /**
   * 备注
   */
  Remark: string;
  /**
   * 备注拼音首字母大写
   */
  RemarkPYInitial: string;
  /**
   * 备注拼音全
   */
  RemarkQuanPin: string;
  /**
   * 昵称拼音首字母大写
   */
  PYInitial: string;
  /**
   * 昵称拼音全
   */
  QuanPin: string;
  /**
   * 头像
   */
  profilePicture: string;
  /**
   * 小头像
   */
  profilePictureSmall: string;
  /**
   * 类型
   */
  type: string;
  /**
   * wxid
   */
  UserName: string;
}

// 从接口获取联系人信息
export interface ContactRawWxbotApi {
  /**
   * 微信号
   */
  customAccount: string;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * v3
   */
  v3: string;
  /**
   * 备注
   */
  note: string;
  /**
   * 备注拼音首字母大写
   */
  notePinyin: string;
  /**
   * 备注拼音全
   */
  notePinyinAll: string;
  /**
   * 昵称拼音首字母大写
   */
  pinyin: string;
  /**
   * 昵称拼音全
   */
  pinyinAll: string;
  /**
   * 头像
   */
  profilePicture: string;
  /**
   * 小头像
   */
  profilePictureSmall: string;
  /**
   * 预留字段
   */
  reserved1: string;
  /**
   * 类型
   */
  type: string;
  /**
   * 验证标志
   */
  verifyFlag: string;
  /**
   * wxid
   */
  wxid: string;
}

// 从DB获取群成员信息
export interface RoomMemberRawWxbotDb {
  Alias: string; // 别名
  BigHeadImgUrl: string; // 大头像URL
  ChatRoomNotify: string; // 聊天室通知设置
  ChatRoomType: string; // 聊天室类型
  DelFlag: string; // 删除标记
  DomainList: string; // 域名列表
  EncryptUserName: string; // 加密用户名
  /**
   * 额外的缓冲信息
   * 例如: 3fMmgwQCAAAAdHUsBgQAAAAAiOKPzgQAAAAAdhodLRgCAAAAAAACY6DLBAAAAAAEUf8SGAIAAAAAACKMZqgEAAAAAEbPEMQYAgAAAAAApNkCShgCAAAAAADi6qjRGAIAAAAAAB0CW78YAgAAAAAATWxFcAQAAAAA+Re8wBgCAAAAAABDNd/dGAIAAAAAAN5M2usYAgAAAAAApyvCCgT/////Bp/tUgQCAAAAmw9CmQQAAAAAPWQeIgQAAAAAEkmCLAQAAAAATrlthRgCAAAAAAC09zrLBAAAAAAJWeuSBAAAAAA89KMVGAIAAAAAAMlHesYCAeRM0OgEAAAAALes8PUEAAAAAFentagFAAAAAAAAAACBrhm0GAIAAAAAAGlfMXAYAgAAAAAA+wg92RgCAAAAAAACQON/GAIAAAAAADFdAqMYAgAAAAAAfewLwxgCAAAAAAAOcZ8TGAIAAAAAABZ5HJAXAgAAAAoA
   */
  ExtraBuf: string;
  HeadImgMd5: string; // 头像MD5
  LabelIDList: string; // 标签ID列表
  /**
   * 用户昵称
   * 例如: 双语互译聊天&顺风车消息检测
   */
  NickName: string;
  PYInitial: string; // 拼音缩写
  QuanPin: string; // 全拼
  Remark: string; // 备注
  RemarkPYInitial: string; // 备注的拼音缩写
  RemarkQuanPin: string; // 备注的全拼
  Reserved1: string; // 预留字段1
  Reserved10: string; // 预留字段10
  Reserved11: string; // 预留字段11
  Reserved2: string; // 预留字段2
  Reserved3: string; // 预留字段3
  Reserved4: string; // 预留字段4
  Reserved5: string; // 预留字段5
  Reserved6: string; // 预留字段6
  Reserved7: string; // 预留字段7
  Reserved8: string; // 预留字段8
  Reserved9: string; // 预留字段9
  SmallHeadImgUrl: string; // 小头像URL
  Type: string; // 类型
  UserName: string; // 用户名
  VerifyFlag: string; // 验证标记
  profilePicture: string; // 配置文件图片
  profilePictureSmall: string; // 小配置文件图片
}

// 从接口获取群成员信息
export interface RoomMemberRawWxbotApi {
  /**
   * 自定义账号，可能为空字符串
   */
  customAccount: string;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 备注信息
   */
  note: string;
  /**
   * 拼音大写
   */
  pinyin: string;
  /**
   * 拼音小写
   */
  pinyinAll: string;
  /**
   * 用户头像的 URL
   */
  profilePicture: string;
  /**
   * 用户小头像的 URL
   */
  profilePictureSmall: string;
  /**
   * 可能为空字符串的字段
   */
  v3: string;
}

// 从DB使用wxid反查用户信息
export interface ContactRawByWxidDb {
  /**
   * 微信号
   */
  Alias: string;
  /**
   * 昵称
   */
  NickName: string;
  /**
   * v3 加密用户名
   */
  EncryptUserName: string;
  /**
   * 备注
   */
  Remark: string;
  /**
   * 备注拼音首字母大写
   */
  RemarkPYInitial: string;
  /**
   * 备注拼音全
   */
  RemarkQuanPin: string;
  /**
   * 昵称拼音首字母大写
   */
  PYInitial: string;
  /**
   * 昵称拼音全
   */
  QuanPin: string;
  /**
   * 头像
   */
  profilePicture: string;
  /**
   * 小头像
   */
  profilePictureSmall: string;
  /**
   * 类型
   */
  type: string;
  /**
   * wxid
   */
  UserName: string;
}

// 使用wxid反查用户信息
export interface ContactRawByWxidApi {
  /**
   * 微信号
   */
  customAccount: string;
  /**
   * 昵称
   */
  nickname: string;
  /**
   * 备注
   */
  note: string;
  /**
   * 昵称拼音首字母大写
   */
  pinyin: string;
  /**
   * 昵称拼音全
   */
  pinyinAll: string;
  /**
   * 头像
   */
  profilePicture: string;
  /**
   * 小头像
   */
  profilePictureSmall: string;
  /**
   * V3 特定标识
   */
  v3: string;
}

// enum ApiEndpoint {
//   UserInfo = '/api/userinfo', // 获取登录用户信息
//   Contacts = '/api/contacts', // 获取通讯录信息，不建议使用，请使用 DbContacts
//   DbContacts = '/api/dbcontacts', // 从数据库中获取通讯录信息
//   SendTxtMsg = '/api/sendtxtmsg', // 发送文本消息
//   SendImgMsg = '/api/sendimgmsg', // 发送图片消息
//   SendFileMsg = '/api/sendfilemsg', // 发送文件消息
//   ChatRoom = '/api/chatroom', // 获取群聊组成员列表，不建议使用，请使用 DbChatRoom
//   DbChatRoom = '/api/dbchatroom', // 从数据库中获取群聊组信息和成员列表
//   AccountByWxid = '/api/accountbywxid', // WXID反查微信昵称，不建议使用，请使用 DbAccountByWxid
//   DbAccountByWxid = '/api/dbaccountbywxid', // 从数据库中通过WXID反查微信昵称
//   ForwardMsg = '/api/forwardmsg', // 消息转发
//   DBS = '/api/dbs', // 获取支持查询的数据库句柄
//   ExecSql = '/api/execsql', // 通过数据库句柄执行SQL语句
//   Close = '/close', // 停止 wxbot-sidecar（停止http server，并中止程序运行）
// }

// def checkLogin():
//     url = "127.0.0.1:19088/api/checkLogin"
//     payload = {}
//     headers = {}
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const checkLogin = () => {
  return post('/api/checkLogin')
}

// def userInfo():
// url = "127.0.0.1:19088/api/userInfo"
// payload = {}
// headers = {}
// response = requests.request("POST", url, headers=headers, data=payload)
// print(response.text)
export const userInfo = () => {
  return post('/api/userInfo')
}

// def sendTextMsg():
//     url = "127.0.0.1:19088/api/sendTextMsg"
//     payload = json.dumps({
//         "wxid": "filehelper",
//         "msg": "12www"
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const sendTextMsg = (wxid: string, msg: string) => {
  return post('/api/sendTextMsg', { wxid, msg })
}

// def sendImagesMsg():
//     url = "127.0.0.1:19088/api/sendImagesMsg"
//     print("modify imagePath")
//     raise RuntimeError("modify imagePath then deleted me")
//     payload = json.dumps({
//         "wxid": "filehelper",
//         "imagePath": "C:\\pic.png"
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)

//     print(response.text)

export const sendImagesMsg = (wxid: string, imagePath: string) => {
  return post('/api/sendImagesMsg', { wxid, imagePath })
}

// def sendFileMsg():
//     url = "127.0.0.1:19088/api/sendFileMsg"
//     print("modify filePath")
//     raise RuntimeError("modify filePath then deleted me")
//     payload = json.dumps({
//         "wxid": "filehelper",
//         "filePath": "C:\\test.zip"
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)

export const sendFileMsg = (wxid: string, filePath: string) => {
  return post('/api/sendFileMsg', { wxid, filePath })
}

// def hookSyncMsg():
//     url = "127.0.0.1:19088/api/hookSyncMsg"
//     print("modify ip port url ")
//     raise RuntimeError("modify ip port url then deleted me")
//     payload = json.dumps({
//         "port": "19099",
//         "ip": "127.0.0.1",
//         "url": "http://localhost:8080",
//         "timeout": "3000",
//         "enableHttp": "0"
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const hookSyncMsg = (parm: {
  port: string
  ip: string
  url: string
  timeout: string
  enableHttp: boolean
}) => {
  return post('/api/hookSyncMsg', parm)
}

// def unhookSyncMsg():
//     url = host + "/api/unhookSyncMsg"
//     payload = {}
//     headers = {}
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const unhookSyncMsg = () => {
  return post('/api/unhookSyncMsg')
}

// def getContactList():
//     url = host + "/api/getContactList"
//     payload = {}
//     headers = {}
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const getContactList = () => {
  return post('/api/getContactList')
}

// def getDBInfo():
//     url = host + "/api/getDBInfo"
//     payload = {}
//     headers = {}
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const getDBInfo = () => {
  return post('/api/getDBInfo')
}

// def execSql():
//     url = host + "/api/execSql"
//     print("modify dbHandle ")
//     raise RuntimeError("modify dbHandle then deleted me")
//     payload = json.dumps({
//         "dbHandle": 1713425147584,
//         "sql": "select * from MSG where localId =100;"
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const execSql = (dbHandle: number, sql: string) => {
  return post('/api/execSql', { dbHandle, sql })
}

// def getChatRoomDetailInfo():
//     url = host + "/api/getChatRoomDetailInfo"
//     print("modify chatRoomId ")
//     raise RuntimeError("modify chatRoomId then deleted me")
//     payload = json.dumps({
//         "chatRoomId": "123333@chatroom"
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const getChatRoomDetailInfo = (chatRoomId: string) => {
  return post('/api/getChatRoomDetailInfo', { chatRoomId })
}

// def addMemberToChatRoom():
//     url = host + "/api/addMemberToChatRoom"
//     print("modify chatRoomId  memberIds ")
//     raise RuntimeError("modify chatRoomId memberIds then deleted me")
//     payload = json.dumps({
//         "chatRoomId": "123@chatroom",
//         "memberIds": "wxid_123"
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)

//     print(response.text)
export const addMemberToChatRoom = (chatRoomId: string, memberIds: string) => {
  return post('/api/addMemberToChatRoom', { chatRoomId, memberIds })
}

// def delMemberFromChatRoom():
//     url = host + "/api/delMemberFromChatRoom"
//     print("modify chatRoomId  memberIds ")
//     raise RuntimeError("modify chatRoomId memberIds then deleted me")
//     payload = json.dumps({
//         "chatRoomId": "21363231004@chatroom",
//         "memberIds": "wxid_123"
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const delMemberFromChatRoom = (chatRoomId: string, memberIds: string) => {
  return post('/api/delMemberFromChatRoom', { chatRoomId, memberIds })
}

// def modifyNickname():
//     url = host + "/api/modifyNickname"
//     print("modify chatRoomId  wxid  nickName")
//     raise RuntimeError("modify chatRoomId  wxid  nickName then deleted me")
//     payload = json.dumps({
//         "chatRoomId": "123@chatroom",
//         "wxid": "wxid_123",
//         "nickName": "test"
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const modifyNickname = (chatRoomId: string, wxid: string, nickName: string) => {
  return post('/api/modifyNickname', { chatRoomId, wxid, nickName })
}

// def getMemberFromChatRoom():
//     print("modify chatRoomId  ")
//     raise RuntimeError("modify chatRoomId then deleted me")
//     url = host + "/api/getMemberFromChatRoom"
//     payload = json.dumps({
//         "chatRoomId": "123@chatroom"
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const getMemberFromChatRoom = (chatRoomId: string) => {
  return post('/api/getMemberFromChatRoom', { chatRoomId })
}

// def topMsg():
//     print("modify msgId  ")
//     raise RuntimeError("modify msgId then deleted me")
//     url = host + "/api/topMsg"
//     payload = json.dumps({
//         "msgId": 1222222
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const topMsg = (msgId: number) => {
  return post('/api/topMsg', { msgId })
}

// def removeTopMsg():
//     print("modify msgId chatRoomId ")
//     raise RuntimeError("modify msgId chatRoomId then deleted me")

//     url = host + "/api/removeTopMsg"

//     payload = json.dumps({
//         "chatRoomId": "123@chatroom",
//         "msgId": 123
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const removeTopMsg = (chatRoomId: string, msgId: number) => {
  return post('/api/removeTopMsg', { chatRoomId, msgId })
}

// def InviteMemberToChatRoom():
//     print("modify memberIds chatRoomId ")
//     raise RuntimeError("modify memberIds chatRoomId then deleted me")

//     url = host + "/api/InviteMemberToChatRoom"

//     payload = json.dumps({
//         "chatRoomId": "123@chatroom",
//         "memberIds": "wxid_123"
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const InviteMemberToChatRoom = (chatRoomId: string, memberIds: string) => {
  return post('/api/InviteMemberToChatRoom', { chatRoomId, memberIds })
}

// def hookLog():
//     url = host + "/api/hookLog"
//     payload = {}
//     headers = {}
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const hookLog = () => {
  return post('/api/hookLog')
}

// def unhookLog():
//     url = host + "/api/unhookLog"
//     payload = {}
//     headers = {}
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const unhookLog = () => {
  return post('/api/unhookLog')
}

// def createChatRoom():
//     print("modify memberIds  ")
//     raise RuntimeError("modify memberIds then deleted me")
//     url = host + "/api/createChatRoom"

//     payload = json.dumps({
//         "memberIds": "wxid_8yn4k908tdqp22,wxid_oyb662qhop4422"
//     })
//     headers = {
//         'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const createChatRoom = (memberIds: string) => {
  return post('/api/createChatRoom', { memberIds })
}

// def quitChatRoom():
//     print("modify chatRoomId  ")
//     raise RuntimeError("modify chatRoomId then deleted me")
//     url = host + "/api/quitChatRoom"

//     payload = json.dumps({
//     "chatRoomId": "123@chatroom"
//     })
//     headers = {
//     'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const quitChatRoom = (chatRoomId: string) => {
  return post('/api/quitChatRoom', { chatRoomId })
}

// def forwardMsg():
//     print("modify msgId  ")
//     raise RuntimeError("modify msgId then deleted me")
//     url = host + "/api/forwardMsg"

//     payload = json.dumps({
//     "wxid": "filehelper",
//     "msgId": "12331"
//     })
//     headers = {
//     'Content-Type': 'application/json'
//     }
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const forwardMsg = (wxid: string, msgId: string) => {
  return post('/api/forwardMsg', { wxid, msgId })
}

// def getSNSFirstPage():
//     url = host + "/api/getSNSFirstPage"

//     payload = {}
//     headers = {}
//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const getSNSFirstPage = () => {
  return post('/api/getSNSFirstPage')
}

// def getSNSNextPage():
//     print("modify snsId  ")
//     raise RuntimeError("modify snsId then deleted me")
//     url = host + "/api/getSNSNextPage"

//     payload = json.dumps({
//     "snsId": ""
//     })
//     headers = {
//     'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)

//     print(response.text)
export const getSNSNextPage = (snsId: string) => {
  return post('/api/getSNSNextPage', { snsId })
}

// def addFavFromMsg():
//     print("modify msgId  ")
//     raise RuntimeError("modify msgId then deleted me")
//     url = host + "/api/addFavFromMsg"

//     payload = json.dumps({
//     "msgId": "1222222"
//     })
//     headers = {
//     'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)

//     print(response.text)
export const addFavFromMsg = (msgId: string) => {
  return post('/api/addFavFromMsg', { msgId })
}

// def addFavFromImage():
//     print("modify wxid imagePath ")
//     raise RuntimeError("modify wxid  imagePath then deleted me")
//     url = host + "/api/addFavFromImage"

//     payload = json.dumps({
//     "wxid": "",
//     "imagePath": ""
//     })
//     headers = {
//     'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)

//     print(response.text)
export const addFavFromImage = (wxid: string, imagePath: string) => {
  return post('/api/addFavFromImage', { wxid, imagePath })
}

// def getContactProfile():
//     print("modify wxid  ")
//     raise RuntimeError("modify wxid   then deleted me")
//     url = host + "/api/getContactProfile"

//     payload = json.dumps({
//     "wxid": ""
//     })
//     headers = {
//     'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)
//     print(response.text)
export const getContactProfile = (wxid: string) => {
  return post('/api/getContactProfile', { wxid })
}

// def sendAtText():
//     print("modify wxids  chatRoomId")
//     raise RuntimeError("modify wxids   chatRoomId then deleted me")
//     url = host + "/api/sendAtText"

//     payload = json.dumps({
//     "wxids": "notify@all",
//     "chatRoomId": "123@chatroom",
//     "msg": "你好啊"
//     })
//     headers = {
//     'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)

//     print(response.text)
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

// def forwardPublicMsg():
//     print("modify param ")
//     raise RuntimeError("modify param then deleted me")
//     url = host + "/api/forwardPublicMsg"

//     payload = json.dumps({
//     "appName": "",
//     "userName": "",
//     "title": "",
//     "url": "",
//     "thumbUrl": "",
//     "digest": "",
//     "wxid": "filehelper"
//     })
//     headers = {
//     'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)

//     print(response.text)
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

// def forwardPublicMsgByMsgId():
//     print("modify param ")
//     raise RuntimeError("modify param then deleted me")
//     url = host + "/api/forwardPublicMsgByMsgId"

//     payload = json.dumps({
//     "msgId": 123,
//     "wxid": "filehelper"
//     })
//     headers = {
//     'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)

//     print(response.text)
export const forwardPublicMsgByMsgId = (msgId: number, wxid: string) => {
  return post('/api/forwardPublicMsgByMsgId', { msgId, wxid })
}

// def downloadAttach():
//     print("modify param ")
//     raise RuntimeError("modify param then deleted me")
//     url = host + "/api/downloadAttach"

//     payload = json.dumps({
//     "msgId": 123
//     })
//     headers = {
//     'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)

//     print(response.text)
export const downloadAttach = (msgId: number) => {
  return post('/api/downloadAttach', { msgId })
}

// def decodeImage():
//     print("modify param ")
//     raise RuntimeError("modify param then deleted me")
//     url = host + "/api/decodeImage"

//     payload = json.dumps({
//     "filePath": "C:\\66664816980131.dat",
//     "storeDir": "C:\\test"
//     })
//     headers = {
//     'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)

//     print(response.text)
export const decodeImage = (filePath: string, storeDir: string) => {
  return post('/api/decodeImage', { filePath, storeDir })
}

// def getVoiceByMsgId():
//     print("modify param ")
//     raise RuntimeError("modify param then deleted me")
//     url = host + "/api/getVoiceByMsgId"

//     payload = json.dumps({
//     "msgId": 7880439644200,
//     "storeDir": "c:\\test"
//     })
//     headers = {
//     'Content-Type': 'application/json'
//     }

//     response = requests.request("POST", url, headers=headers, data=payload)

//     print(response.text)
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
