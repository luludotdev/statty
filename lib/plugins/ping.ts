import ping from 'pingman'
import { HostType, resolveHost } from '~utils/ip'
import { createFactory, DEFAULT_LATENCY_LIMIT, UNKNOWN_LATENCY } from './base'
import { Status } from './types'

export const pingFactory = createFactory('ping', options => ({
  type: 'ping',
  id: options.id,
  target: options.target,
  limit: options.latencyLimit ?? DEFAULT_LATENCY_LIMIT,
  description: () => options.description ?? `ping \`${options.target}\``,

  async run() {
    const hostType = resolveHost(options.target)
    const ipv6 = hostType === HostType.IPv6

    const { alive, time: latency } = await ping(options.target, {
      IPV6: ipv6,
      numberOfEchos: 1,
    })

    if (alive === false)
      return { status: Status.Unreachable, latency: UNKNOWN_LATENCY }
    if (latency === undefined)
      return { status: Status.Unknown, latency: UNKNOWN_LATENCY }

    const status =
      latency > (options.latencyLimit ?? DEFAULT_LATENCY_LIMIT)
        ? Status.Degraded
        : Status.Operational

    return { status, latency: Math.round(latency) }
  },
}))
