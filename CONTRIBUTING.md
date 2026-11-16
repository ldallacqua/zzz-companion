# Contributing

Thanks for helping! Read [`AGENTS.md`](AGENTS.md) first — the same rules apply to humans and AI agents.

1. `pnpm install`, then `pnpm dev`.
2. Keep domain logic in `packages/core`, content in `packages/story`, UI primitives in `packages/ui`.
3. Story content: research the transcripts, write in your own words, cite sources, add both locales,
   set `unlockedAt` correctly. The content tests will tell you if something leaks.
4. Keep the docs in sync: update **README.md** and the landing page feature registry
   (`apps/web/src/lib/features.ts`) whenever a change affects them — see AGENTS.md.
5. Work on a branch and open a PR. Before it, run `pnpm verify`; for UI work also `pnpm e2e` and
   `pnpm test:storybook` (every component needs stories, and every story must pass with zero axe
   violations); and run `pnpm lighthouse` before a feature is merged. CI runs all of them.
   Use Conventional Commits.
6. Glossary and character texts change over time: add `revisions` instead of rewriting them, and
   show them with `knownTextAt` (see AGENTS.md → "Entries change as the story goes on").
