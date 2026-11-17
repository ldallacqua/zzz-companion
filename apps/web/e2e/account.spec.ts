import { expect, test, type Page } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { seedProgress } from './helpers'

/**
 * Accounts against the real API (apps/api, started by playwright.config.ts with a throwaway
 * SQLite file and rate limits off). Each test uses its own email.
 */
const PASSWORD = 'hollow-raider-42'
const uniqueEmail = (project: string) =>
  `e2e-${project}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`

const tile = (page: Page, id: string) => page.locator(`label[for="own-${id}"]`)
const box = (page: Page, id: string) => page.getByTestId(`agent-${id}`)

async function createAccount(page: Page, email: string, name = 'Wise') {
  await page.goto('/en/account/#create')
  await page.getByLabel('Proxy name').fill(name)
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Password', { exact: true }).fill(PASSWORD)
  await page.getByRole('button', { name: /^Create account/ }).click()
}

test.describe('accounts', () => {
  test.beforeEach(async ({ page }) => {
    await seedProgress(page, null)
  })

  test('guest picks merge into a new account and follow it to another browser', async ({
    page,
    browser,
  }, info) => {
    const email = uniqueEmail(info.project.name)

    // A guest ticks two agents…
    await page.goto('/en/agents')
    await tile(page, 'ellen').click()
    await tile(page, 'anby').click()

    // …creates an account: the picks are merged into it.
    await createAccount(page, email)
    await expect(page.getByText('Welcome, Wise.')).toBeVisible()
    await expect(page.getByText(/2 Agents from this browser were added/)).toBeVisible()
    await expect(page.getByTestId('sync-chip')).toHaveAttribute('data-sync', 'saved')

    // An edit while signed in is saved to the account.
    await page.goto('/en/agents')
    await tile(page, 'miyabi').click()
    await expect(page.getByTestId('sync-chip')).toHaveAttribute('data-sync', 'saved', {
      timeout: 10_000,
    })

    // Signing out forgets the device copy.
    await page.goto('/en/account')
    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page.getByText('Signed out. Your Agents are safe in your account.')).toBeVisible()
    await page.goto('/en/agents')
    await expect(box(page, 'ellen')).not.toBeChecked()

    // Another browser signs in and gets all three.
    const other = await browser.newContext()
    const page2 = await other.newPage()
    await seedProgress(page2, null)
    await page2.goto('/en/account')
    await page2.getByLabel('Email').fill(email)
    await page2.getByLabel('Password', { exact: true }).fill(PASSWORD)
    await page2.getByRole('button', { name: /^Sign in/ }).click()
    await expect(page2.getByRole('heading', { name: 'Wise' })).toBeVisible()
    await page2.goto('/en/agents')
    await expect(box(page2, 'ellen')).toBeChecked()
    await expect(box(page2, 'anby')).toBeChecked()
    await expect(box(page2, 'miyabi')).toBeChecked()
    await other.close()
  })

  test('the nudge opens Create account and comes back to My Agents', async ({ page }, info) => {
    await page.goto('/en/agents')
    await tile(page, 'ellen').click()
    // Client-side navigation from the nudge (not a page load with #create).
    await page.getByRole('link', { name: 'Create account' }).last().click()
    await expect(page.getByLabel('Proxy name')).toBeVisible()
    await page.getByLabel('Proxy name').fill('Wise')
    await page.getByLabel('Email').fill(uniqueEmail(info.project.name))
    await page.getByLabel('Password', { exact: true }).fill(PASSWORD)
    await page.getByRole('button', { name: /^Create account/ }).click()
    await expect(page).toHaveURL(/\/en\/agents\/$/)
    await expect(page.getByText(/1 Agent from this browser was added/)).toBeVisible()
    await expect(box(page, 'ellen')).toBeChecked()
  })

  test('explains wrong passwords and taken emails', async ({ page }, info) => {
    const email = uniqueEmail(info.project.name)
    await createAccount(page, email)
    await expect(page.getByRole('heading', { name: 'Wise' })).toBeVisible()
    await page.getByRole('button', { name: 'Sign out' }).click()

    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Password', { exact: true }).fill('not-the-password')
    await page.getByRole('button', { name: /^Sign in/ }).click()
    await expect(page.getByTestId('auth-form').getByRole('alert')).toContainText(
      'That email and password don’t match',
    )

    await createAccount(page, email, 'Belle')
    await expect(page.getByText('There’s already an account with this email.')).toBeVisible()
  })

  test('deletes the account with the password', async ({ page }, info) => {
    await createAccount(page, uniqueEmail(info.project.name))
    await page.getByRole('button', { name: 'Delete account…' }).click()
    const dialog = page.getByRole('dialog', { name: 'Delete your account?' })
    await dialog.getByLabel('Type your password to confirm').fill('wrong-password')
    await dialog.getByRole('button', { name: 'Delete for good' }).click()
    await expect(dialog.getByText('That password isn’t right.')).toBeVisible()
    await dialog.getByLabel('Type your password to confirm').fill(PASSWORD)
    await dialog.getByRole('button', { name: 'Delete for good' }).click()
    await expect(page.getByText(/Account deleted/)).toBeVisible()
  })

  test('the account page has no axe violations', async ({ page }) => {
    await page.goto('/en/account')
    await expect(page.getByTestId('auth-form')).toBeVisible()
    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    const serious = results.violations.filter((v) =>
      ['serious', 'critical'].includes(v.impact ?? ''),
    )
    expect(serious).toEqual([])
  })
})
