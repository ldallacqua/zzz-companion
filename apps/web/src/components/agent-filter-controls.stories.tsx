import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen } from 'storybook/test'
import { EMPTY_FILTERS, type AgentFilters as Filters } from '@/lib/agent-filters'
import { ActiveFilters, AgentFilters, AgentFilterSheet } from './agent-filter-controls'

function Controlled({
  layout,
  initial = EMPTY_FILTERS,
}: {
  layout: 'sheet' | 'inline'
  initial?: Filters
}) {
  const [value, setValue] = useState(initial)
  return (
    <div className="space-y-6">
      <AgentFilters layout={layout} value={value} onChange={setValue} />
      <ActiveFilters value={value} onChange={setValue} />
      <output className="text-xs block font-mono text-muted" data-testid="state">
        {JSON.stringify({ r: value.ranks, a: value.attributes, s: value.specialties })}
      </output>
    </div>
  )
}

const meta = {
  title: 'Agents/AgentFilters',
  component: AgentFilters,
  tags: ['autodocs'],
  args: { value: EMPTY_FILTERS, onChange: () => {}, layout: 'inline' },
} satisfies Meta<typeof AgentFilters>

export default meta
type Story = StoryObj<typeof meta>

/** Desktop: two rows of toggle chips (aria-pressed). Attribute icons carry the attribute colour. */
export const Inline: Story = {
  render: () => <Controlled layout="inline" />,
  play: async ({ canvas, userEvent }) => {
    const ice = canvas.getByRole('button', { name: 'Ice' })
    await userEvent.click(ice)
    await expect(ice).toHaveAttribute('aria-pressed', 'true')
    await userEvent.click(canvas.getByRole('button', { name: 'S-Rank' }))
    await expect(canvas.getByTestId('state')).toHaveTextContent('"r":["S"],"a":["ice"]')
    // Removable chips (phones) undo a filter.
    await userEvent.click(canvas.getByRole('button', { name: 'Remove filter: Ice' }))
    await expect(ice).toHaveAttribute('aria-pressed', 'false')
  },
}

/** Several filters on, as removable chips. */
export const ActiveChips: Story = {
  render: () => (
    <Controlled
      layout="inline"
      initial={{ ...EMPTY_FILTERS, ranks: ['A'], attributes: ['fire'], specialties: ['stun'] }}
    />
  ),
}

/** Phones: the Filters sheet, with sort and a live result count in its footer. */
export const Sheet: Story = {
  parameters: { a11y: { context: 'body' } },
  render: () => {
    const [value, setValue] = useState<Filters>(EMPTY_FILTERS)
    return (
      <AgentFilterSheet
        open
        onOpenChange={() => {}}
        value={value}
        onChange={setValue}
        resultCount={value.attributes.length ? 9 : 61}
      />
    )
  },
  play: async ({ userEvent }) => {
    const dialog = await screen.findByRole('dialog', { name: 'Filters' })
    await expect(dialog).toBeVisible()
    await userEvent.click(screen.getByRole('button', { name: 'Electric' }))
    await expect(screen.getByRole('button', { name: 'Show 9 Agents' })).toBeVisible()
  },
}

/** Nothing matches: the footer button says so and does nothing. */
export const SheetNoResults: Story = {
  parameters: { a11y: { context: 'body' } },
  render: () => (
    <AgentFilterSheet
      open
      onOpenChange={() => {}}
      value={{ ...EMPTY_FILTERS, ranks: ['A'], attributes: ['wind'] }}
      onChange={() => {}}
      resultCount={0}
    />
  ),
  play: async () => {
    await expect(await screen.findByRole('button', { name: 'No Agents' })).toHaveAttribute(
      'aria-disabled',
      'true',
    )
  },
}

export const Portuguese: Story = {
  globals: { locale: 'pt-BR' },
  render: () => <Controlled layout="sheet" />,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Atordoador' })).toBeVisible()
    await expect(canvas.getByRole('button', { name: 'Éter' })).toBeVisible()
  },
}
