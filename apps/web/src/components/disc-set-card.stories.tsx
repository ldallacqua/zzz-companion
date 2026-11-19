import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import type { DiscSet } from '@zzz/core'
import { discSetsById } from '@zzz/game'
import { DiscSetCard } from './disc-set-card'

const set = (id: string) => discSetsById.get(id) as DiscSet

const meta = {
  title: 'Builds/DiscSetCard',
  component: DiscSetCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-sm" style={{ '--agent': '#6fd6ff' } as CSSProperties}>
        <Story />
      </div>
    ),
  ],
  args: {
    pieces: 4,
    sets: [set('puffer-electro')],
    alternatives: [[set('woodpecker-electro')], [set('shadow-harmony')]],
  },
} satisfies Meta<typeof DiscSetCard>

export default meta
type Story = StoryObj<typeof meta>

/** The 4-piece pick: both bonuses, and the alternatives. */
export const FourPiece: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Puffer Electro' })).toBeInTheDocument()
    await expect(canvas.getByText('Also good')).toBeInTheDocument()
  },
}

/** The 2-piece pick, with a choice of interchangeable sets. */
export const TwoPieceChoice: Story = {
  args: {
    pieces: 2,
    sets: [set('freedom-blues'), set('chaos-jazz')],
    alternatives: [[set('astral-voice'), set('hormone-punk')]],
  },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('heading', { name: 'Freedom Blues or Chaos Jazz' }),
    ).toBeInTheDocument()
  },
}

/** No alternatives. */
export const Single: Story = {
  args: { pieces: 2, sets: [set('woodpecker-electro')], alternatives: [] },
}
