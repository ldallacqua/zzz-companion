import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, waitFor } from 'storybook/test'
import { slideInLeft } from '../lib/motion'
import { Panel } from './panel'
import { Reveal, RevealItem } from './reveal'

const meta = {
  title: 'Design system/Reveal',
  component: Reveal,
  tags: ['autodocs'],
  args: { trigger: 'mount' },
  argTypes: { trigger: { control: 'inline-radio', options: ['mount', 'view'] } },
  render: (args) => (
    <Reveal {...args} className="max-w-md space-y-3">
      {['Strongbox job', 'Enter Phaethon', 'Hijacked'].map((title) => (
        <RevealItem key={title}>
          <Panel innerClassName="p-4">
            <p className="text-2xl display">{title}</p>
          </Panel>
        </RevealItem>
      ))}
    </Reveal>
  ),
} satisfies Meta<typeof Reveal>

export default meta
type Story = StoryObj<typeof meta>

/** Children stagger in. With motion off they simply appear. */
export const Stagger: Story = {
  play: async ({ canvas }) => {
    await waitFor(() => expect(canvas.getByText('Hijacked')).toBeVisible())
  },
}

export const SlideFromLeft: Story = {
  render: (args) => (
    <Reveal {...args} variants={slideInLeft}>
      <Panel innerClassName="p-4" frame="#ff8a00">
        <p className="text-3xl display">Cat&apos;s Lost &amp; Found</p>
      </Panel>
    </Reveal>
  ),
}

/** Default in the app: animates once the block scrolls into view. */
export const OnScroll: Story = { args: { trigger: 'view' } }
