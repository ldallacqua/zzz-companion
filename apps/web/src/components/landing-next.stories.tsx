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

/** The planned features, as the next episode's preview (from the registry: `act: 'next'`). */
export const Default: Story = {
  play: async ({ canvas }) => {
    for (const f of features.filter((f) => f.act === 'next')) {
      await expect(canvas.getByRole('heading', { name: f.title.en })).toBeVisible()
    }
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
