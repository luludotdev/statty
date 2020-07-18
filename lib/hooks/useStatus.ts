import { useMemo } from 'react'
import { ITransformedData } from '~managers'
import { Status } from '~plugins/types'

export const useStatus = (stats: ITransformedData[]) => {
  const hasSevere = useMemo(() => {
    return stats.some(x => x.status === Status.Unreachable)
  }, [stats])

  const hasDegraded = useMemo(
    () => stats.some(x => x.status === Status.Degraded),
    [stats]
  )

  const hasUnknown = useMemo(
    () => stats.some(x => x.status === Status.Unknown),
    [stats]
  )

  const hasNone =
    hasSevere === false && hasDegraded === false && hasUnknown === false

  return { hasSevere, hasDegraded, hasUnknown, hasNone }
}
