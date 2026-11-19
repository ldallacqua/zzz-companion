'use client'

import { useState, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@zzz/ui'
import type { Character } from '@zzz/core'
import { FANDOM_REVISION, resized } from '@/lib/wiki-image'

export type PortraitFraming = 'bust' | 'face' | 'full'
type Focus = Character['focus']

interface PortraitProps {
  src?: string
  name: string
  color: string
  alt?: string
  /** Where the face is in the art and how far to zoom (from the character data). */
  focus?: Focus
  /**
   * - `bust`: waist up, face in the upper third (cards)
   * - `face`: head and shoulders, face centred (avatars, intel cards)
   * - `full`: the whole art, feet on the floor
   */
  framing?: PortraitFraming
  /** Rendered width of the *frame*, as a `sizes` list (e.g. `(min-width: 1024px) 22vw, 46vw`). */
  sizes: string
  priority?: boolean
  className?: string
  /** Visual size of the fallback monogram. */
  monogram?: 'sm' | 'lg' | 'xl'
  /** Extra content inside the fallback (e.g. a "No photo on file" stamp). */
  fallback?: ReactNode
  /** Called once the art has loaded (or failed), e.g. to start a reveal animation. */
  onSettled?: () => void
}

const DEFAULT_FOCUS: Focus = { x: 0.5, y: 0.13, zoom: 2.1 }
const FACE_ZOOM = 1.9
/** Where the face lands inside the frame, per framing. */
const TARGET_Y: Record<Exclude<PortraitFraming, 'full'>, number> = { bust: 0.36, face: 0.5 }
const WIDTHS = [160, 320, 640, 1280]

/**
 * Character art is hotlinked from the community wiki and loaded by the browser directly: the
 * wiki CDN rejects server-side image proxies, and we don't work around that. We ask the CDN for
 * a resized copy (`scale-to-width-down`) so phones don't download 4K renders.
 * If an image can't load, a styled monogram takes its place so layouts never break.
 *
 * Crops are aspect-ratio independent: the face point (`focus.x/y`, fractions of the art) is
 * translated onto a target point of the frame, and the art is sized by `zoom` (its height ÷ the
 * frame's height). Hover scales use `transform-origin` = the face, so it stays put.
 */
export function Portrait({
  src,
  name,
  color,
  alt = '',
  focus = DEFAULT_FOCUS,
  framing = 'bust',
  sizes,
  priority,
  className,
  monogram = 'lg',
  fallback,
  onSettled,
}: PortraitProps) {
  const [failed, setFailed] = useState(false)
  const fail = () => {
    setFailed(true)
    onSettled?.()
  }

  if (!src || failed) {
    return (
      <span
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        className="inset-0 absolute grid place-items-center"
        style={{ color }}
      >
        <span
          className={cn(
            'display opacity-90',
            monogram === 'xl'
              ? 'text-[clamp(6rem,45cqi,12rem)] [-webkit-text-fill-color:transparent] [-webkit-text-stroke:2px_currentColor]'
              : monogram === 'lg'
                ? 'text-7xl'
                : 'text-sm not-italic',
          )}
        >
          {name
            .split(' ')
            .map((part) => part[0])
            .slice(0, 2)
            .join('')}
        </span>
        {fallback}
      </span>
    )
  }

  const zoom = framing === 'face' ? focus.zoom * FACE_ZOOM : framing === 'bust' ? focus.zoom : 1
  let targetY = framing === 'full' ? 0 : TARGET_Y[framing]
  if (focus.opaque) {
    // Keep the art's own top/bottom edges outside the frame.
    targetY = Math.max(Math.min(targetY, focus.y * zoom), 1 - (1 - focus.y) * zoom)
  }
  const style: CSSProperties =
    framing === 'full'
      ? {}
      : {
          left: '50%',
          top: `${targetY * 100}%`,
          height: `${zoom * 100}%`,
          translate: `${-focus.x * 100}% ${-focus.y * 100}%`,
          transformOrigin: `${focus.x * 100}% ${focus.y * 100}%`,
        }

  return (
    // A plain <img>: next/image can't express this crop, and the art is served pre-sized by the CDN.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resized(src, 640)}
      srcSet={srcSet(src)}
      sizes={scaleSizes(sizes, framing === 'full' ? 1 : zoom * 0.9)}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
      draggable={false}
      ref={(el) => {
        // Errors that happen before hydration never reach onError.
        if (el?.complete && el.naturalWidth === 0) fail()
        else if (el?.complete) onSettled?.()
      }}
      onLoad={() => onSettled?.()}
      onError={fail}
      style={style}
      className={cn(
        'absolute max-w-none select-none',
        framing === 'full' ? 'inset-0 size-full object-contain object-bottom' : 'w-auto',
        className,
      )}
    />
  )
}

function srcSet(src: string): string | undefined {
  if (!src.includes(FANDOM_REVISION)) return undefined
  return WIDTHS.map((w) => `${resized(src, w)} ${w}w`).join(', ')
}

/** Multiplies every length in a `sizes` list: the art is wider than its frame when zoomed. */
export function scaleSizes(sizes: string, factor: number): string {
  if (factor === 1) return sizes
  return sizes
    .split(',')
    .map((entry) => {
      const match = /^\s*(\(.*\)\s+)?(.+?)\s*$/.exec(entry)
      if (!match) return entry
      return `${match[1] ?? ''}calc(${match[2]} * ${factor.toFixed(2)})`
    })
    .join(', ')
}
