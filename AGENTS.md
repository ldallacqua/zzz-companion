# AGENTS.md

Instructions for AI coding agents (Claude Code, Codex, Cursor, Copilot, Gemini CLI…) and humans.
This is the single source of truth; tool-specific files only point here.

## What this is

**ZZZ Companion** — an unofficial, spoiler-safe companion web app for _Zenless Zone Zero_.
MVP feature: a story recap that stops exactly at the player's progress. Next: character builds and
pull (gacha) recommendations. See `docs/features/` for specs and `docs/adr/` for decisions.

## Commands (run from the repo root)

| Command             | What it does                                                                 |
| ------------------- | ---------------------------------------------------------------------------- |
| `pnpm install`      | Install everything (pnpm workspaces)                                         |
| `pnpm dev`          | Start the web app at http://localhost:3000                                   |
| `pnpm verify`       | **Definition of done**: format check + typecheck + lint + unit/content tests |
| `pnpm test`         | Unit + content-integrity tests (Vitest)                                      |
| `pnpm e2e`          | Playwright E2E across mobile / tablet / desktop (+ axe a11y)                 |
| `pnpm build`        | Production build                                                             |
| `pnpm build:static` | Static export for GitHub Pages (`apps/web/out`)                              |
| `pnpm screenshots`  | Regenerate README screenshots in `docs/assets` (needs `pnpm dev` running)    |

Always run `pnpm verify` before you say a task is done. Run `pnpm e2e` when you touch UI.
Pushing to `main` deploys the static site to GitHub Pages (`.github/workflows/deploy.yml`).

## Repository map

```
apps/web            Next.js (App Router) — routes, screens, i18n. No domain logic here.
packages/core       Pure TypeScript domain: Zod schemas, timeline, spoiler gating. No React, no I/O.
packages/story      Story content (chapters, characters, glossary) validated against core schemas.
packages/ui         Design system: shadcn-style components + ZZZ tokens + motion primitives.
docs/adr            Architecture Decision Records — read before changing architecture.
docs/features       Feature specs.
```

Dependency direction is one-way: `web → ui, story, core` · `story → core` · `core → (zod only)`.
Never import React or Next into `core` or `story`.

## Hard rules

1. **Spoiler gating lives in `@zzz/core`** (`getRecap`, `partitionUnlocked`, `isUnlocked`).
   UI code must never compare story orders itself.
2. **Every gated item has `unlockedAt`** pointing at the segment where the player learns it.
   Blurbs describe a character _as known at that point_ — never later facts.
3. **Story content must be researched, never written from memory.** Read the primary source
   (the episode transcripts on the community wiki) before writing or editing a summary, cite it
   in the chapter's `sources`, and mark thin coverage with `confidence: 'partial'`.
4. **Write summaries in your own words.** Do not paste game dialogue or wiki prose.
5. **Both locales, always.** Every user-facing string exists in `en` and `pt-BR`.
   Portuguese uses the game's official pt-BR terms (Esfera Negra, Etéreo, Interlaço, Caroteno…).
   UI strings live in `apps/web/messages/*.json`; content strings live next to the content.
6. **Never commit HoYoverse asset files.** Character art is referenced by URL only (see README).
   Screenshots of the app's UI in `docs/assets` are fine.
7. **Motion must respect the user.** Every animation works with `data-motion="off" | "reduced"`.
   Looping/ambient CSS animations get the `motion-ambient` class. Use the presets in
   `packages/ui/src/lib/motion.ts` instead of ad-hoc timings.
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

## Recap intel cards (clickable names)

Names in recap text become tappable automatically (`@zzz/core` → `tokenizeRich`). To make a new
character, faction or term clickable, give it `aliases` (plurals, short names, pt-BR variants).
Only entities unlocked for the player are linked, and only the first mention per block.
`content.test.ts` checks every glossary term is reachable from the recap text in both locales.

## Conventions

- TypeScript strict; ids are kebab-case; prefer data over enums for game concepts (the game keeps
  adding factions, specialties, etc.).
- Components: shadcn conventions (`cva` variants, `cn()`, Radix primitives via `radix-ui`).
- Styling: Tailwind v4 tokens from `packages/ui/src/styles.css` (`bg-surface`, `text-primary`,
  `chamfer`, `halftone`, `scanlines`, `display`…). No raw hex colors in components except content
  accents that come from data.
- Commits: Conventional Commits (`feat:`, `fix:`, `content:`, `docs:`…).

## Adding story content (checklist)

1. Research the episodes (transcripts) and list sources.
2. Add segments to a chapter file in `packages/story/src/chapters/` (or a new chapter appended in
   story order in `packages/story/src/index.ts`).
3. Add new characters/glossary terms/factions with the correct `unlockedAt` and `aliases`.
4. `pnpm --filter @zzz/story test` — the content tests catch spoiler leaks, missing locales and
   broken references.
5. Update the coverage line on the landing page/README if the recap now covers more chapters.
