import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { relatedCharacters } from '@zzz/core'
import { characters, timeline } from '@zzz/story'
import { RelatedCharacters } from './related-characters'

const relatedAt = (id: string, lastSegmentId: string) =>
  relatedCharacters(timeline, { lastSegmentId }, id, characters)

const meta = {
  title: 'App/RelatedCharacters',
  component: RelatedCharacters,
  tags: ['autodocs'],
  args: { related: relatedAt('nicole', 'i2b-farewell') },
} satisfies Meta<typeof RelatedCharacters>

export default meta
type Story = StoryObj<typeof meta>

/** "Often seen with": shared finished parts first, then the same faction. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('link').length).toBeGreaterThan(0)
    await expect(canvas.getAllByText(/parts? together/).length).toBeGreaterThan(0)
  },
}

/** Nobody to show: the whole section disappears. */
export const Empty: Story = {
  args: { related: [] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('section')).toBeNull()
  },
}
