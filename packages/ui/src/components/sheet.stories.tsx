import * as React from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, waitFor } from 'storybook/test'
import { Button } from './button'
import { Sheet, SheetContent, SheetTrigger } from './sheet'

const meta = {
  title: 'Design system/Sheet',
  component: SheetContent,
  tags: ['autodocs'],
  // The sheet is portalled to <body>: check accessibility there, not just in the story root.
  parameters: { a11y: { context: 'body' } },
  args: {
    heading: 'Settings',
    description: 'Language and motion.',
    closeLabel: 'Close',
  },
  render: (args) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open settings</Button>
      </SheetTrigger>
      <SheetContent {...args}>
        <p className="text-muted">Bottom sheet on phones, side drawer from tablets up.</p>
      </SheetContent>
    </Sheet>
  ),
} satisfies Meta<typeof SheetContent>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open settings' }))
    const dialog = await screen.findByRole('dialog', { name: 'Settings' })
    await expect(dialog).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  },
}

/** Left open, so the accessibility check covers the sheet itself. */
export const Open: Story = {
  args: { description: undefined, heading: 'Where are you?' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Open settings' }))
    await expect(await screen.findByRole('dialog', { name: 'Where are you?' })).toBeVisible()
  },
}

function OpenedFromState(args: React.ComponentProps<typeof SheetContent>) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Change progress
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent {...args}>
          <p className="text-muted">Opened from app state: there is no SheetTrigger.</p>
        </SheetContent>
      </Sheet>
    </>
  )
}

/**
 * The app opens its sheets from state (several buttons can open the same sheet). Closing must
 * still return focus to the button that opened it, not drop it on <body>.
 */
export const OpenedFromAppState: Story = {
  render: (args) => <OpenedFromState {...args} />,
  play: async ({ canvas, userEvent }) => {
    const opener = canvas.getByRole('button', { name: 'Change progress' })
    await userEvent.click(opener)
    await expect(await screen.findByRole('dialog', { name: 'Settings' })).toBeVisible()
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    await waitFor(() => expect(opener).toHaveFocus())
  },
}
