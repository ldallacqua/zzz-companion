import type { Locale } from '@zzz/core'
import type { Metadata } from 'next'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { BuildsView } from '@/components/builds-view'
import { RouteMessages } from '@/components/route-messages'
import { localizedAlternates } from '@/lib/seo'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/builds'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'builds' })
  return {
    title: t('title'),
    description: t('metaDescription'),
    alternates: localizedAlternates(locale, '/builds'),
  }
}

export default async function Page({ params }: PageProps<'/[locale]/builds'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  const { builds } = await getMessages()
  return (
    <RouteMessages messages={{ builds }}>
      <BuildsView />
    </RouteMessages>
  )
}
