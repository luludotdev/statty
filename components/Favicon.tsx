import {
    ICON_DEGRADED,
    ICON_OPERATIONAL,
    ICON_OUTAGES,
    ICON_UNKNOWN,
} from '~constants'
import { useStatus } from '~hooks/useStatus'
import type { TransformedData } from '~managers'
import Head from 'next/head'
import type { FC } from 'react'

interface Props {
    stats: TransformedData[]
}

export const Favicon: FC<Props> = ({ stats }) => {
  const { hasSevere, hasDegraded, hasUnknown, hasNone } = useStatus(stats)

  const icon = hasSevere
    ? ICON_OUTAGES
    : hasUnknown
    ? ICON_UNKNOWN
    : hasDegraded
    ? ICON_DEGRADED
    : hasNone
    ? ICON_OPERATIONAL
    : undefined

  return (
    <Head>
      <link rel="shortcut icon" href={icon} />
    </Head>
  )
}
