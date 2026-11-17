'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useLocale } from 'next-intl'
import { cn } from '@zzz/ui'
import { knownTextAt, type Character, type Locale } from '@zzz/core'
import { factionsById, timeline } from '@zzz/story'
import { Link } from '@/i18n/navigation'
import { useStory } from '@/lib/use-story'
import { useMotionLevel } from './providers'
import { Portrait } from './portrait'

/**
 * "TV monitor" card: chamfered frame in the character's color, CRT scanlines,
 * a scan bar that sweeps on hover and a subtle 3D tilt that follows the pointer.
 */
export function CharacterCard({
  character,
  priority,
}: {
  character: Character
  priority?: boolean
}) {
  const locale = useLocale() as Locale
  const { progress } = useStory()
  const level = useMotionLevel()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 300, damping: 25 })
  const rotateY = useSpring(useTransform(px, [0, 1], [-9, 9]), { stiffness: 300, damping: 25 })
  const tilt = level === 'full'

  return (
    <motion.article
      className="group relative [perspective:900px]"
      onPointerMove={(e) => {
        if (!tilt || e.pointerType !== 'mouse') return
        const r = e.currentTarget.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width)
        py.set((e.clientY - r.top) / r.height)
      }}
      onPointerLeave={() => {
        px.set(0.5)
        py.set(0.5)
      }}
    >
      <motion.div
        style={tilt ? { rotateX, rotateY, transformStyle: 'preserve-3d' } : undefined}
        className="p-px chamfer"
      >
        <div
          className="inset-0 absolute opacity-70 transition-opacity chamfer group-hover:opacity-100"
          style={{ backgroundColor: character.color }}
          aria-hidden
        />
        <div className="relative overflow-hidden bg-surface chamfer">
          <div className="relative aspect-[4/5] overflow-hidden">
            <div
              className="inset-0 absolute halftone opacity-25"
              style={{ color: character.color }}
              aria-hidden
            />
            <div
              className="inset-0 absolute"
              style={{
                background: `radial-gradient(120% 80% at 50% 100%, ${character.color}55, transparent 60%)`,
              }}
              aria-hidden
            />
            <Portrait
              src={character.image}
              name={character.name[locale]}
              color={character.color}
              focus={character.focus}
              framing="bust"
              priority={priority}
              sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 46vw"
              className="transition-[scale] duration-500 ease-(--ease-out-expo) group-hover:scale-[1.06]"
            />
            <div className="inset-0 pointer-events-none absolute scanlines" aria-hidden />
            <div
              className="inset-0 pointer-events-none absolute z-10 opacity-0 shadow-[inset_0_0_0_3px_var(--color-primary)] transition-opacity group-has-[a:focus-visible]:opacity-100"
              aria-hidden
            />
            <div
              aria-hidden
              className="inset-x-0 via-white/10 pointer-events-none absolute h-1/3 -translate-y-full bg-gradient-to-b from-transparent to-transparent opacity-0 group-hover:animate-[scan_1.2s_ease-out] group-hover:opacity-100"
            />
            <span className="top-2 left-3 gap-1.5 font-bold tracking-widest text-white/80 absolute flex items-center font-mono text-[0.6rem]">
              <span className="motion-ambient size-1.5 bg-red-500 animate-[blink_1.4s_steps(2,start)_infinite]" />
              REC
            </span>
          </div>
          <div className="p-3 relative">
            <span
              className="top-0 left-3 h-0.5 w-10 absolute -translate-y-1/2"
              style={{ backgroundColor: character.color }}
              aria-hidden
            />
            <h2 className="text-2xl display leading-none">
              {/* The link's ::after covers the card, so the whole card is clickable. */}
              <Link
                href={`/characters/${character.id}`}
                className="after:inset-0 outline-none after:absolute after:content-['']"
              >
                {character.name[locale]}
              </Link>
            </h2>
            {character.factions.length > 0 && (
              <p className="mt-1 truncate font-mono text-[0.62rem] tracking-[0.14em] text-subtle uppercase">
                {character.factions.map((id) => factionsById.get(id)?.name[locale]).join(' / ')}
              </p>
            )}
            <p className={cn('mt-2 text-sm leading-snug text-muted')}>
              {knownTextAt(timeline, progress, character.blurb, character.revisions)[locale]}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}

/** Placeholder for a character the reader hasn't met yet. Reveals nothing. */
export function LockedCard({ label }: { label: string }) {
  return (
    <div className="bg-border p-px chamfer">
      <div className="relative grid aspect-[4/5] place-items-center overflow-hidden bg-surface chamfer">
        <div className="inset-0 absolute scanlines" aria-hidden />
        <div className="inset-0 absolute halftone text-subtle opacity-20" aria-hidden />
        <span className="text-5xl relative display text-subtle">?</span>
        <span className="bottom-3 absolute font-mono text-[0.6rem] tracking-[0.3em] text-subtle uppercase">
          {label}
        </span>
      </div>
    </div>
  )
}
