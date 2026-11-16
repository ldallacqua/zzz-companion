import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'
import storybook from 'eslint-plugin-storybook'

const config = [
  ...nextVitals,
  ...nextTs,
  ...storybook.configs['flat/recommended'],
  {
    ignores: [
      '.next/**',
      'out/**',
      'storybook-static/**',
      'playwright-report/**',
      'test-results/**',
      'next-env.d.ts',
    ],
  },
]

export default config
