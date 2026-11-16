import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { SiteFooter } from './site-footer'

const meta = {
  title: 'App/SiteFooter',
  component: SiteFooter,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SiteFooter>

export default meta
type Story = StoryObj<typeof meta>

/** Unofficial-project disclaimer plus HoYoverse's required legal statement. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/All rights reserved by HoYoverse/)).toBeInTheDocument()
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
