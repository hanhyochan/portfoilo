import useSnapNavigation from './hooks/useSnapNavigation'
import Page1 from './pages/page1/Page1'
import Page2 from './pages/page2/Page2'
import { capabilityCount } from './pages/page2/capabilities'

function App() {
  const { viewportRef, stage, move } = useSnapNavigation({ stagedPage: 1, stageCount: capabilityCount })

  return (
    <main className="container_portfolio" ref={viewportRef}>
      <Page1 onNext={() => move(1)} />
      <Page2 stage={stage} />
    </main>
  )
}

export default App
