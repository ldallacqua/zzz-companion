# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Copilot, Gemini CLI…) and humans.
This is the single source of truth; tool-specific files only point here.

## What this is

**ZZZ Companion** — an unofficial, spoiler-safe companion web app for _Zenless Zone Zero_.
MVP feature: a story recap that stops exactly at the player's progress. Next: character builds and
pull (gacha) recommendations. See `docs/features/` for specs and `docs/adr/` for decisions.

## Commands (run from the repo root)

| Command                | What it does                                                                 |
| ---------------------- | ---------------------------------------------------------------------------- |
| `pnpm install`         | Install everything (pnpm workspaces)                                         |
| `pnpm dev`             | Start the web app at http://localhost:3000                                   |
| `pnpm verify`          | **Definition of done**: format check + typecheck + lint + unit/content tests |
| `pnpm test`            | Unit + content-integrity tests (Vitest)                                      |
| `pnpm e2e`             | Playwright E2E across mobile / tablet / desktop (+ axe a11y)                 |
| `pnpm build`           | Production build                                                             |
| `pnpm build:static`    | Static export for GitHub Pages (`apps/web/out`)                              |
| `pnpm screenshots`     | Regenerate README screenshots in `docs/assets` (needs `pnpm dev` running)    |
| `pnpm storybook`       | Storybook for every component at http://localhost:6006                       |
| `pnpm test:storybook`  | Run every story in Chromium: render + `play` + zero axe violations           |
| `pnpm build-storybook` | Static Storybook (deployed to `/storybook/` on GitHub Pages)                 |
| `pnpm lighthouse`      | Static build + Lighthouse CI with the thresholds in `lighthouserc.cjs`       |

Always run `pnpm verify` before you say a task is done. Run `pnpm e2e` and
`pnpm test:storybook` when you touch UI, and `pnpm lighthouse` before merging a feature.
Pushing to `main` deploys the static site to GitHub Pages (`.github/workflows/deploy.yml`).

## Repository map

```
apps/web            Next.js (App Router) — routes, screens, i18n. No domain logic here.
packages/core       Pure TypeScript domain: Zod schemas, timeline, spoiler gating. No React, no I/O.
packages/story      Story content (chapters, characters, glossary) validated against core schemas.
packages/ui         Design system: shadcn-style components + ZZZ tokens + motion primitives.
apps/web/.storybook Storybook config (stories live next to each component as *.stories.tsx).
docs/adr            Architecture Decision Records — read before changing architecture.
docs/features       Feature specs.
```

Dependency direction is one-way: `web → ui, story, core` · `story → core` · `core → (zod only)`.
Never import React or Next into `core` or `story`.

## Hard rules

1. **Spoiler gating lives in `@zzz/core`** (`getRecap`, `partitionUnlocked`, `isUnlocked`).
   UI code must never compare story orders itself.
2. **Every gated item has `unlockedAt`** pointing at the segment where the player learns it.
   Blurbs describe a character _as known at that point_ — never later facts. When the story
   changes what we know, add a `revisions` entry instead of editing the base text (see
   "Entries change as the story goes on" below).
3. **Story content must be researched, never written from memory.** Read the primary source
   (the episode transcripts on the community wiki) before writing or editing a summary, cite it
   in the chapter's `sources`, and mark thin coverage with `confidence: 'partial'`.
4. **Write summaries in your own words.** Do not paste game dialogue or wiki prose.
5. **Both locales, always.** Every user-facing string exists in `en` and `pt-BR`.
   Portuguese uses the game's official pt-BR terms (Esfera Negra, Etéreo, Interlaço, Caroteno…).
   UI strings live in `apps/web/messages/*.json`; content strings live next to the content.
6. **Never commit HoYoverse asset files.** Character art is referenced by URL only (see README).
   One approved exception: the game's "ZZ" logo mark (`apps/web/public/brand/zzz-mark.png`), used
   non-commercially with HoYoverse's legal statement in the footer — keep that statement whenever
   the mark is shown. Screenshots of the app's UI in `docs/assets` are fine.
7. **Motion must respect the user.** Every animation works with `data-motion="off" | "reduced"`.
   Looping/ambient CSS animations get the `motion-ambient` class. Use the presets in
   `packages/ui/src/lib/motion.ts` instead of ad-hoc timings. Above-the-fold content (titles,
   ledes, hero art) must never _start_ at `opacity: 0`: animate position/scale instead, so it
   paints with the HTML (Lighthouse LCP). Page transitions only run on client navigation.
8. **Mobile first.** No horizontal overflow at 360px; tap targets ≥ 40px; test at the
   Playwright projects' breakpoints.
9. **Static-host friendly.** The site ships as a static export (GitHub Pages): no middleware,
   route handlers, server actions or runtime server data. Links go through `@/i18n/navigation`
   so the base path is applied.

## Docs that must stay in sync (non-negotiable)

These are part of the definition of done — a change is not finished until they are updated.

1. **README.md is the project's storefront and must always be current.** Any change that affects
   what the app does, how to install/run/test/deploy it, its scripts, architecture, roadmap or
   licensing **updates README.md in the same change**. Keep its quality bar: banner, badges,
   screenshots, feature table, quick start, architecture. Regenerate screenshots
   (`pnpm screenshots`) when the UI they show changes noticeably.
2. **The landing page always reflects the most important features.** Every notable feature —
   shipped or planned — has an entry in `apps/web/src/lib/features.ts` (both locales). That
   registry renders the landing page "Features" section, so add/update/re-status the entry in the
   same change that ships the feature.
3. **README and the registry agree.** `apps/web/src/lib/features.test.ts` fails if README.md
   doesn't mention every registry entry by its English title — fix the README, never the test.
4. ADRs: a new architectural decision gets a new file in `docs/adr/`; a feature's behavior lives
   in `docs/features/`.

## Quality gates before merging to `main` (non-negotiable)

Work happens on a branch and lands through a pull request. Every gate below is a CI job
(`.github/workflows/ci.yml`); run them locally first.

1. **Storybook is always current.** Every component in `packages/ui/src/components` and
   `apps/web/src/components` (except the non-visual `providers.tsx`) has a sibling
   `*.stories.tsx` covering its main states (and interactions as `play` functions). A new or
   changed component updates its stories in the same change. `component-stories.test.ts` fails
   when a component has no stories. Published at `/storybook/` on every deploy.
2. **Every story passes its tests.** `pnpm test:storybook` runs each story in Chromium: it must
   render, pass its `play` function and have **zero axe violations** (`a11y.test = 'error'`,
   including colour contrast). Fix the component, never disable a rule to make it pass.
3. **Lighthouse runs before every merge of a feature into `main`.** `pnpm lighthouse` builds the
   static site and audits home, recap, characters and glossary (mobile emulation, median of 3).
   Thresholds (`lighthouserc.cjs`): Performance ≥ 90, Accessibility = 100, Best Practices ≥ 95,
   SEO ≥ 95. Never lower a threshold to merge; fix the regression.

## Recap intel cards (clickable names)

Names in recap text become tappable automatically (`@zzz/core` → `tokenizeRich`). To make a new
character, faction or term clickable, give it `aliases` (plurals, short names, pt-BR variants).
Only entities known at that point are linked, and only the first mention per block.
`content.test.ts` checks every glossary term is reachable from the recap text in both locales.

## Entries change as the story goes on (non-negotiable)

What a character, faction or term _is_ changes over the story: a client turns out to have a past,
a suspect is cleared, a company is exposed. Glossary and character texts are therefore
**time-aware**, and every place that shows them must use the right moment:

1. **Base text = what the reader knows at `unlockedAt`.** Later facts never go in it.
2. **Later knowledge goes in `revisions: [{ at, text }]`** (both locales), in story order, each
   `at` strictly after the previous one. Revisions are spoiler-gated like everything else and are
   researched and sourced like recap text (rules 3–4).
3. **Show the text for the right moment** with `knownTextAt` from `@zzz/core` — never read
   `blurb` / `definition` / `description` directly in UI:
   - inside the recap, a name tapped in part _N_ is explained **as of part _N_**
     (`RichBlock at={segment.id}`), even if the reader is further ahead — the card says
     "As of …";
   - the Characters page and Glossary use the reader's progress.
4. **No text may name anything the reader hasn't met by the time it's shown** — base texts at
   `unlockedAt`, revisions at `at`. `content.test.ts` enforces this with the same matcher the
   recap uses, plus the ordering rules above.

## Conventions

- TypeScript strict; ids are kebab-case; prefer data over enums for game concepts (the game keeps
  adding factions, specialties, etc.).
- Components: shadcn conventions (`cva` variants, `cn()`, Radix primitives via `radix-ui`).
- Styling: Tailwind v4 tokens from `packages/ui/src/styles.css` (`bg-surface`, `text-primary`,
  `chamfer`, `halftone`, `scanlines`, `display`…). No raw hex colors in components except content
  accents that come from data.
- Focus: a focusable element with a `chamfer*` clip-path adds `focus-inset` (the clip would cut an
  outer focus ring); on a lime fill also `focus-visible:outline-primary-foreground`.
- Scroll reveals wrap one card each, never a whole long list (`Reveal` fires when any part is on
  screen; a list taller than a phone would stay hidden). Reading text uses `riseInSolid`.
- Commits: Conventional Commits (`feat:`, `fix:`, `content:`, `docs:`…).

## Adding story content (checklist)

1. Research the episodes (transcripts) and list sources.
2. Add segments to a chapter file in `packages/story/src/chapters/` (or a new chapter appended in
   story order in `packages/story/src/index.ts`).
   Episode names go in both locales, as each game client shows them (the wiki's "Other
   Languages" table on the episode page).
3. Add new characters/glossary terms/factions with the correct `unlockedAt` and `aliases`.
   A character unlocks where the recap text first _names_ them, not where they first appear.
   If the new part changes what we know about an existing entry, add a `revisions` entry at the
   new segment (don't rewrite the base text).
4. `pnpm --filter @zzz/story test` — the content tests catch spoiler leaks, missing locales and
   broken references.
5. Update the coverage line on the landing page/README if the recap now covers more chapters.
