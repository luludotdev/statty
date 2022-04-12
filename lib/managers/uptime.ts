import { BitStream } from 'bit-buffer'
import { Status } from '~plugins'
import type { Plugin, PluginReponse } from '~plugins'
import { redis, redisKey } from '~redis'

const REDIS_KEY = 'uptime'

export const saveUptime: (
  plugin: Plugin,
  timestamp: number,
  data: PluginReponse
) => Promise<void> = async (plugin, timestamp, data) => {
  const now = new Date(timestamp)
  const minute = now.getHours() * 60 + now.getMinutes()
  const isUp =
    data.status === Status.Unreachable
      ? '1'
      : data.status === Status.Degraded
      ? '2'
      : data.status === Status.Operational
      ? '2'
      : '0'

  const key = redisKey(plugin, REDIS_KEY)
  await redis.bitfield(key, 'SET', 'u2', `#${minute}`, isUp)
}

export const readUptime: (
  plugin: Plugin
) => Promise<number | undefined> = async plugin => {
  const key = redisKey(plugin, REDIS_KEY)
  const bytes = await redis.getBuffer(key)
  if (bytes === null) return undefined

  let upCount = 0
  let downCount = 0

  const u8 = Uint8Array.from(bytes)
  const bs = new BitStream(u8.buffer)
  while (bs.bitsLeft > 0) {
    const bit = bs.readBits(2, false)
    if (bit === 2) upCount++
    if (bit === 1) downCount++
  }

  const total = upCount + downCount
  return upCount / total
}
