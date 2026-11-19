'use client'

import { useState } from 'react'
import { Disc3, Swords } from 'lucide-react'
import { cn } from '@zzz/ui'
import { resized } from '@/lib/wiki-image'

/**
 * A W-Engine or Drive Disc icon, hotlinked from the wiki CDN at twice its size. If it can't load
 * (or is classified), a glyph takes its place in the same box, so nothing shifts.
 */
export function GameIcon({
  src,
  kind,
  size,
  priority,
  className,
}: {
  /** null = show the glyph (e.g. a classified W-Engine). */
  src: string | null
  kind: 'w-engine' | 'disc'
  size: number
  priority?: boolean
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const Glyph = kind === 'disc' ? Disc3 : Swords
  return (
    <span
      aria-hidden
      className={cn('relative grid shrink-0 place-items-center', className)}
      style={{ width: size, height: size }}
    >
      {failed || !src ? (
        <Glyph className="size-1/2 text-subtle" data-testid="game-icon-fallback" />
      ) : (
        // Plain <img>: the CDN serves pre-sized copies and rejects image proxies (see Portrait).
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resized(src, size * 2)}
          alt=""
          width={size}
          height={size}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          draggable={false}
          ref={(el) => {
            // Errors that happen before hydration never reach onError.
            if (el?.complete && el.naturalWidth === 0) setFailed(true)
          }}
          onError={() => setFailed(true)}
          className="size-full object-contain select-none"
        />
      )}
    </span>
  )
}
