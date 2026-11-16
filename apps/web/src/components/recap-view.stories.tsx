import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { RecapView } from './recap-view'

const meta = {
  title: 'Screens/Recap',
  component: RecapView,
  tags: ['autodocs'],
  parameters: { nextjs: { navigation: { pathname: '/en/recap' } } },
  decorators: [
    (Story) => (
      <main className="max-w-6xl mx-auto">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof RecapView>

export default meta
type Story = StoryObj<typeof meta>

/** Everything up to the Chapter 2 Interlude, with the scroll-linked timeline spine. */
export const CaughtUp: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('recap-timeline')).toBeInTheDocument()
    await expect(canvas.getByTestId('segment-i2b-farewell')).toBeInTheDocument()
    // The end of the recap offers the next step instead of a dead end.
    await expect(canvas.getByRole('button', { name: /update your progress/i })).toBeVisible()
  },
}

/** Spoiler shield: only the parts the reader finished. */
export const JustStarted: Story = {
  parameters: { companion: { lastSegmentId: 'p-phaethon' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByTestId('segment-c1a-client')).toBeNull()
  },
}

export const TldrMode: Story = { parameters: { companion: { recapMode: 'tldr' } } }

/** No progress yet: one clear call to action, and no reading controls that would do nothing. */
export const NoProgress: Story = {
  parameters: { companion: { lastSegmentId: null } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: /set my progress/i })).toBeVisible()
    await expect(canvas.queryByRole('radiogroup')).toBeNull()
  },
}

/** pt-BR, with episode names as the Portuguese game client shows them. */
export const Portuguese: Story = {
  globals: { locale: 'pt-BR' },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('segment-p-strongbox')).toHaveTextContent('Uma Surpresa')
  },
}
