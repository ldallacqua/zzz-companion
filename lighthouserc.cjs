/**
 * Lighthouse CI — a quality gate before anything is merged into `main` (see AGENTS.md).
 * Audits the static export (`pnpm build:static` → apps/web/out) with Lighthouse's default
 * mobile emulation, as a first-time visitor would see each page.
 *
 *   pnpm lighthouse          # build the static site, then audit it
 *   pnpm lighthouse:audit    # audit an existing apps/web/out
 */
const QUALITY = {
  // The median of the 3 scores. Not 'median-run': that keeps the run nearest the median first
  // paint and time-to-interactive whatever its score, so one outlier run (a simulated LCP of 4 s
  // on a page that painted in 0.2 s) could fail a PR at random.
  'categories:performance': ['error', { minScore: 0.9, aggregationMethod: 'median' }],
  'categories:accessibility': ['error', { minScore: 1 }],
  'categories:best-practices': ['error', { minScore: 0.95 }],
}

/** Character files (/characters/<id>/) are noindex on purpose (ADR 0010). */
const CHARACTER_FILE = '/characters/[^/]+/$'

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
        // A character file as a first-time visitor sees it (the generic locked shell).
        'http://localhost/en/characters/nicole/',
      ],
      numberOfRuns: 3,
      settings: {
        // CI runners have no sandbox user namespace.
        chromeFlags: '--no-sandbox --headless=new',
      },
    },
    assert: {
      assertMatrix: [
        {
          matchingUrlPattern: `^(?!.*${CHARACTER_FILE}).*$`,
          assertions: { ...QUALITY, 'categories:seo': ['error', { minScore: 0.95 }] },
        },
        {
          // Lighthouse's SEO score penalises noindex; every other gate still applies.
          matchingUrlPattern: CHARACTER_FILE,
          assertions: QUALITY,
        },
      ],
    },
    upload: {
      // Reports stay on the machine / CI artifacts — nothing is sent to a public server.
      target: 'filesystem',
      outputDir: './.lighthouseci/reports',
    },
  },
}
