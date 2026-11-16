import type { Meta, StoryObj } from '@storybook/react-vite'
import { Marquee } from './marquee'

const meta = {
  title: 'Design system/Marquee',
  component: Marquee,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    items: ['Spoiler-safe', 'Previously on New Eridu', 'Proxy business only', 'Mind the Hollow'],
  },
  argTypes: { tone: { control: 'inline-radio', options: ['hazard', 'dark'] } },
} satisfies Meta<typeof Marquee>

export default meta
type Story = StoryObj<typeof meta>

/** Hazard tape. The loop is ambient: it stops when motion is reduced or off. */
export const Hazard: Story = {}

export const Dark: Story = { args: { tone: 'dark', duration: 40 } }
