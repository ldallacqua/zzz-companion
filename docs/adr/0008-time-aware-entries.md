# ADR 0008 — Time-aware glossary and character entries

- Status: accepted
- Date: 2026-11-16

## Context

Intel cards explain names inside the recap. But what a name means changes as the story goes on:
in Chapter 1A Nekomata is a mysterious client; by the end of Chapter 1B we know she grew up with
the Red Fang Gang and she has joined the Cunning Hares. One static description is either a spoiler
early on or stale later on — and a reader who is in Chapter 2 rereading Chapter 1 should see the
card as it was in Chapter 1.

## Decision

- Characters, factions and glossary terms keep their base text (known at `unlockedAt`) and gain
  optional `revisions: [{ at, text }]` — later versions, gated at the segment that reveals them.
- `knownTextAt(timeline, progress, base, revisions)` in `@zzz/core` picks the latest revision at
  or before a point in the story. Gating stays in core (ADR 0002); the UI never compares orders.
- **Inside the recap**, the point is the part being read: `RichBlock` / `EntityLink` receive
  `at={segment.id}`, which also limits which names are linked. Cards show "As of <part>".
  **Reference pages** (Characters, Glossary) use the reader's progress.
- Content tests enforce ordering (`at` strictly after the previous text) and that no text names an
  entity the reader hasn't met by the time it can be shown.

## Consequences

- Writers add knowledge instead of overwriting it; the history of an entry is explicit data.
- Revisions are content: researched, in both locales, in our own words, with sources (ADR 0003).
