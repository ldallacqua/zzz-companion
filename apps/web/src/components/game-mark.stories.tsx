import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { GameMark } from './game-mark'

const meta = {
  title: 'App/GameMark',
  component: GameMark,
  tags: ['autodocs'],
  args: { className: 'h-16' },
  render: (args) => (
    <a href="#home" aria-label="ZZZ Companion" className="group p-4 inline-flex bg-background">
      <GameMark {...args} />
    </a>
  ),
} satisfies Meta<typeof GameMark>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The official "ZZ" mark (© HoYoverse), shipped as a transparent PNG. Hover or focus the link to
 * see the lime tint. The footer carries HoYoverse's legal statement.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('game-mark')).toBeInTheDocument()
  },
}

export const HeaderSize: Story = { args: { className: 'h-9' } }
