import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { charactersById } from '@zzz/story'
import { CharacterPoster, LockedPoster } from './character-poster'

const character = (id: string) => {
  const c = charactersById.get(id)
  if (!c) throw new Error(`Unknown character ${id}`)
  return c
}

const meta = {
  title: 'App/CharacterPoster',
  component: CharacterPoster,
  tags: ['autodocs'],
  args: { character: character('nekomata'), firstSeen: 'Ch. 1A' },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CharacterPoster>

export default meta
type Story = StoryObj<typeof meta>

/** Transparent full-body Agent art: feet on the floor, sticker edge. Decorative (aria-hidden). */
export const Cutout: Story = {
  play: async ({ canvasElement }) => {
    const poster = canvasElement.querySelector('[data-testid="character-poster"]')
    await expect(poster).toHaveAttribute('aria-hidden', 'true')
  },
}

/** Head-and-shoulders art rises out of the floor; the giant name fills the space above. */
export const Bust: Story = { args: { character: character('shepherd'), firstSeen: 'Prologue' } }

/** An opaque still is a taped-on screen grab, never outlined. */
export const Scene: Story = { args: { character: character('bringer'), firstSeen: 'Prologue' } }

export const Mascot: Story = { args: { character: character('eous'), firstSeen: 'Prologue' } }

/** No art: big outlined initials and a "No photo on file" stamp, in the same box. */
export const MissingArt: Story = {
  args: { character: { ...character('nicole'), image: undefined } },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No photo on file')).toBeInTheDocument()
  },
}

export const BrokenUrl: Story = {
  args: { character: { ...character('nicole'), image: 'https://example.invalid/nope.png' } },
}

export const LongName: Story = { args: { character: character('yanagi') } }

/** Narrow containers hide the "first seen" chip so it never collides with REC. */
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div className="w-56">
        <Story />
      </div>
    ),
  ],
}

/** Locked: same frame, nothing about the character. */
export const Locked: Story = {
  render: () => <LockedPoster label="Classified" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Classified')).toBeInTheDocument()
  },
}
