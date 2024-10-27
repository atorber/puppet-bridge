/* eslint-disable no-console */
/* eslint-disable camelcase */
/* eslint-disable sort-keys */
/****************************************
 * 重要：3.2.1.121，http的客户端已经改变调用方式
 * getRoomList()
 * getContactList()
 * messageSendText()
 * messageSendTextAt()
 * messageSendPicture()
 * messageSendFile()
 * getMemberNickName()
 * ***************************************/

import axios from 'axios'

const url = 'http://127.0.0.1:5555'
const USER_LIST = 5000
const TXT_MSG = 555
const PIC_MSG = 500
const AT_MSG = 550
const CHATROOM_MEMBER = 5010
const CHATROOM_MEMBER_NICK = 5020
const ATTATCH_FILE = 5003

function getid () {
  const id = Date.now()
  return id.toString()
}
async function messageSendTextAt () {
  const jpara = {
    id: getid(),
    type: AT_MSG,
    roomid: '23023281066@chatroom', // not null  23023281066@chatroom
    wxid: 'zhanghua_cd', // not null
    content: 'at msg test,hello world，真的有一套', // not null
    nickname: '老张',
    ext: 'null',
  }
  const options
  = {
    // method: 'GET',
    // url: 'https://apis.map.qq.com/ws/district/v1/list',
    url: url + '/api/sendatmsg',
    body: {
      para: jpara,
    },
    json: true,
  }
  const data = await axios.post(options.url, options.body)
  // const j = JSON.parse(data);

  // console.log(j.id);
  // console.log(j.status);
  return data

}
/** messageSendPicture
 *  发送图片
 */
async function messageSendPicture () {
  const jpara = {
    id: getid(),
    type: PIC_MSG,
    wxid: '23023281066@chatroom',
    roomid: 'null',
    content: 'C:\\tmp\\2.jpg',
    nickname: 'null',
    ext: 'null',
    // wxid:'22428457414@chatroom'

  }

  const options
  = {
    // method: 'GET',
    // url: 'https://apis.map.qq.com/ws/district/v1/list',
    url: url + '/api/sendpic',
    body: {
      para: jpara,
    },
    json: true,
  }
  const data = await axios.post(options.url, options.body)
  // const j = JSON.parse(data);

  // console.log(j.id);
  // console.log(j.status);
  return data

}

/** getMemberNickName
 * 获取群成员昵称
 */

async function getMemberNickName (wx_id: any, roomid: any) {

  const jpara = {
    id: getid(),
    type: CHATROOM_MEMBER_NICK,
    wxid: wx_id,
    roomid,
    content: 'null',
    nickname: 'null',
    ext: 'null',
    // wxid:'22428457414@chatroom'

  }
  const options
  = {

    url: url + '/api/getmembernick',
    body: {
      para: jpara,
    },
    json: true,
  }
  const data = await axios.post(options.url, options.body)
  // const j = JSON.parse(data);

  // console.log(j.id);
  // console.log(j.status);
  return data
}
/** get_getmemberid
 *   获取群成员id
 */
async function getMemberid () {

  const jpara = {
    id: getid(),
    type: CHATROOM_MEMBER,
    wxid: 'null',
    content: 'op:list member',
  }

  const options = {
    url: url + '/api/getmemberid',
    body: {
      para: jpara,
    },
    json: true,
  }
  const data = await axios.post(options.url, options.body)
  // const j = JSON.parse(data);

  // console.log(j.id);
  // console.log(j.status);
  return data
}

/** getContactList  获取好友和群列表
 *
 */
async function getContactList () {
  const jpara = {
    id: getid(),
    type: USER_LIST,
    roomid: 'null', // null
    wxid: 'null', // not null
    content: 'null', // not null
    nickname: 'null',
    ext: 'null',
  }
  const options = {
    url: url + '/api/getcontactlist',
    body: {
      para: jpara,
    },
    json: true,
  }
  const data = await axios.post(options.url, options.body)
  // const j = JSON.parse(data);

  // console.log(j.id);
  // console.log(j.status);
  return data

}
async function getRoomList () {
  const jpara = {
    id: getid(),
    type: CHATROOM_MEMBER,
    roomid: 'null', // null
    wxid: 'null', // not null
    content: 'null', // not null
    nickname: 'null',
    ext: 'null',
  }
  const options = {
    url: url + '/api/get_charroom_member_list', //
    body: {
      para: jpara,
    },
    json: true,
  }
  const data = await axios.post(options.url, options.body)
  // const j = JSON.parse(data);

  // console.log(j.id);
  // console.log(j.status);
  return data

}
/**
 * send txt message
 */
async function messageSendText () {
  const jpara = {
    id: getid(),
    type: TXT_MSG,
    wxid: '23023281066@chatroom', // roomid或wxid,必填
    roomid: 'null', // 此处为空
    content: 'hello word',
    nickname: 'null', // 此处为空
    ext: 'null', // 此处为空
    // wxid:'22428457414@chatroom'

  }
  const options
  = {
    // method: 'GET',
    // url: 'https://apis.map.qq.com/ws/district/v1/list',
    url: url + '/api/sendtxtmsg',
    body: {
      para: jpara,
    },
    json: true,
  }
  const data = await axios.post(options.url, options.body)
  // const j = JSON.parse(data);

  // console.log(j.id);
  // console.log(j.status);
  return data

}
/** messageSendFile
 * send the attatchment
 */
async function messageSendFile () {

  const jpara = {
    id: getid(),
    type: ATTATCH_FILE,
    wxid: '23023281066@chatroom', // roomid或wxid,必填
    roomid: 'null', // 此处为空
    content: 'C:\\tmp\\log.7z',
    nickname: 'null', // 此处为空
    ext: 'null', // 此处为空
    // wxid:'22428457414@chatroom'

  }
  const options
  = {
    // method: 'GET',
    // url: 'https://apis.map.qq.com/ws/district/v1/list',
    url: url + '/api/sendattatch',
    body: {
      para: jpara,
    },
    json: true,

  }
  const data = await axios.post(options.url, options.body)
  // const j = JSON.parse(data);

  // console.log(j.id);
  // console.log(j.status);
  return data
}

// async function main () {
//   const j = await getContactList()
//   // const j = await getRoomList();
//   // const j = await messageSendText();
//   // const j = await getMemberNickName("zhanghua_cd", "23023281066@chatroom");
//   // const j = await messageSendTextAt();
//   // const j = await messageSendFile();
//   // const j = await getMemberNickName();
//   // console.log(j);
//   // await send_destroy();
//   // await refresh_memberlist();
//   // console.log("test begin");
//   // const j = await send_destroy();
//   // const j = await messageSendFile();
//   console.log(JSON.stringify(j))
// }

// console.log('test');

export {
  messageSendFile,
  messageSendText,
  getRoomList,
  getContactList,
  messageSendPicture,
  getMemberNickName,
  messageSendTextAt,
  getMemberid,
}
