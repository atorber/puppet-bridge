/* eslint-disable sort-keys */
import { log } from '../utils/logger.js'
import type { ModuleOptions, AxiosInstance } from '../types/types.js'

export class Self {

  private appId: string
  private axios: AxiosInstance
  public uuid: string = ''
  public isLoggedIn: boolean = false

  constructor (options: ModuleOptions) {
    this.appId = options.appId
    this.axios = options.axiosInstance
  }

  // /personal/getProfile POST
  async getProfile () {
    const data = {
      appId: this.appId,
    }
    try {
      const response = await this.axios.post('/v2/api/personal/getProfile', data)
      // console.info('getProfile success:', response.data)
      log.info('getProfile success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('getProfile failed:', error)
      log.error('getProfile failed:' + error)
      throw error
    }
  }

  // /personal/getQrCode POST
  async getQrCode () {
    const data = {
      appId: this.appId,
    }
    try {
      const response = await this.axios.post('/v2/api/personal/getQrCode', data)
      // console.info('getQrCode success:', response.data)
      log.info('getQrCode success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('getQrCode failed:', error)
      log.error('getQrCode failed:' + error)
      throw error
    }
  }

  // /personal/getSafetyInfo POST
  async getSafetyInfo () {
    const data = {
      appId: this.appId,
    }
    try {
      const response = await this.axios.post('/v2/api/personal/getSafetyInfo', data)
      // console.info('getSafetyInfo success:', response.data)
      log.info('getSafetyInfo success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('getSafetyInfo failed:', error)
      log.error('getSafetyInfo failed:' + error)
      throw error
    }
  }

  // /personal/privacySettings POST
  async privacySettings (option: 4 | 7 | 8 | 25 | 38 | 39 | 40, open: boolean) {
    const data = {
      appId: this.appId,
      option,
      open,
    }
    try {
      const response = await this.axios.post('/v2/api/personal/privacySettings', data)
      // console.info('privacySettings success:', response.data)
      log.info('privacySettings success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('privacySettings failed:', error)
      log.error('privacySettings failed:' + error)
      throw error
    }
  }

  // /personal/updateProfile POST
  /*
appId
string
设备ID
必需
city
string
城市
可选
country
string
国家
必需
nickName
string
昵称
必需
province
string
省份
必需
sex
string
必需
性别 1:男 2:女

signature
string
签名
必需
  */
  async updateProfile (city: string, country: string, nickName: string, province: string, sex: 1 | 2, signature: string) {
    const data = {
      appId: this.appId,
      city,
      country,
      nickName,
      province,
      sex,
      signature,
    }
    try {
      const response = await this.axios.post('/v2/api/personal/updateProfile', data)
      // console.info('updateProfile success:', response.data)
      log.info('updateProfile success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('updateProfile failed:', error)
      log.error('updateProfile failed:' + error)
      throw error
    }
  }

  // /personal/updateHeadImg POST
  async updateHeadImg (headImgUrl: string) {
    const data = {
      appId: this.appId,
      headImgUrl,
    }
    try {
      const response = await this.axios.post('/v2/api/personal/updateHeadImg', data)
      // console.info('updateHeadImg success:', response.data)
      log.info('updateHeadImg success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('updateHeadImg failed:', error)
      log.error('updateHeadImg failed:' + error)
      throw error
    }
  }

}
