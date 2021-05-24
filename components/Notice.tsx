import clsx from 'clsx'
import { NOTICE_COLOURS } from '~constants'
import type { FC } from 'react'

interface Props {
  colour: 'green' | 'orange' | 'red'
}

export const Notice: FC<Props> = ({ colour, children }) => (
  <div className={clsx('notice', `notice-${colour}`)}>
    {children}

    <style jsx>
      {`
        .notice
          margin 1rem 0
          padding 1rem
          border-radius 0.25rem

          & :global(p)
            margin 0
            margin-bottom 0.25rem

            &:last-child
              margin-bottom 0

          &.notice-green
            background-color ${NOTICE_COLOURS.green.light}

          &.notice-orange
            background-color ${NOTICE_COLOURS.orange.light}

          &.notice-red
            background-color ${NOTICE_COLOURS.red.light}
      `}
    </style>
  </div>
)
