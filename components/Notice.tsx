import clsx from 'clsx'
import type { FC } from 'react'
import { NOTICE_COLOURS } from '~constants'

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

          :global(.dark) &
            color black

          & :global(p)
            margin 0
            margin-bottom 0.25rem

            &:last-child
              margin-bottom 0

          &.notice-green
            background-color ${NOTICE_COLOURS.green.light}

            :global(.dark) &
              background-color ${NOTICE_COLOURS.green.dark}

          &.notice-orange
            background-color ${NOTICE_COLOURS.orange.light}

            :global(.dark) &
              background-color ${NOTICE_COLOURS.orange.dark}

          &.notice-red
              background-color ${NOTICE_COLOURS.red.light}

            :global(.dark) &
              background-color ${NOTICE_COLOURS.red.dark}
      `}
    </style>
  </div>
)
