import { IPlugin } from '~plugins'

export * from './await'
export * from './db'

export const redisKey: (plugin: IPlugin, key: string) => string = (
  plugin,
  key
) => `${plugin.type}:${plugin.id}:${key}`
