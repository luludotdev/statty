import ping from 'pingman'
import { HostType, resolveHost } from '~utils/ip'
import { createFactory, DEFAULT_LATENCY_LIMIT, Status } from './base'

export const pingFactory = createFactory('ping', options => ({
  type: 'ping',
  id: options.id,
  target: options.target,
  description: () => options.description ?? `ping \`${options.target}\``,

  run: async () => {
    const hostType = resolveHost(options.target)
    const ipv6 = hostType === HostType.IPv6

    const { alive, time: latency } = await ping(options.target, {
      IPV6: ipv6,
      numberOfEchos: 1,
    })

    if (alive === false) return { status: Status.Unreachable, latency: -1 }
    if (latency === undefined) return { status: Status.Unknown, latency: -1 }

    const status =
      latency > (options.latencyLimit ?? DEFAULT_LATENCY_LIMIT)
        ? Status.Degraded
        : Status.Operational

    return { status, latency }
  },
}))
