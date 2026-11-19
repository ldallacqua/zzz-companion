import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { PriorityChain } from './priority-chain'

const meta = {
  title: 'Builds/PriorityChain',
  component: PriorityChain,
  tags: ['autodocs'],
  args: {
    label: 'Substats',
    groups: [['CRIT DMG', 'CRIT Rate'], ['ATK%'], ['PEN (flat)', 'ATK (flat)']],
  },
} satisfies Meta<typeof PriorityChain>

export default meta
type Story = StoryObj<typeof meta>

/** Ties read "tied with" to screen readers; the first group is highlighted. */
export const WithTies: Story = {
  play: async ({ canvas }) => {
    const list = canvas.getByRole('list', { name: 'Substats' })
    await expect(list.querySelectorAll(':scope > li')).toHaveLength(3)
    await expect(canvas.getAllByText('tied with')).toHaveLength(2)
  },
}

/** A strict order (skill priority). */
export const Ordered: Story = {
  args: {
    label: 'Skill priority',
    groups: [['Chain Attack'], ['Special Attack'], ['Basic Attack'], ['Dodge'], ['Assist']],
  },
}

/** Long Portuguese labels wrap at 360px. */
export const LongLabels: Story = {
  globals: { locale: 'pt-BR' },
  decorators: [
    (Story) => (
      <div className="w-[328px]">
        <Story />
      </div>
    ),
  ],
  args: {
    label: 'Substatus',
    groups: [['Proficiência de Anomalia', 'ATQ%'], ['Perfuração (fixa)'], ['ATQ (fixo)']],
  },
}
