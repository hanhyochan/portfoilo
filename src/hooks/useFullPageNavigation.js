import { useCallback, useEffect, useRef, useState } from 'react'

const INPUT_LOCK_DURATION = 700
const TOUCH_THRESHOLD = 44
const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function useFullPageNavigation({ page1StepCount, pageCount }) {
  const [activeStep, setActiveStep] = useState(0)
  const inputLockRef = useRef(false)
  const inputLockTimerRef = useRef(null)
  const touchStartRef = useRef(null)
  const lastStep = page1StepCount + pageCount - 2

  const moveStep = useCallback(
    (direction) => {
      if (inputLockRef.current) {
        return
      }

      inputLockRef.current = true
      setActiveStep((current) => clamp(current + direction, 0, lastStep))
      inputLockTimerRef.current = window.setTimeout(() => {
        inputLockRef.current = false
      }, INPUT_LOCK_DURATION)
    },
    [lastStep],
  )

  useEffect(() => {
    const handleWheel = (event) => {
      event.preventDefault()

      if (Math.abs(event.deltaY) < 1) {
        return
      }

      moveStep(event.deltaY > 0 ? 1 : -1)
    }

    const handleKeyDown = (event) => {
      if (event.repeat) {
        return
      }

      const isForwardKey =
        ['ArrowDown', 'PageDown'].includes(event.key) ||
        (event.key === ' ' && !event.shiftKey)
      const isBackwardKey =
        ['ArrowUp', 'PageUp'].includes(event.key) ||
        (event.key === ' ' && event.shiftKey)

      if (isForwardKey) {
        event.preventDefault()
        moveStep(1)
      }

      if (isBackwardKey) {
        event.preventDefault()
        moveStep(-1)
      }
    }

    const handleTouchStart = (event) => {
      touchStartRef.current = event.touches[0].clientY
    }

    const handleTouchEnd = (event) => {
      if (touchStartRef.current === null) {
        return
      }

      const distance = touchStartRef.current - event.changedTouches[0].clientY
      touchStartRef.current = null

      if (Math.abs(distance) >= TOUCH_THRESHOLD) {
        moveStep(distance > 0 ? 1 : -1)
      }
    }

    const handleTouchCancel = () => {
      touchStartRef.current = null
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchend', handleTouchEnd, { passive: true })
    window.addEventListener('touchcancel', handleTouchCancel)

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchCancel)
      window.clearTimeout(inputLockTimerRef.current)
    }
  }, [moveStep])

  return {
    activeIndex: Math.min(activeStep, page1StepCount - 1),
    activePage: Math.max(0, activeStep - page1StepCount + 1),
    activeStep,
  }
}

export default useFullPageNavigation
