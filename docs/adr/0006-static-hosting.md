# 0006 — Static hosting on GitHub Pages

**Status:** accepted · 2026-11-16 · hosting superseded by [ADR 0012](0012-vercel-hosting.md) (the site stays a static export, now on Vercel); accounts are a separate API ([ADR 0011](0011-accounts-and-roster-sync.md))

## Context

The app is local-first with no server data, and should be free to host and easy to fork.

## Decision

- Ship a static export (`STATIC_EXPORT=true next build` → `apps/web/out`) deployed by
  `.github/workflows/deploy.yml` on every push to `main`. `BASE_PATH` is the repo sub-path.
- No middleware: `/` is a tiny static page that redirects to the saved locale, then the browser
  language, then English. The current locale is remembered in `localStorage` (`zzz-locale`).
- `trailingSlash: true` so every route is a folder with `index.html` (static-host friendly).
- Images are `unoptimized` (no image server; the art CDN also rejects proxies).

## Consequences

- No server features (middleware, route handlers, server actions). If accounts/sync arrive, they
  need a separate API or a different host — record that in a new ADR.
