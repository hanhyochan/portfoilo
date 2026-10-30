import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import useRegionSnap from './useRegionSnap'

export default function useScrollNavigation() {
  const viewportRef = useRef(null)
  const capabilitiesRef = useRef(null)
  const headerRef = useRef(null)
  const sectionsRef = useRef(null)
  const snapLayoutRef = useRef(null)
  const [position, setPosition] = useState({ page: 0, stage: 0, pinned: false, coverInert: false })

  const snapToRegion = useRegionSnap(viewportRef, snapLayoutRef)

  useLayoutEffect(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })

    const viewport = viewportRef.current
    const capabilities = capabilitiesRef.current
    const header = headerRef.current
    const sections = sectionsRef.current
    const parts = [...sections.querySelectorAll('[data-stage]')]
    const regions = [...viewport.querySelectorAll(':scope > [data-region]')]
    const startTargets = parts.map(part =>
      part.querySelector(':scope > .wrapper_capability_body') ?? part
    )
    let frame = 0
    let disposed = false
    let layoutDirty = true
    let layout
    let previousPosition = null
    let previousClip = null
    let previousHeaderHeight = null

    const measureLayout = scrollTop => {
      const regionRects = regions.map(region => region.getBoundingClientRect())
      const regionStarts = regionRects.map(rect => rect.top + scrollTop)
      const sectionsRect = sections.getBoundingClientRect()
      const headerHeight = header.getBoundingClientRect().height
      const reservedHeight = header.parentElement.getBoundingClientRect().height
      const contentRects = startTargets.map(target => target.getBoundingClientRect())
      const endOffsets = parts.slice(0, -1).map(part =>
        part.querySelector('.wrapper_capability_body').getBoundingClientRect().bottom - sectionsRect.top
      )

      layout = {
        regionStarts,
        panelStart: regionStarts[regions.indexOf(capabilities)],
        // Account for the spacer update without forcing another layout read.
        sectionsStart: sectionsRect.top + scrollTop + headerHeight - reservedHeight,
        headerHeight,
        viewportHeight: window.innerHeight,
        // Include descriptions and steps before any project cards in the section.
        startOffsets: contentRects.map(rect => rect.top - sectionsRect.top),
      }
      const outerBounds = regionRects.map((rect, index) => ({
        start: regionStarts[index],
        end: regionStarts[index] + Math.max(0, rect.height - window.innerHeight),
      }))
      snapLayoutRef.current = {
        regions: outerBounds,
        contentExits: endOffsets.map((offset, index) => ({
          end: layout.sectionsStart - headerHeight + offset,
          nextStart: layout.sectionsStart - headerHeight + layout.startOffsets[index + 1],
        })),
        lineHeight: parseFloat(getComputedStyle(document.body).lineHeight) || 16,
      }
      layoutDirty = false

      if (headerHeight !== previousHeaderHeight) {
        capabilities.style.setProperty('--capability-header-height', `${headerHeight}px`)
        previousHeaderHeight = headerHeight
      }
    }
    const update = () => {
      frame = 0
      const scrollTop = window.scrollY
      if (layoutDirty) measureLayout(scrollTop)

      // Scrolling uses cached geometry; the full header bottom is the reading line.
      const contentTop = Math.max(scrollTop, layout.panelStart) + layout.headerHeight
      const clip = Math.max(0, contentTop - layout.sectionsStart)
      if (clip !== previousClip) {
        sections.style.setProperty('--capability-content-clip', `${clip}px`)
        previousClip = clip
      }
      let stage = 0
      layout.startOffsets.forEach((start, index) => {
        if (clip >= start) stage = index
      })

      let page = 0
      layout.regionStarts.forEach((start, index) => {
        if (start <= scrollTop + layout.viewportHeight / 2) page = index
      })
      const next = {
        page,
        stage,
        pinned: scrollTop >= layout.panelStart,
        coverInert: scrollTop >= layout.regionStarts[1] - 1,
      }
      if (!previousPosition || Object.keys(next).some(key => previousPosition[key] !== next[key])) {
        previousPosition = next
        setPosition(next)
      }
    }
    const schedule = () => {
      if (!disposed && !frame) frame = requestAnimationFrame(update)
    }
    const invalidateLayout = () => {
      layoutDirty = true
      schedule()
    }
    const observer = new ResizeObserver(invalidateLayout)
    for (const element of new Set([viewport, header, sections, ...regions, ...parts, ...startTargets])) observer.observe(element)
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', invalidateLayout)
    document.fonts.ready.then(invalidateLayout)
    update()

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', invalidateLayout)
    }
  }, [])

  const goToPage = useCallback(index => {
    viewportRef.current?.focus({ preventScroll: true })
    snapToRegion(index)
  }, [snapToRegion])

  return { viewportRef, capabilitiesRef, headerRef, sectionsRef, ...position, goToPage }
}
