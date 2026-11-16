import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { Button } from '@zzz/ui'
import { PageHeading } from './page-heading'

const meta = {
  title: 'App/PageHeading',
  component: PageHeading,
  tags: ['autodocs'],
  args: {
    kicker: 'Who’s who',
    title: 'Characters',
    lede: 'Everyone you’ve met so far, described only with what you already know.',
  },
} satisfies Meta<typeof PageHeading>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Characters' })).toBeInTheDocument()
  },
}

export const WithActions: Story = {
  args: {
    kicker: 'Previously on',
    title: 'Your story so far',
    lede: undefined,
    children: (
      <div className="mt-8">
        <Button variant="outline" size="sm">
          Change progress
        </Button>
      </div>
    ),
  },
}
