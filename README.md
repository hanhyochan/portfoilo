# 한효찬 포트폴리오

React, Vite, SCSS 기반의 포트폴리오입니다. 프로젝트 디자인은 `design-system.md`를 기준으로 작성합니다.

## 실행

```bash
npm install
npm run dev
```

```bash
npm run lint
npm run build
```

## 소스 구조

- `src/App.jsx`: 페이지 구성
- `src/pages/page1`: 자기소개
- `src/pages/page2`: 핵심 역량 4단계, 프로젝트 데이터
- `src/components`: 프로젝트 목록, 기술 스택, 플로우, 이미지 영역
- `src/hooks/useSnapNavigation.js`: 휠·터치·키보드 스냅 이동 및 같은 위치의 단계 전환
- `src/styles/_variables.scss`: 모바일 기준 및 페이지 패딩
- `src/styles/_foundation.scss`: 전역 디자인 토큰
- `src/styles/_reset.scss`: 전역 초기화
- `src/styles/_utilities.scss`: 디자인 시스템 유틸리티
- `src/styles/_typography.scss`: 기존 타입 유틸을 재사용하는 텍스트 역할
- `src/styles/_portfolio.scss`: 전역 페이지 레이아웃 및 공통 컴포넌트
- `design-system.md`: 프로젝트 디자인 시스템 기준 문서

SCSS는 Foundation, Reset, Utilities, Typography, Portfolio 순서로 로드합니다. 페이지 SCSS에서는 CSS를 출력하지 않는 변수 모듈만 참조합니다.

같은 역할의 글자는 `text_hero`, `text_heading`, `text_title`, `text_body`, `text_label`, `text_caption`을 재사용합니다. 최소 폰트 크기는 `14px`, 본문은 `16px`, 히어로는 `32px`입니다. 크기·굵기·자간·행간을 페이지에서 개별 변경하지 않습니다.

각 화면은 `100dvh`이며, 핵심 역량 화면만 스크롤 위치를 유지한 채 4단계로 교체됩니다. 작은 화면에서는 긴 콘텐츠를 내부 스크롤로 모두 읽은 뒤 다음 단계로 이동합니다.

검증 환경은 Node.js `24.19.0`입니다. 이 PC의 기존 `24.4.1` 실행 파일은 프로덕션 빌드 중 네이티브 종료가 발생하므로 최신 24.x 환경에서 실행합니다. 프로젝트 기록·임시 파일·화면 검증 결과는 Git에서 제외한 `codex/`에 보관합니다.
