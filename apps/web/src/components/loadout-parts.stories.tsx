import type { CSSProperties } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { FixedBay, LitBay } from './loadout-parts'

/** The slots around the Agent on the loadout board, shared by the build page and the landing. */
const meta = {
  title: 'Builds/LoadoutParts',
  component: LitBay,
  tags: ['autodocs'],
  args: { slot: '4', groups: [['crit-rate', 'crit-dmg']] },
  decorators: [
    (Story) => (
      <ol
        className="gap-x-2 gap-y-1.5 grid max-w-[30rem] grid-cols-3 grid-rows-[repeat(6,minmax(2.6rem,auto))]"
        style={{ '--agent': '#7ed2ff' } as CSSProperties}
      >
        <Story />
      </ol>
    ),
  ],
} satisfies Meta<typeof LitBay>

export default meta
type Story = StoryObj<typeof meta>

/** All six slots: 1–3 fixed and receding, 4–6 lit with the stat to aim for and the fallbacks. */
export const Ring: Story = {
  render: () => (
    <>
      <FixedBay slot="1" />
      <FixedBay slot="2" />
      <FixedBay slot="3" />
      <LitBay slot="4" groups={[['crit-rate', 'crit-dmg']]} />
      <LitBay slot="5" groups={[['pen-ratio'], ['ice-dmg']]} />
      <LitBay slot="6" groups={[['atk-pct']]} />
    </>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Slot 1: HP (Fixed)')).toBeInTheDocument()
    await expect(canvas.getByText('Slot 5: PEN Ratio, then Ice DMG Bonus')).toBeInTheDocument()
  },
}

/** A lit slot with a tie and a fallback, in Portuguese. */
export const Portuguese: Story = {
  args: { slot: '5', groups: [['pen-ratio', 'ice-dmg'], ['atk-pct']] },
  globals: { locale: 'pt-BR' },
}
