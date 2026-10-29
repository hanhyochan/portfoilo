# 한효찬 포트폴리오

React, Vite, SCSS 기반의 포트폴리오입니다. `@h_designsystem` 0.2.0 패키지의 토큰·Foundation·컴포넌트를 사용합니다.

## 실행

Node.js `24.22.2` LTS를 사용합니다(`.nvmrc`). 프로젝트의 지원 범위는 보안 수정이 포함된 `24.22.1` 이상 24.x이며, 개발 PC와 배포 빌드 환경에도 같은 기준을 적용합니다. [Node.js 보안 릴리스](https://nodejs.org/en/blog/release/v24.22.1/)

Windows에서 nvm을 사용하는 경우 먼저 버전을 선택합니다.

```powershell
nvm install 24.22.2
nvm use 24.22.2
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
- `src/hooks/useInView.js`: 화면 진입·이탈 감지와 재진입 시 등장 모션 재생
- `src/hooks/useOverflowScroll.js`: 모션·그림자를 제외한 실제 본문 높이에 따른 내부 스크롤 활성화
- `src/style/index.scss`: 유일한 스타일 진입점
- `src/style/foundation.scss`: 패키지 Foundation 연결과 프로젝트 글꼴·레이아웃
- `src/style/reset.scss`: 브라우저 기본 스타일 초기화와 키보드 포커스
- `src/style/components.scss`: 공통 컴포넌트 스타일
- `src/style/intro.scss`: 인트로 프로젝트의 전체 레이아웃, 표지, 역량 패널과 모션
- `vendor/h-designsystem`: 재설치에 필요한 Tokens·Foundation·UI 0.2.0 설치 파일
- `design-system.md`: 기존 규격 문서와 현재 패키지 적용 기준

정적 에셋은 루트의 `public` 폴더에 보관합니다. 이미지·아이콘·폰트 경로는 `/imgs/cover.png`, `/icons/...`, `/fonts/...`처럼 참조합니다.

모든 SCSS는 `src/style`에 보관합니다. `main.jsx`에서 `style/index.scss`를 한 번만 불러오며, Reset → Foundation → Components → Intro 순서로 적용합니다. 컴포넌트 JSX에서는 별도로 SCSS를 불러오지 않습니다. Foundation을 여러 SCSS에서 참조해도 이 진입점 안에서는 한 번만 출력됩니다.

글자는 `h_designSystem-type-*` 패키지 클래스를 HTML·JSX에서 직접 사용합니다. 패키지 규격에 별도의 `text_*` 별칭을 만들지 않습니다. 별도 클래스는 패키지에 없는 프로젝트 고유 구성이 필요할 때만 만듭니다. 최소 폰트 크기는 `14px`, 본문은 `16px`, 히어로는 `40px`입니다. 크기·굵기·자간·행간을 프로젝트 스타일에서 개별 변경하지 않습니다.

색상과 등록된 길이는 패키지의 `--h_designSystem-color-*`, `--h_designSystem-unit-*` 변수를 참조합니다. 사이트 기본 글자색의 `--color-text-primary`만 패키지 `text-primary`에 연결한 별칭으로 유지합니다. 별도의 색상 유틸리티나 토큰 값 복사본은 만들지 않습니다.

## 디자인 시스템 패키지 연결

`npm ci`는 저장소의 `vendor/h-designsystem` 설치 파일 3개를 사용합니다. 원본 디자인 시스템 폴더나 공개 npm 배포 없이 설치를 재현할 수 있습니다. 원본에서 새 설치 파일을 받으면 vendor 파일을 교체하고 세 패키지를 함께 재설치한 뒤 잠금 파일도 반영합니다.

```bash
npm install ./vendor/h-designsystem/h_designsystem-tokens-0.2.0.tgz ./vendor/h-designsystem/h_designsystem-foundation-0.2.0.tgz ./vendor/h-designsystem/h_designsystem-ui-0.2.0.tgz
```

- 스타일은 기존 `src/style/index.scss` 진입점을 유지합니다. Foundation의 공개 `base.css`가 Tokens·타이포그래피를 함께 불러옵니다.
- 본문 기본값은 `index.html`의 `body`에 `h_designSystem-type-body_16_400`을 직접 적용합니다. 각 글자도 `h_designSystem-type-display_40_600` 등의 패키지 클래스를 직접 사용합니다. `@extend` 별칭이나 글자 크기·굵기·행간 재정의 없이 기존 HTML과 접근성 연결을 유지합니다.
- 1200px 이하에서는 제목에 `h_designSystem-type-headline_32_600`, 부제에 `h_designSystem-type-title_18_600` 패키지 클래스를 선택합니다. 별도 태블릿 구간이나 패키지 자동 축소는 추가하지 않습니다.
- 프로젝트 분류 태그는 UI의 `ContentTag size="small"`을 사용합니다. 패딩·반경·타이포그래피는 패키지가 담당하고, 배경색만 공개 테마 변수로 기존 사이트 색에 연결합니다.
- 화살표·이미지 표시 아이콘은 Foundation의 `icon_arrow_up_right_1.svg`, `icon_picture_1.svg`를 사용합니다. 이전 Lucide 아이콘과 모양은 다릅니다.
- 패키지에 없는 스냅 내비게이션·스크롤 안내·카드 구성·배경 효과·그림자 형상·반응형 경계·폰트 파일은 프로젝트에서 유지합니다. 1px·2px·6px·10px·13px·180px·200px·240px·320px·1200px·1280px·1360px·9999px 등의 미등록 값도 유지합니다.
- CSS reset은 `reset` 레이어, 패키지는 `h_designSystem` 레이어를 사용합니다. 명시한 레이어 순서가 있어야 초기화 규칙이 패키지 타이포그래피를 덮지 않습니다.

2026-10-29 기준 Node `24.22.2`에서 검증했습니다. ESLint 의존성 `brace-expansion`은 `1.1.15`에서 `1.1.21`로 갱신했으며, 해당 시점의 `npm audit` 결과는 0건입니다. 이 결과는 Node 런타임이나 배포 서버 전체의 보안 검사를 대신하지 않습니다.

레이아웃은 웹과 모바일로만 구분하며, 모바일에는 1200px 이하의 태블릿 크기도 포함합니다. 탐색 메뉴와 역량별 문구·목록·플로우·미리보기는 `src/data/intro.js`에서 관리합니다. 앞으로 콘텐츠·메뉴·옵션 같은 정적 배열은 `src/data` 안에 프로젝트별로 모아 관리하고 필요한 곳에서 불러옵니다.

표지와 첫 패널 사이에서는 웹·모바일 모두 휠·스와이프 한 번으로 배경과 첫 콘텐츠가 함께 스냅 이동합니다. 웹에서는 각 화면이 `100dvh`이며, 핵심 역량 화면은 스크롤 위치를 유지한 채 4단계로 교체됩니다. 화면 높이가 짧으면 긴 콘텐츠만 내부 스크롤됩니다. 모바일에서는 패널에 진입한 뒤 네 단계가 콘텐츠 높이에 맞춰 세로로 이어지고, 단계별 스냅 전환이나 패널 내부 스크롤 없이 일반 스크롤로 읽습니다. 반투명 배경은 표지 위로 올라온 뒤 고정되고 콘텐츠만 그 위로 스크롤됩니다. 모바일 화면 패딩은 `40px 20px`, 부제는 `18px`, 히어로 제목은 `32px`입니다.

첫 번째를 포함한 모든 패널 콘텐츠는 스크롤 방향과 관계없이 화면에 다시 진입하거나 단계가 바뀔 때 기존의 아래에서 위로 올라오는 등장 모션을 재생합니다. 기기의 모션 줄이기 설정을 켠 경우에는 모션 없이 표시됩니다. 웹에서는 본문이 실제로 넘칠 때만 내부 스크롤을 켜고, 해당 스크롤 영역 안에 그림자 공간을 확보합니다. 모션의 이동 거리나 그림자는 높이 판정에서 제외하므로, 내용이 들어가는 화면에서는 그림자를 자르거나 임시 스크롤바를 만들지 않습니다.

프로젝트 기록·임시 파일·캐시·화면 검증 결과는 `D:\WORKS\한효찬_문서\pf\codex`에 보관합니다.
