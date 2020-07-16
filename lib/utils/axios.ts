import Axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { IS_SERVER } from '~env'
import { name as pkgName, version as pkgVersion } from '~utils/pkg'

const server: AxiosRequestConfig = {
  // TODO: Make this more reliable
  baseURL: 'http://localhost:3000',
  headers: {
    'user-agent': `${pkgName}/${pkgVersion}`,
  },
}

export const axios = IS_SERVER ? Axios.create(server) : Axios.create()

// @ts-expect-error
export const isAxiosError: (error: unknown) => error is AxiosError = error => {
  if (typeof error !== 'object') return false
  if (error === null) return false

  // @ts-expect-error
  return error.isAxiosError === true
}
