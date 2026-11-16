/**
 * Lighthouse CI — a quality gate before anything is merged into `main` (see AGENTS.md).
 * Audits the static export (`pnpm build:static` → apps/web/out) with Lighthouse's default
 * mobile emulation, as a first-time visitor would see each page.
 *
 *   pnpm lighthouse          # build the static site, then audit it
 *   pnpm lighthouse:audit    # audit an existing apps/web/out
 */
module.exports = {
  ci: {
    collect: {
      staticDistDir: './apps/web/out',
      // LHCI serves staticDistDir itself and rewrites "localhost" to its own port.
      url: [
        'http://localhost/en/',
        'http://localhost/en/recap/',
        'http://localhost/en/characters/',
        'http://localhost/en/glossary/',
        'http://localhost/pt-BR/recap/',
      ],
      numberOfRuns: 3,
      settings: {
        // CI runners have no sandbox user namespace.
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median-run' }],
        'categories:accessibility': ['error', { minScore: 1 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
      },
    },
    upload: {
      // Reports stay on the machine / CI artifacts — nothing is sent to a public server.
      target: 'filesystem',
      outputDir: './.lighthouseci/reports',
    },
  },
}
