'use client'

import { useDeferredValue, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { Badge, ease } from '@zzz/ui'
import { knownTextAt, type Locale } from '@zzz/core'
import { timeline } from '@zzz/story'
import { useStory } from '@/lib/use-story'
import { useHashFocus } from '@/lib/use-hash-focus'
import { PageHeading } from './page-heading'

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

interface Entry {
  anchor: string
  kind: 'term' | 'faction'
  title: string
  body: string
}

export function GlossaryView() {
  const t = useTranslations('glossary')
  const locale = useLocale() as Locale
  const story = useStory()
  const [query, setQuery] = useState('')
  const deferred = useDeferredValue(query)
  useHashFocus(story.hydrated)

  const entries: Entry[] = [
    ...story.glossary.unlocked.map((g) => ({
      anchor: `term-${g.id}`,
      kind: 'term' as const,
      title: g.term[locale],
      alt: g.term.en,
      body: knownTextAt(timeline, story.progress, g.definition, g.revisions)[locale],
    })),
    ...story.factions.unlocked.map((f) => ({
      anchor: `faction-${f.id}`,
      kind: 'faction' as const,
      title: f.name[locale],
      alt: f.name.en,
      body: knownTextAt(timeline, story.progress, f.description, f.revisions)[locale],
    })),
  ]
    .sort((a, b) => a.title.localeCompare(b.title, locale))
    .filter((e) => {
      if (!deferred.trim()) return true
      const q = normalize(deferred)
      // Also the English name: readers often know a term from the English client or the wiki.
      return [e.title, e.alt, e.body].some((s) => normalize(s).includes(q))
    })

  const lockedCount = story.glossary.lockedCount + story.factions.lockedCount

  return (
    <>
      <PageHeading kicker={t('kicker')} title={t('title')} lede={t('lede')} />

      <label className="mb-8 max-w-md gap-3 px-4 flex items-center bg-surface-2 chamfer-sm focus-within:ring-2 focus-within:ring-primary">
        <Search className="size-4 shrink-0 text-muted" aria-hidden />
        <span className="sr-only">{t('search')}</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('search')}
          className="h-12 w-full bg-transparent outline-none placeholder:text-subtle"
        />
      </label>

      <div className="min-h-[70dvh]">
        {!story.hydrated ? (
          <p className="py-20 text-sm text-center font-mono text-muted" role="status">
            …
          </p>
        ) : (
          <dl className="gap-x-8 sm:grid-cols-2 grid" data-testid="glossary-list">
            <AnimatePresence initial={false} mode="popLayout">
              {entries.map((e) => (
                <motion.div
                  key={e.anchor}
                  id={e.anchor}
                  layout
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: ease.outExpo }}
                  className="group scroll-mt-28 px-2 py-5 border-b border-border transition-colors data-[flash=true]:bg-primary/10"
                >
                  <dt className="gap-2 flex flex-wrap items-center">
                    <span className="text-2xl display transition-colors group-hover:text-primary">
                      {e.title}
                    </span>
                    <Badge variant={e.kind === 'faction' ? 'accent' : 'outline'}>
                      {e.kind === 'faction' ? t('faction') : t('term')}
                    </Badge>
                  </dt>
                  <dd className="mt-1.5 leading-relaxed text-muted">{e.body}</dd>
                </motion.div>
              ))}
            </AnimatePresence>
          </dl>
        )}

        {story.hydrated && entries.length === 0 && deferred && (
          <p className="py-10 text-muted">{t('noResults', { query: deferred })}</p>
        )}
        {story.hydrated && lockedCount > 0 && (
          <p className="mt-8 text-xs font-mono text-subtle">
            {t('locked', { count: lockedCount })}
          </p>
        )}
      </div>
    </>
  )
}
