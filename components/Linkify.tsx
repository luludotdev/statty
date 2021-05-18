import ReactLinkify from 'react-linkify-nofuzzy'
import type { FC } from 'react'

export const Linkify: FC = ({ children }) => (
  <ReactLinkify>
    {children}

    <style jsx global>
      {`
        a
          color hsl(208, 87%, 43%)
          text-decoration none

          &:hover
            text-decoration underline
      `}
    </style>
  </ReactLinkify>
)
