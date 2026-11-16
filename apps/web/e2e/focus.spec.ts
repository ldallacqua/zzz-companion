import { expect, test, type Locator, type Page } from '@playwright/test'
import { seedProgress } from './helpers'

/**
 * Keyboard focus must be *visible*, not just present in the computed style: on chamfered controls
 * the ring is drawn inside the shape, and a selected highlight drawn by a child layer can cover
 * it. These tests compare pixels with motion "full", where those highlight layers exist.
 */

/** Pixels that clearly changed between two PNGs (decoded in the page: no image library needed). */
function changedPixels(page: Page, a: Buffer, b: Buffer) {
  return page.evaluate(
    async ([a, b]) => {
      const pixels = async (base64: string) => {
        const img = new Image()
        img.src = `data:image/png;base64,${base64}`
        await img.decode()
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(img, 0, 0)
        return ctx.getImageData(0, 0, img.width, img.height).data
      }
      const [x, y] = await Promise.all([pixels(a), pixels(b)])
      let changed = 0
      const diff = (j: number) => Math.abs((x[j] ?? 0) - (y[j] ?? 0))
      for (let i = 0; i < Math.min(x.length, y.length); i += 4) {
        if (diff(i) + diff(i + 1) + diff(i + 2) > 96) changed++ // ignore anti-aliasing noise
      }
      return changed
    },
    [a.toString('base64'), b.toString('base64')] as const,
  )
}

async function expectVisibleFocus(
  page: Page,
  target: Locator,
  focusWithKeyboard: () => Promise<void>,
) {
  await page.mouse.move(0, 0)
  await page.waitForTimeout(400) // let the sliding highlight settle
  const blurred = await target.screenshot()
  await focusWithKeyboard()
  await expect(target).toBeFocused()
  await page.waitForTimeout(100)
  const focused = await target.screenshot()
  // A 2px ring around even a small control changes well over 80 pixels.
  expect(await changedPixels(page, blurred, focused), 'focus ring is not visible').toBeGreaterThan(
    80,
  )
}

test.describe('keyboard focus is visible', () => {
  test.beforeEach(({}, testInfo) => {
    test.skip(testInfo.project.name !== 'desktop', 'one viewport is enough')
  })

  test('on the selected option of the recap mode switch', async ({ page }) => {
    await seedProgress(page, 'i2b-farewell', { motion: 'full' })
    await page.goto('/en/recap/')
    const full = page.getByRole('radio', { name: 'Full' })
    await expect(full).toHaveAttribute('aria-checked', 'true')
    await expectVisibleFocus(page, full, async () => {
      // Arrow keys move focus within the group without changing the selection.
      await page.getByRole('radio', { name: 'TL;DR' }).focus()
      await page.keyboard.press('ArrowRight')
    })
  })

  test('on the active faction filter', async ({ page }) => {
    await seedProgress(page, 'i2b-farewell', { motion: 'full' })
    await page.goto('/en/characters/')
    const active = page.locator('button[aria-pressed="true"]').first()
    await expectVisibleFocus(page, active, async () => {
      await page.locator('button[aria-pressed="false"]').first().focus()
      await page.keyboard.press('Shift+Tab')
    })
  })

  test('returns to the button that opened a sheet', async ({ page }) => {
    await seedProgress(page, 'i2b-farewell', { motion: 'off' })
    await page.goto('/en/recap/')
    const change = page.getByRole('button', { name: 'Change progress' })
    await change.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('dialog')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByRole('dialog')).toHaveCount(0)
    await expect(change).toBeFocused()
  })
})
