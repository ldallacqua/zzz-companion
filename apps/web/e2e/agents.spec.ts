import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { agentsById } from '@zzz/game'
import { seedProgress } from './helpers'

/** Tiles are native checkboxes (visually hidden); the label is what people tap. */
const tile = (page: Page, id: string) => page.locator(`label[for="own-${id}"]`)
const box = (page: Page, id: string) => page.getByTestId(`agent-${id}`)

/**
 * Opens the page and waits for hydration (the grid drops `aria-busy`). Typing into the search box
 * before React hydrates fires no onChange, which slower engines (WebKit in CI) hit.
 */
async function open(page: Page, path: string) {
  await page.goto(path)
  await expect(page.locator('[aria-busy]')).toHaveCount(0)
}

test.describe('My Agents (guest)', () => {
  test.beforeEach(async ({ page }) => {
    await seedProgress(page, null)
  })

  test('ticks agents and keeps them across reloads', async ({ page }) => {
    await page.goto('/en/agents')
    await expect(page.getByText('Start here')).toBeVisible()
    await tile(page, 'ellen').click()
    await tile(page, 'anby').click()
    await expect(box(page, 'ellen')).toBeChecked()
    await expect(page.getByTestId('owned-count')).toContainText('2')
    await expect(page.getByTestId('sync-chip')).toHaveAttribute('data-sync', 'local')

    await page.reload()
    await expect(box(page, 'ellen')).toBeChecked()
    await expect(box(page, 'anby')).toBeChecked()
    await expect(box(page, 'miyabi')).not.toBeChecked()
  })

  test('sets Mindscape from the strip, and remembers it when re-ticked', async ({ page }) => {
    await page.goto('/en/agents')
    await tile(page, 'ellen').click()
    await page.getByRole('button', { name: 'Ellen: Mindscape M0. Change' }).click()
    await page
      .getByRole('dialog', { name: 'Mindscape · Ellen' })
      .getByRole('radio', { name: 'M3' })
      .click()
    await expect(page.getByRole('button', { name: 'Ellen: Mindscape M3. Change' })).toBeVisible()

    await tile(page, 'ellen').click() // un-own
    await expect(box(page, 'ellen')).not.toBeChecked()
    await tile(page, 'ellen').click() // re-own this visit → M3 again
    await expect(page.getByRole('button', { name: 'Ellen: Mindscape M3. Change' })).toBeVisible()
  })

  test('search narrows the list; Mark all and Undo', async ({ page }) => {
    await open(page, '/en/agents')
    await page.getByRole('searchbox', { name: 'Search Agents' }).fill('soldier')
    await expect(page.getByText('2 Agents', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: /^Mark all \(2\)/ }).click()
    await expect(box(page, 'soldier-11')).toBeChecked()
    await expect(box(page, 'soldier-0-anby')).toBeChecked()
    await page.getByRole('button', { name: /^Undo/ }).click()
    await expect(box(page, 'soldier-11')).not.toBeChecked()
  })

  test('Enter in search toggles a single match', async ({ page }) => {
    await open(page, '/en/agents')
    const search = page.getByRole('searchbox', { name: 'Search Agents' })
    await search.fill('lycaon')
    await search.press('Enter')
    await expect(box(page, 'lycaon')).toBeChecked()
  })

  test('the spoiler agent is classified until revealed, and absent from the HTML', async ({
    page,
    request,
  }) => {
    const pyrois = agentsById.get('pyrois')!
    for (const locale of ['en', 'pt-BR']) {
      const html = await (await request.get(`/${locale}/agents/`)).text()
      expect(html).not.toContain('Pyrois')
      expect(html).not.toContain(pyrois.icon.split('/revision')[0]!.split('/').pop()!)
    }
    await page.goto('/en/agents')
    await expect(page.getByTestId('agent-pyrois')).toHaveCount(0)
    await page.getByRole('button', { name: /Hidden Agent/ }).click()
    await page.getByRole('button', { name: 'Show', exact: true }).click()
    await expect(box(page, 'pyrois')).toHaveCount(1)
  })

  test('works in Portuguese with the pt-BR client terms', async ({ page }) => {
    await open(page, '/pt-BR/agents')
    await expect(page.getByRole('heading', { name: 'Meus Agentes' })).toBeVisible()
    await page.getByRole('searchbox', { name: 'Buscar Agentes' }).fill('gatilho')
    await expect(page.getByRole('checkbox', { name: 'Gatilho' })).toHaveCount(1)
  })

  test('has no horizontal overflow and no axe violations', async ({ page }) => {
    await page.goto('/en/agents')
    await tile(page, 'ellen').click()
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    expect(overflow).toBeLessThanOrEqual(0)
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const serious = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? ''),
    )
    expect(serious).toEqual([])
  })
})

test('the tab bar / nav reaches My Agents', async ({ page }) => {
  await seedProgress(page, null)
  await page.goto('/en')
  await page.getByRole('link', { name: 'Agents', exact: true }).locator('visible=true').click()
  await expect(page).toHaveURL(/\/en\/agents\/$/)
  expect(agentsById.size).toBeGreaterThan(50)
})
