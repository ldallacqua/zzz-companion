import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, waitFor } from 'storybook/test'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './popover'

const meta = {
  title: 'Design system/Popover',
  component: PopoverContent,
  tags: ['autodocs'],
  // The content is portalled to <body>: check accessibility there, not just in the story root.
  parameters: { a11y: { context: 'body' } },
  args: { frame: 'var(--color-primary)' },
  render: (args) => (
    <Popover>
      <PopoverTrigger className="cursor-pointer underline decoration-primary decoration-2 underline-offset-4">
        H.A.N.D.
      </PopoverTrigger>
      <PopoverContent {...args} aria-label="About H.A.N.D.">
        <div className="p-4">
          <p className="font-mono text-[0.65rem] tracking-[0.2em] text-primary uppercase">
            Glossary
          </p>
          <p className="mt-1 text-2xl display">H.A.N.D.</p>
          <p className="mt-2 text-sm text-muted">
            The government body whose special forces handle the deadliest threats.
          </p>
          <PopoverClose className="mt-3 text-xs cursor-pointer underline">Close</PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof PopoverContent>

export default meta
type Story = StoryObj<typeof meta>

/** The "intel card" used for tappable names in the recap. Escape closes it. */
export const IntelCard: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'H.A.N.D.' }))
    const card = await screen.findByRole('dialog', { name: 'About H.A.N.D.' })
    await expect(card).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

/** Left open, so the accessibility check covers the card itself. */
export const Open: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'H.A.N.D.' }))
    await expect(await screen.findByRole('dialog')).toBeVisible()
  },
}
