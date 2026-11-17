import type { Locale } from '@zzz/core'
import { characters } from '@zzz/story'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CharacterFileView } from '@/components/character-file-view'
import { localizedAlternates } from '@/lib/seo'

/**
 * One static page per character id (see docs/adr/0010-character-file-pages.md). The page and its
 * metadata are generic: the server never renders a name, blurb or image, so neither the HTML nor
 * the RSC payload of a locked character can spoil anything. Content appears after local progress
 * hydrates, gated by @zzz/core.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return characters.map((c) => ({ id: c.id }))
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/characters/[id]'>): Promise<Metadata> {
  const { locale, id } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'characterFile' })
  return {
    title: t('kicker'),
    description: t('metaDescription'),
    alternates: localizedAlternates(locale, `/characters/${id}`),
    // Name-bearing URLs in search results would be a (small) spoiler, and there is nothing to index.
    robots: { index: false, follow: true },
  }
}

export default async function Page({ params }: PageProps<'/[locale]/characters/[id]'>) {
  const { locale, id } = await params
  setRequestLocale(locale as Locale)
  // Only the id crosses to the client component: passing the Character would serialise it.
  return <CharacterFileView id={id} />
}
