// src/utils/server.ts

import http, { IncomingMessage, ServerResponse } from 'http'
import { logger } from './logger.js'
import os from 'os'

export const getLocalIpAddress = (): string | undefined => {
  const interfaces = os.networkInterfaces()
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]!) {
      // 跳过内部（即 127.0.0.1）和非 IPv4 地址
      if (net.family === 'IPv4' && !net.internal) {
        return net.address
      }
    }
  }
  return undefined
}

export const createHttpServer = (
  port: number,
  requestHandler: (req: IncomingMessage, res: ServerResponse) => void,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const server = http.createServer(requestHandler)
    server.listen(port, () => {
      const ipAddress = getLocalIpAddress()
      logger.info(`消息接收服务器正在运行在 http://${ipAddress}:${port}`)
      resolve()
    })
    server.on('error', (err) => {
      reject(err)
    })
  })
}
