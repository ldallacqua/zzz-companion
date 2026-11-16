import type { Locale } from '@zzz/core'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CharactersView } from '@/components/characters-view'

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/characters'>): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'characters' })
  return { title: t('title') }
}

export default async function Page({ params }: PageProps<'/[locale]/characters'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  return <CharactersView />
}
