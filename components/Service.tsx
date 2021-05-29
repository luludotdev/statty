import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import type { FC } from 'react'
import { ICON_COLOURS } from '~constants'
import type { TransformedData } from '~managers'
import { Status } from '~plugins/types'
import { Graph } from './Graph'
import { Linkify } from './Linkify'

export const Service: FC<TransformedData> = ({
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
      <style jsx>
        {`
          .service
            margin 2rem 0

            & header
              display flex
              align-items center

              & h2
                margin 0

            & .information
              margin-left 0.5em
              opacity 0.5

              @media (max-width 500px)
                &
                  font-size 1rem

            & .description
              margin-top 1em

            & .icon
              font-size 2em
              margin-right 0.5em

            &.service-operational .icon
              color ${ICON_COLOURS.green.light}

              :global(.dark) &
                color ${ICON_COLOURS.green.dark}

            &.service-degraded .icon
              color ${ICON_COLOURS.orange.light}

              :global(.dark) &
                color ${ICON_COLOURS.orange.dark}

            &.service-unreachable .icon
              color ${ICON_COLOURS.red.light}

              :global(.dark) &
                color ${ICON_COLOURS.red.dark}

            &.service-unknown .icon
              color ${ICON_COLOURS.grey.light}

              :global(.dark) &
                color ${ICON_COLOURS.grey.dark}
        `}
      </style>

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
