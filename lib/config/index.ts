import { readConfig } from './read'
import { Config } from './types'
import { validateConfig } from './validate'

let configCache: Config | undefined

export const config: () => Promise<Config> = async () => {
  if (configCache !== undefined) return configCache

  const object = await readConfig()
  configCache = validateConfig(object)

  return configCache
}

export * from './types'
