import type { Locale } from '@zzz/core'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { GlossaryView } from '@/components/glossary-view'
import { localizedAlternates } from '@/lib/seo'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/glossary'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'glossary' })
  return { title: t('title'), alternates: localizedAlternates(locale, '/glossary') }
}

export default async function Page({ params }: PageProps<'/[locale]/glossary'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  return <GlossaryView />
}
