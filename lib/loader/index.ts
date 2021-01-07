import { IInstance, config as readConfig } from '~config'
import { createManager, IManager } from '~managers'
import { awaitRedis } from '~redis'
import { resolvePlugin } from './resolvePlugin'

let setup = false
let isSettingUp = false
let instance: IInstance | undefined
const managers: Map<string, IManager> = new Map()

export const loadConfig: () => Promise<void> = async () => {
  if (setup === true) return
  if (isSettingUp === true) return
  isSettingUp = true

  const config = await readConfig()
  instance = config.instance

  await awaitRedis()

  /* eslint-disable no-await-in-loop */
  for (const service of config.services) {
    if (managers.has(service.id)) {
      throw new Error('Duplicate service ID!')
    }

    const factory = resolvePlugin(service.plugin)
    if (factory === undefined) {
      throw new Error(`Unknown plugin type: \`${service.plugin}\``)
    }

    const idx = config.services.findIndex(x => x === service)
    const delayFactor = config.instance.delayFactor ?? 2
    const delay = delayFactor === -1 ? undefined : delayFactor * idx * 1000

    const plugin = factory(service)
    const manager = await createManager(plugin, {
      crontab: config.instance.crontab,
      evictTime: config.instance.evictTime,
      delay,
    })

    managers.set(service.id, manager)
  }

  setup = true
  /* eslint-enable no-await-in-loop */
}

export const getInstance: () => Promise<IInstance> = async () => {
  await loadConfig()
  return instance!
}

export const getManagers: () => Promise<Map<string, IManager>> = async () => {
  await loadConfig()
  return managers
}
