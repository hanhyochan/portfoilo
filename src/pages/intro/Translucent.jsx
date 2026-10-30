import CapabilityHeading from '../../components/CapabilityHeading'
import { capabilities } from '../../data/intro'

export default function Translucent({ isMobile }) {
  return (
    <section className="container_translucent" id="page2" data-region="2" aria-labelledby="translucent-title">
      <div className="wrapper_panel_background" aria-hidden="true" />
      <CapabilityHeading title={capabilities[0].title} titleId="translucent-title" isMobile={isMobile} />
    </section>
  )
}
