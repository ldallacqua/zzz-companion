/// <reference types="vite/client" />
import type { Preview } from '@storybook/nextjs-vite'
import { Barlow_Condensed, Geist, Geist_Mono } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { MotionGlobalConfig } from 'motion/react'
import type { Locale } from '@zzz/core'
import { Providers } from '@/components/providers'
import { useCompanion, type CompanionState } from '@/lib/store'
import { useUi } from '@/lib/ui-store'
import { useAccount } from '@/lib/account-store'
import { useRoster, type SyncStatus } from '@/lib/roster-store'
import { useArsenal } from '@/lib/arsenal-store'
import type { AccountUser } from '@/lib/api'
import en from '../messages/en.json'
import ptBR from '../messages/pt-BR.json'
import '../src/app/globals.css'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-barlow',
})
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
// The font variables must live on <html>, where the design tokens resolve them.
document.documentElement.classList.add(barlow.variable, geist.variable, geistMono.variable)

const messages = { en, 'pt-BR': ptBR } as const

declare module '@storybook/nextjs-vite' {
  interface Parameters {
    /** Store state for the story (defaults: finished up to the latest recap part, hydrated). */
    companion?: Partial<Pick<CompanionState, 'lastSegmentId' | 'recapMode' | 'hydrated'>>
    /** Layout UI state (open sheets). */
    ui?: { pickerOpen?: boolean; settingsOpen?: boolean }
    /** Account state (default: accounts available on this build, signed out). */
    account?: { enabled?: boolean; user?: AccountUser | null }
    /** Roster on this device (default: empty guest roster). */
    roster?: { owned?: Record<string, number>; sync?: SyncStatus; revealed?: string[] }
    /** W-Engines the player marked as owned (default: none). */
    arsenal?: { wEngines?: string[] }
  }
}

const preview: Preview = {
  initialGlobals: {
    locale: 'en',
    // Tests run with motion off so axe never measures a half-faded element.
    motion: import.meta.env.MODE === 'test' ? 'off' : 'system',
  },
  globalTypes: {
    locale: {
      description: 'Language',
      toolbar: {
        title: 'Locale',
        icon: 'globe',
        items: [
          { value: 'en', title: 'English' },
          { value: 'pt-BR', title: 'Português (BR)' },
        ],
        dynamicTitle: true,
      },
    },
    motion: {
      description: 'Motion preference (the app’s Settings → Motion)',
      toolbar: {
        title: 'Motion',
        icon: 'lightning',
        items: [
          { value: 'system', title: 'Follow the OS' },
          { value: 'full', title: 'Full motion' },
          { value: 'reduced', title: 'Reduced' },
          { value: 'off', title: 'Off' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'padded',
    nextjs: { appDirectory: true, navigation: { pathname: '/' } },
    controls: { matchers: { color: /(background|color|frame|accent)$/i } },
    backgrounds: { disable: true },
    // Accessibility is a test, not a hint: any axe violation fails `pnpm test:storybook`.
    a11y: { test: 'error' },
  },
  beforeEach: ({ parameters, globals }) => {
    // Mirror the app's boot script: the motion level is in place before the first frame.
    const level = globals.motion === 'system' || !globals.motion ? null : globals.motion
    MotionGlobalConfig.skipAnimations = level === 'off'
    if (level) {
      document.documentElement.dataset.motion = level
      document.documentElement.dataset.motionStart = level
    }
    useCompanion.setState({
      lastSegmentId: 'i2b-farewell',
      recapMode: 'full',
      hydrated: true,
      motion: globals.motion ?? 'system',
      ...parameters.companion,
    })
    useUi.setState({ pickerOpen: false, settingsOpen: false, ...parameters.ui })
    // Stories never call the API: <AccountSync> isn't mounted here, so these stay as set.
    const user = parameters.account?.user ?? null
    useAccount.setState({
      enabled: parameters.account?.enabled ?? true,
      user,
      token: user ? 'storybook-token' : null,
      hydrated: true,
    })
    useRoster.setState({
      owned: parameters.roster?.owned ?? {},
      owner: user ? user.id : null,
      dirty: false,
      sync: parameters.roster?.sync ?? (user ? 'saved' : 'local'),
      revealed: parameters.roster?.revealed ?? [],
      hydrated: true,
    })
    useArsenal.setState({ wEngines: parameters.arsenal?.wEngines ?? [], hydrated: true })
  },
  decorators: [
    (Story, { globals }) => {
      const locale = (globals.locale ?? 'en') as Locale
      document.documentElement.lang = locale
      return (
        <NextIntlClientProvider locale={locale} messages={messages[locale]} timeZone="UTC">
          <Providers>
            <Story />
          </Providers>
        </NextIntlClientProvider>
      )
    },
  ],
}

export default preview
