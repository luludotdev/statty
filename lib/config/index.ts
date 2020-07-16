import { readConfig } from './read'
import { IConfig } from './types'
import { validateConfig } from './validate'

let configCache: IConfig | undefined

export const config: () => Promise<IConfig> = async () => {
  if (configCache !== undefined) return configCache

  const object = await readConfig()
  configCache = validateConfig(object)

  return configCache
}

export * from './types'
