import CapabilityHeading from '../../components/CapabilityHeading'
import ProjectList from '../../components/ProjectList'
import Flow from '../../components/Flow'
import Placeholder from '../../components/Placeholder'
import EnvironmentExamples from '../../components/EnvironmentExamples'
import useProjectCardLayout from '../../hooks/useProjectCardLayout'
import { capabilities } from '../../data/intro'

function CapabilitySection({ capability, stage }) {
  return (
    <section className="wrapper_capability_section" data-stage={stage} aria-label={capability.title}>
      <div className="wrapper_capability_body">
        {capability.projects && <ProjectList projects={capability.projects} />}
        {capability.description && <p className="h_designSystem-type-title_18_400">{capability.description}</p>}
        {capability.steps && <Flow items={capability.steps} />}
        {capability.heading && <p className="h_designSystem-type-title_18_600" role="heading" aria-level={3}>{capability.heading}</p>}
        {capability.previews && (
          <div className="wrapper_previews">
            {capability.previews.map((preview) => preview.steps ? (
              <Flow key={preview.steps[0]} items={preview.steps} />
            ) : preview.environments ? (
              <EnvironmentExamples key={preview.title} title={preview.title} environments={preview.environments} />
            ) : preview.project ? (
              <ProjectList key={preview.project.title} projects={[preview.project]} />
            ) : <Placeholder key={preview.label} label={preview.label} />)}
          </div>
        )}
      </div>
    </section>
  )
}

export default function Capabilities({ stage, pinned, isMobile, panelRef, headerRef, sectionsRef }) {
  useProjectCardLayout(sectionsRef)

  return (
    <section className="container_capabilities" id="page3" data-region="3" ref={panelRef} aria-labelledby="capability-title" data-header-fixed={pinned}>
      <CapabilityHeading title={capabilities[stage].title} titleId="capability-title" isMobile={isMobile} headerRef={headerRef} />
      <div className="wrapper_capability_sections" ref={sectionsRef}>
        {capabilities.map((capability, index) => <CapabilitySection key={capability.label} capability={capability} stage={index} />)}
      </div>
    </section>
  )
}
