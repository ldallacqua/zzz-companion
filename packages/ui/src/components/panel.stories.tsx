import type { Meta, StoryObj } from '@storybook/react-vite'
import { Panel } from './panel'

const meta = {
  title: 'Design system/Panel',
  component: Panel,
  tags: ['autodocs'],
  args: {
    innerClassName: 'p-6',
    children: (
      <>
        <h3 className="text-3xl display">Enter Phaethon</h3>
        <p className="mt-2 max-w-md text-muted">
          Chamfered card: the frame is a 1px gap between an outer coloured shape and the surface.
        </p>
      </>
    ),
  },
} satisfies Meta<typeof Panel>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Framed: Story = { args: { frame: 'var(--color-primary)' } }

export const ContentAccent: Story = { args: { frame: '#ff4fa3' } }
