import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent } from 'storybook/test'
import { useCompanion } from '@/lib/store'
import { MotionSwitch } from './motion-switch'

const meta = {
  title: 'Landing/MotionSwitch',
  component: MotionSwitch,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-sm p-6 bg-surface">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MotionSwitch>

export default meta
type Story = StoryObj<typeof meta>

/** The real Animations setting on the landing page: changing it here changes the app. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const reduced = canvas.getByRole('radio', { name: 'Reduced' })
    await userEvent.click(reduced)
    await expect(reduced).toHaveAttribute('aria-checked', 'true')
    await expect(useCompanion.getState().motion).toBe('reduced')
    await userEvent.click(canvas.getByRole('radio', { name: 'Off' }))
    await expect(useCompanion.getState().motion).toBe('off')
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
