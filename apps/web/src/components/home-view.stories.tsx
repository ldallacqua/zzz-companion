import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { HomeView } from './home-view'

const meta = {
  title: 'Screens/Home',
  component: HomeView,
  tags: ['autodocs'],
  parameters: { nextjs: { navigation: { pathname: '/en' } } },
  decorators: [
    (Story) => (
      <main className="max-w-6xl mx-auto">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof HomeView>

export default meta
type Story = StoryObj<typeof meta>

/** Landing: CRT hero with the Phaethon siblings, call to action and the features registry. */
export const Returning: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1 })).toBeInTheDocument()
  },
}

export const FirstVisit: Story = { parameters: { companion: { lastSegmentId: null } } }

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
