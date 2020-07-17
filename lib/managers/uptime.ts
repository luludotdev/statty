import { IPlugin, IPluginReponse } from '~plugins'

export const saveUptime: (
  plugin: IPlugin,
  data: IPluginReponse
) => Promise<void> = async (plugin, data) => {
  // TODO
  throw new Error('Not implemented')
}

export const readUptime: (
  plugin: IPlugin
) => Promise<number> = async plugin => {
  // TODO
  throw new Error('Not implemented')
}
