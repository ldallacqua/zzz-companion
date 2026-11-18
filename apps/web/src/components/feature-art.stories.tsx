import type { ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect } from 'storybook/test'
import {
  FilesArt,
  GlossaryArt,
  IntelArt,
  LanguagesArt,
  PrivateArt,
  ScreensArt,
  SyncArt,
} from './feature-art'

/** A bento tile's art area, so each illustration renders at a realistic size. */
function Box({ children, tall }: { children: ReactNode; tall?: boolean }) {
  return (
    <div className={`relative w-[36rem] max-w-full bg-surface ${tall ? 'h-[26rem]' : 'h-56'}`}>
      {children}
    </div>
  )
}

const meta = {
  title: 'Landing/FeatureArt',
  component: IntelArt,
  tags: ['autodocs'],
} satisfies Meta<typeof IntelArt>

export default meta
type Story = StoryObj<typeof meta>

/** Tap-to-explain: a tap on "Belle" opens her intel card (no story text, only placeholder lines). */
export const Intel: Story = {
  render: () => (
    <Box tall>
      <IntelArt />
    </Box>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getAllByText('Belle').length).toBeGreaterThan(0)
    await expect(canvas.getByText('As of Prologue')).toBeInTheDocument()
  },
}

/** Character files dealt into a fan; the middle one is still classified. */
export const Files: Story = {
  render: () => (
    <Box tall>
      <FilesArt />
    </Box>
  ),
}

export const Glossary: Story = {
  render: () => (
    <Box>
      <GlossaryArt />
    </Box>
  ),
}

/** The official pt-BR term next to the English one. */
export const Languages: Story = {
  render: () => (
    <Box>
      <LanguagesArt />
    </Box>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Hollow')).toHaveAttribute('lang', 'en')
    await expect(canvas.getByText('Esfera Negra')).toHaveAttribute('lang', 'pt-BR')
  },
}

export const Screens: Story = {
  render: () => (
    <Box>
      <ScreensArt />
    </Box>
  ),
}

export const PrivateAndSync: Story = {
  render: () => (
    <div className="gap-10 p-6 grid bg-surface">
      <PrivateArt />
      <SyncArt />
    </div>
  ),
}

export const Portuguese: Story = {
  render: Intel.render,
  globals: { locale: 'pt-BR' },
}
