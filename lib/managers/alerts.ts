import { Alert } from '~config'
import { COLOUR_GREEN, COLOUR_RED } from '~constants'
import { getInstance } from '~loader'
import { Plugin, Status } from '~plugins'
import { redis, redisKey } from '~redis'
import { axios } from '~utils/axios'

const injectDefaults: (alerts: Alert) => Required<Alert> = alerts => ({
  ...alerts,
  unhealthyCount: alerts.unhealthyCount ?? 2,
  healthyCount: alerts.healthyCount ?? 2,
})

export const runAlerts: (
  plugin: Plugin,
  status: Status,
  alerts: Alert
) => Promise<void> = async (plugin, status, alerts) => {
  const injected = injectDefaults(alerts)

  if (status === Status.Operational) await isHealthy(plugin, injected)
  if (status === Status.Unreachable) await isUnhealthy(plugin, injected)
}

const isHealthy: (plugin: Plugin, alerts: Required<Alert>) => Promise<void> =
  async (plugin, alerts) => {
    const key = redisKey(plugin, 'alerts')

    const isSent = await redis.hget(key, 'sent')
    if (isSent === null) return

    const healthy = await redis.hincrby(key, 'healthy', 1)
    if (healthy < alerts.healthyCount) return

    await redis.del(key)

    const payload = await buildPayload(plugin, Status.Operational)
    await sendAlerts(payload, ...alerts.webhooks)
  }

const isUnhealthy: (plugin: Plugin, alerts: Required<Alert>) => Promise<void> =
  async (plugin, alerts) => {
    const key = redisKey(plugin, 'alerts')

    const unhealthy = await redis.hincrby(key, 'unhealthy', 1)
    if (unhealthy < alerts.unhealthyCount) return

    const isSent = await redis.hget(key, 'sent')
    if (isSent !== null) return

    const pipe = redis.pipeline()
    pipe.hset(key, 'sent', 1)
    pipe.hset(key, 'healthy', 0)
    await pipe.exec()

    const payload = await buildPayload(plugin, Status.Unreachable)
    await sendAlerts(payload, ...alerts.webhooks)
  }

interface Payload {
  username?: string
  avatar_url?: string

  attachments: Attachment[]
}

interface Attachment {
  fallback: string
  color?: string

  author_name?: string
  author_link?: string

  title?: string
  title_link?: string

  text?: string
  fields?: Field[]

  footer?: string
  ts?: number
}

interface Field {
  title: string
  value: string
  short: boolean
}

const buildPayload: (plugin: Plugin, status: Status) => Promise<Payload> =
  async (plugin, status) => {
    const { canonicalURL, name } = await getInstance()
    if (canonicalURL === undefined) throw new Error('Uh oh')
    const baseURL = canonicalURL.endsWith('/')
      ? canonicalURL
      : `${canonicalURL}/`

    const title = `Service alert for \`${plugin.id}\``
    const color = status === Status.Unreachable ? COLOUR_RED : COLOUR_GREEN
    const text =
      status === Status.Unreachable
        ? 'Service is unreachable!'
        : 'Service has resumed normal operation.'

    const payload: Attachment = {
      fallback: `**${title}**\n${text}`,
      color,

      title,
      title_link: `${baseURL}#${plugin.id}`,
      text,

      ts: Math.floor(Date.now() / 1000),
    }

    return {
      username: `${name} • Statty`,
      attachments: [payload],
    }
  }

const sendAlerts: (payload: Payload, ...urls: string[]) => Promise<void> =
  async (payload, ...urls) => {
    await Promise.allSettled(urls.map(async url => axios.post(url, payload)))
  }
