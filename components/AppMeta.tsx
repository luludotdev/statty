import { FC } from 'react'
import {
  COLOUR_GREEN,
  COLOUR_ORANGE,
  COLOUR_RED,
  STATUS_DEGRADED,
  STATUS_OPERATIONAL,
  STATUS_OUTAGES,
  STATUS_UNKNOWN,
} from '~constants'
import { useStatus } from '~hooks/useStatus'
import { TransformedData } from '~managers'
import { Meta } from './Meta'

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
    ? COLOUR_RED
    : hasUnknown || hasDegraded
    ? COLOUR_ORANGE
    : hasNone
    ? COLOUR_GREEN
    : undefined

  return <Meta siteName={siteName} description={description} colour={colour} />
}
