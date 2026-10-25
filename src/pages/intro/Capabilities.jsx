import ProjectList from '../../components/ProjectList'
import Flow from '../../components/Flow'
import Placeholder from '../../components/Placeholder'
import { capabilities } from '../../data/intro'

export default function Capabilities({ stage, isActive }) {
  const capability = capabilities[stage]
  return (
    <section className="container_capabilities" id="page2" data-snap-page data-stage={stage} aria-labelledby="capability-title" inert={!isActive}>
      <header aria-live="polite" aria-atomic="true">
        <p key={`subtitle-${stage}`} className="text_subtitle">저는 이런 역량을 가지고 있습니다.</p>
        <p key={stage} id="capability-title" className="text_hero" role="heading" aria-level={2}>{capability.title}</p>
      </header>
      <div data-scroll-content tabIndex={0} aria-label={capability.label}>
        <div key={stage} className="wrapper_capability_body">
          {capability.projects && <ProjectList projects={capability.projects} />}
          {capability.steps && <Flow items={capability.steps} />}
          {capability.heading && <p className="text_title" role="heading" aria-level={3}>{capability.heading}</p>}
          {capability.previews && (
            <div className="wrapper_previews">
              {capability.previews.map((preview) => preview.steps ? (
                <Flow key={preview.steps[0]} items={preview.steps} />
              ) : <Placeholder key={preview.label} label={preview.label} />)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
