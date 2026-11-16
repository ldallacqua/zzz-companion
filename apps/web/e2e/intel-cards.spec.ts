import { expect, test } from '@playwright/test'
import { seedProgress } from './helpers'

test.describe('intel cards (clickable names)', () => {
  test('tapping a term in the recap explains it', async ({ page }) => {
    await seedProgress(page, 'z-hollow-zero')
    await page.goto('/en/recap/')
    const hand = page.locator('[data-entity="term:hand"]').first()
    await hand.scrollIntoViewIfNeeded()
    await hand.click()
    const card = page.getByRole('dialog')
    await expect(card).toContainText('H.A.N.D.')
    await expect(card).toContainText('Government body')
  })

  test('tapping a character opens their card and links to the characters page', async ({
    page,
  }) => {
    await seedProgress(page, 'p-phaethon')
    await page.goto('/en/recap/')
    await page.locator('[data-entity="character:nicole"]').first().click()
    const card = page.getByRole('dialog')
    await expect(card).toContainText('Nicole Demara')
    await card.getByRole('link', { name: /See in Characters/ }).click()
    await expect(page).toHaveURL(/\/en\/characters\/#character-nicole$/)
  })

  test('never links entities the player has not unlocked', async ({ page }) => {
    await seedProgress(page, 'p-strongbox')
    await page.goto('/en/recap/')
    await expect(page.locator('[data-entity="term:dullahan"]')).toHaveCount(1)
    await expect(page.locator('[data-entity^="character:belle"]')).toHaveCount(0)
    await expect(page.locator('[data-entity="term:proxy"]')).toHaveCount(0)
  })

  test('glossary lists factions too', async ({ page }) => {
    await seedProgress(page, 'p-strongbox')
    await page.goto('/en/glossary/')
    await expect(page.locator('#faction-cunning-hares')).toContainText('odd-job agency')
  })
})

test.describe('static-host routing', () => {
  test('the root page redirects to a locale', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/en\/$/)
  })

  test('the landing page lists the features', async ({ page }) => {
    await seedProgress(page, null)
    await page.goto('/pt-BR/')
    const features = page.getByTestId('features')
    await expect(features).toContainText('Nomes clicáveis')
    await expect(features).toContainText('Conselheiro de pulls')
  })
})
