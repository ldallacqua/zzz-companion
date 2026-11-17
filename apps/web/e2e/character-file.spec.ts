import { expect, test } from '@playwright/test'
import { characters, charactersById } from '@zzz/story'
import { seedProgress } from './helpers'

const textOf = (id: string) => {
  const c = charactersById.get(id)!
  return { c, blurb: c.blurb, revisions: c.revisions }
}

test.describe('character file', () => {
  test('opens from the characters index', async ({ page }) => {
    await seedProgress(page, 'i2b-farewell')
    await page.goto('/en/characters/')
    await page.getByRole('link', { name: 'Nicole Demara', exact: true }).click()
    await expect(page).toHaveURL(/\/en\/characters\/nicole\/?$/)
    await expect(page.getByRole('heading', { level: 1, name: /Nicole Demara/ })).toBeVisible()
    await expect(page).toHaveTitle(/^Nicole Demara · Character file/)
  })

  test('a character not met yet is a generic locked file', async ({ page }) => {
    await seedProgress(page, 'c1a-client')
    await page.goto('/en/characters/koleda/')
    await expect(page.getByRole('heading', { level: 1, name: 'File locked' })).toBeVisible()
    const text = await page.locator('main').innerText()
    expect(text).not.toMatch(/Koleda|Belobog/)
    await expect(page).toHaveTitle(/^Character file/)
  })

  test('shows what the reader knows at their progress, never later notes', async ({ page }) => {
    const { revisions } = textOf('nekomata')
    const train = revisions.find((r) => r.at === 'c1b-train')!
    const butcher = revisions.find((r) => r.at === 'c1b-butcher')!
    await seedProgress(page, 'c1b-train')
    await page.goto('/en/characters/nekomata/')
    await expect(page.getByText(train.text.en)).toBeVisible()
    await expect(page.getByText(butcher.text.en)).toHaveCount(0)
  })

  test('"Appears in" links back to the part in the recap', async ({ page }) => {
    await seedProgress(page, 'i2b-farewell')
    await page.goto('/en/characters/koleda/')
    await page.getByRole('link', { name: /Part 1: Belobog Calls/ }).click()
    await expect(page).toHaveURL(/\/en\/recap\/#part-c2a-belobog$/)
    await expect(page.getByTestId('segment-c2a-belobog')).toBeInViewport()
  })

  test('the static HTML never contains anything about a character', async ({ request }) => {
    // The server renders the same generic shell for every id: names, texts and art only exist in
    // the client bundle, gated by the reader's progress.
    for (const locale of ['en', 'pt-BR'] as const) {
      for (const c of characters) {
        const html = await (await request.get(`/${locale}/characters/${c.id}/`)).text()
        const leaks = [
          c.name.en,
          c.name['pt-BR'],
          c.blurb[locale].slice(0, 40),
          ...c.revisions.map((r) => r.text[locale].slice(0, 40)),
          ...(c.image ? [new URL(c.image).pathname.split('/').slice(0, 5).join('/')] : []),
        ].filter((needle) => html.includes(needle))
        expect(leaks, `${locale}/${c.id}`).toEqual([])
      }
    }
  })

  test('fits a 360px screen in pt-BR (long faction names wrap)', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'one phone viewport is enough')
    await page.setViewportSize({ width: 360, height: 780 })
    await seedProgress(page, 'i2b-farewell')
    for (const id of ['miyabi', 'nekomata', 'bringer']) {
      await page.goto(`/pt-BR/characters/${id}/`)
      await page.waitForLoadState('networkidle')
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow, id).toBeLessThanOrEqual(0)
    }
  })
})
