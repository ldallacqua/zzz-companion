'use client'

import { useId, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { cn, spring } from '@zzz/ui'
import {
  agentShortName,
  type Agent,
  type BuildVariant,
  type Locale,
  type MainStatSlot,
  type WEngine,
} from '@zzz/core'
import { discSetsById, wEnginesById } from '@zzz/game'
import { AgentIcon, agentColor } from './agent-tile'
import { GameIcon } from './game-icon'
import { FixedBay, isMainSlot, LIT_TEXT, LitBay as LitSlot, SLOTS } from './loadout-parts'

export interface LoadoutBoardProps {
  agent: Agent
  variant: Pick<BuildVariant, 'main' | 'discs' | 'wEngines'>
  /** The best W-Engine the player owns; called out when it isn't the top pick. */
  best?: { id: string; rank: number } | null
  isClassified?: (w: WEngine) => boolean
  className?: string
}

/**
 * The build at a glance: the six Drive Disc slots around the Agent (1–3 have fixed main stats and
 * recede; 4–6 are lit with the stat to aim for), the 4 + 2 set split and the top W-Engine. When
 * the variant changes, only the slots whose stat changed roll to the new value.
 */
export function LoadoutBoard({
  agent,
  variant,
  best = null,
  isClassified = () => false,
  className,
}: LoadoutBoardProps) {
  const t = useTranslations('builds')
  const locale = useLocale() as Locale
  const titleId = useId()
  const color = agentColor(agent)
  const short = agentShortName(agent)[locale]

  const pick = variant.discs[0]
  const four = pick ? discSetsById.get(pick.four) : undefined
  const two = (pick?.two[0] ?? []).flatMap((id) => discSetsById.get(id) ?? [])
  const topPick = variant.wEngines[0]
  const engine = topPick ? wEnginesById.get(topPick.id) : undefined
  const bestEngine = best && best.rank > 1 ? wEnginesById.get(best.id) : undefined
  const engineName = (w: WEngine) => (isClassified(w) ? t('classifiedEngine') : w.name[locale])

  return (
    <section
      aria-labelledby={titleId}
      className={cn('mx-auto w-full max-w-[30rem]', className)}
      style={{ '--agent': color } as CSSProperties}
      data-testid="loadout-board"
    >
      <h2
        id={titleId}
        className="mb-3 gap-3 text-xs font-semibold flex items-center font-mono tracking-[0.3em] text-muted uppercase"
      >
        <span className="w-6 h-px bg-(--agent)" aria-hidden />
        {t('board')}
      </h2>

      <div className="gap-x-2 gap-y-1.5 relative grid grid-cols-3 grid-rows-[repeat(6,minmax(2.6rem,auto))]">
        <div aria-hidden className="col-start-2 row-span-2 row-start-3 grid place-items-center">
          {/* Smaller on phones so the page title, not this hotlinked art, is the largest paint (LCP). */}
          <div className="sm:w-[min(100%,7.5rem)] relative aspect-[1.155] w-[min(100%,6rem)] bg-(--agent) p-[2px] clip-hex">
            <div className="absolute inset-[2px] overflow-hidden bg-surface clip-hex">
              <span className="inset-0 absolute halftone opacity-20" style={{ color }} />
              <AgentIcon
                src={agent.icon}
                name={short}
                color={color}
                sizes="(min-width: 640px) 120px, 96px"
                className="scale-110"
              />
              <span className="inset-0 absolute scanlines" />
            </div>
          </div>
        </div>

        <ol role="list" aria-label={t('boardSr')} className="contents">
          {SLOTS.map((slot) =>
            isMainSlot(slot) ? (
              <LitBay key={slot} slot={slot} groups={variant.main[slot]} />
            ) : (
              <FixedBay key={slot} slot={slot} />
            ),
          )}
        </ol>
      </div>

      {four && (
        <div className="mt-5">
          <p className="font-mono text-[0.64rem] tracking-[0.14em] text-muted uppercase">
            {t('setSplit')}
          </p>
          <div aria-hidden className="mt-2 gap-1.5 px-1 flex">
            {Array.from({ length: 6 }, (_, i) => (
              <span
                key={i}
                className={cn(
                  'h-2 flex-1 -skew-x-[20deg]',
                  i < 4
                    ? 'bg-(--agent)'
                    : two.length
                      ? 'bg-(--agent)/45'
                      : 'border border-(--agent)',
                )}
              />
            ))}
          </div>
          <ul className="mt-2.5 space-y-1.5">
            <li className="gap-2 flex items-center">
              <span className="w-6 text-xs shrink-0 font-mono text-subtle">4×</span>
              <GameIcon src={four.icon} kind="disc" size={28} />
              <span className="min-w-0 text-sm font-semibold">{four.name[locale]}</span>
            </li>
            {two.length > 0 ? (
              <li className="gap-2 flex items-center">
                <span className="w-6 text-xs shrink-0 font-mono text-subtle">2×</span>
                <span className="gap-0.5 flex shrink-0">
                  {two.slice(0, 2).map((s) => (
                    <GameIcon key={s.id} src={s.icon} kind="disc" size={28} />
                  ))}
                </span>
                <span className="min-w-0 text-sm font-semibold">
                  {two.map((s) => s.name[locale]).join(` ${t('or')} `)}
                </span>
              </li>
            ) : (
              <li className="gap-2 flex items-center" data-testid="any-two-piece">
                <span className="w-6 text-xs shrink-0 font-mono text-subtle">2×</span>
                <span className="min-w-0 text-sm text-muted">{t('anyTwoPiece')}</span>
              </li>
            )}
          </ul>
        </div>
      )}

      {/* On phones the W-Engine list starts right below with the same #1: the socket only shows
          there when it has news ("Best you have"). */}
      {engine && (
        <div className={cn('mt-4 bg-border p-px chamfer-sm', !bestEngine && 'max-md:hidden')}>
          <div className="gap-3 p-3 flex items-center bg-surface chamfer-sm">
            <GameIcon
              src={isClassified(engine) ? null : engine.icon}
              kind="w-engine"
              size={48}
              className="bg-surface-2"
            />
            <div className="min-w-0">
              <p className="font-mono text-[0.64rem] tracking-[0.14em] text-muted uppercase">
                {t('wEngines')} · {t('position', { rank: 1 })}
              </p>
              <p className="mt-1 text-xl display leading-none">{engineName(engine)}</p>
              {bestEngine && best && (
                <p
                  className="mt-1.5 text-xs font-semibold font-mono text-primary"
                  data-testid="best-you-have"
                >
                  {t('bestYouHaveLine', { name: engineName(bestEngine), rank: best.rank })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

/** A lit slot whose value rolls to the new stat when the variant changes it. */
function LitBay({ slot, groups }: { slot: MainStatSlot; groups: string[][] }) {
  return (
    <LitSlot
      slot={slot}
      groups={groups}
      renderValue={(value) => (
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={value}
            className={LIT_TEXT}
            initial={{ y: '60%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={spring.snappy}
          >
            {value}
          </motion.span>
        </AnimatePresence>
      )}
    />
  )
}
