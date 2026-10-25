import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'

const GESTURE_GAP = 180
const TRANSITION_LOCK = 760
const SWIPE_DISTANCE = 50
const EDGE_TOLERANCE = 1

function scrollBehavior() {
  return matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
}

function isPageRaised(viewport, pageIndex) {
  return Math.abs(viewport.scrollTop - pageIndex * viewport.clientHeight) <= EDGE_TOLERANCE
}

function scrollableContent(target, direction) {
  const content = target instanceof Element ? target.closest('[data-scroll-content]') : null
  if (!content?.hasAttribute('data-overflowing')) return null
  const remaining = content.scrollHeight - content.clientHeight - content.scrollTop
  return (direction > 0 ? remaining > 2 : content.scrollTop > 2) ? content : null
}

function contentTop(viewport, element) {
  return viewport.scrollTop + element.getBoundingClientRect().top - viewport.getBoundingClientRect().top
}

export default function useSnapNavigation({ stagedPage, stageCount, enabled = true }) {
  const viewportRef = useRef(null)
  const [page, setPage] = useState(0)
  const [stage, setStage] = useState(0)
  const [coverInert, setCoverInert] = useState(false)
  const current = useRef({ stage: 0, lockedUntil: 0 })
  const previousEnabled = useRef(enabled)

  useLayoutEffect(() => {
    if (previousEnabled.current === enabled) return
    const viewport = viewportRef.current
    const position = current.current
    if (viewport.scrollTop >= viewport.clientHeight - EDGE_TOLERANCE) {
      const section = viewport.querySelector(`[data-stage="${position.stage}"]`)
      viewport.scrollTo({
        top: enabled ? stagedPage * viewport.clientHeight : contentTop(viewport, section),
        behavior: 'instant',
      })
    }
    position.lockedUntil = 0
    previousEnabled.current = enabled
  }, [enabled, stagedPage])

  const goToPage = useCallback((pageIndex, nextStage = 0) => {
    const viewport = viewportRef.current
    if (!viewport) return
    const pages = viewport.querySelectorAll('[data-snap-page]')
    const nextPage = Math.max(0, Math.min(pages.length - 1, pageIndex))
    const position = current.current
    if (!pages[nextPage]) return
    const top = enabled || nextPage === 0 ? nextPage * viewport.clientHeight : contentTop(viewport, pages[nextPage])
    if (Math.abs(viewport.scrollTop - top) <= EDGE_TOLERANCE) return
    position.stage = nextPage === stagedPage ? nextStage : 0
    setStage(position.stage)
    pages[nextPage].querySelectorAll('[data-scroll-content]').forEach((content) => { content.scrollTop = 0 })
    position.lockedUntil = performance.now() + TRANSITION_LOCK
    if (!enabled) viewport.focus({ preventScroll: true })
    viewport.scrollTo({ top, behavior: scrollBehavior() })
  }, [enabled, stagedPage])

  const move = useCallback((direction) => {
    const viewport = viewportRef.current
    if (!viewport || performance.now() < current.current.lockedUntil) return
    if (!enabled) {
      if (viewport.scrollTop < stagedPage * viewport.clientHeight - EDGE_TOLERANCE) {
        goToPage(direction > 0 ? stagedPage : 0)
      } else if (direction < 0 && isPageRaised(viewport, stagedPage)) goToPage(0)
      return
    }
    const position = current.current
    const nextStage = position.stage + direction
    if (isPageRaised(viewport, stagedPage) && nextStage >= 0 && nextStage < stageCount) {
      const page = viewport.querySelectorAll('[data-snap-page]')[stagedPage]
      position.stage = nextStage
      setStage(nextStage)
      page.querySelectorAll('[data-scroll-content]').forEach((content) => { content.scrollTop = 0 })
      position.lockedUntil = performance.now() + TRANSITION_LOCK
    } else {
      const progress = viewport.scrollTop / viewport.clientHeight
      const tolerance = EDGE_TOLERANCE / viewport.clientHeight
      const nextPage = direction > 0 ? Math.floor(progress + tolerance) + 1 : Math.ceil(progress - tolerance) - 1
      goToPage(nextPage, direction > 0 ? 0 : stageCount - 1)
    }
  }, [enabled, stagedPage, stageCount, goToPage])

  useEffect(() => {
    const viewport = viewportRef.current
    let lastWheel = 0
    let consumed = false
    let snapped = false
    let touch = null
    let frame = 0
    let height = viewport.clientHeight
    let progress = viewport.scrollTop / height
    const isContinuousScroll = (direction, scrollTop = viewport.scrollTop) => !enabled &&
      (scrollTop > stagedPage * viewport.clientHeight + EDGE_TOLERANCE ||
        (direction > 0 && scrollTop >= stagedPage * viewport.clientHeight - EDGE_TOLERANCE))
    const onWheel = (event) => {
      if (event.ctrlKey || event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      const now = performance.now()
      if (now - lastWheel > GESTURE_GAP) {
        consumed = false
        snapped = false
      }
      lastWheel = now
      const direction = Math.sign(event.deltaY)
      // Consume the rest of a snap gesture so trackpad inertia cannot skip the first content.
      if (now < current.current.lockedUntil || snapped) {
        event.preventDefault()
        consumed = true
        snapped = true
        return
      }
      if (isContinuousScroll(direction)) return
      if (enabled && isPageRaised(viewport, stagedPage) && scrollableContent(event.target, direction)) {
        consumed = true
        return
      }
      event.preventDefault()
      if (consumed || Math.abs(event.deltaY) < 2) return
      consumed = true
      snapped = true
      move(direction)
    }
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.altKey || event.metaKey ||
        event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === ' ' && event.target.closest?.('button, a')) return
      const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? (event.shiftKey ? -1 : 1)
        : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0
      if (!direction) return
      if (performance.now() >= current.current.lockedUntil && isContinuousScroll(direction)) return
      event.preventDefault()
      if (event.repeat) return
      if (performance.now() < current.current.lockedUntil) return
      if (!enabled || !isPageRaised(viewport, stagedPage)) {
        move(direction)
        return
      }
      const page = viewport.querySelectorAll('[data-snap-page]')[stagedPage]
      const inner = page?.querySelector('[data-scroll-content]')
      const content = scrollableContent(inner, direction)
      if (content) content.scrollBy({ top: direction * content.clientHeight * 0.7, behavior: scrollBehavior() })
      else move(direction)
    }
    const onTouchStart = (event) => {
      if (event.touches.length !== 1) { touch = null; return }
      touch = { y: event.touches[0].clientY, x: event.touches[0].clientX, target: event.target,
        scrollTop: viewport.scrollTop, scrolled: false }
    }
    const onTouchMove = (event) => {
      if (event.touches.length !== 1) { touch = null; return }
      if (!touch) return
      const dy = touch.y - event.touches[0].clientY
      if (Math.abs(dy) < Math.abs(touch.x - event.touches[0].clientX)) {
        if (enabled && isPageRaised(viewport, stagedPage) && event.cancelable) event.preventDefault()
        return
      }
      if (performance.now() < current.current.lockedUntil) {
        touch.scrolled = true
        if (event.cancelable) event.preventDefault()
        return
      }
      if (touch.scrolled) return
      const direction = Math.sign(dy)
      if (isContinuousScroll(direction, touch.scrollTop) ||
        (enabled && isPageRaised(viewport, stagedPage) && scrollableContent(touch.target, direction))) {
        touch.scrolled = true
      } else if (event.cancelable) event.preventDefault()
    }
    const onTouchEnd = (event) => {
      if (!touch) return
      const dy = touch.y - event.changedTouches[0].clientY
      const dx = touch.x - event.changedTouches[0].clientX
      if (!touch.scrolled && Math.abs(dy) > SWIPE_DISTANCE && Math.abs(dy) > Math.abs(dx)) move(Math.sign(dy))
      touch = null
    }
    const onTouchCancel = () => { touch = null }
    const onScroll = () => {
      if (height === viewport.clientHeight) progress = viewport.scrollTop / height
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        const visiblePage = Math.floor((viewport.scrollTop + EDGE_TOLERANCE) / viewport.clientHeight)
        setPage(enabled ? visiblePage : Math.min(stagedPage, visiblePage))
        setCoverInert(viewport.scrollTop > EDGE_TOLERANCE)
        if (!enabled) {
          const midpoint = viewport.getBoundingClientRect().top + viewport.clientHeight / 2
          let visibleStage = 0
          viewport.querySelectorAll('[data-stage]').forEach((section) => {
            if (section.getBoundingClientRect().top <= midpoint) visibleStage = Number(section.dataset.stage)
          })
          current.current.stage = visibleStage
          setStage(visibleStage)
        }
      })
    }
    const observer = new ResizeObserver(() => {
      const nextHeight = viewport.clientHeight
      if (height !== nextHeight && nextHeight > 0) {
        height = nextHeight
        if (enabled) viewport.scrollTo({ top: progress * height, behavior: 'instant' })
      }
    })
    observer.observe(viewport)
    onScroll()
    viewport.addEventListener('wheel', onWheel, { passive: false })
    viewport.addEventListener('touchstart', onTouchStart, { passive: true })
    viewport.addEventListener('touchmove', onTouchMove, { passive: false })
    viewport.addEventListener('touchend', onTouchEnd)
    viewport.addEventListener('touchcancel', onTouchCancel)
    window.addEventListener('keydown', onKeyDown)
    viewport.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      viewport.removeEventListener('wheel', onWheel)
      viewport.removeEventListener('touchstart', onTouchStart)
      viewport.removeEventListener('touchmove', onTouchMove)
      viewport.removeEventListener('touchend', onTouchEnd)
      viewport.removeEventListener('touchcancel', onTouchCancel)
      viewport.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [enabled, move, stagedPage])
  return { viewportRef, page, stage, coverInert, move, goToPage }
}
