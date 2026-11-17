import type { Locale } from '@zzz/core'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { AccountView } from '@/components/account-view'
import { localizedAlternates } from '@/lib/seo'

/** A sign-in form has nothing to index; the view is filled in on the client (ADR 0011). */
export async function generateMetadata({
  params,
}: PageProps<'/[locale]/account'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'account' })
  return {
    title: t('title'),
    alternates: localizedAlternates(locale, '/account'),
    robots: { index: false, follow: true },
  }
}

export default async function Page({ params }: PageProps<'/[locale]/account'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  return <AccountView />
}
