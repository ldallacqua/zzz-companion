import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { TvStage } from './tv-stage'

const meta = {
  title: 'Landing/TvStage',
  component: TvStage,
  tags: ['autodocs'],
  args: {
    children: (
      <div className="lp-tilt w-80 grid aspect-[4/3] place-items-center bg-surface-2 ring-1 ring-primary">
        <span className="text-xs font-mono text-muted">monitor</span>
      </div>
    ),
  },
} satisfies Meta<typeof TvStage>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Behaviour only: with full motion the monitor tilts towards a fine pointer on desktop and
 * switches off (`data-power`) once scrolled past. The look comes from its children.
 */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const stage = canvasElement.querySelector('.lp-tv')
    await expect(stage).not.toBeNull()
    await expect(stage).not.toHaveAttribute('data-power')
  },
}
