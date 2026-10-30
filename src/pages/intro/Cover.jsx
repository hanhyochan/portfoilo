export default function Cover({ onNext, isCovered }) {
  return (
    <section className="container_intro" id="page1" data-region="1" aria-labelledby="intro-title" inert={isCovered}>
      <header>
        <p className="h_designSystem-type-title_18_600" id="intro-title" role="heading" aria-level={1}>한효찬</p>
        <p className="h_designSystem-type-label_14_400">
          인천가톨릭대학교 시각디자인학과 졸업
          <a href="tel:01027604606">010-2760-4606</a>
          <a href="mailto:hcartist@naver.com">hcartist@naver.com</a>
        </p>
      </header>
      <button type="button" onClick={onNext} aria-label="2번 영역 보기" title="2번 영역 보기">
        <span aria-hidden="true" />
      </button>
    </section>
  )
}
