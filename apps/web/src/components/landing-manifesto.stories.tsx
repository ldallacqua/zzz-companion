import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { LandingManifesto } from './landing-manifesto'

const meta = {
  title: 'Landing/Manifesto',
  component: LandingManifesto,
  tags: ['autodocs'],
} satisfies Meta<typeof LandingManifesto>

export default meta
type Story = StoryObj<typeof meta>

/** The narrator's promise. With full motion each word lights up as it scrolls through. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.textContent).toContain('Not one scene further.')
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
