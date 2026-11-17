# ADR 0012 — Host the site, Storybook and API on Vercel

- Status: accepted
- Date: 2026-11-17
- Supersedes the hosting part of [ADR 0006](0006-static-hosting.md); the site stays a static export.

## Context

The accounts API already runs on Vercel ([ADR 0011](0011-accounts-and-roster-sync.md)). Keeping the
site on GitHub Pages meant two hosts, a deploy workflow to maintain, a `/zzz-companion` base path,
and no preview of a pull request before it lands. The owner's other projects already use Vercel's
Git integration with one project per deployable.

## Decision

- **Three Vercel projects on this repository**, each reading the `vercel.json` in its root
  directory:

  | Project                    | Root directory     | Serves                                      | Deploys                                     |
  | -------------------------- | ------------------ | ------------------------------------------- | ------------------------------------------- |
  | `zzz-companion-ldallacqua` | `apps/web`         | https://zzz-companion-ldallacqua.vercel.app | Git: `main` → production, PRs → previews    |
  | `zzz-companion-storybook`  | `deploy/storybook` | https://zzz-companion-storybook.vercel.app  | Git: `main` only (ignore step skips PRs)    |
  | `zzz-companion-api`        | `apps/api`         | https://zzz-companion-api.vercel.app        | By hand, after migrations (`vercel deploy`) |

- **The site is still a static export** (`pnpm build:static` → `apps/web/out`), served as static
  files with `trailingSlash`. It is the same artifact Lighthouse CI audits, and the app keeps every
  static-host rule (AGENTS.md rule 9), so moving hosts again stays cheap. No base path any more.
- **Production variables** live in the site project: `NEXT_PUBLIC_API_URL` (production only, so
  previews run with accounts off — the API's CORS accepts only the production origin) and
  `NEXT_PUBLIC_SITE_ORIGIN` (canonical and hreflang links).
- **Storybook is its own project** (as in the owner's other repos) rather than a `/storybook/`
  folder of the site: the site build stays fast and a Storybook failure can't block a site deploy.
- GitHub Pages and `.github/workflows/deploy.yml` are gone. CI (`ci.yml`) keeps every gate; Vercel
  only builds and serves.

## Consequences

- Every pull request gets a preview URL of the site (behind Vercel's deployment protection).
- `zzz-companion-ldallacqua.vercel.app` and `zzz-companion-api.vercel.app` are still different
  sites (`vercel.app` is on the Public Suffix List), so the bearer-token choice of ADR 0011 stands.
- The API is the one deploy that isn't automatic: a schema change must reach Turso first.
- After a merge, check that the commit's Vercel statuses are deployments, not "Canceled".
