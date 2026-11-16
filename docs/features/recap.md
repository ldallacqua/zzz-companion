# Feature spec — Story recap

## Goal

A returning player who forgot the plot can, in under a minute, set where they are and read what
happened so far — without seeing anything that comes later.

## User stories

- As a player, I pick the last part I finished (or "not started").
- I read the recap in **TL;DR** (one line per part) or **Full** mode, in English or pt-BR.
- I see who was involved in each part, and a characters page / glossary limited to what I know.
- I tap a name in the recap and get an intel card that explains it **as of that part** of the
  story — even if I'm further ahead, a Chapter 1 card never uses Chapter 2 facts.
- I can turn animations off or down.

## Scope (v1)

Prologue → Chapter 1 (A/B) → The Zero Zone → Chapter 2 (A/B) → Chapter 2 Interlude (A/B):
21 parts. Coverage is shown on the home page.

## Acceptance criteria

- With no progress set, no story content is rendered anywhere.
- With progress at part _N_, parts _> N_ never render (E2E "spoiler leak guard").
- Progress persists across reloads; switching language keeps progress.
- Intel cards inside part _N_ use `knownTextAt` at part _N_ and say "As of …"; Characters and
  Glossary use the reader's progress (ADR 0008).
- No horizontal overflow on mobile / tablet / desktop projects; no serious axe violations.
- `pnpm verify` passes.

## Out of scope (later)

Agent Stories and events as optional tracks · "ask about the story" (RAG, gated before retrieval) ·
relationship map · offline PWA.
