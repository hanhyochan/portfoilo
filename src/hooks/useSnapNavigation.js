import { useCallback, useEffect, useRef, useState } from 'react'

const GESTURE_GAP = 180
const TRANSITION_LOCK = 650
const SWIPE_DISTANCE = 50

function scrollableContent(target, direction) {
  const content = target instanceof Element ? target.closest('[data-scroll-content]') : null
  if (!content) return null
  const remaining = content.scrollHeight - content.clientHeight - content.scrollTop
  return (direction > 0 ? remaining > 2 : content.scrollTop > 2) ? content : null
}

export default function useSnapNavigation({ stagedPage, stageCount }) {
  const viewportRef = useRef(null)
  const [stage, setStage] = useState(0)
  const current = useRef({ page: 0, stage: 0, lockedUntil: 0 })

  const move = useCallback((direction) => {
    const viewport = viewportRef.current
    if (!viewport || performance.now() < current.current.lockedUntil) return
    const position = current.current
    const pages = viewport.querySelectorAll('[data-snap-page]')
    const nextStage = position.stage + direction
    if (position.page === stagedPage && nextStage >= 0 && nextStage < stageCount) {
      position.stage = nextStage
      setStage(nextStage)
      pages[position.page].querySelectorAll('[data-scroll-content]').forEach((content) => { content.scrollTop = 0 })
    } else {
      const nextPage = Math.max(0, Math.min(pages.length - 1, position.page + direction))
      if (nextPage === position.page) return
      if (nextPage === stagedPage) {
        position.stage = direction > 0 ? 0 : stageCount - 1
        setStage(position.stage)
      }
      position.page = nextPage
      viewport.scrollTo({ top: nextPage * viewport.clientHeight,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
    }
    position.lockedUntil = performance.now() + TRANSITION_LOCK
  }, [stagedPage, stageCount])

  useEffect(() => {
    const viewport = viewportRef.current
    let lastWheel = 0
    let consumed = false
    let touch = null
    let frame = 0
    const onWheel = (event) => {
      if (event.ctrlKey || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return
      const now = performance.now()
      if (now - lastWheel > GESTURE_GAP) consumed = false
      lastWheel = now
      if (Math.abs(event.deltaY) < 2) return
      const direction = Math.sign(event.deltaY)
      if (scrollableContent(event.target, direction) && now >= current.current.lockedUntil) {
        consumed = true
        return
      }
      event.preventDefault()
      if (consumed || now < current.current.lockedUntil) return
      consumed = true
      move(direction)
    }
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.altKey || event.metaKey ||
        event.target.closest?.('input, textarea, select, [contenteditable="true"]')) return
      if (event.key === ' ' && event.target.closest?.('button, a')) return
      const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key) ? (event.shiftKey ? -1 : 1)
        : ['ArrowUp', 'PageUp'].includes(event.key) ? -1 : 0
      if (!direction) return
      event.preventDefault()
      if (event.repeat) return
      const page = viewport.querySelectorAll('[data-snap-page]')[current.current.page]
      const inner = page?.querySelector('[data-scroll-content]')
      const content = scrollableContent(inner, direction)
      if (content) content.scrollBy({ top: direction * content.clientHeight * 0.7, behavior: 'smooth' })
      else move(direction)
    }
    const onTouchStart = (event) => {
      if (event.touches.length !== 1) { touch = null; return }
      touch = { y: event.touches[0].clientY, x: event.touches[0].clientX, target: event.target, scrolled: false }
    }
    const onTouchMove = (event) => {
      if (!touch || event.touches.length !== 1) return
      const dy = touch.y - event.touches[0].clientY
      if (Math.abs(dy) < Math.abs(touch.x - event.touches[0].clientX)) return
      if (scrollableContent(touch.target, Math.sign(dy))) touch.scrolled = true
      else if (event.cancelable) event.preventDefault()
    }
    const onTouchEnd = (event) => {
      if (!touch) return
      const dy = touch.y - event.changedTouches[0].clientY
      const dx = touch.x - event.changedTouches[0].clientX
      if (!touch.scrolled && Math.abs(dy) > SWIPE_DISTANCE && Math.abs(dy) > Math.abs(dx)) move(Math.sign(dy))
      touch = null
    }
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        if (performance.now() >= current.current.lockedUntil) current.current.page = Math.round(viewport.scrollTop / viewport.clientHeight)
      })
    }
    const observer = new ResizeObserver(() => {
      viewport.scrollTo({ top: current.current.page * viewport.clientHeight, behavior: 'instant' })
    })
    observer.observe(viewport)
    viewport.addEventListener('wheel', onWheel, { passive: false })
    viewport.addEventListener('touchstart', onTouchStart, { passive: true })
    viewport.addEventListener('touchmove', onTouchMove, { passive: false })
    viewport.addEventListener('touchend', onTouchEnd)
    viewport.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
      viewport.removeEventListener('wheel', onWheel)
      viewport.removeEventListener('touchstart', onTouchStart)
      viewport.removeEventListener('touchmove', onTouchMove)
      viewport.removeEventListener('touchend', onTouchEnd)
      viewport.removeEventListener('scroll', onScroll)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [move])
  return { viewportRef, stage, move }
}
