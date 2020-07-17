import { IPlugin, IPluginReponse } from '~plugins'

export const redisKey: (plugin: IPlugin, key: string) => string = (
  plugin,
  key
) => `${plugin.type}:${plugin.id}:${key}`

export const saveData: (
  plugin: IPlugin,
  timestamp: number,
  data: IPluginReponse
) => Promise<void> = async (plugin, timestamp, data) => {
  // TODO
  throw new Error('Not implemented')
}

export const evictData: (
  plugin: IPlugin,
  timestamp: number
) => Promise<void> = async (plugin, timestamp) => {
  // TODO
  throw new Error('Not implemented')
}
