import { FunctionComponent } from 'react'
import ReactLinkify from 'react-linkify-nofuzzy'

export const Linkify: FunctionComponent = ({ children }) => (
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
