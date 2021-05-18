import type { Plugin, PluginReponse } from '~plugins'
import { redis, redisKey } from '~redis'

const REDIS_KEY = 'stats'

export const saveData: (
  plugin: Plugin,
  timestamp: number,
  data: PluginReponse
) => Promise<void> = async (plugin, timestamp, data) => {
  const key = redisKey(plugin, REDIS_KEY)
  await redis.hset(key, timestamp.toString(), JSON.stringify(data))
}

export const evictData: (plugin: Plugin, timestamp: number) => Promise<void> =
  async (plugin, timestamp) => {
    const key = redisKey(plugin, REDIS_KEY)
    await redis.hdel(key, timestamp.toString())
  }

export const loadData: (
  plugin: Plugin
) => Promise<Array<[number, PluginReponse]>> = async plugin => {
  const key = redisKey(plugin, REDIS_KEY)
  const rawData = await redis.hgetall(key)

  const initialData: Array<[number, PluginReponse]> = Object.entries(
    rawData
  ).map(([key, value]) => [Number.parseInt(key, 10), JSON.parse(value)])

  return initialData
}
