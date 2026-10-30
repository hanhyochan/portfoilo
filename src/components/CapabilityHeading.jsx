export default function CapabilityHeading({ title, titleId, isMobile, headerRef }) {
  return (
    <div className="wrapper_capability_heading_space">
      <header className="wrapper_capability_heading" ref={headerRef} aria-live="polite" aria-atomic="true">
        <p className={isMobile ? 'h_designSystem-type-title_18_600' : 'h_designSystem-type-title_20_600'}>저는 이러한 경험을 가지고 있습니다.</p>
        <p key={title} id={titleId} className={isMobile ? 'h_designSystem-type-headline_32_600' : 'h_designSystem-type-display_40_600'} role="heading" aria-level={2}>{title}</p>
      </header>
    </div>
  )
}
