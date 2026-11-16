import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { seedProgress } from './helpers'

test.describe('recap', () => {
  test('shows an empty state and nothing spoilery before progress is set', async ({ page }) => {
    await seedProgress(page, null)
    await page.goto('/en/recap')
    await expect(page.getByRole('heading', { name: 'No spoilers yet' })).toBeVisible()
    await expect(page.getByTestId('recap-timeline')).toHaveCount(0)
  })

  test('never renders a part after the current progress (spoiler leak guard)', async ({ page }) => {
    await seedProgress(page, 'c1a-client')
    await page.goto('/en/recap')
    await expect(page.getByTestId('segment-c1a-client')).toBeVisible()
    await expect(page.getByTestId('segment-p-strongbox')).toBeVisible()
    await expect(page.getByTestId('segment-c1a-hideouts')).toHaveCount(0)
    await expect(page.getByText('Dead End Butcher')).toHaveCount(0)
    await expect(page.getByText('Koleda')).toHaveCount(0)
  })

  test('progress picked in the sheet persists across reloads', async ({ page }) => {
    await seedProgress(page, null)
    await page.goto('/en')
    await page.getByRole('button', { name: 'Set my progress' }).first().click()
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByRole('button', { name: /Business × Strangeness × Justness/ }).click()
    await dialog.getByTestId('pick-p-phaethon').click()
    await page.keyboard.press('Escape')
    await page.reload()
    await page.goto('/en/recap')
    await expect(page.getByTestId('segment-p-phaethon')).toBeVisible()
    await expect(page.getByTestId('segment-p-hacker')).toHaveCount(0)
  })

  test('switches between short and full modes', async ({ page }) => {
    await seedProgress(page, 'p-strongbox')
    await page.goto('/en/recap')
    await page.getByRole('radio', { name: 'Short' }).click()
    await expect(
      page.getByText('The Cunning Hares steal a mysterious strongbox back', { exact: false }),
    ).toBeVisible()
  })
})

test.describe('i18n & settings', () => {
  test('serves Brazilian Portuguese with official game terms', async ({ page }) => {
    await seedProgress(page, 'p-strongbox')
    await page.goto('/pt-BR/recap')
    await expect(page.getByRole('heading', { name: 'Sua história até aqui' })).toBeVisible()
    await expect(page.getByText('Esfera Negra').first()).toBeVisible()
  })

  test('motion preference is applied to the document', async ({ page }) => {
    await seedProgress(page, null, { motion: 'off' })
    await page.goto('/en')
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'off')
  })
})

test.describe('layout', () => {
  for (const path of ['/en', '/en/recap', '/en/characters', '/en/glossary']) {
    test(`no horizontal overflow on ${path}`, async ({ page }) => {
      await seedProgress(page, 'i2b-farewell')
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
    })
  }

  test('characters page only lists unlocked characters', async ({ page }) => {
    await seedProgress(page, 'p-phaethon')
    await page.goto('/en/characters')
    await expect(page.getByRole('heading', { name: 'Belle', exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Fairy', exact: true })).toHaveCount(0)
  })
})

test.describe('accessibility', () => {
  for (const path of ['/en', '/en/recap', '/en/characters', '/en/glossary']) {
    test(`has no serious axe violations on ${path}`, async ({ page }) => {
      await seedProgress(page, 'i2b-farewell')
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      // Includes colour contrast: the seed sets motion "off", so nothing is measured mid-fade.
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      const serious = results.violations.filter((v) =>
        ['serious', 'critical'].includes(v.impact ?? ''),
      )
      expect(
        serious,
        JSON.stringify(
          serious.map((v) => [v.id, v.nodes.length]),
          null,
          2,
        ),
      ).toEqual([])
    })
  }
})
