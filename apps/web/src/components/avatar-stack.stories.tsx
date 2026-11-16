import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
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
