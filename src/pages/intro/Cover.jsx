export default function Cover({ onNext, isCovered }) {
  return (
    <section className="container_intro" id="page1" data-snap-page aria-labelledby="intro-title" inert={isCovered}>
      <header>
        <p className="text_title" id="intro-title" role="heading" aria-level={1}>한효찬</p>
        <p className="text_caption">
          인천가톨릭대학교 시각디자인학과 졸업
          <a href="tel:01027604606">010-2760-4606</a>
          <a href="mailto:hcartist@naver.com">hcartist@naver.com</a>
        </p>
      </header>
      <button type="button" onClick={onNext} aria-label="핵심 역량 보기" title="핵심 역량 보기">
        <span aria-hidden="true" />
      </button>
    </section>
  )
}
