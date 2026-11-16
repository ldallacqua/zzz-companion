import type { Locale } from '@zzz/core'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { RecapView } from '@/components/recap-view'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/recap'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'recap' })
  return { title: t('title') }
}

export default async function Page({ params }: PageProps<'/[locale]/recap'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  return <RecapView />
}
