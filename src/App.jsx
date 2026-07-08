import { useCallback, useEffect, useRef, useState } from 'react'
import './App.css'

const indexes = [
  {
    text: (
      <>
        퍼블하는 디자이너 <span className="frame-index__soft">한효찬입니다.</span>
      </>
    ),
    value: '퍼블하는 디자이너 한효찬입니다.',
    title: '화면을 구조로 옮기는 일을 합니다.',
    description:
      '디자인 의도를 읽고, 실제 브라우저에서 안정적으로 보이는 인터페이스를 만듭니다.',
    tags: ['React', 'Publishing', 'Responsive'],
  },
  {
    text: '주 사용 툴',
    value: '주 사용 툴',
    title: '작업에 맞는 도구를 빠르게 고릅니다.',
    description:
      'Figma로 구조를 확인하고, VS Code와 브라우저에서 바로 확인하며 퍼블리싱합니다.',
    tags: ['Figma', 'VS Code', 'Browser'],
  },
  {
    text: '디자인 시스템',
    value: '디자인 시스템',
    title: '반복되는 규칙을 시스템으로 정리합니다.',
    description:
      '색상, 간격, 컴포넌트 규칙을 명확하게 잡아 유지보수하기 쉬운 화면을 만듭니다.',
    tags: ['Token', 'Component', 'Guide'],
  },
]

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

function App() {
  const [activeIndex, setActiveIndex] = useState(0)
  const wheelLockRef = useRef(false)
  const touchStartRef = useRef(null)
  const activeContent = indexes[activeIndex]

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
    <main className="frame-page" aria-label="포트폴리오 인덱스">
      <ol className="frame-index" aria-label="섹션 인덱스">
        {indexes.map((item, index) => {
          const isActive = activeIndex === index
          const number = String(index + 1).padStart(2, '0')

          return (
            <li
              aria-current={isActive ? 'step' : undefined}
              className={`frame-index__item ${isActive ? 'is-active' : ''}`}
              key={item.value}
            >
              <span className="frame-index__number">{number}.</span>
              <span className="frame-index__label">{item.text}</span>
            </li>
          )
        })}
      </ol>

      <section className="frame-content" aria-live="polite">
        <span className="frame-content__eyebrow">
          {String(activeIndex + 1).padStart(2, '0')}
        </span>
        <span className="frame-content__title">{activeContent.title}</span>
        <span className="frame-content__description">
          {activeContent.description}
        </span>
        <span className="frame-content__tags">
          {activeContent.tags.map((tag) => (
            <span className="frame-content__tag" key={tag}>
              {tag}
            </span>
          ))}
        </span>
      </section>
    </main>
  )
}

export default App
