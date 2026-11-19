import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { features } from '@/lib/features'
import { LandingNext } from './landing-next'

const meta = {
  title: 'Landing/NextTimeOn',
  component: LandingNext,
  tags: ['autodocs'],
} satisfies Meta<typeof LandingNext>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The planned features, as the next episode's preview (from the registry: `act: 'next'`), in the
 * order they'll ship, each with the features it builds on.
 */
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const planned = features.filter((f) => f.act === 'next')
    for (const f of planned) {
      await expect(canvas.getByRole('heading', { name: f.title.en })).toBeVisible()
    }
    const cards = [...canvasElement.querySelectorAll<HTMLElement>('[data-feature-id]')]
    await expect(cards.map((c) => c.dataset.featureId)).toEqual(planned.map((f) => f.id))
    await expect(cards[0]).toHaveTextContent('Builds on: My Agents roster · Character builds')
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
