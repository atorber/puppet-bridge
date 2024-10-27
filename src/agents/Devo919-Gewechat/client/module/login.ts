/* eslint-disable sort-keys */
import qrcode from 'qrcode-terminal'
import { logger } from '../utils/logger.js'
import type { ModuleOptions, AxiosInstance, LoginInfo } from '../types/types.js'

export class Login {

  private appId: string
  private axios: AxiosInstance
  public uuid: string = ''
  public isLogin: boolean = false
  public loginInfo?: LoginInfo

  constructor (options: ModuleOptions) {
    this.appId = options.appId
    this.axios = options.axiosInstance
  }

  async getLoginQrCode () {
    const data = { appId: this.appId }
    try {
      const response = await this.axios.post('/v2/api/login/getLoginQrCode', data)
      logger.info('getLoginQrCode success:' + JSON.stringify(response.data))
      if (response.data.ret === 200) {
        const qrData = response.data.data.qrData
        logger.info('QR Code Base64:' + qrData)
        qrcode.generate(qrData, { small: true })
        this.appId = response.data.data.appId
        this.uuid = response.data.data.uuid
        await this.checkLoginInterval(this.uuid)
      }
      return response.data
    } catch (error) {
      logger.error('getLoginQrCode failed:' + error)
      throw error
    }
  }

  private checkLoginInterval (uuid: string) {
    setInterval(() => {
      if (!this.isLogin) {
        this.checkLogin(uuid).then((res) => {
          return res
        }).catch((error) => {
          logger.error('checkLogin failed:' + error)
          throw error
        })
      } else {
        logger.info('checkLoginInterval isLogin:', this.isLogin)
      }
    }, 5000)
  }

  async checkLogin (uuid: string) {
    try {
      const data = { appId: this.appId, uuid }
      logger.info('checkLogin data:', JSON.stringify(data))
      const response = await this.axios.post('/v2/api/login/checkLogin', data)
      logger.info('checkLogin success:', JSON.stringify(response.data))
      if (
        response.data.ret === 200
          && response.data.data.loginInfo !== null
          && response.data.data.loginInfo.wxid
      ) {
        this.loginInfo = response.data.data.loginInfo
      } else if (
        response.data.ret === 500
        && response.data.msg === '已登录成功，请勿重复操作'
      ) {
        this.isLogin = true
      }
      return response.data
    } catch (error) {
      logger.error('checkLogin failed:' + error)
      throw error
    }
  }

  getLoginInfo () {
    return this.loginInfo
  }

  // Add other login-related methods here

}
