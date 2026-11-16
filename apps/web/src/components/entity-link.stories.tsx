import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen } from 'storybook/test'
import { EntityLink } from './entity-link'

const meta = {
  title: 'App/EntityLink',
  component: EntityLink,
  tags: ['autodocs'],
  // Intel cards are portalled to <body>: check accessibility there.
  parameters: { a11y: { context: 'body' }, layout: 'centered' },
  args: { entityKey: 'term:hand', children: 'H.A.N.D.' },
  render: (args) => (
    <p className="max-w-md pt-72 text-lg">
      Section 6 answers to <EntityLink {...args} /> — and nobody else.
    </p>
  ),
} satisfies Meta<typeof EntityLink>

export default meta
type Story = StoryObj<typeof meta>

/** Tap a glossary term: the card explains it and links to the glossary. */
export const Term: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'H.A.N.D.' }))
    const card = await screen.findByRole('dialog')
    await expect(card).toHaveTextContent(/glossary/i)
  },
}

/** Characters show their portrait, factions and what you know about them. */
export const Character: Story = {
  args: { entityKey: 'character:miyabi', children: 'Miyabi', strong: true },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Miyabi' }))
    const card = await screen.findByRole('dialog')
    await expect(card).toHaveTextContent('Hoshimi Miyabi')
  },
}

export const Faction: Story = {
  args: { entityKey: 'faction:cunning-hares', children: 'Cunning Hares' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Cunning Hares' }))
    await expect(await screen.findByRole('dialog')).toBeVisible()
  },
}

/**
 * Inside the recap, a card explains the name as known in *that* part. In Chapter 1A, Nekomata is
 * still a mysterious client…
 */
export const AsOfEarlyPart: Story = {
  args: { entityKey: 'character:nekomata', children: 'Nekomata', at: 'c1a-client' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Nekomata' }))
    const card = await screen.findByRole('dialog')
    await expect(card).toHaveTextContent(/keeping secrets/)
    await expect(card).not.toHaveTextContent(/Red Fang/)
    await expect(card).toHaveTextContent(/As of Ch\. 1A/i)
  },
}

/** …while the same name, tapped in the Chapter 1B finale, reflects what the story revealed. */
export const AsOfLaterPart: Story = {
  args: { entityKey: 'character:nekomata', children: 'Nekomata', at: 'c1b-butcher' },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Nekomata' }))
    const card = await screen.findByRole('dialog')
    await expect(card).toHaveTextContent(/newest member of the Cunning Hares/)
  },
}

/** An unknown key renders plain text — never a broken link. */
export const Unknown: Story = {
  args: { entityKey: 'term:nope', children: 'something' },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button')).toBeNull()
  },
}
