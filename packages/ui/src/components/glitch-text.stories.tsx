import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { GlitchText } from './glitch-text'

const meta = {
  title: 'Design system/GlitchText',
  component: GlitchText,
  tags: ['autodocs'],
  args: { text: 'Previously on', className: 'display text-6xl' },
} satisfies Meta<typeof GlitchText>

export default meta
type Story = StoryObj<typeof meta>

/** The jittering RGB copies are aria-hidden: screen readers hear the text once. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const copies = canvasElement.querySelectorAll('[aria-hidden]')
    await expect(copies.length).toBeGreaterThan(0)
  },
}

export const Small: Story = { args: { text: 'Signal lost', className: 'display text-2xl' } }
