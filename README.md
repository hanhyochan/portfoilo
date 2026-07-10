# 한효찬 포트폴리오

React와 Vite로 구성한 풀페이지 포트폴리오입니다. 첫 페이지는 세 개의 내부 콘텐츠 단계를 거친 뒤 다음 페이지로 이동하며, 이후 페이지는 한 화면 단위로 전환됩니다.

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

- `src/hooks`: 휠, 키보드, 터치 입력과 페이지 상태 관리
- `src/pages/pageN`: 페이지별 JSX와 페이지 전용 SCSS
- `src/pages/page1/contents`: 첫 페이지의 단계별 콘텐츠
- `src/styles/_foundation.scss`: 전역 디자인 토큰
- `src/styles/_reset.scss`: 전역 초기화
- `src/styles/_utilities.scss`: 복사 가능한 단일 책임 유틸리티
- `src/App.scss`: 전체 페이지 셸과 공통 페이지 레이아웃

SCSS는 Foundation, Reset, Utilities, 공통 레이아웃, 페이지 전용 스타일 순서로 로드합니다. 모바일 기준은 `768px`이며 Reset 외에는 `margin`을 사용하지 않습니다.
