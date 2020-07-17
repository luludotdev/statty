import { IPlugin, IPluginReponse } from '~plugins'
import { redis } from '~redis'

export const redisKey: (plugin: IPlugin, key: string) => string = (
  plugin,
  key
) => `${plugin.type}:${plugin.id}:${key}`

export const saveData: (
  plugin: IPlugin,
  timestamp: number,
  data: IPluginReponse
) => Promise<void> = async (plugin, timestamp, data) => {
  const key = redisKey(plugin, 'stats')
  await redis.hset(key, timestamp.toString(), JSON.stringify(data))
}

export const evictData: (
  plugin: IPlugin,
  timestamp: number
) => Promise<void> = async (plugin, timestamp) => {
  const key = redisKey(plugin, 'stats')
  await redis.hdel(key, timestamp.toString())
}
