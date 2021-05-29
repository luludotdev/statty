import {
  faExclamationCircle as iconDegraded,
  faCheckCircle as iconOperational,
  faQuestionCircle as iconUnknown,
  faTimesCircle as iconUnreachable,
} from '@fortawesome/free-solid-svg-icons'
import Head from 'next/head'
import { useMemo } from 'react'
import type { FC } from 'react'
import { ICON_COLOURS } from '~constants'
import { useStatus } from '~hooks/useStatus'
import type { TransformedData } from '~managers'
import { generateSVG } from '~utils/favicon'

const { red, green, orange, grey } = ICON_COLOURS
const ICON_OPERATIONAL = generateSVG(iconOperational, green.light, green.dark)
const ICON_DEGRADED = generateSVG(iconDegraded, orange.light, orange.dark)
const ICON_UNREACHABLE = generateSVG(iconUnreachable, red.light, red.dark)
const ICON_UNKNOWN = generateSVG(iconUnknown, grey.light, grey.dark)

interface Props {
  stats: TransformedData[]
}

export const Favicon: FC<Props> = ({ stats }) => {
  const { hasSevere, hasDegraded, hasUnknown } = useStatus(stats)
  const icon = useMemo(
    () =>
      hasSevere
        ? ICON_UNREACHABLE
        : hasUnknown
        ? ICON_UNKNOWN
        : hasDegraded
        ? ICON_DEGRADED
        : ICON_OPERATIONAL,
    [hasSevere, hasDegraded, hasUnknown]
  )

  return (
    <Head>
      <link rel='icon' href={icon} />
    </Head>
  )
}
