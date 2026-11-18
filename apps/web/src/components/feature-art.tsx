import type { CSSProperties, ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, CloudCheck, HardDrive, Lock, Search, UserRound } from 'lucide-react'
import { cn } from '@zzz/ui'
import type { Locale } from '@zzz/core'
import { charactersById, glossaryById, timeline } from '@zzz/story'
import { Portrait } from './portrait'

/*
 * Illustrations for the Act 2 bento tiles. Product shots built from the app's own tokens, never
 * story text (placeholder "greeking" bars and the protagonists' names only).
 *
 * Each one is drawn in its final frame. Inside an armed tile (see `app/landing.css`) the `lp-*`
 * classes play once when the tile arrives; nothing loops. All are decoration: `aria-hidden`.
 */

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

/** A line of placeholder "text". */
function Greek({ w, className }: { w: number; className?: string }) {
  return (
    <span
      className={cn('block h-[0.5em] shrink-0 rounded-[1px] bg-muted/25', className)}
      style={{ width: `${w}%` }}
    />
  )
}

function Frame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden className={cn('inset-0 absolute grid place-items-center', className)}>
      {children}
    </div>
  )
}

/** Tap-to-explain: a recap paragraph, a tap on "Belle", her intel card pops. */
export function IntelArt() {
  const te = useTranslations('entity')
  const t = useTranslations('home')
  const locale = useLocale() as Locale
  const belle = charactersById.get('belle')
  const wise = charactersById.get('wise')
  if (!belle || !wise) return null
  const prologue = timeline.chapters[0]?.label[locale] ?? ''
  return (
    <Frame className="p-6 sm:p-10">
      <div className="max-w-md relative w-full">
        <div className="p-5 bg-surface-2 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)] ring-1 ring-border chamfer-sm">
          <p className="font-mono text-[0.6rem] tracking-[0.2em] text-subtle uppercase">
            {t('mockPart', { n: '01' })} · {prologue}
          </p>
          <div className="mt-4 space-y-2.5 leading-tight text-[0.95rem]">
            <p className="gap-1.5 flex items-center">
              <Greek w={34} />
              <Greek w={22} />
              <Greek w={30} />
            </p>
            <p className="gap-1.5 flex items-center">
              <Greek w={18} />
              <span className="relative shrink-0 text-foreground underline decoration-info decoration-dotted decoration-2 underline-offset-4">
                {belle.name[locale]}
                <span
                  className="lp-ripple size-10 -mt-5 -ml-5 absolute top-1/2 left-1/2 rounded-full border-2 border-info bg-info/20 opacity-0"
                  style={d(250)}
                />
              </span>
              <Greek w={28} />
              <Greek w={16} />
            </p>
            <p className="gap-1.5 flex items-center">
              <Greek w={42} />
              <span className="shrink-0 text-foreground underline decoration-subtle decoration-dotted decoration-2 underline-offset-4">
                {wise.name[locale]}
              </span>
              <Greek w={24} />
            </p>
            <p className="gap-1.5 flex items-center">
              <Greek w={56} />
            </p>
          </div>
        </div>

        <div
          className="lp-pop sm:-top-[58%] left-3 absolute -top-[62%] w-[19rem] max-w-[88%] origin-bottom-left bg-info p-px shadow-[0_24px_48px_-12px_rgb(0_0_0/0.95)] chamfer-sm"
          style={d(520)}
        >
          <div className="gap-3 p-3 flex bg-surface-2 chamfer-sm">
            <span
              className="size-16 relative shrink-0 overflow-hidden chamfer-sm"
              style={{
                backgroundColor: `${belle.color}26`,
                boxShadow: `inset 0 -3px 0 ${belle.color}`,
              }}
            >
              <Portrait
                src={belle.image}
                name={belle.name[locale]}
                color={belle.color}
                focus={belle.focus}
                framing="face"
                sizes="64px"
                monogram="sm"
              />
            </span>
            <div className="min-w-0 flex-1">
              <p className="gap-1 flex items-center font-mono text-[0.58rem] tracking-[0.2em] text-info uppercase">
                <UserRound className="size-3" />
                {te('character')}
              </p>
              <p className="mt-0.5 text-2xl display leading-none">{belle.name[locale]}</p>
              <span className="mt-2 block">
                <Greek w={90} />
              </span>
              <span className="mt-1.5 block">
                <Greek w={64} />
              </span>
              <p className="mt-2 px-1.5 py-0.5 inline-block -rotate-2 border border-primary font-mono text-[0.52rem] tracking-[0.18em] text-primary uppercase">
                {te('asOf', { part: prologue })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Frame>
  )
}

/** Character files: dealt from a stack and fanned; the third file is still locked. */
export function FilesArt() {
  const tc = useTranslations('characterFile')
  const locale = useLocale() as Locale
  const cards = [
    { id: 'belle', x: '-70%', r: '-10deg', from: '0%', z: 2, delay: 120 },
    { id: null, x: '0%', r: '0deg', from: '0%', z: 1, delay: 0 },
    { id: 'wise', x: '70%', r: '10deg', from: '0%', z: 3, delay: 200 },
  ] as const
  return (
    <Frame className="pt-10 pb-4 px-6 sm:pt-12">
      <div className="relative aspect-[3/4] w-[36%] max-w-[13rem]">
        {cards.map((card, i) => {
          const c = card.id ? charactersById.get(card.id) : undefined
          return (
            <div
              key={i}
              className="lp-deal inset-0 absolute [transform:translateX(var(--x))_rotate(var(--r))] transition-transform duration-500 ease-(--ease-out-expo) group-hover:[transform:translateX(calc(var(--x)*1.12))_rotate(calc(var(--r)*1.45))]"
              style={
                { '--x': card.x, '--r': card.r, zIndex: card.z, ...d(card.delay) } as CSSProperties
              }
            >
              {c ? (
                <div
                  className="inset-0 ring-white/10 absolute overflow-hidden shadow-[0_24px_40px_-16px_rgb(0_0_0/0.9)] ring-1 chamfer"
                  style={{ background: `linear-gradient(160deg, ${c.color}55, #111114 70%)` }}
                >
                  <div
                    className="inset-0 absolute halftone opacity-20"
                    style={{ color: c.color }}
                  />
                  <Portrait
                    src={c.image}
                    name={c.name[locale]}
                    color={c.color}
                    focus={c.focus}
                    framing="bust"
                    sizes="(min-width: 1024px) 14vw, 40vw"
                  />
                  <div className="inset-x-0 bottom-0 px-3 py-2 absolute bg-background/90">
                    <p className="font-mono text-[0.55rem] tracking-[0.2em] text-subtle uppercase">
                      {tc('kicker')}
                    </p>
                    <p className="text-lg display leading-none">{c.name[locale]}</p>
                  </div>
                </div>
              ) : (
                <div className="inset-0 gap-2 absolute grid place-content-center justify-items-center border-2 border-dashed border-accent/60 bg-background chamfer">
                  <span className="text-6xl display text-subtle">?</span>
                  <Lock className="size-4 text-subtle" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </Frame>
  )
}

/** Glossary search: "Hol|" is typed, the unlocked term answers, a later one stays redacted. */
export function GlossaryArt() {
  const te = useTranslations('entity')
  const tm = useTranslations('home')
  const locale = useLocale() as Locale
  const hollow = glossaryById.get('hollow')
  if (!hollow) return null
  const term = hollow.term[locale].replace(/\s*\(.*\)$/, '')
  const typed = term.slice(0, 3)
  return (
    <Frame className="px-6">
      <div className="max-w-xs w-full">
        <div className="h-10 gap-2 px-3 flex items-center bg-surface-2 ring-1 ring-border-strong">
          <Search className="size-4 text-subtle" />
          <span
            className="lp-type text-sm whitespace-nowrap text-foreground"
            style={{ '--n': typed.length } as CSSProperties}
          >
            {typed}
          </span>
          <span className="h-4 w-px bg-primary" />
        </div>
        <div className="mt-2 lp-rise" style={d(650)}>
          <div className="gap-3 px-3 py-2.5 flex items-center bg-surface-2">
            <span className="text-lg display leading-none">{term}</span>
            <span className="ml-auto font-mono text-[0.55rem] tracking-[0.2em] text-primary uppercase">
              {te('term')}
            </span>
          </div>
          <div className="mt-1.5 h-10 px-3 relative flex items-center justify-end bg-[#050506]">
            <span className="inset-x-0 top-0 absolute h-[4px] hazard [--hazard-color:var(--color-accent)] [--hazard-size:4px]" />
            <span className="inset-x-0 bottom-0 absolute h-[4px] hazard [--hazard-color:var(--color-accent)] [--hazard-size:4px]" />
            <span className="gap-1.5 flex items-center font-mono text-[0.55rem] tracking-[0.2em] text-muted uppercase">
              <Lock className="size-3" />
              {tm('mockLocked')}
            </span>
          </div>
        </div>
      </div>
    </Frame>
  )
}

/** Official terms in both languages, as a split-flap board. */
export function LanguagesArt() {
  const hollow = glossaryById.get('hollow')
  if (!hollow) return null
  const rows = [
    { lang: 'en', label: 'EN', word: hollow.term.en },
    { lang: 'pt-BR', label: 'PT-BR', word: hollow.term['pt-BR'].replace(/\s*\(.*\)$/, '') },
  ]
  return (
    <Frame className="px-6">
      <div className="gap-2.5 max-w-xs grid w-full">
        {rows.map((row, i) => (
          <div key={row.lang} className="gap-3 flex items-center">
            <span className="w-12 shrink-0 font-mono text-[0.6rem] tracking-[0.2em] text-subtle">
              {row.label}
            </span>
            <span
              lang={row.lang}
              className={cn(
                'lp-flip px-3 py-2 text-2xl relative isolate flex-1 origin-top bg-surface-2 display leading-none ring-1 ring-border-strong',
                i === 1 && 'text-primary',
              )}
              style={d(250 + i * 220)}
            >
              {row.word}
              <span className="inset-x-0 absolute top-1/2 -z-10 h-px bg-background/80" />
            </span>
          </div>
        ))}
      </div>
    </Frame>
  )
}

/** Phone → tablet → desktop outlines, drawn on. */
export function ScreensArt() {
  const outline = 'fill-none stroke-border-strong [stroke-width:2] [stroke-dasharray:1]'
  return (
    <Frame className="px-6">
      <svg viewBox="0 0 260 120" className="max-w-xs w-full">
        <rect
          x="6"
          y="38"
          width="44"
          height="78"
          rx="6"
          pathLength={1}
          className={cn('lp-dash', outline)}
          style={d(0)}
        />
        <rect
          x="14"
          y="50"
          width="28"
          height="4"
          className="lp-fill origin-left fill-primary"
          style={d(500)}
        />
        <rect
          x="66"
          y="22"
          width="72"
          height="94"
          rx="6"
          pathLength={1}
          className={cn('lp-dash', outline)}
          style={d(150)}
        />
        <rect
          x="76"
          y="34"
          width="44"
          height="4"
          className="lp-fill origin-left fill-primary"
          style={d(650)}
        />
        <rect
          x="156"
          y="8"
          width="98"
          height="70"
          rx="4"
          pathLength={1}
          className={cn('lp-dash', outline)}
          style={d(300)}
        />
        <path
          d="M146 92 h118 l-8 10 h-102 z"
          pathLength={1}
          className={cn('lp-dash', outline)}
          style={d(420)}
        />
        <rect
          x="168"
          y="20"
          width="60"
          height="4"
          className="lp-fill origin-left fill-primary"
          style={d(800)}
        />
      </svg>
    </Frame>
  )
}

/** Private by default: nothing to count. */
export function PrivateArt() {
  const t = useTranslations('home')
  return (
    <div aria-hidden className="gap-4 flex items-end">
      <span className="lp-stamp font-black display text-[7rem] leading-[0.8] text-primary">0</span>
      <span className="pb-2 max-w-[11rem] font-mono text-[0.65rem] tracking-[0.2em] text-muted uppercase">
        {t('trackers')}
      </span>
    </div>
  )
}

/** Accounts: the roster goes from "on this device" to "saved to account". */
export function SyncArt() {
  const ts = useTranslations('sync')
  return (
    <div aria-hidden className="gap-3 flex flex-wrap items-center">
      <span className="gap-2 px-3 py-2 text-xs inline-flex items-center bg-surface-2 font-mono tracking-[0.12em] text-muted uppercase ring-1 ring-border-strong">
        <HardDrive className="size-4" />
        {ts('local')}
      </span>
      <ArrowRight className="size-4 text-subtle" />
      <span
        className="lp-stamp gap-2 px-3 py-2 text-xs inline-flex items-center bg-surface-2 font-mono tracking-[0.12em] text-primary uppercase ring-1 ring-primary/60"
        style={d(450)}
      >
        <CloudCheck className="size-4" />
        {ts('saved')}
      </span>
    </div>
  )
}
