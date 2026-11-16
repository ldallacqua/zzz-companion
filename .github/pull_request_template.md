## What & why

## Checklist

- [ ] `pnpm verify` passes
- [ ] UI changes checked on mobile / tablet / desktop (and `pnpm e2e` when relevant)
- [ ] **Storybook updated**: new/changed components have stories, and `pnpm test:storybook` passes (zero axe violations)
- [ ] **Lighthouse**: `pnpm lighthouse` passes (no regression in Performance, Accessibility, Best Practices, SEO)
- [ ] New knowledge about an existing character/term/faction is a `revisions` entry, shown via `knownTextAt`
- [ ] New strings exist in `en` and `pt-BR`
- [ ] Story content was researched from sources (listed in the chapter) and is spoiler-gated
- [ ] Animations work with motion set to Reduced and Off
- [ ] **README.md updated** if this changes features, setup, scripts, architecture or roadmap
- [ ] **Landing page updated**: notable features added/updated in `apps/web/src/lib/features.ts`
