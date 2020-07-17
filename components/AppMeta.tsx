import { FunctionComponent } from 'react'
import {
  STATUS_DEGRADED,
  STATUS_OPERATIONAL,
  STATUS_OUTAGES,
  STATUS_UNKNOWN,
  useStatus,
} from '~hooks/useStatus'
import { ITransformedData } from '~managers'
import { Meta } from './Meta'

interface IProps {
  siteName: string
  stats: ITransformedData[]
}

export const AppMeta: FunctionComponent<IProps> = ({ siteName, stats }) => {
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
    ? '#ffb3b3'
    : hasUnknown || hasDegraded
    ? '#ffdfb3'
    : hasNone
    ? '#b3ffb3'
    : undefined

  return <Meta siteName={siteName} description={description} colour={colour} />
}
