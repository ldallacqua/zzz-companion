import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { features } from '@/lib/features'
import { SpecFooter } from './spec-footer'

const shield = features.filter((f) => f.act === 'shield')

const meta = {
  title: 'Landing/SpecFooter',
  component: SpecFooter,
  tags: ['autodocs'],
  args: { features: shield },
} satisfies Meta<typeof SpecFooter>

export default meta
type Story = StoryObj<typeof meta>

/** The registry entries an act demonstrates, in the Apple-style "spec line" format. */
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    for (const f of shield) await expect(canvas.getByText(f.title.en)).toBeVisible()
    await expect(canvasElement.querySelectorAll('[data-feature-id]').length).toBe(shield.length)
  },
}

export const WithFinePrint: Story = {
  args: {
    children: <p className="mt-6 text-xs font-mono text-subtle">Covers the Prologue onwards.</p>,
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
