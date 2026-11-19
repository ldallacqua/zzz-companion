import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { features } from '@/lib/features'
import { LandingLoadout, LoadoutShot } from './landing-loadout'

const meta = {
  title: 'Landing/Loadout',
  component: LandingLoadout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <main className="max-w-6xl px-4 mx-auto overflow-x-clip">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof LandingLoadout>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Act 4: the pitch for Builds next to a product shot of a real build page. The shot is `inert`
 * (a picture of the page), and the act's spec line lists its registry entries once each.
 */
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('geared right')
    await expect(canvas.getByRole('link', { name: 'Open builds' })).toBeVisible()
    const shot = canvas.getByTestId('loadout-mock')
    await expect(shot).toHaveAttribute('inert')
    await expect(shot).toHaveAttribute('aria-hidden', 'true')
    for (const f of features.filter((f) => f.act === 'loadout')) {
      await expect(canvasElement.querySelectorAll(`[data-feature-id="${f.id}"]`).length).toBe(1)
    }
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }

/** The product shot alone at phone width: the board's #1 socket says "Best you have". */
export const ShotOnPhone: Story = {
  render: () => (
    <div className="max-w-[358px]">
      <LoadoutShot />
    </div>
  ),
  globals: { viewport: { value: 'mobile1' } },
}

/** The product shot alone, from `sm`: the top of the W-Engine ladder with #3 ticked. */
export const ShotWide: Story = {
  render: () => (
    <div className="max-w-[720px]">
      <LoadoutShot />
    </div>
  ),
}
