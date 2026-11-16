# ADR 0007 — Storybook, accessibility tests and Lighthouse as merge gates

- Status: accepted
- Date: 2026-11-16

## Context

The UI is the product, and it is edited by humans and AI agents alike. We need fast, visible
proof that every component still renders, stays accessible and that pages stay fast — before
anything reaches `main` (which deploys straight to GitHub Pages).

## Decision

- **One Storybook for the whole product** (`apps/web/.storybook`, framework
  `@storybook/nextjs-vite`) that loads stories from `packages/ui` and `apps/web`. Stories live
  next to their component. Global decorators provide i18n, the motion system and store state, with
  toolbar switches for locale and motion level.
- **Stories are tests** via `@storybook/addon-vitest` (Vitest browser mode, Chromium):
  each story must render, pass its `play` function and have zero axe violations
  (`@storybook/addon-a11y` with `a11y.test = 'error'`). Tests run with motion off so axe never
  measures a half-faded element. A unit test fails when a component has no stories.
- **Lighthouse CI** (`@lhci/cli`) audits the static export (the same artifact Pages serves) on
  every PR: Performance ≥ 90, Accessibility = 100, Best Practices ≥ 95, SEO ≥ 95 (median of 3
  runs, mobile emulation). Reports are CI artifacts; nothing is uploaded to public storage.
- The static Storybook is deployed with the site at `/storybook/`.

## Consequences

- Turning these gates on surfaced real issues that were then fixed: the `subtle` text colour
  failed WCAG AA contrast, intel cards had no accessible name, heading levels skipped, the
  segmented control's highlight could lag behind its label, and entrance animations hid the
  largest element until JavaScript ran (slow LCP). Above-the-fold content now animates position,
  never from `opacity: 0`, and page transitions only run on client navigation.
- More CI minutes (two extra jobs), offset by catching regressions before deploy.
