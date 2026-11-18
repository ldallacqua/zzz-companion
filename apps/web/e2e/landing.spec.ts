import { expect, test, type Page } from '@playwright/test'
import { seedProgress } from './helpers'

/** Waits for the running, finite, time-based animations (the intro) to finish. Loops, scroll-driven
 * animations and arrivals still waiting for their block are ignored. */
async function introDone(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter(
          (a) =>
            a.timeline === document.timeline &&
            a.playState === 'running' &&
            a.effect?.getComputedTiming().iterations !== Infinity,
        )
        .map((a) => a.finished.catch(() => undefined)),
    ),
  )
}

const overflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

test.describe('landing page', () => {
  for (const [locale, progress] of [
    ['en', null],
    ['pt-BR', 'i2b-farewell'],
  ] as const) {
    test(`no horizontal overflow with full motion after the intro (${locale})`, async ({
      page,
    }) => {
      await seedProgress(page, progress, { motion: 'full' })
      await page.goto(`/${locale}/`)
      await page.waitForLoadState('networkidle')
      await introDone(page)
      expect(await overflow(page)).toBeLessThanOrEqual(0)
    })
  }

  test('the Animations setting fits its tile at 360px in Portuguese', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    await seedProgress(page, null)
    await page.goto('/pt-BR/')
    const tile = page.locator('[data-feature-id="motion"]')
    await tile.scrollIntoViewIfNeeded()
    const box = (await tile.boundingBox())!
    const radios = tile.getByRole('radio')
    await expect(radios).toHaveCount(4)
    for (const radio of await radios.all()) {
      const r = (await radio.boundingBox())!
      expect(r.x).toBeGreaterThanOrEqual(box.x)
      expect(r.x + r.width).toBeLessThanOrEqual(box.x + box.width)
    }
  })

  test('changing the Animations setting on the page keeps it in view', async ({ page }) => {
    await seedProgress(page, null, { motion: 'full' })
    await page.goto('/en/')
    const tile = page.locator('[data-feature-id="motion"]')
    // Jump there (full motion scrolls smoothly) and let the tile's arrival finish before measuring.
    await tile.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await introDone(page)
    const off = tile.getByRole('radio', { name: 'Off' })
    const before = (await off.boundingBox())!.y
    await off.click()
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off')
    await page.waitForTimeout(300)
    const after = (await off.boundingBox())!.y
    expect(Math.abs(after - before)).toBeLessThan(40)
    await expect(off).toBeInViewport()
  })
})
