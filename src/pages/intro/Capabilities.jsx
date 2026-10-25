import ProjectList from '../../components/ProjectList'
import Flow from '../../components/Flow'
import Placeholder from '../../components/Placeholder'
import { capabilities } from '../../data/intro'

function CapabilitySection({ stage, isActive, continuous = false }) {
  const capability = capabilities[stage]
  const id = continuous && stage > 0 ? `page2-${stage}` : 'page2'
  const titleId = continuous ? `${id}-title` : 'capability-title'
  return (
    <section className="container_capabilities" id={id} data-snap-page data-stage={stage} aria-labelledby={titleId} inert={!continuous && !isActive}>
      <header aria-live={continuous ? undefined : 'polite'} aria-atomic={continuous ? undefined : true}>
        <p key={`subtitle-${stage}`} className="text_subtitle">저는 이런 역량을 가지고 있습니다.</p>
        <p key={stage} id={titleId} className="text_hero" role="heading" aria-level={2}>{capability.title}</p>
      </header>
      <div data-scroll-content tabIndex={continuous ? undefined : 0} aria-label={capability.label}>
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

export default function Capabilities({ stage, isActive, continuous }) {
  return continuous
    ? <>
      <div className="wrapper_panel_background" aria-hidden="true" />
      {capabilities.map((capability, index) => <CapabilitySection key={capability.label} stage={index} continuous />)}
    </>
    : <CapabilitySection stage={stage} isActive={isActive} />
}
