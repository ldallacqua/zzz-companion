import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn } from 'storybook/test'
import type { WEngine } from '@zzz/core'
import { buildsByAgent } from '@zzz/game'
import { WEngineLadder, type WEngineLadderProps } from './w-engine-ladder'

const ellen = buildsByAgent.get('ellen')!.variants[0]!
const severian = buildsByAgent.get('severian')!.variants[0]!
const nothingClassified: WEngineLadderProps['isClassified'] = () => false

const meta = {
  title: 'Builds/WEngineLadder',
  component: WEngineLadder,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-2xl" style={{ '--agent': '#6fd6ff' } as CSSProperties}>
        <Story />
      </div>
    ),
  ],
  args: {
    agentId: 'ellen',
    variant: ellen,
    owned: [],
    hydrated: true,
    onToggle: fn(),
    best: null,
    isClassified: nothingClassified,
  },
} satisfies Meta<typeof WEngineLadder>

export default meta
type Story = StoryObj<typeof meta>

/** Nothing owned: #1 is the large row, and the list collapses after four. */
export const Default: Story = {
  play: async ({ canvas, userEvent, args }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4)
    await userEvent.click(canvas.getByRole('button', { name: 'Show 2 more' }))
    await expect(canvas.getAllByRole('listitem')).toHaveLength(6)
    await userEvent.click(canvas.getByRole('button', { name: 'I have it: Myriad Eclipse' }))
    await expect(args.onToggle).toHaveBeenCalledWith('myriad-eclipse')
  },
}

/** Owning #3 calls it out as the best you have. */
export const BestYouHave: Story = {
  args: { owned: ['cordis-germina'], best: { id: 'cordis-germina', rank: 3 } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'I have it: Cordis Germina' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    await expect(canvas.getByText('Best you have')).toBeVisible()
  },
}

/** A hidden Agent's signature stays classified in another Agent's list. */
export const Classified: Story = {
  args: {
    agentId: 'severian',
    variant: severian,
    isClassified: (w: WEngine) => w.id === 'sol-exuvia',
  },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Show \d more/ }))
    await expect(canvas.getByText('Classified W-Engine')).toBeVisible()
    await expect(canvas.queryByText('Sol Exuvia')).toBeNull()
  },
}

/** Before the player's W-Engines load, the toggles wait. */
export const Loading: Story = {
  args: { hydrated: false },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'I have it: Deep Sea Visitor' })).toBeDisabled()
  },
}
