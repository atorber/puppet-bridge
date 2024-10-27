/* eslint-disable sort-keys */
import axios from 'axios'

export const setupAxios = (baseURL: string, token?: string) => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'X-GEWE-TOKEN': token }),
    },
  })
  return instance
}
