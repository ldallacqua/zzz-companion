import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { LandingRoster } from './landing-roster'

const meta = {
  title: 'Landing/Roster',
  component: LandingRoster,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <main className="max-w-6xl px-4 mx-auto overflow-x-clip">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof LandingRoster>

export default meta
type Story = StoryObj<typeof meta>

/** Act 3: two rows of Agent icons around the My Agents pitch, then the act's spec line. */
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('One roster')
    await expect(canvas.getByRole('link', { name: 'Open My Agents' })).toBeVisible()
    await expect(canvasElement.querySelectorAll('[data-feature-id="roster"]').length).toBe(1)
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
