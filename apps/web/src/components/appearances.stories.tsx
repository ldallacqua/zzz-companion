import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { appearancesOf } from '@zzz/core'
import { timeline } from '@zzz/story'
import { Appearances } from './appearances'

const meta = {
  title: 'App/Appearances',
  component: Appearances,
  tags: ['autodocs'],
  args: { chapters: appearancesOf(timeline, { lastSegmentId: 'i2b-farewell' }, 'nekomata') },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Appearances>

export default meta
type Story = StoryObj<typeof meta>

/** Finished parts featuring the character, each linking back to that part of the recap. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const links = canvas.getAllByRole('link')
    await expect(links[0]).toHaveAttribute('href', expect.stringMatching(/\/recap\/?#part-/))
  },
}

/** Only what the reader has finished. */
export const EarlyProgress: Story = {
  args: { chapters: appearancesOf(timeline, { lastSegmentId: 'c1a-client' }, 'nekomata') },
}
