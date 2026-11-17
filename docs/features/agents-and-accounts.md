# My Agents + accounts

The roster every future recommendation starts from: which Agents the player owns, and at what
Mindscape Cinema level. Architecture: [ADR 0011](../adr/0011-accounts-and-roster-sync.md).

## My Agents (`/[locale]/agents/`)

- Lists every released playable Agent from `@zzz/game` (newest first), as square icons with the
  short name, rank (S / A), attribute and specialty in the pt-BR client's terms.
- **Tap a tile to mark it owned / not owned.** Owned agents get their Mindscape level (M0–M6),
  set with a stepper on the tile; new picks start at M0.
- Filters: search (full or short name, either language, accents ignored), base attribute (Frost
  counts as Ice, Auric Ink as Ether, Honed Edge as Physical), specialty, rank, and a view switch
  (All / Owned / Missing). A counter shows owned / total.
- **Spoiler agents** (`spoiler: true`, e.g. Pyrois, who comes from a 3.0 story quest) are hidden
  until the reader taps "show" or owns them. No story text appears anywhere on this screen.
- Works without an account: the roster is saved in this browser. A sync status says where it
  lives (this device / saving / saved to the account / couldn't save → retry).

## Accounts (`/[locale]/account/`)

- **Create account**: Proxy name (1–32), email, password (8–128). **Sign in**: email + password.
- Signing in merges the device's roster into the account (union, higher Mindscape wins) and
  saves it; from then on every change is saved to the account.
- Signed in: name and email, how many agents are saved, sign out, delete account (asks for the
  password; deletes the roster too).
- **Not in v1**: email verification and password reset (no mail service yet). The forms say so,
  so nobody is surprised.
- If the site was built without an API (`NEXT_PUBLIC_API_URL` unset) or the API can't be
  reached, the screen says accounts aren't available and the roster keeps working locally.
- Signing out (or an expired session) forgets the device copy; it stays in the account.

## Running it locally

```bash
pnpm dev:full   # web on :3000 + API on :8787 with a local SQLite file (apps/api/.data/dev.db)
```

## Tests

- `@zzz/game` content tests: ids, references, both locales, colour contrast, story ids.
- `@zzz/core`: roster schema, merge, comparison. `apps/web`: filter logic.
- `apps/api`: sign-up / sign-in / errors / CORS / roster isolation / validation / delete account
  / rate limiting, against a real SQLite file.
- E2E: guest roster (toggle, Mindscape, filters, reload), sign-up → sync → sign-out → sign-in on a
  fresh browser, against the real API (Playwright starts it with a throwaway database).
