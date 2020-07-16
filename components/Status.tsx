import { FunctionComponent } from 'react'
import { ITransformedData } from '~managers'
import { Status } from '~plugins/types'
import { Notice } from './Notice'

interface IProps {
  stats: ITransformedData[]
}

export const Incidents: FunctionComponent<IProps> = ({ stats }) => {
  const anySevere = stats.some(x => x.status === Status.Unreachable)
  const anyDegraded = stats.some(x => x.status === Status.Degraded)
  const anyUnknown = stats.some(x => x.status === Status.Unknown)

  const worstSeverity = anySevere
    ? 'red'
    : anyDegraded || anyUnknown
    ? 'orange'
    : 'green'

  const lines: string[] = []

  if (anySevere === true) lines.push('Some services are experiencing outages')
  if (anyDegraded === true) {
    lines.push('Some services are experiencing degraded performance')
  }

  if (anyUnknown === true) {
    lines.push('We are having trouble reaching some services')
  }

  if (anySevere === false && anyDegraded === false && anyUnknown === false) {
    lines.push('All systems operational')
  }

  return (
    <Notice colour={worstSeverity}>
      {lines.map(x => (
        <p key={x}>{x}</p>
      ))}
    </Notice>
  )
}
