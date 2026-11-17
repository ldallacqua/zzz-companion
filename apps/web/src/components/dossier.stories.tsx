import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { knownHistoryAt } from '@zzz/core'
import { charactersById, timeline } from '@zzz/story'
import { Dossier } from './dossier'

const notesAt = (id: string, lastSegmentId: string) => {
  const c = charactersById.get(id)!
  return knownHistoryAt(timeline, { lastSegmentId }, c, c.blurb)
}

const meta = {
  title: 'App/Dossier',
  component: Dossier,
  tags: ['autodocs'],
  args: { notes: notesAt('nekomata', 'i2b-farewell') },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dossier>

export default meta
type Story = StoryObj<typeof meta>

/** What you know now on top, then earlier notes newest first, ending at "On file since". */
export const WithHistory: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Earlier notes' })).toBeInTheDocument()
    await expect(canvas.getByText(/On file since/)).toBeInTheDocument()
  },
}

/** Early in the story the file only holds what the reader knew then: no later notes. */
export const Early: Story = {
  args: { notes: notesAt('nekomata', 'c1a-client') },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading', { name: 'Earlier notes' })).toBeNull()
    await expect(canvas.queryByText(/newest member of the Cunning Hares/)).toBeNull()
  },
}

/** One note only: no "Earlier notes" section at all (no hint that more could exist). */
export const Single: Story = { args: { notes: notesAt('nicole', 'i2b-farewell') } }

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
