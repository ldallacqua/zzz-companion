import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Segmented, type SegmentedProps } from './segmented'

type Mode = 'tldr' | 'full' | 'off'

function Controlled(args: SegmentedProps<Mode>) {
  const [value, setValue] = useState<Mode>(args.value)
  return (
    <Segmented<Mode>
      {...args}
      value={value}
      onValueChange={(v) => {
        setValue(v)
        args.onValueChange(v)
      }}
    />
  )
}

const meta = {
  title: 'Design system/Segmented',
  component: Controlled,
  tags: ['autodocs'],
  args: {
    label: 'Recap mode',
    layoutId: 'story-segmented',
    value: 'tldr',
    onValueChange: fn(),
    options: [
      { value: 'tldr', label: 'TL;DR' },
      { value: 'full', label: 'Full' },
    ],
  },
} satisfies Meta<typeof Controlled>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const full = canvas.getByRole('radio', { name: 'Full' })
    await userEvent.click(full)
    await expect(args.onValueChange).toHaveBeenCalledWith('full')
    await expect(full).toHaveAttribute('data-state', 'on')
  },
}

/** Arrow keys move between options (Radix roving focus). */
export const Keyboard: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab()
    await expect(canvas.getByRole('radio', { name: 'TL;DR' })).toHaveFocus()
    await userEvent.keyboard('{ArrowRight}')
    await expect(canvas.getByRole('radio', { name: 'Full' })).toHaveFocus()
  },
}

export const ThreeOptions: Story = {
  args: {
    label: 'Motion',
    layoutId: 'story-segmented-motion',
    value: 'full',
    options: [
      { value: 'tldr', label: 'Full' },
      { value: 'full', label: 'Reduced' },
      { value: 'off', label: 'Off' },
    ],
  },
}
