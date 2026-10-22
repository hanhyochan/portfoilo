# Project Rules

- Read Korean and non-ASCII files explicitly as UTF-8. Never save garbled text.
- Follow `design-system.md`. Do not change unrelated content or design.
- Use SCSS. Do not use margin properties.
- Keep layout classes under `container_` and `wrapper_`, text roles under `text_`.
- Reuse the typography roles in `src/styles/_typography.scss`; do not redefine size, weight, letter spacing, or line height in page styles.
- Minimum text size is 14px, body text is 16px, hero text is 32px.
- Shared layout values belong in `src/styles/_variables.scss`; mobile is at most 768px wide.
- Keep reusable interaction logic in `src/hooks`. Reuse existing components before adding wrappers or new components.
- Keep generated work notes, conversation exports, verification screenshots, temporary files, and caches under `D:\WORKS\한효찬_문서\pf\codex`. Do not create these on C:.
- Codex-managed session storage is separate from project exports. Do not claim it has moved without checking the actual app configuration or filesystem target.
