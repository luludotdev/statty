import ms from 'ms'
import { schedule } from 'node-cron'
import { IPlugin, IPluginReponse } from '~plugins'

type ManagerData = Map<number, IPluginReponse>

interface IManagerOptions {
  initialData?: Array<[number, IPluginReponse]>
  crontab?: string
  evictTime?: string
}

type OnData = (key: number, data: IPluginReponse) => any
type OnEvicted = (key: number) => any

export interface IManager {
  plugin: IPlugin
  data: ManagerData

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

    onData: func => onDataListeners.push(func),
    onEvicted: func => onEvictedListeners.push(func),
  }
}
