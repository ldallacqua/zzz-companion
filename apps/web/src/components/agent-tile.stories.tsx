import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, screen, waitFor } from 'storybook/test'
import { agentsById } from '@zzz/game'
import { AgentTile, HiddenAgentTile } from './agent-tile'

const ellen = agentsById.get('ellen')!
const miyabi = agentsById.get('miyabi')!

const meta = {
  title: 'Agents/AgentTile',
  component: AgentTile,
  tags: ['autodocs'],
  args: { agent: ellen, level: null, onToggle: fn(), onLevel: fn() },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AgentTile>

export default meta
type Story = StoryObj<typeof meta>

/** Not owned: greyscale art, neutral frame and a "Not owned" strip. Space toggles it. */
export const NotOwned: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const box = canvas.getByRole('checkbox', { name: 'Ellen' })
    await expect(box).not.toBeChecked()
    await expect(box).toHaveAccessibleDescription('S-Rank · Ice · Attack')
    await userEvent.tab()
    await expect(box).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(args.onToggle).toHaveBeenCalledWith('ellen')
  },
}

/** Owned: full colour, check stamp, attribute frame and the Mindscape strip. */
export const Owned: Story = {
  args: { level: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Ellen' })).toBeChecked()
    await expect(
      canvas.getByRole('button', { name: 'Ellen: Mindscape M2. Change' }),
    ).toBeInTheDocument()
  },
}

/** A variant attribute is described with its base (Frost counts as Ice). */
export const Variant: Story = {
  args: { agent: miyabi, level: 6 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Miyabi' })).toHaveAccessibleDescription(
      'S-Rank · Ice (Frost) · Anomaly',
    )
  },
}

/** The Mindscape popover: arrows move, Enter picks and closes, focus returns to the strip. */
export const MindscapePicker: Story = {
  args: { level: 0 },
  parameters: { a11y: { context: 'body' } },
  play: async ({ args, canvas, userEvent }) => {
    const strip = canvas.getByRole('button', { name: /Mindscape M0/ })
    await userEvent.click(strip)
    const dialog = await screen.findByRole('dialog', { name: 'Mindscape · Ellen' })
    await expect(dialog).toBeVisible()
    await waitFor(() => expect(screen.getByRole('radio', { name: 'M0' })).toHaveFocus())
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{Enter}')
    await expect(args.onLevel).toHaveBeenCalledWith('ellen', 2)
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
    await waitFor(() => expect(strip).toHaveFocus())
  },
}

/** Broken art: the agent's initials in the attribute colour, never a broken image. */
export const ImageFailed: Story = {
  args: { agent: { ...ellen, icon: 'https://example.invalid/missing.png' }, level: 1 },
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByTestId('agent-icon-fallback')).toHaveTextContent('E'))
  },
}

export const Portuguese: Story = {
  args: { agent: agentsById.get('trigger')!, level: null },
  globals: { locale: 'pt-BR' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('checkbox', { name: 'Gatilho' })).toHaveAccessibleDescription(
      'Rank S · Elétrico · Atordoador',
    )
  },
}

/** A spoiler-flagged agent: no name, art or traits until the reader confirms. */
export const Hidden: Story = {
  parameters: { a11y: { context: 'body' } },
  render: () => (
    <div className="w-40">
      <HiddenAgentTile onReveal={fn()} />
    </div>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /Hidden Agent/ }))
    await expect(await screen.findByText('Show this Agent?')).toBeVisible()
  },
}
