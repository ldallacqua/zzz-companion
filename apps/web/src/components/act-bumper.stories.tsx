import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { ActBumper } from './act-bumper'

const meta = {
  title: 'Landing/ActBumper',
  component: ActBumper,
  tags: ['autodocs'],
  args: { act: 'Act 1', title: 'The shield' },
} satisfies Meta<typeof ActBumper>

export default meta
type Story = StoryObj<typeof meta>

/** Broadcast bumper before each act of the landing page. The hairline draws in on arrival. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Act 1')).toBeVisible()
    await expect(canvas.getByText('The shield')).toBeVisible()
  },
}

export const Portuguese: Story = { args: { act: 'Ato 2', title: 'Entre sessões' } }
