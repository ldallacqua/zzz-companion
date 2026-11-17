'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button, cn, ease, Input, Segmented } from '@zzz/ui'
import { agentShortName, type Locale } from '@zzz/core'
import { agents } from '@zzz/game'
import {
  EMPTY_FILTERS,
  filterAgents,
  isHidden,
  isNarrowed,
  ownedCount,
  traitFilterCount,
  type AgentFilters as Filters,
  type OwnedView,
} from '@/lib/agent-filters'
import { useAccount } from '@/lib/account-store'
import { useRoster } from '@/lib/roster-store'
import { rememberAuthIntent } from '@/lib/return-to'
import { ActiveFilters, AgentFilters, AgentFilterSheet, SortControl } from './agent-filter-controls'
import { AgentTile, HiddenAgentTile } from './agent-tile'
import { PageHeading } from './page-heading'
import {
  AccountNudge,
  MergeNotice,
  ResultsBar,
  RosterEmpty,
  RosterHint,
  RosterStatusStrip,
} from './roster-sections'
import { SyncChip, useSyncDisplay } from './sync-chip'

const EAGER_TILES = 6

/**
 * My Agents (docs/features/agents-and-accounts.md): tick the Agents you own and their Mindscape.
 * Works without an account; the sync chip says where the roster lives.
 *
 * The list stays put while you edit: toggled tiles are "pinned" in place until the view, a filter
 * or the search changes, so bulk ticking never hits the wrong tile.
 */
export function AgentsView() {
  const t = useTranslations('agents')
  const ts = useTranslations('sync')
  const locale = useLocale() as Locale

  const rosterReady = useRoster((s) => s.hydrated)
  const accountReady = useAccount((s) => s.hydrated)
  const hydrated = rosterReady && accountReady
  const storedOwned = useRoster((s) => s.owned)
  const storedRevealed = useRoster((s) => s.revealed)
  const nudgeDismissed = useRoster((s) => s.nudgeDismissed)
  const lastSavedAt = useRoster((s) => s.lastSavedAt)
  const { toggle, setMindscape, ownMany, disownMany, reveal, dismissNudge, retry } =
    useRoster.getState()
  const enabled = useAccount((s) => s.enabled)
  const token = useAccount((s) => s.token)
  const notice = useAccount((s) => s.notice)
  const setNotice = useAccount((s) => s.setNotice)
  const display = useSyncDisplay()

  // Before hydration every tile renders "not owned" (the static HTML); returning readers don't
  // see it (the grid stays invisible thanks to the boot script's data-roster / data-account).
  const owned = useMemo(() => (hydrated ? storedOwned : {}), [hydrated, storedOwned])
  const revealed = useMemo(() => (hydrated ? storedRevealed : []), [hydrated, storedRevealed])

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [pinned, setPinned] = useState<ReadonlySet<string>>(new Set())
  const [undo, setUndo] = useState<string[] | null>(null)
  const [stamped, setStamped] = useState<ReadonlySet<string>>(new Set())
  const [sheetOpen, setSheetOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  /** Mindscape of agents un-ticked this visit, restored if they're ticked again. */
  const lastLevel = useRef<Record<string, number>>({})

  // The first-visit hint is decided once, at hydration, and never removed during the visit:
  // collapsing it would move the grid under the reader's finger.
  const [showHint, setShowHint] = useState<boolean | null>(null)
  if (hydrated && showHint === null) setShowHint(Object.keys(storedOwned).length === 0 && !token)

  const visible = useMemo(
    () => filterAgents(agents, owned, filters, locale, { revealed, pinned }),
    [owned, filters, locale, revealed, pinned],
  )
  const counts = ownedCount(agents, owned)
  const markableIds = isNarrowed(filters)
    ? visible.filter((a) => !(a.id in owned) && !isHidden(a, owned, revealed)).map((a) => a.id)
    : []

  const pin = (ids: string[]) => setPinned((prev) => new Set([...prev, ...ids]))
  const stampIds = (ids: string[]) => setStamped((prev) => new Set([...prev, ...ids]))

  const updateFilters = (next: Filters) => {
    setFilters(next)
    setPinned(new Set())
    setUndo(null)
  }

  // Announce the result count once filtering settles.
  const firstFilters = useRef(true)
  useEffect(() => {
    if (firstFilters.current) {
      firstFilters.current = false
      return
    }
    const timer = setTimeout(
      () => setAnnouncement(t('resultsLive', { count: visible.length })),
      500,
    )
    return () => clearTimeout(timer)
    // Only filter changes announce; edits don't.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  // Announce sync failures and the recovery after one (never every save).
  const previousDisplay = useRef(display)
  useEffect(() => {
    const before = previousDisplay.current
    previousDisplay.current = display
    if (display === 'error' && before !== 'error') setAnnouncement(ts('errorLive'))
    if (display === 'saved' && (before === 'error' || before === 'offline'))
      setAnnouncement(ts('recoveredLive'))
  }, [display, ts])

  const onToggle = (id: string) => {
    const wasOwned = id in owned
    if (wasOwned) {
      lastLevel.current[id] = owned[id] ?? 0
      toggle(id)
    } else {
      const restore = lastLevel.current[id]
      if (restore) setMindscape(id, restore)
      else toggle(id)
      stampIds([id])
    }
    pin([id])
    setUndo(null)
    return !wasOwned
  }

  const onMarkAll = () => {
    const ids = markableIds
    if (!ids.length) return
    ownMany(ids)
    pin(ids)
    stampIds(ids)
    setUndo(ids)
    setAnnouncement(t('markedLive', { count: ids.length }))
  }
  const onUndo = () => {
    if (!undo) return
    disownMany(undo)
    setUndo(null)
    setAnnouncement(t('undoneLive'))
  }

  const setView = (view: OwnedView) => updateFilters({ ...filters, view })
  const filterCount = traitFilterCount(filters)

  const empty =
    visible.length > 0
      ? null
      : filters.view === 'owned' && !filterCount && !filters.query.trim()
        ? 'owned'
        : filters.view === 'missing' && !filterCount && !filters.query.trim()
          ? 'missing'
          : 'filters'

  const showNudge = hydrated && enabled && !token && counts.owned > 0 && !nudgeDismissed
  const mergeCount = notice?.kind === 'merged' || notice?.kind === 'welcome' ? notice.count : null

  const viewOptions = [
    { value: 'all' as const, label: t('viewAll') },
    { value: 'owned' as const, label: t('viewOwned') },
    { value: 'missing' as const, label: t('viewMissing') },
  ]

  return (
    <>
      <PageHeading kicker={t('kicker')} title={t('title')} lede={t('lede')} />

      {mergeCount !== null && <MergeNotice count={mergeCount} onDismiss={() => setNotice(null)} />}

      {showHint === null ? (
        <RosterHint className="in-data-[account=in]:hidden in-data-[roster=set]:hidden" />
      ) : (
        showHint && <RosterHint />
      )}

      <RosterStatusStrip
        owned={counts.owned}
        total={counts.total}
        hydrated={hydrated}
        sync={
          <SyncChip
            display={hydrated ? display : 'local'}
            accountsEnabled={enabled}
            lastSavedAt={lastSavedAt}
            onRetry={retry}
          />
        }
      />

      <div className="mt-4 space-y-3">
        <div className="gap-2 lg:gap-3 lg:items-center flex">
          <div className="min-w-0 lg:max-w-sm flex-1">
            <label htmlFor="agent-search" className="sr-only">
              {t('search')}
            </label>
            <Input
              id="agent-search"
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              spellCheck={false}
              placeholder={t('search')}
              value={filters.query}
              wrapperClassName="h-11"
              className="h-11 [&::-webkit-search-cancel-button]:appearance-none"
              onChange={(e) => updateFilters({ ...filters, query: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && filters.query) {
                  e.preventDefault()
                  updateFilters({ ...filters, query: '' })
                }
                // Accelerator: exactly one match → Enter toggles it.
                if (e.key === 'Enter' && visible.length === 1) {
                  const only = visible[0]!
                  if (isHidden(only, owned, revealed)) return
                  e.preventDefault()
                  const nowOwned = onToggle(only.id)
                  const name = agentShortName(only)[locale]
                  setAnnouncement(t(nowOwned ? 'ownedLive' : 'notOwnedLive', { name }))
                  e.currentTarget.select()
                }
              }}
              start={<Search className="size-4 shrink-0 text-muted" aria-hidden />}
              end={
                filters.query ? (
                  <button
                    type="button"
                    aria-label={t('clearSearch')}
                    onClick={() => updateFilters({ ...filters, query: '' })}
                    className="size-10 -mr-3 grid shrink-0 cursor-pointer place-items-center text-muted focus-inset hover:text-foreground"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                ) : null
              }
            />
          </div>
          <Button
            variant="secondary"
            className="px-4 lg:hidden h-11"
            aria-haspopup="dialog"
            aria-label={filterCount ? t('filtersOn', { count: filterCount }) : t('filters')}
            onClick={() => setSheetOpen(true)}
          >
            <SlidersHorizontal aria-hidden />
            <span className="sm:inline hidden">{t('filters')}</span>
            {filterCount > 0 && (
              <span className="ml-1 h-5 min-w-5 px-1 grid place-items-center bg-primary font-mono text-[0.65rem] text-primary-foreground not-italic">
                {filterCount}
              </span>
            )}
          </Button>
          <Segmented<OwnedView>
            label={t('view')}
            layoutId="roster-view-lg"
            className="lg:inline-flex hidden"
            value={filters.view}
            onValueChange={setView}
            options={viewOptions}
          />
          <SortControl
            value={filters.sort}
            onChange={(sort) => updateFilters({ ...filters, sort })}
            layoutId="roster-sort-lg"
            className="lg:inline-flex ml-auto hidden"
          />
        </div>
        <Segmented<OwnedView>
          label={t('view')}
          layoutId="roster-view-sm"
          className="lg:hidden grid grid-cols-3"
          value={filters.view}
          onValueChange={setView}
          options={viewOptions}
        />
        <AgentFilters
          layout="inline"
          className="lg:block hidden"
          value={filters}
          onChange={updateFilters}
        />
        <ActiveFilters className="lg:hidden" value={filters} onChange={updateFilters} />
      </div>

      <AgentFilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        value={filters}
        onChange={updateFilters}
        resultCount={visible.length}
      />

      <h2 className="sr-only">{t('gridHeading')}</h2>
      <ResultsBar
        count={visible.length}
        markable={markableIds.length}
        undo={undo ? { count: undo.length } : null}
        onMarkAll={onMarkAll}
        onUndo={onUndo}
      />

      <div
        aria-busy={!hydrated || undefined}
        className={cn(
          'min-h-[50dvh]',
          !hydrated && 'in-data-[account=in]:invisible in-data-[roster=set]:invisible',
        )}
      >
        {!hydrated && <p className="sr-only">{t('loading')}</p>}
        {empty ? (
          <RosterEmpty
            kind={empty}
            query={filters.query}
            filtered={filterCount > 0 || filters.view !== 'all'}
            onAction={
              empty === 'owned'
                ? () => setView('all')
                : empty === 'filters'
                  ? () => updateFilters({ ...EMPTY_FILTERS, sort: filters.sort })
                  : undefined
            }
          />
        ) : (
          <ul
            aria-label={t('gridLabel')}
            data-testid="agent-grid"
            className="gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 grid grid-cols-3"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((agent, i) => (
                <motion.li
                  key={agent.id}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    transition: { duration: 0.25, ease: ease.outExpo },
                  }}
                  exit={{ opacity: 0, transition: { duration: 0.15 } }}
                >
                  {isHidden(agent, owned, revealed) ? (
                    <HiddenAgentTile onReveal={() => reveal(agent.id)} />
                  ) : (
                    <AgentTile
                      agent={agent}
                      level={agent.id in owned ? (owned[agent.id] ?? 0) : null}
                      onToggle={onToggle}
                      onLevel={(id, level) => {
                        setMindscape(id, level)
                        setUndo(null)
                      }}
                      stamp={stamped.has(agent.id)}
                      priority={i < EAGER_TILES}
                    />
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>

      {showNudge && <AccountNudge onDismiss={dismissNudge} onNavigate={rememberAuthIntent} />}

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </>
  )
}
