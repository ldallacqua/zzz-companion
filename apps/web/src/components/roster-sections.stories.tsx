import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn } from 'storybook/test'
import {
  AccountNudge,
  MergeNotice,
  Notice,
  ResultsBar,
  RosterEmpty,
  RosterHint,
  RosterStatusStrip,
} from './roster-sections'
import { SyncChip } from './sync-chip'

const meta = {
  title: 'Agents/Roster sections',
  component: ResultsBar,
  tags: ['autodocs'],
  args: { count: 9, markable: 7, onMarkAll: fn(), onUndo: fn() },
} satisfies Meta<typeof ResultsBar>

export default meta
type Story = StoryObj<typeof meta>

/** Results count + Mark all (only when the list is narrowed). */
export const MarkAll: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /^Mark all \(7\)/ }))
    await expect(args.onMarkAll).toHaveBeenCalledOnce()
  },
}

/** After Mark all, the same spot offers Undo (no timer). */
export const Undo: Story = {
  args: { undo: { count: 7 } },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Undo: unmark the 7 Agents/ }))
    await expect(args.onUndo).toHaveBeenCalledOnce()
  },
}

/** Sticky strip: owned counter, meter (md+) and the sync chip. */
export const StatusStrip: Story = {
  render: () => (
    <div className="pt-4">
      <RosterStatusStrip
        owned={12}
        total={62}
        hydrated
        sync={<SyncChip display="saved" accountsEnabled onRetry={fn()} />}
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('You own 12 of 62 Agents')).toBeInTheDocument()
  },
}

/** Before hydration the count is a dash. */
export const StatusStripLoading: Story = {
  render: () => (
    <RosterStatusStrip
      owned={0}
      total={62}
      hydrated={false}
      sync={<SyncChip display="local" accountsEnabled onRetry={fn()} />}
    />
  ),
}

export const Empty: Story = {
  render: () => (
    <div className="divide-y divide-border">
      <RosterEmpty kind="filters" query="xyz" onAction={fn()} />
      <RosterEmpty kind="owned" onAction={fn()} />
      <RosterEmpty kind="missing" />
    </div>
  ),
}

export const FirstVisitHint: Story = { render: () => <RosterHint /> }

/** The one guest nudge, after the grid. */
export const Nudge: Story = {
  render: () => <AccountNudge onDismiss={fn()} />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Keep your Agents' })).toBeVisible()
    await expect(canvas.getByRole('link', { name: 'Create account' })).toBeVisible()
  },
}

export const Notices: Story = {
  render: () => (
    <div>
      <MergeNotice count={3} onDismiss={fn()} />
      <Notice tone="warning" onDismiss={fn()}>
        Your session ended. Sign in again.
      </Notice>
    </div>
  ),
}

export const Portuguese: Story = {
  globals: { locale: 'pt-BR' },
  render: () => (
    <div>
      <ResultsBar count={9} markable={7} onMarkAll={fn()} onUndo={fn()} />
      <AccountNudge onDismiss={fn()} />
    </div>
  ),
}
