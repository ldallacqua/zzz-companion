import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { features } from '@/lib/features'
import { HomeView } from './home-view'

const meta = {
  title: 'Screens/Home',
  component: HomeView,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', nextjs: { navigation: { pathname: '/en' } } },
  decorators: [
    (Story) => (
      <main className="max-w-6xl px-4 sm:px-6 mx-auto overflow-x-clip">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof HomeView>

export default meta
type Story = StoryObj<typeof meta>

/**
 * The landing page as one episode: cold open, "previously on", three acts, next time on and the
 * sign-off. Every feature in the registry appears exactly once.
 */
export const Returning: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 1 })).toBeInTheDocument()
    for (const f of features) {
      await expect(canvasElement.querySelectorAll(`[data-feature-id="${f.id}"]`).length).toBe(1)
    }
  },
}

export const FirstVisit: Story = { parameters: { companion: { lastSegmentId: null } } }

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
