import ms from 'ms'
import { schedule } from 'node-cron'
import { IPlugin, IPluginReponse } from '~plugins'
import { sleep } from '~utils/sleep'
import { evictData, saveData } from './persistence'
import { readUptime, saveUptime } from './uptime'

type ManagerData = Map<number, IPluginReponse>

interface IManagerOptions {
  initialData?: Array<[number, IPluginReponse]>
  initialUptime?: number

  crontab?: string
  evictTime?: string
  delay?: number
}

export interface IManager {
  plugin: IPlugin
  data: ManagerData
  uptimeRef: { uptime: number }
}

export const createManager: (
  plugin: IPlugin,
  options?: IManagerOptions
) => IManager = (plugin, options) => {
  const crontab = options?.crontab ?? '* * * * *'
  const evictTime = ms(options?.evictTime ?? '61m')

  const data: ManagerData = new Map(options?.initialData)
  const uptimeRef = { uptime: options?.initialUptime ?? 0 }

  const _evictOldData = async () => {
    const now = Date.now()
    const keys = [...data.keys()].filter(key => now - key >= evictTime)

    for (const key of keys) {
      data.delete(key)
      void evictData(plugin, key)
    }
  }

  const _readData = async () => {
    await _evictOldData()
    if (options?.delay !== undefined) {
      await sleep(options.delay)
    }

    const time = Date.now()
    const result = await plugin.run()

    data.set(time, result)
    void saveData(plugin, time, result)

    await saveUptime(plugin, result)
    uptimeRef.uptime = await readUptime(plugin)
  }

  const _task = schedule(crontab, _readData)
  void _evictOldData()

  return {
    _task,
    plugin,
    data,
    uptimeRef,
  }
}
