import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { RichBlock } from './rich-text'

const PARAGRAPHS = [
  'Nicole hires **Phaethon** to crack a Hollow job, and Anby and Billy tag along.',
  'Later, H.A.N.D. sends Section 6 — Miyabi first among them — into Hollow Zero.',
]

const meta = {
  title: 'App/RichBlock',
  component: RichBlock,
  tags: ['autodocs'],
  args: {
    paragraphs: PARAGRAPHS,
    render: (children) => <p className="max-w-xl mb-3 leading-relaxed">{children}</p>,
  },
} satisfies Meta<typeof RichBlock>

export default meta
type Story = StoryObj<typeof meta>

/** Recap text: **bold** markup plus tappable names (first mention per block only). */
export const Linked: Story = {
  play: async ({ canvasElement }) => {
    const names = [...canvasElement.querySelectorAll('[data-entity]')].map((el) => el.textContent)
    await expect(names).toEqual(expect.arrayContaining(['Nicole', 'H.A.N.D.', 'Miyabi']))
  },
}

/** Spoiler shield: before the reader meets Section 6, those names stay plain text. */
export const EarlyProgress: Story = {
  parameters: { companion: { lastSegmentId: 'p-strongbox' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-entity="character:miyabi"]')).toBeNull()
  },
}
