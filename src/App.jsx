import useSnapNavigation from './hooks/useSnapNavigation'
import useMobileLayout from './hooks/useMobileLayout'
import Cover from './pages/intro/Cover'
import Capabilities from './pages/intro/Capabilities'
import { capabilityCount, pages } from './data/intro'
import PageNavigation from './components/PageNavigation'

function App() {
  const isMobile = useMobileLayout()
  const { viewportRef, page, stage, coverInert, goToPage } = useSnapNavigation({ stagedPage: 1, stageCount: capabilityCount, enabled: !isMobile })

  return (
    <div className="container_portfolio">
      <main className="wrapper_pages" ref={viewportRef} tabIndex={isMobile ? 0 : undefined}>
        <Cover onNext={() => goToPage(1)} isCovered={coverInert} />
        <Capabilities stage={stage} isActive={page === 1} continuous={isMobile} />
      </main>
      <PageNavigation items={pages} activePage={page} onNavigate={goToPage} />
    </div>
  )
}

export default App
