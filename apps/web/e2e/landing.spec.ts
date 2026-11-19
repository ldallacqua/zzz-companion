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

  for (const locale of ['en', 'pt-BR'] as const) {
    test(`Act 4 shows a build as an inert picture that fills its frame (${locale})`, async ({
      page,
    }) => {
      await seedProgress(page, null)
      await page.goto(`/${locale}/`)
      const act = page.getByTestId('landing-loadout')
      const shot = act.getByTestId('loadout-mock')
      await expect(shot).toHaveAttribute('inert', '')
      await expect(act.getByRole('link', { name: /builds/i })).toHaveAttribute(
        'href',
        new RegExp(`/${locale}/builds/?$`),
      )
      // The project's width, then one between the phone and `sm` designs (iPad Split View).
      for (const width of [page.viewportSize()!.width, 600]) {
        await page.setViewportSize({ width, height: 900 })
        const fit = await shot.evaluate((el) => {
          const s = el.querySelector<HTMLElement>('[data-shot]')!
          const frame = el.getBoundingClientRect()
          const picture = s.getBoundingClientRect()
          const scale = picture.width / s.offsetWidth
          const pad = parseFloat(getComputedStyle(s).paddingBottom) * scale
          const content = s.lastElementChild!.getBoundingClientRect()
          return {
            // The picture fills the frame: no empty panel beside or under it.
            gapRight: Math.abs(frame.width - picture.width),
            gapBottom: Math.abs(frame.height - picture.height),
            // The content ends inside the bottom padding, never on the frame's edge.
            intoPadding: content.bottom - (frame.bottom - pad),
          }
        })
        expect(fit.gapRight, `at ${width}`).toBeLessThanOrEqual(1)
        expect(fit.gapBottom, `at ${width}`).toBeLessThanOrEqual(1)
        expect(fit.intoPadding, `at ${width}`).toBeLessThanOrEqual(0.5)
      }
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

  test('switching motion back on never replays arrivals or moves the setting', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await seedProgress(page, null, { motion: 'full' })
    await page.goto('/en/')
    const tile = page.locator('[data-feature-id="motion"]')
    await tile.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }))
    await introDone(page)
    await expect(tile).not.toHaveAttribute('data-armed')
    for (const name of ['Off', 'Full', 'Reduced', 'Full']) {
      const radio = tile.getByRole('radio', { name })
      const before = (await radio.boundingBox())!.y
      await radio.click()
      await page.waitForTimeout(50)
      expect(await tile.evaluate((el) => getComputedStyle(el).opacity), name).toBe('1')
      await page.waitForTimeout(250)
      expect(Math.abs((await radio.boundingBox())!.y - before), name).toBeLessThanOrEqual(2)
    }
  })

  test('the Act 1 mock never outgrows its box while the scene plays (iPad Pro 13 landscape)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1376, height: 1032 })
    await seedProgress(page, null, { motion: 'full' })
    await page.goto('/en/')
    const track = page.locator('#how [class*="h-[240vh]"]')
    await expect(track).toHaveCount(1)
    for (const f of [0.1, 0.35, 0.5, 0.8, 1]) {
      await track.evaluate((el, f) => {
        const r = el.getBoundingClientRect()
        window.scrollTo({
          top: r.top + scrollY + f * (r.height - innerHeight),
          behavior: 'instant',
        })
      }, f)
      await page.waitForTimeout(600)
      const { mock, box } = await page.getByTestId('shield-mock').evaluate((el) => ({
        mock: el.getBoundingClientRect().height,
        box: el.parentElement!.parentElement!.getBoundingClientRect().height,
      }))
      expect(mock, `at ${f}`).toBeLessThanOrEqual(box + 1)
    }
  })
})
