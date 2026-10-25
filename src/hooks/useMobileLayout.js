import { useCallback, useState, useSyncExternalStore } from 'react'

export default function useMobileLayout() {
  const [media] = useState(() => {
    const width = getComputedStyle(document.documentElement).getPropertyValue('--breakpoint-mobile').trim()
    return window.matchMedia(`(max-width: ${width})`)
  })
  const subscribe = useCallback((notify) => {
    media.addEventListener('change', notify)
    return () => media.removeEventListener('change', notify)
  }, [media])

  return useSyncExternalStore(subscribe, () => media.matches)
}
