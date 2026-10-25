export const pages = [
  { id: 'page1', label: '자기소개' },
  { id: 'page2', label: '핵심역량' },
]

export const capabilities = [
  {
    title: '공공·기업 실무 기획 UIUX 디자인 및 JSP 퍼블리싱',
    label: '공공·기업 프로젝트',
    projects: [
      { title: '(재)예술경영지원센터 아트코리아랩 홈페이지 리뉴얼', date: '2026.03 ~ 2026.10', description: 'CMS 접속자 통계 분석, 고객사 설문 기반 시안 검토, UIUX 기획 및 디자인, 퍼블리싱(1인담당)' },
      { title: '국립박물관문화재단 홈페이지 유지보수', date: '2025.04 ~', description: '메인화면 리뉴얼 퍼블리싱, CSS 오류 수정, UIUX 리디자인(1인담당)' },
      { title: '축산물품질평가원 돼지거래가격 홈페이지 구축', date: '2025.12 ~ 2026.02', description: 'UIUX 디자인, 퍼블리싱(1인담당)' },
      { title: '인천광역시 추정분담금 정보시스템 홈페이지 유지보수', date: '2025.04 ~', description: 'CSS 오류 수정, UIUX 리디자인(1인담당)' },
    ],
  },
  {
    title: 'React 실무 UI/UX 기획·디자인·퍼블리싱, Next.js 개인·팀',
    label: 'React · Next.js 프로젝트',
    projects: [
      { title: '(주)버츄얼드림 본사 홈페이지 리뉴얼', date: '2026.07 ~ 2026.10', description: '사용자 행동 데이터 분석, UX 개선 방향 도출, 홈페이지 리뉴얼 기획 및 UI/UX 디자인, 반응형 웹 퍼블리싱(1인 담당)' },
      { title: '뉴스턴트 뉴스 앱(개인 프로젝트)', date: '2025.12 ~ 2025.06', description: '서비스 기획, UIUX디자인, 프론트엔드 개발(1인 담당)' },
      { title: '디자인 구독 서비스 desub 사이트 구축', date: '2025.01 ~ 2025.02', description: '퍼블리싱, 프론트엔드 개발(4인담당)' },
      { title: '채우다', date: '2024.12 ~ 2025.01', description: '서비스 기획, UIUX 디자인, 프론트엔드 개발(3인담당)' },
    ],
  },
  {
    title: '사내 디자인 시스템 구축, 토큰·컴포넌트 코드화 및 실무 적용',
    label: '디자인 시스템',
    steps: ['피그마로 디자인 시스템 작업', 'AI MCP 연결 및 공통 컴포넌트 퍼블리싱 구현', '시스템을 MD파일로 만들어 실무 디자인 시스템으로 적용'],
    previews: [
      { label: '디자인 시스템 · 파운데이션' },
      { label: '디자인 시스템 · 컴포넌트' },
    ],
  },
  {
    title: '웹접근성 인증 대응·검수, 자체 검사기 및 점검 기준 문서 제작',
    label: '웹접근성',
    projects: [
      { title: '국립박물관문화재단 웹 접근성품질마크(WA 인증마크) 2회 획득', date: '2026.06 ~ 2026.07', description: '웹 접근성 신청 및 오류사항 수정 및 전체 점검. 심사 점수 63점에서 100점으로 총 36점 상승' },
      { title: '인천시청 추정분담금 정보관리시스템 웹 접근성품질마크 1회 획득', date: '2025.12 ~ 2025.06', description: '웹 접근성 신청 및 오류사항 수정 및 전체 점검' },
    ],
    heading: '웹접근성 점검 프로그램 자체 개발 실무 적용 2회',
    previews: [
      { label: '웹접근성 자체 검사기 캡처' },
      { steps: ['웹접근성 심사기준 엠디파일 생성', '진행 프로젝트에 적용'] },
    ],
  },
]

export const capabilityCount = capabilities.length
