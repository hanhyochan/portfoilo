export const pages = [
  { id: 'page1', label: '1번' },
  { id: 'page2', label: '2번' },
  { id: 'page3', label: '3번' },
]

export const designSystemEnvironments = [
  {
    id: 'react',
    label: 'React',
    description: '패키지에서 React 컴포넌트를 불러와 사용.',
    code: `import '@h_designsystem/ui/styles.css';
import { Button } from '@h_designsystem/ui';

<Button size="medium" variant="filled" shape="square">
  컴포넌트
</Button>`,
  },
  {
    id: 'vue',
    label: 'Vue',
    description: '커스텀 요소를 등록하고 웹 컴포넌트로 사용.',
    code: `<script setup>
import '@h_designsystem/ui/elements/button';
import '@h_designsystem/ui/styles.css';
</script>

<template>
  <h-button size="medium" variant="filled" shape="square">
    컴포넌트
  </h-button>
</template>`,
    note: "Vue 빌드 설정: compilerOptions.isCustomElement: tag => tag.startsWith('h-')",
  },
  {
    id: 'svelte',
    label: 'Svelte',
    description: '버튼 요소를 불러오고 웹 컴포넌트로 사용.',
    code: `<script>
import '@h_designsystem/ui/elements/button';
import '@h_designsystem/ui/styles.css';
</script>

<h-button size="medium" variant="filled" shape="square">
  컴포넌트
</h-button>`,
  },
  {
    id: 'html-jsp',
    label: 'HTML / JSP',
    description: '빌드된 CSS·JS를 정적 파일로 연결.',
    code: `<link rel="stylesheet" href="./assets/h-designsystem/styles.css">

<h-button size="medium" variant="filled" shape="square">
  컴포넌트
</h-button>

<script type="module">
import './assets/h-designsystem/elements/button.js';
</script>`,
    note: 'JSP는 두 경로의 ./ 대신 ${pageContext.request.contextPath}/ 사용.',
  },
]

export const capabilities = [
  {
    title: '공공·기업 실무 기획 UIUX 디자인 및 JSP 퍼블리싱',
    label: '공공·기업 프로젝트',
    projects: [
      { title: '(재)예술경영지원센터 아트코리아랩 홈페이지 리뉴얼', tag: '홈페이지 리뉴얼', date: '2026.03 ~ 2026.10', roles: ['기획', '디자인', '퍼블리싱'] },
      { title: '국립박물관문화재단 홈페이지 유지보수', tag: '홈페이지 유지보수', date: '2025.04 ~', roles: ['디자인', '퍼블리싱'] },
      { title: '축산물품질평가원 돼지거래가격 홈페이지 구축', tag: '홈페이지 구축', date: '2025.12 ~ 2026.02', roles: ['디자인', '퍼블리싱'] },
      { title: '인천광역시 추정분담금 정보시스템 홈페이지 유지보수', tag: '홈페이지 유지보수', date: '2025.04 ~', roles: ['디자인', '퍼블리싱'] },
    ],
  },
  {
    title: 'React 실무 UI/UX 기획·디자인·퍼블리싱, Next.js 개인·팀',
    label: 'React · Next.js 프로젝트',
    projects: [
      { title: '(주)버츄얼드림 본사 홈페이지 리뉴얼', tag: '홈페이지 리뉴얼', date: '2026.07 ~ 2026.10', roles: ['기획', '디자인', '퍼블리싱'] },
      { title: '뉴스턴트 뉴스 앱(개인 프로젝트)', tag: '앱 구축', date: '2025.12 ~ 2025.06', roles: ['기획', '디자인', '퍼블리싱'] },
      { title: '디자인 구독 서비스 desub 사이트 구축', tag: '홈페이지 구축', date: '2025.01 ~ 2025.02', roles: ['퍼블리싱'] },
      { title: '채우다', tag: '홈페이지 구축', date: '2024.12 ~ 2025.01', roles: ['기획', '디자인', '퍼블리싱'] },
    ],
  },
  {
    title: '사내 디자인 시스템 구축, 설치형 UI 패키지 구현 및 실무 적용',
    label: '디자인 시스템',
    steps: ['토큰 기반 파운데이션·컴포넌트 연결.', '디자인 규격에 맞춘 웹 UI 구현.', '프로젝트에 설치 가능한 UI 패키지 구성.'],
    description: '디자인 시스템을 실무에서 바로 재사용할 수 있도록 설치형 패키지로 구축했습니다. 프로젝트마다 일관된 기준을 적용하고 반복 구현을 줄이기 위해, 기존에 정립한 토큰·파운데이션·컴포넌트를 미리 퍼블리싱해 제공했습니다.',
    applications: {
      title: '프로젝트 적용',
      items: [
        { project: '아트코리아랩 홈페이지', method: '설치형 업데이트 이전, MD 파일 디자인 규격 기준으로 UI 구현.' },
        { project: '버츄얼드림 홈페이지', method: '설치형 웹 컴포넌트 패키지를 설치해 공통 UI 적용.' },
        { project: '현재 포트폴리오', method: '설치형 웹 컴포넌트 패키지를 설치해 공통 UI 적용.' },
      ],
    },
    previews: [
      { environments: designSystemEnvironments, title: '환경별 적용 방식' },
      {
        project: {
          title: '설치형 디자인 시스템 UI 패키지',
          tag: 'UI 패키지 배포',
          date: '2026.04.22 ~',
          roles: ['기획', '디자인', '퍼블리싱'],
          image: '/imgs/design-system-storybook.png',
          imageAlt: '디자인 시스템 Storybook의 버튼 크기 및 상태별 예시',
        },
      },
    ],
  },
  {
    title: '웹접근성 인증 대응·검수, 자체 검사기 및 점검 기준 문서 제작',
    label: '웹접근성',
    projects: [
      { title: '국립박물관문화재단 웹 접근성품질마크(WA 인증마크) 2회 획득', tag: '웹접근성 인증', date: '2026.06 ~ 2026.07', roles: ['퍼블리싱'] },
      { title: '인천시청 추정분담금 정보관리시스템 웹 접근성품질마크 1회 획득', tag: '웹접근성 인증', date: '2025.12 ~ 2025.06', roles: ['퍼블리싱'] },
    ],
    heading: '웹접근성 점검 프로그램 자체 개발 실무 적용 2회',
    previews: [
      { label: '웹접근성 자체 검사기 캡처' },
      { steps: ['웹접근성 심사기준 엠디파일 생성', '진행 프로젝트에 적용'] },
    ],
  },
]
