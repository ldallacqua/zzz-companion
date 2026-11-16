import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { useUi } from '@/lib/ui-store'
import { MobileNav, SiteHeader } from './site-header'

const meta = {
  title: 'App/SiteHeader',
  component: SiteHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', nextjs: { navigation: { pathname: '/en/recap' } } },
} satisfies Meta<typeof SiteHeader>

export default meta
type Story = StoryObj<typeof meta>

/** Official ZZ mark + wordmark, desktop nav with a sliding active pill, progress chip, settings. */
export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('link', { name: 'ZZZ Companion' })).toBeInTheDocument()
    await userEvent.click(canvas.getByRole('button', { name: /progress/i }))
    await expect(useUi.getState().pickerOpen).toBe(true)
  },
}

/** Before the reader sets where they are. */
export const NoProgress: Story = { parameters: { companion: { lastSegmentId: null } } }

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }

/** Thumb-friendly tab bar shown below `md`. */
export const MobileTabBar: Story = {
  globals: { viewport: { value: 'mobile1' } },
  render: () => (
    <div className="h-40">
      <MobileNav />
    </div>
  ),
}
