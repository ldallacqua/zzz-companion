import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { charactersById } from '@zzz/story'
import { Portrait } from './portrait'

const nicole = charactersById.get('nicole')!

const meta = {
  title: 'App/Portrait',
  component: Portrait,
  tags: ['autodocs'],
  args: {
    src: nicole.image,
    name: nicole.name,
    color: nicole.color,
    focus: nicole.focus,
    alt: nicole.name,
    sizes: '256px',
    framing: 'bust',
  },
  argTypes: { framing: { control: 'inline-radio', options: ['bust', 'face', 'full'] } },
  render: (args) => (
    <span
      className="w-64 relative block aspect-[4/5] overflow-hidden bg-surface-2 chamfer"
      style={{ boxShadow: `inset 0 -3px 0 ${args.color}` }}
    >
      <Portrait {...args} />
    </span>
  ),
} satisfies Meta<typeof Portrait>

export default meta
type Story = StoryObj<typeof meta>

/** Waist up, face in the upper third — cards. */
export const Bust: Story = {}

/** Head and shoulders, face centred — avatars and intel cards. */
export const Face: Story = {
  args: { framing: 'face', sizes: '96px' },
  render: (args) => (
    <span className="size-24 relative block overflow-hidden bg-surface-2 chamfer-sm">
      <Portrait {...args} />
    </span>
  ),
}

/** The whole art, for a future character page. */
export const Full: Story = { args: { framing: 'full' } }

/** Art that has its own background is never cropped past its edges. */
export const OpaqueArt: Story = {
  args: (() => {
    const c = charactersById.get('bringer')!
    return { src: c.image, name: c.name, color: c.color, focus: c.focus, alt: c.name }
  })(),
}

/** No art (or the CDN is down): a monogram keeps the layout intact. */
export const Fallback: Story = {
  args: { src: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('img', { name: 'Nicole Demara' })).toHaveTextContent('ND')
  },
}
