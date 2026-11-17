import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { AccountButton } from './account-button'

const wise = { id: 'u1', name: 'Wise', email: 'wise@example.com' }

const meta = {
  title: 'App/AccountButton',
  component: AccountButton,
  tags: ['autodocs'],
} satisfies Meta<typeof AccountButton>

export default meta
type Story = StoryObj<typeof meta>

/** Signed out: a "Sign in" link (the label shows from xl; below it's the icon + accessible name). */
export const SignedOut: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Sign in' })).toBeVisible()
  },
}

/** Signed in: the Proxy name's initial on lime. */
export const SignedIn: Story = {
  parameters: { account: { user: wise } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Account: Wise' })).toHaveTextContent('W')
  },
}

/** Sync failing: a red dot, and the accessible name says so. */
export const SyncProblem: Story = {
  parameters: { account: { user: wise }, roster: { sync: 'error' } },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('link', { name: 'Account: Wise (sync problem)' }),
    ).toBeInTheDocument()
  },
}

/** No accounts on this build: nothing is rendered. */
export const AccountsOff: Story = {
  parameters: { account: { enabled: false } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('link')).toBeNull()
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
