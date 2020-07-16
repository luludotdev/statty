import clsx from 'clsx'
import { FunctionComponent } from 'react'

import '~styles/notice.styl'

interface IProps {
  colour: 'green' | 'orange' | 'red'
}

export const Notice: FunctionComponent<IProps> = ({ colour, children }) => (
  <div className={clsx('notice', `notice-${colour}`)}>{children}</div>
)
