import type { AxiosInstance } from 'axios'

export interface Options {
  token?:string
  appId?:string
  host: string
  apiPort: string,
  downloadPort: string,
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

// {
//   "userName": "wxid_phyyedw9xap22",
//   "nickName": "Ashley",
//   "pyInitial": "ASHLEY",
//   "quanPin": "Ashley",
//   "sex": 2,
//   "remark": "",
//   "remarkPyInitial": "",
//   "remarkQuanPin": "",
//   "signature": null,
//   "alias": "zero-one_200906",
//   "snsBgImg": null,
//   "country": "AD",
//   "bigHeadImgUrl": "https://wx.qlogo.cn/mmhead/ver_1/buiaXybHTBK3BuGr1edN72zBDermWVFJ7YC8Jib2RcCSdiauAtZcPgUQpdhE9KY5NsumDAWD16fsg3A6OKuhdEr97VAHdTGgk6R1Eibuj7ZNwJ4/0",
//   "smallHeadImgUrl": "https://wx.qlogo.cn/mmhead/ver_1/buiaXybHTBK3BuGr1edN72zBDermWVFJ7YC8Jib2RcCSdiauAtZcPgUQpdhE9KY5NsumDAWD16fsg3A6OKuhdEr97VAHdTGgk6R1Eibuj7ZNwJ4/132",
//   "description": null,
//   "cardImgUrl": null,
//   "labelList": "",
//   "province": "",
//   "city": "",
//   "phoneNumList": null
// }

export interface Friend {
  userName: string
  nickName: string
  pyInitial: string
  quanPin: string
  sex: 1 | 2
  remark: string
  remarkPyInitial: string
  remarkQuanPin: string
  signature: string
  alias: string
  snsBgImg: string
  country: string
  bigHeadImgUrl: string
  smallHeadImgUrl: string
  description: string
  cardImgUrl: string
  labelList: string
  province: string
  city: string
  phoneNumList: null|string[]
}

export type {
  AxiosInstance,
}
