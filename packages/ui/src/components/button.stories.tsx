import type { Meta, StoryObj } from '@storybook/react-vite'
import { ArrowRight, Settings2 } from 'lucide-react'
import { expect, fn } from 'storybook/test'
import { Button } from './button'

const VARIANTS = ['primary', 'accent', 'secondary', 'outline', 'ghost'] as const
const SIZES = ['sm', 'md', 'lg'] as const

const meta = {
  title: 'Design system/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Read my recap', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: VARIANTS },
    size: { control: 'inline-radio', options: [...SIZES, 'icon'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /read my recap/i }))
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

/**
 * Keyboard focus is drawn *inside* the chamfered shape (an outer outline would be cut off by the
 * clip-path), dark on the lime fill and lime on everything else.
 */
export const KeyboardFocus: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      <Button {...args}>Primary</Button>
      <Button {...args} variant="outline" size="sm">
        Outline
      </Button>
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    for (const name of ['Primary', 'Outline']) {
      await userEvent.tab()
      const button = canvas.getByRole('button', { name })
      await expect(button).toHaveFocus()
      const style = getComputedStyle(button)
      await expect(style.outlineStyle).toBe('solid')
      await expect(parseFloat(style.outlineOffset)).toBeLessThan(0)
    }
    // sm buttons are still a 40px tap target.
    await expect(
      canvas.getByRole('button', { name: 'Outline' }).offsetHeight,
    ).toBeGreaterThanOrEqual(40)
  },
}

export const Variants: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      {VARIANTS.map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
}

export const Sizes: Story = {
  render: (args) => (
    <div className="gap-3 flex flex-wrap items-center">
      {SIZES.map((size) => (
        <Button key={size} {...args} size={size}>
          Size {size}
        </Button>
      ))}
    </div>
  ),
}

export const WithIcon: Story = {
  args: {
    children: (
      <>
        Read my recap <ArrowRight aria-hidden />
      </>
    ),
  },
}

export const IconOnly: Story = {
  args: {
    size: 'icon',
    variant: 'outline',
    'aria-label': 'Settings',
    children: <Settings2 aria-hidden />,
  },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button')).toBeDisabled()
  },
}

export const AsLink: Story = {
  args: { asChild: true, children: <a href="#recap">Go to the recap</a> },
}
