import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen, within } from 'storybook/test'
import { useCompanion } from '@/lib/store'
import { ProgressPicker } from './progress-picker'

const meta = {
  title: 'App/ProgressPicker',
  component: ProgressPicker,
  tags: ['autodocs'],
  // Opens as a sheet portalled to <body>.
  parameters: { a11y: { context: 'body' }, ui: { pickerOpen: true } },
} satisfies Meta<typeof ProgressPicker>

export default meta
type Story = StoryObj<typeof meta>

/** "Where are you?" — every recap part in story order. */
export const Open: Story = {
  play: async () => {
    await expect(await screen.findByRole('dialog')).toBeVisible()
  },
}

export const FromScratch: Story = {
  parameters: { companion: { lastSegmentId: null } },
  play: async ({ userEvent }) => {
    const dialog = await screen.findByRole('dialog')
    const chapters = within(dialog).getAllByRole('button', { expanded: false })
    await userEvent.click(chapters[0]!)
    const parts = await within(dialog).findAllByRole('button', { pressed: false })
    await userEvent.click(parts[1]!)
    await expect(useCompanion.getState().lastSegmentId).not.toBeNull()
  },
}
