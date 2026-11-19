import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { agentsById, wEnginesById } from '@zzz/game'
import { seedProgress } from './helpers'

/** A guest roster on this device, as My Agents would have saved it. */
async function seedRoster(page: Page, owned: Record<string, number>) {
  await page.addInitScript((o) => {
    if (localStorage.getItem('zzz-roster') === null) {
      const state = { owned: o, owner: null, dirty: false, revealed: [], nudgeDismissed: true }
      localStorage.setItem('zzz-roster', JSON.stringify({ state, version: 1 }))
    }
  }, owned)
}

/** Opens the page and waits for the roster to hydrate (nothing is aria-busy any more). */
async function open(page: Page, path: string) {
  await page.goto(path)
  await expect(page.locator('[aria-busy]')).toHaveCount(0)
}

async function expectNoSeriousA11yIssues(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
  const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact ?? ''))
  expect(serious).toEqual([])
}

const overflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)

test.describe('Builds', () => {
  test.beforeEach(async ({ page }) => {
    await seedProgress(page, null)
  })

  test('the index lists every Agent, with the player’s own first', async ({ page }) => {
    await open(page, '/en/builds')
    await expect(page.getByRole('heading', { level: 1, name: 'Builds' })).toBeVisible()
    await expect(page.getByTestId('builds-hint')).toBeVisible()
    await expect(page.getByTestId('builds-yours')).toHaveCount(0)

    await page.evaluate(() =>
      localStorage.setItem(
        'zzz-roster',
        JSON.stringify({ state: { owned: { ellen: 2, caesar: 6 }, revealed: [] }, version: 1 }),
      ),
    )
    await open(page, '/en/builds')
    const yours = page.getByTestId('builds-yours')
    await expect(yours.getByRole('link')).toHaveCount(2)
    await expect(yours.getByText('M2')).toBeVisible()
    await expect(page.getByTestId('builds-hint')).toHaveCount(0)

    await page.getByTestId('build-tile-caesar').click()
    await expect(page).toHaveURL(/\/en\/builds\/caesar\/$/)
    await expect(page.getByTestId('roster-row')).toContainText('M6')
  })

  test('marking W-Engines points out the best one you have, and is remembered', async ({
    page,
  }) => {
    await seedRoster(page, { ellen: 0 })
    await open(page, '/en/builds/ellen/')
    await expect(page.getByTestId('loadout-board')).toBeVisible()
    await expect(page.getByTestId('best-you-have')).toHaveCount(0)

    await page.getByRole('button', { name: 'I have it: Myriad Eclipse' }).click()
    await expect(page.getByTestId('best-you-have')).toHaveText('Best you have: Myriad Eclipse · #2')
    await page.reload()
    await expect(page.getByTestId('best-you-have')).toHaveText('Best you have: Myriad Eclipse · #2')

    // Owning the top pick needs no call-out.
    await page.getByRole('button', { name: 'I have it: Deep Sea Visitor' }).click()
    await expect(page.getByTestId('best-you-have')).toHaveCount(0)
  })

  test('“I have this Agent” adds them to My Agents', async ({ page }) => {
    await open(page, '/en/builds/miyabi/')
    await page.getByRole('button', { name: 'I have this Agent' }).click()
    await expect(page.getByTestId('roster-row')).toContainText('In My Agents · M0')
    await expect(page.getByTestId('roster-row').getByRole('link')).toBeFocused()
    await page.goto('/en/agents/')
    await expect(page.getByTestId('agent-miyabi')).toBeChecked()
  })

  test('variants switch in place and each has a link', async ({ page }) => {
    await open(page, '/en/builds/caesar/')
    const slot4 = page.getByTestId('slot-4')
    await expect(slot4).toContainText('CRIT Rate')
    await expect(page.getByTestId('variant-diff')).toContainText('slot 4 and substats')
    await page.getByRole('radio', { name: 'Anomaly' }).click()
    await expect(slot4).toContainText('Anomaly Prof.')
    await expect(page).toHaveURL(/\/en\/builds\/caesar\/#anomaly$/)

    await open(page, '/en/builds/caesar/#anomaly')
    await expect(page.getByRole('radio', { name: 'Anomaly' })).toBeChecked()
    await expect(page.getByTestId('slot-4')).toContainText('Anomaly Prof.')
  })

  test('a spoiler Agent stays classified, and out of the HTML', async ({ page, request }) => {
    const pyrois = agentsById.get('pyrois')!
    const signature = wEnginesById.get('sol-exuvia')!
    const needles = ['Pyrois', signature.name.en, pyrois.icon.split('/revision')[0]!]
    for (const locale of ['en', 'pt-BR']) {
      for (const path of ['builds/pyrois/', 'builds/', 'builds/severian/']) {
        const html = await (await request.get(`/${locale}/${path}`)).text()
        expect(
          needles.filter((n) => html.includes(n)),
          `${locale}/${path}`,
        ).toEqual([])
      }
    }
    await open(page, '/en/builds/pyrois/')
    await expect(page.getByTestId('build-classified')).toBeVisible()
    await page.getByRole('button', { name: /Hidden Agent/ }).click()
    await page.getByRole('button', { name: 'Show', exact: true }).click()
    // The control the reader used is gone: focus moves to the revealed title.
    await expect(page.getByRole('heading', { level: 1, name: 'Pyrois' })).toBeFocused()
  })

  test('“All builds” comes back to the Agent’s tile, even far down the list', async ({ page }) => {
    await open(page, '/en/builds/soldier-11/')
    await page.getByRole('link', { name: 'All builds' }).click()
    await expect(page).toHaveURL(/\/en\/builds\/#build-soldier-11$/)
    await expect(page.getByTestId('build-tile-soldier-11')).toBeInViewport()
  })

  test('the nav reaches Builds', async ({ page }) => {
    await page.goto('/en')
    await page.getByRole('link', { name: 'Builds', exact: true }).locator('visible=true').click()
    await expect(page).toHaveURL(/\/en\/builds\/$/)
  })

  test('fits a 360px screen in pt-BR, with no axe violations', async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'one phone viewport is enough')
    await page.setViewportSize({ width: 360, height: 780 })
    await seedRoster(page, { yanagi: 1 })
    for (const path of ['/pt-BR/builds/', '/pt-BR/builds/yanagi/', '/pt-BR/builds/astra/#crit']) {
      await open(page, path)
      await page.waitForLoadState('networkidle')
      expect(await overflow(page), path).toBeLessThanOrEqual(0)
      await expectNoSeriousA11yIssues(page)
    }
  })

  test('has no horizontal overflow and no axe violations', async ({ page }) => {
    await seedRoster(page, { ellen: 2 })
    for (const path of ['/en/builds/', '/en/builds/ellen/']) {
      await open(page, path)
      await page.waitForLoadState('networkidle')
      expect(await overflow(page), path).toBeLessThanOrEqual(0)
      await expectNoSeriousA11yIssues(page)
    }
  })
})

/** Outside the describe: it needs story progress, and seeding only applies once. */
test('the character file links to the build', async ({ page }) => {
  await seedProgress(page, 'i2b-farewell')
  await page.goto('/en/characters/nekomata/')
  await page.getByRole('link', { name: 'Open the build' }).click()
  await expect(page).toHaveURL(/\/en\/builds\/nekomata\/$/)
})
