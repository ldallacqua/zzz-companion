'use client'

import { useId, useState } from 'react'
import { motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { Check, ChevronDown } from 'lucide-react'
import { Badge, cn, stampIn } from '@zzz/ui'
import type { BuildVariant, Locale, WEngine } from '@zzz/core'
import { wEnginesById } from '@zzz/game'
import { GameIcon } from './game-icon'

/** Rows shown before "Show n more". */
const VISIBLE = 4

export interface WEngineLadderProps {
  agentId: string
  variant: Pick<BuildVariant, 'wEngines'>
  /** W-Engine ids the player marked as owned. */
  owned: readonly string[]
  /** False until the player's W-Engines load: the toggles wait, so a tap is never lost. */
  hydrated: boolean
  onToggle: (id: string) => void
  /** The best owned W-Engine (1-based rank), called out when it isn't the top pick. */
  best: { id: string; rank: number } | null
  /** True for a spoiler Agent's signature the reader hasn't revealed: shown as classified. */
  isClassified: (w: WEngine) => boolean
}

/**
 * The ranked W-Engines of a build. #1 is the large row; the rest are compact, and lists longer
 * than four collapse. Each row can be marked as owned, which feeds "Best you have".
 */
export function WEngineLadder({
  agentId,
  variant,
  owned,
  hydrated,
  onToggle,
  best,
  isClassified,
}: WEngineLadderProps) {
  const t = useTranslations('builds')
  const [expanded, setExpanded] = useState(false)
  const listId = useId()
  const rows = variant.wEngines
    .map((pick, i) => ({ ...pick, rank: i + 1, engine: wEnginesById.get(pick.id) }))
    .filter((r): r is typeof r & { engine: WEngine } => r.engine !== undefined)
  const hiddenCount = Math.max(0, rows.length - VISIBLE)
  const shown = expanded ? rows : rows.slice(0, VISIBLE)

  return (
    <div>
      <ol id={listId} className="space-y-2">
        {shown.map((row) => (
          <WEngineRow
            key={row.id}
            agentId={agentId}
            engine={row.engine}
            rank={row.rank}
            phase={row.phase}
            owned={owned.includes(row.id)}
            hydrated={hydrated}
            best={best?.id === row.id && best.rank > 1}
            classified={isClassified(row.engine)}
            onToggle={() => onToggle(row.id)}
          />
        ))}
      </ol>
      {hiddenCount > 0 && (
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 min-h-10 gap-2 px-3 text-xs font-semibold inline-flex cursor-pointer items-center font-mono tracking-[0.14em] text-muted uppercase focus-inset transition-colors hover:text-foreground"
        >
          <ChevronDown
            className={cn('size-4 transition-transform', expanded && 'rotate-180')}
            aria-hidden
          />
          {expanded ? t('showFewer') : t('showMore', { count: hiddenCount })}
        </button>
      )}
    </div>
  )
}

function RankBadge({ rank }: { rank: WEngine['rank'] }) {
  const t = useTranslations('builds')
  return (
    <span
      className={cn(
        'px-1.5 py-0.5 font-bold font-mono text-[0.65rem]',
        rank === 'S'
          ? 'bg-warning text-background'
          : rank === 'A'
            ? 'bg-surface-3 text-foreground'
            : 'text-muted shadow-[inset_0_0_0_1px_var(--color-border-strong)]',
      )}
    >
      <span aria-hidden>{rank}</span>
      <span className="sr-only">{t('rankSr', { rank })}</span>
    </span>
  )
}

function WEngineRow({
  agentId,
  engine,
  rank,
  phase,
  owned,
  hydrated,
  best,
  classified,
  onToggle,
}: {
  agentId: string
  engine: WEngine
  rank: number
  phase: number
  owned: boolean
  hydrated: boolean
  best: boolean
  classified: boolean
  onToggle: () => void
}) {
  const t = useTranslations('builds')
  const locale = useLocale() as Locale
  const top = rank === 1
  const name = classified ? t('classifiedEngine') : engine.name[locale]
  const summary = classified ? t('classifiedEngineBody') : engine.summary?.[locale]
  // Only the reader's own taps stamp the check, never the first paint.
  const [stamp, setStamp] = useState(false)

  return (
    <li
      data-testid={`w-engine-${engine.id}`}
      className={cn('p-px chamfer-sm', top ? 'bg-(--agent)' : 'bg-border')}
    >
      <div
        className={cn(
          // Below lg the toggle sits under the text, so names and summaries get the row's width.
          'gap-x-3 gap-y-2 lg:flex relative grid grid-cols-[auto_auto_minmax(0,1fr)] items-center chamfer-sm',
          top ? 'p-3 sm:p-4 bg-surface' : 'px-3 py-2.5 bg-surface-2',
        )}
      >
        <span
          aria-hidden
          className={cn(
            'w-9 shrink-0 text-center display text-outline',
            top ? 'text-4xl sm:text-5xl text-(--agent)' : 'text-2xl sm:text-3xl text-subtle',
          )}
        >
          {String(rank).padStart(2, '0')}
        </span>
        <span className="sr-only">{t('position', { rank })}</span>
        <GameIcon
          src={classified ? null : engine.icon}
          kind="w-engine"
          size={top ? 72 : 48}
          className="bg-background/40"
        />
        <div className="min-w-0 flex-1">
          <div className="gap-1.5 flex flex-wrap items-center">
            {!classified && <RankBadge rank={engine.rank} />}
            {!classified && engine.signature === agentId && (
              <Badge variant="outline" className="px-1.5 text-[0.62rem]">
                {t('signature')}
              </Badge>
            )}
            {phase > 1 && (
              <Badge variant="outline" className="px-1.5 text-[0.62rem]">
                <span aria-hidden>{t('phase', { phase })}</span>
                <span className="sr-only">{t('phaseSr', { phase })}</span>
              </Badge>
            )}
            {best && (
              <motion.span variants={stampIn} initial="hidden" animate="show">
                <Badge variant="primary" className="px-1.5 text-[0.62rem]">
                  {t('bestYouHave')}
                </Badge>
              </motion.span>
            )}
          </div>
          <h3
            className={cn(
              'mt-1 display leading-none text-balance',
              top ? 'text-2xl sm:text-3xl' : 'text-lg',
            )}
          >
            {name}
          </h3>
          {summary && (
            <p className={cn('mt-1 text-muted', top ? 'text-sm' : 'text-xs sm:text-sm')}>
              {summary}
            </p>
          )}
        </div>
        {!classified && (
          <button
            type="button"
            aria-pressed={owned}
            aria-label={t('haveItSr', { name })}
            disabled={!hydrated}
            onClick={() => {
              setStamp(!owned)
              onToggle()
            }}
            className={cn(
              'h-10 min-w-10 gap-1.5 px-3 font-semibold lg:col-auto lg:self-center col-start-3 flex shrink-0 cursor-pointer items-center justify-center justify-self-start font-mono text-[0.62rem] tracking-[0.12em] uppercase focus-inset transition-colors chamfer-sm disabled:cursor-default disabled:opacity-60',
              owned
                ? 'bg-primary text-primary-foreground focus-visible:outline-primary-foreground'
                : 'bg-surface-3 text-muted hover:text-foreground',
            )}
          >
            <span className="size-4 grid place-items-center">
              {owned ? (
                <motion.span
                  variants={stampIn}
                  initial={stamp ? 'hidden' : false}
                  animate="show"
                  className="grid"
                >
                  <Check className="size-4 stroke-[3]" aria-hidden />
                </motion.span>
              ) : (
                <span aria-hidden className="size-3 border border-current" />
              )}
            </span>
            <span aria-hidden>{t('haveIt')}</span>
          </button>
        )}
      </div>
    </li>
  )
}
