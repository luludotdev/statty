import ms from 'ms'
import { schedule } from 'node-cron'
import { config as readConfig } from '~config'
import { IPlugin, IPluginReponse } from '~plugins'
import { sleep } from '~utils/sleep'
import { runAlerts } from './alerts'
import { evictData, loadData, saveData } from './persistence'
import { readUptime, saveUptime } from './uptime'

type ManagerData = Map<number, IPluginReponse>

interface IManagerOptions {
  crontab?: string
  evictTime?: string
  delay?: number
  sendAlerts?: boolean
}

export interface IManager {
  plugin: IPlugin
  data: ManagerData
  uptimeRef: { uptime: number }
}

export const createManager: (
  plugin: IPlugin,
  options?: IManagerOptions
) => Promise<IManager> = async (plugin, options) => {
  const config = await readConfig()

  const crontab = options?.crontab ?? '* * * * *'
  const evictTime = ms(options?.evictTime ?? '61m')
  const sendAlerts = options?.sendAlerts ?? true

  const initialData = await loadData(plugin)
  const initialUptime = await readUptime(plugin)

  const data: ManagerData = new Map(initialData)
  const uptimeRef = { uptime: initialUptime ?? 0 }

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

    await saveUptime(plugin, time, result)
    const uptime = await readUptime(plugin)
    if (uptime !== undefined) uptimeRef.uptime = uptime

    if (sendAlerts === false) return
    if (config.instance.alerts === undefined) return
    await runAlerts(plugin, result.status, config.instance.alerts)
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
