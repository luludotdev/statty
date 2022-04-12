import type { FC, PropsWithChildren } from 'react'
import ReactLinkify from 'react-linkify-nofuzzy'

export const Linkify: FC<PropsWithChildren<unknown>> = ({ children }) => (
  <ReactLinkify>
    {children}

    <style jsx global>
      {`
        a
          color hsl(208, 87%, 43%)
          text-decoration none

          :global(.dark) &
            color hsl(207, 100%, 72%)

          &:hover
            text-decoration underline
      `}
    </style>
  </ReactLinkify>
)
