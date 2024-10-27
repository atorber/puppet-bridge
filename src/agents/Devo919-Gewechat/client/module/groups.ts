/* eslint-disable sort-keys */
import { log } from '../utils/logger.js'
import type { ModuleOptions, AxiosInstance } from '../types/types.js'

export class Groups {

  private appId: string
  private axios: AxiosInstance

  constructor (options: ModuleOptions) {
    this.appId = options.appId
    this.axios = options.axiosInstance
  }

  // 创建微信群 /group/createChatroom POST
  async createChatroom (wxids: string[]) {
    const data = {
      appId: this.appId,
      wxids,
    }
    try {
      const response = await this.axios.post('/v2/api/group/createChatroom', data)
      log.info('createChatroom success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('createChatroom failed:', error)
      log.error('createChatroom failed:' + error)
      throw error
    }
  }

  // /group/modifyChatroomName POST
  async modifyChatroomName (chatroomId: string, chatroomName: string) {
    const data = {
      appId: this.appId,
      chatroomName,
      chatroomId,
    }
    try {
      const response = await this.axios.post('/v2/api/group/modifyChatroomName', data)
      log.info('modifyChatroomName success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('modifyChatroomName failed:', error)
      log.error('modifyChatroomName failed:' + error)
      throw error
    }
  }

  // /group/modifyChatroomRemark POST
  async modifyChatroomRemark (chatroomId: string, chatroomRemark: string) {
    const data = {
      appId: this.appId,
      chatroomId,
      chatroomRemark,
    }
    try {
      const response = await this.axios.post('/v2/api/group/modifyChatroomRemark', data)
      log.info('modifyChatroomRemark success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('modifyChatroomRemark failed:', error)
      log.error('modifyChatroomRemark failed:' + error)
      throw error
    }
  }

  // /group/modifyChatroomNickNameForSelf POST
  async modifyChatroomNickNameForSelf (chatroomId: string, nickName: string) {
    const data = {
      appId: this.appId,
      chatroomId,
      nickName,
    }
    try {
      const response = await this.axios.post('/v2/api/group/modifyChatroomNickNameForSelf', data)
      log.info('modifyChatroomNickNameForSelf success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('modifyChatroomNickNameForSelf failed:', error)
      log.error('modifyChatroomNickNameForSelf failed:' + error)
      throw error
    }
  }

  // /group/inviteMember POST
  async inviteMember (chatroomId: string, wxids: string[], reason: string) {
    const data = {
      appId: this.appId,
      chatroomId,
      wxids: wxids.join(','),
      reason,
    }
    try {
      const response = await this.axios.post('/v2/api/group/inviteMember', data)
      log.info('inviteMember success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('inviteMember failed:', error)
      log.error('inviteMember failed:' + error)
      throw error
    }
  }

  // /group/removeMember POST
  async removeMember (chatroomId: string, wxids: string[]) {
    const data = {
      appId: this.appId,
      chatroomId,
      wxids: wxids.join(','),
    }
    try {
      const response = await this.axios.post('/v2/api/group/removeMember', data)
      log.info('removeMember success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('removeMember failed:', error)
      log.error('removeMember failed:' + error)
      throw error
    }
  }

  // /group/quitChatroom POST
  async quitChatroom (chatroomId: string) {
    const data = {
      appId: this.appId,
      chatroomId,
    }
    try {
      const response = await this.axios.post('/v2/api/group/quitChatroom', data)
      log.info('quitChatroom success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('quitChatroom failed:', error)
      log.error('quitChatroom failed:' + error)
      throw error
    }
  }

  // /group/disbandChatroom POST
  async disbandChatroom (chatroomId: string) {
    const data = {
      appId: this.appId,
      chatroomId,
    }
    try {
      const response = await this.axios.post('/v2/api/group/disbandChatroom', data)
      log.info('disbandChatroom success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('disbandChatroom failed:', error)
      log.error('disbandChatroom failed:' + error)
      throw error
    }
  }

  // /group/getChatroomInfo POST
  async getChatroomInfo (chatroomId: string) {
    const data = {
      appId: this.appId,
      chatroomId,
    }
    try {
      const response = await this.axios.post('/v2/api/group/getChatroomInfo', data)
      log.info('getChatroomInfo success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('getChatroomInfo failed:', error)
      log.error('getChatroomInfo failed:' + error)
      throw error
    }
  }

  // /group/getChatroomMemberList POST
  async getChatroomMemberList (chatroomId: string) {
    const data = {
      appId: this.appId,
      chatroomId,
    }
    try {
      const response = await this.axios.post('/v2/api/group/getChatroomMemberList', data)
      log.info('getChatroomMemberList success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('getChatroomMemberList failed:', error)
      log.error('getChatroomMemberList failed:' + error)
      throw error
    }
  }

  // /group/getChatroomMemberDetail POST
  async getChatroomMemberDetail (chatroomId: string, memberWxids: string[]) {
    const data = {
      appId: this.appId,
      chatroomId,
      memberWxids,
    }
    try {
      const response = await this.axios.post('/v2/api/group/getChatroomMemberDetail', data)
      log.info('getChatroomMemberDetail success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('getChatroomMemberDetail failed:', error)
      log.error('getChatroomMemberDetail failed:' + error)
      throw error
    }
  }

  // /group/getChatroomAnnouncement POST
  async getChatroomAnnouncement (chatroomId: string) {
    const data = {
      appId: this.appId,
      chatroomId,
    }
    try {
      const response = await this.axios.post('/v2/api/group/getChatroomAnnouncement', data)
      log.info('getChatroomAnnouncement success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('getChatroomAnnouncement failed:', error)
      log.error('getChatroomAnnouncement failed:' + error)
      throw error
    }
  }

  // /group/setChatroomAnnouncement POST
  async setChatroomAnnouncement (chatroomId: string, content: string) {
    const data = {
      appId: this.appId,
      chatroomId,
      content,
    }
    try {
      const response = await this.axios.post('/v2/api/group/setChatroomAnnouncement', data)
      log.info('setChatroomAnnouncement success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('setChatroomAnnouncement failed:', error)
      log.error('setChatroomAnnouncement failed:' + error)
      throw error
    }
  }

  // /group/agreeJoinRoom POST
  async agreeJoinRoom (url: string) {
    const data = {
      appId: this.appId,
      url,
    }
    try {
      const response = await this.axios.post('/v2/api/group/agreeJoinRoom', data)
      log.info('agreeJoinRoom success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('agreeJoinRoom failed:', error)
      log.error('agreeJoinRoom failed:' + error)
      throw error
    }
  }

  // /group/addGroupMemberAsFriend POST
  async addGroupMemberAsFriend (chatroomId: string, memberWxid: string, content: string) {
    const data = {
      appId: this.appId,
      chatroomId,
      memberWxid,
      content,
    }
    try {
      const response = await this.axios.post('/v2/api/group/addGroupMemberAsFriend', data)
      log.info('addGroupMemberAsFriend success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('addGroupMemberAsFriend failed:', error)
      log.error('addGroupMemberAsFriend failed:' + error)
      throw error
    }
  }

  // /group/getChatroomQrCode POST
  async getChatroomQrCode (chatroomId: string) {
    const data = {
      appId: this.appId,
      chatroomId,
    }
    try {
      const response = await this.axios.post('/v2/api/group/getChatroomQrCode', data)
      log.info('getChatroomQrCode success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('getChatroomQrCode failed:', error)
      log.error('getChatroomQrCode failed:' + error)
      throw error
    }
  }

  // /group/saveContractList POST
  async saveContractList (chatroomId: string, operType: 3 | 2) {
    const data = {
      appId: this.appId,
      chatroomId,
      operType,
    }
    try {
      const response = await this.axios.post('/v2/api/group/saveContractList', data)
      // console.info('saveContractList success:', response.data)
      log.info('saveContractList success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('saveContractList failed:', error)
      log.error('saveContractList failed:' + error)
      throw error
    }
  }

  // /group/adminOperate POST
  /*
appId
string
设备ID
必需
chatroomId
string
群ID
必需
operType
integer
必需
操作类型 1：添加群管理（可添加多个微信号） 2：删除群管理（可删除多个） 3：转让（只能转让一个微信号）

wxids
array[string]
必需
  */
  async adminOperate (chatroomId: string, operType: 1 | 2 | 3, wxids: string[]) {
    const data = {
      appId: this.appId,
      chatroomId,
      operType,
      wxids,
    }
    try {
      const response = await this.axios.post('/v2/api/group/adminOperate', data)
      // console.info('adminOperate success:', response.data)
      log.info('adminOperate success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('adminOperate failed:', error)
      log.error('adminOperate failed:' + error)
      throw error
    }
  }

  // /group/pinChat POST
  /*
appId
string
设备ID
必需
chatroomId
string
群ID
必需
top
boolean
是否置顶
必需
  */
  async pinChat (chatroomId: string, top: boolean) {
    const data = {
      appId: this.appId,
      chatroomId,
      top,
    }
    try {
      const response = await this.axios.post('/v2/api/group/pinChat', data)
      // console.info('pinChat success:', response.data)
      log.info('pinChat success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('pinChat failed:', error)
      log.error('pinChat failed:' + error)
      throw error
    }
  }

  // /group/joinRoomUsingQRCode POST
  /*
  appId
string
设备ID
必需
qrUrl
string
二维码的链接
必需
  */
  async joinRoomUsingQRCode (qrUrl: string) {
    const data = {
      appId: this.appId,
      qrUrl,
    }
    try {
      const response = await this.axios.post('/v2/api/group/joinRoomUsingQRCode', data)
      // console.info('joinRoomUsingQRCode success:', response.data)
      log.info('joinRoomUsingQRCode success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('joinRoomUsingQRCode failed:', error)
      log.error('joinRoomUsingQRCode failed:' + error)
      throw error
    }
  }

  // /group/roomAccessApplyCheckApprove
  /*
  appId
string
设备ID
必需
chatroomId
string
群ID
必需
newMsgId
string
消息ID
必需
msgContent
string
消息内容
必需
  */
  async roomAccessApplyCheckApprove (chatroomId: string, newMsgId: string, msgContent: string) {
    const data = {
      appId: this.appId,
      chatroomId,
      newMsgId,
      msgContent,
    }
    try {
      const response = await this.axios.post('/v2/api/group/roomAccessApplyCheckApprove', data)
      // console.info('roomAccessApplyCheckApprove success:', response.data)
      log.info('roomAccessApplyCheckApprove success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('roomAccessApplyCheckApprove failed:', error)
      log.error('roomAccessApplyCheckApprove failed:' + error)
      throw error
    }
  }

}
