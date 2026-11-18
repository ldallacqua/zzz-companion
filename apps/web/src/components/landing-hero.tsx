import type { CSSProperties } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowDown, ArrowRight } from 'lucide-react'
import { Button, cn } from '@zzz/ui'
import type { Locale } from '@zzz/core'
import { charactersById, coverage } from '@zzz/story'
import { Link } from '@/i18n/navigation'
import { featureTitle } from '@/lib/features'
import { BigMark } from './big-mark'
import { PickerButton } from './picker-button'
import { Portrait } from './portrait'
import { ProgressLine } from './progress-line'
import { TvStage } from './tv-stage'

/** The protagonists are never spoilers. Order = left to right; `delay` staggers their rise. */
const CAST = [
  { id: 'belle', delay: 620, z: 2 },
  { id: 'wise', delay: 560, z: 1 },
  { id: 'eous', delay: 0, z: 3 },
] as const

/**
 * Cold open. A title card ("NEW / ERIDU" slams in, two hits), the CRT monitor powering on with
 * the cast stepping out of its frame, an on-screen display, and one call to action.
 *
 * Server-rendered; the entrance is CSS (`app/landing.css`) so it plays at first paint, before
 * hydration, and nothing above the fold starts invisible. Client islands: the picker buttons, the
 * returning reader's progress line and the monitor's tilt/power behaviour (`TvStage`).
 */
export function LandingHero() {
  const t = useTranslations('home')
  const tp = useTranslations('progress')
  const locale = useLocale() as Locale
  const words = t('title').split(' ')

  return (
    <section
      data-landing=""
      data-testid="landing-hero"
      className="lp-hero pt-10 pb-14 sm:pt-16 lg:flex lg:min-h-[clamp(680px,calc(100svh-4rem),960px)] lg:items-center lg:py-16 relative isolate"
    >
      <HeroBackdrop />

      <div className="gap-10 lg:grid-cols-12 lg:gap-6 grid w-full items-center">
        <div className="lp-hero-copy lg:col-span-6 relative z-10">
          <p className="gap-3 text-xs font-semibold flex items-center font-mono tracking-[0.35em] text-primary uppercase">
            <span className="w-8 h-px bg-primary" aria-hidden />
            {t('kicker')}
          </p>

          <div className="lp-nudge mt-5 relative">
            <h1
              aria-label={t('title')}
              className="font-black lg:text-[min(13vw,11.5rem)] display text-[clamp(4.5rem,28vw,11.5rem)] leading-[0.82] tracking-[-0.02em]"
            >
              {/* One word per line; the space stays in the text so the heading reads "New Eridu". */}
              {words.map((word, i) => (
                <span key={i}>
                  {i > 0 && (
                    <>
                      {' '}
                      <br />
                    </>
                  )}
                  <span
                    className="lp-word inline-block origin-bottom-left whitespace-nowrap"
                    style={{ '--i': i } as CSSProperties}
                  >
                    {word}
                  </span>
                </span>
              ))}
            </h1>
            <ImpactCopy words={words} className="-translate-x-[3px] text-info" />
            <ImpactCopy words={words} className="translate-x-[3px] text-accent" />
          </div>

          <p className="mt-7 text-lg leading-relaxed sm:text-[1.3rem] sm:leading-[1.55] max-w-[34rem] text-muted">
            {t.rich('lede', {
              b: (chunks) => <span className="font-medium text-foreground">{chunks}</span>,
            })}
          </p>

          {/* Both sets of actions ship in the HTML; `data-progress` (boot script) picks one. */}
          <div className="mt-8 sm:mt-9 gap-2 sm:gap-3 sm:flex-row sm:items-center flex flex-col in-data-[progress=set]:hidden">
            <PickerButton size="lg" className="lp-sheen sm:w-auto w-full">
              {t('ctaStart')}
              <ArrowRight
                className="group-hover/button:translate-x-1 transition-transform"
                aria-hidden
              />
            </PickerButton>
            <Button asChild variant="outline" size="lg" className="sm:inline-flex hidden">
              <a href="#how">
                {t('stepsTitle')}
                <ArrowDown aria-hidden />
              </a>
            </Button>
            <a
              href="#how"
              className="h-11 gap-2 font-extrabold sm:hidden tracking-wide inline-flex items-center justify-center font-display text-muted uppercase italic hover:text-foreground"
            >
              {t('stepsTitle')}
              <ArrowDown className="size-4" aria-hidden />
            </a>
          </div>
          <div className="mt-8 sm:mt-9 gap-2 sm:gap-3 sm:flex-row sm:items-center hidden flex-col in-data-[progress=set]:flex">
            <Button asChild size="lg" className="lp-sheen sm:w-auto w-full">
              <Link href="/recap">
                {t('ctaRecap')}
                <ArrowRight
                  className="group-hover/button:translate-x-1 transition-transform"
                  aria-hidden
                />
              </Link>
            </Button>
            <PickerButton variant="outline" size="lg" className="sm:w-auto w-full">
              {tp('change')}
            </PickerButton>
          </div>
        </div>

        <div className="max-lg:overflow-x-clip lp-hero-tv lg:col-span-6 lg:-mr-[4vw] xl:-mr-12 relative [perspective:1600px]">
          <TvStage>
            <div className="lp-tilt">
              <Monitor locale={locale} />
            </div>
          </TvStage>
        </div>
      </div>
    </section>
  )
}

/** Cyan/orange copies of the title, shown for one 90 ms "impact" frame (CSS). Decoration. */
function ImpactCopy({ words, className }: { words: string[]; className: string }) {
  return (
    <p
      aria-hidden
      className={cn(
        'lp-impact inset-0 font-black lg:text-[min(13vw,11.5rem)] pointer-events-none absolute -z-10 display text-[clamp(4.5rem,28vw,11.5rem)] leading-[0.82] tracking-[-0.02em]',
        className,
      )}
    >
      {words.map((word, i) => (
        <span key={i} className="block whitespace-nowrap">
          {word}
        </span>
      ))}
    </p>
  )
}

/**
 * The CRT monitor as an object: a static bezel (painted at once), a screen that powers on, and
 * the cast on a layer above the glass, clipped only at the bottom so their heads rise over the
 * top bezel.
 */
function Monitor({ locale }: { locale: Locale }) {
  const t = useTranslations('home')
  return (
    <div className="relative">
      <div
        aria-hidden
        className="inset-x-0 -bottom-20 h-48 lg:-inset-x-10 pointer-events-none absolute -z-10 bg-[radial-gradient(closest-side,#c6ff2e2e,transparent)]"
      />

      <div className="p-2 sm:p-2.5 relative bg-surface-2 shadow-[0_40px_80px_-20px_rgb(0_0_0/0.85)] chamfer">
        <div
          aria-hidden
          className="inset-x-0 top-0 bg-white/10 pointer-events-none absolute h-px"
        />
        <div className="relative aspect-[4/3] overflow-hidden bg-[#050506] chamfer-sm">
          <div className="lp-screen inset-0 absolute">
            <div className="inset-0 absolute bg-[radial-gradient(120%_90%_at_50%_100%,#c6ff2e3d,transparent_60%)]" />
            <div className="inset-0 absolute halftone text-primary opacity-15" />
            <div className="lp-scan-drift motion-ambient inset-0 absolute scanlines" />
            <div className="inset-0 absolute bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.6))]" />
            <div className="lp-glare inset-0 absolute" />
          </div>
          <span
            aria-hidden
            className="lp-afterglow size-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_24px_6px_#c6ff2e]"
          />
        </div>

        <div className="mt-2 gap-3 px-1 flex items-center">
          <span
            aria-hidden
            className="lp-led size-2 rounded-full bg-primary shadow-[0_0_8px_#c6ff2e]"
          />
          <span className="font-mono text-[0.6rem] tracking-[0.3em] text-subtle uppercase">
            Random Play
          </span>
          <span className="gap-2 px-2 py-1 lg:flex ml-auto hidden items-center bg-background font-mono text-[0.6rem] tracking-[0.2em] text-muted uppercase ring-1 ring-border-strong">
            {featureTitle('spoiler-gating', locale)}
            <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            {t('on')}
          </span>
        </div>
      </div>

      {/* The cast: over the glass (same box), free above it, clipped at its bottom edge. */}
      <div className="lp-cast-layer top-2 inset-x-2 sm:top-2.5 sm:inset-x-2.5 pointer-events-none absolute aspect-[4/3] [clip-path:inset(-40%_-30%_0_-30%)]">
        <div className="inset-0 absolute flex items-end justify-center">
          {CAST.map(({ id, delay, z }) => {
            const c = charactersById.get(id)
            if (!c?.image) return null
            const eous = id === 'eous'
            return (
              <div
                key={id}
                className={cn(
                  'relative -mx-[3%]',
                  eous
                    ? 'lp-eous h-[40%] w-[30%] origin-bottom'
                    : 'lp-rise-cast h-[112%] w-[40%] -translate-y-[11%]',
                )}
                style={{ zIndex: z, '--d': `${delay}ms` } as CSSProperties}
              >
                <Portrait
                  src={c.image}
                  name={c.name[locale]}
                  color={c.color}
                  alt={c.name[locale]}
                  focus={c.focus}
                  framing={eous ? 'full' : 'bust'}
                  priority={!eous}
                  sizes="(min-width: 1024px) 20vw, 40vw"
                  className="drop-shadow-[0_14px_30px_rgba(0,0,0,0.6)]"
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* On-screen display, above the cast. It powers on and off with the screen. */}
      <div className="lp-osd top-2 inset-x-2 sm:top-2.5 sm:inset-x-2.5 pointer-events-none absolute aspect-[4/3]">
        <div className="lp-bug top-3 left-3 gap-2 px-2 py-1 font-bold absolute flex items-center bg-background/85 font-mono text-[0.62rem] tracking-[0.2em] text-foreground uppercase">
          <span
            aria-hidden
            className="motion-ambient size-2 animate-[blink_1.4s_steps(2,start)_infinite] bg-danger"
          />
          {t('channel')}
        </div>

        <div className="right-4 bottom-4 left-4 sm:right-auto absolute flex items-stretch">
          <span aria-hidden className="lp-third-bar w-1 shrink-0 origin-left bg-primary" />
          <div className="lp-third-text px-3 py-2 min-w-0 sm:text-[0.68rem] bg-background/90 font-mono text-[0.62rem] tracking-[0.16em] uppercase">
            <p className="truncate in-data-[progress=set]:hidden">
              <span className="text-primary">{t('nowShowing')}</span>
              <span className="mx-2 text-subtle" aria-hidden>
                ·
              </span>
              <span className="text-foreground">
                {t('coverageShort', { version: coverage.gameVersion })}
              </span>
            </p>
            <ProgressLine className="hidden in-data-[progress=set]:block" />
          </div>
        </div>

        <div aria-hidden className="lp-flash inset-0 absolute bg-[#f4ffd6] opacity-0" />
      </div>
    </div>
  )
}

/** Full-bleed stage: one key light (lime under the monitor, a faint orange rim), the giant
 * outlined mark, halftone falling off from the monitor, and a static grain. */
function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="inset-y-0 pointer-events-none absolute left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden"
    >
      <div className="inset-0 absolute bg-[radial-gradient(45%_42%_at_74%_62%,#c6ff2e1c,transparent_70%),radial-gradient(35%_35%_at_6%_96%,#ff5a1f12,transparent_70%)]" />
      <div className="lp-hero-mark absolute -top-[3%] -right-[5%]">
        <BigMark className="text-[clamp(14rem,40vw,38rem)] text-primary/[0.06]" />
      </div>
      <div className="right-0 bottom-0 absolute h-3/4 w-3/4 halftone-lg [mask-image:radial-gradient(closest-side_at_62%_58%,black,transparent)] text-primary opacity-[0.07]" />
      <div className="lp-noise inset-0 absolute opacity-[0.03]" />
    </div>
  )
}
