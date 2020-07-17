import { IInstance, config as readConfig } from '~config'
import { createManager, IManager } from '~managers'
import { IPluginReponse } from '~plugins'
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
