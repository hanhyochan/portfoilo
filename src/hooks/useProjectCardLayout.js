import { useLayoutEffect } from 'react'

export default function useProjectCardLayout(containerRef) {
  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    let media = []
    let details = []

    let frame = 0
    let disposed = false
    const paddingHeight = style => parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
    const measure = () => {
      frame = 0
      if (!details.length || !media.length) return
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
      if (!Number.isFinite(detailsHeight) || !Number.isFinite(mediaMinHeight)) return

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
    const observeCards = () => {
      media = [...container.querySelectorAll('.wrapper_project_media')]
      details = [...container.querySelectorAll('.wrapper_project_details')]
      observer.disconnect()
      observer.observe(container)
      for (const element of [...media, ...details]) {
        for (const child of element.children) {
          if (child.tagName !== 'IMG') observer.observe(child)
        }
      }
    }
    // React can replace card elements without remounting this container.
    const mutations = new MutationObserver(() => {
      observeCards()
      schedule()
    })
    mutations.observe(container, { childList: true, subtree: true })
    observeCards()
    document.fonts.ready.then(schedule)
    measure()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      mutations.disconnect()
      container.style.removeProperty('--project-details-height')
      container.style.removeProperty('--project-card-min-height')
    }
  }, [containerRef])
}
