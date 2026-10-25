# Project Rules

- Read Korean and non-ASCII files explicitly as UTF-8. Never save garbled text.
- Follow `design-system.md`. Do not change unrelated content or design.
- When the user asks for black (검은색), use the site's default text color: `var(--color-text-primary)`, Cool Neutral 20 (`#292A2D`). Use pure black (`#000000`) only when explicitly requested.
- Use SCSS. Do not use margin properties.
- Keep layout classes under `container_` and `wrapper_`, text roles under `text_`.
- Keep all SCSS in `src/style`. Load styles once through `src/style/index.scss`; do not import SCSS from individual components.
- Keep project styles in `src/style/intro.scss` and reusable component styles in `src/style/components.scss`.
- Reuse the typography roles in `src/style/foundation.scss`; do not redefine size, weight, letter spacing, or line height in project styles.
- Minimum text size is 14px, body text is 16px, hero text is 40px.
- Shared layout values, registered color tokens, and typography belong in `src/style/foundation.scss`. Use only web and mobile layouts: mobile includes tablet sizes and is at most 1200px wide; web is above 1200px. Do not add a separate tablet layout.
- Keep reusable interaction logic in `src/hooks`. Reuse existing components before adding wrappers or new components.
- On mobile, render all capability sections at their natural heights in normal vertical flow without stage snapping or nested content scrolling. Keep one translucent panel backdrop pinned behind the scrolling content after it rises over the cover. Keep staged navigation on web only.
- Store static arrays for content, navigation, and options in `src/data`, organized by project (for example, `src/data/intro.js`), and import them where used.
- Store image assets in the root `public/imgs` folder and newly created icon assets in `public/icons`. Reference them with public URLs such as `/imgs/cover.png`; do not create a separate `src/public` folder.
- Keep generated work notes, conversation exports, verification screenshots, temporary files, and caches under `D:\WORKS\한효찬_문서\pf\codex`. Do not create these on C:.
- Codex-managed session storage is separate from project exports. Do not claim it has moved without checking the actual app configuration or filesystem target.
