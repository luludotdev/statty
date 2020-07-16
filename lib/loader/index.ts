import { createManager, IManager } from '~managers'
import { readConfig } from './readConfig'
import { resolvePlugin } from './resolvePlugin'
import { IInstance, validateConfig } from './validateConfig'

let setup = false
let instance: IInstance | undefined
const managers: Map<string, IManager> = new Map()

export const loadConfig: () => Promise<void> = async () => {
  if (setup === true) return
  setup = true

  const object = await readConfig()
  const config = validateConfig(object)
  instance = config.instance

  for (const service of config.services) {
    if (managers.has(service.id)) {
      throw new Error('Duplicate service ID!')
    }

    const factory = resolvePlugin(service.plugin)
    if (factory === undefined) {
      throw new Error(`Unknown plugin type: \`${service.plugin}\``)
    }

    const plugin = factory(service)
    const manager = createManager(plugin)

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

export type { IInstance } from './validateConfig'
