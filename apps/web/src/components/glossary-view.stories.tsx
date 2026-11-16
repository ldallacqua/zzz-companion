import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { GlossaryView } from './glossary-view'

const meta = {
  title: 'Screens/Glossary',
  component: GlossaryView,
  tags: ['autodocs'],
  parameters: { nextjs: { navigation: { pathname: '/en/glossary' } } },
  decorators: [
    (Story) => (
      <main className="max-w-6xl mx-auto">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof GlossaryView>

export default meta
type Story = StoryObj<typeof meta>

/** Terms and factions, searchable, unlocked as the story introduces them. */
export const Everything: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.type(canvas.getByRole('searchbox'), 'Hollow')
    await expect(canvas.getAllByText(/Hollow/).length).toBeGreaterThan(0)
  },
}

export const EarlyProgress: Story = { parameters: { companion: { lastSegmentId: 'p-strongbox' } } }

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
