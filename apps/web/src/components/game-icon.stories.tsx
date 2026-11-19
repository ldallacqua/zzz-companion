import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { discSetsById, wEnginesById } from '@zzz/game'
import { GameIcon } from './game-icon'

const meta = {
  title: 'Builds/GameIcon',
  component: GameIcon,
  tags: ['autodocs'],
  args: { src: wEnginesById.get('deep-sea-visitor')!.icon, kind: 'w-engine', size: 72 },
} satisfies Meta<typeof GameIcon>

export default meta
type Story = StoryObj<typeof meta>

/** A W-Engine icon from the wiki CDN. */
export const WEngine: Story = {}

/** A Drive Disc set icon. */
export const DiscSet: Story = {
  args: { src: discSetsById.get('woodpecker-electro')!.icon, kind: 'disc', size: 48 },
}

/** No art (classified, or the image failed): a glyph in the same box, so nothing shifts. */
export const Fallback: Story = {
  args: { src: null },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('game-icon-fallback')).toBeInTheDocument()
  },
}
