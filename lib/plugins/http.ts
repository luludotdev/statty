import { performance } from 'perf_hooks'
import { name as pkgName, version as pkgVersion } from '~utils/pkg'
import { createFactory, DEFAULT_LATENCY_LIMIT, UNKNOWN_LATENCY } from './base'
import { Status } from './types'

interface HttpOptions {
  statusCodes?: StatusCode[]
}

interface StatusCode {
  code: number | ((code: number) => boolean)
  status: Status
}

const defaultStatusCodes: StatusCode[] = [
  { code: code => code >= 200 && code < 400, status: Status.Operational },
  { code: code => code >= 400 && code < 500, status: Status.Degraded },
  { code: code => code >= 500 && code <= 599, status: Status.Unreachable },
]

const resolveStatusCode: (status: number, codes: StatusCode[]) => Status = (
  status,
  codes
) => {
  for (const matcher of codes) {
    const resolved =
      typeof matcher.code === 'function'
        ? matcher.code(status)
        : matcher.code === status

    if (resolved) return matcher.status
  }

  return Status.Unknown
}

export const httpFactory = createFactory<HttpOptions>('http', options => ({
  type: 'http',
  id: options.id,
  target: options.target,
  limit: options.latencyLimit ?? DEFAULT_LATENCY_LIMIT,
  description: () => options.description ?? options.target,

  async run() {
    const userStatusCodes = options.statusCodes ?? []
    const statusCodes = [...userStatusCodes, ...defaultStatusCodes]

    try {
      const before = performance.now()
      const resp = await fetch(options.target, {
        headers: {
          'user-agent': `${pkgName}/${pkgVersion}`,
        },
      })

      const after = performance.now()
      const latency = after - before
      const status =
        latency > (options.latencyLimit ?? DEFAULT_LATENCY_LIMIT)
          ? Status.Degraded
          : resolveStatusCode(resp.status, statusCodes)

      return { status, latency: Math.round(latency) }
    } catch {
      return { status: Status.Unreachable, latency: UNKNOWN_LATENCY }
    }
  },
}))
