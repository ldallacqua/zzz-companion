import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { agentsById } from '@zzz/game'
import { BuildTile } from './build-tile'

const meta = {
  title: 'Builds/BuildTile',
  component: BuildTile,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
  args: { agent: agentsById.get('ellen')!, level: null, variants: 1 },
} satisfies Meta<typeof BuildTile>

export default meta
type Story = StoryObj<typeof meta>

/** Not owned: in colour (a catalogue, not a checklist), with the specialty. */
export const NotOwned: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: /Ellen/ })).toHaveAttribute(
      'href',
      '/en/builds/ellen/',
    )
    await expect(canvas.getByText('Attack')).toBeInTheDocument()
  },
}

/** Owned at M2: the frame colour and the Mindscape. */
export const Owned: Story = {
  args: { level: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('M2')).toBeInTheDocument()
  },
}

/** An Agent with two build variants. */
export const TwoVariants: Story = {
  args: { agent: agentsById.get('caesar')!, level: 6, variants: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('2 builds')).toBeInTheDocument()
  },
}
