import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, waitFor } from 'storybook/test'
import { useArsenal } from '@/lib/arsenal-store'
import { useRoster } from '@/lib/roster-store'
import { BuildView } from './build-view'

const meta = {
  title: 'Screens/Build',
  component: BuildView,
  tags: ['autodocs'],
  parameters: { nextjs: { navigation: { pathname: '/en/builds/ellen' } } },
  decorators: [
    (Story) => (
      <main className="max-w-6xl mx-auto">
        <Story />
      </main>
    ),
  ],
  args: { agentId: 'ellen' },
} satisfies Meta<typeof BuildView>

export default meta
type Story = StoryObj<typeof meta>

/** Not owned: everything to equip, and one tap adds the Agent to My Agents. */
export const NotOwned: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Ellen Joe' })).toBeVisible()
    await expect(canvas.getByTestId('loadout-board')).toBeVisible()
    await userEvent.click(canvas.getByRole('button', { name: 'I have this Agent' }))
    await expect(useRoster.getState().owned).toEqual({ ellen: 0 })
    await expect(canvas.getByTestId('roster-row')).toHaveTextContent('M0')
    // The button became a link: focus stays on that spot.
    await expect(canvas.getByRole('link', { name: 'My Agents' })).toHaveFocus()
  },
}

/** Marking a lower W-Engine as owned makes it "the best you have". */
export const MarkAWEngine: Story = {
  parameters: { roster: { owned: { ellen: 2 } } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'I have it: Myriad Eclipse' }))
    await expect(useArsenal.getState().wEngines).toEqual(['myriad-eclipse'])
    await expect(canvas.getByTestId('best-you-have')).toHaveTextContent('Myriad Eclipse · #2')
  },
}

/** Two variants: switching changes only the slots that differ, and the URL hash. */
export const Variants: Story = {
  args: { agentId: 'caesar' },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByText(/Slot 4: CRIT Rate/)).toBeInTheDocument()
    await expect(canvas.getByTestId('variant-diff')).toHaveTextContent(
      'What changes between builds: slot 4 and substats.',
    )
    await userEvent.click(canvas.getByRole('radio', { name: 'Anomaly' }))
    await waitFor(() => expect(canvas.getByText(/Slot 4: Anomaly Proficiency/)).toBeInTheDocument())
    await expect(window.location.hash).toBe('#anomaly')
    await userEvent.click(canvas.getByRole('radio', { name: 'CRIT' }))
    await waitFor(() => expect(window.location.hash).toBe(''))
  },
}

/** A spoiler Agent stays classified until shown (no name, art or picks). */
export const Classified: Story = {
  args: { agentId: 'pyrois' },
  play: async ({ canvas }) => {
    await expect(canvas.getByTestId('build-classified')).toBeVisible()
    await expect(canvas.queryByText('Pyrois')).toBeNull()
    await expect(canvas.queryByText('Sol Exuvia')).toBeNull()
  },
}

/** Shown once the reader reveals them. */
export const Revealed: Story = {
  args: { agentId: 'pyrois' },
  parameters: { roster: { revealed: ['pyrois'] } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Pyrois' })).toBeVisible()
  },
}

/** Portuguese. */
export const Portuguese: Story = {
  globals: { locale: 'pt-BR' },
  args: { agentId: 'yanagi' },
}
