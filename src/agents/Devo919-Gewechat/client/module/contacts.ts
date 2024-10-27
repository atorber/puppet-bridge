/* eslint-disable sort-keys */
import type { ModuleOptions, AxiosInstance } from '../types/types.js'
import { log } from '../utils/logger.js'

export class Contacts {

  private appId: string
  private axios: AxiosInstance

  constructor (options: ModuleOptions) {
    this.appId = options.appId
    this.axios = options.axiosInstance
  }

  // 获取通讯录列表 /contacts/fetchContactsList POST
  async fetchContactsList () {
    const data = {
      appId: this.appId,
    }
    try {
      const response = await this.axios.post('/v2/api/contacts/fetchContactsList', data)
      log.info('fetchContactsList success:' + JSON.stringify(response.data))
      return response.data
    } catch (error) {
      // console.error('fetchContactsList failed:', error)
      log.error('fetchContactsList failed:' + error)
      throw error
    }
  }

  // 获取通讯录列表缓存 /contacts/fetchContactsListCache POST
  async fetchContactsListCache () {
    const data = {
      appId: this.appId,
    }
    try {
      const response = await this.axios.post('/v2/api/contacts/fetchContactsListCache', data)
      log.info('fetchContactsListCache success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('fetchContactsListCache failed:', error)
      log.error('fetchContactsListCache failed:' + error)
      throw error
    }
  }

  // 搜索好友 /contacts/search POST
  async search (keyword: string) {
    const data = {
      appId: this.appId,
      contactsInfo: keyword,
    }
    try {
      const response = await this.axios.post('/v2/api/contacts/search', data)
      log.info('search success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('failed:', error)
      log.error('failed:' + error)
      throw error
    }
  }

  // 添加联系人 /contacts/addContacts POST
  /*
appId
string
设备ID
必需
scene
integer
必需
添加来源，同意添加好友时传回调消息xml中的scene值。
添加好友时的枚举值如下：
3 ：微信号搜索
4 ：QQ好友
8 ：来自群聊
15：手机号

option
integer
必需
操作类型，2添加好友 3同意好友 4拒绝好友

v3
string
必需
通过搜索或回调消息获取到的v3

v4
string
必需
通过搜索或回调消息获取到的v4

content
string
添加好友时的招呼语

{
  "appId": "{{appid}}",
  "scene": 3,
  "content": "hallo",
  "v4": "v4_000b708f0b04000001000000000054a9e826263634356493c57b8e651000000050ded0b020927e3c97896a09d47e6e9e455d674c2544e251e77c7cba08cc6cef8f7df9e52d2bd4a3cef771c8661331fa1939fbe54f4e479d6d9d4522d70aeba057ffd0dd82398730da44ee57332a7bdea4862304d4799758ba@stranger",
  "v3": "v3_020b3826fd030100000000003a070e7757675c000000501ea9a3dba12f95f6b60a0536a1adb690dcccc9bf58cc80765e6eb16bffa5996420bb1b2577634516ff82090419d8bdcd5689df8dfb21d40af93d286f72c3a0e8cfa6dcb68afed39226f008c6@stranger",
  "option": 2
}
  */
  async addContacts (
    scene: 3 | 4 | 8 | 15,
    contact: {
      v3: string;
      v4: string;
    },
    content?: string) {
    const data = {
      appId: this.appId,
      scene,
      option: 2,
      v4: contact.v4,
      v3: contact.v3,
      content,
    }
    try {
      const response = await this.axios.post('/v2/api/contacts/addContacts', data)
      log.info('addContacts success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('addContacts failed:', error)
      log.error('addContacts failed:' + error)
      throw error
    }
  }

  // 同意添加好友
  async handleFriends (
    scene: number,
    contact: {
      v3: string;
      v4: string;
    },
    option: 3 | 4,
    content: string) {
    const data = {
      appId: this.appId,
      scene,
      option,
      v4: contact.v4,
      v3: contact.v3,
      content,
    }
    try {
      const response = await this.axios.post('/v2/api/contacts/addContacts', data)
      log.info('handleFriends success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('handleContacts failed:', error)
      log.error('handleContacts failed:' + error)
      throw error
    }
  }

  // 删除好友 /contacts/deleteFriend POST
  async deleteFriend (wxid: string) {
    const data = {
      appId: this.appId,
      wxid,
    }
    try {
      const response = await this.axios.post('/v2/api/contacts/deleteFriend', data)
      log.info('deleteFriend success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('failed:', error)
      log.error('failed:' + error)
      throw error
    }
  }

  // 上传手机通讯录 /contacts/uploadPhoneAddressList POST
  async uploadPhoneAddressList (phones: string[], opType: 1 | 2) {
    const data = {
      appId: this.appId,
      phones,
      opType,
    }
    try {
      const response = await this.axios.post('/v2/api/contacts/uploadPhoneAddressList', data)
      log.info('uploadPhoneAddressList success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('uploadPhoneAddressList failed:', error)
      log.error('uploadPhoneAddressList failed:' + error)
      throw error
    }
  }

  // 获取群/好友简要信息 /contacts/getBriefInfo
  async getBriefInfo (wxids: string[]) {
    const data = {
      appId: this.appId,
      wxids,
    }
    try {
      const response = await this.axios.post('/v2/api/contacts/getBriefInfo', data)
      log.info('getBriefInfo success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('getBriefInfo failed:', error)
      log.error('getBriefInfo failed:' + error)
      throw error
    }
  }

  // 获取群/好友详细信息 /contacts/getDetailInfo  POST
  async getDetailInfo (wxids: string[]) {
    const data = {
      appId: this.appId,
      wxids,
    }
    try {
      const response = await this.axios.post('/v2/api/contacts/getDetailInfo', data)
      log.info('getDetailInfo success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('failed:', error)
      log.error('failed:' + error)
      throw error
    }
  }

  // 设置好友仅聊天 /contacts/setFriendPermissions POST
  async setFriendPermissions (wxid: string, onlyChat: boolean) {
    const data = {
      appId: this.appId,
      wxid,
      onlyChat,
    }
    try {
      const response = await this.axios.post('/v2/api/contacts/setFriendPermissions', data)
      log.info('setFriendPermissions success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('setFriendPermissions failed:', error)
      log.error('setFriendPermissions failed:' + error)
      throw error
    }
  }

  // 设置好友备注 /contacts/setFriendRemark POST
  async setFriendRemark (wxid: string, remark: string) {
    const data = {
      appId: this.appId,
      wxid,
      remark,
    }
    try {
      const response = await this.axios.post('/v2/api/contacts/setFriendRemark', data)
      log.info('setFriendRemark success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('setFriendRemark failed:', error)
      log.error('setFriendRemark failed:' + error)
      throw error
    }
  }

  // 获取手机通讯录 /contacts/getPhoneAddressList POST
  async getPhoneAddressList (phones: string[]) {
    const data = {
      appId: this.appId,
      phones,
    }
    try {
      const response = await this.axios.post('/v2/api/contacts/getPhoneAddressList', data)
      log.info('getPhoneAddressList success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('getPhoneAddressList failed:', error)
      log.error('getPhoneAddressList failed:' + error)
      throw error
    }
  }

}
