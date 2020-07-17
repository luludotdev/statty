import { FunctionComponent } from 'react'
import {
  STATUS_DEGRADED,
  STATUS_OPERATIONAL,
  STATUS_OUTAGES,
  STATUS_UNKNOWN,
  useStatus,
} from '~hooks/useStatus'
import { ITransformedData } from '~managers'
import { Notice } from './Notice'

interface IProps {
  stats: ITransformedData[]
}

export const Incidents: FunctionComponent<IProps> = ({ stats }) => {
  const { hasSevere, hasDegraded, hasUnknown, hasNone } = useStatus(stats)

  const worstSeverity = hasSevere
    ? 'red'
    : hasDegraded || hasUnknown
    ? 'orange'
    : 'green'

  const lines: string[] = []

  if (hasSevere === true) lines.push(STATUS_OUTAGES)
  if (hasDegraded === true) lines.push(STATUS_DEGRADED)
  if (hasUnknown === true) lines.push(STATUS_UNKNOWN)
  if (hasNone === true) lines.push(STATUS_OPERATIONAL)

  return (
    <Notice colour={worstSeverity}>
      {lines.map(x => (
        <p key={x}>{x}</p>
      ))}
    </Notice>
  )
}
