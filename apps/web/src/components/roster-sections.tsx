'use client'

import type { ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { CloudAlert, CloudCheck, CloudUpload, ScanSearch, Undo2, X } from 'lucide-react'
import { Button, cn, Panel, Reveal, riseInSolid } from '@zzz/ui'
import { Link } from '@/i18n/navigation'

/** Sticky strip under the header: owned counter (+ meter from md) and the sync chip. */
export function RosterStatusStrip({
  owned,
  total,
  hydrated,
  sync,
}: {
  owned: number
  total: number
  hydrated: boolean
  /** The sync chip (or any status control) on the right. */
  sync: ReactNode
}) {
  const t = useTranslations('agents')
  const pct = total ? Math.round((owned / total) * 100) : 0
  return (
    <div className="top-16 -mx-4 h-14 gap-3 px-4 sm:-mx-6 sm:px-6 backdrop-blur-md sticky z-30 flex items-center justify-between border-y border-border bg-background/90">
      <div className="min-w-0 gap-4 flex items-center">
        <p className="gap-2 flex items-baseline" data-testid="owned-count">
          <span
            aria-hidden
            className="font-mono text-[0.6rem] tracking-[0.2em] text-subtle uppercase"
          >
            {t('owned')}
          </span>
          <span aria-hidden className="text-2xl display leading-none text-primary">
            {hydrated ? owned : '—'}
          </span>
          <span aria-hidden className="text-xs font-mono text-muted">
            /{total}
          </span>
          {hydrated && <span className="sr-only">{t('ownedSr', { owned, total })}</span>}
        </p>
        <span aria-hidden className="h-1.5 w-40 md:block hidden -skew-x-[20deg] bg-surface-3">
          <span
            className="block h-full bg-primary transition-[width] duration-500 ease-(--ease-out-expo)"
            style={{ width: `${hydrated ? pct : 0}%` }}
          />
        </span>
      </div>
      {sync}
    </div>
  )
}

/** "{n} Agents" + Mark all ({k}) / Undo. */
export function ResultsBar({
  count,
  markable,
  undo,
  onMarkAll,
  onUndo,
}: {
  count: number
  /** Shown agents not owned yet; 0 hides Mark all. */
  markable: number
  /** The last Mark all, while it can still be undone. */
  undo?: { count: number } | null
  onMarkAll: () => void
  onUndo: () => void
}) {
  const t = useTranslations('agents')
  return (
    <div className="mt-6 mb-3 min-h-10 gap-3 flex items-center justify-between">
      <p className="text-xs font-mono tracking-[0.16em] text-muted uppercase">
        {t('resultCount', { count })}
      </p>
      {undo ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={onUndo}
          aria-label={t('undoSr', { count: undo.count })}
        >
          <Undo2 aria-hidden />
          {t('undo')}
        </Button>
      ) : markable > 0 ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onMarkAll}
          aria-label={`${t('markAll', { count: markable })}: ${t('markAllSr', { count: markable })}`}
        >
          {t('markAll', { count: markable })}
        </Button>
      ) : null}
    </div>
  )
}

/** In place of the grid when nothing is shown. */
export function RosterEmpty({
  kind,
  query,
  filtered = true,
  onAction,
}: {
  kind: 'filters' | 'owned' | 'missing'
  query?: string
  /** Trait filters or a view are on (otherwise only the search can be at fault). */
  filtered?: boolean
  onAction?: () => void
}) {
  const t = useTranslations('agents')
  const content = {
    filters: !filtered
      ? {
          title: t('emptyFiltersTitle'),
          body: t('emptyQueryBody', { query: query?.trim() ?? '' }),
          action: t('clearSearch'),
        }
      : {
          title: t('emptyFiltersTitle'),
          body: query?.trim()
            ? `${t('emptyFiltersQuery', { query: query.trim() })} ${t('emptyFiltersBody')}`
            : t('emptyFiltersBody'),
          action: t('emptyFiltersAction'),
        },
    owned: {
      title: t('emptyOwnedTitle'),
      body: t('emptyOwnedBody'),
      action: t('emptyOwnedAction'),
    },
    missing: { title: t('emptyMissingTitle'), body: t('emptyMissingBody'), action: null },
  }[kind]
  return (
    <div className="py-16 text-center" data-testid="roster-empty">
      <ScanSearch className="size-8 mx-auto text-subtle" aria-hidden />
      <p className="mt-3 text-3xl display">{content.title}</p>
      <p className="mt-2 max-w-md mx-auto text-muted">{content.body}</p>
      {content.action && onAction && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onAction}>
          {content.action}
        </Button>
      )}
    </div>
  )
}

/** First-visit hint. Static HTML: returning readers (data-roster / data-account) never see it. */
export function RosterHint({ className }: { className?: string }) {
  const t = useTranslations('agents')
  return (
    <div
      className={cn(
        'mt-2 mb-6 p-4 text-sm border border-dashed border-border-strong text-muted',
        className,
      )}
    >
      <p className="mb-1 font-mono text-[0.7rem] tracking-[0.2em] text-primary uppercase">
        {t('hintKicker')}
      </p>
      <p>{t('hint')}</p>
    </div>
  )
}

/** One quiet card after the grid for guests with picks: keep them with an account. */
export function AccountNudge({
  onDismiss,
  onNavigate,
}: {
  onDismiss: () => void
  /** Called before following a link (remember which form to open and where to come back). */
  onNavigate?: (mode: 'create' | 'sign-in') => void
}) {
  const t = useTranslations('agents')
  return (
    <Reveal variants={riseInSolid}>
      <Panel className="mt-10" innerClassName="overflow-hidden">
        <div className="h-1.5 hazard" aria-hidden />
        <section className="p-5 sm:p-6 gap-4 md:grid-cols-[1fr_auto] md:items-center grid">
          <div className="gap-4 flex items-start">
            <span className="size-11 grid shrink-0 place-items-center bg-primary text-primary-foreground chamfer-sm">
              <CloudUpload className="size-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-3xl display">{t('nudgeTitle')}</h2>
              <p className="mt-1 max-w-[52ch] text-muted">{t('nudgeBody')}</p>
            </div>
          </div>
          <div className="gap-2 flex flex-wrap items-center">
            <Button asChild>
              <Link href="/account#create" onClick={() => onNavigate?.('create')}>
                {t('nudgeCreate')}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/account" onClick={() => onNavigate?.('sign-in')}>
                {t('nudgeSignIn')}
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              {t('nudgeLater')}
            </Button>
          </div>
        </section>
      </Panel>
    </Reveal>
  )
}

/** Inline status notice (merge result, session ended…) with a dismiss button. */
export function Notice({
  tone = 'success',
  children,
  onDismiss,
  className,
}: {
  tone?: 'success' | 'warning'
  children: ReactNode
  onDismiss?: () => void
  className?: string
}) {
  const t = useTranslations('agents')
  const Icon = tone === 'success' ? CloudCheck : CloudAlert
  return (
    <div
      role="status"
      className={cn('mb-6 gap-3 p-4 flex items-start bg-surface-2 chamfer-sm', className)}
      data-testid="notice"
    >
      <Icon
        className={cn(
          'mt-0.5 size-5 shrink-0',
          tone === 'success' ? 'text-primary' : 'text-warning',
        )}
        aria-hidden
      />
      <div className="text-sm flex-1">{children}</div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t('dismiss')}
          className="size-10 -my-2 -mr-2 grid shrink-0 cursor-pointer place-items-center text-muted focus-inset hover:text-foreground"
        >
          <X className="size-4" aria-hidden />
        </button>
      )}
    </div>
  )
}

/** "Signed in. 3 Agents from this browser were added to your account." */
export function MergeNotice({ count, onDismiss }: { count: number; onDismiss: () => void }) {
  const t = useTranslations('agents')
  return (
    <Notice onDismiss={onDismiss}>
      <p>{t('merged', { count })}</p>
      {count > 0 && <p className="mt-1 text-muted">{t('mergedRule')}</p>}
    </Notice>
  )
}
