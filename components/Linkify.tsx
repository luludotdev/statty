import { FunctionComponent } from 'react'
import ReactLinkify from 'react-linkify-nofuzzy'

import '~styles/link.styl'

export const Linkify: FunctionComponent = ({ children }) => (
  <ReactLinkify>{children}</ReactLinkify>
)
