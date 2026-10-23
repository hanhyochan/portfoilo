import './Page1.scss'

export default function Page1({ onNext }) {
  return (
    <section className="container_intro" id="page1" data-snap-page aria-labelledby="intro-title">
      <header>
        <span className="text_title">한효찬</span>
        <p className="text_caption">
          인천가톨릭대학교 시각디자인학과 졸업
          <a href="tel:01027604606">010-2760-4606</a>
          <a href="mailto:hcartist@naver.com">hcartist@naver.com</a>
        </p>
      </header>
      <h1 className="text_hero" id="intro-title">기획부터 디자인, 구현까지 함께합니다.</h1>
      <button onClick={onNext} aria-label="핵심 역량 보기" title="핵심 역량 보기">
        <span className="wrapper_scroll_mouse" aria-hidden="true"><span /></span>
      </button>
    </section>
  )
}
