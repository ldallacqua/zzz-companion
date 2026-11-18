import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { BigMark } from './big-mark'

const meta = {
  title: 'Landing/BigMark',
  component: BigMark,
  tags: ['autodocs'],
  args: { className: 'text-[12rem] text-primary/30' },
} satisfies Meta<typeof BigMark>

export default meta
type Story = StoryObj<typeof meta>

/** The giant outlined "ZZZ" behind the hero and the outro: a pseudo-element, never text. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const mark = canvasElement.querySelector('[aria-hidden]')
    await expect(mark).not.toBeNull()
    await expect(mark?.textContent).toBe('')
  },
}
