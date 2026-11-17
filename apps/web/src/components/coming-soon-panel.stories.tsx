import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { ComingSoonPanel } from './coming-soon-panel'

const meta = {
  title: 'App/ComingSoonPanel',
  component: ComingSoonPanel,
  tags: ['autodocs'],
  args: {
    title: 'Build',
    badge: 'Soon',
    children: 'Recommended W-Engines, Drive Discs, stats and skill priority are on the way.',
  },
} satisfies Meta<typeof ComingSoonPanel>

export default meta
type Story = StoryObj<typeof meta>

/** A planned section, clearly marked as not built yet. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Build' })).toBeInTheDocument()
  },
}
