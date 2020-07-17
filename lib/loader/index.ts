import { BitStream } from 'bit-buffer'
import { IInstance, config as readConfig } from '~config'
import { createManager, IManager } from '~managers'
import { IPluginReponse, Status } from '~plugins'
import { awaitRedis, redis } from '~redis'
import { resolvePlugin } from './resolvePlugin'

let setup = false
let instance: IInstance | undefined
const managers: Map<string, IManager> = new Map()

export const loadConfig: () => Promise<void> = async () => {
  if (setup === true) return
  setup = true

  const config = await readConfig()
  instance = config.instance

  await awaitRedis()

  for (const service of config.services) {
    if (managers.has(service.id)) {
      throw new Error('Duplicate service ID!')
    }

    const factory = resolvePlugin(service.plugin)
    if (factory === undefined) {
      throw new Error(`Unknown plugin type: \`${service.plugin}\``)
    }

    const redisKey = `${service.plugin}:${service.id}`
    // eslint-disable-next-line no-await-in-loop
    const rawData = await redis.hgetall(`${redisKey}:stats`)
    const initialData: Array<[number, IPluginReponse]> = Object.entries(
      rawData
    ).map(([key, value]) => [Number.parseInt(key, 10), JSON.parse(value)])

    const idx = config.services.findIndex(x => x === service)
    const delayFactor = config.instance.delayFactor ?? 2
    const delay = delayFactor === -1 ? undefined : delayFactor * idx * 1000

    const plugin = factory(service)
    const manager = createManager(plugin, {
      initialData,
      crontab: config.instance.crontab,
      evictTime: config.instance.evictTime,
      delay,
    })

    manager.onEvicted(async key =>
      redis.hdel(`${redisKey}:stats`, key.toString())
    )

    manager.onData(async (key, data) => {
      void redis.hset(`${redisKey}:stats`, key.toString(), JSON.stringify(data))

      const now = new Date(key)
      const minute = now.getHours() * 60 + now.getMinutes()
      const isUp =
        data.status === Status.Unreachable
          ? '1'
          : data.status === Status.Degraded
          ? '2'
          : data.status === Status.Operational
          ? '2'
          : '0'

      await redis.send_command(
        'BITFIELD',
        `${redisKey}:uptime`,
        'SET',
        'u2',
        `#${minute}`,
        isUp
      )

      const bytes = await redis.getBuffer(`${redisKey}:uptime`)
      const uptime = readUptime(bytes)

      manager.setUptime(uptime)
    })

    managers.set(service.id, manager)
  }
}

export const getInstance: () => Promise<IInstance> = async () => {
  await loadConfig()
  return instance as IInstance
}

export const getManagers: () => Promise<Map<string, IManager>> = async () => {
  await loadConfig()
  return managers
}

const readUptime: (buf: Buffer) => number = buf => {
  let upCount = 0
  let downCount = 0

  const u8 = Uint8Array.from(buf)
  const bs = new BitStream(u8.buffer)
  while (bs.bitsLeft > 0) {
    const bit = bs.readBits(2, false)
    if (bit === 2) upCount++
    if (bit === 1) downCount++
  }

  const total = upCount + downCount
  return upCount / total
}
