import { config as readConfig } from '~config'
import type { Instance } from '~config'
import { createManager } from '~managers'
import type { Manager } from '~managers'
import { awaitRedis } from '~redis'
import { resolvePlugin } from './resolvePlugin'

let setup = false
let isSettingUp = false
let instance: Instance | undefined
const managers: Map<string, Manager> = new Map()

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

    const idx = config.services.indexOf(service)
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

export const getInstance: () => Promise<Instance> = async () => {
  await loadConfig()

  if (!instance) throw new Error('Null Instance')
  return instance
}

export const getManagers: () => Promise<Map<string, Manager>> = async () => {
  await loadConfig()
  return managers
}
