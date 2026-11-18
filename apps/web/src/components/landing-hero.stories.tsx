import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { LandingHero } from './landing-hero'

const meta = {
  title: 'Landing/Hero',
  component: LandingHero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', nextjs: { navigation: { pathname: '/en' } } },
  decorators: [
    (Story) => (
      <main className="max-w-6xl px-4 sm:px-6 mx-auto overflow-x-clip">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof LandingHero>

export default meta
type Story = StoryObj<typeof meta>

/** First visit: one call to action, "Set my progress", and the coverage on the monitor. */
export const FirstVisit: Story = {
  parameters: { companion: { lastSegmentId: null } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'New Eridu' })).toBeVisible()
    await expect(await canvas.findByRole('button', { name: 'Set my progress' })).toBeVisible()
  },
}

/** Returning reader: "Read my recap", and the monitor's lower-third says where they are. */
export const Returning: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('link', { name: 'Read my recap' })).toBeVisible()
    await expect(await canvas.findByText('You are here')).toBeVisible()
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
