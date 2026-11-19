'use client'

import { useDeferredValue, useEffect, useId, useMemo, useRef, useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react'
import { Button, cn, Input } from '@zzz/ui'
import type { Agent, Locale, RosterMap } from '@zzz/core'
import { agents, builds, buildsByAgent, GAME_VERSION } from '@zzz/game'
import { Link } from '@/i18n/navigation'
import {
  EMPTY_FILTERS,
  filterAgents,
  isHidden,
  traitFilterCount,
  type AgentFilters as Filters,
} from '@/lib/agent-filters'
import { useRoster } from '@/lib/roster-store'
import { ActiveFilters, AgentFilters, AgentFilterSheet, SortControl } from './agent-filter-controls'
import { HiddenAgentTile } from './agent-tile'
import { BuildTile } from './build-tile'
import { PageHeading } from './page-heading'
import { RosterEmpty } from './roster-sections'

const EAGER_TILES = 6
/** Tiles in the HTML and the first render: a phone screen, or a desktop row or two. */
const FIRST_TILES = 12

/**
 * The builds index (docs/features/builds.md): every Agent's build, the player's own Agents first.
 * Search, filters and sort are My Agents' controls.
 */
export function BuildsView() {
  const t = useTranslations('builds')
  const ta = useTranslations('agents')
  const locale = useLocale() as Locale

  const hydrated = useRoster((s) => s.hydrated)
  const storedOwned = useRoster((s) => s.owned)
  const storedRevealed = useRoster((s) => s.revealed)
  const reveal = useRoster((s) => s.reveal)
  // Before hydration the HTML lists everyone in one grid; readers with a roster don't see it (the
  // boot script's data-roster keeps it invisible until their sections replace it).
  const owned = useMemo(() => (hydrated ? storedOwned : {}), [hydrated, storedOwned])
  const revealed = useMemo(() => (hydrated ? storedRevealed : []), [hydrated, storedRevealed])

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [announcement, setAnnouncement] = useState('')

  const visible = useMemo(
    () => filterAgents(agents, owned, filters, locale, { revealed }),
    [owned, filters, locale, revealed],
  )
  // The rest of the grid mounts in a background render React can interrupt (Lighthouse TBT).
  const tileLimit = useDeferredValue(Number.POSITIVE_INFINITY, FIRST_TILES)
  const hasRoster = Object.keys(owned).length > 0
  const yours = hasRoster ? visible.filter((a) => a.id in owned) : []
  const others = hasRoster ? visible.filter((a) => !(a.id in owned)) : visible
  const filterCount = traitFilterCount(filters)

  // "All builds" links back to /builds#build-{id}. Next scrolls before the deferred tiles exist,
  // so once every tile has mounted, bring that one into view (and focus it, for keyboards).
  const restored = useRef(false)
  useEffect(() => {
    if (restored.current || !hydrated || tileLimit !== Number.POSITIVE_INFINITY) return
    restored.current = true
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id.startsWith('build-')) return
    const tile = document.getElementById(id)
    tile?.scrollIntoView({ block: 'center' })
    tile?.focus({ preventScroll: true })
  }, [hydrated, tileLimit])

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
    // Only filter changes announce.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  return (
    <>
      <PageHeading kicker={t('kicker')} title={t('title')} lede={t('lede')} />

      <div className="-mx-4 h-12 gap-3 px-4 sm:-mx-6 sm:px-6 flex items-center justify-between border-y border-border bg-background/90 font-mono text-[0.64rem] tracking-[0.16em] text-muted uppercase">
        <span data-testid="builds-coverage">{t('coverage', { count: builds.length })}</span>
        <span className="text-subtle">{t('gameVersion', { version: GAME_VERSION })}</span>
      </div>

      {(!hydrated || !hasRoster) && (
        <div
          className={cn(
            'mt-4 gap-3 p-4 text-sm sm:flex-row sm:items-center sm:justify-between flex flex-col border border-dashed border-border-strong text-muted',
            !hydrated && 'in-data-[roster=set]:hidden',
          )}
          data-testid="builds-hint"
        >
          <p>{t('hint')}</p>
          <Button asChild variant="outline" size="sm" className="sm:self-auto self-start">
            <Link href="/agents">
              {t('hintCta')}
              <ArrowRight aria-hidden />
            </Link>
          </Button>
        </div>
      )}

      <div className="mt-4 space-y-3">
        <div className="gap-2 lg:gap-3 lg:items-center flex">
          <div className="min-w-0 lg:max-w-sm flex-1">
            <label htmlFor="build-search" className="sr-only">
              {ta('search')}
            </label>
            <Input
              id="build-search"
              type="search"
              enterKeyHint="search"
              autoComplete="off"
              spellCheck={false}
              placeholder={ta('search')}
              value={filters.query}
              wrapperClassName="h-11"
              className="h-11 [&::-webkit-search-cancel-button]:appearance-none"
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && filters.query) {
                  e.preventDefault()
                  setFilters({ ...filters, query: '' })
                }
              }}
              start={<Search className="size-4 shrink-0 text-muted" aria-hidden />}
              end={
                filters.query ? (
                  <button
                    type="button"
                    aria-label={ta('clearSearch')}
                    onClick={() => setFilters({ ...filters, query: '' })}
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
            aria-label={filterCount ? ta('filtersOn', { count: filterCount }) : ta('filters')}
            onClick={() => setSheetOpen(true)}
          >
            <SlidersHorizontal aria-hidden />
            <span className="sm:inline hidden">{ta('filters')}</span>
            {filterCount > 0 && (
              <span className="ml-1 h-5 min-w-5 px-1 grid place-items-center bg-primary font-mono text-[0.65rem] text-primary-foreground not-italic">
                {filterCount}
              </span>
            )}
          </Button>
          <SortControl
            value={filters.sort}
            onChange={(sort) => setFilters({ ...filters, sort })}
            layoutId="builds-sort-lg"
            className="lg:inline-flex ml-auto hidden"
          />
        </div>
        <AgentFilters
          layout="inline"
          className="lg:block hidden"
          value={filters}
          onChange={setFilters}
        />
        <ActiveFilters className="lg:hidden" value={filters} onChange={setFilters} />
      </div>

      <AgentFilterSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        value={filters}
        onChange={setFilters}
        resultCount={visible.length}
      />

      <div
        aria-busy={!hydrated || undefined}
        className={cn('min-h-[50dvh]', !hydrated && 'in-data-[roster=set]:invisible')}
      >
        {!hydrated && <p className="sr-only">{t('loading')}</p>}
        {visible.length === 0 ? (
          <RosterEmpty
            kind="filters"
            query={filters.query}
            filtered={filterCount > 0}
            onAction={() => setFilters({ ...EMPTY_FILTERS, sort: filters.sort })}
          />
        ) : (
          <>
            {yours.length > 0 && (
              <TileSection
                title={t('yourAgents')}
                list={yours.slice(0, tileLimit)}
                total={yours.length}
                owned={owned}
                revealed={revealed}
                onReveal={reveal}
                eager={EAGER_TILES}
                testId="builds-yours"
              />
            )}
            {others.length > 0 && (
              <TileSection
                title={hasRoster ? t('otherAgents') : t('allAgents')}
                list={others.slice(0, Math.max(0, tileLimit - yours.length))}
                total={others.length}
                owned={owned}
                revealed={revealed}
                onReveal={reveal}
                eager={Math.max(0, EAGER_TILES - yours.length)}
                testId="builds-others"
              />
            )}
          </>
        )}
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </>
  )
}

function TileSection({
  title,
  list,
  total,
  owned,
  revealed,
  onReveal,
  eager,
  testId,
}: {
  title: string
  list: Agent[]
  total: number
  owned: RosterMap
  revealed: readonly string[]
  onReveal: (id: string) => void
  eager: number
  testId: string
}) {
  const t = useTranslations('builds')
  const titleId = useId()
  return (
    <section aria-labelledby={titleId} className="mt-8" data-testid={testId}>
      <h2 id={titleId} className="mb-3 gap-2 flex items-baseline">
        <span className="text-2xl display">{title}</span>
        <span className="text-xs font-mono text-subtle">{total}</span>
      </h2>
      <ul
        aria-label={t('gridLabel', { section: title, count: total })}
        className="gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 grid grid-cols-3"
      >
        {list.map((agent, i) => (
          <li key={agent.id}>
            {isHidden(agent, owned, revealed) ? (
              <HiddenAgentTile onReveal={() => onReveal(agent.id)} />
            ) : (
              <BuildTile
                agent={agent}
                level={agent.id in owned ? (owned[agent.id] ?? 0) : null}
                variants={buildsByAgent.get(agent.id)?.variants.length ?? 0}
                priority={i < eager}
              />
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
