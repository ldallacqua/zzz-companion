import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen } from 'storybook/test'
import { SyncChip, type SyncDisplay } from './sync-chip'

const meta = {
  title: 'Agents/SyncChip',
  component: SyncChip,
  tags: ['autodocs'],
  args: { display: 'local', accountsEnabled: true, onRetry: fn() },
  parameters: { a11y: { context: 'body' } },
} satisfies Meta<typeof SyncChip>

export default meta
type Story = StoryObj<typeof meta>

const ALL: SyncDisplay[] = ['local', 'loading', 'saving', 'saved', 'offline', 'error', 'expired']

/** Every state. Icons and labels both carry it, so it never depends on colour alone. */
export const AllStates: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap">
      {ALL.map((display) => (
        <SyncChip key={display} {...args} display={display} lastSavedAt={Date.now()} />
      ))}
    </div>
  ),
}

/** Guest: the popover explains where the roster lives and offers an account. */
export const LocalOpen: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Sync status: On this device/ }))
    await expect(await screen.findByText('Saved on this device')).toBeVisible()
    await expect(screen.getByRole('link', { name: 'Create account' })).toBeVisible()
  },
}

/** Save failed: "Try again" retries now (it also retries when the browser comes back online). */
export const ErrorRetry: Story = {
  args: { display: 'error' },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Not synced/ }))
    await userEvent.click(await screen.findByRole('button', { name: 'Try again' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}

/** A build without an account server only explains. */
export const AccountsOff: Story = {
  args: { accountsEnabled: false },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button'))
    await expect(await screen.findByText(/aren’t available on this copy/)).toBeVisible()
    await expect(screen.queryByRole('link', { name: 'Create account' })).toBeNull()
  },
}

export const Portuguese: Story = {
  args: { display: 'saved', lastSavedAt: Date.now() },
  globals: { locale: 'pt-BR' },
}
