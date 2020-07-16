import ms from 'ms'
import { schedule } from 'node-cron'
import { IPlugin, IPluginReponse } from '~plugins'

type ManagerData = Map<number, IPluginReponse>

interface IManagerOptions {
  crontab?: string
  evictTime?: string
}

export interface IManager {
  plugin: IPlugin
  data: ManagerData
}

export const createManager: (
  plugin: IPlugin,
  options?: IManagerOptions
) => IManager = (plugin, options) => {
  const crontab = options?.crontab ?? '* * * * *'
  const evictTime = ms(options?.evictTime ?? '1h')

  const data: ManagerData = new Map()
  const _evictOldData = async () => {
    const now = Date.now()
    const keys = [...data.keys()].filter(key => now - key >= evictTime)

    for (const key of keys) {
      data.delete(key)
    }
  }

  const _readData = async () => {
    const time = Date.now()
    const result = await plugin.run()

    data.set(time, result)
    await _evictOldData()
  }

  const _task = schedule(crontab, _readData)
  void _readData()

  return {
    _task,
    plugin,
    data,
  }
}
