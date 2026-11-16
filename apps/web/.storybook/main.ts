import type { StorybookConfig } from '@storybook/nextjs-vite'

/**
 * One Storybook for the whole product: the design system (`packages/ui`) and the app's own
 * components (`apps/web`). Every component has a story — see AGENTS.md → "Storybook".
 */
const config: StorybookConfig = {
  stories: [
    '../../../packages/ui/src/**/*.stories.@(ts|tsx)',
    '../src/**/*.mdx',
    '../src/**/*.stories.@(ts|tsx)',
  ],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
  framework: { name: '@storybook/nextjs-vite', options: {} },
  staticDirs: ['../public'],
  core: { disableTelemetry: true },
}

export default config
