import { useCallback, useEffect, useRef, useState } from 'react'
import './App.scss'

const indexes = [
  {
    text: (
      <>
        퍼블하는 디자이너 <span className="text_index_soft">한효찬입니다.</span>
      </>
    ),
    value: '퍼블하는 디자이너 한효찬입니다.',
  },
  {
    text: '주 사용 툴',
    value: '주 사용 툴',
  },
  {
    text: '디자인 시스템',
    value: '디자인 시스템',
  },
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const wheelLockRef = useRef(false)
  const touchStartRef = useRef(null)

  const moveIndex = useCallback((direction) => {
    setActiveIndex((current) =>
      clamp(current + direction, 0, indexes.length - 1),
    )
  }, [])

  useEffect(() => {
    const releaseWheelLock = () => {
      window.setTimeout(() => {
        wheelLockRef.current = false
      }, 120)
    }

    const handleWheel = (event) => {
      event.preventDefault()

      if (wheelLockRef.current || Math.abs(event.deltaY) < 1) {
        return
      }

      wheelLockRef.current = true
      moveIndex(event.deltaY > 0 ? 1 : -1)
      releaseWheelLock()
    }

    const handleKeyDown = (event) => {
      if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
        event.preventDefault()
        moveIndex(1)
      }

      if (['ArrowUp', 'PageUp'].includes(event.key)) {
        event.preventDefault()
        moveIndex(-1)
      }
    }

    const handleTouchStart = (event) => {
      touchStartRef.current = event.touches[0].clientY
    }

    const handleTouchMove = (event) => {
      if (touchStartRef.current === null) {
        return
      }

      event.preventDefault()
      const distance = touchStartRef.current - event.touches[0].clientY

      if (Math.abs(distance) > 44 && !wheelLockRef.current) {
        wheelLockRef.current = true
        moveIndex(distance > 0 ? 1 : -1)
        touchStartRef.current = event.touches[0].clientY
        releaseWheelLock()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [moveIndex])

  return (
    <main className="container_index" aria-label="포트폴리오 인덱스">
      <ol className="wrapper_index" aria-label="섹션 인덱스">
        {indexes.map((item, index) => {
          const isActive = activeIndex === index
          const number = String(index + 1).padStart(2, '0')

          return (
            <li
              aria-current={isActive ? 'step' : undefined}
              className={`wrapper_index_item ${isActive ? 'is-active' : ''}`}
              key={item.value}
            >
              <span className="text_index_number">{number}.</span>
              <span className="text_index_label">{item.text}</span>
            </li>
          )
        })}
      </ol>
    </main>
  )
}

export default App
