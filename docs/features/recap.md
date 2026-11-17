# Feature spec — Story recap

## Goal

A returning player who forgot the plot can, in under a minute, set where they are and read what
happened so far — without seeing anything that comes later.

## User stories

- As a player, I pick the last part I finished (or "not started").
- I read the recap **Short** (one line per part) or in **Full**, in English or pt-BR.
- I see who was involved in each part, and a characters page / glossary limited to what I know.
- I recognise each part by the episode names my game client shows, in my language.
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
- A character's name never shows (avatars, cards) before the recap text has named them.
- Every part card is visible as soon as any of it is on screen, on any screen size and motion level.
- No horizontal overflow on mobile / tablet / desktop projects; no serious axe violations;
  keyboard focus is visible on every control; tap targets are at least 40px.
- `pnpm verify` passes.

## Out of scope (later)

Agent Stories and events as optional tracks · "ask about the story" (RAG, gated before retrieval) ·
relationship map · offline PWA.
