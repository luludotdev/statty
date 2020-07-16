import { useEffect, useState } from 'react'

export const useMediaQuery = (query: string) => {
  const mql = window.matchMedia(query)
  const [matches, setMatches] = useState(mql.matches)

  useEffect(() => {
    const listener = (event: MediaQueryListEvent) => setMatches(event.matches)
    mql.addListener(listener)

    return () => mql.removeListener(listener)
  }, [mql])

  return matches
}
