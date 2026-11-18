# ADR 0013 — The landing page is one episode, server-rendered with CSS-first motion

- Status: accepted
- Date: 2026-11-18
- Builds on [ADR 0005](0005-motion-system.md) (motion preferences) and
  [ADR 0007](0007-quality-gates.md) (Lighthouse, Storybook and axe gates).

## Context

The old landing page was a hero, a status panel and a grid of eleven identical icon cards: it read
like documentation, not like a product. We wanted an Apple-level page with a lot of motion, but
the home page is also the page Lighthouse audits hardest (mobile, median of three runs,
Performance ≥ 90, Accessibility = 100). The previous page was a single client component, so the
whole thing hydrated, and its scroll reveals left everything below the hero blank until JavaScript
ran.

## Decision

**Creative concept: "one episode".** The page is built like an episode of the show the reader is
catching up on: cold open → "previously on" → Act 1 (the shield) → Act 2 (between sessions) →
Act 3 (the roster) → "next time on" → sign-off. Two devices tie it together: a TV that powers on
in the hero and switches off as you leave it, and a broadcast graphics package (channel bug,
lower-third, act bumpers). Every animation demonstrates the product (the marker is your progress,
the redaction is the shield, the popping card is tap-to-explain). Continuous, spatial things are
scroll-scrubbed; state changes are triggered and play on their own clock.

**Architecture.**

- **Server-rendered sections, tiny client islands.** `HomeView` and its sections are server
  components; only the progress-picker buttons, the progress line, the monitor's tilt/power
  behaviour (`TvStage`), the Act 1 scene (`LandingShield`), the real Animations setting
  (`MotionSwitch`) and image fallbacks hydrate. Story and Agent data used for decoration stay on
  the server.
- **CSS-first motion** in `apps/web/src/app/landing.css`, gated by `html[data-motion]`, which the
  boot script sets before the first paint. The hero entrance is CSS keyframes, so it starts at first
  paint, runs on the compositor while React hydrates, and never starts invisible (rule 7).
- **The HTML is the final frame.** Arrival animations only run on blocks that `LandingArm`
  marks `data-armed` (below the fold when the page mounted); they wait on their first frame and
  play once when `data-inview` is set. Without JavaScript, above the fold, or with motion off,
  everything is simply there.
- **Scroll-driven effects use CSS scroll-driven animations** (`animation-timeline: view()`) inside
  `@supports`: the hero's exit parallax, the manifesto's word-by-word lighting, Act 1's rotate-in
  and the roster rows. Browsers without support get the static end state, not a JavaScript
  fallback.
- **Act 1 is the only scripted scene in JavaScript**: desktop with full motion pins it (240vh,
  sticky stage) and maps scroll progress to a scene with `sceneAt`; phones keep the mock sticky
  under the header and the caption in view picks the scene. The script is pure and unit-tested
  (`lib/shield-scene.ts`).
- **Mocks are product shots.** They use the app's real tokens and components at real density,
  scaled as a picture (never reflowed), and they are `inert`: hidden from assistive technology,
  not focusable, out of contrast checks. They never show story text: placeholder bars and the
  protagonists' names only.
- **The feature registry places each feature in an act** (`act: 'shield' | 'bento' | 'roster' |
'next'`). Every entry renders exactly once with `data-feature-id` (E2E and Storybook check it), so
  the landing still reflects the registry (AGENTS.md "Docs that must stay in sync").
- The header ticker is hidden on the home page only (`body:has([data-landing])`).

## Consequences

- New motion on the landing page goes in `landing.css` (transform, opacity and clip-path only),
  gated by `data-motion`, and in its final frame by default. No new client components for
  decoration.
- Decorative text must still pass contrast (axe checks `aria-hidden` text) unless it sits inside an
  `inert` mock or is drawn by a pseudo-element (`BigMark`).
- Firefox shows the static versions of the scroll-driven effects until it supports them.
- A new feature in the registry needs an `act`; a bento feature without a tailored tile still gets
  a plain one.
