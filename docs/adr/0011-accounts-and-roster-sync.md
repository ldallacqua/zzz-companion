# ADR 0011 — Optional accounts and roster sync (Hono API + Better Auth + Turso)

- Status: accepted
- Date: 2026-11-17

## Context

Builds and pull advice (the roadmap's next features) need to know which Agents the player owns
and at what Mindscape level. Players use the app on a phone and on a desktop, so that roster
should follow them. ADR 0004 kept everything in the browser and said accounts would come "behind
the same store interface"; ADR 0006 said a server would have to be a separate API, because the
site is a static export (on GitHub Pages then; on Vercel since [ADR 0012](0012-vercel-hosting.md)).

## Decision

- **Game data** (Agents, attributes, specialties, agent factions) lives in a new package,
  `@zzz/game`, validated by schemas in `@zzz/core` (`AgentSchema`…). It is not story content:
  it isn't spoiler-gated by progress, except agents flagged `spoiler` (Pyrois comes from a 3.0
  story quest), which lists hide until the reader asks to see them or owns them. Agent ids match
  `@zzz/story` character ids, and a content test checks every playable story character has one.
- **The roster** is `agentId → Mindscape (0–6)`. Its schema, merge and comparison live in
  `@zzz/core` (`RosterSchema`, `mergeRosters`), shared by the web app and the API.
- **Local-first stays.** The roster works without an account (guest roster in `localStorage`,
  `zzz-roster`). An account is optional and only adds sync:
  - signing in merges the guest roster into the account (union, higher Mindscape wins) — a merge
    can't know which side is newer, and losing a pick is worse than keeping one;
  - while signed in, every edit is saved with a debounced whole-roster `PUT` (≈60 rows);
  - edits made offline are pushed on reconnect / retry;
  - signing out, an expired session or a deleted account forgets the device copy.
- **API: `apps/api`**, a Hono app (Web-standard fetch handler) with:
  - **Better Auth**, email + password (8–128 chars) and a display name ("Proxy name", 1–32).
    No email verification or password reset in v1: there is no mail service yet, and the UI says
    so. Delete-account (with password) removes the roster too. Rate limits are stored in the
    database so they hold across serverless instances. Telemetry off.
  - **Bearer tokens, not cookies.** The site and the API are on different sites (two
    `*.vercel.app` names are different sites: `vercel.app` is on the Public Suffix List);
    third-party cookies are blocked by Safari and Firefox. The `bearer` plugin returns the token
    in `set-auth-token`; the web app keeps it in `localStorage` (`zzz-account`) and sends
    `Authorization: Bearer`. Trade-off: a token in `localStorage` is readable by any script on the
    page (XSS). The site renders no user-generated HTML and loads no third-party scripts, which
    keeps that risk low; moving both to one site later (custom domain) would allow `HttpOnly`
    cookies instead.
  - CORS allows only `WEB_ORIGINS`; `GET/PUT /api/roster` require a session. (Story progress
    syncs too since [ADR 0014](0014-progress-sync.md): `GET/PUT /api/progress`.)
- **Database: Turso (libSQL)** through Drizzle ORM. SQLite-compatible, so development and tests
  use a local file (`file:./.data/dev.db`) with no account and no network. Migrations are SQL files
  in `apps/api/drizzle/`, generated from `src/db/schema.ts` and applied by `db:migrate` (and by the
  dev server on start).
- **Accounts are optional per build.** The web app reads `NEXT_PUBLIC_API_URL` at build time.
  Without it (forks, Lighthouse, Storybook) the account screens say accounts aren't available on
  this site, and the roster is local only. The deploy workflow takes it from the `API_URL`
  repository variable.
- **Hosting the API:** any host that runs a Hono fetch handler. The recommended one is **Vercel**
  (Node runtime, free hobby tier): password hashing (scrypt) needs more CPU than the free tier of
  edge runtimes such as Cloudflare Workers allows per request. The live API is the Vercel project
  `zzz-companion-api` (root directory `apps/api`), with its Turso database in São Paulo:
  - the production entry (`src/index.ts`) talks to Turso over HTTP (`@libsql/client/web`,
    `src/db/remote.ts`), so it loads no native module; the dev server, migrations and tests keep
    the Node client, which also opens local `file:` databases;
  - `scripts/build-vercel.mjs` bundles `src/vercel.ts` (the fetch handler adapted to Node's
    `req, res`) with esbuild into one function in Vercel's Build Output format, in region `gru1`
    next to the database, and routes every path to it. One self-contained file avoids depending on
    how Vercel resolves a pnpm workspace whose packages export TypeScript sources;
  - deploys run `vercel deploy --prod` from the repo root (the `.vercel/` link is not committed),
    after migrations are applied. Secrets live only in the project's environment variables.

## Consequences

- The static site keeps every guarantee it had (no server rendering, Lighthouse, offline reading).
  Pages that use the account render a generic shell and fill in after hydration.
- Pages that don't use the roster don't pay for it before their first paint: the sync loads in
  its own chunk after hydration, only on builds with an API (`account-sync-lazy.tsx`), and the
  header/settings import only the API's location (`api-config.ts`), never the client.
- There is now a server to run and a database to back up; both are free-tier sized.
- `localStorage` holds a session token. Signing out deletes it on the server and in the browser.
- Without password reset, a forgotten password means a new account; the sign-up form says so.
  Adding email (verification + reset) is the next step for accounts.
