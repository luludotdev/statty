import { IAlert } from '~config'
import { IPlugin, Status } from '~plugins'
import { redis, redisKey } from '~redis'

const injectDefaults: (alerts: IAlert) => Required<IAlert> = alerts => ({
  ...alerts,
  unhealthyCount: alerts.unhealthyCount ?? 2,
  healthyCount: alerts.healthyCount ?? 2,
})

export const runAlerts: (
  plugin: IPlugin,
  status: Status,
  alerts: IAlert
) => Promise<void> = async (plugin, status, alerts) => {
  const injected = injectDefaults(alerts)

  if (status === Status.Operational) await isHealthy(plugin, injected)
  if (status === Status.Unreachable) await isUnhealthy(plugin, injected)
}

const isHealthy: (
  plugin: IPlugin,
  alerts: Required<IAlert>
) => Promise<void> = async (plugin, alerts) => {
  const key = redisKey(plugin, 'alerts')

  const isSent = await redis.hget(key, 'sent')
  if (isSent === null) return

  const healthy = await redis.hincrby(key, 'healthy', 1)
  if (healthy < alerts.healthyCount) return

  await redis.del(key)
  // TODO: Send all clear
}

const isUnhealthy: (
  plugin: IPlugin,
  alerts: Required<IAlert>
) => Promise<void> = async (plugin, alerts) => {
  const key = redisKey(plugin, 'alerts')

  const unhealthy = await redis.hincrby(key, 'unhealthy', 1)
  if (unhealthy < alerts.unhealthyCount) return

  const isSent = await redis.hget(key, 'sent')
  if (isSent !== null) return

  const pipe = redis.pipeline()
  pipe.hset(key, 'sent', 1)
  pipe.hset(key, 'healthy', 0)
  await pipe.exec()

  // TODO: Send alerts
}
