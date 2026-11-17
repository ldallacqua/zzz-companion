import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen, waitFor } from 'storybook/test'
import { useRoster } from '@/lib/roster-store'
import { AgentsView } from './agents-view'

const meta = {
  title: 'Screens/My Agents',
  component: AgentsView,
  tags: ['autodocs'],
  parameters: { nextjs: { navigation: { pathname: '/en/agents' } } },
  decorators: [
    (Story) => (
      <main className="max-w-6xl mx-auto">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof AgentsView>

export default meta
type Story = StoryObj<typeof meta>

/** First visit as a guest: the hint, every Agent not owned, Pyrois classified. */
export const GuestEmpty: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText('Start here')).toBeVisible()
    await expect(canvas.queryByText('Pyrois')).toBeNull()
    const ellen = canvas.getByRole('checkbox', { name: 'Ellen' })
    await userEvent.click(ellen)
    await expect(ellen).toBeChecked()
    await expect(useRoster.getState().owned).toEqual({ ellen: 0 })
  },
}

/** A guest with picks: the counter, and the one nudge to keep them in an account. */
export const GuestWithAgents: Story = {
  parameters: { roster: { owned: { ellen: 2, anby: 6, miyabi: 0, lycaon: 1 } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('You own 4 of 62 Agents')).toBeInTheDocument()
    await expect(canvas.getByRole('heading', { name: 'Keep your Agents' })).toBeInTheDocument()
  },
}

/** Signed in and synced: no nudge, the chip says where the roster lives. */
export const SignedIn: Story = {
  parameters: {
    account: { user: { id: 'u1', name: 'Wise', email: 'wise@example.com' } },
    roster: { owned: { ellen: 2, anby: 6 }, sync: 'saved' },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /Saved to account/ })).toBeVisible()
    await expect(canvas.queryByRole('heading', { name: 'Keep your Agents' })).toBeNull()
  },
}

/** Narrowed by a search: Mark all, then Undo in the same place. */
export const MarkAllAndUndo: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search Agents' }), 'soldier')
    await waitFor(() => expect(canvas.getByText('2 Agents')).toBeVisible())
    await userEvent.click(canvas.getByRole('button', { name: /^Mark all \(2\)/ }))
    await expect(Object.keys(useRoster.getState().owned).sort()).toEqual([
      'soldier-0-anby',
      'soldier-11',
    ])
    await userEvent.click(canvas.getByRole('button', { name: /Undo/ }))
    await expect(useRoster.getState().owned).toEqual({})
  },
}

/** Nothing matches the search. */
export const NoResults: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search Agents' }), 'zzzzzz')
    await expect(await canvas.findByText('No Agents match')).toBeVisible()
    // Only a search is on, so the copy points at the spelling, not at filters.
    await expect(canvas.getByText(/Check the spelling/)).toBeVisible()
    await userEvent.click(canvas.getAllByRole('button', { name: 'Clear search' }).at(-1)!)
    await expect(canvas.getByRole('searchbox', { name: 'Search Agents' })).toHaveValue('')
  },
}

/** "Owned" view with nothing owned yet. */
export const OwnedViewEmpty: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getAllByRole('radio', { name: 'Owned' })[0]!)
    await expect(await canvas.findByText('No Agents marked yet')).toBeVisible()
  },
}

/** The spoiler-flagged agent reveals after a confirmation. */
export const RevealHidden: Story = {
  parameters: { a11y: { context: 'body' } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Hidden Agent/ }))
    await userEvent.click(await screen.findByRole('button', { name: 'Show' }))
    await expect(await canvas.findByRole('checkbox', { name: 'Pyrois' })).toBeInTheDocument()
  },
}

/** Sync failed: only the chip changes; the grid keeps working. */
export const SyncError: Story = {
  parameters: {
    account: { user: { id: 'u1', name: 'Wise', email: 'wise@example.com' } },
    roster: { owned: { ellen: 2 }, sync: 'error' },
  },
}

export const Portuguese: Story = {
  globals: { locale: 'pt-BR' },
  parameters: { roster: { owned: { trigger: 1 } } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Gatilho' })).toBeChecked()
  },
}
