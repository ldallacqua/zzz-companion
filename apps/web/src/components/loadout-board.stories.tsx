import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { agentsById, buildsByAgent } from '@zzz/game'
import { LoadoutBoard } from './loadout-board'

const meta = {
  title: 'Builds/LoadoutBoard',
  component: LoadoutBoard,
  tags: ['autodocs'],
  args: {
    agent: agentsById.get('ellen')!,
    variant: buildsByAgent.get('ellen')!.variants[0]!,
  },
} satisfies Meta<typeof LoadoutBoard>

export default meta
type Story = StoryObj<typeof meta>

/** Slots 1–3 recede (fixed main stats); 4–6 show the stat to aim for, then the fallbacks. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const slots = canvas.getByRole('list', { name: 'Drive Disc main stats, slots 1 to 6' })
    await expect(slots.querySelectorAll('li')).toHaveLength(6)
    await expect(canvas.getByText('Slot 5: PEN Ratio, then Ice DMG Bonus')).toBeInTheDocument()
    await expect(canvas.getByText('Slot 1: HP (Fixed)')).toBeInTheDocument()
  },
}

/** Owning a lower pick adds the "Best you have" line under the top W-Engine. */
export const BestYouHave: Story = {
  args: { best: { id: 'starlight-engine', rank: 6 } },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('best-you-have')).toHaveTextContent(
      'Best you have: Starlight Engine · #6',
    )
  },
}

/** Ties in a slot ("ATK% / Anomaly Prof. / CRIT Rate"). */
export const Ties: Story = {
  args: { agent: agentsById.get('rina')!, variant: buildsByAgent.get('rina')!.variants[0]! },
}

/** Another variant of the same Agent (Caesar's Anomaly build changes slot 4). */
export const OtherVariant: Story = {
  args: { agent: agentsById.get('caesar')!, variant: buildsByAgent.get('caesar')!.variants[1]! },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Slot 4: Anomaly Proficiency/)).toBeInTheDocument()
  },
}

/** No specific 2-piece set in the sources: the other two slots can be any set. */
export const AnyTwoPiece: Story = {
  args: { agent: agentsById.get('evelyn')!, variant: buildsByAgent.get('evelyn')!.variants[0]! },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('any-two-piece')).toHaveTextContent('Any set')
  },
}

/** Portuguese in a phone-width column: long stat names wrap inside their slot. */
export const Portuguese: Story = {
  globals: { locale: 'pt-BR' },
  decorators: [
    (Story) => (
      <div className="w-[328px]">
        <Story />
      </div>
    ),
  ],
  args: { agent: agentsById.get('yanagi')!, variant: buildsByAgent.get('yanagi')!.variants[0]! },
}
