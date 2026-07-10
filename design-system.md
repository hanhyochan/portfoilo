# 디자인 시스템 보일러플레이트

이 문서는 특정 폴더 구조나 프레임워크를 강제하지 않는다. 프로젝트를 시작하거나 기존 프로젝트의 CSS를 정리할 때, 이 문서 하나로 전역 Foundation, Reset, 유틸리티, 클래스명, 컴포넌트 작성 원칙을 동일하게 적용하는 것이 목적이다.

## 1. 적용 원칙

1. 먼저 프로젝트의 기존 Reset, 전역 CSS, 토큰, 컴포넌트, 유틸리티, JavaScript 셀렉터를 조사한다.
2. 기존 전역 규칙이 있으면 이 문서를 통째로 덮어쓰지 않고 충돌 항목을 비교한 후 필요한 항목만 병합한다.
3. 신규 프로젝트라면 Foundation 토큰을 먼저 선언하고 Reset, 컴포넌트, 레이아웃, 유틸리티 순으로 적용한다.
4. 모든 색상, 타이포그래피, 간격, 크기, 반경, 보더, 그림자, 모션 값은 Foundation 토큰에서 가져온다.
5. 토큰에 없는 값을 임의로 만들지 않는다. 새로운 값이 반드시 필요하면 먼저 Foundation 토큰으로 등록하고 대응 유틸리티를 만든다.
6. 신규 퍼블리싱 스타일에서는 `margin`을 사용하지 않는다. 이 문서의 Reset에 포함된 `margin: 0`만 예외다.
7. 요소 사이의 간격은 부모의 `gap`과 `padding`으로 처리한다.
8. 복사 가능한 CSS 예시는 완성형 단일 클래스로 제공할 수 있지만, 실제 프로젝트 내부 구현은 CSS Modules, SCSS, CSS-in-JS, 공통 컴포넌트 등 프로젝트 방식에 맞게 나눌 수 있다.
9. 구현 방식과 무관하게 최종 computed style, 접근성, 반응형 결과는 동일해야 한다.
10. Checkbox, Radio, Toggle의 외형은 Reset에서 지정하지 않고 프로젝트별 독립 컴포넌트로 설계한다.

## 2. 기존 프로젝트 적용 순서

- 활성 CSS와 템플릿 파일을 찾는다.
- 백업, vendor, 빌드 산출물은 활성 사용 근거가 없으면 기준에서 제외한다.
- 전체 클래스명과 사용처를 추출한다.
- `querySelector`, `querySelectorAll`, `closest`, `matches`, `classList` 사용처를 확인한다.
- 기존 클래스명에서 표준 클래스명으로 가는 매핑표를 만든다.
- Reset 중복, 토큰 중복, 유틸 중복, 미정의 CSS 변수를 확인한다.
- 클래스 변경은 CSS와 마크업, JavaScript, 테스트를 한 단위로 처리한다.
- 서버 배포본이나 별도 빌드 산출물이 있으면 소스와 같은 상태인지 확인한다.

## 3. 전역 Reset

아래 Reset은 신규 프로젝트의 기본값이다. 기존 Reset이 있는 프로젝트에서는 전체를 복사하지 말고 선택적으로 병합한다. Checkbox, Radio, Toggle의 appearance, 크기, 보더, 배경, 아이콘과 상태 스타일은 Reset에 포함하지 않는다.

```css
* {
    font-size: inherit;
    line-height: inherit;
    color: inherit;
    font-family: inherit;
    box-sizing: border-box;
}

html {
    font-size: var(--ds-font-size-body-1);
}
html,
body {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar {
    width: 0;
    height: 0;
}

body {
    margin: 0;
    font-family: 'Noto Sans KR', sans-serif;
    word-break: keep-all;
    color: var(--color-black);
    line-height: var(--ds-line-height-relaxed);
}

a {
    color: inherit;
    text-decoration: none;
}

img {
    display: block;
    max-width: 100%;
}

button,
input,
textarea,
select {
    font: inherit;
    color: inherit;
}

button {
    background: none;
    border: 0;
    cursor: pointer;
}

ul,
ol {
    margin: 0;
    padding: 0;
    list-style: none;
}

p,
h1,
h2,
h3,
h4,
h5,
h6 {
    margin: 0;
}
```

## 4. Foundation 토큰

### 4.1 토큰 종류

| 종류 | 역할 |
| --- | --- |
| Font | 기본 글꼴과 폰트 크기·굵기 |
| Atomic Color | 원시 색상 팔레트 |
| Semantic Color | 배경, 라벨, 라인, 상태 등 의미 기반 색상 |
| Opacity | 공통 불투명도 |
| Spacing | padding과 gap |
| Size | 컴포넌트와 아이콘의 고정 크기 |
| Radius | 모서리 반경 |
| Border | 보더 두께 |
| Shadow | 그림자 프리셋 |
| Viewport | 동적 화면 크기 |
| Container | 콘텐츠 최대 너비 |
| Focus | 키보드 포커스 링 |
| Motion | 지속 시간과 easing |
| Z-index | 레이어 순서 |

브랜드를 적용할 때 Atomic 팔레트를 직접 컴포넌트에 사용하지 말고 `--color-brand-primary`, `--color-brand-secondary`, `--color-brand-accent`, `--color-brand-on-primary`를 프로젝트 색상에 맞게 다시 매핑한다.

### 4.2 컬러 토큰 범위

- 기준 디자인 시스템의 Atomic Color와 Semantic Color 값을 빠짐없이 Foundation에 선언한다.
- 변수명에 특정 프로젝트명, 서비스명 또는 브랜드 접미사가 포함된 컬러 토큰은 공통 Foundation에서 제외한다.
- `--color-brand-primary`처럼 특정 브랜드명이 없는 역할 기반 별칭은 유지하며, 프로젝트 시작 시 Atomic Color에 다시 매핑한다.
- 컬러 토큰은 아래 전체 토큰 CSS의 `컬러 토큰` 블록에 실제 값으로 선언한다. 컴포넌트는 가능한 한 Semantic Color 또는 역할 기반 별칭을 사용한다.

현재 컬러 블록은 기준 디자인 시스템의 비브랜드 컬러 토큰 272개와 공통 역할 별칭 6개를 포함한다.

### 4.3 전체 토큰 CSS

```css
:root {
  /* 폰트 */
  --font-pretendard: 'Pretendard Variable';
  --font-sans: var(--font-pretendard, 'Pretendard Variable'), 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
  --font-size-10: 10px;
  --font-size-11: 11px;
  --font-size-115: 115px;
  --font-size-12: 12px;
  --font-size-13: 13px;
  --font-size-14: 14px;
  --font-size-15: 15px;
  --font-size-16: 16px;
  --font-size-18: 18px;
  --font-size-20: 20px;
  --font-size-24: 24px;
  --font-size-28: 28px;
  --font-size-32: 32px;
  --font-size-40: 40px;
  --font-size-48: 48px;
  --font-size-52: 52px;
  --font-size-60: 60px;
  --font-size-fixed-16: 16px;
  --font-size-fixed-18: 18px;
  --font-weight-300: 300;
  --font-weight-400: 400;
  --font-weight-500: 500;
  --font-weight-600: 600;
  --font-weight-700: 700;

  /* 컬러 토큰: Atomic Color, Semantic Color, 공통 역할 별칭 */
  --color-accent-background-cyan: #00bdde;
  --color-accent-background-light-blue: #00aeff;
  --color-accent-background-lime: #58cf04;
  --color-accent-background-pink: #f553da;
  --color-accent-background-purple: #cb59ff;
  --color-accent-background-red-orange: #ff5e00;
  --color-accent-background-violet: #6541f2;
  --color-accent-foreground-blue: #005eeb;
  --color-accent-foreground-cyan: #0098b2;
  --color-accent-foreground-green: #009632;
  --color-accent-foreground-light-blue: #008dcf;
  --color-accent-foreground-lime: #429e00;
  --color-accent-foreground-orange: #d17600;
  --color-accent-foreground-pink: #e846cd;
  --color-accent-foreground-purple: #ad36e3;
  --color-accent-foreground-red: #e52222;
  --color-accent-foreground-red-orange: #f55a00;
  --color-accent-foreground-violet: #5b37ed;
  --color-alpha-shadow1: rgb(0 0 0 / 5%);
  --color-alpha-shadow2: rgb(0 0 0 / 8%);
  --color-alpha-shadow3: rgb(0 0 0 / 12%);
  --color-alpha-shadow4: rgb(0 0 0 / 16%);
  --color-alpha-shadow5: rgb(0 0 0 / 18%);
  --color-background-elevated-alternative: #f7f7f8;
  --color-background-elevated-normal: #ffffff;
  --color-background-normal-alternative: #f7f7f8;
  --color-background-normal-normal: #ffffff;
  --color-background-transparent-alternative: rgb(255 255 255 / 28%);
  --color-background-transparent-normal: rgb(255 255 255 / 8%);
  --color-background-transparent-strong: rgb(255 255 255 / 16%);
  --color-black: var(--color-cool-neutral-17);
  --color-blue-0: #000000;
  --color-blue-10: #001536;
  --color-blue-100: #ffffff;
  --color-blue-20: #002966;
  --color-blue-30: #003e9c;
  --color-blue-40: #0054d1;
  --color-blue-45: #005eeb;
  --color-blue-50: #0066ff;
  --color-blue-55: #1a75ff;
  --color-blue-60: #3385ff;
  --color-blue-65: #4f95ff;
  --color-blue-70: #69a5ff;
  --color-blue-80: #9ec5ff;
  --color-blue-90: #c9defe;
  --color-blue-95: #eaf2fe;
  --color-blue-99: #f7fbff;
  --color-brand-accent: var(--color-purple-50);
  --color-brand-on-primary: var(--color-common-100);
  --color-brand-primary: var(--color-blue-50);
  --color-brand-secondary: var(--color-cyan-50);
  --color-common-0: var(--color-cool-neutral-15);
  --color-common-100: #ffffff;
  --color-cool-neutral-0: #000000;
  --color-cool-neutral-10: #171719;
  --color-cool-neutral-100: #ffffff;
  --color-cool-neutral-15: #1b1c1e;
  --color-cool-neutral-17: #212225;
  --color-cool-neutral-20: #292a2d;
  --color-cool-neutral-22: #2e2f33;
  --color-cool-neutral-23: #333438;
  --color-cool-neutral-25: #37383c;
  --color-cool-neutral-30: #46474c;
  --color-cool-neutral-40: #5a5c63;
  --color-cool-neutral-5: #0f0f10;
  --color-cool-neutral-50: #70737c;
  --color-cool-neutral-60: #878a93;
  --color-cool-neutral-7: #141415;
  --color-cool-neutral-70: #989ba2;
  --color-cool-neutral-80: #aeb0b6;
  --color-cool-neutral-90: #c2c4c8;
  --color-cool-neutral-95: #dbdcdf;
  --color-cool-neutral-96: #e1e2e4;
  --color-cool-neutral-97: #eaebec;
  --color-cool-neutral-98: #f4f4f5;
  --color-cool-neutral-99: #f7f7f8;
  --color-cyan-0: #000000;
  --color-cyan-10: #00252b;
  --color-cyan-100: #ffffff;
  --color-cyan-20: #004854;
  --color-cyan-30: #006f82;
  --color-cyan-40: #0098b2;
  --color-cyan-50: #00bdde;
  --color-cyan-60: #28d0ed;
  --color-cyan-70: #57dff7;
  --color-cyan-80: #8aedff;
  --color-cyan-90: #b5f4ff;
  --color-cyan-95: #defaff;
  --color-cyan-99: #f7feff;
  --color-fill-alternative: rgb(112 115 124 / 5%);
  --color-fill-normal: rgb(112 115 124 / 8%);
  --color-fill-strong: rgb(112 115 124 / 16%);
  --color-green-0: #000000;
  --color-green-10: #00240c;
  --color-green-100: #ffffff;
  --color-green-20: #004517;
  --color-green-30: #006e25;
  --color-green-40: #009632;
  --color-green-50: #00bf40;
  --color-green-60: #1ed45a;
  --color-green-70: #49e57d;
  --color-green-80: #7df5a5;
  --color-green-90: #acfcc7;
  --color-green-95: #d9ffe6;
  --color-green-99: #f2fff6;
  --color-interaction-disable: #f4f4f5;
  --color-interaction-inactive: #989ba2;
  --color-inverse-background: #1b1c1e;
  --color-inverse-label: #f7f7f8;
  --color-inverse-primary: #3385ff;
  --color-label-alternative: rgb(55 56 60 / 61%);
  --color-label-assistive: rgb(55 56 60 / 28%);
  --color-label-disable: rgb(55 56 60 / 16%);
  --color-label-neutral: rgb(46 47 51 / 88%);
  --color-label-normal: #171719;
  --color-label-strong: var(--color-common-0);
  --color-light-blue-0: #000000;
  --color-light-blue-10: #002130;
  --color-light-blue-100: #ffffff;
  --color-light-blue-20: #004261;
  --color-light-blue-30: #006796;
  --color-light-blue-40: #008dcf;
  --color-light-blue-50: #00aeff;
  --color-light-blue-60: #3dc2ff;
  --color-light-blue-70: #70d2ff;
  --color-light-blue-80: #a1e1ff;
  --color-light-blue-90: #c4ecfe;
  --color-light-blue-95: #e5f6fe;
  --color-light-blue-99: #f7fdff;
  --color-lime-0: #000000;
  --color-lime-10: #112900;
  --color-lime-100: #ffffff;
  --color-lime-20: #225200;
  --color-lime-30: #347d00;
  --color-lime-37: #429e00;
  --color-lime-40: #48ad00;
  --color-lime-50: #58cf04;
  --color-lime-60: #6be016;
  --color-lime-70: #88f03e;
  --color-lime-80: #aef779;
  --color-lime-90: #ccfca9;
  --color-lime-95: #e6ffd4;
  --color-lime-99: #f8fff2;
  --color-line-normal-alternative: rgb(112 115 124 / 8%);
  --color-line-normal-neutral: rgb(112 115 124 / 16%);
  --color-line-normal-normal: rgb(112 115 124 / 22%);
  --color-line-normal-strong: rgb(112 115 124 / 52%);
  --color-line-solid-0: #000000;
  --color-line-solid-10: #1a0f26;
  --color-line-solid-20: #34204c;
  --color-line-solid-alternative: #f4f4f5;
  --color-line-solid-neutral: #eaebec;
  --color-line-solid-normal: #e1e2e4;
  --color-line-solid-strong: #aeb0b6;
  --color-material-dimmer: rgb(23 23 25 / 52%);
  --color-neutral-0: var(--color-cool-neutral-15);
  --color-neutral-10: #171717;
  --color-neutral-100: #ffffff;
  --color-neutral-15: #1c1c1c;
  --color-neutral-20: #2a2a2a;
  --color-neutral-22: #303030;
  --color-neutral-30: #474747;
  --color-neutral-40: #5c5c5c;
  --color-neutral-5: #0f0f0f;
  --color-neutral-50: #737373;
  --color-neutral-60: #8a8a8a;
  --color-neutral-70: #9b9b9b;
  --color-neutral-80: #b0b0b0;
  --color-neutral-90: #c4c4c4;
  --color-neutral-95: #dcdcdc;
  --color-neutral-97: #f0f0f0;
  --color-neutral-99: #f7f7f7;
  --color-opacity-0: #000000;
  --color-opacity-0-2: #000000;
  --color-opacity-0-3: #000000;
  --color-opacity-0-4: #000000;
  --color-opacity-0-5: #000000;
  --color-opacity-0-6: #000000;
  --color-opacity-0-7: #000000;
  --color-orange-0: #000000;
  --color-orange-10: #361e00;
  --color-orange-100: #ffffff;
  --color-orange-20: #663a00;
  --color-orange-30: #9c5800;
  --color-orange-39: #d17600;
  --color-orange-40: #d47800;
  --color-orange-50: #ff9200;
  --color-orange-60: #ffa938;
  --color-orange-70: #ffc06e;
  --color-orange-80: #ffd49c;
  --color-orange-90: #fee6c6;
  --color-orange-95: #fef4e6;
  --color-orange-99: #fffcf7;
  --color-pink-0: #000000;
  --color-pink-10: #3d0133;
  --color-pink-100: #ffffff;
  --color-pink-20: #730560;
  --color-pink-30: #a81690;
  --color-pink-40: #d331b8;
  --color-pink-46: #e846cd;
  --color-pink-50: #f553da;
  --color-pink-60: #fa73e3;
  --color-pink-70: #ff94ed;
  --color-pink-80: #ffb8f3;
  --color-pink-90: #fed3f7;
  --color-pink-95: #feecfb;
  --color-pink-99: #fffafe;
  --color-purple-0: #000000;
  --color-purple-10: #290247;
  --color-purple-100: #ffffff;
  --color-purple-20: #580a7d;
  --color-purple-30: #861cb8;
  --color-purple-40: #ad36e3;
  --color-purple-50: #cb59ff;
  --color-purple-60: #d478ff;
  --color-purple-70: #de96ff;
  --color-purple-80: #e9baff;
  --color-purple-90: #f2d6ff;
  --color-purple-95: #f9edff;
  --color-purple-99: #fefbff;
  --color-red-0: #000000;
  --color-red-10: #3b0101;
  --color-red-100: #ffffff;
  --color-red-20: #730303;
  --color-red-30: #b00c0c;
  --color-red-40: #e52222;
  --color-red-50: #ff4242;
  --color-red-60: #ff6363;
  --color-red-70: #ff8c8c;
  --color-red-80: #ffb5b5;
  --color-red-90: #fed5d5;
  --color-red-95: #feecec;
  --color-red-99: #fffafa;
  --color-red-orange-0: #000000;
  --color-red-orange-10: #290f00;
  --color-red-orange-100: #ffffff;
  --color-red-orange-20: #592100;
  --color-red-orange-30: #913500;
  --color-red-orange-40: #c94a00;
  --color-red-orange-48: #f55a00;
  --color-red-orange-50: #ff5e00;
  --color-red-orange-60: #ff7b2e;
  --color-red-orange-70: #ff9b61;
  --color-red-orange-80: #ffbd96;
  --color-red-orange-90: #fed9c4;
  --color-red-orange-95: #feeee5;
  --color-red-orange-99: #fffaf7;
  --color-static-black: #000000;
  --color-static-white: #ffffff;
  --color-status-cautionary: #ff9200;
  --color-status-negative: #ff4242;
  --color-status-positive: #00bf40;
  --color-violet-0: #000000;
  --color-violet-10: #11024d;
  --color-violet-100: #ffffff;
  --color-violet-20: #23098f;
  --color-violet-30: #3a16c9;
  --color-violet-40: #4f29e5;
  --color-violet-45: #5b37ed;
  --color-violet-50: #6541f2;
  --color-violet-60: #7d5ef7;
  --color-violet-70: #9e86fc;
  --color-violet-80: #c0b0ff;
  --color-violet-90: #dbd3fe;
  --color-violet-95: #f0ecfe;
  --color-violet-99: #fbfaff;
  --color-white: var(--color-common-100);
  --color-yellow-0: #000000;
  --color-yellow-10: #666600;
  --color-yellow-100: #ffffff;
  --color-yellow-20: #999900;
  --color-yellow-30: #cccc00;
  --color-yellow-40: #e6e600;
  --color-yellow-50: #ffff00;
  --color-yellow-60: #ffff33;
  --color-yellow-70: #ffff66;
  --color-yellow-80: #ffff99;
  --color-yellow-90: #ffffcc;
  --ds-atomic-neutral-40: var(--color-neutral-40);
  --ds-atomic-neutral-90: var(--color-neutral-90);

  /* 불투명도 */
  --opacity-0: 0;
  --opacity-100: 100%;
  --opacity-12: 12%;
  --opacity-16: 16%;
  --opacity-22: 22%;
  --opacity-28: 28%;
  --opacity-35: 35%;
  --opacity-43: 43%;
  --opacity-5: 5%;
  --opacity-52: 52%;
  --opacity-61: 61%;
  --opacity-74: 74%;
  --opacity-8: 8%;
  --opacity-88: 88%;
  --opacity-97: 97%;

  /* 간격 */
  --spacing-0: 0;
  --spacing-gap-horizontal-16: 16px;
  --spacing-gap-horizontal-20: 20px;
  --spacing-gap-horizontal-24: 24px;
  --spacing-gap-horizontal-32: 32px;
  --spacing-gap-horizontal-4: 4px;
  --spacing-gap-horizontal-40: 40px;
  --spacing-gap-horizontal-60: 60px;
  --spacing-gap-horizontal-8: 8px;
  --spacing-gap-vertical-16: 16px;
  --spacing-gap-vertical-20: 20px;
  --spacing-gap-vertical-24: 24px;
  --spacing-gap-vertical-32: 32px;
  --spacing-gap-vertical-4: 4px;
  --spacing-gap-vertical-40: 40px;
  --spacing-gap-vertical-60: 60px;
  --spacing-gap-vertical-8: 8px;
  --spacing-padding-horizontal-12: 12px;
  --spacing-padding-horizontal-16: 16px;
  --spacing-padding-horizontal-24: 24px;
  --spacing-padding-horizontal-32: 32px;
  --spacing-padding-horizontal-4: 4px;
  --spacing-padding-horizontal-40: 40px;
  --spacing-padding-horizontal-60: 60px;
  --spacing-padding-horizontal-8: 8px;
  --spacing-padding-vertical-12: 12px;
  --spacing-padding-vertical-16: 16px;
  --spacing-padding-vertical-24: 24px;
  --spacing-padding-vertical-32: 32px;
  --spacing-padding-vertical-4: 4px;
  --spacing-padding-vertical-40: 40px;
  --spacing-padding-vertical-60: 60px;
  --spacing-padding-vertical-8: 8px;

  /* 크기 */
  --size-112: 112px;
  --size-20: 20px;
  --size-24: 24px;
  --size-32: 32px;
  --size-320: 320px;
  --size-36: 36px;
  --size-40: 40px;
  --size-44: 44px;
  --size-48: 48px;
  --size-52: 52px;
  --size-56: 56px;
  --size-60: 60px;
  --size-64: 64px;
  --size-72: 72px;

  /* 반경 */
  --radius-0: 0;
  --radius-16: 16px;
  --radius-2: 2px;
  --radius-20: 20px;
  --radius-24: 24px;
  --radius-32: 32px;
  --radius-4: 4px;
  --radius-40: 40px;
  --radius-8: 8px;
  --radius-full: 9999px;

  /* 보더 */
  --border-0-5: 0.5px;
  --border-1: 1px;
  --border-2: 2px;
  --border-3: 3px;
  --focus-ring-width: 2px;

  /* 그림자 */
  --shadow-1: 0 1px 2px 0 var(--color-alpha-shadow1, rgba(0, 0, 0, 0.05));
  --shadow-2: 0 0 2px 0 var(--color-alpha-shadow1, rgba(0, 0, 0, 0.05)), 0 4px 8px 0 var(--color-alpha-shadow2, rgba(0, 0, 0, 0.08));
  --shadow-3: 0 0 2px 0 var(--color-alpha-shadow2, rgba(0, 0, 0, 0.08)), 0 8px 16px 0 var(--color-alpha-shadow3, rgba(0, 0, 0, 0.12));
  --shadow-4: 0 0 2px 0 var(--color-alpha-shadow2, rgba(0, 0, 0, 0.08)), 0 16px 24px 0 var(--color-alpha-shadow3, rgba(0, 0, 0, 0.12));

  /* 행간 */
  --ds-line-height-relaxed: 1.5;
  --line-height-13: 13px;
  --line-height-16: 16px;
  --line-height-20: 20px;
  --line-height-24: 24px;
  --line-height-26: 26px;
  --line-height-32: 32px;
  --line-height-40: 40px;
  --line-height-44: 44px;
  --line-height-48: 48px;
  --line-height-60: 60px;
  --line-height-72: 72px;
  --line-height-90: 90px;
  --line-height-fixed-20: 20px;
  --line-height-fixed-26: 26px;

  /* 뷰포트 */
  --viewport-height: 100dvh;
  --viewport-width: 100vw;

  /* 컨테이너 */
  --container-large: 1024px;
  --container-medium: 768px;
  --container-small: 360px;
  --container-xlarge: 1240px;

  /* 포커스 */
  --focus-ring-color: var(--color-blue-50);

  /* 모션 */
  --motion-duration-fast: 160ms;
  --motion-duration-normal: 240ms;
  --motion-duration-slow: 320ms;
  --motion-easing-standard: cubic-bezier(0.2, 0, 0, 1);

  /* 레이어 */
  --z-base: 0;
  --z-dropdown: 200;
  --z-modal: 400;
  --z-overlay: 300;
  --z-sticky: 100;
  --z-toast: 500;

  /* 기타 */
  --app-border: var(--color-cool-neutral-96);
  --app-control-surface: var(--color-common-100);
  --app-input-border: var(--color-line-normal-normal);
  --app-input-surface: var(--color-background-elevated-normal);
  --app-input-text: var(--color-label-normal);
  --app-surface: var(--color-common-100);
  --app-surface-muted: var(--color-cool-neutral-98);
  --app-text: var(--color-cool-neutral-15);
  --app-text-muted: var(--color-cool-neutral-50);
  --ds-font-size-body-1: var(--font-size-16);

}
```

### 4.4 타이포그래피 조합 클래스

폰트 크기 토큰은 작은 값부터 큰 값까지 모두 제공하되, 문서에 표시할 때는 큰 크기부터 정렬한다. 같은 크기라도 font-family, font-weight, line-height 조합이 다르면 별도 조합 클래스로 둘 수 있다.

```css
/* typography: display */
.type-display_1 {
  font-size: var(--font-size-60);
  font-weight: var(--font-weight-400);
  line-height: var(--line-height-90);
}

.type-display_2 {
  font-size: var(--font-size-48);
  font-weight: var(--font-weight-500);
  line-height: var(--line-height-60);
}

.type-display_3 {
  font-size: var(--font-size-40);
  font-weight: var(--font-weight-400);
  line-height: var(--line-height-60);
}

/* typography: headline */
.type-headline_1 {
  font-size: var(--font-size-32);
  font-weight: var(--font-weight-400);
  line-height: var(--line-height-48);
}

.type-headline_2 {
  font-size: var(--font-size-28);
  font-weight: var(--font-weight-500);
  line-height: var(--line-height-40);
}

.type-headline_3 {
  font-size: var(--font-size-24);
  font-weight: var(--font-weight-400);
  line-height: var(--line-height-40);
}

/* typography: title */
.type-title_1 {
  font-size: var(--font-size-20);
  font-weight: var(--font-weight-500);
  line-height: var(--line-height-40);
}

.type-title_2 {
  font-size: var(--font-size-18);
  font-weight: var(--font-weight-600);
  line-height: var(--line-height-26);
}

/* typography: body */
.type-body_1 {
  font-size: var(--font-size-16);
  font-weight: var(--font-weight-400);
  line-height: var(--line-height-24);
}

.type-body_2 {
  font-size: var(--font-size-15);
  font-weight: var(--font-weight-400);
  line-height: var(--line-height-20);
}

/* typography: label */
.type-label_1 {
  font-size: var(--font-size-14);
  font-weight: var(--font-weight-500);
  line-height: var(--line-height-20);
}

/* typography: meta */
.type-meta_1 {
  font-size: var(--font-size-13);
  font-weight: var(--font-weight-400);
  line-height: var(--line-height-13);
}

/* typography: caption */
.type-caption_1 {
  font-size: var(--font-size-12);
  font-weight: var(--font-weight-500);
  line-height: var(--line-height-20);
}

.type-caption_2 {
  font-size: var(--font-size-11);
  font-weight: var(--font-weight-500);
  line-height: var(--line-height-20);
}

.type-caption_3 {
  font-size: var(--font-size-10);
  font-weight: var(--font-weight-500);
  line-height: var(--line-height-16);
}
```

### 4.5 폰트 로딩

- `--font-sans`에 선언한 글꼴은 프로젝트의 실제 전역 진입점에서 먼저 로드한다.
- `@font-face`, 프레임워크 폰트 로더, CDN 중 프로젝트 환경에 맞는 방식을 선택한다.
- 가변 폰트는 지원하는 weight 범위를 정확히 선언하고, 정적 폰트는 파일과 일치하는 weight만 매핑한다.
- 폰트 파일 경로, CORS, preload, `font-display`를 빌드 결과에서 확인한다.
- 폰트 로드 실패 시에도 한글이 깨지지 않도록 시스템 폰트 fallback을 유지한다.

### 4.6 아이콘과 이미지

- 아이콘 크기는 `--size-*` 토큰과 `.size_*`, `.w_*`, `.h_*` 유틸리티를 사용한다.
- 단색 아이콘은 `currentColor`를 사용해 텍스트 색상 토큰을 상속할 수 있게 한다.
- 장식 아이콘은 `aria-hidden="true"`, 의미가 있는 아이콘은 대체 텍스트나 접근 가능한 이름을 제공한다.
- 외부 SVG의 내부 색상이 필요한 경우 `img`, 색상 상속이 필요하면 inline SVG 또는 mask 방식을 선택한다.
- 아이콘과 이미지의 실제 경로가 개발 서버, 빌드 결과, 정적 배포 환경에서 모두 유효한지 확인한다.

## 5. 토큰 대응 유틸리티

Foundation의 공개 토큰에는 실제 CSS 속성에 연결되는 유틸리티가 있어야 한다. 색상 토큰은 글자색, 배경색, 보더색 유틸을 제공하고, 간격 토큰은 padding과 gap, 타이포그래피 토큰은 font-size·font-weight·line-height, 장식 토큰은 radius·border·shadow 유틸을 제공한다.

유틸리티는 문맥상 필요한 한두 속성을 보조하는 용도다. 버튼 높이, 폰트, padding, radius처럼 컴포넌트 정체성을 만드는 필수 속성을 여러 유틸 조합에만 의존시키지 않는다.

### 5.1 전체 토큰 유틸리티 CSS

```css
.bg_accent_background_cyan { background-color: var(--color-accent-background-cyan); }
.bg_accent_background_light_blue { background-color: var(--color-accent-background-light-blue); }
.bg_accent_background_lime { background-color: var(--color-accent-background-lime); }
.bg_accent_background_pink { background-color: var(--color-accent-background-pink); }
.bg_accent_background_purple { background-color: var(--color-accent-background-purple); }
.bg_accent_background_red_orange { background-color: var(--color-accent-background-red-orange); }
.bg_accent_background_violet { background-color: var(--color-accent-background-violet); }
.bg_accent_foreground_blue { background-color: var(--color-accent-foreground-blue); }
.bg_accent_foreground_cyan { background-color: var(--color-accent-foreground-cyan); }
.bg_accent_foreground_green { background-color: var(--color-accent-foreground-green); }
.bg_accent_foreground_light_blue { background-color: var(--color-accent-foreground-light-blue); }
.bg_accent_foreground_lime { background-color: var(--color-accent-foreground-lime); }
.bg_accent_foreground_orange { background-color: var(--color-accent-foreground-orange); }
.bg_accent_foreground_pink { background-color: var(--color-accent-foreground-pink); }
.bg_accent_foreground_purple { background-color: var(--color-accent-foreground-purple); }
.bg_accent_foreground_red { background-color: var(--color-accent-foreground-red); }
.bg_accent_foreground_red_orange { background-color: var(--color-accent-foreground-red-orange); }
.bg_accent_foreground_violet { background-color: var(--color-accent-foreground-violet); }
.bg_alpha_shadow1 { background-color: var(--color-alpha-shadow1); }
.bg_alpha_shadow2 { background-color: var(--color-alpha-shadow2); }
.bg_alpha_shadow3 { background-color: var(--color-alpha-shadow3); }
.bg_alpha_shadow4 { background-color: var(--color-alpha-shadow4); }
.bg_alpha_shadow5 { background-color: var(--color-alpha-shadow5); }
.bg_app_border { background-color: var(--app-border); }
.bg_app_control_surface { background-color: var(--app-control-surface); }
.bg_app_input_border { background-color: var(--app-input-border); }
.bg_app_input_surface { background-color: var(--app-input-surface); }
.bg_app_input_text { background-color: var(--app-input-text); }
.bg_app_surface { background-color: var(--app-surface); }
.bg_app_surface_muted { background-color: var(--app-surface-muted); }
.bg_app_text { background-color: var(--app-text); }
.bg_app_text_muted { background-color: var(--app-text-muted); }
.bg_background_elevated_alternative { background-color: var(--color-background-elevated-alternative); }
.bg_background_elevated_normal { background-color: var(--color-background-elevated-normal); }
.bg_background_normal_alternative { background-color: var(--color-background-normal-alternative); }
.bg_background_normal_normal { background-color: var(--color-background-normal-normal); }
.bg_background_transparent_alternative { background-color: var(--color-background-transparent-alternative); }
.bg_background_transparent_normal { background-color: var(--color-background-transparent-normal); }
.bg_background_transparent_strong { background-color: var(--color-background-transparent-strong); }
.bg_black { background-color: var(--color-black); }
.bg_blue_0 { background-color: var(--color-blue-0); }
.bg_blue_10 { background-color: var(--color-blue-10); }
.bg_blue_100 { background-color: var(--color-blue-100); }
.bg_blue_20 { background-color: var(--color-blue-20); }
.bg_blue_30 { background-color: var(--color-blue-30); }
.bg_blue_40 { background-color: var(--color-blue-40); }
.bg_blue_45 { background-color: var(--color-blue-45); }
.bg_blue_50 { background-color: var(--color-blue-50); }
.bg_blue_55 { background-color: var(--color-blue-55); }
.bg_blue_60 { background-color: var(--color-blue-60); }
.bg_blue_65 { background-color: var(--color-blue-65); }
.bg_blue_70 { background-color: var(--color-blue-70); }
.bg_blue_80 { background-color: var(--color-blue-80); }
.bg_blue_90 { background-color: var(--color-blue-90); }
.bg_blue_95 { background-color: var(--color-blue-95); }
.bg_blue_99 { background-color: var(--color-blue-99); }
.bg_brand_accent { background-color: var(--color-brand-accent); }
.bg_brand_on_primary { background-color: var(--color-brand-on-primary); }
.bg_brand_primary { background-color: var(--color-brand-primary); }
.bg_brand_secondary { background-color: var(--color-brand-secondary); }
.bg_common_0 { background-color: var(--color-common-0); }
.bg_common_100 { background-color: var(--color-common-100); }
.bg_cool_neutral_0 { background-color: var(--color-cool-neutral-0); }
.bg_cool_neutral_10 { background-color: var(--color-cool-neutral-10); }
.bg_cool_neutral_100 { background-color: var(--color-cool-neutral-100); }
.bg_cool_neutral_15 { background-color: var(--color-cool-neutral-15); }
.bg_cool_neutral_17 { background-color: var(--color-cool-neutral-17); }
.bg_cool_neutral_20 { background-color: var(--color-cool-neutral-20); }
.bg_cool_neutral_22 { background-color: var(--color-cool-neutral-22); }
.bg_cool_neutral_23 { background-color: var(--color-cool-neutral-23); }
.bg_cool_neutral_25 { background-color: var(--color-cool-neutral-25); }
.bg_cool_neutral_30 { background-color: var(--color-cool-neutral-30); }
.bg_cool_neutral_40 { background-color: var(--color-cool-neutral-40); }
.bg_cool_neutral_5 { background-color: var(--color-cool-neutral-5); }
.bg_cool_neutral_50 { background-color: var(--color-cool-neutral-50); }
.bg_cool_neutral_60 { background-color: var(--color-cool-neutral-60); }
.bg_cool_neutral_7 { background-color: var(--color-cool-neutral-7); }
.bg_cool_neutral_70 { background-color: var(--color-cool-neutral-70); }
.bg_cool_neutral_80 { background-color: var(--color-cool-neutral-80); }
.bg_cool_neutral_90 { background-color: var(--color-cool-neutral-90); }
.bg_cool_neutral_95 { background-color: var(--color-cool-neutral-95); }
.bg_cool_neutral_96 { background-color: var(--color-cool-neutral-96); }
.bg_cool_neutral_97 { background-color: var(--color-cool-neutral-97); }
.bg_cool_neutral_98 { background-color: var(--color-cool-neutral-98); }
.bg_cool_neutral_99 { background-color: var(--color-cool-neutral-99); }
.bg_cyan_0 { background-color: var(--color-cyan-0); }
.bg_cyan_10 { background-color: var(--color-cyan-10); }
.bg_cyan_100 { background-color: var(--color-cyan-100); }
.bg_cyan_20 { background-color: var(--color-cyan-20); }
.bg_cyan_30 { background-color: var(--color-cyan-30); }
.bg_cyan_40 { background-color: var(--color-cyan-40); }
.bg_cyan_50 { background-color: var(--color-cyan-50); }
.bg_cyan_60 { background-color: var(--color-cyan-60); }
.bg_cyan_70 { background-color: var(--color-cyan-70); }
.bg_cyan_80 { background-color: var(--color-cyan-80); }
.bg_cyan_90 { background-color: var(--color-cyan-90); }
.bg_cyan_95 { background-color: var(--color-cyan-95); }
.bg_cyan_99 { background-color: var(--color-cyan-99); }
.bg_ds_atomic_neutral_40 { background-color: var(--ds-atomic-neutral-40); }
.bg_ds_atomic_neutral_90 { background-color: var(--ds-atomic-neutral-90); }
.bg_fill_alternative { background-color: var(--color-fill-alternative); }
.bg_fill_normal { background-color: var(--color-fill-normal); }
.bg_fill_strong { background-color: var(--color-fill-strong); }
.bg_green_0 { background-color: var(--color-green-0); }
.bg_green_10 { background-color: var(--color-green-10); }
.bg_green_100 { background-color: var(--color-green-100); }
.bg_green_20 { background-color: var(--color-green-20); }
.bg_green_30 { background-color: var(--color-green-30); }
.bg_green_40 { background-color: var(--color-green-40); }
.bg_green_50 { background-color: var(--color-green-50); }
.bg_green_60 { background-color: var(--color-green-60); }
.bg_green_70 { background-color: var(--color-green-70); }
.bg_green_80 { background-color: var(--color-green-80); }
.bg_green_90 { background-color: var(--color-green-90); }
.bg_green_95 { background-color: var(--color-green-95); }
.bg_green_99 { background-color: var(--color-green-99); }
.bg_interaction_disable { background-color: var(--color-interaction-disable); }
.bg_interaction_inactive { background-color: var(--color-interaction-inactive); }
.bg_inverse_background { background-color: var(--color-inverse-background); }
.bg_inverse_label { background-color: var(--color-inverse-label); }
.bg_inverse_primary { background-color: var(--color-inverse-primary); }
.bg_label_alternative { background-color: var(--color-label-alternative); }
.bg_label_assistive { background-color: var(--color-label-assistive); }
.bg_label_disable { background-color: var(--color-label-disable); }
.bg_label_neutral { background-color: var(--color-label-neutral); }
.bg_label_normal { background-color: var(--color-label-normal); }
.bg_label_strong { background-color: var(--color-label-strong); }
.bg_light_blue_0 { background-color: var(--color-light-blue-0); }
.bg_light_blue_10 { background-color: var(--color-light-blue-10); }
.bg_light_blue_100 { background-color: var(--color-light-blue-100); }
.bg_light_blue_20 { background-color: var(--color-light-blue-20); }
.bg_light_blue_30 { background-color: var(--color-light-blue-30); }
.bg_light_blue_40 { background-color: var(--color-light-blue-40); }
.bg_light_blue_50 { background-color: var(--color-light-blue-50); }
.bg_light_blue_60 { background-color: var(--color-light-blue-60); }
.bg_light_blue_70 { background-color: var(--color-light-blue-70); }
.bg_light_blue_80 { background-color: var(--color-light-blue-80); }
.bg_light_blue_90 { background-color: var(--color-light-blue-90); }
.bg_light_blue_95 { background-color: var(--color-light-blue-95); }
.bg_light_blue_99 { background-color: var(--color-light-blue-99); }
.bg_lime_0 { background-color: var(--color-lime-0); }
.bg_lime_10 { background-color: var(--color-lime-10); }
.bg_lime_100 { background-color: var(--color-lime-100); }
.bg_lime_20 { background-color: var(--color-lime-20); }
.bg_lime_30 { background-color: var(--color-lime-30); }
.bg_lime_37 { background-color: var(--color-lime-37); }
.bg_lime_40 { background-color: var(--color-lime-40); }
.bg_lime_50 { background-color: var(--color-lime-50); }
.bg_lime_60 { background-color: var(--color-lime-60); }
.bg_lime_70 { background-color: var(--color-lime-70); }
.bg_lime_80 { background-color: var(--color-lime-80); }
.bg_lime_90 { background-color: var(--color-lime-90); }
.bg_lime_95 { background-color: var(--color-lime-95); }
.bg_lime_99 { background-color: var(--color-lime-99); }
.bg_line_normal_alternative { background-color: var(--color-line-normal-alternative); }
.bg_line_normal_neutral { background-color: var(--color-line-normal-neutral); }
.bg_line_normal_normal { background-color: var(--color-line-normal-normal); }
.bg_line_normal_strong { background-color: var(--color-line-normal-strong); }
.bg_line_solid_0 { background-color: var(--color-line-solid-0); }
.bg_line_solid_10 { background-color: var(--color-line-solid-10); }
.bg_line_solid_20 { background-color: var(--color-line-solid-20); }
.bg_line_solid_alternative { background-color: var(--color-line-solid-alternative); }
.bg_line_solid_neutral { background-color: var(--color-line-solid-neutral); }
.bg_line_solid_normal { background-color: var(--color-line-solid-normal); }
.bg_line_solid_strong { background-color: var(--color-line-solid-strong); }
.bg_material_dimmer { background-color: var(--color-material-dimmer); }
.bg_neutral_0 { background-color: var(--color-neutral-0); }
.bg_neutral_10 { background-color: var(--color-neutral-10); }
.bg_neutral_100 { background-color: var(--color-neutral-100); }
.bg_neutral_15 { background-color: var(--color-neutral-15); }
.bg_neutral_20 { background-color: var(--color-neutral-20); }
.bg_neutral_22 { background-color: var(--color-neutral-22); }
.bg_neutral_30 { background-color: var(--color-neutral-30); }
.bg_neutral_40 { background-color: var(--color-neutral-40); }
.bg_neutral_5 { background-color: var(--color-neutral-5); }
.bg_neutral_50 { background-color: var(--color-neutral-50); }
.bg_neutral_60 { background-color: var(--color-neutral-60); }
.bg_neutral_70 { background-color: var(--color-neutral-70); }
.bg_neutral_80 { background-color: var(--color-neutral-80); }
.bg_neutral_90 { background-color: var(--color-neutral-90); }
.bg_neutral_95 { background-color: var(--color-neutral-95); }
.bg_neutral_97 { background-color: var(--color-neutral-97); }
.bg_neutral_99 { background-color: var(--color-neutral-99); }
.bg_opacity_0 { background-color: var(--color-opacity-0); }
.bg_opacity_0_2 { background-color: var(--color-opacity-0-2); }
.bg_opacity_0_3 { background-color: var(--color-opacity-0-3); }
.bg_opacity_0_4 { background-color: var(--color-opacity-0-4); }
.bg_opacity_0_5 { background-color: var(--color-opacity-0-5); }
.bg_opacity_0_6 { background-color: var(--color-opacity-0-6); }
.bg_opacity_0_7 { background-color: var(--color-opacity-0-7); }
.bg_orange_0 { background-color: var(--color-orange-0); }
.bg_orange_10 { background-color: var(--color-orange-10); }
.bg_orange_100 { background-color: var(--color-orange-100); }
.bg_orange_20 { background-color: var(--color-orange-20); }
.bg_orange_30 { background-color: var(--color-orange-30); }
.bg_orange_39 { background-color: var(--color-orange-39); }
.bg_orange_40 { background-color: var(--color-orange-40); }
.bg_orange_50 { background-color: var(--color-orange-50); }
.bg_orange_60 { background-color: var(--color-orange-60); }
.bg_orange_70 { background-color: var(--color-orange-70); }
.bg_orange_80 { background-color: var(--color-orange-80); }
.bg_orange_90 { background-color: var(--color-orange-90); }
.bg_orange_95 { background-color: var(--color-orange-95); }
.bg_orange_99 { background-color: var(--color-orange-99); }
.bg_pink_0 { background-color: var(--color-pink-0); }
.bg_pink_10 { background-color: var(--color-pink-10); }
.bg_pink_100 { background-color: var(--color-pink-100); }
.bg_pink_20 { background-color: var(--color-pink-20); }
.bg_pink_30 { background-color: var(--color-pink-30); }
.bg_pink_40 { background-color: var(--color-pink-40); }
.bg_pink_46 { background-color: var(--color-pink-46); }
.bg_pink_50 { background-color: var(--color-pink-50); }
.bg_pink_60 { background-color: var(--color-pink-60); }
.bg_pink_70 { background-color: var(--color-pink-70); }
.bg_pink_80 { background-color: var(--color-pink-80); }
.bg_pink_90 { background-color: var(--color-pink-90); }
.bg_pink_95 { background-color: var(--color-pink-95); }
.bg_pink_99 { background-color: var(--color-pink-99); }
.bg_purple_0 { background-color: var(--color-purple-0); }
.bg_purple_10 { background-color: var(--color-purple-10); }
.bg_purple_100 { background-color: var(--color-purple-100); }
.bg_purple_20 { background-color: var(--color-purple-20); }
.bg_purple_30 { background-color: var(--color-purple-30); }
.bg_purple_40 { background-color: var(--color-purple-40); }
.bg_purple_50 { background-color: var(--color-purple-50); }
.bg_purple_60 { background-color: var(--color-purple-60); }
.bg_purple_70 { background-color: var(--color-purple-70); }
.bg_purple_80 { background-color: var(--color-purple-80); }
.bg_purple_90 { background-color: var(--color-purple-90); }
.bg_purple_95 { background-color: var(--color-purple-95); }
.bg_purple_99 { background-color: var(--color-purple-99); }
.bg_red_0 { background-color: var(--color-red-0); }
.bg_red_10 { background-color: var(--color-red-10); }
.bg_red_100 { background-color: var(--color-red-100); }
.bg_red_20 { background-color: var(--color-red-20); }
.bg_red_30 { background-color: var(--color-red-30); }
.bg_red_40 { background-color: var(--color-red-40); }
.bg_red_50 { background-color: var(--color-red-50); }
.bg_red_60 { background-color: var(--color-red-60); }
.bg_red_70 { background-color: var(--color-red-70); }
.bg_red_80 { background-color: var(--color-red-80); }
.bg_red_90 { background-color: var(--color-red-90); }
.bg_red_95 { background-color: var(--color-red-95); }
.bg_red_99 { background-color: var(--color-red-99); }
.bg_red_orange_0 { background-color: var(--color-red-orange-0); }
.bg_red_orange_10 { background-color: var(--color-red-orange-10); }
.bg_red_orange_100 { background-color: var(--color-red-orange-100); }
.bg_red_orange_20 { background-color: var(--color-red-orange-20); }
.bg_red_orange_30 { background-color: var(--color-red-orange-30); }
.bg_red_orange_40 { background-color: var(--color-red-orange-40); }
.bg_red_orange_48 { background-color: var(--color-red-orange-48); }
.bg_red_orange_50 { background-color: var(--color-red-orange-50); }
.bg_red_orange_60 { background-color: var(--color-red-orange-60); }
.bg_red_orange_70 { background-color: var(--color-red-orange-70); }
.bg_red_orange_80 { background-color: var(--color-red-orange-80); }
.bg_red_orange_90 { background-color: var(--color-red-orange-90); }
.bg_red_orange_95 { background-color: var(--color-red-orange-95); }
.bg_red_orange_99 { background-color: var(--color-red-orange-99); }
.bg_static_black { background-color: var(--color-static-black); }
.bg_static_white { background-color: var(--color-static-white); }
.bg_status_cautionary { background-color: var(--color-status-cautionary); }
.bg_status_negative { background-color: var(--color-status-negative); }
.bg_status_positive { background-color: var(--color-status-positive); }
.bg_violet_0 { background-color: var(--color-violet-0); }
.bg_violet_10 { background-color: var(--color-violet-10); }
.bg_violet_100 { background-color: var(--color-violet-100); }
.bg_violet_20 { background-color: var(--color-violet-20); }
.bg_violet_30 { background-color: var(--color-violet-30); }
.bg_violet_40 { background-color: var(--color-violet-40); }
.bg_violet_45 { background-color: var(--color-violet-45); }
.bg_violet_50 { background-color: var(--color-violet-50); }
.bg_violet_60 { background-color: var(--color-violet-60); }
.bg_violet_70 { background-color: var(--color-violet-70); }
.bg_violet_80 { background-color: var(--color-violet-80); }
.bg_violet_90 { background-color: var(--color-violet-90); }
.bg_violet_95 { background-color: var(--color-violet-95); }
.bg_violet_99 { background-color: var(--color-violet-99); }
.bg_white { background-color: var(--color-white); }
.bg_yellow_0 { background-color: var(--color-yellow-0); }
.bg_yellow_10 { background-color: var(--color-yellow-10); }
.bg_yellow_100 { background-color: var(--color-yellow-100); }
.bg_yellow_20 { background-color: var(--color-yellow-20); }
.bg_yellow_30 { background-color: var(--color-yellow-30); }
.bg_yellow_40 { background-color: var(--color-yellow-40); }
.bg_yellow_50 { background-color: var(--color-yellow-50); }
.bg_yellow_60 { background-color: var(--color-yellow-60); }
.bg_yellow_70 { background-color: var(--color-yellow-70); }
.bg_yellow_80 { background-color: var(--color-yellow-80); }
.bg_yellow_90 { background-color: var(--color-yellow-90); }
.border_color_accent_background_cyan { border-color: var(--color-accent-background-cyan); }
.border_color_accent_background_light_blue { border-color: var(--color-accent-background-light-blue); }
.border_color_accent_background_lime { border-color: var(--color-accent-background-lime); }
.border_color_accent_background_pink { border-color: var(--color-accent-background-pink); }
.border_color_accent_background_purple { border-color: var(--color-accent-background-purple); }
.border_color_accent_background_red_orange { border-color: var(--color-accent-background-red-orange); }
.border_color_accent_background_violet { border-color: var(--color-accent-background-violet); }
.border_color_accent_foreground_blue { border-color: var(--color-accent-foreground-blue); }
.border_color_accent_foreground_cyan { border-color: var(--color-accent-foreground-cyan); }
.border_color_accent_foreground_green { border-color: var(--color-accent-foreground-green); }
.border_color_accent_foreground_light_blue { border-color: var(--color-accent-foreground-light-blue); }
.border_color_accent_foreground_lime { border-color: var(--color-accent-foreground-lime); }
.border_color_accent_foreground_orange { border-color: var(--color-accent-foreground-orange); }
.border_color_accent_foreground_pink { border-color: var(--color-accent-foreground-pink); }
.border_color_accent_foreground_purple { border-color: var(--color-accent-foreground-purple); }
.border_color_accent_foreground_red { border-color: var(--color-accent-foreground-red); }
.border_color_accent_foreground_red_orange { border-color: var(--color-accent-foreground-red-orange); }
.border_color_accent_foreground_violet { border-color: var(--color-accent-foreground-violet); }
.border_color_alpha_shadow1 { border-color: var(--color-alpha-shadow1); }
.border_color_alpha_shadow2 { border-color: var(--color-alpha-shadow2); }
.border_color_alpha_shadow3 { border-color: var(--color-alpha-shadow3); }
.border_color_alpha_shadow4 { border-color: var(--color-alpha-shadow4); }
.border_color_alpha_shadow5 { border-color: var(--color-alpha-shadow5); }
.border_color_app_border { border-color: var(--app-border); }
.border_color_app_control_surface { border-color: var(--app-control-surface); }
.border_color_app_input_border { border-color: var(--app-input-border); }
.border_color_app_input_surface { border-color: var(--app-input-surface); }
.border_color_app_input_text { border-color: var(--app-input-text); }
.border_color_app_surface { border-color: var(--app-surface); }
.border_color_app_surface_muted { border-color: var(--app-surface-muted); }
.border_color_app_text { border-color: var(--app-text); }
.border_color_app_text_muted { border-color: var(--app-text-muted); }
.border_color_background_elevated_alternative { border-color: var(--color-background-elevated-alternative); }
.border_color_background_elevated_normal { border-color: var(--color-background-elevated-normal); }
.border_color_background_normal_alternative { border-color: var(--color-background-normal-alternative); }
.border_color_background_normal_normal { border-color: var(--color-background-normal-normal); }
.border_color_background_transparent_alternative { border-color: var(--color-background-transparent-alternative); }
.border_color_background_transparent_normal { border-color: var(--color-background-transparent-normal); }
.border_color_background_transparent_strong { border-color: var(--color-background-transparent-strong); }
.border_color_black { border-color: var(--color-black); }
.border_color_blue_0 { border-color: var(--color-blue-0); }
.border_color_blue_10 { border-color: var(--color-blue-10); }
.border_color_blue_100 { border-color: var(--color-blue-100); }
.border_color_blue_20 { border-color: var(--color-blue-20); }
.border_color_blue_30 { border-color: var(--color-blue-30); }
.border_color_blue_40 { border-color: var(--color-blue-40); }
.border_color_blue_45 { border-color: var(--color-blue-45); }
.border_color_blue_50 { border-color: var(--color-blue-50); }
.border_color_blue_55 { border-color: var(--color-blue-55); }
.border_color_blue_60 { border-color: var(--color-blue-60); }
.border_color_blue_65 { border-color: var(--color-blue-65); }
.border_color_blue_70 { border-color: var(--color-blue-70); }
.border_color_blue_80 { border-color: var(--color-blue-80); }
.border_color_blue_90 { border-color: var(--color-blue-90); }
.border_color_blue_95 { border-color: var(--color-blue-95); }
.border_color_blue_99 { border-color: var(--color-blue-99); }
.border_color_brand_accent { border-color: var(--color-brand-accent); }
.border_color_brand_on_primary { border-color: var(--color-brand-on-primary); }
.border_color_brand_primary { border-color: var(--color-brand-primary); }
.border_color_brand_secondary { border-color: var(--color-brand-secondary); }
.border_color_common_0 { border-color: var(--color-common-0); }
.border_color_common_100 { border-color: var(--color-common-100); }
.border_color_cool_neutral_0 { border-color: var(--color-cool-neutral-0); }
.border_color_cool_neutral_10 { border-color: var(--color-cool-neutral-10); }
.border_color_cool_neutral_100 { border-color: var(--color-cool-neutral-100); }
.border_color_cool_neutral_15 { border-color: var(--color-cool-neutral-15); }
.border_color_cool_neutral_17 { border-color: var(--color-cool-neutral-17); }
.border_color_cool_neutral_20 { border-color: var(--color-cool-neutral-20); }
.border_color_cool_neutral_22 { border-color: var(--color-cool-neutral-22); }
.border_color_cool_neutral_23 { border-color: var(--color-cool-neutral-23); }
.border_color_cool_neutral_25 { border-color: var(--color-cool-neutral-25); }
.border_color_cool_neutral_30 { border-color: var(--color-cool-neutral-30); }
.border_color_cool_neutral_40 { border-color: var(--color-cool-neutral-40); }
.border_color_cool_neutral_5 { border-color: var(--color-cool-neutral-5); }
.border_color_cool_neutral_50 { border-color: var(--color-cool-neutral-50); }
.border_color_cool_neutral_60 { border-color: var(--color-cool-neutral-60); }
.border_color_cool_neutral_7 { border-color: var(--color-cool-neutral-7); }
.border_color_cool_neutral_70 { border-color: var(--color-cool-neutral-70); }
.border_color_cool_neutral_80 { border-color: var(--color-cool-neutral-80); }
.border_color_cool_neutral_90 { border-color: var(--color-cool-neutral-90); }
.border_color_cool_neutral_95 { border-color: var(--color-cool-neutral-95); }
.border_color_cool_neutral_96 { border-color: var(--color-cool-neutral-96); }
.border_color_cool_neutral_97 { border-color: var(--color-cool-neutral-97); }
.border_color_cool_neutral_98 { border-color: var(--color-cool-neutral-98); }
.border_color_cool_neutral_99 { border-color: var(--color-cool-neutral-99); }
.border_color_cyan_0 { border-color: var(--color-cyan-0); }
.border_color_cyan_10 { border-color: var(--color-cyan-10); }
.border_color_cyan_100 { border-color: var(--color-cyan-100); }
.border_color_cyan_20 { border-color: var(--color-cyan-20); }
.border_color_cyan_30 { border-color: var(--color-cyan-30); }
.border_color_cyan_40 { border-color: var(--color-cyan-40); }
.border_color_cyan_50 { border-color: var(--color-cyan-50); }
.border_color_cyan_60 { border-color: var(--color-cyan-60); }
.border_color_cyan_70 { border-color: var(--color-cyan-70); }
.border_color_cyan_80 { border-color: var(--color-cyan-80); }
.border_color_cyan_90 { border-color: var(--color-cyan-90); }
.border_color_cyan_95 { border-color: var(--color-cyan-95); }
.border_color_cyan_99 { border-color: var(--color-cyan-99); }
.border_color_ds_atomic_neutral_40 { border-color: var(--ds-atomic-neutral-40); }
.border_color_ds_atomic_neutral_90 { border-color: var(--ds-atomic-neutral-90); }
.border_color_fill_alternative { border-color: var(--color-fill-alternative); }
.border_color_fill_normal { border-color: var(--color-fill-normal); }
.border_color_fill_strong { border-color: var(--color-fill-strong); }
.border_color_green_0 { border-color: var(--color-green-0); }
.border_color_green_10 { border-color: var(--color-green-10); }
.border_color_green_100 { border-color: var(--color-green-100); }
.border_color_green_20 { border-color: var(--color-green-20); }
.border_color_green_30 { border-color: var(--color-green-30); }
.border_color_green_40 { border-color: var(--color-green-40); }
.border_color_green_50 { border-color: var(--color-green-50); }
.border_color_green_60 { border-color: var(--color-green-60); }
.border_color_green_70 { border-color: var(--color-green-70); }
.border_color_green_80 { border-color: var(--color-green-80); }
.border_color_green_90 { border-color: var(--color-green-90); }
.border_color_green_95 { border-color: var(--color-green-95); }
.border_color_green_99 { border-color: var(--color-green-99); }
.border_color_interaction_disable { border-color: var(--color-interaction-disable); }
.border_color_interaction_inactive { border-color: var(--color-interaction-inactive); }
.border_color_inverse_background { border-color: var(--color-inverse-background); }
.border_color_inverse_label { border-color: var(--color-inverse-label); }
.border_color_inverse_primary { border-color: var(--color-inverse-primary); }
.border_color_label_alternative { border-color: var(--color-label-alternative); }
.border_color_label_assistive { border-color: var(--color-label-assistive); }
.border_color_label_disable { border-color: var(--color-label-disable); }
.border_color_label_neutral { border-color: var(--color-label-neutral); }
.border_color_label_normal { border-color: var(--color-label-normal); }
.border_color_label_strong { border-color: var(--color-label-strong); }
.border_color_light_blue_0 { border-color: var(--color-light-blue-0); }
.border_color_light_blue_10 { border-color: var(--color-light-blue-10); }
.border_color_light_blue_100 { border-color: var(--color-light-blue-100); }
.border_color_light_blue_20 { border-color: var(--color-light-blue-20); }
.border_color_light_blue_30 { border-color: var(--color-light-blue-30); }
.border_color_light_blue_40 { border-color: var(--color-light-blue-40); }
.border_color_light_blue_50 { border-color: var(--color-light-blue-50); }
.border_color_light_blue_60 { border-color: var(--color-light-blue-60); }
.border_color_light_blue_70 { border-color: var(--color-light-blue-70); }
.border_color_light_blue_80 { border-color: var(--color-light-blue-80); }
.border_color_light_blue_90 { border-color: var(--color-light-blue-90); }
.border_color_light_blue_95 { border-color: var(--color-light-blue-95); }
.border_color_light_blue_99 { border-color: var(--color-light-blue-99); }
.border_color_lime_0 { border-color: var(--color-lime-0); }
.border_color_lime_10 { border-color: var(--color-lime-10); }
.border_color_lime_100 { border-color: var(--color-lime-100); }
.border_color_lime_20 { border-color: var(--color-lime-20); }
.border_color_lime_30 { border-color: var(--color-lime-30); }
.border_color_lime_37 { border-color: var(--color-lime-37); }
.border_color_lime_40 { border-color: var(--color-lime-40); }
.border_color_lime_50 { border-color: var(--color-lime-50); }
.border_color_lime_60 { border-color: var(--color-lime-60); }
.border_color_lime_70 { border-color: var(--color-lime-70); }
.border_color_lime_80 { border-color: var(--color-lime-80); }
.border_color_lime_90 { border-color: var(--color-lime-90); }
.border_color_lime_95 { border-color: var(--color-lime-95); }
.border_color_lime_99 { border-color: var(--color-lime-99); }
.border_color_line_normal_alternative { border-color: var(--color-line-normal-alternative); }
.border_color_line_normal_neutral { border-color: var(--color-line-normal-neutral); }
.border_color_line_normal_normal { border-color: var(--color-line-normal-normal); }
.border_color_line_normal_strong { border-color: var(--color-line-normal-strong); }
.border_color_line_solid_0 { border-color: var(--color-line-solid-0); }
.border_color_line_solid_10 { border-color: var(--color-line-solid-10); }
.border_color_line_solid_20 { border-color: var(--color-line-solid-20); }
.border_color_line_solid_alternative { border-color: var(--color-line-solid-alternative); }
.border_color_line_solid_neutral { border-color: var(--color-line-solid-neutral); }
.border_color_line_solid_normal { border-color: var(--color-line-solid-normal); }
.border_color_line_solid_strong { border-color: var(--color-line-solid-strong); }
.border_color_material_dimmer { border-color: var(--color-material-dimmer); }
.border_color_neutral_0 { border-color: var(--color-neutral-0); }
.border_color_neutral_10 { border-color: var(--color-neutral-10); }
.border_color_neutral_100 { border-color: var(--color-neutral-100); }
.border_color_neutral_15 { border-color: var(--color-neutral-15); }
.border_color_neutral_20 { border-color: var(--color-neutral-20); }
.border_color_neutral_22 { border-color: var(--color-neutral-22); }
.border_color_neutral_30 { border-color: var(--color-neutral-30); }
.border_color_neutral_40 { border-color: var(--color-neutral-40); }
.border_color_neutral_5 { border-color: var(--color-neutral-5); }
.border_color_neutral_50 { border-color: var(--color-neutral-50); }
.border_color_neutral_60 { border-color: var(--color-neutral-60); }
.border_color_neutral_70 { border-color: var(--color-neutral-70); }
.border_color_neutral_80 { border-color: var(--color-neutral-80); }
.border_color_neutral_90 { border-color: var(--color-neutral-90); }
.border_color_neutral_95 { border-color: var(--color-neutral-95); }
.border_color_neutral_97 { border-color: var(--color-neutral-97); }
.border_color_neutral_99 { border-color: var(--color-neutral-99); }
.border_color_opacity_0 { border-color: var(--color-opacity-0); }
.border_color_opacity_0_2 { border-color: var(--color-opacity-0-2); }
.border_color_opacity_0_3 { border-color: var(--color-opacity-0-3); }
.border_color_opacity_0_4 { border-color: var(--color-opacity-0-4); }
.border_color_opacity_0_5 { border-color: var(--color-opacity-0-5); }
.border_color_opacity_0_6 { border-color: var(--color-opacity-0-6); }
.border_color_opacity_0_7 { border-color: var(--color-opacity-0-7); }
.border_color_orange_0 { border-color: var(--color-orange-0); }
.border_color_orange_10 { border-color: var(--color-orange-10); }
.border_color_orange_100 { border-color: var(--color-orange-100); }
.border_color_orange_20 { border-color: var(--color-orange-20); }
.border_color_orange_30 { border-color: var(--color-orange-30); }
.border_color_orange_39 { border-color: var(--color-orange-39); }
.border_color_orange_40 { border-color: var(--color-orange-40); }
.border_color_orange_50 { border-color: var(--color-orange-50); }
.border_color_orange_60 { border-color: var(--color-orange-60); }
.border_color_orange_70 { border-color: var(--color-orange-70); }
.border_color_orange_80 { border-color: var(--color-orange-80); }
.border_color_orange_90 { border-color: var(--color-orange-90); }
.border_color_orange_95 { border-color: var(--color-orange-95); }
.border_color_orange_99 { border-color: var(--color-orange-99); }
.border_color_pink_0 { border-color: var(--color-pink-0); }
.border_color_pink_10 { border-color: var(--color-pink-10); }
.border_color_pink_100 { border-color: var(--color-pink-100); }
.border_color_pink_20 { border-color: var(--color-pink-20); }
.border_color_pink_30 { border-color: var(--color-pink-30); }
.border_color_pink_40 { border-color: var(--color-pink-40); }
.border_color_pink_46 { border-color: var(--color-pink-46); }
.border_color_pink_50 { border-color: var(--color-pink-50); }
.border_color_pink_60 { border-color: var(--color-pink-60); }
.border_color_pink_70 { border-color: var(--color-pink-70); }
.border_color_pink_80 { border-color: var(--color-pink-80); }
.border_color_pink_90 { border-color: var(--color-pink-90); }
.border_color_pink_95 { border-color: var(--color-pink-95); }
.border_color_pink_99 { border-color: var(--color-pink-99); }
.border_color_purple_0 { border-color: var(--color-purple-0); }
.border_color_purple_10 { border-color: var(--color-purple-10); }
.border_color_purple_100 { border-color: var(--color-purple-100); }
.border_color_purple_20 { border-color: var(--color-purple-20); }
.border_color_purple_30 { border-color: var(--color-purple-30); }
.border_color_purple_40 { border-color: var(--color-purple-40); }
.border_color_purple_50 { border-color: var(--color-purple-50); }
.border_color_purple_60 { border-color: var(--color-purple-60); }
.border_color_purple_70 { border-color: var(--color-purple-70); }
.border_color_purple_80 { border-color: var(--color-purple-80); }
.border_color_purple_90 { border-color: var(--color-purple-90); }
.border_color_purple_95 { border-color: var(--color-purple-95); }
.border_color_purple_99 { border-color: var(--color-purple-99); }
.border_color_red_0 { border-color: var(--color-red-0); }
.border_color_red_10 { border-color: var(--color-red-10); }
.border_color_red_100 { border-color: var(--color-red-100); }
.border_color_red_20 { border-color: var(--color-red-20); }
.border_color_red_30 { border-color: var(--color-red-30); }
.border_color_red_40 { border-color: var(--color-red-40); }
.border_color_red_50 { border-color: var(--color-red-50); }
.border_color_red_60 { border-color: var(--color-red-60); }
.border_color_red_70 { border-color: var(--color-red-70); }
.border_color_red_80 { border-color: var(--color-red-80); }
.border_color_red_90 { border-color: var(--color-red-90); }
.border_color_red_95 { border-color: var(--color-red-95); }
.border_color_red_99 { border-color: var(--color-red-99); }
.border_color_red_orange_0 { border-color: var(--color-red-orange-0); }
.border_color_red_orange_10 { border-color: var(--color-red-orange-10); }
.border_color_red_orange_100 { border-color: var(--color-red-orange-100); }
.border_color_red_orange_20 { border-color: var(--color-red-orange-20); }
.border_color_red_orange_30 { border-color: var(--color-red-orange-30); }
.border_color_red_orange_40 { border-color: var(--color-red-orange-40); }
.border_color_red_orange_48 { border-color: var(--color-red-orange-48); }
.border_color_red_orange_50 { border-color: var(--color-red-orange-50); }
.border_color_red_orange_60 { border-color: var(--color-red-orange-60); }
.border_color_red_orange_70 { border-color: var(--color-red-orange-70); }
.border_color_red_orange_80 { border-color: var(--color-red-orange-80); }
.border_color_red_orange_90 { border-color: var(--color-red-orange-90); }
.border_color_red_orange_95 { border-color: var(--color-red-orange-95); }
.border_color_red_orange_99 { border-color: var(--color-red-orange-99); }
.border_color_static_black { border-color: var(--color-static-black); }
.border_color_static_white { border-color: var(--color-static-white); }
.border_color_status_cautionary { border-color: var(--color-status-cautionary); }
.border_color_status_negative { border-color: var(--color-status-negative); }
.border_color_status_positive { border-color: var(--color-status-positive); }
.border_color_violet_0 { border-color: var(--color-violet-0); }
.border_color_violet_10 { border-color: var(--color-violet-10); }
.border_color_violet_100 { border-color: var(--color-violet-100); }
.border_color_violet_20 { border-color: var(--color-violet-20); }
.border_color_violet_30 { border-color: var(--color-violet-30); }
.border_color_violet_40 { border-color: var(--color-violet-40); }
.border_color_violet_45 { border-color: var(--color-violet-45); }
.border_color_violet_50 { border-color: var(--color-violet-50); }
.border_color_violet_60 { border-color: var(--color-violet-60); }
.border_color_violet_70 { border-color: var(--color-violet-70); }
.border_color_violet_80 { border-color: var(--color-violet-80); }
.border_color_violet_90 { border-color: var(--color-violet-90); }
.border_color_violet_95 { border-color: var(--color-violet-95); }
.border_color_violet_99 { border-color: var(--color-violet-99); }
.border_color_white { border-color: var(--color-white); }
.border_color_yellow_0 { border-color: var(--color-yellow-0); }
.border_color_yellow_10 { border-color: var(--color-yellow-10); }
.border_color_yellow_100 { border-color: var(--color-yellow-100); }
.border_color_yellow_20 { border-color: var(--color-yellow-20); }
.border_color_yellow_30 { border-color: var(--color-yellow-30); }
.border_color_yellow_40 { border-color: var(--color-yellow-40); }
.border_color_yellow_50 { border-color: var(--color-yellow-50); }
.border_color_yellow_60 { border-color: var(--color-yellow-60); }
.border_color_yellow_70 { border-color: var(--color-yellow-70); }
.border_color_yellow_80 { border-color: var(--color-yellow-80); }
.border_color_yellow_90 { border-color: var(--color-yellow-90); }
.border_width_0_5 { border-width: var(--border-0-5); }
.border_width_1 { border-width: var(--border-1); }
.border_width_2 { border-width: var(--border-2); }
.border_width_3 { border-width: var(--border-3); }
.color_accent_background_cyan { color: var(--color-accent-background-cyan); }
.color_accent_background_light_blue { color: var(--color-accent-background-light-blue); }
.color_accent_background_lime { color: var(--color-accent-background-lime); }
.color_accent_background_pink { color: var(--color-accent-background-pink); }
.color_accent_background_purple { color: var(--color-accent-background-purple); }
.color_accent_background_red_orange { color: var(--color-accent-background-red-orange); }
.color_accent_background_violet { color: var(--color-accent-background-violet); }
.color_accent_foreground_blue { color: var(--color-accent-foreground-blue); }
.color_accent_foreground_cyan { color: var(--color-accent-foreground-cyan); }
.color_accent_foreground_green { color: var(--color-accent-foreground-green); }
.color_accent_foreground_light_blue { color: var(--color-accent-foreground-light-blue); }
.color_accent_foreground_lime { color: var(--color-accent-foreground-lime); }
.color_accent_foreground_orange { color: var(--color-accent-foreground-orange); }
.color_accent_foreground_pink { color: var(--color-accent-foreground-pink); }
.color_accent_foreground_purple { color: var(--color-accent-foreground-purple); }
.color_accent_foreground_red { color: var(--color-accent-foreground-red); }
.color_accent_foreground_red_orange { color: var(--color-accent-foreground-red-orange); }
.color_accent_foreground_violet { color: var(--color-accent-foreground-violet); }
.color_alpha_shadow1 { color: var(--color-alpha-shadow1); }
.color_alpha_shadow2 { color: var(--color-alpha-shadow2); }
.color_alpha_shadow3 { color: var(--color-alpha-shadow3); }
.color_alpha_shadow4 { color: var(--color-alpha-shadow4); }
.color_alpha_shadow5 { color: var(--color-alpha-shadow5); }
.color_app_border { color: var(--app-border); }
.color_app_control_surface { color: var(--app-control-surface); }
.color_app_input_border { color: var(--app-input-border); }
.color_app_input_surface { color: var(--app-input-surface); }
.color_app_input_text { color: var(--app-input-text); }
.color_app_surface { color: var(--app-surface); }
.color_app_surface_muted { color: var(--app-surface-muted); }
.color_app_text { color: var(--app-text); }
.color_app_text_muted { color: var(--app-text-muted); }
.color_background_elevated_alternative { color: var(--color-background-elevated-alternative); }
.color_background_elevated_normal { color: var(--color-background-elevated-normal); }
.color_background_normal_alternative { color: var(--color-background-normal-alternative); }
.color_background_normal_normal { color: var(--color-background-normal-normal); }
.color_background_transparent_alternative { color: var(--color-background-transparent-alternative); }
.color_background_transparent_normal { color: var(--color-background-transparent-normal); }
.color_background_transparent_strong { color: var(--color-background-transparent-strong); }
.color_black { color: var(--color-black); }
.color_blue_0 { color: var(--color-blue-0); }
.color_blue_10 { color: var(--color-blue-10); }
.color_blue_100 { color: var(--color-blue-100); }
.color_blue_20 { color: var(--color-blue-20); }
.color_blue_30 { color: var(--color-blue-30); }
.color_blue_40 { color: var(--color-blue-40); }
.color_blue_45 { color: var(--color-blue-45); }
.color_blue_50 { color: var(--color-blue-50); }
.color_blue_55 { color: var(--color-blue-55); }
.color_blue_60 { color: var(--color-blue-60); }
.color_blue_65 { color: var(--color-blue-65); }
.color_blue_70 { color: var(--color-blue-70); }
.color_blue_80 { color: var(--color-blue-80); }
.color_blue_90 { color: var(--color-blue-90); }
.color_blue_95 { color: var(--color-blue-95); }
.color_blue_99 { color: var(--color-blue-99); }
.color_brand_accent { color: var(--color-brand-accent); }
.color_brand_on_primary { color: var(--color-brand-on-primary); }
.color_brand_primary { color: var(--color-brand-primary); }
.color_brand_secondary { color: var(--color-brand-secondary); }
.color_common_0 { color: var(--color-common-0); }
.color_common_100 { color: var(--color-common-100); }
.color_cool_neutral_0 { color: var(--color-cool-neutral-0); }
.color_cool_neutral_10 { color: var(--color-cool-neutral-10); }
.color_cool_neutral_100 { color: var(--color-cool-neutral-100); }
.color_cool_neutral_15 { color: var(--color-cool-neutral-15); }
.color_cool_neutral_17 { color: var(--color-cool-neutral-17); }
.color_cool_neutral_20 { color: var(--color-cool-neutral-20); }
.color_cool_neutral_22 { color: var(--color-cool-neutral-22); }
.color_cool_neutral_23 { color: var(--color-cool-neutral-23); }
.color_cool_neutral_25 { color: var(--color-cool-neutral-25); }
.color_cool_neutral_30 { color: var(--color-cool-neutral-30); }
.color_cool_neutral_40 { color: var(--color-cool-neutral-40); }
.color_cool_neutral_5 { color: var(--color-cool-neutral-5); }
.color_cool_neutral_50 { color: var(--color-cool-neutral-50); }
.color_cool_neutral_60 { color: var(--color-cool-neutral-60); }
.color_cool_neutral_7 { color: var(--color-cool-neutral-7); }
.color_cool_neutral_70 { color: var(--color-cool-neutral-70); }
.color_cool_neutral_80 { color: var(--color-cool-neutral-80); }
.color_cool_neutral_90 { color: var(--color-cool-neutral-90); }
.color_cool_neutral_95 { color: var(--color-cool-neutral-95); }
.color_cool_neutral_96 { color: var(--color-cool-neutral-96); }
.color_cool_neutral_97 { color: var(--color-cool-neutral-97); }
.color_cool_neutral_98 { color: var(--color-cool-neutral-98); }
.color_cool_neutral_99 { color: var(--color-cool-neutral-99); }
.color_cyan_0 { color: var(--color-cyan-0); }
.color_cyan_10 { color: var(--color-cyan-10); }
.color_cyan_100 { color: var(--color-cyan-100); }
.color_cyan_20 { color: var(--color-cyan-20); }
.color_cyan_30 { color: var(--color-cyan-30); }
.color_cyan_40 { color: var(--color-cyan-40); }
.color_cyan_50 { color: var(--color-cyan-50); }
.color_cyan_60 { color: var(--color-cyan-60); }
.color_cyan_70 { color: var(--color-cyan-70); }
.color_cyan_80 { color: var(--color-cyan-80); }
.color_cyan_90 { color: var(--color-cyan-90); }
.color_cyan_95 { color: var(--color-cyan-95); }
.color_cyan_99 { color: var(--color-cyan-99); }
.color_ds_atomic_neutral_40 { color: var(--ds-atomic-neutral-40); }
.color_ds_atomic_neutral_90 { color: var(--ds-atomic-neutral-90); }
.color_fill_alternative { color: var(--color-fill-alternative); }
.color_fill_normal { color: var(--color-fill-normal); }
.color_fill_strong { color: var(--color-fill-strong); }
.color_green_0 { color: var(--color-green-0); }
.color_green_10 { color: var(--color-green-10); }
.color_green_100 { color: var(--color-green-100); }
.color_green_20 { color: var(--color-green-20); }
.color_green_30 { color: var(--color-green-30); }
.color_green_40 { color: var(--color-green-40); }
.color_green_50 { color: var(--color-green-50); }
.color_green_60 { color: var(--color-green-60); }
.color_green_70 { color: var(--color-green-70); }
.color_green_80 { color: var(--color-green-80); }
.color_green_90 { color: var(--color-green-90); }
.color_green_95 { color: var(--color-green-95); }
.color_green_99 { color: var(--color-green-99); }
.color_interaction_disable { color: var(--color-interaction-disable); }
.color_interaction_inactive { color: var(--color-interaction-inactive); }
.color_inverse_background { color: var(--color-inverse-background); }
.color_inverse_label { color: var(--color-inverse-label); }
.color_inverse_primary { color: var(--color-inverse-primary); }
.color_label_alternative { color: var(--color-label-alternative); }
.color_label_assistive { color: var(--color-label-assistive); }
.color_label_disable { color: var(--color-label-disable); }
.color_label_neutral { color: var(--color-label-neutral); }
.color_label_normal { color: var(--color-label-normal); }
.color_label_strong { color: var(--color-label-strong); }
.color_light_blue_0 { color: var(--color-light-blue-0); }
.color_light_blue_10 { color: var(--color-light-blue-10); }
.color_light_blue_100 { color: var(--color-light-blue-100); }
.color_light_blue_20 { color: var(--color-light-blue-20); }
.color_light_blue_30 { color: var(--color-light-blue-30); }
.color_light_blue_40 { color: var(--color-light-blue-40); }
.color_light_blue_50 { color: var(--color-light-blue-50); }
.color_light_blue_60 { color: var(--color-light-blue-60); }
.color_light_blue_70 { color: var(--color-light-blue-70); }
.color_light_blue_80 { color: var(--color-light-blue-80); }
.color_light_blue_90 { color: var(--color-light-blue-90); }
.color_light_blue_95 { color: var(--color-light-blue-95); }
.color_light_blue_99 { color: var(--color-light-blue-99); }
.color_lime_0 { color: var(--color-lime-0); }
.color_lime_10 { color: var(--color-lime-10); }
.color_lime_100 { color: var(--color-lime-100); }
.color_lime_20 { color: var(--color-lime-20); }
.color_lime_30 { color: var(--color-lime-30); }
.color_lime_37 { color: var(--color-lime-37); }
.color_lime_40 { color: var(--color-lime-40); }
.color_lime_50 { color: var(--color-lime-50); }
.color_lime_60 { color: var(--color-lime-60); }
.color_lime_70 { color: var(--color-lime-70); }
.color_lime_80 { color: var(--color-lime-80); }
.color_lime_90 { color: var(--color-lime-90); }
.color_lime_95 { color: var(--color-lime-95); }
.color_lime_99 { color: var(--color-lime-99); }
.color_line_normal_alternative { color: var(--color-line-normal-alternative); }
.color_line_normal_neutral { color: var(--color-line-normal-neutral); }
.color_line_normal_normal { color: var(--color-line-normal-normal); }
.color_line_normal_strong { color: var(--color-line-normal-strong); }
.color_line_solid_0 { color: var(--color-line-solid-0); }
.color_line_solid_10 { color: var(--color-line-solid-10); }
.color_line_solid_20 { color: var(--color-line-solid-20); }
.color_line_solid_alternative { color: var(--color-line-solid-alternative); }
.color_line_solid_neutral { color: var(--color-line-solid-neutral); }
.color_line_solid_normal { color: var(--color-line-solid-normal); }
.color_line_solid_strong { color: var(--color-line-solid-strong); }
.color_material_dimmer { color: var(--color-material-dimmer); }
.color_neutral_0 { color: var(--color-neutral-0); }
.color_neutral_10 { color: var(--color-neutral-10); }
.color_neutral_100 { color: var(--color-neutral-100); }
.color_neutral_15 { color: var(--color-neutral-15); }
.color_neutral_20 { color: var(--color-neutral-20); }
.color_neutral_22 { color: var(--color-neutral-22); }
.color_neutral_30 { color: var(--color-neutral-30); }
.color_neutral_40 { color: var(--color-neutral-40); }
.color_neutral_5 { color: var(--color-neutral-5); }
.color_neutral_50 { color: var(--color-neutral-50); }
.color_neutral_60 { color: var(--color-neutral-60); }
.color_neutral_70 { color: var(--color-neutral-70); }
.color_neutral_80 { color: var(--color-neutral-80); }
.color_neutral_90 { color: var(--color-neutral-90); }
.color_neutral_95 { color: var(--color-neutral-95); }
.color_neutral_97 { color: var(--color-neutral-97); }
.color_neutral_99 { color: var(--color-neutral-99); }
.color_opacity_0 { color: var(--color-opacity-0); }
.color_opacity_0_2 { color: var(--color-opacity-0-2); }
.color_opacity_0_3 { color: var(--color-opacity-0-3); }
.color_opacity_0_4 { color: var(--color-opacity-0-4); }
.color_opacity_0_5 { color: var(--color-opacity-0-5); }
.color_opacity_0_6 { color: var(--color-opacity-0-6); }
.color_opacity_0_7 { color: var(--color-opacity-0-7); }
.color_orange_0 { color: var(--color-orange-0); }
.color_orange_10 { color: var(--color-orange-10); }
.color_orange_100 { color: var(--color-orange-100); }
.color_orange_20 { color: var(--color-orange-20); }
.color_orange_30 { color: var(--color-orange-30); }
.color_orange_39 { color: var(--color-orange-39); }
.color_orange_40 { color: var(--color-orange-40); }
.color_orange_50 { color: var(--color-orange-50); }
.color_orange_60 { color: var(--color-orange-60); }
.color_orange_70 { color: var(--color-orange-70); }
.color_orange_80 { color: var(--color-orange-80); }
.color_orange_90 { color: var(--color-orange-90); }
.color_orange_95 { color: var(--color-orange-95); }
.color_orange_99 { color: var(--color-orange-99); }
.color_pink_0 { color: var(--color-pink-0); }
.color_pink_10 { color: var(--color-pink-10); }
.color_pink_100 { color: var(--color-pink-100); }
.color_pink_20 { color: var(--color-pink-20); }
.color_pink_30 { color: var(--color-pink-30); }
.color_pink_40 { color: var(--color-pink-40); }
.color_pink_46 { color: var(--color-pink-46); }
.color_pink_50 { color: var(--color-pink-50); }
.color_pink_60 { color: var(--color-pink-60); }
.color_pink_70 { color: var(--color-pink-70); }
.color_pink_80 { color: var(--color-pink-80); }
.color_pink_90 { color: var(--color-pink-90); }
.color_pink_95 { color: var(--color-pink-95); }
.color_pink_99 { color: var(--color-pink-99); }
.color_purple_0 { color: var(--color-purple-0); }
.color_purple_10 { color: var(--color-purple-10); }
.color_purple_100 { color: var(--color-purple-100); }
.color_purple_20 { color: var(--color-purple-20); }
.color_purple_30 { color: var(--color-purple-30); }
.color_purple_40 { color: var(--color-purple-40); }
.color_purple_50 { color: var(--color-purple-50); }
.color_purple_60 { color: var(--color-purple-60); }
.color_purple_70 { color: var(--color-purple-70); }
.color_purple_80 { color: var(--color-purple-80); }
.color_purple_90 { color: var(--color-purple-90); }
.color_purple_95 { color: var(--color-purple-95); }
.color_purple_99 { color: var(--color-purple-99); }
.color_red_0 { color: var(--color-red-0); }
.color_red_10 { color: var(--color-red-10); }
.color_red_100 { color: var(--color-red-100); }
.color_red_20 { color: var(--color-red-20); }
.color_red_30 { color: var(--color-red-30); }
.color_red_40 { color: var(--color-red-40); }
.color_red_50 { color: var(--color-red-50); }
.color_red_60 { color: var(--color-red-60); }
.color_red_70 { color: var(--color-red-70); }
.color_red_80 { color: var(--color-red-80); }
.color_red_90 { color: var(--color-red-90); }
.color_red_95 { color: var(--color-red-95); }
.color_red_99 { color: var(--color-red-99); }
.color_red_orange_0 { color: var(--color-red-orange-0); }
.color_red_orange_10 { color: var(--color-red-orange-10); }
.color_red_orange_100 { color: var(--color-red-orange-100); }
.color_red_orange_20 { color: var(--color-red-orange-20); }
.color_red_orange_30 { color: var(--color-red-orange-30); }
.color_red_orange_40 { color: var(--color-red-orange-40); }
.color_red_orange_48 { color: var(--color-red-orange-48); }
.color_red_orange_50 { color: var(--color-red-orange-50); }
.color_red_orange_60 { color: var(--color-red-orange-60); }
.color_red_orange_70 { color: var(--color-red-orange-70); }
.color_red_orange_80 { color: var(--color-red-orange-80); }
.color_red_orange_90 { color: var(--color-red-orange-90); }
.color_red_orange_95 { color: var(--color-red-orange-95); }
.color_red_orange_99 { color: var(--color-red-orange-99); }
.color_static_black { color: var(--color-static-black); }
.color_static_white { color: var(--color-static-white); }
.color_status_cautionary { color: var(--color-status-cautionary); }
.color_status_negative { color: var(--color-status-negative); }
.color_status_positive { color: var(--color-status-positive); }
.color_violet_0 { color: var(--color-violet-0); }
.color_violet_10 { color: var(--color-violet-10); }
.color_violet_100 { color: var(--color-violet-100); }
.color_violet_20 { color: var(--color-violet-20); }
.color_violet_30 { color: var(--color-violet-30); }
.color_violet_40 { color: var(--color-violet-40); }
.color_violet_45 { color: var(--color-violet-45); }
.color_violet_50 { color: var(--color-violet-50); }
.color_violet_60 { color: var(--color-violet-60); }
.color_violet_70 { color: var(--color-violet-70); }
.color_violet_80 { color: var(--color-violet-80); }
.color_violet_90 { color: var(--color-violet-90); }
.color_violet_95 { color: var(--color-violet-95); }
.color_violet_99 { color: var(--color-violet-99); }
.color_white { color: var(--color-white); }
.color_yellow_0 { color: var(--color-yellow-0); }
.color_yellow_10 { color: var(--color-yellow-10); }
.color_yellow_100 { color: var(--color-yellow-100); }
.color_yellow_20 { color: var(--color-yellow-20); }
.color_yellow_30 { color: var(--color-yellow-30); }
.color_yellow_40 { color: var(--color-yellow-40); }
.color_yellow_50 { color: var(--color-yellow-50); }
.color_yellow_60 { color: var(--color-yellow-60); }
.color_yellow_70 { color: var(--color-yellow-70); }
.color_yellow_80 { color: var(--color-yellow-80); }
.color_yellow_90 { color: var(--color-yellow-90); }
.duration_fast { transition-duration: var(--motion-duration-fast); }
.duration_normal { transition-duration: var(--motion-duration-normal); }
.duration_slow { transition-duration: var(--motion-duration-slow); }
.easing_standard { transition-timing-function: var(--motion-easing-standard); }
.font_pretendard { font-family: var(--font-pretendard); }
.font_sans { font-family: var(--font-sans); }
.fs_10 { font-size: var(--font-size-10); }
.fs_11 { font-size: var(--font-size-11); }
.fs_115 { font-size: var(--font-size-115); }
.fs_12 { font-size: var(--font-size-12); }
.fs_13 { font-size: var(--font-size-13); }
.fs_14 { font-size: var(--font-size-14); }
.fs_15 { font-size: var(--font-size-15); }
.fs_16 { font-size: var(--font-size-16); }
.fs_18 { font-size: var(--font-size-18); }
.fs_20 { font-size: var(--font-size-20); }
.fs_24 { font-size: var(--font-size-24); }
.fs_28 { font-size: var(--font-size-28); }
.fs_32 { font-size: var(--font-size-32); }
.fs_40 { font-size: var(--font-size-40); }
.fs_48 { font-size: var(--font-size-48); }
.fs_52 { font-size: var(--font-size-52); }
.fs_60 { font-size: var(--font-size-60); }
.fs_body_1 { font-size: var(--ds-font-size-body-1); }
.fs_fixed_16 { font-size: var(--font-size-fixed-16); }
.fs_fixed_18 { font-size: var(--font-size-fixed-18); }
.fw_300 { font-weight: var(--font-weight-300); }
.fw_400 { font-weight: var(--font-weight-400); }
.fw_500 { font-weight: var(--font-weight-500); }
.fw_600 { font-weight: var(--font-weight-600); }
.fw_700 { font-weight: var(--font-weight-700); }
.gap_0 { gap: var(--spacing-0); }
.gap_16 { gap: var(--spacing-gap-vertical-16) var(--spacing-gap-horizontal-16); }
.gap_20 { gap: var(--spacing-gap-vertical-20) var(--spacing-gap-horizontal-20); }
.gap_24 { gap: var(--spacing-gap-vertical-24) var(--spacing-gap-horizontal-24); }
.gap_32 { gap: var(--spacing-gap-vertical-32) var(--spacing-gap-horizontal-32); }
.gap_4 { gap: var(--spacing-gap-vertical-4) var(--spacing-gap-horizontal-4); }
.gap_40 { gap: var(--spacing-gap-vertical-40) var(--spacing-gap-horizontal-40); }
.gap_60 { gap: var(--spacing-gap-vertical-60) var(--spacing-gap-horizontal-60); }
.gap_8 { gap: var(--spacing-gap-vertical-8) var(--spacing-gap-horizontal-8); }
.gap_x_16 { column-gap: var(--spacing-gap-horizontal-16); }
.gap_x_20 { column-gap: var(--spacing-gap-horizontal-20); }
.gap_x_24 { column-gap: var(--spacing-gap-horizontal-24); }
.gap_x_32 { column-gap: var(--spacing-gap-horizontal-32); }
.gap_x_4 { column-gap: var(--spacing-gap-horizontal-4); }
.gap_x_40 { column-gap: var(--spacing-gap-horizontal-40); }
.gap_x_60 { column-gap: var(--spacing-gap-horizontal-60); }
.gap_x_8 { column-gap: var(--spacing-gap-horizontal-8); }
.gap_y_16 { row-gap: var(--spacing-gap-vertical-16); }
.gap_y_20 { row-gap: var(--spacing-gap-vertical-20); }
.gap_y_24 { row-gap: var(--spacing-gap-vertical-24); }
.gap_y_32 { row-gap: var(--spacing-gap-vertical-32); }
.gap_y_4 { row-gap: var(--spacing-gap-vertical-4); }
.gap_y_40 { row-gap: var(--spacing-gap-vertical-40); }
.gap_y_60 { row-gap: var(--spacing-gap-vertical-60); }
.gap_y_8 { row-gap: var(--spacing-gap-vertical-8); }
.h_100p { height: 100%; }
.h_10p { height: 10%; }
.h_112 { height: var(--size-112); }
.h_15p { height: 15%; }
.h_20 { height: var(--size-20); }
.h_20p { height: 20%; }
.h_24 { height: var(--size-24); }
.h_25p { height: 25%; }
.h_30p { height: 30%; }
.h_32 { height: var(--size-32); }
.h_320 { height: var(--size-320); }
.h_35p { height: 35%; }
.h_36 { height: var(--size-36); }
.h_40 { height: var(--size-40); }
.h_40p { height: 40%; }
.h_44 { height: var(--size-44); }
.h_45p { height: 45%; }
.h_48 { height: var(--size-48); }
.h_50p { height: 50%; }
.h_52 { height: var(--size-52); }
.h_55p { height: 55%; }
.h_56 { height: var(--size-56); }
.h_5p { height: 5%; }
.h_60 { height: var(--size-60); }
.h_60p { height: 60%; }
.h_64 { height: var(--size-64); }
.h_65p { height: 65%; }
.h_70p { height: 70%; }
.h_72 { height: var(--size-72); }
.h_75p { height: 75%; }
.h_80p { height: 80%; }
.h_85p { height: 85%; }
.h_90p { height: 90%; }
.h_95p { height: 95%; }
.h_viewport { height: var(--viewport-height); }
.lh_13 { line-height: var(--line-height-13); }
.lh_16 { line-height: var(--line-height-16); }
.lh_20 { line-height: var(--line-height-20); }
.lh_24 { line-height: var(--line-height-24); }
.lh_26 { line-height: var(--line-height-26); }
.lh_32 { line-height: var(--line-height-32); }
.lh_40 { line-height: var(--line-height-40); }
.lh_44 { line-height: var(--line-height-44); }
.lh_48 { line-height: var(--line-height-48); }
.lh_60 { line-height: var(--line-height-60); }
.lh_72 { line-height: var(--line-height-72); }
.lh_90 { line-height: var(--line-height-90); }
.lh_fixed_20 { line-height: var(--line-height-fixed-20); }
.lh_fixed_26 { line-height: var(--line-height-fixed-26); }
.lh_relaxed { line-height: var(--ds-line-height-relaxed); }
.max_width_large { max-width: var(--container-large); }
.max_width_medium { max-width: var(--container-medium); }
.max_width_small { max-width: var(--container-small); }
.max_width_xlarge { max-width: var(--container-xlarge); }
.opacity_0 { opacity: var(--opacity-0); }
.opacity_100 { opacity: var(--opacity-100); }
.opacity_12 { opacity: var(--opacity-12); }
.opacity_16 { opacity: var(--opacity-16); }
.opacity_22 { opacity: var(--opacity-22); }
.opacity_28 { opacity: var(--opacity-28); }
.opacity_35 { opacity: var(--opacity-35); }
.opacity_43 { opacity: var(--opacity-43); }
.opacity_5 { opacity: var(--opacity-5); }
.opacity_52 { opacity: var(--opacity-52); }
.opacity_61 { opacity: var(--opacity-61); }
.opacity_74 { opacity: var(--opacity-74); }
.opacity_8 { opacity: var(--opacity-8); }
.opacity_88 { opacity: var(--opacity-88); }
.opacity_97 { opacity: var(--opacity-97); }
.outline_focus_color { outline-color: var(--focus-ring-color); }
.outline_focus_width { outline-width: var(--focus-ring-width); }
.p_0 { padding: var(--spacing-0); }
.pb_12 { padding-bottom: var(--spacing-padding-vertical-12); }
.pb_16 { padding-bottom: var(--spacing-padding-vertical-16); }
.pb_24 { padding-bottom: var(--spacing-padding-vertical-24); }
.pb_32 { padding-bottom: var(--spacing-padding-vertical-32); }
.pb_4 { padding-bottom: var(--spacing-padding-vertical-4); }
.pb_40 { padding-bottom: var(--spacing-padding-vertical-40); }
.pb_60 { padding-bottom: var(--spacing-padding-vertical-60); }
.pb_8 { padding-bottom: var(--spacing-padding-vertical-8); }
.pl_12 { padding-left: var(--spacing-padding-horizontal-12); }
.pl_16 { padding-left: var(--spacing-padding-horizontal-16); }
.pl_24 { padding-left: var(--spacing-padding-horizontal-24); }
.pl_32 { padding-left: var(--spacing-padding-horizontal-32); }
.pl_4 { padding-left: var(--spacing-padding-horizontal-4); }
.pl_40 { padding-left: var(--spacing-padding-horizontal-40); }
.pl_60 { padding-left: var(--spacing-padding-horizontal-60); }
.pl_8 { padding-left: var(--spacing-padding-horizontal-8); }
.pr_12 { padding-right: var(--spacing-padding-horizontal-12); }
.pr_16 { padding-right: var(--spacing-padding-horizontal-16); }
.pr_24 { padding-right: var(--spacing-padding-horizontal-24); }
.pr_32 { padding-right: var(--spacing-padding-horizontal-32); }
.pr_4 { padding-right: var(--spacing-padding-horizontal-4); }
.pr_40 { padding-right: var(--spacing-padding-horizontal-40); }
.pr_60 { padding-right: var(--spacing-padding-horizontal-60); }
.pr_8 { padding-right: var(--spacing-padding-horizontal-8); }
.pt_12 { padding-top: var(--spacing-padding-vertical-12); }
.pt_16 { padding-top: var(--spacing-padding-vertical-16); }
.pt_24 { padding-top: var(--spacing-padding-vertical-24); }
.pt_32 { padding-top: var(--spacing-padding-vertical-32); }
.pt_4 { padding-top: var(--spacing-padding-vertical-4); }
.pt_40 { padding-top: var(--spacing-padding-vertical-40); }
.pt_60 { padding-top: var(--spacing-padding-vertical-60); }
.pt_8 { padding-top: var(--spacing-padding-vertical-8); }
.px_12 { padding-inline: var(--spacing-padding-horizontal-12); }
.px_16 { padding-inline: var(--spacing-padding-horizontal-16); }
.px_24 { padding-inline: var(--spacing-padding-horizontal-24); }
.px_32 { padding-inline: var(--spacing-padding-horizontal-32); }
.px_4 { padding-inline: var(--spacing-padding-horizontal-4); }
.px_40 { padding-inline: var(--spacing-padding-horizontal-40); }
.px_60 { padding-inline: var(--spacing-padding-horizontal-60); }
.px_8 { padding-inline: var(--spacing-padding-horizontal-8); }
.py_12 { padding-block: var(--spacing-padding-vertical-12); }
.py_16 { padding-block: var(--spacing-padding-vertical-16); }
.py_24 { padding-block: var(--spacing-padding-vertical-24); }
.py_32 { padding-block: var(--spacing-padding-vertical-32); }
.py_4 { padding-block: var(--spacing-padding-vertical-4); }
.py_40 { padding-block: var(--spacing-padding-vertical-40); }
.py_60 { padding-block: var(--spacing-padding-vertical-60); }
.py_8 { padding-block: var(--spacing-padding-vertical-8); }
.radius_0 { border-radius: var(--radius-0); }
.radius_16 { border-radius: var(--radius-16); }
.radius_2 { border-radius: var(--radius-2); }
.radius_20 { border-radius: var(--radius-20); }
.radius_24 { border-radius: var(--radius-24); }
.radius_32 { border-radius: var(--radius-32); }
.radius_4 { border-radius: var(--radius-4); }
.radius_40 { border-radius: var(--radius-40); }
.radius_8 { border-radius: var(--radius-8); }
.radius_full { border-radius: var(--radius-full); }
.shadow_1 { box-shadow: var(--shadow-1); }
.shadow_2 { box-shadow: var(--shadow-2); }
.shadow_3 { box-shadow: var(--shadow-3); }
.shadow_4 { box-shadow: var(--shadow-4); }
.size_112 { width: var(--size-112); height: var(--size-112); }
.size_20 { width: var(--size-20); height: var(--size-20); }
.size_24 { width: var(--size-24); height: var(--size-24); }
.size_32 { width: var(--size-32); height: var(--size-32); }
.size_320 { width: var(--size-320); height: var(--size-320); }
.size_36 { width: var(--size-36); height: var(--size-36); }
.size_40 { width: var(--size-40); height: var(--size-40); }
.size_44 { width: var(--size-44); height: var(--size-44); }
.size_48 { width: var(--size-48); height: var(--size-48); }
.size_52 { width: var(--size-52); height: var(--size-52); }
.size_56 { width: var(--size-56); height: var(--size-56); }
.size_60 { width: var(--size-60); height: var(--size-60); }
.size_64 { width: var(--size-64); height: var(--size-64); }
.size_72 { width: var(--size-72); height: var(--size-72); }
.w_100p { width: 100%; }
.w_10p { width: 10%; }
.w_112 { width: var(--size-112); }
.w_15p { width: 15%; }
.w_20 { width: var(--size-20); }
.w_20p { width: 20%; }
.w_24 { width: var(--size-24); }
.w_25p { width: 25%; }
.w_30p { width: 30%; }
.w_32 { width: var(--size-32); }
.w_320 { width: var(--size-320); }
.w_35p { width: 35%; }
.w_36 { width: var(--size-36); }
.w_40 { width: var(--size-40); }
.w_40p { width: 40%; }
.w_44 { width: var(--size-44); }
.w_45p { width: 45%; }
.w_48 { width: var(--size-48); }
.w_50p { width: 50%; }
.w_52 { width: var(--size-52); }
.w_55p { width: 55%; }
.w_56 { width: var(--size-56); }
.w_5p { width: 5%; }
.w_60 { width: var(--size-60); }
.w_60p { width: 60%; }
.w_64 { width: var(--size-64); }
.w_65p { width: 65%; }
.w_70p { width: 70%; }
.w_72 { width: var(--size-72); }
.w_75p { width: 75%; }
.w_80p { width: 80%; }
.w_85p { width: 85%; }
.w_90p { width: 90%; }
.w_95p { width: 95%; }
.w_viewport { width: var(--viewport-width); }
.z_base { z-index: var(--z-base); }
.z_dropdown { z-index: var(--z-dropdown); }
.z_modal { z-index: var(--z-modal); }
.z_overlay { z-index: var(--z-overlay); }
.z_sticky { z-index: var(--z-sticky); }
.z_toast { z-index: var(--z-toast); }
```

## 6. 공통 레이아웃 유틸리티

아래 유틸리티는 토큰만으로 표현하기 어려운 display, flex, grid, 정렬, overflow, 텍스트 처리, 접근성 패턴을 제공한다. 클래스명은 소문자 `snake_case`를 사용한다.

```css
/* 표시 */
.d_block { display: block; }
.d_inline { display: inline; }
.d_inline_block { display: inline-block; }
.d_none { display: none; }
.flex { display: flex; }
.inline_flex { display: inline-flex; }
.grid { display: grid; }

/* Flex 방향 */
.flex_row { display: flex; flex-direction: row; }
.flex_row_reverse { display: flex; flex-direction: row-reverse; }
.flex_col { display: flex; flex-direction: column; }
.flex_col_reverse { display: flex; flex-direction: column-reverse; }
.flex_wrap { flex-wrap: wrap; }
.flex_nowrap { flex-wrap: nowrap; }
.flex_1_1_0 { flex: 1 1 0; min-width: 0; }
.flex_none { flex: none; }
.flex_grow { flex-grow: 1; }
.flex_shrink_0 { flex-shrink: 0; }

/* Flex 조합 */
.flex_row_start { display: flex; align-items: center; justify-content: flex-start; }
.flex_row_center { display: flex; align-items: center; justify-content: center; }
.flex_row_end { display: flex; align-items: center; justify-content: flex-end; }
.flex_row_between { display: flex; align-items: center; justify-content: space-between; }
.flex_row_around { display: flex; align-items: center; justify-content: space-around; }
.flex_row_evenly { display: flex; align-items: center; justify-content: space-evenly; }
.flex_row_between_start { display: flex; align-items: flex-start; justify-content: space-between; }
.flex_col_start { display: flex; flex-direction: column; align-items: flex-start; }
.flex_col_center { display: flex; flex-direction: column; align-items: center; justify-content: center; }
.flex_col_end { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; }
.flex_col_between { display: flex; flex-direction: column; align-items: center; justify-content: space-between; }
.flex_col_stretch { display: flex; flex-direction: column; align-items: stretch; }

/* 정렬 */
.items_start { align-items: flex-start; }
.items_center { align-items: center; }
.items_end { align-items: flex-end; }
.items_stretch { align-items: stretch; }
.justify_start { justify-content: flex-start; }
.justify_center { justify-content: center; }
.justify_end { justify-content: flex-end; }
.justify_between { justify-content: space-between; }
.justify_around { justify-content: space-around; }
.justify_evenly { justify-content: space-evenly; }
.self_start { align-self: flex-start; }
.self_center { align-self: center; }
.self_end { align-self: flex-end; }
.self_stretch { align-self: stretch; }

/* 크기 */
.w_full { width: 100%; }
.w_auto { width: auto; }
.h_full { height: 100%; }
.h_auto { height: auto; }
.min_w_0 { min-width: 0; }
.min_h_0 { min-height: 0; }
.max_w_none { max-width: none; }

/* 텍스트 */
.text_left { text-align: left; }
.text_center { text-align: center; }
.text_right { text-align: right; }
.text_nowrap { white-space: nowrap; }
.text_break_keep { word-break: keep-all; }
.text_break_word { overflow-wrap: anywhere; }
.text_ellipsis { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.text_clamp_2 { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 2; }
.text_clamp_3 { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }

/* 위치와 넘침 */
.position_relative { position: relative; }
.position_absolute { position: absolute; }
.position_fixed { position: fixed; }
.position_sticky { position: sticky; }
.overflow_hidden { overflow: hidden; }
.overflow_auto { overflow: auto; }
.overflow_x_auto { overflow-x: auto; }
.overflow_y_auto { overflow-y: auto; }

/* 미디어 */
.object_contain { object-fit: contain; }
.object_cover { object-fit: cover; }
.object_center { object-position: center; }
.img_responsive { display: block; max-width: 100%; height: auto; }

/* 상호작용과 접근성 */
.cursor_pointer { cursor: pointer; }
.cursor_default { cursor: default; }
.pointer_events_none { pointer-events: none; }
.user_select_none { user-select: none; }
.sr_only { position: absolute; width: 1px; height: 1px; padding: 0; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

/* 효과 */
.transition_color { transition-property: color, background-color, border-color; transition-duration: var(--motion-duration-normal); transition-timing-function: var(--motion-easing-standard); }
.transition_transform { transition-property: transform; transition-duration: var(--motion-duration-normal); transition-timing-function: var(--motion-easing-standard); }
.transition_shadow { transition-property: box-shadow; transition-duration: var(--motion-duration-normal); transition-timing-function: var(--motion-easing-standard); }
.rotate_180 { transform: rotate(180deg); }
```

## 7. 클래스명 규칙

### 7.1 기본 형식

`[역할]_[영역]_[종류]_[variant]_[feature]_[state]_[size]`

필요하지 않은 항목은 생략한다. 이름은 DOM 태그가 아니라 요소가 맡은 역할을 설명해야 한다.

| 접두사 | 역할 |
| --- | --- |
| `page_` | 페이지 최상위 범위 |
| `container_` | 페이지 또는 섹션의 큰 레이아웃 범위 |
| `wrapper_` | 내부 요소 묶음과 정렬 |
| `box_` | 시각적으로 구획된 패널이나 카드 |
| `list_` | 반복 목록 |
| `item_` | 반복 항목 |
| `btn_` | 사용자 동작을 실행하는 버튼형 UI |
| `link_` | 경로 이동 링크 |
| `form_`, `fieldset_` | 폼 범위와 그룹 |
| `input_`, `textarea_`, `select_`, `label_` | 폼 컨트롤 |
| `tab_`, `pagination_`, `table_` | 탐색 및 데이터 UI |
| `badge_`, `chip_` | 상태와 분류 표시 |
| `title_`, `text_` | 제목과 텍스트 |
| `icon_`, `image_`, `logo_` | 시각 자산 |
| `header_`, `footer_`, `nav_` | 공통 레이아웃 |
| `divider_` | 구분선 |

### 7.2 이름 규칙

- 소문자 `snake_case`만 사용한다.
- camelCase, PascalCase, BEM, 의미 없는 숫자 이름을 사용하지 않는다.
- 색상이나 모양만으로 컴포넌트 이름을 만들지 않는다. `.btn_blue_round`보다 `.btn_content_submit`을 사용한다.
- 컴포넌트 이름은 렌더링 태그에 종속되지 않는다. 동일한 버튼형 스펙은 `button`, `a`, Router Link에 같은 클래스를 적용할 수 있다.
- `middle`은 사용하지 않는다. 고정 너비는 `fixed`, 가변 너비는 `responsive`를 사용한다.
- 표와 문서의 열 순서는 `fixed → responsive`, 크기 순서는 `small → medium → large → xlarge`다.
- 상태는 `:hover`, `:focus-visible`, `:checked`, `:disabled`, ARIA, `data-state`를 우선하고 필요한 경우에만 `is_active`, `is_open`을 사용한다.
- `[class^="..."]`, `[class*="..."]`로 컴포넌트 공통 속성을 숨겨 적용하지 않는다.

### 7.3 정규화 예시

| 변경 전 | 표준 이름 |
| --- | --- |
| `.btn_quickLink` | `.btn_quick_link` |
| `.btn_subFunc_pc` | `.btn_sub_func_pc` |
| `.align_self_flexEnd` | `.align_self_flex_end` |
| `.bg_lightBlue` | `.bg_light_blue` |
| `.box_shadow_blackCard` | `.box_shadow_black_card` |
| `.input_form_middle` | `.input_form_fixed` |
| `.select_form_middle` | `.select_form_fixed` |

## 8. 컴포넌트 작성 원칙

컴포넌트의 시각 스펙에는 다음 속성을 검토한다.

- display, flex/grid 정렬
- width, min-width, max-width
- height, min-height
- padding, gap
- border, radius, background, color
- font-size, font-weight, line-height
- 아이콘 크기와 배치
- shadow, cursor, appearance, white-space
- hover, focus-visible, active, checked, disabled, readonly, error
- 반응형 변화

복사·붙여넣기용 예시는 한 클래스만으로 핵심 스펙이 완성돼야 한다.

```css
.btn_primary_filled_medium {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: var(--size-40);
    padding: 0 var(--spacing-padding-horizontal-24);
    gap: var(--spacing-gap-horizontal-8);
    border: 0;
    border-radius: var(--radius-8);
    background: var(--color-brand-primary);
    color: var(--color-brand-on-primary);
    font-size: var(--font-size-16);
    font-weight: var(--font-weight-500);
    line-height: var(--line-height-24);
    white-space: nowrap;
    appearance: none;
    cursor: pointer;
    text-decoration: none;
}
```

실제 프로젝트에서는 공통 컴포넌트, CSS Modules, SCSS mixin, CSS-in-JS 등으로 내부 구현을 나눌 수 있다. 다만 최종 computed style과 토큰 사용 규칙은 동일해야 한다.

### 8.1 프로젝트 시작 시 확인할 공통 컴포넌트

| 분류 | 기본 확인 항목 |
| --- | --- |
| Button/Link | 역할, variant, 아이콘, disabled, loading, `small/medium/large/xlarge` |
| Tab/Navigation | active, keyboard, overflow, panel 연결 |
| Input | `fixed/responsive`, placeholder, readonly, disabled, error |
| Textarea | 최소 높이, 자동 높이, 글자 수 표시, error |
| Select | 기본 화살표, 아이콘, readonly 대체, disabled, error |
| Checkbox/Radio/Toggle | 자유로운 외형, checked, indeterminate, disabled, label 연결 |
| Chip/Badge | 크기, 상태, 삭제 동작 여부, 비상호작용 상태 |
| Card/Box | 정보 구조, 클릭 영역, 내부 인터랙션 |
| Table/List | 헤더 의미, 반응형 overflow, 빈 상태, pagination |
| Modal/Drawer/Tooltip | portal, focus trap, 닫기, overlay, z-index |
| Feedback | validation, alert, toast, loading, empty state |

프로젝트에서 사용하지 않는 컴포넌트까지 미리 구현할 필요는 없다. 다만 위 목록을 기준으로 필요한 컴포넌트와 누락된 상태를 착수 전에 확정한다. Checkbox, Radio, Toggle의 외형은 프로젝트 디자인에 맞게 자유롭게 설계하되 Foundation 토큰과 접근성 규칙을 지킨다.

## 9. 의미론과 접근성

- 동작 실행은 `button`, 경로 이동은 `a`를 사용한다.
- 제출 목적이 아닌 버튼에는 `type="button"`을 지정한다.
- `a > button`, `button > a`와 클릭 가능한 `div`, `span`을 사용하지 않는다.
- 아이콘 전용 컨트롤에는 접근 가능한 이름을 제공한다.
- 장식 아이콘은 보조 기술에서 숨긴다.
- 모든 인터랙티브 요소에 `:focus-visible` 상태를 제공한다.
- disabled처럼 보이는 상태는 실제 `disabled`, `readonly`, `aria-disabled`와 동작 차단을 함께 처리한다.
- label을 placeholder로 대체하지 않는다.
- Checkbox, Radio, Toggle은 키보드와 label 연결을 유지한다.
- Checkbox를 시각적으로 숨기더라도 조작 가능한 입력을 `display: none`으로 제거하지 않는다.
- Tab은 `role`, `aria-selected`, `aria-controls`와 키보드 이동을 구현한다.
- 데이터 표는 실제 `table`, `thead`, `tbody`, `th`, `td`, `scope`를 사용한다.

## 10. JavaScript 동작 훅

- JavaScript 동작은 가능한 한 `data-*`, ARIA, `name`, `id`를 사용한다.
- 스타일 클래스 변경 전에 `querySelector`, `querySelectorAll`, `closest`, `matches`, `classList` 사용처를 확인한다.
- 상태 변경은 `data-state`, `aria-expanded`, `aria-selected`, `hidden`을 우선한다.
- 외부 라이브러리가 요구하는 클래스명은 임의로 변경하지 않는다.

## 11. 프레임워크와 Cascade

- Plain CSS는 Foundation/Reset이 컴포넌트보다 먼저 로드되도록 한다.
- Tailwind CSS에서는 토큰과 Reset을 `@layer base`, 재사용 컴포넌트를 `@layer components`, 유틸리티를 `@layer utilities`에 둔다.
- Tailwind 프로젝트에서 Reset을 unlayered CSS로 두지 않는다.
- CSS Modules와 scoped style 안에 `:root`, `html`, `body`, 전역 Reset을 넣지 않는다.
- CSS-in-JS는 앱 루트에 전역 토큰과 Reset을 한 번만 주입한다.
- SSR에서는 서버와 클라이언트의 스타일 로드 순서를 동일하게 유지한다.
- Portal, Shadow DOM, iframe 안에서도 필요한 토큰과 Reset이 전달되는지 확인한다.

## 12. 금지사항

- Reset의 초기화 값을 제외한 신규 `margin`
- Foundation에 없는 임의 색상, 간격, 타이포그래피, 반경, 보더, 그림자
- 컴포넌트 파일에서 전역 토큰 재정의
- 중복 Reset
- 컴포넌트 필수 스펙을 유틸 조합에만 의존하는 구현
- Cascade 문제를 덮기 위한 무분별한 `!important`
- `btn_base + size_large + variant_filled` 같은 공개 조합 클래스 강제
- 스타일 클래스와 JavaScript 동작 훅의 불필요한 결합
- 외부 라이브러리 클래스 임의 변경
- 접근성을 제거하는 태그 변경
- Reset에서 Checkbox, Radio, Toggle의 외형을 고정하는 규칙

## 13. 생성 및 검수 체크리스트

- 모든 Foundation 토큰이 전역에서 한 번 정의됐는가
- 공개 토큰마다 대응 유틸리티가 있는가
- Reset이 중복 적용되지 않는가
- 기존 Reset이 있다면 충돌 비교 후 병합했는가
- Reset에서 Checkbox, Radio, Toggle 외형을 강제하지 않는가
- 미정의 `var(--*)` 참조가 없는가
- 신규 `margin` 선언이 없는가
- 색상과 수치가 토큰 범위 안에 있는가
- 클래스명이 소문자 `snake_case`인가
- `middle` 대신 `fixed` 또는 `medium`의 올바른 의미를 사용했는가
- 크기 순서가 `small → medium → large → xlarge`인가
- 컴포넌트의 핵심 스펙이 유틸리티에만 의존하지 않는가
- JavaScript 셀렉터와 테스트가 클래스 변경을 반영했는가
- focus, disabled, readonly, error 상태가 구현됐는가
- 태그와 ARIA가 의미에 맞는가
- 폰트와 아이콘 경로가 실제 빌드 환경에서 유효한가
- Tailwind 사용 시 Cascade Layer가 올바른가
- CSS 중괄호, HTML 구조, UTF-8 인코딩이 정상인가

## 14. AI 적용 지시문

이 문서를 전달받은 AI는 다음 순서를 따른다.

1. 기존 프로젝트의 스타일 구조와 프레임워크를 먼저 조사한다.
2. 클래스, 토큰, Reset, 유틸, JavaScript 의존성 인벤토리를 만든다.
3. 기존명에서 표준명으로 가는 변경표를 제시한다.
4. 기존 전역 스타일이 있으면 Reset을 통째로 덮어쓰지 않는다.
5. Foundation 토큰을 먼저 준비하고 컴포넌트와 유틸리티가 이를 사용하게 한다.
6. Checkbox, Radio, Toggle의 외형을 Reset에서 만들지 않는다.
7. 토큰에 없는 값을 임의로 만들지 않는다.
8. 실제 코드 구조는 프로젝트에 맞게 선택하되 최종 시각 스펙과 접근성은 이 문서를 따른다.
9. 구현 후 토큰, 클래스, JavaScript 셀렉터, 반응형, 접근성을 검수한다.
