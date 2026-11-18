import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { features } from '@/lib/features'
import { FeaturesSection } from './features-section'

const bento = features.filter((f) => f.act === 'bento')

const meta = {
  title: 'Landing/Act2Bento',
  component: FeaturesSection,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <main className="max-w-6xl mx-auto">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof FeaturesSection>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Act 2: the registry's `act: 'bento'` features as a bento grid of product shots (each tile's art
 * plays once when it arrives). Every entry renders exactly once, with `data-feature-id`.
 */
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    for (const feature of bento) {
      await expect(canvas.getByRole('heading', { name: feature.title.en })).toBeVisible()
    }
    await expect(canvasElement.querySelectorAll('[data-feature-id]').length).toBe(bento.length)
    // The Motion tile is the app's real setting, so it must be reachable by keyboard.
    await expect(canvas.getByRole('radiogroup', { name: 'Animations' })).toBeVisible()
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
