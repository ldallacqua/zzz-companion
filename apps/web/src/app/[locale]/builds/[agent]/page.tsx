import { agentShortName, type Locale } from '@zzz/core'
import { agents, agentsById } from '@zzz/game'
import type { Metadata } from 'next'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { BuildView } from '@/components/build-view'
import { RouteMessages } from '@/components/route-messages'
import { localizedAlternates } from '@/lib/seo'

/**
 * One static page per Agent (docs/features/builds.md). Builds are game data, so the page renders in
 * full, with the Agent's name in its metadata. A spoiler-flagged Agent is the exception: its page
 * and metadata are generic and `noindex`, like a locked character file (ADR 0010), and the build
 * appears only after the reader shows or owns the Agent.
 */
export const dynamicParams = false

export function generateStaticParams() {
  return agents.map((a) => ({ agent: a.id }))
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/builds/[agent]'>): Promise<Metadata> {
  const { locale, agent: id } = await params
  const t = await getTranslations({ locale: locale as Locale, namespace: 'builds' })
  const agent = agentsById.get(id)
  const alternates = localizedAlternates(locale, `/builds/${id}`)
  if (!agent || agent.spoiler) {
    return {
      title: t('pageKicker'),
      description: t('metaDescription'),
      alternates,
      robots: { index: false, follow: true },
    }
  }
  return {
    title: t('docTitle', { name: agentShortName(agent)[locale as Locale] }),
    description: t('agentMetaDescription', { name: agent.name[locale as Locale] }),
    alternates,
  }
}

export default async function Page({ params }: PageProps<'/[locale]/builds/[agent]'>) {
  const { locale, agent } = await params
  setRequestLocale(locale as Locale)
  // Only the id crosses to the client component (a spoiler Agent's name must not be serialised).
  const { builds } = await getMessages()
  return (
    <RouteMessages messages={{ builds }}>
      <BuildView agentId={agent} />
    </RouteMessages>
  )
}
