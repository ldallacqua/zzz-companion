import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Switch } from './switch'

const meta = {
  title: 'Design system/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { onCheckedChange: fn(), id: 'story-switch' },
  render: (args) => (
    <div className="gap-3 flex items-center">
      <Switch {...args} />
      <label htmlFor={args.id} className="text-sm">
        Spoiler-safe mode
      </label>
    </div>
  ),
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Off: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const toggle = canvas.getByRole('switch', { name: 'Spoiler-safe mode' })
    await userEvent.click(toggle)
    await expect(toggle).toBeChecked()
    await expect(args.onCheckedChange).toHaveBeenCalledWith(true)
  },
}

export const On: Story = { args: { defaultChecked: true } }

export const Disabled: Story = { args: { disabled: true } }
