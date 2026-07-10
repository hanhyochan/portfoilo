import useFullPageNavigation from './hooks/useFullPageNavigation'
import Page1, { PAGE1_STEP_COUNT } from './pages/page1/Page1'
import Page2 from './pages/page2/Page2'
import Page3 from './pages/page3/Page3'
import Page4 from './pages/page4/Page4'

const standardPages = [Page2, Page3, Page4]
const PAGE_COUNT = standardPages.length + 1

function App() {
  const { activeIndex, activePage, activeStep } = useFullPageNavigation({
    page1StepCount: PAGE1_STEP_COUNT,
    pageCount: PAGE_COUNT,
  })

  return (
    <main
      className="page_portfolio"
      data-page={activePage + 1}
      data-step={activeStep + 1}
      style={{ '--page-offset': `${activePage * -100}%` }}
    >
      <Page1 activeIndex={activeIndex} isActive={activePage === 0} />
      {standardPages.map((PageComponent, index) => {
        const pageIndex = index + 1

        return (
          <PageComponent
            isActive={activePage === pageIndex}
            key={pageIndex}
          />
        )
      })}
    </main>
  )
}

export default App
