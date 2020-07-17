import { IPlugin, IPluginReponse, Status } from '~plugins'
import { redis } from '~redis'
import { redisKey } from './persistence'

export const saveUptime: (
  plugin: IPlugin,
  timestamp: number,
  data: IPluginReponse
) => Promise<void> = async (plugin, timestamp, data) => {
  const now = new Date(timestamp)
  const minute = now.getHours() * 60 + now.getMinutes()
  const isUp =
    data.status === Status.Unreachable
      ? '1'
      : data.status === Status.Degraded
      ? '2'
      : data.status === Status.Operational
      ? '2'
      : '0'

  const key = redisKey(plugin, 'uptime')
  await redis.send_command('BITFIELD', key, 'SET', 'u2', `#${minute}`, isUp)
}

export const readUptime: (
  plugin: IPlugin
) => Promise<number | undefined> = async plugin => {
  // TODO
  throw new Error('Not implemented')
}
