import { readConfig } from './read'
import { validateConfig } from './validate'
import type { Config } from './types'

let configCache: Config | undefined

export const config: () => Promise<Config> = async () => {
  if (configCache !== undefined) return configCache

  const object = await readConfig()
  configCache = validateConfig(object)

  return configCache
}

export * from './types'
