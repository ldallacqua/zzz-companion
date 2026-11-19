import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { useTranslations } from 'next-intl'
import { RouteMessages } from './route-messages'

/** Reads a shared message and one the route provides (here, an override of builds.title). */
function Probe() {
  const nav = useTranslations('nav')
  const builds = useTranslations('builds')
  return (
    <p>
      {nav('recap')} · {builds('title')}
    </p>
  )
}

const meta = {
  title: 'App/RouteMessages',
  component: RouteMessages,
  tags: ['autodocs'],
  args: { messages: { builds: { title: 'From the route' } }, children: <Probe /> },
} satisfies Meta<typeof RouteMessages>

export default meta
type Story = StoryObj<typeof meta>

/** The layout's messages stay available, and the route's namespace is merged in. */
export const Merged: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Recap · From the route')).toBeInTheDocument()
  },
}
