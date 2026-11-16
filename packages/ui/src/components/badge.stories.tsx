import type { Meta, StoryObj } from '@storybook/react-vite'
import { Info } from 'lucide-react'
import { Badge } from './badge'

const VARIANTS = ['default', 'primary', 'accent', 'warning', 'outline'] as const

const meta = {
  title: 'Design system/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: 'v1.0' },
  argTypes: { variant: { control: 'inline-radio', options: VARIANTS } },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Variants: Story = {
  render: (args) => (
    <div className="gap-2 flex flex-wrap">
      {VARIANTS.map((variant) => (
        <Badge key={variant} {...args} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
}

export const WithIcon: Story = {
  args: {
    variant: 'warning',
    children: (
      <>
        <Info className="size-3" aria-hidden /> Partial
      </>
    ),
  },
}
