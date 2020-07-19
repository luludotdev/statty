import { IAlert } from '~config'
import { IPlugin, Status } from '~plugins'

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
  throw new Error('Not Implemented!')
  // TODO
}

const isUnhealthy: (
  plugin: IPlugin,
  alerts: Required<IAlert>
) => Promise<void> = async (plugin, alerts) => {
  throw new Error('Not Implemented!')
  // TODO
}
