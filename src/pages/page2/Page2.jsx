import ProjectList from '../../components/ProjectList'
import TechStack from '../../components/TechStack'
import Flow from '../../components/Flow'
import Placeholder from '../../components/Placeholder'
import { capabilities } from './capabilities'
import './Page2.scss'

const accessibilityProjects = [
  { title: '국립박물관문화재단 웹 접근성품질마크(WA 인증마크) 2회 획득', date: '2026.06 ~ 2026.07', description: '웹 접근성 신청 및 오류사항 수정 및 전체 점검. 심사 점수 63점에서 100점으로 총 36점 상승' },
  { title: '인천시청 추정분담금 정보관리시스템 웹 접근성품질마크 1회 획득', date: '2025.12 ~ 2025.06', description: '웹 접근성 신청 및 오류사항 수정 및 전체 점검' },
]

function DesignSystem() {
  return (
    <div className="wrapper_system">
      <Flow items={['피그마로 디자인 시스템 작업', 'AI MCP 연결 및 공통 컴포넌트 퍼블리싱 구현', '시스템을 MD파일로 만들어 실무 디자인 시스템으로 적용']} />
      <div className="wrapper_previews">
        <Placeholder label="디자인 시스템 · 파운데이션" />
        <Placeholder label="디자인 시스템 · 컴포넌트" />
      </div>
    </div>
  )
}

function Accessibility() {
  return (
    <div className="wrapper_accessibility">
      <ProjectList projects={accessibilityProjects} />
      <h3 className="text_title">웹접근성 점검 프로그램 자체 개발 실무 적용 2회</h3>
      <div className="wrapper_previews">
        <Placeholder label="웹접근성 자체 검사기 캡처" />
        <Flow items={['웹접근성 심사기준 엠디파일 생성', '진행 프로젝트에 적용']} />
      </div>
    </div>
  )
}

export default function Page2({ stage }) {
  const capability = capabilities[stage]
  return (
    <section className="container_capabilities" data-snap-page data-stage={stage} aria-labelledby="capability-title">
      <header className="wrapper_section_heading">
        <p className="text_caption">저는 이런 역량을 가지고 있습니다.</p>
        <h2 id="capability-title" className="text_hero" aria-live="polite">{capability.title}</h2>
      </header>
      <div className="wrapper_scroll_content" data-scroll-content tabIndex={0} aria-label={capability.label}>
        {capability.projects ? (
          <div className="wrapper_capability_body">
            <ProjectList projects={capability.projects} />
            <TechStack groups={capability.stack} />
          </div>
        ) : stage === 2 ? <DesignSystem /> : <Accessibility />}
      </div>
      <footer className="wrapper_section_footer">
        <span className="text_caption">핵심 역량</span>
        <ol className="wrapper_progress" aria-label="핵심 역량 단계">
          {capabilities.map(({ label }, index) => (
            <li key={label} className={index === stage ? 'is-active' : undefined} aria-current={index === stage ? 'step' : undefined} aria-label={label}>
              <span className="text_caption">0{index + 1}</span>
            </li>
          ))}
        </ol>
      </footer>
    </section>
  )
}
