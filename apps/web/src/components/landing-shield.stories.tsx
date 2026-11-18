import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import { SHIELD_FINAL, SHIELD_START, sceneAt } from '@/lib/shield-scene'
import { LandingShield, ShieldMock } from './landing-shield'

const meta = {
  title: 'Landing/Shield',
  component: LandingShield,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <main className="max-w-6xl mx-auto">
        <Story />
      </main>
    ),
  ],
} satisfies Meta<typeof LandingShield>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Act 1. Stories run with motion off, so this is the static version: the final scene and all
 * three steps. With full motion on desktop the act pins and scrolling plays the scene.
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent(
      'Spoilers stop where you stopped.',
    )
    await expect(canvas.getAllByRole('listitem').length).toBeGreaterThanOrEqual(3)
    await expect(canvas.getByTestId('shield-mock')).toHaveAttribute('data-step', '2')
  },
}

export const Portuguese: Story = { globals: { locale: 'pt-BR' } }

function Mock(props: ComponentProps<typeof ShieldMock>) {
  return (
    <div className="w-[480px]">
      <ShieldMock {...props} />
    </div>
  )
}

/** The mock recap at each beat of the scene. */
export const MockStart: Story = { render: () => <Mock {...SHIELD_START} /> }
export const MockShieldOn: Story = { render: () => <Mock {...sceneAt(0.3)} /> }
export const MockFull: Story = { render: () => <Mock {...sceneAt(0.5)} /> }
export const MockFiles: Story = { render: () => <Mock {...SHIELD_FINAL} /> }
