import { useCallback, useEffect, useRef } from 'react'

const GESTURE_GAP = 180
const TRANSITION_TIMEOUT = 1600
const SWIPE_DISTANCE = 50
const EDGE_TOLERANCE = 1

function regionBounds(container) {
  let top = window.scrollY + container.getBoundingClientRect().top
  return [...container.querySelectorAll(':scope > [data-region]')].map(element => {
    const height = element.getBoundingClientRect().height
    const bounds = { start: top, end: top + Math.max(0, height - window.innerHeight) }
    top += height
    return bounds
  })
}

function regionIndex(bounds, position) {
  let index = 0
  bounds.forEach((region, current) => {
    if (position >= region.start - EDGE_TOLERANCE) index = current
  })
  return index
}

function boundaryTarget(bounds, index, position, delta) {
  const current = bounds[index]
  if (delta > 0 && index < bounds.length - 1 && position + delta >= current.end - EDGE_TOLERANCE) {
    return { top: bounds[index + 1].start }
  }
  if (delta < 0 && index > 0 && position + delta <= current.start + EDGE_TOLERANCE) {
    return { top: bounds[index - 1].end }
  }
  return null
}

function contentExitTarget(exits, position, delta) {
  if (delta <= 0) return null
  const next = exits?.find(exit => position < exit.nextStart - EDGE_TOLERANCE && position + delta >= exit.end)
  return next ? { top: next.nextStart, instant: true } : null
}

export default function useRegionSnap(containerRef, layoutRef) {
  const transition = useRef({ target: null, until: 0 })
  const positionLock = useRef(null)
  const snapTo = useCallback(({ top, instant = false }) => {
    top = Math.ceil(top)
    const now = performance.now()
    const immediate = instant || matchMedia('(prefers-reduced-motion: reduce)').matches
    positionLock.current = immediate ? { top, until: now + GESTURE_GAP } : null
    transition.current = { target: immediate ? null : top, until: now + TRANSITION_TIMEOUT }
    window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
  }, [])

  useEffect(() => {
    const container = containerRef.current
    let lastWheel = 0
    let wheelConsumed = false
    let keyConsumed = false
    let touch = null
    let releasedTouch = null
    let wheelStart = 0
    let wheelDirection = 0
    const boundsNow = () => layoutRef.current?.regions ?? regionBounds(container)
    const isMoving = () => {
      const { target, until } = transition.current
      if (target === null) return false
      const now = performance.now()
      const arrived = Math.abs(window.scrollY - target) <= EDGE_TOLERANCE
      if (now >= until || arrived) {
        transition.current.target = null
        if (arrived) positionLock.current = { top: target, until: now + GESTURE_GAP }
        return false
      }
      return true
    }
    const targetFor = (delta, position = window.scrollY) => {
      const bounds = boundsNow()
      const region = boundaryTarget(bounds, regionIndex(bounds, position), position, delta)
      const content = contentExitTarget(layoutRef.current?.contentExits, position, delta)
      if (!region) return content
      return content && content.top < region.top ? content : region
    }
    const onWheel = event => {
      if (event.ctrlKey || event.deltaY === 0 || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      releasedTouch = null
      const now = performance.now()
      const moving = isMoving()
      if (now - lastWheel > GESTURE_GAP || Math.sign(event.deltaY) !== wheelDirection) {
        wheelConsumed = false
        wheelStart = window.scrollY
        positionLock.current = null
      }
      wheelDirection = Math.sign(event.deltaY)
      lastWheel = now
      // Absorb the gesture's remaining inertia after an automatic alignment.
      if (moving || wheelConsumed) {
        event.preventDefault()
        wheelConsumed = true
        if (positionLock.current) positionLock.current.until = now + GESTURE_GAP
        return
      }
      const unit = event.deltaMode === 1 ? (layoutRef.current?.lineHeight ?? 16) : event.deltaMode === 2 ? window.innerHeight : 1
      const target = targetFor(event.deltaY * unit)
      if (target === null) return
      event.preventDefault()
      wheelConsumed = true
      snapTo(target)
    }
    const onTouchStart = event => {
      releasedTouch = null
      lastWheel = 0
      positionLock.current = null
      touch = event.touches.length === 1 ? {
        x: event.touches[0].clientX, y: event.touches[0].clientY,
        startScroll: window.scrollY,
        direction: 0, native: false, snapped: false,
      } : null
    }
    const onTouchMove = event => {
      if (event.touches.length !== 1) { touch = null; return }
      if (!touch) return
      if (touch.snapped || isMoving()) {
        if (event.cancelable) event.preventDefault()
        return
      }
      const dy = touch.y - event.touches[0].clientY
      const dx = touch.x - event.touches[0].clientX
      if (!dy || Math.abs(dx) > Math.abs(dy)) return
      touch.direction = Math.sign(dy)
      if (touch.native) return
      const target = targetFor(touch.direction)
      if (target === null) { touch.native = true; return }
      if (event.cancelable) event.preventDefault()
      if (Math.abs(dy) > SWIPE_DISTANCE) {
        touch.snapped = true
        snapTo(target)
      }
    }
    const settleTouchBoundary = () => {
      if (!releasedTouch || isMoving()) return
      if (performance.now() > releasedTouch.until) { releasedTouch = null; return }
      const { direction, startScroll } = releasedTouch
      const delta = window.scrollY - startScroll
      const target = Math.sign(delta) === direction ? targetFor(delta, startScroll) : null
      if (target !== null) {
        releasedTouch = null
        snapTo(target)
      }
    }
    const onScroll = () => {
      const lock = positionLock.current
      if (lock) {
        if (performance.now() >= lock.until) positionLock.current = null
        else {
          // Force the landing coordinate while this input's remaining inertia drains.
          if (Math.abs(window.scrollY - lock.top) > EDGE_TOLERANCE) {
            lock.until = performance.now() + GESTURE_GAP
            window.scrollTo({ top: lock.top, behavior: 'instant' })
          }
          return
        }
      }
      if (isMoving() || positionLock.current) return
      // Catch combined wheel deltas applied by the browser in a single frame.
      if (!wheelConsumed && performance.now() - lastWheel <= GESTURE_GAP) {
        const delta = window.scrollY - wheelStart
        const target = Math.sign(delta) === wheelDirection ? targetFor(delta, wheelStart) : null
        if (target !== null) {
          wheelConsumed = true
          snapTo(target)
          return
        }
      }
      if (touch?.native) {
        const target = targetFor(window.scrollY - touch.startScroll, touch.startScroll)
        if (target !== null) {
          touch.native = false
          touch.snapped = true
          snapTo(target)
          return
        }
      }
      settleTouchBoundary()
    }
    const onTouchEnd = () => {
      // Native touch inertia may still reach a region boundary after release.
      if (touch?.native && touch.direction) releasedTouch = {
        direction: touch.direction, startScroll: touch.startScroll,
        until: performance.now() + TRANSITION_TIMEOUT,
      }
      touch = null
      settleTouchBoundary()
    }
    const onTouchCancel = () => { touch = null; releasedTouch = null }
    const onKeyDown = event => {
      if (event.ctrlKey || event.altKey || event.metaKey || event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === ' ' && event.target.closest?.('button, a')) return
      const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? (event.shiftKey ? -1 : 1)
        : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0
      if (!direction) return
      releasedTouch = null
      lastWheel = 0
      const moving = isMoving()
      if (!keyConsumed) positionLock.current = null
      if (moving || keyConsumed) { event.preventDefault(); return }
      const distance = event.key.startsWith('Arrow') ? 40 : window.innerHeight * 0.875
      const target = targetFor(direction * distance)
      if (target === null) return
      event.preventDefault()
      keyConsumed = true
      snapTo(target)
    }
    const onKeyUp = () => { keyConsumed = false }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd)
    window.addEventListener('touchcancel', onTouchCancel)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchCancel)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [containerRef, layoutRef, snapTo])

  return useCallback(index => {
    const bounds = layoutRef.current?.regions ?? regionBounds(containerRef.current)
    if (bounds[index]) snapTo({ top: bounds[index].start })
  }, [containerRef, layoutRef, snapTo])
}
