import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, waitFor } from 'storybook/test'
import { BuildsView } from './builds-view'

const meta = {
  title: 'Screens/Builds',
  component: BuildsView,
  tags: ['autodocs'],
  parameters: { nextjs: { navigation: { pathname: '/en/builds' } } },
  decorators: [
    (Story) => (
      <main className="max-w-6xl mx-auto">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof BuildsView>

export default meta
type Story = StoryObj<typeof meta>

/** No roster: one grid of every Agent and a hint pointing at My Agents; Pyrois classified. */
export const NoRoster: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('builds-hint')).toBeVisible()
    await expect(canvas.getByRole('heading', { name: /All Agents/ })).toBeVisible()
    await expect(canvas.queryByText('Pyrois')).toBeNull()
  },
}

/** With a roster: the player's Agents first, then everyone else. */
export const WithRoster: Story = {
  parameters: { roster: { owned: { ellen: 2, caesar: 6, lycaon: 0 } } },
  play: async ({ canvas }) => {
    const yours = await canvas.findByTestId('builds-yours')
    await expect(yours.querySelectorAll('li')).toHaveLength(3)
    await expect(canvas.getByRole('heading', { name: /Other Agents/ })).toBeVisible()
    await expect(canvas.queryByTestId('builds-hint')).toBeNull()
  },
}

/** A search narrows the list. */
export const Search: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('searchbox', { name: 'Search Agents' }), 'soldier')
    await waitFor(() =>
      expect(canvas.getByTestId('builds-others').querySelectorAll('li')).toHaveLength(2),
    )
  },
}

/** Portuguese. */
export const Portuguese: Story = {
  globals: { locale: 'pt-BR' },
  parameters: { roster: { owned: { ellen: 2 } } },
}
