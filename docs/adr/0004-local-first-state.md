# 0004 — Local-first state

**Status:** accepted · 2026-11-16 · extended by [ADR 0011](0011-accounts-and-roster-sync.md) (optional accounts sync the roster; everything still works without one)

## Decision

- User state (progress, recap mode, motion preference) lives in `localStorage` via Zustand
  `persist` (`apps/web/src/lib/store.ts`, key `zzz-companion`, versioned).
- `skipHydration` + explicit `rehydrate()` after mount keeps server and first client render
  identical; views wait for `hydrated` before showing progress-dependent content.
- A small inline script applies the saved motion preference before first paint.
- No accounts, no backend, no tracking in the MVP.

## Consequences

- Zero cost, private by default, works offline once loaded.
- Builds and pull advice will need roster/pity data; when cross-device sync is needed, add auth +
  Postgres behind the same store interface (new ADR).
