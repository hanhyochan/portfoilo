import { useLayoutEffect } from 'react'

export default function useProjectCardLayout(containerRef) {
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const media = [...container.querySelectorAll('.wrapper_project_media')]
    const details = [...container.querySelectorAll('.wrapper_project_details')]
    if (!details.length) return

    let frame = 0
    let disposed = false
    const paddingHeight = style => parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
    const measure = () => {
      frame = 0
      // Keep every card's image split aligned to the tallest content.
      const detailsHeight = Math.ceil(Math.max(...details.map(element => {
        const style = getComputedStyle(element)
        const children = [...element.children].map(child => child.getBoundingClientRect())
        const contentHeight = Math.max(...children.map(rect => rect.bottom)) - Math.min(...children.map(rect => rect.top))
        return contentHeight + paddingHeight(style)
      })))
      const mediaMinHeight = Math.ceil(Math.max(...media.map(element =>
        (element.querySelector('h-content-tag')?.getBoundingClientRect().height ?? 0) + paddingHeight(getComputedStyle(element))
      )))

      for (const [property, height] of [
        ['--project-details-height', detailsHeight],
        ['--project-card-min-height', mediaMinHeight + detailsHeight],
      ]) {
        const value = `${height}px`
        if (container.style.getPropertyValue(property) !== value) container.style.setProperty(property, value)
      }
    }
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(measure)
    }
    const observer = new ResizeObserver(schedule)
    observer.observe(container)
    for (const element of [...media, ...details]) {
      for (const child of element.children) {
        if (child.tagName !== 'IMG') observer.observe(child)
      }
    }
    document.fonts.ready.then(schedule)
    measure()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      container.style.removeProperty('--project-details-height')
      container.style.removeProperty('--project-card-min-height')
    }
  }, [containerRef])
}
