'use client'

import { Fragment } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronRight } from 'lucide-react'
import { cn } from '@zzz/ui'

/**
 * An ordered priority with ties: `[['CRIT Rate', 'CRIT DMG'], ['ATK%']]` reads
 * "CRIT Rate = CRIT DMG › ATK%". The first group is highlighted. Screen readers hear a numbered
 * list, with ties as "tied with".
 */
export function PriorityChain({
  groups,
  label,
  className,
}: {
  /** Labels, already localized. */
  groups: string[][]
  label: string
  className?: string
}) {
  const t = useTranslations('builds')
  return (
    <ol
      aria-label={label}
      className={cn('gap-x-1.5 gap-y-2 flex flex-wrap items-center', className)}
    >
      {groups.map((group, i) => (
        <li key={group.join('|')} className="gap-1.5 flex items-center">
          {i > 0 && <ChevronRight className="size-4 shrink-0 text-subtle" aria-hidden />}
          <span className="gap-1 flex flex-wrap items-center">
            {group.map((item, j) => (
              <Fragment key={item}>
                {j > 0 && (
                  <>
                    <span aria-hidden className="text-sm font-bold font-mono text-muted">
                      =
                    </span>
                    <span className="sr-only">{t('tied')}</span>
                  </>
                )}
                {/* The first group is framed in the Agent's colour (a 1px gap, like Panel: a
                    clip-path would cut an inset shadow at the chamfered corners). */}
                <span
                  className={cn(
                    'p-px chamfer-sm',
                    i === 0 ? 'bg-(--agent,var(--color-border-strong))' : 'bg-transparent',
                  )}
                >
                  <span
                    className={cn(
                      'px-2.5 py-1.5 text-xs font-semibold block font-mono tracking-[0.06em] text-foreground chamfer-sm',
                      i === 0 ? 'bg-surface-3' : 'bg-surface-2',
                    )}
                  >
                    {item}
                  </span>
                </span>
              </Fragment>
            ))}
          </span>
        </li>
      ))}
    </ol>
  )
}
