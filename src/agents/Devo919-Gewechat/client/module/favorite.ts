/* eslint-disable sort-keys */
import { log } from '../utils/logger.js'
import type { ModuleOptions, AxiosInstance } from '../types/types.js'

export class Favorite {

  private appId: string
  private axios: AxiosInstance
  public uuid: string = ''
  public isLoggedIn: boolean = false

  constructor (options: ModuleOptions) {
    this.appId = options.appId
    this.axios = options.axiosInstance
  }

  // /favor/sync POST
  async favorSync (syncKey: string) {
    const data = {
      appId: this.appId,
      syncKey,
    }
    try {
      const response = await this.axios.post('/v2/api/favor/sync', data)
      // console.info('sync success:', response.data)
      log.info('sync success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('sync failed:', error)
      log.error('sync failed:' + error)
      throw error
    }
  }

  // /favor/getContent POST
  async getContent (favId: string) {
    const data = {
      appId: this.appId,
      favId,
    }
    try {
      const response = await this.axios.post('/v2/api/favor/getContent', data)
      // console.info('getContent success:', response.data)
      log.info('getContent success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('getContent failed:', error)
      log.error('getContent failed:' + error)
      throw error
    }
  }

  // /favor/delete POST
  async delete (favId: string) {
    const data = {
      appId: this.appId,
      favId,
    }
    try {
      const response = await this.axios.post('/v2/api/favor/delete', data)
      // console.info('delete success:', response.data)
      log.info('delete success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('delete failed:', error)
      log.error('delete failed:' + error)
      throw error
    }
  }

}
