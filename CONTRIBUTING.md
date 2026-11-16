# Contributing

Thanks for helping! Read [`AGENTS.md`](AGENTS.md) first — the same rules apply to humans and AI agents.

1. `pnpm install`, then `pnpm dev`.
2. Keep domain logic in `packages/core`, content in `packages/story`, UI primitives in `packages/ui`.
3. Story content: research the transcripts, write in your own words, cite sources, add both locales,
   set `unlockedAt` correctly. The content tests will tell you if something leaks.
4. Keep the docs in sync: update **README.md** and the landing page feature registry
   (`apps/web/src/lib/features.ts`) whenever a change affects them — see AGENTS.md.
5. Run `pnpm verify` (and `pnpm e2e` for UI work) before opening a PR. Use Conventional Commits.
