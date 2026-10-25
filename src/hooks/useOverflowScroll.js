import { useLayoutEffect, useRef } from 'react'

export default function useOverflowScroll(contentKey, enabled = true) {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const viewport = ref.current
    if (!enabled) {
      viewport.removeAttribute('data-overflowing')
      return
    }

    const content = viewport.firstElementChild
    let frame = 0
    const measure = () => {
      // Transforms and shadows must not turn a fitting layout into a scroll area.
      viewport.toggleAttribute('data-overflowing', content.offsetHeight > viewport.clientHeight + 1)
    }
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    })
    measure()
    observer.observe(viewport)
    observer.observe(content)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [contentKey, enabled])

  return ref
}
