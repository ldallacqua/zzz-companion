import type { Locale } from '@zzz/core'
import { setRequestLocale } from 'next-intl/server'
import { HomeView } from '@/components/home-view'

export default async function Page({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params
  setRequestLocale(locale as Locale)
  return <HomeView />
}
