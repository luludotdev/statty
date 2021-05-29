import { readConfig } from './read'
import type { Config } from './types'
import { validateConfig } from './validate'

let configCache: Config | undefined

export const config: () => Promise<Readonly<Config>> = async () => {
  if (configCache !== undefined) return Object.freeze(configCache)

  const object = await readConfig()
  configCache = validateConfig(object)

  return Object.freeze(configCache)
}

export * from './types'
