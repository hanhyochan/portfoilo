import useScrollNavigation from './hooks/useScrollNavigation'
import useMobileLayout from './hooks/useMobileLayout'
import Cover from './pages/intro/Cover'
import Translucent from './pages/intro/Translucent'
import Capabilities from './pages/intro/Capabilities'
import { pages } from './data/intro'
import PageNavigation from './components/PageNavigation'

function App() {
  const isMobile = useMobileLayout()
  const { viewportRef, capabilitiesRef, headerRef, sectionsRef, page, stage, pinned, coverInert, goToPage } = useScrollNavigation()

  return (
    <div className="container_portfolio">
      <main className="wrapper_pages" ref={viewportRef} tabIndex={0}>
        <Cover onNext={() => goToPage(1)} isCovered={coverInert} />
        <Translucent isMobile={isMobile} />
        <Capabilities
          stage={stage}
          pinned={pinned}
          isMobile={isMobile}
          panelRef={capabilitiesRef}
          headerRef={headerRef}
          sectionsRef={sectionsRef}
        />
      </main>
      <PageNavigation items={pages} activePage={page} onNavigate={goToPage} />
    </div>
  )
}

export default App
