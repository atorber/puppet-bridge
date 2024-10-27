/* eslint-disable sort-keys */
import { log } from '../utils/logger.js'
import type { ModuleOptions, AxiosInstance } from '../types/types.js'

export class Lable {

  private appId: string
  private axios: AxiosInstance
  public uuid: string = ''
  public isLoggedIn: boolean = false

  constructor (options: ModuleOptions) {
    this.appId = options.appId
    this.axios = options.axiosInstance
  }

  // /label/add POST
  async addLabel (labelName: string) {
    const data = {
      appId: this.appId,
      labelName,
    }
    try {
      const response = await this.axios.post('/v2/api/label/add', data)
      // console.info('add success:', response.data)
      log.info('add success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('add failed:', error)
      log.error('add failed:' + error)
      throw error
    }
  }

  // /label/delete POST
  async deleteLabel (labelIds: string[]) {
    const data = {
      appId: this.appId,
      labelIds: labelIds.join(','),
    }
    try {
      const response = await this.axios.post('/v2/api/label/delete', data)
      // console.info('delete success:', response.data)
      log.info('delete success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('delete failed:', error)
      log.error('delete failed:' + error)
      throw error
    }
  }

  // /label/list POST
  async listLabel () {
    const data = {
      appId: this.appId,
    }
    try {
      const response = await this.axios.post('/v2/api/label/list', data)
      // console.info('list success:', response.data)
      log.info('list success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('list failed:', error)
      log.error('list failed:' + error)
      throw error
    }
  }

  // /label/modifyMemberList POST
  async modifyMemberList (labelIds: string[], wxids: string[]) {
    const data = {
      appId: this.appId,
      labelIds: labelIds.join(','),
      wxids: wxids.join(','),
    }
    try {
      const response = await this.axios.post('/v2/api/label/modifyMemberList', data)
      // console.info('modifyMemberList success:', response.data)
      log.info('modifyMemberList success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('modifyMemberList failed:', error)
      log.error('modifyMemberList failed:' + error)
      throw error
    }
  }

}
