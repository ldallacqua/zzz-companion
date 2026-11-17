'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { Badge, cn, ease, pullBack, wipeIn } from '@zzz/ui'
import type { Character, Locale } from '@zzz/core'
import { Portrait, resized } from './portrait'
import { useMotionLevel } from './providers'

/** Poster height per breakpoint: a phone "cover", then a sticky column from md. */
const FRAME =
  'h-[min(56svh,30rem)] md:h-auto md:aspect-[4/7] lg:aspect-auto lg:h-[min(calc(100dvh-11.5rem),48rem)]'

/**
 * The full-body art of a character file, staged like a video-store rental sleeve: a chamfered frame
 * in the character's colour, a colour slab, a giant outlined name, halftone, a hazard "floor" and
 * CRT scanlines. Mixed art quality is handled by `character.art`:
 * - `cutout`: transparent full body, feet on the floor, sticker edge
 * - `bust`: transparent head-and-shoulders or mascot, rising out of the floor
 * - `scene`: an opaque still, shown as a taped-on screen grab (never outlined)
 * Missing or broken art falls back to big outlined initials in the same box (no layout shift).
 *
 * Decorative: the page's h1 names the character, so the whole poster is hidden from assistive tech.
 */
export function CharacterPoster({
  character,
  firstSeen,
}: {
  character: Character
  /** Chapter label of the part where the reader met them, e.g. "Ch. 1A". */
  firstSeen: string
}) {
  const t = useTranslations('characterFile')
  const locale = useLocale() as Locale
  const name = character.name[locale]
  const color = character.color
  const [ready, setReady] = useState(false)
  // Clip-path wipes and the scale pull-back are motion; reduced/off start in their final state.
  const animate = useMotionLevel() === 'full'

  // A slow CDN must not leave the figure waiting: start the pull-back after 600ms regardless.
  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 600)
    return () => window.clearTimeout(timer)
  }, [])

  const vars = {
    '--sticker-shadow': `color-mix(in oklab, ${color} 70%, black)`,
    '--hazard-color': color,
    '--hazard-size': '10px',
  } as CSSProperties

  return (
    <div className="@container relative" style={vars} aria-hidden data-testid="character-poster">
      <div className="p-px chamfer-lg" style={{ backgroundColor: color }}>
        <div className={cn('relative overflow-hidden bg-surface chamfer-lg', FRAME)}>
          <motion.div
            className="inset-0 absolute"
            variants={wipeIn}
            initial={animate ? 'hidden' : false}
            animate="show"
          >
            <div
              className="size-full [clip-path:polygon(0_38%,100%_12%,100%_70%,0_96%)]"
              style={{ backgroundColor: `${color}4d` }}
            />
          </motion.div>
          <div
            className="inset-0 absolute"
            style={{
              background: `radial-gradient(110% 60% at 50% 100%, ${color}73, transparent 65%)`,
            }}
          />
          <motion.div
            className="absolute -inset-x-[4%] top-[6%] display text-[clamp(4rem,30cqi,10rem)] leading-[0.82] whitespace-nowrap text-outline opacity-55"
            style={{ color }}
            initial={{ x: -40, skewX: -8 }}
            animate={{ x: 0, skewX: 0 }}
            transition={{ duration: 0.7, ease: ease.outExpo }}
          >
            {name.split(' ').map((word) => (
              <div key={word}>{word}</div>
            ))}
          </motion.div>
          <div
            className="inset-0 absolute halftone-lg [mask-image:linear-gradient(to_top,#000_10%,transparent_75%)] opacity-35"
            style={{ color }}
          />

          <motion.div
            className={cn(
              'absolute',
              character.art === 'cutout' && 'inset-x-[4%] top-[4%] bottom-[5%]',
              character.art === 'bust' && 'inset-x-[4%] bottom-[5%] h-[72%]',
              character.art === 'scene' && 'inset-x-[9%] top-[12%] bottom-[14%]',
            )}
            style={{
              transformOrigin: `${character.focus.x * 100}% ${Math.min(character.focus.y, 0.4) * 100}%`,
            }}
            variants={pullBack}
            initial={animate ? 'hidden' : false}
            animate={!animate || ready ? 'show' : 'hidden'}
          >
            {character.art === 'scene' && character.image ? (
              <SceneArt
                src={character.image}
                name={name}
                color={color}
                noPhoto={t('noPhoto')}
                onSettled={() => setReady(true)}
              />
            ) : (
              <Portrait
                src={character.image}
                name={name}
                color={color}
                focus={character.focus}
                framing="full"
                priority
                sizes="(min-width: 1024px) 430px, (min-width: 768px) 40vw, 92vw"
                className="sticker"
                monogram="xl"
                fallback={<NoPhoto label={t('noPhoto')} />}
                onSettled={() => setReady(true)}
              />
            )}
          </motion.div>

          <div className="inset-x-0 bottom-0 absolute h-[5%] hazard" />
          <div className="inset-0 pointer-events-none absolute scanlines" />
          <div className="inset-x-0 via-white/10 pointer-events-none absolute h-1/3 -translate-y-full animate-[scan_1.1s_ease-out_1] bg-gradient-to-b from-transparent to-transparent in-data-[motion=off]:hidden in-data-[motion=reduced]:hidden" />

          <span className="top-3 left-4 gap-1.5 px-1.5 py-0.5 font-bold tracking-widest absolute flex items-center bg-background/80 font-mono text-[0.6rem] text-foreground/80">
            <span className="motion-ambient size-1.5 bg-red-500 animate-[blink_1.4s_steps(2,start)_infinite]" />
            REC
          </span>
          <span className="top-3 right-4 px-1.5 py-0.5 absolute bg-background font-mono text-[0.6rem] tracking-[0.18em] text-muted uppercase @max-[16rem]:hidden">
            {firstSeen}
          </span>
        </div>
      </div>
      <div
        className="inset-y-6 -right-7 w-7 lg:flex absolute hidden items-center justify-center"
        style={{ backgroundColor: color }}
      >
        <span className="font-bold rotate-180 font-mono text-[0.62rem] tracking-[0.3em] text-primary-foreground uppercase [writing-mode:vertical-rl]">
          {name} · {t('kicker')}
        </span>
      </div>
    </div>
  )
}

/** An opaque still, shown as a screen grab taped to the sleeve. */
function SceneArt({
  src,
  name,
  color,
  noPhoto,
  onSettled,
}: {
  src: string
  name: string
  color: string
  noPhoto: string
  onSettled: () => void
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <Portrait
        name={name}
        color={color}
        framing="full"
        sizes="1px"
        monogram="xl"
        fallback={<NoPhoto label={noPhoto} />}
      />
    )
  }
  return (
    <div className="inset-0 absolute grid place-items-center">
      <div className="relative max-h-full max-w-full -rotate-[2.5deg]">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized by the wiki CDN */}
        <img
          src={resized(src, 640)}
          alt=""
          loading="eager"
          decoding="async"
          draggable={false}
          onLoad={onSettled}
          onError={() => {
            setFailed(true)
            onSettled()
          }}
          className="md:max-h-[34rem] block h-auto max-h-[min(56svh,30rem)] w-auto max-w-full border-[5px] border-foreground shadow-[10px_10px_0_var(--sticker-shadow)] select-none"
        />
        <span className="-top-3 h-6 w-21 absolute left-1/2 -translate-x-1/2 rotate-3 bg-warning/80" />
      </div>
    </div>
  )
}

function NoPhoto({ label }: { label: string }) {
  return (
    <Badge variant="outline" className="absolute bottom-[12%] -rotate-6 bg-background">
      {label}
    </Badge>
  )
}

/** Same frame, nothing about the character: no colour, name, art or chapter. */
export function LockedPoster({ label }: { label: string }) {
  return (
    <div className="bg-border p-px chamfer-lg" aria-hidden>
      <div className="h-44 md:h-auto md:aspect-[4/7] relative grid place-items-center overflow-hidden bg-surface chamfer-lg">
        <div className="inset-0 absolute scanlines" />
        <div className="inset-0 absolute halftone text-subtle opacity-20" />
        <span className="text-8xl relative display text-subtle">?</span>
        <div className="h-8 absolute inset-x-[-10%] top-1/2 grid -translate-y-1/2 -rotate-12 place-items-center hazard">
          <Badge variant="primary" className="text-sm">
            {label}
          </Badge>
        </div>
      </div>
    </div>
  )
}
