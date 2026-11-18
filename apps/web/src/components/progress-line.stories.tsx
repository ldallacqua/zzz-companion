import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { ProgressLine } from './progress-line'

const meta = {
  title: 'Landing/ProgressLine',
  component: ProgressLine,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-lg p-4 bg-background font-mono text-[0.68rem] tracking-[0.16em] uppercase">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProgressLine>

export default meta
type Story = StoryObj<typeof meta>

/** The hero monitor's lower-third for a returning reader. */
export const Osd: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('You are here')).toBeVisible()
    await expect(canvas.getByText(/Part \d\d/)).toBeVisible()
  },
}

/** The outro's status: where you are and the segmented progress meter. */
export const Status: Story = {
  args: { variant: 'status' },
  decorators: [
    (Story) => <div className="tracking-normal text-base font-sans normal-case">{Story()}</div>,
  ],
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar')).toBeVisible()
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
