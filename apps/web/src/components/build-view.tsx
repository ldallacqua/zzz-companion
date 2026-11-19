'use client'

import {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import {
  ArrowLeft,
  ArrowUpRight,
  BookMarked,
  Disc3,
  ListOrdered,
  Sparkles,
  Swords,
  TriangleAlert,
} from 'lucide-react'
import {
  Badge,
  Button,
  cn,
  ease,
  GlitchText,
  Reveal,
  riseInSolid,
  Segmented,
  stampIn,
} from '@zzz/ui'
import {
  agentShortName,
  bestOwnedWEngine,
  compareVersions,
  type Agent,
  type Build,
  type DiscSet,
  type Locale,
  type WEngine,
} from '@zzz/core'
import {
  agentsById,
  attributesById,
  buildsByAgent,
  BUILDS_REVIEWED_FOR,
  discSetsById,
  GAME_VERSION,
  specialtiesById,
} from '@zzz/game'
import { Link } from '@/i18n/navigation'
import { isHidden } from '@/lib/agent-filters'
import { useArsenal } from '@/lib/arsenal-store'
import { isClassifiedWEngine, priorityLabels, statShort } from '@/lib/build-labels'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useRoster } from '@/lib/roster-store'
import { agentColor, HiddenAgentTile } from './agent-tile'
import { TraitIcon } from './agent-filter-controls'
import { ComingSoonPanel } from './coming-soon-panel'
import { DiscSetCard } from './disc-set-card'
import { LoadoutBoard } from './loadout-board'
import { PriorityChain } from './priority-chain'
import { WEngineLadder } from './w-engine-ladder'

const GRID =
  'mt-4 grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:grid-rows-[auto_1fr] md:gap-x-8 md:gap-y-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-x-14 md:[grid-template-areas:"board_identity"_"board_details"]'

/** The URL hash, as a store: the variant lives there so every variant has a shareable link. */
const subscribeHash = (onChange: () => void) => {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}
const readHash = () => decodeURIComponent(window.location.hash.slice(1))

/**
 * An Agent's build page. Game data, not story: it renders in full on the server, except for a
 * spoiler-flagged Agent, which stays "Classified" (no name, art or picks) until the reader shows
 * or owns them, as in My Agents.
 */
export function BuildView({ agentId }: { agentId: string }) {
  const agent = agentsById.get(agentId)
  const build = buildsByAgent.get(agentId)
  const rosterReady = useRoster((s) => s.hydrated)
  const owned = useRoster((s) => s.owned)
  const revealed = useRoster((s) => s.revealed)
  const reveal = useRoster((s) => s.reveal)
  // Revealed on this page: the title takes focus, since the control the reader used is gone.
  const [revealedHere, setRevealedHere] = useState(false)
  if (!agent || !build) return null

  const classified = agent.spoiler && (!rosterReady || isHidden(agent, owned, revealed))
  return (
    <div className="pt-6 pb-16">
      {classified ? (
        <ClassifiedBuild
          pending={!rosterReady}
          onReveal={() => {
            setRevealedHere(true)
            reveal(agent.id)
          }}
        />
      ) : (
        <OpenBuild agent={agent} build={build} focusTitle={revealedHere} />
      )}
    </div>
  )
}

function BackLink({ href }: { href: string }) {
  const t = useTranslations('builds')
  return (
    <Link
      href={href}
      className="min-h-10 gap-2 font-semibold text-xs inline-flex items-center font-mono tracking-[0.2em] text-muted uppercase focus-inset transition-colors hover:text-primary"
    >
      <ArrowLeft className="size-4" aria-hidden />
      {t('back')}
    </Link>
  )
}

function Kicker({ children }: { children: ReactNode }) {
  return (
    <p className="gap-3 text-xs font-semibold flex items-center font-mono tracking-[0.3em] text-primary uppercase">
      <span className="w-8 h-px bg-primary" aria-hidden />
      {children}
    </p>
  )
}

function Section({
  title,
  icon: Icon,
  lede,
  children,
  testId,
  first,
}: {
  title: string
  icon: typeof Swords
  lede?: string
  children: ReactNode
  testId?: string
  /** The column's first section (no top margin). */
  first?: boolean
}) {
  return (
    // Each section is its own Reveal, so spacing goes on the section, not via :first-child.
    <Reveal variants={riseInSolid}>
      <section className={first ? undefined : 'mt-14'} data-testid={testId}>
        <h2 className="gap-2.5 text-3xl flex items-center display">
          <Icon className="size-6 shrink-0 text-(--agent)" aria-hidden />
          {title}
        </h2>
        {lede && <p className="mt-1.5 text-sm max-w-[60ch] text-muted">{lede}</p>}
        <div className="mt-4">{children}</div>
      </section>
    </Reveal>
  )
}

/** Which slots and lists differ between an Agent's variants ("slot 4 and substats"). */
function useVariantDiff(build: Build) {
  const t = useTranslations('builds')
  const locale = useLocale() as Locale
  if (build.variants.length < 2) return null
  const same = (pick: (v: Build['variants'][number]) => unknown) =>
    new Set(build.variants.map((v) => JSON.stringify(pick(v)))).size === 1
  const parts = [
    ...(['4', '5', '6'] as const)
      .filter((slot) => !same((v) => v.main[slot]))
      .map((slot) => t('diffSlot', { slot })),
    ...(same((v) => v.substats) ? [] : [t('diffSubstats')]),
    ...(same((v) => v.skills) ? [] : [t('diffSkills')]),
    ...(same((v) => v.wEngines) ? [] : [t('wEngines')]),
    ...(same((v) => v.discs) ? [] : [t('discs')]),
  ]
  if (parts.length === 0) return null
  const list = new Intl.ListFormat(locale, { type: 'conjunction' }).format(parts)
  return t('variantDiff', { parts: list })
}

function OpenBuild({
  agent,
  build,
  focusTitle,
}: {
  agent: Agent
  build: Build
  /** Move focus to the title on mount (the reader just revealed this Agent here). */
  focusTitle?: boolean
}) {
  const t = useTranslations('builds')
  const ta = useTranslations('agents')
  const tf = useTranslations('features')
  const locale = useLocale() as Locale
  const color = agentColor(agent)
  const name = agent.name[locale]
  const short = agentShortName(agent)[locale]

  const rosterReady = useRoster((s) => s.hydrated)
  const rosterOwned = useRoster((s) => s.owned)
  const revealed = useRoster((s) => s.revealed)
  const toggleAgent = useRoster((s) => s.toggle)
  const arsenalReady = useArsenal((s) => s.hydrated)
  const ownedEngines = useArsenal((s) => s.wEngines)
  const toggleWEngine = useArsenal((s) => s.toggleWEngine)
  const [justAdded, setJustAdded] = useState(false)
  const [announcement, setAnnouncement] = useState('')
  const titleRef = useRef<HTMLHeadingElement>(null)
  const rosterLinkRef = useRef<HTMLAnchorElement>(null)
  const variantDiff = useVariantDiff(build)

  useEffect(() => {
    if (focusTitle) titleRef.current?.focus()
  }, [focusTitle])
  // "I have this Agent" turns into the My Agents link: keep focus on that spot.
  useEffect(() => {
    if (justAdded) rosterLinkRef.current?.focus()
  }, [justAdded])

  useDocumentTitle(`${t('docTitle', { name: short })} · ZZZ Companion`)

  const hash = useSyncExternalStore(subscribeHash, readHash, () => '')
  const variant = build.variants.find((v) => v.id === hash) ?? build.variants[0]!
  const selectVariant = (id: string) => {
    const url = id === build.variants[0]!.id ? window.location.pathname : `#${id}`
    window.history.replaceState(window.history.state, '', url)
    window.dispatchEvent(new HashChangeEvent('hashchange'))
  }

  const roster = rosterReady ? { owned: rosterOwned, revealed } : null
  const isClassified = (w: WEngine) => isClassifiedWEngine(w, roster)
  const best = arsenalReady ? bestOwnedWEngine(variant, ownedEngines) : null
  const level = rosterReady && agent.id in rosterOwned ? (rosterOwned[agent.id] ?? 0) : null
  const stale = compareVersions(BUILDS_REVIEWED_FOR, GAME_VERSION) < 0

  const attribute = attributesById.get(agent.attribute)
  const base = attribute?.base ? attributesById.get(attribute.base) : undefined
  const specialty = specialtiesById.get(agent.specialty)

  const sets = (ids: string[]) => ids.flatMap((id) => discSetsById.get(id) ?? []) as DiscSet[]
  const firstPick = variant.discs[0]

  return (
    <div style={{ '--agent': color } as CSSProperties}>
      <BackLink href={`/builds#build-${agent.id}`} />
      <div className={GRID}>
        <header className="min-w-0 md:[grid-area:identity]">
          <Kicker>{t('pageKicker')}</Kicker>
          <motion.h1
            ref={titleRef}
            tabIndex={-1}
            initial={{ y: 30, skewX: -8 }}
            animate={{ y: 0, skewX: 0 }}
            transition={{ duration: 0.7, ease: ease.outExpo }}
            className="mt-2 display text-[clamp(2.75rem,10vw,5.5rem)] focus:outline-none"
          >
            <GlitchText text={name} />
          </motion.h1>

          <ul className="mt-4 gap-2 flex flex-wrap" aria-label={t('details')}>
            {agent.rank && (
              <li>
                <Badge variant={agent.rank === 'S' ? 'warning' : 'default'}>
                  {ta(agent.rank === 'S' ? 'rankS' : 'rankA')}
                </Badge>
              </li>
            )}
            <li>
              <Badge variant="outline" className="py-1">
                <TraitIcon
                  kind="attribute"
                  id={agent.attribute}
                  className="size-3.5"
                  style={{ color }}
                />
                {base
                  ? `${base.name[locale]} · ${attribute?.name[locale]}`
                  : attribute?.name[locale]}
              </Badge>
            </li>
            <li>
              <Badge variant="outline" className="py-1">
                <TraitIcon kind="specialty" id={agent.specialty} className="size-3.5" />
                {specialty?.name[locale]}
              </Badge>
            </li>
            <li>
              <Badge variant="outline" className="py-1">
                {t('updated', { version: build.updated, reviewed: BUILDS_REVIEWED_FOR })}
              </Badge>
            </li>
          </ul>

          <div
            className="mt-4 gap-3 py-1.5 pr-1.5 pl-3 flex min-h-[3.25rem] items-center justify-between border border-dashed border-border-strong"
            data-testid="roster-row"
          >
            <p className="min-w-0 font-mono text-[0.64rem] tracking-[0.14em] text-muted uppercase">
              {!rosterReady ? (
                '—'
              ) : level !== null ? (
                <>
                  {t('inRoster')} ·{' '}
                  <span className="text-primary">
                    {justAdded ? (
                      <motion.span
                        variants={stampIn}
                        initial="hidden"
                        animate="show"
                        className="inline-block"
                      >
                        M{level}
                      </motion.span>
                    ) : (
                      `M${level}`
                    )}
                  </span>
                </>
              ) : (
                t('notInRoster')
              )}
            </p>
            {rosterReady &&
              (level !== null ? (
                <Button asChild variant="secondary" size="sm">
                  <Link href="/agents" ref={rosterLinkRef}>
                    {t('openRoster')}
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    toggleAgent(agent.id)
                    setJustAdded(true)
                    setAnnouncement(t('addedLive', { name: short }))
                  }}
                >
                  {t('addToRoster')}
                </Button>
              ))}
          </div>

          {stale && (
            <p className="mt-3 gap-2 text-sm flex items-start text-muted">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-warning" aria-hidden />
              {t('stale', { version: BUILDS_REVIEWED_FOR, current: GAME_VERSION })}
            </p>
          )}

          {build.variants.length > 1 && (
            <Segmented<string>
              label={t('variantLabel', { name: short })}
              layoutId={`build-variant-${agent.id}`}
              className="mt-5 sm:w-auto sm:inline-flex flex w-full"
              value={variant.id}
              onValueChange={selectVariant}
              options={build.variants.map((v) => ({
                value: v.id,
                label: v.name?.[locale] ?? v.id,
              }))}
            />
          )}
          {variantDiff && (
            <p className="mt-2 text-sm max-w-[50ch] text-muted" data-testid="variant-diff">
              {variantDiff}
            </p>
          )}
        </header>

        <div className="md:top-24 md:self-start md:[grid-area:board] md:[@media(min-height:44rem)]:sticky">
          <LoadoutBoard agent={agent} variant={variant} best={best} isClassified={isClassified} />
        </div>

        <div className="min-w-0 md:[grid-area:details]">
          <Section
            first
            title={t('wEngines')}
            icon={Swords}
            lede={t('wEnginesLede')}
            testId="w-engines"
          >
            <WEngineLadder
              agentId={agent.id}
              variant={variant}
              owned={arsenalReady ? ownedEngines : []}
              hydrated={arsenalReady}
              onToggle={toggleWEngine}
              best={best}
              isClassified={isClassified}
            />
            <p className="mt-3 font-mono text-[0.64rem] tracking-[0.12em] text-subtle uppercase">
              {t('deviceNote')}
            </p>
          </Section>

          {firstPick && (
            <Section
              title={t('discs')}
              icon={Disc3}
              lede={firstPick.two.length > 0 ? t('discsLede') : t('discsLedeAny')}
              testId="discs"
            >
              <div className="gap-3 sm:grid-cols-2 grid">
                <DiscSetCard
                  pieces={4}
                  sets={sets([firstPick.four])}
                  alternatives={variant.discs.slice(1, 3).map((d) => sets([d.four]))}
                />
                {firstPick.two.length > 0 && (
                  <DiscSetCard
                    pieces={2}
                    sets={sets(firstPick.two[0]!)}
                    alternatives={firstPick.two.slice(1, 3).map(sets)}
                  />
                )}
              </div>
            </Section>
          )}

          <Section title={t('substats')} icon={ListOrdered} lede={t('substatsLede')}>
            <PriorityChain
              groups={priorityLabels(variant.substats, locale, statShort)}
              label={t('substats')}
            />
          </Section>

          <Section title={t('skills')} icon={Sparkles} lede={t('skillsLede')}>
            <PriorityChain
              groups={variant.skills.map((k) => [t(`skill.${k}`)])}
              label={t('skills')}
            />
          </Section>

          <Reveal variants={riseInSolid}>
            <ComingSoonPanel id="rotation" title={t('rotation')} badge={tf('soonBadge')}>
              {t('rotationBody')}
            </ComingSoonPanel>
          </Reveal>

          <Section title={t('sources')} icon={BookMarked}>
            <p className="text-sm max-w-[60ch] text-muted">{t('sourcesBody')}</p>
            <ul className="mt-3 space-y-1 text-sm">
              {build.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="min-h-10 gap-1 inline-flex items-center text-primary underline underline-offset-4 focus-inset hover:text-foreground"
                  >
                    {t('guide', { label: s.label })}
                    <NewTab />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://zenless-zone-zero.fandom.com/wiki/W-Engine"
                  target="_blank"
                  rel="noreferrer"
                  className="min-h-10 gap-1 inline-flex items-center text-primary underline underline-offset-4 focus-inset hover:text-foreground"
                >
                  {t('wiki')}
                  <NewTab />
                </a>
              </li>
            </ul>
          </Section>
        </div>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  )
}

/** Marks a link that opens in a new tab (icon + words for screen readers). */
function NewTab() {
  const tr = useTranslations('recap')
  return (
    <>
      <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
      <span className="sr-only">{` (${tr('newTab')})`}</span>
    </>
  )
}

/**
 * The same for every spoiler-flagged Agent until the reader shows them: no name, colour, art or
 * picks. Before the roster loads it is already in the HTML (and invisible for readers who have a
 * roster, so an owned Agent's build doesn't flash "Classified" first).
 */
function ClassifiedBuild({ pending, onReveal }: { pending: boolean; onReveal: () => void }) {
  const t = useTranslations('builds')
  useDocumentTitle(`${t('pageKicker')} · ZZZ Companion`)
  return (
    <div
      className={cn(pending && 'in-data-[roster=set]:invisible')}
      aria-busy={pending || undefined}
      data-testid="build-classified"
    >
      <BackLink href="/builds" />
      <div className="mt-4 gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] grid">
        <div className="min-w-0">
          <Kicker>{t('pageKicker')}</Kicker>
          <h1 className="mt-2 display text-[clamp(2.75rem,10vw,5.5rem)]">{t('classifiedTitle')}</h1>
          <p className="mt-3 text-lg max-w-[50ch] text-muted">{t('classifiedBody')}</p>
        </div>
        <div className="max-w-56 md:order-first">
          <HiddenAgentTile onReveal={onReveal} />
        </div>
      </div>
    </div>
  )
}
