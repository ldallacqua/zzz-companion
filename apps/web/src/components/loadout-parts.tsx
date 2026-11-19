import type { CSSProperties, ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Lock } from 'lucide-react'
import { cn } from '@zzz/ui'
import type { Locale, MainStatSlot } from '@zzz/core'
import { fixedSlotStats } from '@zzz/game'
import { statName, statShort } from '@/lib/build-labels'

/*
 * The Drive Disc slots of the loadout board, shared by the build page (`LoadoutBoard`, a client
 * component that animates the lit values) and the landing page's product shot (`LandingLoadout`,
 * server-rendered and static). No 'use client' and no motion here, so both can render them.
 */

/** Where each slot sits around the Agent: 1 on top, then clockwise, like the game's disc ring. */
export const PLACE: Record<string, string> = {
  '1': 'col-start-2 row-start-1',
  '2': 'col-start-3 row-start-2',
  '3': 'col-start-3 row-start-4',
  '4': 'col-start-2 row-start-5',
  '5': 'col-start-1 row-start-4',
  '6': 'col-start-1 row-start-2',
}
export const SLOTS = ['1', '2', '3', '4', '5', '6'] as const
export const isMainSlot = (slot: string): slot is MainStatSlot =>
  slot === '4' || slot === '5' || slot === '6'

/** The lit value's type ramp on the build page (the board is narrower between md and lg). */
export const LIT_TEXT =
  'sm:text-lg md:text-[0.95rem] lg:text-lg block display text-[0.95rem] leading-none break-words'

/** Slots 1–3: the main stat is fixed, so the bay recedes. */
export function FixedBay({ slot, className }: { slot: string; className?: string }) {
  const t = useTranslations('builds')
  const locale = useLocale() as Locale
  const stat = statName(fixedSlotStats[slot as '1' | '2' | '3'], locale)
  return (
    <li className={cn(PLACE[slot], 'min-w-0 row-span-2', className)}>
      <div className="h-full bg-border p-px chamfer-sm">
        <div className="px-2.5 py-1.5 flex h-full flex-col justify-center bg-surface chamfer-sm">
          <span aria-hidden className="font-mono text-[0.6rem] tracking-[0.14em] text-subtle">
            {slot.padStart(2, '0')}
          </span>
          <span aria-hidden className="text-base display leading-none text-muted">
            {stat}
          </span>
          <span
            aria-hidden
            className="mt-1 gap-1 flex items-center font-mono text-[0.58rem] tracking-[0.1em] text-subtle uppercase"
          >
            <Lock className="size-3" />
            {t('fixed')}
          </span>
          <span className="sr-only">{`${t('slot', { slot })}: ${stat} (${t('fixed')})`}</span>
        </div>
      </div>
    </li>
  )
}

/**
 * Slots 4–6: lit in the Agent's colour (`--agent`) with the stat to aim for, then the fallbacks.
 * `renderValue` lets the build page animate the value; by default it is plain text in `LIT_TEXT`.
 */
export function LitBay({
  slot,
  groups,
  renderValue,
  valueClassName = LIT_TEXT,
  className,
  style,
}: {
  slot: MainStatSlot
  groups: string[][]
  renderValue?: (value: string) => ReactNode
  valueClassName?: string
  className?: string
  style?: CSSProperties
}) {
  const t = useTranslations('builds')
  const locale = useLocale() as Locale
  const value = (groups[0] ?? []).map((id) => statShort(id, locale)).join(' / ')
  const rest = groups.slice(1)
  const spoken = groups
    .map((g) => g.map((id) => statName(id, locale)).join(` ${t('tied')} `))
    .join(`, ${t('then')} `)

  return (
    <li
      className={cn(PLACE[slot], 'min-w-0 row-span-2', className)}
      style={style}
      data-testid={`slot-${slot}`}
    >
      <div className="h-full bg-(--agent) p-px chamfer-sm">
        <div className="px-2.5 py-1.5 relative flex h-full flex-col justify-center overflow-hidden bg-surface-2 chamfer-sm">
          <span aria-hidden className="inset-0 absolute halftone text-(--agent) opacity-10" />
          <span
            aria-hidden
            className="font-bold relative font-mono text-[0.6rem] tracking-[0.14em] text-(--agent)"
          >
            {slot.padStart(2, '0')}
          </span>
          <span aria-hidden className="relative">
            {renderValue ? renderValue(value) : <span className={valueClassName}>{value}</span>}
          </span>
          {rest.length > 0 && (
            <span
              aria-hidden
              className="mt-1 leading-tight relative line-clamp-2 font-mono text-[0.58rem] text-muted"
            >
              ›{' '}
              {rest
                .map((group) => group.map((id) => statShort(id, locale)).join(' = '))
                .join(' › ')}
            </span>
          )}
          <span className="sr-only">{`${t('slot', { slot })}: ${spoken}`}</span>
        </div>
      </div>
    </li>
  )
}
