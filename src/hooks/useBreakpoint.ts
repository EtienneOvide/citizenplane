import { useMemo } from 'react'
import { useMediaQuery } from './useMediaQuery'

export const useBreakpoint = () => {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
  const isDesktop = useMediaQuery('(min-width: 1024px)')

  const isMobileDevice = useMemo(() => {
    if (typeof navigator === 'undefined') return false
    return /iPhone|Android/.test(navigator.userAgent)
  }, [])

  return {
    isMobile,
    isTablet,
    isDesktop,
    isMobileDevice,
  }
}
