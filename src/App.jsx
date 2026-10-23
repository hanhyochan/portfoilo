import useSnapNavigation from './hooks/useSnapNavigation'
import Page1 from './pages/page1/Page1'
import Page2 from './pages/page2/Page2'
import { capabilityCount } from './pages/page2/capabilities'
import PageNavigation from './components/PageNavigation'

const pages = [
  { id: 'page1', label: '자기소개' },
  { id: 'page2', label: '핵심역량' },
]

function App() {
  const { viewportRef, page, stage, move, goToPage } = useSnapNavigation({ stagedPage: 1, stageCount: capabilityCount })

  return (
    <div className="container_portfolio">
      <main className="wrapper_pages" ref={viewportRef}>
        <Page1 onNext={() => move(1)} />
        <Page2 stage={stage} />
      </main>
      <PageNavigation items={pages} activePage={page} onNavigate={goToPage} />
    </div>
  )
}

export default App
