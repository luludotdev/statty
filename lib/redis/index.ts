import { Plugin } from '~plugins'

export * from './await'
export * from './db'

export const redisKey: (plugin: Plugin, key: string) => string = (
  plugin,
  key
) => `${plugin.type}:${plugin.id}:${key}`
