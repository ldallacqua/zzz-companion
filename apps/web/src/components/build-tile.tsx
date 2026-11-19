'use client'

import type { CSSProperties } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@zzz/ui'
import { agentShortName, type Agent, type Locale } from '@zzz/core'
import { specialtiesById } from '@zzz/game'
import { Link } from '@/i18n/navigation'
import { AgentIcon, agentColor, RankAttrTag } from './agent-tile'

export interface BuildTileProps {
  agent: Agent
  /** Mindscape level, or null when the player doesn't own the Agent. */
  level: number | null
  /** How many build variants the Agent has. */
  variants: number
  priority?: boolean
}

/**
 * One Agent in the builds index: a link to their build. A catalogue, not a checklist, so every
 * tile is in colour; owned Agents add their frame colour and Mindscape.
 */
export function BuildTile({ agent, level, variants, priority }: BuildTileProps) {
  const t = useTranslations('builds')
  const locale = useLocale() as Locale
  const color = agentColor(agent)
  const short = agentShortName(agent)[locale]
  const owned = level !== null

  return (
    <Link
      href={`/builds/${agent.id}`}
      id={`build-${agent.id}`}
      data-testid={`build-tile-${agent.id}`}
      className="group/tile scroll-mt-32 relative block focus-visible:outline-none"
      style={{ '--agent': color } as CSSProperties}
    >
      <span
        className={cn(
          'block p-px transition-colors duration-300 chamfer-sm group-hover/tile:bg-(--agent)',
          owned ? 'bg-(--agent)' : 'bg-border',
        )}
      >
        <span className="relative block overflow-hidden bg-surface chamfer-sm">
          <span className="relative block aspect-square overflow-hidden">
            <span aria-hidden className="inset-0 absolute halftone opacity-20" style={{ color }} />
            <span
              aria-hidden
              className="inset-0 absolute transition-[scale] duration-300 ease-(--ease-snap) group-hover/tile:scale-[1.04]"
            >
              <AgentIcon src={agent.icon} name={short} color={color} priority={priority} />
            </span>
            <span aria-hidden className="inset-0 pointer-events-none absolute scanlines" />
            <RankAttrTag agent={agent} />
            <span className="inset-x-0 bottom-0 px-2 pt-6 pb-1.5 absolute bg-gradient-to-t from-background via-background/70 to-transparent">
              <span className="text-sm sm:text-base line-clamp-2 block display leading-none text-foreground">
                {short}
              </span>
            </span>
          </span>
          <span
            className={cn(
              'h-10 gap-2 px-2.5 flex items-center justify-between border-t font-mono text-[0.62rem] tracking-[0.1em] uppercase',
              owned ? 'border-border bg-surface-2' : 'border-dashed border-border-strong',
            )}
          >
            <span
              className={cn('min-w-0 truncate', owned ? 'font-bold text-primary' : 'text-subtle')}
            >
              {owned ? `M${level}` : specialtiesById.get(agent.specialty)?.name[locale]}
            </span>
            {variants > 1 && (
              <span className="shrink-0 text-muted">{t('variantCount', { count: variants })}</span>
            )}
          </span>
        </span>
      </span>
      <span
        aria-hidden
        className="inset-0 pointer-events-none absolute opacity-0 shadow-[inset_0_0_0_3px_var(--color-primary)] chamfer-sm group-focus-visible/tile:opacity-100"
      />
    </Link>
  )
}
