import type { CSSProperties, ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Check, Disc3, Swords } from 'lucide-react'
import { Badge, Button, cn } from '@zzz/ui'
import type { Locale, WEngine } from '@zzz/core'
import { attributesById, builds, BUILDS_REVIEWED_FOR, specialtiesById } from '@zzz/game'
import { Link } from '@/i18n/navigation'
import { features } from '@/lib/features'
import { loadoutShowcase } from '@/lib/loadout-showcase'
import { TraitIcon } from '@/lib/trait-icons'
import { resized } from '@/lib/wiki-image'
import { ActBumper } from './act-bumper'
import { FixedBay, isMainSlot, LitBay, SLOTS } from './loadout-parts'
import { SpecFooter } from './spec-footer'

const SHOT = loadoutShowcase()

/**
 * Act 4, "the loadout": who you have (Act 3) → what they equip. The pitch for Builds next to a
 * product shot of a real build page (the showcase Agent's loadout board and the top of the
 * W-Engine ladder, with #3 ticked as owned). It shares Act 3's band, so the two read as one
 * movement, and ends with its own spec line. Below `xl` the copy sits above the shot, so the
 * shot gets the full width (it would be too small to read beside the copy). Server-rendered; no
 * client islands.
 */
export function LandingLoadout() {
  const t = useTranslations('home')
  const registry = features.filter((f) => f.act === 'loadout')
  const nowrap = (chunks: ReactNode) => <span className="whitespace-nowrap">{chunks}</span>

  return (
    <section
      aria-labelledby="loadout-title"
      data-testid="landing-loadout"
      className="pt-12 pb-24 sm:pb-32 relative isolate"
    >
      <div
        aria-hidden
        className="inset-y-0 absolute left-1/2 -z-10 w-screen -translate-x-1/2 bg-band-strong"
      />
      <ActBumper act={t('act', { n: 4 })} title={t('actLoadout')} />

      <div className="mt-12 gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] grid items-center">
        <div data-arm="" className="lp-rise xl:order-2">
          <h2
            id="loadout-title"
            className="font-black xl:text-[clamp(2.75rem,4.4vw,4rem)] display text-[clamp(2.75rem,7vw,5rem)] leading-[0.9] text-balance"
          >
            {t('loadoutTitle')}
          </h2>
          <p className="mt-5 text-2xl sm:text-3xl display text-balance text-primary">
            {t('loadoutStat', { count: builds.length, version: BUILDS_REVIEWED_FOR })}
          </p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
            {t.rich('loadoutBody', { nb: nowrap })}
          </p>
          <div className="mt-8">
            <Button asChild variant="outline" size="lg">
              <Link href="/builds">
                {t('loadoutCta')}
                <ArrowRight
                  className="group-hover/button:translate-x-1 transition-transform"
                  aria-hidden
                />
              </Link>
            </Button>
          </div>
        </div>

        <div data-arm="" className="lp-rise xl:order-1">
          <div className="lp-rotate-in-l">
            <LoadoutShot />
          </div>
        </div>
      </div>

      <SpecFooter features={registry} className="mt-16" />
    </section>
  )
}

/**
 * The product shot: real tokens and slot components at real density, laid out at a fixed design
 * size (360 × 656 on phones, 720 × 466 from `sm`) and scaled like a picture by `.lp-shot` (CSS
 * only, up to 1.2×, see `app/landing.css`). `inert`: it is a picture of the page, not a second
 * copy of it.
 */
export function LoadoutShot() {
  const t = useTranslations('builds')
  const ta = useTranslations('agents')
  const locale = useLocale() as Locale
  const { agent, build, variant, engines, owned, four, two } = SHOT
  const attribute = attributesById.get(agent.attribute)
  const specialty = specialtiesById.get(agent.specialty)
  const color = attribute?.color ?? 'var(--color-muted)'
  const best = t('bestYouHaveLine', { name: owned.engine.name[locale], rank: owned.rank })
  const top = engines[0]!

  return (
    <div
      inert
      aria-hidden
      data-testid="loadout-mock"
      className="lp-shot overflow-hidden bg-surface shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8)] ring-1 ring-border-strong chamfer"
      style={{ '--agent': color } as CSSProperties}
    >
      <div data-shot="" className="p-4 sm:p-5 flex flex-col">
        <div className="gap-4 sm:flex-row sm:items-end sm:justify-between flex flex-col">
          <div className="min-w-0">
            <p className="gap-2 font-semibold flex items-center font-mono text-[0.6rem] tracking-[0.3em] text-primary uppercase">
              <span className="w-5 h-px bg-primary" />
              {t('pageKicker')}
            </p>
            <p className="mt-1 sm:text-[2.5rem] truncate display text-[2.25rem] leading-none">
              {agent.name[locale]}
            </p>
          </div>
          <div className="gap-1.5 sm:justify-end min-w-0 flex flex-1 flex-wrap">
            {agent.rank && (
              <Badge variant={agent.rank === 'S' ? 'warning' : 'default'}>
                {ta(agent.rank === 'S' ? 'rankS' : 'rankA')}
              </Badge>
            )}
            <Badge variant="outline">
              <TraitIcon
                kind="attribute"
                id={agent.attribute}
                className="size-3.5"
                style={{ color }}
              />
              {attribute?.name[locale]}
            </Badge>
            <Badge variant="outline">
              <TraitIcon kind="specialty" id={agent.specialty} className="size-3.5" />
              {specialty?.name[locale]}
            </Badge>
            <Badge variant="outline" className="max-sm:hidden">
              {t('updated', { version: build.updated, reviewed: BUILDS_REVIEWED_FOR })}
            </Badge>
          </div>
        </div>

        <div className="mt-4 gap-6 sm:grid-cols-[18.5rem_minmax(0,1fr)] grid">
          <ol className="gap-x-2 gap-y-1.5 relative grid grid-cols-3 grid-rows-[repeat(6,2.5rem)]">
            <li className="col-start-2 row-span-2 row-start-3 grid place-items-center">
              <div className="lp-pop relative aspect-[1.155] w-[6.5rem] bg-(--agent) p-[2px] [--d:120ms] clip-hex">
                <div className="absolute inset-[2px] overflow-hidden bg-surface clip-hex">
                  <span className="inset-0 absolute halftone opacity-20" style={{ color }} />
                  <Img src={agent.icon} width={208} className="scale-110 object-cover" />
                  <span className="inset-0 absolute scanlines" />
                </div>
              </div>
            </li>
            {SLOTS.map((slot, i) =>
              isMainSlot(slot) ? (
                <LitBay
                  key={slot}
                  slot={slot}
                  groups={variant.main[slot]}
                  valueClassName="block display text-[1.05rem] leading-none"
                  className="lp-flip"
                  style={{ '--d': `${260 + (i - 3) * 120}ms` } as CSSProperties}
                />
              ) : (
                <FixedBay key={slot} slot={slot} />
              ),
            )}
          </ol>

          <div className="min-w-0">
            <p className="font-mono text-[0.6rem] tracking-[0.14em] text-muted uppercase">
              {t('setSplit')}
            </p>
            <div className="mt-2 gap-1.5 px-1 flex">
              {Array.from({ length: 6 }, (_, i) => (
                <span key={i} className="h-2 flex-1 -skew-x-[20deg]">
                  <span
                    className={cn(
                      'lp-fill block h-full origin-left',
                      i < 4 ? 'bg-(--agent)' : 'bg-(--agent)/45',
                    )}
                    style={{ '--d': `${620 + i * 60}ms` } as CSSProperties}
                  />
                </span>
              ))}
            </div>
            <ul className="mt-2.5 space-y-1.5">
              <SetLine count="4×" name={four.name[locale]} icons={[four.icon]} />
              {two.length > 0 && (
                <SetLine
                  count="2×"
                  name={two.map((s) => s.name[locale]).join(` ${t('or')} `)}
                  icons={two.slice(0, 2).map((s) => s.icon)}
                />
              )}
            </ul>

            {/* Phones: the board's #1 W-Engine socket carries the news, as on the real page. */}
            <div className="mt-4 sm:hidden bg-border p-px chamfer-sm">
              <div className="gap-3 p-3 flex items-center bg-surface chamfer-sm">
                <Icon src={top.icon} kind="w-engine" size={48} className="bg-surface-2" />
                <div className="min-w-0">
                  <p className="font-mono text-[0.6rem] tracking-[0.14em] text-muted uppercase">
                    {t('wEngines')} · {t('position', { rank: 1 })}
                  </p>
                  <p className="mt-1 text-xl truncate display leading-none">{top.name[locale]}</p>
                  <p className="lp-type mt-1.5 text-xs leading-snug font-semibold font-mono text-primary [--d:1200ms] [--n:6]">
                    {best}
                  </p>
                </div>
              </div>
            </div>

            {/* From sm: the top of the ladder, with #3 ticked. */}
            <div className="mt-4 max-sm:hidden">
              <p className="font-mono text-[0.6rem] tracking-[0.14em] text-muted uppercase">
                {t('wEngines')}
              </p>
              <ol className="mt-2 space-y-1.5">
                {engines.map((engine, i) => (
                  <EngineRow
                    key={engine.id}
                    engine={engine}
                    rank={i + 1}
                    signature={engine.signature === agent.id}
                    owned={engine.id === owned.engine.id}
                  />
                ))}
              </ol>
              <p className="lp-type mt-2 text-xs font-semibold truncate font-mono text-primary [--d:1200ms] [--n:6]">
                {best}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EngineRow({
  engine,
  rank,
  signature,
  owned,
}: {
  engine: WEngine
  rank: number
  signature: boolean
  owned: boolean
}) {
  const t = useTranslations('builds')
  const locale = useLocale() as Locale
  const top = rank === 1
  return (
    <li className={cn('relative p-px chamfer-sm', top ? 'bg-(--agent)' : 'bg-border')}>
      <div
        className={cn(
          'gap-2.5 px-2.5 py-1.5 flex items-center chamfer-sm',
          top ? 'bg-surface' : 'bg-surface-2',
        )}
      >
        <span
          className={cn(
            'w-7 shrink-0 text-center display text-outline',
            top ? 'text-3xl text-(--agent)' : 'text-2xl text-subtle',
          )}
        >
          {String(rank).padStart(2, '0')}
        </span>
        <Icon src={engine.icon} kind="w-engine" size={36} className="bg-background/40" />
        <div className="min-w-0 flex-1">
          <div className="gap-1.5 flex items-center">
            <span
              className={cn(
                'px-1.5 py-0.5 font-bold font-mono text-[0.6rem] leading-none',
                engine.rank === 'S' ? 'bg-warning text-background' : 'bg-surface-3 text-foreground',
              )}
            >
              {engine.rank}
            </span>
            {signature && (
              <Badge variant="outline" className="px-1.5 text-[0.58rem]">
                {t('signature')}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-base truncate display leading-none">{engine.name[locale]}</p>
          {/* A placeholder instead of the summary: same height in both locales. */}
          <span className="mt-1.5 h-1 block w-3/4 bg-surface-3" />
        </div>
        {/* Owned: the ticked chip wipes in over the unticked one, so the tick and the fill land
            together, then the row's ring and the "Best you have" line follow. */}
        <span className="relative shrink-0">
          <HaveIt label={t('haveIt')} />
          {owned && (
            <span className="lp-wipe inset-0 absolute [--d:1000ms]">
              <HaveIt label={t('haveIt')} owned />
            </span>
          )}
        </span>
      </div>
      {owned && (
        <span className="lp-wipe inset-0 absolute ring-2 ring-primary chamfer-sm [--d:1100ms] ring-inset" />
      )}
    </li>
  )
}

function HaveIt({ label, owned = false }: { label: string; owned?: boolean }) {
  return (
    <span
      className={cn(
        'h-8 gap-1.5 px-2.5 font-semibold flex items-center font-mono text-[0.56rem] tracking-[0.12em] uppercase chamfer-sm',
        owned ? 'bg-primary text-primary-foreground' : 'bg-surface-3 text-muted',
      )}
    >
      <span className="size-3.5 grid place-items-center">
        {owned ? (
          <Check className="size-3.5 stroke-[3]" />
        ) : (
          <span className="size-2.5 border border-current" />
        )}
      </span>
      {label}
    </span>
  )
}

function SetLine({ count, name, icons }: { count: string; name: string; icons: string[] }) {
  return (
    <li className="gap-2 flex items-center">
      <span className="w-6 text-xs shrink-0 font-mono text-subtle">{count}</span>
      <span className="gap-0.5 flex shrink-0">
        {icons.map((src) => (
          <Icon key={src} src={src} kind="disc" size={26} />
        ))}
      </span>
      <span className="min-w-0 text-sm font-semibold truncate">{name}</span>
    </li>
  )
}

/** A hotlinked icon over its glyph: if the CDN fails, the glyph still shows (no client code). */
function Icon({
  src,
  kind,
  size,
  className,
}: {
  src: string
  kind: 'w-engine' | 'disc'
  size: number
  className?: string
}) {
  const Glyph = kind === 'disc' ? Disc3 : Swords
  return (
    <span
      className={cn('relative grid shrink-0 place-items-center', className)}
      style={{ width: size, height: size }}
    >
      <Glyph className="size-1/2 text-subtle" />
      <Img src={src} width={size * 2} className="object-contain" />
    </span>
  )
}

function Img({ src, width, className }: { src: string; width: number; className?: string }) {
  return (
    // Plain <img>: the CDN serves pre-sized copies and rejects image proxies (see Portrait).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resized(src, width)}
      alt=""
      width={width / 2}
      height={width / 2}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={cn('inset-0 absolute size-full select-none', className)}
    />
  )
}
