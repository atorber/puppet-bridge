/* eslint-disable sort-keys */
import { log } from '../utils/logger.js'
import type { ModuleOptions, AxiosInstance } from '../types/types.js'

export class Account {

  private appId: string
  private axios: AxiosInstance
  public uuid: string = ''
  public isLoggedIn: boolean = false

  constructor (options: ModuleOptions) {
    this.appId = options.appId
    this.axios = options.axiosInstance
  }

  // /login/reconnection POST
  async reconnection () {
    const data = {
      appId: this.appId,
    }
    try {
      const response = await this.axios.post('/v2/api/login/reconnection', data)
      // console.info('reconnection success:', response.data)
      log.info('reconnection success:', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      // console.error('reconnection failed:', error)
      log.error('reconnection failed:' + error)
      throw error
    }
  }

  // /login/logout POST
  async logout () {
    const data = {
      appId: this.appId,
    }
    try {
      const response = await this.axios.post('/v2/api/login/logout', data)
      log.info('logout success:', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      log.error('logout failed:', error)
      throw error
    }
  }

  // /login/checkOnline POST
  async checkOnline () {
    const data = {
      appId: this.appId,
    }
    try {
      const response = await this.axios.post('/v2/api/login/checkOnline', data)
      // console.info('checkOnline success:', response.data)
      log.info('checkOnline success:', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      // console.error('checkOnline failed:', error)
      log.error('checkOnline failed:' + error)
      throw error
    }
  }

}
