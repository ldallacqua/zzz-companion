import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, screen } from 'storybook/test'
import { SettingsSheet } from './settings-sheet'

const meta = {
  title: 'App/SettingsSheet',
  component: SettingsSheet,
  tags: ['autodocs'],
  parameters: { a11y: { context: 'body' }, ui: { settingsOpen: true } },
} satisfies Meta<typeof SettingsSheet>

export default meta
type Story = StoryObj<typeof meta>

/** Language, motion (system / full / reduced / off) and progress reset. */
export const Open: Story = {
  play: async () => {
    await expect(await screen.findByRole('dialog')).toBeVisible()
  },
}

export const Portuguese: Story = {
  globals: { locale: 'pt-BR' },
  play: async () => {
    await expect(await screen.findByRole('dialog')).toBeVisible()
  },
}
