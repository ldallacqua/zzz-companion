# ADR 0014 — Sync story progress with the account; the most recent choice wins

- Status: accepted
- Date: 2026-11-18
- Extends [ADR 0011](0011-accounts-and-roster-sync.md) (accounts and roster sync) and
  [ADR 0004](0004-local-first-state.md) (local-first state).

## Context

Accounts synced only the Agent roster. Story progress (the last part the reader finished) stayed
in each browser, so a reader who signed in on a tablet found the recap at "not started" even
though their phone was at Chapter 2. Progress is the app's core state; it should follow the
account like the roster does.

## Decision

- **The account stores one progress per player**: the last finished part (`null` = not started)
  and **when the reader set it** (`setAt`, ms, from their device). Table `progress` (migration
  `0001_progress`), endpoints `GET` / `PUT /api/progress` (session required). The schema and the
  comparison live in `@zzz/core` (`SavedProgressSchema`, `newerProgress`), shared by the API and
  the web app. Segment ids are checked for shape only, so an account written by a newer web
  build keeps parts this build doesn't know yet.
- **The most recent choice wins**, not the furthest part: readers move back on purpose (to
  re-read from an earlier part, or after setting the wrong part). The API keeps the stored copy
  when a `PUT` is older than it and answers with what it kept, so an old tab or a device that was
  offline can't roll a newer choice back. A tie keeps the account's copy.
- **The web app stamps every change** (`progressSetAt` in the `zzz-companion` store). Progress
  saved before this existed has no stamp and counts as the oldest choice: it is sent only to an
  account that has none.
- **Sync runs next to the roster sync** (`useProgressSync`, mounted by `<AccountSync>`): on sign-in
  the device and account copies are reconciled (save or adopt), and while signed in every change
  is saved after a short debounce. Signed out or offline, progress stays on the device as before;
  failures are silent and retried by the next change or sign-in. Signing out keeps the device's
  progress (unlike the roster, it is useful without an account). Deleting the account deletes its
  progress.

## Consequences

- The API must be deployed (migration first) before a web build that calls `/api/progress`; an
  older API answers 404, which the web app treats like being offline.
- Settings (language, motion, recap mode) still stay on the device.
