import type { Locale } from '@zzz/core'
import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import { Barlow_Condensed, Geist, Geist_Mono } from 'next/font/google'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Marquee } from '@zzz/ui'
import { routing } from '@/i18n/routing'
import { motionBootScript, Providers } from '@/components/providers'
import { MobileNav, SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { ProgressPicker } from '@/components/progress-picker'
import { SettingsSheet } from '@/components/settings-sheet'
import '../globals.css'

const barlow = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-barlow',
})
const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export const viewport: Viewport = {
  themeColor: '#08080a',
  colorScheme: 'dark',
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'meta' })
  return {
    title: { default: t('title'), template: `%s · ZZZ Companion` },
    description: t('description'),
    alternates: { languages: { en: '/en', 'pt-BR': '/pt-BR' } },
  }
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()
  setRequestLocale(locale)
  const t = await getTranslations('nav')
  const tt = await getTranslations('ticker')
  const ticker = (['t1', 't2', 't3', 't4', 't5'] as const).map((k) => tt(k))

  return (
    <html
      lang={locale}
      className={`${barlow.variable} ${geist.variable} ${geistMono.variable}`}
      data-motion="full"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootScript }} />
      </head>
      <body className="min-h-dvh overflow-x-clip">
        <NextIntlClientProvider>
          <Providers>
            <a
              href="#main"
              className="px-4 py-2 font-semibold focus:top-2 focus:left-2 sr-only z-50 bg-primary text-primary-foreground focus:not-sr-only focus:fixed"
            >
              {t('skip')}
            </a>
            <SiteHeader />
            <Marquee items={ticker} />
            <main id="main" className="max-w-6xl px-4 sm:px-6 mx-auto w-full">
              {children}
            </main>
            <SiteFooter />
            <MobileNav />
            <ProgressPicker />
            <SettingsSheet />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
