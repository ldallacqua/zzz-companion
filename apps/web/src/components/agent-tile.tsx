'use client'

import { useId, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { Check, ChevronDown, X } from 'lucide-react'
import {
  Button,
  cn,
  ease,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Segmented,
  spring,
  stampIn,
} from '@zzz/ui'
import { agentShortName, MINDSCAPE_MAX, type Agent, type Locale } from '@zzz/core'
import { attributesById, specialtiesById } from '@zzz/game'
import { TraitIcon } from '@/lib/trait-icons'
import { resized } from '@/lib/wiki-image'
import { useMotionLevel } from './providers'

const ICON_WIDTHS = [96, 160, 283]
export const TILE_SIZES = '(min-width: 1280px) 150px, (min-width: 768px) 18vw, 31vw'
const LEVELS = Array.from({ length: MINDSCAPE_MAX + 1 }, (_, i) => i)

/** Attribute accent for an agent (variants keep their own colour). */
export const agentColor = (agent: Agent) => attributesById.get(agent.attribute)?.color ?? '#9a9aa3'

/**
 * An Agent's square head-and-shoulders icon (opaque art from the wiki CDN, loaded by the
 * browser). If it can't load, the initials take its place so the grid never breaks.
 */
export function AgentIcon({
  src,
  name,
  color,
  sizes = TILE_SIZES,
  priority,
  className,
}: {
  src: string
  name: string
  color: string
  sizes?: string
  priority?: boolean
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <span
        className={cn('inset-0 absolute grid place-items-center bg-surface-2', className)}
        style={{ color }}
        data-testid="agent-icon-fallback"
      >
        <span className="text-5xl display">
          {name
            .split(/[\s-]+/)
            .filter(Boolean)
            .map((part) => part[0])
            .slice(0, 2)
            .join('')}
        </span>
      </span>
    )
  }
  return (
    // Plain <img>: the CDN serves pre-sized copies and rejects image proxies (see Portrait).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resized(src, 160)}
      srcSet={ICON_WIDTHS.map((w) => `${resized(src, w)} ${w}w`).join(', ')}
      sizes={sizes}
      alt=""
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      ref={(el) => {
        // Errors that happen before hydration never reach onError.
        if (el?.complete && el.naturalWidth === 0) setFailed(true)
      }}
      onError={() => setFailed(true)}
      className={cn('inset-0 absolute size-full object-cover select-none', className)}
    />
  )
}

/** "S-Rank · Ice (Frost) · Attack", for screen readers. */
function useAgentMeta(agent: Agent) {
  const t = useTranslations('agents')
  const locale = useLocale() as Locale
  const attribute = attributesById.get(agent.attribute)
  const base = attribute?.base ? attributesById.get(attribute.base) : undefined
  return [
    agent.rank && t(agent.rank === 'S' ? 'rankS' : 'rankA'),
    base ? `${base.name[locale]} (${attribute?.name[locale]})` : attribute?.name[locale],
    specialtiesById.get(agent.specialty)?.name[locale],
  ]
    .filter(Boolean)
    .join(' · ')
}

export function RankAttrTag({ agent }: { agent: Agent }) {
  return (
    <span
      aria-hidden
      className="top-1.5 left-1.5 gap-1 px-1.5 py-0.5 font-bold absolute z-10 flex items-center bg-background/85 font-mono text-[0.62rem] tracking-[0.1em]"
    >
      {agent.rank && (
        <span
          className={cn(
            'px-1',
            agent.rank === 'S' ? 'bg-warning text-background' : 'bg-surface-3 text-foreground',
          )}
        >
          {agent.rank}
        </span>
      )}
      <TraitIcon
        kind="attribute"
        id={agent.attribute}
        className="size-3.5"
        style={{ color: agentColor(agent) }}
      />
      <TraitIcon
        kind="specialty"
        id={agent.specialty}
        className="size-3.5 sm:block hidden text-muted"
      />
    </span>
  )
}

export interface AgentTileProps {
  agent: Agent
  /** Mindscape level, or null when not owned. */
  level: number | null
  onToggle: (id: string) => void
  onLevel: (id: string, level: number) => void
  /** Just ticked by the reader: play the stamp (never on hydration). */
  stamp?: boolean
  priority?: boolean
}

/**
 * One Agent in the roster grid: a native checkbox (tap = owned / not owned) with the art and name
 * as its label. Owned tiles add a Mindscape strip (a separate button). Both states have the same
 * height and differ by stamp, strip, colour vs greyscale and frame — never by colour alone.
 */
export function AgentTile({ agent, level, onToggle, onLevel, stamp, priority }: AgentTileProps) {
  const t = useTranslations('agents')
  const locale = useLocale() as Locale
  const motionLevel = useMotionLevel()
  const owned = level !== null
  const short = agentShortName(agent)[locale]
  const meta = useAgentMeta(agent)
  const color = agentColor(agent)
  const inputId = `own-${agent.id}`

  return (
    <div className="group/tile relative" style={{ '--agent': color } as CSSProperties}>
      <input
        type="checkbox"
        id={inputId}
        className="peer sr-only"
        checked={owned}
        onChange={() => onToggle(agent.id)}
        aria-describedby={`meta-${agent.id}`}
        data-testid={`agent-${agent.id}`}
      />
      <div
        className={cn(
          'p-px transition-colors duration-300 chamfer-sm',
          owned ? 'bg-(--agent)' : 'bg-border',
        )}
      >
        <div className="relative overflow-hidden bg-surface chamfer-sm">
          <label htmlFor={inputId} className="block cursor-pointer select-none">
            <span className="relative block aspect-square overflow-hidden">
              <span
                aria-hidden
                className={cn(
                  'inset-0 absolute halftone',
                  owned ? 'opacity-20' : 'text-subtle opacity-10',
                )}
                style={owned ? { color } : undefined}
              />
              <motion.span
                aria-hidden
                className={cn(
                  'inset-0 absolute transition-[filter,opacity,scale] duration-300 ease-(--ease-snap) group-hover/tile:scale-[1.04]',
                  !owned &&
                    'opacity-55 grayscale group-hover/tile:opacity-75 group-hover/tile:grayscale-[60%]',
                )}
                initial={false}
                animate={
                  stamp && owned && motionLevel === 'full'
                    ? { filter: ['brightness(1.8)', 'brightness(1)'] }
                    : undefined
                }
                transition={{ duration: 0.35, ease: ease.snap }}
              >
                <AgentIcon src={agent.icon} name={short} color={color} priority={priority} />
              </motion.span>
              <span aria-hidden className="inset-0 pointer-events-none absolute scanlines" />
              <RankAttrTag agent={agent} />
              {owned && (
                <motion.span
                  aria-hidden
                  className="top-1.5 right-1.5 size-7 absolute z-10 grid place-items-center bg-primary text-primary-foreground shadow-[2px_2px_0_var(--color-background)] chamfer-sm"
                  variants={stampIn}
                  initial={stamp ? 'hidden' : false}
                  animate="show"
                >
                  <Check className="size-4 stroke-[3]" />
                </motion.span>
              )}
              <span className="inset-x-0 bottom-0 px-2 pt-6 pb-1.5 absolute bg-gradient-to-t from-background via-background/70 to-transparent">
                <span
                  className={cn(
                    'text-sm sm:text-base line-clamp-2 block display leading-none',
                    owned ? 'text-foreground' : 'text-muted',
                  )}
                >
                  {short}
                </span>
              </span>
            </span>
            {!owned && (
              <span
                aria-hidden
                className="h-10 flex items-center justify-center border-t border-dashed border-border-strong font-mono text-[0.62rem] tracking-[0.12em] text-subtle uppercase"
              >
                {t('notOwned')}
              </span>
            )}
          </label>
          {owned && (
            <MindscapePicker
              agentName={short}
              color={color}
              value={level}
              onChange={(m) => onLevel(agent.id, m)}
              onRemove={() => onToggle(agent.id)}
            />
          )}
        </div>
      </div>
      <span
        aria-hidden
        className="inset-0 pointer-events-none absolute z-20 opacity-0 shadow-[inset_0_0_0_3px_var(--color-primary)] chamfer-sm peer-focus-visible:opacity-100"
      />
      <span id={`meta-${agent.id}`} className="sr-only">
        {meta}
      </span>
    </div>
  )
}

/** The h-10 Mindscape strip of an owned tile, and its M0–M6 popover. */
export function MindscapePicker({
  agentName,
  color,
  value,
  onChange,
  onRemove,
}: {
  agentName: string
  color: string
  value: number
  onChange: (level: number) => void
  onRemove: () => void
}) {
  const t = useTranslations('agents')
  const [open, setOpen] = useState(false)
  const content = useRef<HTMLDivElement>(null)
  const titleId = useId()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={t('mindscapeButton', { name: agentName, level: value })}
        className="h-10 gap-2 px-2.5 relative z-10 flex w-full cursor-pointer items-center border-t border-border bg-surface-2 focus-inset transition-colors hover:bg-surface-3"
      >
        <span className="h-5 relative overflow-hidden" aria-hidden>
          <AnimatePresence initial={false} mode="popLayout">
            <motion.span
              key={value}
              className="text-lg leading-5 block display text-primary"
              initial={{ y: '70%' }}
              animate={{ y: 0 }}
              transition={spring.snappy}
            >
              M{value}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="sm:flex hidden gap-[3px]" aria-hidden>
          {LEVELS.slice(1).map((i) => (
            <span
              key={i}
              className={cn(
                'h-2 w-1.5 -skew-x-[20deg]',
                i <= value ? 'bg-primary' : 'bg-surface-3',
              )}
            />
          ))}
        </span>
        <ChevronDown className="size-4 ml-auto text-muted" aria-hidden />
      </PopoverTrigger>
      <PopoverContent
        ref={content}
        frame={color}
        aria-labelledby={titleId}
        className="w-[min(20rem,calc(100vw-1.5rem))]"
        onOpenAutoFocus={(event) => {
          event.preventDefault()
          content.current?.querySelector<HTMLElement>('[data-state=on]')?.focus()
        }}
      >
        <div className="p-3">
          <p
            id={titleId}
            className="mb-2 font-mono text-[0.7rem] tracking-[0.2em] text-subtle uppercase"
          >
            {t('mindscapeTitle', { name: agentName })}
          </p>
          <Segmented<string>
            label={t('mindscapeLevel')}
            layoutId={`mindscape-${titleId}`}
            className="grid grid-cols-7"
            value={String(value)}
            onValueChange={(v) => {
              onChange(Number(v))
              setOpen(false)
            }}
            options={LEVELS.map((m) => ({
              value: String(m),
              label: <span className="text-base font-extrabold font-display italic">M{m}</span>,
            }))}
          />
          <p className="mt-2 text-xs text-muted">{t('mindscapeHint')}</p>
          <div className="mt-3 pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                setOpen(false)
                onRemove()
              }}
            >
              <X aria-hidden />
              {t('notOwnedAction')}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

/**
 * A spoiler-flagged agent the reader hasn't revealed: same shell, no name, art or traits. The
 * strip asks first (two steps), so bulk tapping can never reveal it by accident.
 */
export function HiddenAgentTile({ onReveal }: { onReveal: () => void }) {
  const t = useTranslations('agents')
  const titleId = useId()
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-border p-px chamfer-sm">
      <div className="relative overflow-hidden bg-surface chamfer-sm">
        <span
          className="relative grid aspect-square place-items-center overflow-hidden"
          aria-hidden
        >
          <span className="inset-0 absolute scanlines" />
          <span className="inset-0 absolute halftone text-subtle opacity-20" />
          <span className="text-5xl relative display text-subtle">?</span>
          <span className="inset-x-0 bottom-0 px-2 pb-1.5 absolute">
            <span className="text-sm sm:text-base block display leading-none text-subtle">
              {t('hiddenName')}
            </span>
          </span>
        </span>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            aria-label={`${t('hiddenSr')}. ${t('reveal')}`}
            className="h-10 relative z-10 flex w-full cursor-pointer items-center justify-center border-t border-dashed border-border-strong font-mono text-[0.62rem] tracking-[0.12em] text-subtle uppercase focus-inset transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            {t('reveal')}
          </PopoverTrigger>
          <PopoverContent
            frame="var(--color-border-strong)"
            className="w-[min(20rem,calc(100vw-1.5rem))]"
            aria-labelledby={titleId}
          >
            <div className="p-4">
              <p id={titleId} className="text-xl display">
                {t('revealTitle')}
              </p>
              <p className="mt-1 text-sm text-muted">{t('revealBody')}</p>
              <div className="mt-4 gap-2 flex flex-wrap">
                <Button
                  size="sm"
                  onClick={() => {
                    setOpen(false)
                    onReveal()
                  }}
                >
                  {t('revealConfirm')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
                  {t('revealCancel')}
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
