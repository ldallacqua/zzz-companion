import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent } from 'storybook/test'
import { useUi } from '@/lib/ui-store'
import { PickerButton } from './picker-button'

const meta = {
  title: 'App/PickerButton',
  component: PickerButton,
  tags: ['autodocs'],
  args: { children: 'Set my progress', size: 'lg' },
} satisfies Meta<typeof PickerButton>

export default meta
type Story = StoryObj<typeof meta>

/** Opens the progress picker; a small client island for server-rendered pages. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Set my progress' }))
    await expect(useUi.getState().pickerOpen).toBe(true)
    useUi.setState({ pickerOpen: false })
  },
}

export const Outline: Story = { args: { variant: 'outline', children: 'Change progress' } }
