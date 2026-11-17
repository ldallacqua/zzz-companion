import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.E2E_PORT ?? 3100)
const baseURL = `http://localhost:${PORT}`
/** The accounts API (apps/api) with its own throwaway SQLite file, so sign-up flows run for real. */
const API_PORT = Number(process.env.E2E_API_PORT ?? 8788)
const API_URL = `http://localhost:${API_PORT}`

/**
 * One project per major breakpoint. Chromium projects run everywhere;
 * WebKit (iPhone) runs in CI where all browsers are installed.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    locale: 'en-US',
  },
  projects: [
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
    {
      name: 'tablet',
      use: { ...devices['Desktop Chrome'], viewport: { width: 820, height: 1180 } },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    ...(process.env.CI ? [{ name: 'iphone', use: { ...devices['iPhone 14'] } }] : []),
  ],
  webServer: [
    {
      command: 'pnpm --filter @zzz/api start',
      url: `${API_URL}/api/health`,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
      env: {
        PORT: String(API_PORT),
        DATABASE_URL: 'file:./.data/e2e.db',
        BETTER_AUTH_URL: API_URL,
        WEB_ORIGINS: baseURL,
        AUTH_RATE_LIMIT: 'off',
      },
    },
    {
      command: `pnpm build && pnpm start -p ${PORT}`,
      url: `${baseURL}/en`,
      reuseExistingServer: !process.env.CI,
      timeout: 240_000,
      env: { NEXT_PUBLIC_API_URL: API_URL },
    },
  ],
})
