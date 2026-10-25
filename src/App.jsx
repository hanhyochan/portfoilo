import useSnapNavigation from './hooks/useSnapNavigation'
import Cover from './pages/intro/Cover'
import Capabilities from './pages/intro/Capabilities'
import { capabilityCount, pages } from './data/intro'
import PageNavigation from './components/PageNavigation'

function App() {
  const { viewportRef, page, stage, coverInert, move, goToPage } = useSnapNavigation({ stagedPage: 1, stageCount: capabilityCount })

  return (
    <div className="container_portfolio">
      <main className="wrapper_pages" ref={viewportRef}>
        <Cover onNext={() => move(1)} isCovered={coverInert} />
        <Capabilities stage={stage} isActive={page === 1} />
      </main>
      <PageNavigation items={pages} activePage={page} onNavigate={goToPage} />
    </div>
  )
}

export default App
