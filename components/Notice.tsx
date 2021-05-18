import clsx from 'clsx'
import { FC } from 'react'
import { COLOUR_GREEN, COLOUR_ORANGE, COLOUR_RED } from '~constants'

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
            background-color ${COLOUR_GREEN}

          &.notice-orange
            background-color ${COLOUR_ORANGE}

          &.notice-red
            background-color ${COLOUR_RED}
      `}
    </style>
  </div>
)
