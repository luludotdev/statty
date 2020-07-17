import { IPlugin, IPluginReponse } from '~plugins'
import { redis, redisKey } from '~redis'

const REDIS_KEY = 'stats'

export const saveData: (
  plugin: IPlugin,
  timestamp: number,
  data: IPluginReponse
) => Promise<void> = async (plugin, timestamp, data) => {
  const key = redisKey(plugin, REDIS_KEY)
  await redis.hset(key, timestamp.toString(), JSON.stringify(data))
}

export const evictData: (
  plugin: IPlugin,
  timestamp: number
) => Promise<void> = async (plugin, timestamp) => {
  const key = redisKey(plugin, REDIS_KEY)
  await redis.hdel(key, timestamp.toString())
}

export const loadData: (
  plugin: IPlugin
) => Promise<Array<[number, IPluginReponse]>> = async plugin => {
  const key = redisKey(plugin, REDIS_KEY)
  const rawData = await redis.hgetall(key)

  const initialData: Array<[number, IPluginReponse]> = Object.entries(
    rawData
  ).map(([key, value]) => [Number.parseInt(key, 10), JSON.parse(value)])

  return initialData
}
