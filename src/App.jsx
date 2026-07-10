import './App.scss'
import useFullPageNavigation from './hooks/useFullPageNavigation'
import Page1, { PAGE1_STEP_COUNT } from './pages/page1/Page1'
import Page2 from './pages/page2/Page2'
import Page3 from './pages/page3/Page3'
import Page4 from './pages/page4/Page4'

const PAGE_COUNT = 4

function App() {
  const { activeIndex, activePage, activeStep } = useFullPageNavigation({
    page1StepCount: PAGE1_STEP_COUNT,
    pageCount: PAGE_COUNT,
  })

  return (
    <main
      className="container_pages"
      data-page={activePage + 1}
      data-step={activeStep + 1}
      style={{ transform: `translate3d(0, -${activePage * 100}vh, 0)` }}
    >
      <Page1 activeIndex={activeIndex} isActive={activePage === 0} />
      <Page2 isActive={activePage === 1} />
      <Page3 isActive={activePage === 2} />
      <Page4 isActive={activePage === 3} />
    </main>
  )
}

export default App
