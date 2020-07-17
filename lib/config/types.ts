export interface IConfig {
  instance: IInstance
  services: IService[]
}

export interface IInstance {
  name: string

  crontab?: string
  evictTime?: string
  delayFactor?: number
}

export interface IService {
  [key: string]: unknown

  id: string
  plugin: string
  target: string

  description?: string
  latencyLimit?: number
}
