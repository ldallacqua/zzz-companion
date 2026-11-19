'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Badge, cn, Panel } from '@zzz/ui'
import type { DiscSet, Locale } from '@zzz/core'
import { GameIcon } from './game-icon'

/**
 * One Drive Disc pick: the set (or interchangeable sets) to equip as 4 or 2 pieces, what it does
 * and up to two alternatives. A 4-piece card lists both bonuses, since 4 pieces also give the
 * 2-piece one.
 */
export function DiscSetCard({
  pieces,
  sets,
  alternatives = [],
  className,
}: {
  pieces: 4 | 2
  /** Interchangeable sets for this pick (usually one). */
  sets: DiscSet[]
  /** Other options, best first; each one can itself be a choice of sets. */
  alternatives?: DiscSet[][]
  className?: string
}) {
  const t = useTranslations('builds')
  const locale = useLocale() as Locale
  const first = sets[0]
  if (!first) return null
  const names = (group: DiscSet[]) => group.map((s) => s.name[locale]).join(` ${t('or')} `)

  return (
    <Panel
      className={cn('h-full', className)}
      frame={pieces === 4 ? 'var(--agent)' : undefined}
      innerClassName="p-4 sm:p-5"
    >
      <article className="flex h-full flex-col">
        <div className="gap-3 flex items-start">
          <span className="gap-1 flex shrink-0">
            {sets.slice(0, 2).map((s) => (
              <GameIcon key={s.id} src={s.icon} kind="disc" size={48} />
            ))}
          </span>
          <div className="min-w-0">
            <Badge variant={pieces === 4 ? 'default' : 'outline'}>
              {pieces === 4 ? t('fourPiece') : t('twoPiece')}
            </Badge>
            <h3 className="mt-1.5 text-xl display leading-none text-balance">{names(sets)}</h3>
          </div>
        </div>
        <dl className="mt-3 space-y-1 text-sm">
          {first.two && (
            <div className="gap-2 flex">
              <dt className="w-6 text-xs shrink-0 font-mono text-subtle">2×</dt>
              <dd className="text-muted">{first.two[locale]}</dd>
            </div>
          )}
          {pieces === 4 && first.four && (
            <div className="gap-2 flex">
              <dt className="w-6 text-xs shrink-0 font-mono text-subtle">4×</dt>
              <dd className="text-muted">{first.four[locale]}</dd>
            </div>
          )}
        </dl>
        {alternatives.length > 0 && (
          <div className="pt-3 mt-auto">
            <p className="pt-3 border-t border-dashed border-border-strong font-mono text-[0.64rem] tracking-[0.14em] text-subtle uppercase">
              {t('alsoGood')}
            </p>
            <p className="mt-1 text-sm text-foreground">{alternatives.map(names).join(' · ')}</p>
          </div>
        )}
      </article>
    </Panel>
  )
}
