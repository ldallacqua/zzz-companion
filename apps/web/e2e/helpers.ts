import type { Page } from '@playwright/test'

const STORAGE_KEY = 'zzz-companion'

/**
 * Seeds local progress before the app first boots, like a returning player.
 * Init scripts re-run on every navigation, so only seed when nothing is stored yet —
 * otherwise reload tests would wipe what the app just saved.
 */
export async function seedProgress(
  page: Page,
  lastSegmentId: string | null,
  extra: Record<string, unknown> = {},
) {
  await page.addInitScript(
    ([key, state]) => {
      if (localStorage.getItem(key) === null) {
        localStorage.setItem(key, JSON.stringify({ state, version: 1 }))
      }
    },
    [STORAGE_KEY, { lastSegmentId, recapMode: 'full', motion: 'off', ...extra }] as const,
  )
}
