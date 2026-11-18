'use client'

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from 'react'
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionValueEvent,
  useScroll,
  type Variants,
} from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { Check, Lock, UserRound } from 'lucide-react'
import { cn, Segmented, spring, stampIn } from '@zzz/ui'
import type { Locale } from '@zzz/core'
import { charactersById, coverage, timeline } from '@zzz/story'
import { features } from '@/lib/features'
import {
  SHIELD_FINAL,
  sameScene,
  sceneAt,
  sceneForStep,
  type ShieldScene,
} from '@/lib/shield-scene'
import { ActBumper } from './act-bumper'
import { Portrait } from './portrait'
import { useMotionLevel } from './providers'
import { SpecFooter } from './spec-footer'

const DESKTOP = '(min-width: 64rem)'
const subscribeDesktop = (onChange: () => void) => {
  const mql = window.matchMedia(DESKTOP)
  mql.addEventListener('change', onChange)
  return () => mql.removeEventListener('change', onChange)
}
const isDesktop = () => window.matchMedia(DESKTOP).matches

const STEPS = [
  { title: 'step1', body: 'step1Body' },
  { title: 'step2', body: 'step2Body' },
  { title: 'step3', body: 'step3Body' },
] as const

/**
 * Act 1, "the shield": how it works, shown on a product shot of the recap.
 *
 * - Desktop with full motion: the act is 240vh tall and its stage sticks; scrolling walks the
 *   mock through the three steps (marker travels, later parts get redacted, Short → Full, a name
 *   opens its intel card, character files unlock) while the step list and its rail follow.
 * - Phones/tablets (or reduced motion): the mock sticks under the header and the step captions
 *   scroll past it; the caption in view sets the scene.
 * - Motion off (and the HTML before hydration): no sticking, the final scene, all steps.
 */
export function LandingShield() {
  const t = useTranslations('home')
  const track = useRef<HTMLDivElement>(null)
  const stepsRef = useRef<HTMLOListElement>(null)
  // The server render (and the first client render) is the static final frame: no media query.
  const desktop = useSyncExternalStore(subscribeDesktop, isDesktop, () => false)
  const level = useMotionLevel()
  const pinned = desktop && level === 'full'

  // Desktop: scroll position → scene.
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
  const [scrollScene, setScrollScene] = useState<ShieldScene | null>(null)
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = sceneAt(p)
    if (pinned) setScrollScene((s) => (s && sameScene(s, next) ? s : next))
  })

  // Phones/tablets: the caption crossing the band under the sticky mock → scene.
  const [stepScene, setStepScene] = useState<ShieldScene | null>(null)
  useEffect(() => {
    if (pinned || level === 'off') return
    const items = Array.from(stepsRef.current?.children ?? [])
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const i = items.indexOf(entry.target)
          if (entry.isIntersecting) setStepScene(sceneForStep(i))
          else if (i === 0 && entry.boundingClientRect.top > (entry.rootBounds?.bottom ?? 0))
            setStepScene(sceneForStep(-1))
        }
      },
      { rootMargin: '-70% 0px -16% 0px' },
    )
    items.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pinned, level])

  const scene =
    level === 'off'
      ? SHIELD_FINAL
      : pinned
        ? (scrollScene ?? sceneAt(scrollYProgress.get()))
        : (stepScene ?? SHIELD_FINAL)

  const registry = features.filter((f) => f.act === 'shield')

  return (
    <section
      id="how"
      aria-labelledby="how-title"
      className="lp-shield pt-24 pb-24 sm:pt-32 lg:pt-40 relative isolate"
      data-testid="landing-shield"
    >
      <div
        aria-hidden
        className="inset-y-0 absolute left-1/2 -z-10 w-screen -translate-x-1/2 bg-band [clip-path:polygon(0_3vw,100%_0,100%_100%,0_100%)]"
      />
      <ActBumper act={t('act', { n: 1 })} title={t('actShield')} />

      <div ref={track} className="mt-10 lg:mt-6 lg:in-data-[motion=full]:h-[240vh]">
        <div className="lg:in-data-[motion=full]:top-16 lg:in-data-[motion=full]:sticky lg:in-data-[motion=full]:flex lg:in-data-[motion=full]:h-[calc(100svh-4rem)] lg:in-data-[motion=full]:items-center">
          <div className="lp-shield-grid gap-x-12 gap-y-8 grid w-full">
            <header className="[grid-area:head]">
              <p className="gap-3 text-xs font-semibold flex items-center font-mono tracking-[0.3em] text-primary uppercase">
                <span className="w-8 h-px bg-primary" aria-hidden />
                {t('shieldKicker')}
              </p>
              <h2
                id="how-title"
                className="mt-4 font-black lg:text-[clamp(3rem,4.6vw,4.5rem)] display text-[clamp(2.75rem,11vw,5rem)] leading-[0.88] text-balance"
              >
                {t('shieldTitle')}
              </h2>
            </header>

            <div className="lg:static lg:self-center sticky top-[76px] z-10 self-start [grid-area:mock] in-data-[motion=off]:static">
              <ShieldStage scene={scene} />
            </div>

            <div className="lg:pl-8 relative [grid-area:steps]">
              <span
                aria-hidden
                className="top-1 bottom-1 left-0 lg:block absolute hidden w-px bg-border-strong"
              >
                <motion.span
                  className="inset-0 absolute block origin-top bg-primary"
                  style={pinned ? { scaleY: scrollYProgress } : undefined}
                />
              </span>
              <ol ref={stepsRef} className="lg:space-y-7">
                {STEPS.map(({ title, body }, i) => (
                  <li
                    key={title}
                    data-active={!pinned || scene.step >= i}
                    className="group/step pt-6 lg:min-h-0 lg:pt-0 in-data-[motion=off]:min-h-0 min-h-[58svh]"
                  >
                    <div className="gap-5 flex">
                      <span className="text-5xl lg:group-data-[active=false]/step:text-subtle display text-primary tabular-nums transition-colors duration-500">
                        0{i + 1}
                      </span>
                      <div>
                        <h3 className="text-2xl sm:text-3xl lg:group-data-[active=false]/step:text-subtle display transition-colors duration-500">
                          {t(title)}
                        </h3>
                        <p className="mt-2 max-w-md leading-relaxed lg:group-data-[active=false]/step:text-subtle text-muted transition-colors duration-500">
                          {t(body)}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>

      <SpecFooter features={registry} className="mt-16 lg:mt-24">
        <p className="mt-6 text-xs font-mono text-subtle">
          {t('coverage', { version: coverage.gameVersion })}
        </p>
      </SpecFooter>
    </section>
  )
}

/** Design size of the product shot; it is scaled to fit (a screenshot, never reflowed). */
const MOCK_WIDTH = 480

/** Scales the mock to its column (and, under the sticky header on phones, to ~56% of the screen). */
function ShieldStage({ scene }: { scene: ShieldScene }) {
  const box = useRef<HTMLDivElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState<{ s: number; h: number; x: number } | null>(null)

  useLayoutEffect(() => {
    const el = box.current
    const mock = inner.current
    if (!el || !mock) return
    const measure = () => {
      const desktop = window.innerWidth >= 1024
      const maxH = desktop ? window.innerHeight - 140 : window.innerHeight * 0.56
      const s = Math.min(el.clientWidth / MOCK_WIDTH, maxH / mock.offsetHeight, 1.45)
      setFit({ s, h: mock.offsetHeight * s, x: (el.clientWidth - MOCK_WIDTH * s) / 2 })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  return (
    <div ref={box} className="lp-rotate-in relative overflow-x-clip" style={{ height: fit?.h }}>
      <div
        aria-hidden
        className="-inset-x-10 -bottom-16 h-40 pointer-events-none absolute -z-10 bg-[radial-gradient(closest-side,#c6ff2e1f,transparent)]"
      />
      <div
        ref={inner}
        className={cn('mx-auto origin-top', !fit && 'max-w-full')}
        style={{
          width: MOCK_WIDTH,
          transform: fit ? `scale(${fit.s})` : undefined,
          marginLeft: fit?.x,
          transformOrigin: 'top left',
        }}
      >
        <ShieldMock {...scene} />
      </div>
    </div>
  )
}

const ROW_COPY = [
  { before: 30, name: 'belle', after: 34 },
  { before: 46, name: 'wise', after: 22 },
  { before: 18, name: 'eous', after: 48 },
  { before: 58, name: null, after: 0 },
  { before: 26, name: 'wise', after: 40 },
  { before: 52, name: null, after: 0 },
] as const

/**
 * The recap screen as a product shot. Inert: hidden from assistive tech and not focusable; the
 * step list carries the meaning. Unlocked lines are "greeking" bars broken by the protagonists'
 * underlined names (never story text); locked parts use the redaction style.
 */
export function ShieldMock({ step, here, shield, full, intel, files }: ShieldScene) {
  const t = useTranslations('home')
  const tr = useTranslations('recap')
  const tn = useTranslations('nav')
  const te = useTranslations('entity')
  const locale = useLocale() as Locale
  const group = useId()
  const prologue = timeline.chapters[0]?.label[locale] ?? ''

  return (
    <div
      inert
      aria-hidden
      data-testid="shield-mock"
      data-step={step}
      className="relative bg-surface shadow-[0_40px_80px_-20px_rgb(0_0_0/0.8)] ring-1 ring-border-strong chamfer"
    >
      <div className="inset-x-0 top-0 bg-white/10 absolute h-px" />
      <div className="inset-0 pointer-events-none absolute bg-[linear-gradient(to_bottom,rgb(255_255_255/0.035),transparent_30%)]" />

      <div className="p-5 relative">
        <div className="gap-3 flex items-center justify-between">
          <div>
            <p className="font-mono text-[0.62rem] tracking-[0.25em] text-primary uppercase">
              {tr('kicker')}
            </p>
            <p className="mt-1 text-xl display">{tr('title')}</p>
          </div>
          <div className="relative">
            <Segmented
              label={tr('mode')}
              layoutId={`${group}-mode`}
              value={full ? 'full' : 'tldr'}
              onValueChange={() => {}}
              options={[
                { value: 'tldr', label: tr('tldr') },
                { value: 'full', label: tr('full') },
              ]}
            />
            <Ripple show={full && step === 1} className="right-6 top-1/2" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between font-mono text-[0.6rem] tracking-[0.2em] text-subtle uppercase">
          <span>{t('coverageShort', { version: coverage.gameVersion })}</span>
          <span className="text-foreground tabular-nums">
            {String(here + 1).padStart(2, '0')} / {String(ROW_COPY.length).padStart(2, '0')}
          </span>
        </div>

        <LayoutGroup id={group}>
          <ol className="mt-3 space-y-1.5 relative">
            {ROW_COPY.map((row, i) => (
              <MockPart
                key={i}
                index={i}
                row={row}
                state={i < here ? 'done' : i === here ? 'here' : 'ahead'}
                locked={shield && i > here}
                full={full}
                intel={intel && i === 0}
                labels={{
                  part: t('mockPart', { n: String(i + 1).padStart(2, '0') }),
                  here: t('mockHere'),
                  locked: t('mockLocked'),
                  character: te('character'),
                  asOf: te('asOf', { part: prologue }),
                }}
                locale={locale}
              />
            ))}
            <AnimatePresence>
              {shield && (
                <motion.span
                  key="stamp"
                  variants={stampIn}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0 }}
                  className="px-2 py-1 font-bold absolute left-[42%] z-20 rotate-[-6deg] border-2 border-accent bg-background font-mono text-[0.62rem] tracking-[0.22em] text-accent uppercase"
                  style={{ top: `calc(${((here + 1) / ROW_COPY.length) * 100}% - 0.9rem)` }}
                >
                  {t('shieldOn')}
                </motion.span>
              )}
            </AnimatePresence>
          </ol>
        </LayoutGroup>

        <div className="mt-4 gap-2.5 pt-4 flex items-center border-t border-border">
          <span className="mr-auto font-mono text-[0.6rem] tracking-[0.25em] text-subtle uppercase">
            {tn('characters')}
          </span>
          {(['belle', 'wise'] as const).map((id, i) => {
            const c = charactersById.get(id)
            if (!c) return null
            return (
              <span key={id} className="size-11 relative overflow-hidden bg-surface-3 chamfer-sm">
                <AnimatePresence initial={false}>
                  {files ? (
                    <motion.span
                      key="on"
                      variants={stampIn}
                      initial="hidden"
                      animate="show"
                      transition={{ ...spring.snappy, delay: i * 0.08 }}
                      className="inset-0 absolute"
                      style={{ backgroundColor: `${c.color}33` }}
                    >
                      <Portrait
                        src={c.image}
                        name={c.name[locale]}
                        color={c.color}
                        focus={c.focus}
                        framing="face"
                        sizes="44px"
                        monogram="sm"
                      />
                    </motion.span>
                  ) : (
                    <span
                      key="off"
                      className="inset-0 text-xl absolute grid place-items-center display text-subtle"
                    >
                      ?
                    </span>
                  )}
                </AnimatePresence>
              </span>
            )
          })}
          {[0, 1].map((i) => (
            <span
              key={i}
              className="size-11 text-xl grid place-items-center border-2 border-dashed border-accent/50 bg-background display text-subtle"
            >
              ?
            </span>
          ))}
        </div>
      </div>
      <div className="inset-0 pointer-events-none absolute scanlines opacity-60" />
    </div>
  )
}

const redact: Variants = {
  hidden: { scaleX: 0.2, opacity: 0 },
  show: (i: number) => ({
    scaleX: 1,
    opacity: 1,
    transition: { ...spring.snappy, delay: i * 0.07 },
  }),
}

function MockPart({
  index,
  row,
  state,
  locked,
  full,
  intel,
  labels,
  locale,
}: {
  index: number
  row: (typeof ROW_COPY)[number]
  state: 'done' | 'here' | 'ahead'
  locked: boolean
  full: boolean
  intel: boolean
  labels: { part: string; here: string; locked: string; character: string; asOf: string }
  locale: Locale
}) {
  const name = row.name ? charactersById.get(row.name) : undefined
  return (
    <li className={cn('px-3 py-2.5 relative', state === 'here' ? 'bg-surface-3' : 'bg-surface-2')}>
      {state === 'here' && (
        <motion.span
          layoutId="here"
          className="inset-0 absolute ring-1 ring-primary ring-inset"
          transition={spring.snappy}
        >
          <span className="inset-y-0 left-0 w-1 absolute bg-primary" />
        </motion.span>
      )}
      <div className="gap-3 relative flex items-start">
        <span
          className={cn(
            'w-16 pt-0.5 shrink-0 font-mono text-[0.6rem] tracking-[0.18em] uppercase',
            state === 'here' ? 'text-primary' : 'text-subtle',
          )}
        >
          {labels.part}
        </span>
        <div className="min-w-0 flex-1 text-[0.82rem] leading-[1.15rem]">
          <p className="gap-1.5 flex items-center">
            <Greek width={row.before} />
            {name && (
              <span className="relative shrink-0 text-foreground underline decoration-subtle decoration-dotted decoration-2 underline-offset-4">
                {name.name[locale]}
                {intel && <Ripple show className="top-1/2 left-1/2" />}
              </span>
            )}
            {row.after > 0 && <Greek width={row.after} />}
          </p>
          <motion.div
            initial={false}
            animate={{ height: full ? 'auto' : 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pt-2 gap-1.5 flex">
              <Greek width={44} />
              <Greek width={36} />
            </p>
          </motion.div>
        </div>
        {state === 'done' && <Check className="mt-0.5 size-3.5 shrink-0 text-primary" />}
        {state === 'here' && (
          <span className="px-1.5 py-0.5 font-bold shrink-0 bg-primary font-mono text-[0.55rem] tracking-[0.15em] text-primary-foreground uppercase">
            {labels.here}
          </span>
        )}
      </div>

      <AnimatePresence>
        {locked && (
          <motion.div
            key="redacted"
            custom={index}
            variants={redact}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="inset-0 absolute z-10 flex origin-left items-center justify-end bg-[#050506]"
          >
            <span className="inset-x-0 top-0 absolute h-[5px] hazard [--hazard-color:var(--color-accent)] [--hazard-size:5px]" />
            <span className="inset-x-0 bottom-0 absolute h-[5px] hazard [--hazard-color:var(--color-accent)] [--hazard-size:5px]" />
            <span className="mr-3 gap-1.5 flex items-center font-mono text-[0.58rem] tracking-[0.2em] text-muted uppercase">
              <Lock className="size-3" />
              {labels.locked}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {intel && name && (
          <motion.div
            key="intel"
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.2, 0.9, 0.1, 1], delay: 0.18 }}
            className="left-16 w-64 absolute bottom-[calc(100%-0.25rem)] z-30 origin-bottom-left bg-info p-px shadow-[0_20px_40px_-12px_rgb(0_0_0/0.9)] chamfer-sm"
          >
            <div className="gap-3 p-3 flex bg-surface-2 chamfer-sm">
              <span
                className="size-14 relative shrink-0 overflow-hidden chamfer-sm"
                style={{
                  backgroundColor: `${name.color}26`,
                  boxShadow: `inset 0 -3px 0 ${name.color}`,
                }}
              >
                <Portrait
                  src={name.image}
                  name={name.name[locale]}
                  color={name.color}
                  focus={name.focus}
                  framing="face"
                  sizes="56px"
                  monogram="sm"
                />
              </span>
              <div className="min-w-0">
                <p className="gap-1 flex items-center font-mono text-[0.55rem] tracking-[0.2em] text-info uppercase">
                  <UserRound className="size-3" />
                  {labels.character}
                </p>
                <p className="mt-0.5 text-xl display leading-none">{name.name[locale]}</p>
                <p className="mt-2 gap-1 flex">
                  <Greek width={70} />
                </p>
                <p className="mt-1.5 px-1.5 py-0.5 inline-block -rotate-2 border border-primary font-mono text-[0.5rem] tracking-[0.18em] text-primary uppercase">
                  {labels.asOf}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

/** A line of placeholder "text": a muted bar, never real story words. */
function Greek({ width }: { width: number }) {
  return (
    <span
      className="block h-[0.45em] shrink rounded-[1px] bg-muted/25"
      style={{ width: `${width}%` } as CSSProperties}
    />
  )
}

/** One tap ring on what the scene is demonstrating. */
function Ripple({ show, className }: { show: boolean; className?: string }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.span
          key="ripple"
          className={cn(
            'size-9 pointer-events-none absolute z-40 -mt-[1.125rem] -ml-[1.125rem] rounded-full border-2 border-primary bg-primary/20',
            className,
          )}
          initial={{ scale: 0.2, opacity: 0.9 }}
          animate={{ scale: 2.2, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      )}
    </AnimatePresence>
  )
}
