import { useTranslations } from 'next-intl'
import { ArrowRight, Check } from 'lucide-react'
import { Button, cn } from '@zzz/ui'
import { agentShortName, type Agent } from '@zzz/core'
import { agents, attributesById } from '@zzz/game'
import { Link } from '@/i18n/navigation'
import { features } from '@/lib/features'
import { ActBumper } from './act-bumper'
import { AgentIcon } from './agent-tile'
import { SpecFooter } from './spec-footer'

/** Agents whose name or art could spoil the story never appear here. */
const SHOWCASE = agents.filter((a) => !a.spoiler)
const ROW_A = SHOWCASE.slice(0, 16)
const ROW_B = SHOWCASE.slice(16, 32)
const LATEST = agents.reduce(
  (max, a) => (a.version.localeCompare(max, undefined, { numeric: true }) > 0 ? a.version : max),
  '1.0',
)

/**
 * Act 3, "the roster": two full-bleed rows of Agent icons that slide against each other only while
 * the reader scrolls (a CSS scroll-driven animation, never on its own), around the pitch for
 * My Agents. Some icons wear the real tile's "owned" check and Mindscape level, so the feature
 * reads without words. Text never sits over the moving rows. Server-rendered.
 */
export function LandingRoster() {
  const t = useTranslations('home')
  const registry = features.filter((f) => f.act === 'roster')

  return (
    <section
      aria-labelledby="roster-title"
      data-testid="landing-roster"
      className="py-24 sm:py-32 relative isolate"
    >
      <div
        aria-hidden
        className="inset-y-0 absolute left-1/2 -z-10 w-screen -translate-x-1/2 bg-band-strong"
      />
      <ActBumper act={t('act', { n: 3 })} title={t('actRoster')} />

      <div className="mt-12 relative left-1/2 w-screen -translate-x-1/2 overflow-x-clip">
        <IconRow agents={ROW_A} className="lp-row-a" />
        <div data-arm="" className="lp-rise max-w-3xl px-4 py-14 sm:py-20 mx-auto text-center">
          <p className="text-xs font-semibold font-mono tracking-[0.3em] text-primary uppercase">
            {t('rosterKicker')}
          </p>
          <h2
            id="roster-title"
            className="mt-4 font-black display text-[clamp(2.75rem,8vw,5.75rem)] leading-[0.9] text-balance"
          >
            {t('rosterTitle')}
          </h2>
          <p className="mt-5 text-2xl sm:text-3xl display text-primary">
            {t('rosterStat', { count: agents.length, version: LATEST })}
          </p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed mx-auto text-muted">
            {t('rosterBody')}
          </p>
          <Button asChild variant="outline" size="lg" className="mt-8">
            <Link href="/agents">
              {t('rosterCta')}
              <ArrowRight
                className="group-hover/button:translate-x-1 transition-transform"
                aria-hidden
              />
            </Link>
          </Button>
        </div>
        <IconRow agents={ROW_B} className="lp-row-b" />
      </div>

      <SpecFooter features={registry} className="mt-16" />
    </section>
  )
}

function IconRow({ agents: row, className }: { agents: Agent[]; className: string }) {
  return (
    <div aria-hidden className={cn('gap-3 flex w-max', className)}>
      {row.map((agent, i) => {
        const owned = i % 4 === 1
        const color = attributesById.get(agent.attribute)?.color ?? '#9a9aa3'
        return (
          <div
            key={agent.id}
            className={cn(
              'size-16 sm:size-24 relative shrink-0 overflow-hidden bg-surface-2 chamfer-sm',
              !owned && 'opacity-70',
            )}
          >
            <AgentIcon
              src={agent.icon}
              name={agentShortName(agent).en}
              color={color}
              sizes="96px"
            />
            {owned && (
              <>
                <span className="inset-0 absolute ring-2 ring-primary ring-inset" />
                <span className="top-1 right-1 size-5 absolute grid place-items-center bg-primary text-primary-foreground">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <span className="bottom-1 left-1 px-1 font-bold absolute bg-background/90 font-mono text-[0.6rem] text-primary">
                  M{(i * 3) % 7}
                </span>
              </>
            )}
          </div>
        )
      })}
    </div>
  )
}
