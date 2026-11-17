import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'
import { seedProgress } from './helpers'

/**
 * Regenerates the README screenshots (`pnpm screenshots`, with `pnpm dev` running).
 * Skipped in normal E2E runs.
 */
const out = (name: string) =>
  fileURLToPath(new URL(`../../../docs/assets/${name}`, import.meta.url))

test.skip(!process.env.SCREENSHOTS, 'Only runs via `pnpm screenshots`')

test('README screenshots', async ({ page }, testInfo) => {
  await seedProgress(page, 'i2b-farewell', { motion: 'off' })
  if (testInfo.project.name === 'desktop') {
    await page.setViewportSize({ width: 1280, height: 860 })
    await page.goto('/en/recap/')
    const segment = page.getByTestId('segment-z-hollow-zero')
    await segment.scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollBy(0, 160))
    await segment.locator('[data-entity="term:hand"]').click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.waitForLoadState('networkidle')
    await page.screenshot({ path: out('screenshot-recap.png') })

    await page.goto('/en/characters/nekomata/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)
    await page.screenshot({ path: out('screenshot-character.png') })
  } else {
    await page.goto('/pt-BR/recap/')
    await page
      .getByTestId('segment-c2b-monster')
      .evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 84))
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(400)
    await page.screenshot({ path: out('screenshot-mobile.png') })
  }
})
