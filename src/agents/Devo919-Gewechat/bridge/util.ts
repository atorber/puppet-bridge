import { xml2js, log } from '../client/mod.js'
import { parseString } from 'xml2js'
import { promisify } from 'util'

export const aa = (xml:string, callback:(err: any, json: any)=>void) => {
  xml2js.parseString(String(xml), { explicitArray: false, ignoreAttrs: true }, (err: any, json: any) => {
    log.info('xml2js json', json)
    log.info('xml2js err', err)
    callback(err, json)
  })
}

// 将 parseString 函数转换为返回 Promise 的函数
const parseStringPromise = promisify(parseString)

export async function parseXml (xmlData:string) {
  try {
    const result: any = await parseStringPromise(xmlData)
    log.info('解析后的 JSON 对象:', JSON.stringify(result))
    return result
  } catch (error) {
    console.error('解析 XML 时出错:', error)
  }
}
