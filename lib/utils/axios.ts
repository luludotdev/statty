import Axios from 'axios'
import type { AxiosError } from 'axios'
import type { IncomingMessage } from 'http'
import absoluteUrl from 'next-absolute-url'
import { IS_SERVER } from '~env'

declare module 'axios' {
  interface AxiosRequestConfig {
    _req?: IncomingMessage
  }
}

export const axios = Axios.create()
if (IS_SERVER) {
  axios.interceptors.request.use(config => {
    if (config._req === undefined) throw new Error('Oh no!')
    const { origin } = absoluteUrl(config._req)
    config.baseURL = origin

    return config
  })
}

// @ts-expect-error
export const isAxiosError: (error: unknown) => error is AxiosError = error => {
  if (typeof error !== 'object') return false
  if (error === null) return false

  // @ts-expect-error
  return error.isAxiosError === true
}
