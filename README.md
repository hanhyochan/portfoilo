# 한효찬 포트폴리오

React, Vite, SCSS 기반의 포트폴리오입니다. 프로젝트 디자인은 `design-system.md`를 기준으로 작성합니다.

## 실행

Node.js `24.22.1` LTS를 권장합니다(`.nvmrc`). Vite 실행에는 `20.19.0` 이상인 20.x 또는 `22.12.0` 이상이 필요하며, `20.18.0`은 지원하지 않습니다.

Windows에서 nvm을 사용하는 경우 먼저 버전을 선택합니다.

```powershell
nvm install 24.22.1
nvm use 24.22.1
node --version
```

```bash
npm ci --include=optional
npm run dev
```

`Cannot find native binding` 또는 `@rolldown/binding-win32-x64-msvc` 오류가 나면 Node.js 버전을 먼저 확인하고 `npm ci --include=optional`로 다시 설치합니다. 잠금 파일에 기록된 버전을 유지하면서 현재 운영체제에 필요한 패키지를 복원합니다.

```bash
npm run lint
npm run build
```

## 소스 구조

- `src/App.jsx`: 표지·역량 패널·탐색 메뉴 구성
- `src/pages/intro`: 표지와 핵심 역량 패널
- `src/data/intro.js`: 인트로 프로젝트의 탐색 메뉴와 4단계 콘텐츠 데이터
- `public/imgs`: 표지 등 이미지 파일
- `public/icons`: 직접 제작하는 아이콘 파일
- `public/fonts`: 폰트 파일
- `src/components`: 탐색 메뉴, 프로젝트 목록, 플로우, 이미지 영역
- `src/hooks/useSnapNavigation.js`: 휠·터치·키보드 스냅 이동 및 같은 위치의 단계 전환
- `src/hooks/useMobileLayout.js`: Foundation의 모바일 기준을 공유하는 반응형 상태
- `src/style/index.scss`: 유일한 스타일 진입점
- `src/style/foundation.scss`: 등록된 색상·폰트 토큰, 공통 변수, 타이포그래피 역할과 공통 믹스인
- `src/style/reset.scss`: 브라우저 기본 스타일 초기화와 키보드 포커스
- `src/style/components.scss`: 공통 컴포넌트 스타일
- `src/style/intro.scss`: 인트로 프로젝트의 전체 레이아웃, 표지, 역량 패널과 모션
- `design-system.md`: 프로젝트 디자인 시스템 기준 문서

정적 에셋은 루트의 `public` 폴더에 보관합니다. 이미지·아이콘·폰트 경로는 `/imgs/cover.png`, `/icons/...`, `/fonts/...`처럼 참조합니다.

모든 SCSS는 `src/style`에 보관합니다. `main.jsx`에서 `style/index.scss`를 한 번만 불러오며, Reset → Foundation → Components → Intro 순서로 적용합니다. 컴포넌트 JSX에서는 별도로 SCSS를 불러오지 않습니다. Foundation을 여러 SCSS에서 참조해도 이 진입점 안에서는 한 번만 출력됩니다.

같은 역할의 글자는 `text_hero`, `text_title`, `text_subtitle`, `text_body`, `text_label`, `text_caption`을 재사용합니다. 최소 폰트 크기는 `14px`, 본문은 `16px`, 히어로는 `40px`입니다. 크기·굵기·자간·행간을 프로젝트 스타일에서 개별 변경하지 않습니다.

색상은 `foundation.scss`의 CSS 변수를 `color`, `background`, `border-color`에서 직접 참조합니다. 별도의 색상 유틸리티 클래스는 생성하지 않습니다. 새 색상은 `design-system.md`에 등록된 범위와 확장 절차를 따릅니다.

레이아웃은 웹과 모바일로만 구분하며, 모바일에는 1200px 이하의 태블릿 크기도 포함합니다. 탐색 메뉴와 역량별 문구·목록·플로우·미리보기는 `src/data/intro.js`에서 관리합니다. 앞으로 콘텐츠·메뉴·옵션 같은 정적 배열은 `src/data` 안에 프로젝트별로 모아 관리하고 필요한 곳에서 불러옵니다.

웹에서는 각 화면이 `100dvh`이며, 핵심 역량 화면은 스크롤 위치를 유지한 채 4단계로 교체됩니다. 화면 높이가 짧으면 긴 콘텐츠만 내부 스크롤됩니다. 모바일에서는 네 단계가 콘텐츠 높이에 맞춰 세로로 이어지고, 스냅 전환이나 패널 내부 스크롤 없이 일반 스크롤로 읽습니다. 반투명 배경은 표지 위로 올라온 뒤 고정되고 콘텐츠만 그 위로 스크롤됩니다. 모바일 화면 패딩은 `40px 20px`, 부제는 `18px`, 히어로 제목은 `32px`입니다.

패널의 스크롤 영역과 본문 래퍼는 각각 포커스·스크롤 유지와 등장 모션의 넘침 차단을 담당합니다. 이를 합치면 모션 시작 시 불필요한 스크롤이 다시 생길 수 있습니다.

프로젝트 기록·임시 파일·캐시·화면 검증 결과는 `D:\WORKS\한효찬_문서\pf\codex`에 보관합니다.
