import ms from 'ms'
import { schedule } from 'node-cron'
import { IPlugin, IPluginReponse } from '~plugins'
import { sleep } from '~utils/sleep'

type ManagerData = Map<number, IPluginReponse>

interface IManagerOptions {
  initialData?: Array<[number, IPluginReponse]>
  initialUptime?: number

  crontab?: string
  evictTime?: string
  delay?: number
}

type OnData = (key: number, data: IPluginReponse) => any
type OnEvicted = (key: number) => any

export interface IManager {
  plugin: IPlugin
  data: ManagerData
  uptime: number

  setUptime: (uptime: number) => void
  onData: (func: OnData) => void
  onEvicted: (func: OnEvicted) => void
}

export const createManager: (
  plugin: IPlugin,
  options?: IManagerOptions
) => IManager = (plugin, options) => {
  const crontab = options?.crontab ?? '* * * * *'
  const evictTime = ms(options?.evictTime ?? '61m')

  const onDataListeners: OnData[] = []
  const onEvictedListeners: OnEvicted[] = []

  const data: ManagerData = new Map(options?.initialData)
  let uptime = options?.initialUptime ?? 0

  const _evictOldData = async () => {
    const now = Date.now()
    const keys = [...data.keys()].filter(key => now - key >= evictTime)

    for (const key of keys) {
      data.delete(key)
      onEvictedListeners.forEach(fn => fn(key))
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
    onDataListeners.forEach(fn => fn(time, result))
  }

  const _task = schedule(crontab, _readData)
  void _evictOldData()

  return {
    _task,
    plugin,
    data,

    uptime,
    setUptime: value => {
      uptime = value
    },

    onData: func => onDataListeners.push(func),
    onEvicted: func => onEvictedListeners.push(func),
  }
}
