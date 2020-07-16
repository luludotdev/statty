import { parse } from 'ip6addr'

export enum HostType {
  IPv4,
  IPv6,
  Hostname,
}

export const resolveHost: (host: string) => HostType = host => {
  try {
    const addr = parse(host)
    const kind = addr.kind()

    return kind === 'ipv6' ? HostType.IPv6 : HostType.IPv4
  } catch {
    return HostType.Hostname
  }
}
