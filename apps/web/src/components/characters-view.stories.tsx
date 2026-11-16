import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { CharactersView } from './characters-view'

const meta = {
  title: 'Screens/Characters',
  component: CharactersView,
  tags: ['autodocs'],
  parameters: { nextjs: { navigation: { pathname: '/en/characters' } } },
  decorators: [
    (Story) => (
      <main className="max-w-6xl mx-auto">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof CharactersView>

export default meta
type Story = StoryObj<typeof meta>

/** Everyone met so far, filterable by faction. */
export const Everyone: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { name: 'Hoshimi Miyabi' })).toBeInTheDocument()
  },
}

/** Early on, most of the cast is still classified. */
export const EarlyProgress: Story = {
  parameters: { companion: { lastSegmentId: 'p-strongbox' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading', { name: 'Hoshimi Miyabi' })).toBeNull()
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
