export interface Config {
  instance: Instance
  services: Service[]
}

export interface Instance {
  name: string
  canonicalURL?: string

  crontab?: string
  evictTime?: string
  delayFactor?: number

  alerts?: Alert
}

export interface Alert {
  webhooks: string[]

  unhealthyCount?: number
  healthyCount?: number
}

export interface Service {
  [key: string]: unknown

  id: string
  plugin: string
  target: string

  description?: string
  latencyLimit?: number

  sendAlerts?: boolean
}
