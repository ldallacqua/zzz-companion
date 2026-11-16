import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen } from 'storybook/test'
import { AvatarStack } from './avatar-stack'

const meta = {
  title: 'App/AvatarStack',
  component: AvatarStack,
  tags: ['autodocs'],
  args: { label: 'Featuring', ids: ['nicole', 'anby', 'billy', 'belle', 'wise', 'eous'] },
} satisfies Meta<typeof AvatarStack>

export default meta
type Story = StoryObj<typeof meta>

/** Head-and-shoulders crops of everyone in a recap part. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('listitem')).toHaveLength(6)
    await expect(canvas.getByRole('img', { name: 'Nicole Demara' })).toBeInTheDocument()
  },
}

export const SectionSix: Story = {
  args: { ids: ['miyabi', 'yanagi', 'harumasa', 'soukaku'] },
}

/** Unknown ids are skipped; with nobody left, nothing renders. */
export const Empty: Story = {
  args: { ids: ['nobody'] },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('ul')).toBeNull()
  },
}

/**
 * Inside a recap part (`at`), each face is a 40px button that opens the character's intel card as
 * of that part, so who-is-who also works on touch screens.
 */
export const Tappable: Story = {
  args: { at: 'p-fairy', ids: ['belle', 'wise', 'fairy', 'shepherd', 'nicole'] },
  parameters: { a11y: { context: 'body' } },
  play: async ({ canvas, userEvent }) => {
    const fairy = canvas.getByRole('button', { name: 'Fairy' })
    await expect(fairy.offsetHeight).toBeGreaterThanOrEqual(40)
    await userEvent.click(fairy)
    const card = await screen.findByRole('dialog', { name: 'Fairy' })
    await expect(card).toHaveTextContent(/As of/i)
  },
}

/** pt-BR uses the names of the Portuguese game client (Fairy is "Fada"). */
export const PortugueseNames: Story = {
  args: { at: 'p-fairy', ids: ['fairy', 'shepherd'] },
  globals: { locale: 'pt-BR' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Fada' })).toBeInTheDocument()
    await expect(canvas.getByRole('img', { name: 'Pastor' })).toBeInTheDocument()
  },
}
