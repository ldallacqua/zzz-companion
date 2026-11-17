'use client'

import { useId } from 'react'
import { motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { Badge, Panel, stampIn } from '@zzz/ui'
import type { KnownNote, Locale } from '@zzz/core'
import { timeline } from '@zzz/story'

/** "Ch. 1B · The Butcher's End" for a segment id. */
export function usePartLabel() {
  const locale = useLocale() as Locale
  return (at: string) => {
    const segment = timeline.getSegment(at)
    if (!segment) return at
    const chapter = timeline.getChapter(segment.chapterId)
    return `${chapter?.label[locale] ?? ''} · ${segment.title[locale]}`
  }
}

/**
 * What the reader knows about someone, as a case file: the current note on top, then the earlier
 * notes newest first, ending at "First seen". `notes` come from `knownHistoryAt` (oldest first and
 * never past the reader's progress), so nothing here can point at what is still locked: no counts,
 * no placeholders, no "more to come".
 */
export function Dossier({ notes }: { notes: readonly KnownNote[] }) {
  const t = useTranslations('characterFile')
  const locale = useLocale() as Locale
  const part = usePartLabel()
  const titleId = useId()
  const earlierId = useId()
  const current = notes.at(-1)
  if (!current) return null
  const earlier = notes.slice(0, -1).reverse()

  return (
    <section aria-labelledby={titleId} className="mt-10">
      <h2 id={titleId} className="text-3xl display">
        {t('intelTitle')}
      </h2>
      <Panel frame="var(--color-primary)" className="mt-4" innerClassName="p-5 sm:p-6">
        <div className="gap-x-3 gap-y-1 flex flex-wrap items-center">
          <motion.span variants={stampIn} initial="hidden" animate="show" className="inline-flex">
            <Badge variant="primary">
              <span aria-hidden>■ </span>
              {t('now')}
            </Badge>
          </motion.span>
          {!current.isBase && (
            <span className="font-mono text-[0.68rem] tracking-[0.14em] text-muted uppercase">
              {t('updated', { part: part(current.at) })}
            </span>
          )}
        </div>
        <p className="mt-3 text-lg leading-relaxed sm:text-xl max-w-[60ch] text-foreground">
          {current.text[locale]}
        </p>
      </Panel>

      {earlier.length > 0 && (
        <>
          <h3 id={earlierId} className="mt-8 text-2xl display">
            {t('earlier')}
          </h3>
          <ol
            aria-labelledby={earlierId}
            className="mt-4 ml-1.5 space-y-5 pl-6 relative border-l border-dashed border-border-strong"
          >
            {earlier.map((note) => {
              const segment = timeline.getSegment(note.at)
              const accent = segment ? timeline.getChapter(segment.chapterId)?.accent : undefined
              return (
                <li key={note.at} className="relative">
                  <span
                    className="top-1.5 size-2.5 absolute -left-[1.85rem] rotate-45 ring-4 ring-background"
                    style={{ backgroundColor: accent ?? 'var(--color-border-strong)' }}
                    aria-hidden
                  />
                  <Badge variant="outline">
                    {note.isBase
                      ? t('firstSeen', { part: part(note.at) })
                      : t('asOf', { part: part(note.at) })}
                  </Badge>
                  <p className="mt-2 max-w-[60ch] text-muted">{note.text[locale]}</p>
                </li>
              )
            })}
          </ol>
        </>
      )}
    </section>
  )
}
