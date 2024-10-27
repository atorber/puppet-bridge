import type { AxiosInstance } from 'axios'

export interface Options {
  token?:string
  appId?:string
  host: string
  callbackHost?: string
}

export interface LoginInfo {
  uin: string
  wxid: string
  nickName: string
  mobile: string
  alias: string|null
}

export interface ModuleOptions {
  appId: string;
  axiosInstance: AxiosInstance;
}

export type {
  AxiosInstance,
}
