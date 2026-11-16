import * as React from 'react'
import { cn } from '../lib/cn'

export interface MarqueeProps extends React.ComponentProps<'div'> {
  items: readonly string[]
  /** Seconds per loop. */
  duration?: number
  tone?: 'hazard' | 'dark'
}

/** Hazard-tape ticker. Duplicates its content so the loop is seamless. */
export function Marquee({
  items,
  duration = 28,
  tone = 'hazard',
  className,
  ...props
}: MarqueeProps) {
  const row = (hidden: boolean) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-5 whitespace-nowrap">{item}</span>
          <span aria-hidden className="size-2 inline-block rotate-45 bg-current" />
        </span>
      ))}
    </div>
  )
  return (
    <div
      className={cn(
        'py-1.5 text-xs font-bold relative overflow-hidden font-mono tracking-[0.25em] uppercase select-none',
        tone === 'hazard' ? 'bg-primary text-primary-foreground' : 'bg-surface-2 text-muted',
        className,
      )}
      {...props}
    >
      <div
        className="motion-ambient flex w-max animate-marquee"
        style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
