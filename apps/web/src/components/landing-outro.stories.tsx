import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { LandingOutro } from './landing-outro'

const meta = {
  title: 'Landing/SignOff',
  component: LandingOutro,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', nextjs: { navigation: { pathname: '/en' } } },
  decorators: [
    (Story) => (
      <main className="max-w-6xl px-4 mx-auto overflow-x-clip">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof LandingOutro>

export default meta
type Story = StoryObj<typeof meta>

/** Returning reader: where they are, with the progress meter, and "Read my recap". */
export const Returning: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('progressbar')).toBeVisible()
    await expect(await canvas.findByRole('link', { name: 'Read my recap' })).toBeVisible()
  },
}

export const FirstVisit: Story = {
  parameters: { companion: { lastSegmentId: null } },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('button', { name: 'Set my progress' })).toBeVisible()
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }
