import type { Locale } from '@zzz/core'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { AgentsView } from '@/components/agents-view'
import { localizedAlternates } from '@/lib/seo'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/agents'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'agents' })
  return {
    title: t('title'),
    description: t('metaDescription'),
    alternates: localizedAlternates(locale, '/agents'),
  }
}

export default async function Page({ params }: PageProps<'/[locale]/agents'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  return <AgentsView />
}
