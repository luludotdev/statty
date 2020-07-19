export interface IConfig {
  instance: IInstance
  services: IService[]
}

export interface IInstance {
  name: string
  canonicalURL?: string

  crontab?: string
  evictTime?: string
  delayFactor?: number

  alerts?: IAlert
}

export interface IAlert {
  webhooks: string[]

  unhealthyCount?: number
  healthyCount?: number
}

export interface IService {
  [key: string]: unknown

  id: string
  plugin: string
  target: string

  description?: string
  latencyLimit?: number

  sendAlerts?: boolean
}
