import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { ProgressTicks } from './progress-ticks'

const meta = {
  title: 'Design system/ProgressTicks',
  component: ProgressTicks,
  tags: ['autodocs'],
  args: { total: 21, done: 8, label: '8 of 21 parts' },
  argTypes: { done: { control: { type: 'range', min: 0, max: 21 } } },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressTicks>

export default meta
type Story = StoryObj<typeof meta>

export const Partway: Story = {
  play: async ({ canvas }) => {
    const meter = canvas.getByRole('progressbar', { name: '8 of 21 parts' })
    await expect(meter).toHaveAttribute('aria-valuenow', '8')
  },
}

export const Empty: Story = { args: { done: 0, label: 'Not started' } }

export const Complete: Story = { args: { done: 21, label: 'All caught up' } }
