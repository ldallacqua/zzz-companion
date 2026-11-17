import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen } from 'storybook/test'
import { AccountView, DeleteAccountSheet } from './account-view'

const wise = { id: 'u1', name: 'Wise', email: 'wise@example.com' }

const meta = {
  title: 'Screens/Account',
  component: AccountView,
  tags: ['autodocs'],
  parameters: { nextjs: { navigation: { pathname: '/en/account' } } },
  decorators: [
    (Story) => (
      <main className="max-w-6xl mx-auto">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof AccountView>

export default meta
type Story = StoryObj<typeof meta>

/** Signed out: the form, plus why an account helps and what is stored. */
export const SignedOut: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Why an account?' })).toBeVisible()
    await expect(canvas.getByRole('radio', { name: 'Sign in' })).toBeChecked()
  },
}

/** Signed in: the Proxy ID card, sign out and the danger zone. */
export const SignedIn: Story = {
  parameters: { account: { user: wise }, roster: { owned: { ellen: 2, anby: 6 } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Wise' })).toBeVisible()
    await expect(canvas.getByText('wise@example.com')).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Sign out' })).toBeVisible()
  },
}

/** Signed in with a failed save: the sync row offers a retry. */
export const SyncError: Story = {
  parameters: { account: { user: wise }, roster: { owned: { ellen: 2 }, sync: 'error' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /Not synced/ })).toBeVisible()
  },
}

/** A build without an account server. */
export const AccountsOff: Story = {
  parameters: { account: { enabled: false } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Accounts are off here' })).toBeVisible()
    await expect(canvas.getByRole('link', { name: 'Go to My Agents' })).toBeVisible()
  },
}

/** Delete needs the password, in a sheet. */
export const DeleteConfirm: Story = {
  parameters: { a11y: { context: 'body' } },
  render: () => <DeleteAccountSheet email={wise.email} token="storybook" defaultOpen />,
  play: async () => {
    const dialog = await screen.findByRole('dialog', { name: 'Delete your account?' })
    await expect(dialog).toHaveAccessibleDescription(/wise@example.com/)
    await expect(screen.getByLabelText('Type your password to confirm')).toHaveFocus()
  },
}

export const Portuguese: Story = {
  globals: { locale: 'pt-BR' },
  parameters: { account: { user: wise }, roster: { owned: { trigger: 1 } } },
}
