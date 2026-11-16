# ADR 0009 — A UI/UX expert review for every feature, and CI required on `main`

- Status: accepted
- Date: 2026-11-16

## Context

Automated gates (ADR 0007) prove that components render, pass axe and keep Lighthouse scores.
They can't say whether a screen is _good_: clear hierarchy, sensible empty states, copy that reads
well in both languages, motion that helps instead of distracting. Most changes here are written
by AI agents, so a design review has to be cheap to run and the same every time. Separately, the
CI gates were documented as mandatory but GitHub didn't enforce them.

## Decision

- **One UI/UX review per feature.** After a feature (or a noticeable change to a screen) is
  built, a single reviewer agent runs with the instructions in `.claude/agents/ux-reviewer.md`: a
  senior product designer persona with this project's checklist (hierarchy, consistency, type,
  tokens, states, responsive, motion, accessibility, en/pt-BR microcopy, spoiler safety). It is
  read-only and returns issues ordered by severity with exact fixes, plus a `READY TO SHIP` /
  `NOT READY` verdict. One reviewer, not a panel: one consistent voice, low cost.
- The file lives in `.claude/agents/` so Claude Code picks it up as the `ux-reviewer` subagent;
  other tools use the file's body as the prompt of a fresh agent. It is the only copy of the
  reviewer's instructions.
- Blockers and Highs are fixed before merging; the PR records the verdict.
- **Branch protection on `main`** requires the CI checks `verify`, `e2e`,
  `storybook (stories + a11y)` and `lighthouse`. Auto-merge is enabled, so a PR can be queued and
  merges itself once they pass.

## Consequences

- Every feature PR waits for one extra review run, and its fixes.
- The review is a judgment, not a test: it isn't a CI job and can't block a merge by itself.
  The PR template's "UX review" section keeps it visible.
