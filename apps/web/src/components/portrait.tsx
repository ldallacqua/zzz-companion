'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@zzz/ui'

interface PortraitProps {
  src?: string
  name: string
  color: string
  alt?: string
  sizes: string
  priority?: boolean
  className?: string
  /** Visual size of the fallback monogram. */
  monogram?: 'sm' | 'lg'
}

/**
 * Character art is hotlinked from the community wiki and loaded by the browser directly
 * (`unoptimized`): the wiki CDN rejects server-side image proxies, and we don't work around that.
 * If an image can't load, a styled monogram takes its place so layouts never break.
 */
export function Portrait({
  src,
  name,
  color,
  alt = '',
  sizes,
  priority,
  className,
  monogram = 'lg',
}: PortraitProps) {
  const [failed, setFailed] = useState(false)
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
            monogram === 'lg' ? 'text-7xl' : 'text-sm not-italic',
          )}
        >
          {name
            .split(' ')
            .map((part) => part[0])
            .slice(0, 2)
            .join('')}
        </span>
      </span>
    )
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      priority={priority}
      sizes={sizes}
      onError={() => setFailed(true)}
      className={className}
    />
  )
}
