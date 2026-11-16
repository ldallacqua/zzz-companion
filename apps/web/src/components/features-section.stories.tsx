import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { features } from '@/lib/features'
import { FeaturesSection } from './features-section'

const meta = {
  title: 'App/FeaturesSection',
  component: FeaturesSection,
  tags: ['autodocs'],
} satisfies Meta<typeof FeaturesSection>

export default meta
type Story = StoryObj<typeof meta>

/** Rendered straight from `src/lib/features.ts` — the same registry the README is checked against. */
export const Default: Story = {
  play: async ({ canvas }) => {
    for (const feature of features) {
      await expect(canvas.getByText(feature.title.en)).toBeInTheDocument()
    }
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
