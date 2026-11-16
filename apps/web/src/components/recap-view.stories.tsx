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

export const NoProgress: Story = { parameters: { companion: { lastSegmentId: null } } }

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
