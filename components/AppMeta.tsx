import {
  NOTICE_COLOURS,
  STATUS_DEGRADED,
  STATUS_OPERATIONAL,
  STATUS_OUTAGES,
  STATUS_UNKNOWN,
} from '~constants'
import { useStatus } from '~hooks/useStatus'
import type { TransformedData } from '~managers'
import { Meta } from './Meta'
import type { FC } from 'react'

interface Props {
  siteName: string
  stats: TransformedData[]
}

export const AppMeta: FC<Props> = ({ siteName, stats }) => {
  const { hasSevere, hasDegraded, hasUnknown, hasNone } = useStatus(stats)

  const description = hasSevere
    ? STATUS_OUTAGES
    : hasUnknown
    ? STATUS_UNKNOWN
    : hasDegraded
    ? STATUS_DEGRADED
    : hasNone
    ? STATUS_OPERATIONAL
    : undefined

  const colour = hasSevere
    ? NOTICE_COLOURS.red.light
    : hasUnknown || hasDegraded
    ? NOTICE_COLOURS.orange.light
    : hasNone
    ? NOTICE_COLOURS.green.light
    : undefined

  return <Meta siteName={siteName} description={description} colour={colour} />
}
