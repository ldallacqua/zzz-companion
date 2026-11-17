import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { CharacterFileView } from './character-file-view'

const meta = {
  title: 'Screens/CharacterFile',
  component: CharacterFileView,
  tags: ['autodocs'],
  args: { id: 'nekomata' },
  parameters: { nextjs: { navigation: { pathname: '/en/characters/nekomata' } } },
  decorators: [
    (Story) => (
      <main className="max-w-6xl mx-auto">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof CharacterFileView>

export default meta
type Story = StoryObj<typeof meta>

/** Full-body poster, what you know now, earlier notes, appearances, related, build teaser. */
export const OpenWithHistory: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: /Nekomiya Mana/ })).toBeVisible()
    await expect(canvas.getByRole('heading', { name: 'Earlier notes' })).toBeInTheDocument()
    await expect(canvas.getByRole('heading', { name: 'Build' })).toBeInTheDocument()
  },
}

/** The same file early in the story: only what the reader knew then. */
export const OpenEarly: Story = {
  parameters: { companion: { lastSegmentId: 'c1a-hideouts' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByText(/newest member of the Cunning Hares/)).toBeNull()
  },
}

/** An NPC with opaque scene art and no build teaser. */
export const OpenScene: Story = {
  args: { id: 'bringer' },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading', { name: 'Build' })).toBeNull()
  },
}

/** pt-BR uses the Portuguese client's names: Fairy is "Fada". */
export const Portuguese: Story = { args: { id: 'fairy' }, globals: { locale: 'pt-BR' } }

/** Not met yet: a generic locked file that says nothing about who it is. */
export const LockedNotYet: Story = {
  args: { id: 'koleda' },
  parameters: { companion: { lastSegmentId: 'c1a-client' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'File locked' })).toBeVisible()
    await expect(canvasElement.textContent).not.toMatch(/Koleda|Belobog/)
  },
}

export const LockedNoProgress: Story = {
  parameters: { companion: { lastSegmentId: null } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('button', { name: 'Set my progress' })).toBeVisible()
    await expect(canvasElement.textContent).not.toMatch(/Nekomiya|Nekomata/)
  },
}
