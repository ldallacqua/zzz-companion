import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { charactersById } from '@zzz/story'
import { CharacterCard, LockedCard } from './character-card'

const character = (id: string) => {
  const c = charactersById.get(id)
  if (!c) throw new Error(`Unknown character ${id}`)
  return c
}

const meta = {
  title: 'App/CharacterCard',
  component: CharacterCard,
  tags: ['autodocs'],
  args: { character: character('nicole') },
  decorators: [
    (Story) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CharacterCard>

export default meta
type Story = StoryObj<typeof meta>

/** "TV monitor" card with a waist-up crop; tilts toward the pointer when motion is full. */
export const Agent: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Nicole Demara' })).toBeInTheDocument()
  },
}

export const Opaque: Story = { args: { character: character('miguel-silver') } }

export const HeadshotArt: Story = { args: { character: character('shepherd') } }

export const Bangboo: Story = { args: { character: character('eous') } }

/** Someone the reader hasn't met yet: reveals nothing. */
export const Locked: Story = {
  render: () => <LockedCard label="Classified" />,
}
