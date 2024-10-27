/* eslint-disable sort-keys */
import { log } from '../utils/logger.js'
import type { ModuleOptions, AxiosInstance } from '../types/types.js'

export class Message {

  private appId: string
  private axios: AxiosInstance
  public uuid: string = ''
  public isLoggedIn: boolean = false

  constructor (options: ModuleOptions) {
    this.appId = options.appId
    this.axios = options.axiosInstance
  }

  // /message/downloadImage POST
  /*
appId string 设备ID 必需
xml string 回调消息中的XML 必需
type integer 必需 下载的图片类型 1:高清图片 2:常规图片 3:缩略图 默认值: 2
  */
  async downloadImage (xml: string, type: 1 | 2 | 3) {
    const data = {
      appId: this.appId,
      xml,
      type,
    }
    try {
      const response = await this.axios.post('/v2/api/message/downloadImage', data)
      log.info('downloadImage success:', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      log.error('downloadImage failed:', error)
      throw error
    }
  }

  // /message/postText POST
  /*
appId string 设备ID 必需
toWxid string 好友/群的ID 必需
content string 消息内容 必需
ats string 可选 @的好友，多个英文逗号分隔。群主或管理员@全部的人，则填写'notify@all'
  */
  async postText (toWxid: string, content: string, ats?: string) {
    const data = {
      appId: this.appId,
      toWxid,
      content,
      ats,
    }
    try {
      const response = await this.axios.post('/v2/api/message/postText', data)
      // console.info('postText success:', response.data)
      log.info('postText success:', JSON.stringify(response.data))
      return response.data
    } catch (error) {
      // console.error('postText failed:', error)
      log.error('postText failed:' + error)
      throw error
    }
  }

  // /message/postFile POST
  /*
  appId string 设备ID 必需
toWxid string 好友/群的ID 必需
fileUrl string 文件链接 必需
fileName string 文件名 必需
*/
  async postFile (toWxid: string, fileUrl: string, fileName: string) {
    const data = {
      appId: this.appId,
      toWxid,
      fileUrl,
      fileName,
    }
    try {
      const response = await this.axios.post('/v2/api/message/postFile', data)
      // console.info('postFile success:', response.data)
      log.info('postFile success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('postFile failed:', error)
      log.error('postFile failed:' + error)
      throw error
    }
  }

  // /message/postImage POST
  /*
  {
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "imgUrl": "http://dummyimage.com/400x400"
}
  */
  async postImage (toWxid: string, imgUrl: string) {
    const data = {
      appId: this.appId,
      toWxid,
      imgUrl,
    }
    try {
      const response = await this.axios.post('/v2/api/message/postImage', data)
      // console.info('postImage success:', response.data)
      log.info('postImage success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('postImage failed:', error)
      log.error('postImage failed:' + error)
      throw error
    }
  }

  // /message/postVoice POST
  /*
  {
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "voiceUrl": ""
    "voiceDuration": 2000
}
*/
  async postVoice (toWxid: string, voiceUrl: string, voiceDuration: number) {
    const data = {
      appId: this.appId,
      toWxid,
      voiceUrl,
      voiceDuration,
    }
    try {
      const response = await this.axios.post('/v2/api/message/postVoice', data)
      // console.info('postVoice success:', response.data)
      log.info('postVoice success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('postVoice failed:', error)
      log.error('postVoice failed:' + error)
      throw error
    }
  }

  // /message/postVideo POST
  /*
{
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "videoUrl": ""
    "thumbUrl": ""
    "videoDuration": 10
}
*/
  async postVideo (toWxid: string, videoUrl: string, thumbUrl: string, videoDuration: number) {
    const data = {
      appId: this.appId,
      toWxid,
      videoUrl,
      thumbUrl,
      videoDuration,
    }
    try {
      const response = await this.axios.post('/v2/api/message/postVideo', data)
      // console.info('postVideo success:', response.data)
      log.info('postVideo success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('postVideo failed:', error)
      log.error('postVideo failed:' + error)
      throw error
    }
  }

  // /message/postLink POST
  /*
  {
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "title": "澳门这一夜",
    "desc": "39岁郭碧婷用珠圆玉润的身材，狠狠打脸了白幼瘦女星",
    "linkUrl": "https://mbd.baidu.com/newspage/data/landingsuper?context=%7B%22nid%22%3A%22news_8864265500294006781%22%7D&n_type=-1&p_from=-1",
    "thumbUrl": "https://pics3.baidu.com/feed/0824ab18972bd407a9403f336648d15c0db30943.jpeg@f_auto?token=d26f7f142871542956aaa13799ba1946"
}
  */
  async postLink (toWxid: string, title: string, desc: string, linkUrl: string, thumbUrl: string) {
    const data = {
      appId: this.appId,
      toWxid,
      title,
      desc,
      linkUrl,
      thumbUrl,
    }
    try {
      const response = await this.axios.post('/v2/api/message/postLink', data)
      // console.info('postLink success:', response.data)
      log.info('postLink success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('postLink failed:', error)
      log.error('postLink failed:' + error)
      throw error
    }
  }

  // /message/postNameCard POST
  /*
{
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "nickName": "谭艳",
    "nameCardWxid": "wxid_0xsqb3o0tsvz22"
}
*/
  async postNameCard (toWxid: string, nickName: string, nameCardWxid: string) {
    const data = {
      appId: this.appId,
      toWxid,
      nickName,
      nameCardWxid,
    }
    try {
      const response = await this.axios.post('/v2/api/message/postNameCard', data)
      // console.info('postNameCard success:', response.data)
      log.info('postNameCard success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('postNameCard failed:', error)
      log.error('postNameCard failed:' + error)
      throw error
    }
  }

  // /message/postEmoji POST
  /*
  {
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "emojiMd5": "4cc7540a85b5b6cf4ba14e9f4ae08b7c",
    "emojiSize": 102357
}
  */
  async postEmoji (toWxid: string, emojiMd5: string, emojiSize: number) {
    const data = {
      appId: this.appId,
      toWxid,
      emojiMd5,
      emojiSize,
    }
    try {
      const response = await this.axios.post('/v2/api/message/postEmoji', data)
      // console.info('postEmoji success:', response.data)
      log.info('postEmoji success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('postEmoji failed:', error)
      log.error('postEmoji failed:' + error)
      throw error
    }
  }

  // /message/postAppMsg POST
  /*
{
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "appmsg": "<appmsg appid=\"\" sdkver=\"0\">\n\t\t<title>一审宣判！蔡鄂生被判死缓</title>\n\t\t<des />\n\t\t<action />\n\t\t<type>5</type>\n\t\t<showtype>0</showtype>\n\t\t<soundtype>0</soundtype>\n\t\t<mediatagname />\n\t\t<messageext />\n\t\t<messageaction />\n\t\t<content />\n\t\t<contentattr>0</contentattr>\n\t\t<url>http://mp.weixin.qq.com/s?__biz=MjM5MjAxNDM4MA==&amp;mid=2666774093&amp;idx=1&amp;sn=aa405094dd00034d004f6e8287f86e9b&amp;chksm=bcc9d903635a9c284591edda1f027c467245d922d7d66c32d3cd2c6af1c969a7ea0896aa7639&amp;scene=0&amp;xtrack=1#rd</url>\n\t\t<lowurl />\n\t\t<dataurl />\n\t\t<lowdataurl />\n\t\t<appattach>\n\t\t\t<totallen>0</totallen>\n\t\t\t<attachid />\n\t\t\t<emoticonmd5 />\n\t\t\t<fileext />\n\t\t\t<cdnthumburl>3057020100044b304902010002048399cc8402032f57ed02041388e6720204658e922d042462666538346165322d303035382d343262322d616538322d3337306231346630323534360204051408030201000405004c53d900</cdnthumburl>\n\t\t\t<cdnthumbmd5>ea3d5e8d4059cb4db0a3c39c789f2d6f</cdnthumbmd5>\n\t\t\t<cdnthumblength>93065</cdnthumblength>\n\t\t\t<cdnthumbwidth>1080</cdnthumbwidth>\n\t\t\t<cdnthumbheight>459</cdnthumbheight>\n\t\t\t<cdnthumbaeskey>849df42ab37c8cadb324fe94ba46d76e</cdnthumbaeskey>\n\t\t\t<aeskey>849df42ab37c8cadb324fe94ba46d76e</aeskey>\n\t\t\t<encryver>0</encryver>\n\t\t</appattach>\n\t\t<extinfo />\n\t\t<sourceusername>gh_363b924965e9</sourceusername>\n\t\t<sourcedisplayname>人民日报</sourcedisplayname>\n\t\t<thumburl>https://mmbiz.qpic.cn/sz_mmbiz_jpg/xrFYciaHL08DCJtwQefqrH8JcohbOHhTpyCPab8IgDibkTv3Pspicjw8TRHnoic2tmiafBtUHg7ObZznpWocwkCib6Tw/640?wxtype=jpeg&amp;wxfrom=0</thumburl>\n\t\t<md5 />\n\t\t<statextstr />\n\t\t<mmreadershare>\n\t\t\t<itemshowtype>0</itemshowtype>\n\t\t</mmreadershare>\n\t</appmsg>"
}
  */
  async postAppMsg (toWxid: string, appmsg: string) {
    const data = {
      appId: this.appId,
      toWxid,
      appmsg,
    }
    try {
      const response = await this.axios.post('/v2/api/message/postAppMsg', data)
      // console.info('postAppMsg success:', response.data)
      log.info('postAppMsg success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('postAppMsg failed:', error)
      log.error('postAppMsg failed:' + error)
      throw error
    }
  }

  // /message/postMiniApp POST
  /*
  {
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "miniAppId": "wx1f9ea355b47256dd",
    "userName": "gh_690acf47ea05@app",
    "title": "最快29分钟 好吃水果送到家",
    "coverImgUrl": "https://che-static.vzhimeng.com/img/2023/10/30/67d55942-e43c-4fdb-8396-506794ddbdbc.jpg",
    "pagePath": "pages/homeDelivery/index.html",
    "displayName": "百果园+"
}
  */
  async postMiniApp (toWxid: string, miniAppId: string, userName: string, title: string, coverImgUrl: string, pagePath: string, displayName: string) {
    const data = {
      appId: this.appId,
      toWxid,
      miniAppId,
      userName,
      title,
      coverImgUrl,
      pagePath,
      displayName,
    }
    try {
      const response = await this.axios.post('/v2/api/message/postMiniApp', data)
      // console.info('postMiniApp success:', response.data)
      log.info('postMiniApp success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('postMiniApp failed:', error)
      log.error('postMiniApp failed:' + error)
      throw error
    }
  }

  // /message/forwardFile POST
  /*
{
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "xml": "<?xml version=\"1.0\"?>\n<msg>\n\t<appmsg appid=\"\" sdkver=\"0\">\n\t\t<title>info.json</title>\n\t\t<des />\n\t\t<action />\n\t\t<type>6</type>\n\t\t<showtype>0</showtype>\n\t\t<soundtype>0</soundtype>\n\t\t<mediatagname />\n\t\t<messageext />\n\t\t<messageaction />\n\t\t<content />\n\t\t<contentattr>0</contentattr>\n\t\t<url />\n\t\t<lowurl />\n\t\t<dataurl />\n\t\t<lowdataurl />\n\t\t<appattach>\n\t\t\t<totallen>63</totallen>\n\t\t\t<attachid>@cdn_3057020100044b304902010002043904752002032f7d6d02046bb5bade02046593760c042433653765306131612d646138622d346662322d383239362d3964343665623766323061370204051400050201000405004c53d900_f46be643aa0dc009ae5fb63bbc73335d_1</attachid>\n\t\t\t<emoticonmd5 />\n\t\t\t<fileext>json</fileext>\n\t\t\t<cdnattachurl>3057020100044b304902010002043904752002032f7d6d02046bb5bade02046593760c042433653765306131612d646138622d346662322d383239362d3964343665623766323061370204051400050201000405004c53d900</cdnattachurl>\n\t\t\t<aeskey>f46be643aa0dc009ae5fb63bbc73335d</aeskey>\n\t\t\t<encryver>0</encryver>\n\t\t\t<overwrite_newmsgid>594239960546299206</overwrite_newmsgid>\n\t\t\t<fileuploadtoken>v1_0bgfyCkUmoZYYyvXys0cCiJdd2R/pKPdD2TNi9IY6FOt+Tvlhp3ijUoupZHzyB2Lp7xYgdVFaUGL4iu3Pm9/YACCt20egPGpT+DKe+VymOzD7tJfsS8YW7JObTbN8eVoFEetU5HSRWTgS/48VVsPZMoDF6Gz1XJDLN/dWRxvzrbOzVGGNvmY4lpXb0kRwXkSxwL+dO4=</fileuploadtoken>\n\t\t</appattach>\n\t\t<extinfo />\n\t\t<sourceusername />\n\t\t<sourcedisplayname />\n\t\t<thumburl />\n\t\t<md5>d16070253eee7173e467dd7237d76f60</md5>\n\t\t<statextstr />\n\t</appmsg>\n\t<fromusername>zhangchuan2288</fromusername>\n\t<scene>0</scene>\n\t<appinfo>\n\t\t<version>1</version>\n\t\t<appname></appname>\n\t</appinfo>\n\t<commenturl></commenturl>\n</msg>"
}
  */
  async forwardFile (toWxid: string, xml: string) {
    const data = {
      appId: this.appId,
      toWxid,
      xml,
    }
    try {
      const response = await this.axios.post('/v2/api/message/forwardFile', data)
      // console.info('forwardFile success:', response.data)
      log.info('forwardFile success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('forwardFile failed:', error)
      log.error('forwardFile failed:' + error)
      throw error
    }
  }

  // /message/forwardImage POST
  /*
  {
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "xml": "<?xml version=\"1.0\"?>\n<msg>\n\t<img aeskey=\"294774c8ac2ca8f8114e4d58d2ba78a5\" encryver=\"1\" cdnthumbaeskey=\"294774c8ac2ca8f8114e4d58d2ba78a5\" cdnthumburl=\"3057020100044b304902010002043904752002032f7d6d02046bb5bade020465937656042436626431373937632d613430642d346137662d626230352d3832613335353935333130630204051818020201000405004c543d00\" cdnthumblength=\"2253\" cdnthumbheight=\"120\" cdnthumbwidth=\"111\" cdnmidheight=\"0\" cdnmidwidth=\"0\" cdnhdheight=\"0\" cdnhdwidth=\"0\" cdnmidimgurl=\"3057020100044b304902010002043904752002032f7d6d02046bb5bade020465937656042436626431373937632d613430642d346137662d626230352d3832613335353935333130630204051818020201000405004c543d00\" length=\"4061\" md5=\"799ee4beed51720525232aef6a0d2ec4\" />\n\t<platform_signature></platform_signature>\n\t<imgdatahash></imgdatahash>\n</msg>"
}
  */
  async forwardImage (toWxid: string, xml: string) {
    const data = {
      appId: this.appId,
      toWxid,
      xml,
    }
    try {
      const response = await this.axios.post('/v2/api/message/forwardImage', data)
      // console.info('forwardImage success:', response.data)
      log.info('forwardImage success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('forwardImage failed:', error)
      log.error('forwardImage failed:' + error)
      throw error
    }
  }

  // /message/forwardVideo POST
  /*
  {
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "xml": "<?xml version=\"1.0\"?>\n<msg>\n\t<videomsg aeskey=\"5c5163d06757faae44eacc2146ba0575\" cdnvideourl=\"3057020100044b304902010002043904752002032f7d6d02046bb5bade0204659376a6042465623261663836382d336363332d346131332d383037642d3464626162316638303634360204051800040201000405004c56f900\" cdnthumbaeskey=\"5c5163d06757faae44eacc2146ba0575\" cdnthumburl=\"3057020100044b304902010002043904752002032f7d6d02046bb5bade0204659376a6042465623261663836382d336363332d346131332d383037642d3464626162316638303634360204051800040201000405004c56f900\" length=\"490566\" playlength=\"7\" cdnthumblength=\"8192\" cdnthumbwidth=\"135\" cdnthumbheight=\"240\" fromusername=\"zhangchuan2288\" md5=\"8804c121e9db91dd844f7a34035beb88\" newmd5=\"\" isplaceholder=\"0\" rawmd5=\"\" rawlength=\"0\" cdnrawvideourl=\"\" cdnrawvideoaeskey=\"\" overwritenewmsgid=\"0\" originsourcemd5=\"\" isad=\"0\" />\n</msg>"
}
  */
  async forwardVideo (toWxid: string, xml: string) {
    const data = {
      appId: this.appId,
      toWxid,
      xml,
    }
    try {
      const response = await this.axios.post('/v2/api/message/forwardVideo', data)
      // console.info('forwardVideo success:', response.data)
      log.info('forwardVideo success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('forwardVideo failed:', error)
      log.error('forwardVideo failed:' + error)
      throw error
    }
  }

  // /message/forwardUrl POST
  /*
  {
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "xml": "<?xml version=\"1.0\"?>\n<msg>\n\t<appmsg appid=\"\" sdkver=\"0\">\n\t\t<title>“李在明遇袭，颈部出血”</title>\n\t\t<des />\n\t\t<action />\n\t\t<type>5</type>\n\t\t<showtype>0</showtype>\n\t\t<soundtype>0</soundtype>\n\t\t<mediatagname />\n\t\t<messageext />\n\t\t<messageaction />\n\t\t<content />\n\t\t<contentattr>0</contentattr>\n\t\t<url>http://mp.weixin.qq.com/s?__biz=MjM5MzI5NTU3MQ==&amp;mid=2652294920&amp;idx=1&amp;sn=ad415f5d83e1471b845b2cb3fca7c3ce&amp;chksm=bce58367ee6ae84b711255705422d1554ee96b92d75648751316639d4aa09289d7827ff1cc85&amp;scene=0&amp;xtrack=1#rd</url>\n\t\t<lowurl />\n\t\t<dataurl />\n\t\t<lowdataurl />\n\t\t<appattach>\n\t\t\t<totallen>0</totallen>\n\t\t\t<attachid />\n\t\t\t<emoticonmd5 />\n\t\t\t<fileext />\n\t\t\t<cdnthumburl>3057020100044b304902010002048399cc8402032f7d6d020468b5bade0204659376ec042463663234636366642d323736612d343533342d623734342d3864623065633235636135390204051808030201000405004c56f900</cdnthumburl>\n\t\t\t<cdnthumbmd5>8e32cafa882f9b4f7c51fb568c0c4f8e</cdnthumbmd5>\n\t\t\t<cdnthumblength>38637</cdnthumblength>\n\t\t\t<cdnthumbwidth>658</cdnthumbwidth>\n\t\t\t<cdnthumbheight>280</cdnthumbheight>\n\t\t\t<cdnthumbaeskey>accc71cbe8ff795a94583fc514d198a8</cdnthumbaeskey>\n\t\t\t<aeskey>accc71cbe8ff795a94583fc514d198a8</aeskey>\n\t\t\t<encryver>0</encryver>\n\t\t</appattach>\n\t\t<extinfo />\n\t\t<sourceusername>gh_d29e0d22a6f9</sourceusername>\n\t\t<sourcedisplayname>澎湃新闻</sourcedisplayname>\n\t\t<thumburl>https://mmbiz.qpic.cn/mmbiz_jpg/yl6JkZAE3SibWvw5icQJpv87X084SRJOVeS3k7KMscRzov1nwicjMYzicyBIpRdJchWKTGPf4eN2H07Jicl11zMK2Pw/640?wxtype=jpeg&amp;wxfrom=0</thumburl>\n\t\t<md5 />\n\t\t<statextstr />\n\t\t<mmreadershare>\n\t\t\t<itemshowtype>0</itemshowtype>\n\t\t</mmreadershare>\n\t</appmsg>\n\t<fromusername>zhangchuan2288</fromusername>\n\t<scene>0</scene>\n\t<appinfo>\n\t\t<version>1</version>\n\t\t<appname></appname>\n\t</appinfo>\n\t<commenturl></commenturl>\n</msg>"
}
  */
  async forwardUrl (toWxid: string, xml: string) {
    const data = {
      appId: this.appId,
      toWxid,
      xml,
    }
    try {
      const response = await this.axios.post('/v2/api/message/forwardUrl', data)
      // console.info('forwardUrl success:', response.data)
      log.info('forwardUrl success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('forwardUrl failed:', error)
      log.error('forwardUrl failed:' + error)
      throw error
    }
  }

  // /message/forwardMiniApp POST
  /*
  {
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "xml": "<?xml version=\"1.0\"?>\n<msg>\n\t<appmsg appid=\"\" sdkver=\"0\">\n\t\t<title>👇晒出新年第一杯，点赞赢饮茶月卡</title>\n\t\t<des />\n\t\t<action />\n\t\t<type>33</type>\n\t\t<showtype>0</showtype>\n\t\t<soundtype>0</soundtype>\n\t\t<mediatagname />\n\t\t<messageext />\n\t\t<messageaction />\n\t\t<content />\n\t\t<contentattr>0</contentattr>\n\t\t<url>https://mp.weixin.qq.com/mp/waerrpage?appid=wxafec6f8422cb357b&amp;type=upgrade&amp;upgradetype=3#wechat_redirect</url>\n\t\t<lowurl />\n\t\t<dataurl />\n\t\t<lowdataurl />\n\t\t<appattach>\n\t\t\t<totallen>0</totallen>\n\t\t\t<attachid />\n\t\t\t<emoticonmd5 />\n\t\t\t<fileext />\n\t\t\t<cdnthumburl>3057020100044b30490201000204573515c902032f7d6d020416b7bade020465922a53042437383139393934652d323662652d346430662d396466362d3466303137346139616362390204051408030201000405004c53d900</cdnthumburl>\n\t\t\t<cdnthumbmd5>33cf0a1101e7f8cd3057cd417a691f0b</cdnthumbmd5>\n\t\t\t<cdnthumblength>96673</cdnthumblength>\n\t\t\t<cdnthumbwidth>600</cdnthumbwidth>\n\t\t\t<cdnthumbheight>500</cdnthumbheight>\n\t\t\t<cdnthumbaeskey>6f3098f2ee8b351b6cc9b1818d580356</cdnthumbaeskey>\n\t\t\t<aeskey>6f3098f2ee8b351b6cc9b1818d580356</aeskey>\n\t\t\t<encryver>0</encryver>\n\t\t</appattach>\n\t\t<extinfo />\n\t\t<sourceusername>gh_e9d25e745aae@app</sourceusername>\n\t\t<sourcedisplayname>霸王茶姬</sourcedisplayname>\n\t\t<thumburl />\n\t\t<md5 />\n\t\t<statextstr />\n\t\t<weappinfo>\n\t\t\t<username><![CDATA[gh_e9d25e745aae@app]]></username>\n\t\t\t<appid><![CDATA[wxafec6f8422cb357b]]></appid>\n\t\t\t<type>2</type>\n\t\t\t<version>193</version>\n\t\t\t<weappiconurl><![CDATA[]]></weappiconurl>\n\t\t\t<pagepath><![CDATA[/pages/page/page.html?code=JKD6DA55_3&channelCode=scrm_t664sgg5mrzxkqa]]></pagepath>\n\t\t\t<shareId><![CDATA[0_wxafec6f8422cb357b_25984983017778987@openim_1704162955_0]]></shareId>\n\t\t\t<pkginfo>\n\t\t\t\t<type>0</type>\n\t\t\t\t<md5><![CDATA[]]></md5>\n\t\t\t</pkginfo>\n\t\t\t<appservicetype>0</appservicetype>\n\t\t</weappinfo>\n\t</appmsg>\n\t<fromusername>zhangchuan2288</fromusername>\n\t<scene>0</scene>\n\t<appinfo>\n\t\t<version>1</version>\n\t\t<appname></appname>\n\t</appinfo>\n\t<commenturl></commenturl>\n</msg>",
    "coverImgUrl": "http://dummyimage.com/400x400"
}
  */
  async forwardMiniApp (toWxid: string, xml: string, coverImgUrl: string) {
    const data = {
      appId: this.appId,
      toWxid,
      xml,
      coverImgUrl,
    }
    try {
      const response = await this.axios.post('/v2/api/message/forwardMiniApp', data)
      // console.info('forwardMiniApp success:', response.data)
      log.info('forwardMiniApp success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('forwardMiniApp failed:', error)
      log.error('forwardMiniApp failed:' + error)
      throw error
    }
  }

  // /message/revokeMsg POST
  /*
  {
    "appId": "{{appid}}",
    "toWxid": "34757816141@chatroom",
    "msgId": "769533801",
    "newMsgId": "5271007655758710001",
    "createTime": "1704163145"
}
  */
  async revokeMsg (toWxid: string, msgId: string, newMsgId: string, createTime: string) {
    const data = {
      appId: this.appId,
      toWxid,
      msgId,
      newMsgId,
      createTime,
    }
    try {
      const response = await this.axios.post('/v2/api/message/revokeMsg', data)
      // console.info('revokeMsg success:', response.data)
      log.info('revokeMsg success:' + response.data)
      return response.data
    } catch (error) {
      // console.error('revokeMsg failed:', error)
      log.error('revokeMsg failed:' + error)
      throw error
    }
  }

}
