'use client'

import { useId } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowUpRight } from 'lucide-react'
import type { Locale, RecapChapter } from '@zzz/core'
import { timeline } from '@zzz/story'
import { Link } from '@/i18n/navigation'

/**
 * The finished recap parts someone appears in (from `appearancesOf`), each a link back to that part
 * of the recap. Chapters use the recap's tape-label chip; parts keep the recap's numbering.
 */
export function Appearances({ chapters }: { chapters: readonly RecapChapter[] }) {
  const t = useTranslations('characterFile')
  const tr = useTranslations('recap')
  const locale = useLocale() as Locale
  const titleId = useId()
  if (chapters.length === 0) return null

  return (
    <section aria-labelledby={titleId} className="mt-12">
      <h2 id={titleId} className="text-3xl display">
        {t('appearsIn')}
      </h2>
      <div className="mt-4 space-y-6">
        {chapters.map((chapter) => {
          const all = timeline.getChapter(chapter.id)?.segments ?? []
          return (
            <div key={chapter.id}>
              <h3 className="gap-3 flex flex-wrap items-center">
                <span
                  className="px-2 py-0.5 font-bold text-black font-mono text-[0.68rem] tracking-[0.18em] uppercase"
                  style={{ backgroundColor: chapter.accent }}
                >
                  {chapter.label[locale]}
                </span>
                <span className="text-xl display">{chapter.title[locale]}</span>
              </h3>
              <ol className="mt-2 space-y-1.5">
                {chapter.segments.map((segment) => {
                  const n = all.findIndex((s) => s.id === segment.id) + 1
                  return (
                    <li key={segment.id}>
                      <Link
                        href={`/recap#part-${segment.id}`}
                        className="group min-h-11 gap-3 px-3 py-2 flex items-center bg-surface focus-inset transition-colors chamfer-sm hover:bg-surface-2"
                      >
                        <span
                          className="w-9 text-3xl shrink-0 display leading-none text-outline"
                          style={{ color: chapter.accent }}
                          aria-hidden
                        >
                          {String(n).padStart(2, '0')}
                        </span>
                        <span className="min-w-0 font-semibold flex-1">
                          <span className="sr-only">{tr('partNumber', { n })}: </span>
                          {segment.title[locale]}
                        </span>
                        <ArrowUpRight
                          className="size-4 shrink-0 text-muted transition-colors group-hover:text-primary"
                          aria-hidden
                        />
                      </Link>
                    </li>
                  )
                })}
              </ol>
            </div>
          )
        })}
      </div>
    </section>
  )
}
