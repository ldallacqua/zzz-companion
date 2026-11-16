# 0002 — Spoiler gating

**Status:** accepted · 2026-11-16

## Context

The core promise is "nothing past where you are". Spoilers hide in more than the recap text:
character pages, faction names, glossary terms, even our own part titles and images.

## Decision

- The story is a single ordered list of **segments** (`buildTimeline`).
- Player progress = id of the last finished segment (`null` = nothing).
- Every gated entity carries `unlockedAt: SegmentId`; visibility is decided only by
  `isUnlocked` / `partitionUnlocked` / `getRecap` in `@zzz/core`.
- Content tests enforce: references exist, characters never appear in a segment before they unlock,
  factions are known before their members, both locales are present.
- The progress picker shows in-game episode names (what the player sees in the game) and reveals our
  own part titles only for finished parts. It asks players to expand only their current chapter.
- Locked items are shown as counts / anonymous placeholders, never names.

## Consequences

- Content is bundled to the client (local-first). A determined user can read ahead in DevTools;
  this protects against _accidental_ spoilers, which is the goal.
- A future "ask about the story" AI feature must apply the same filter **before retrieval**,
  never via prompt instructions.
