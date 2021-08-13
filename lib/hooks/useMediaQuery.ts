import { useEffect, useState } from 'react'
import { IS_SERVER } from '~env'

export const useMediaQuery = (query: string) =>
  // eslint-disable-next-line react-hooks/rules-of-hooks
  IS_SERVER ? false : useMediaQueryClient(query)

const useMediaQueryClient = (query: string) => {
  const mql = window.matchMedia(query)
  const [matches, setMatches] = useState(mql.matches)

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    mql.addEventListener('change', listener)

    return () => {
      mql.removeEventListener('change', listener)
    }
  }, [mql])

  return matches
}
