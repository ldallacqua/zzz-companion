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
    // The landing page's cold open (returning reader: the monitor says where they are).
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/en/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(1200)
    await page.screenshot({ path: out('screenshot-landing.png') })

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

    // My Agents with a few owned, at different Mindscape levels (guest roster, nudge dismissed).
    await page.addInitScript(() => {
      const owned = { ellen: 2, miyabi: 0, 'zhu-yuan': 1, anby: 6, nicole: 6, lycaon: 1, qingyi: 0 }
      const state = { owned, owner: null, dirty: false, revealed: [], nudgeDismissed: true }
      localStorage.setItem('zzz-roster', JSON.stringify({ state, version: 1 }))
    })
    await page.goto('/en/agents/')
    await expect(page.getByTestId('owned-count')).toContainText('7', { timeout: 30_000 })
    await page.setViewportSize({ width: 1280, height: 900 })
    await page.getByRole('radio', { name: 'Owned', exact: true }).click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(800)
    await page.screenshot({ path: out('screenshot-agents.png') })
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
