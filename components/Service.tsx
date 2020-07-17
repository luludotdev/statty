import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { FunctionComponent } from 'react'
import { ITransformedData } from '~managers'
import { Status } from '~plugins/types'
import { Graph } from './Graph'
import { Linkify } from './Linkify'

import '~styles/service.styl'

export const Service: FunctionComponent<ITransformedData> = ({
  id,
  description,
  status,
  limit,
  data,
  uptime,
}) => {
  const title =
    status === Status.Operational
      ? 'This service is healthy.'
      : Status.Degraded
      ? 'This service is slow, but responding.'
      : Status.Unreachable
      ? 'This service is unresponsive.'
      : 'Service status unknown.'

  const icon =
    status === Status.Operational
      ? 'check-circle'
      : Status.Degraded
      ? 'exclamation-circle'
      : Status.Unreachable
      ? 'times-circle'
      : 'question-circle'

  const latency: number | undefined = data?.[0]?.[1]

  return (
    <div className={clsx('service', `service-${status}`)}>
      <header>
        <div className='icon' title={title}>
          <FontAwesomeIcon icon={icon} />
        </div>

        <h2 id={id} className='title'>
          {id}

          <span className='information'>
            <span title='Latency'>
              {latency !== undefined && `${latency}ms`}
            </span>{' '}
            <span title='Uptime'>({(uptime * 100).toFixed(0)}%)</span>
          </span>
        </h2>
      </header>

      <p className='description'>
        <Linkify>{description}</Linkify>
      </p>

      <Graph limit={limit} data={data} />
    </div>
  )
}
