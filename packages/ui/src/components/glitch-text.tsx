import * as React from 'react'
import { cn } from '../lib/cn'

export interface GlitchTextProps extends React.ComponentProps<'span'> {
  text: string
}

/**
 * RGB-split glitch: two clipped copies jitter on a loop. The copies are aria-hidden,
 * and the loop is "ambient", so reduced/off motion keeps the text perfectly still.
 */
export function GlitchText({ text, className, ...props }: GlitchTextProps) {
  return (
    <span className={cn('relative inline-block', className)} {...props}>
      <span className="relative z-10">{text}</span>
      <span
        aria-hidden
        className="motion-ambient inset-0 pointer-events-none absolute animate-[glitch-a_3.2s_infinite_steps(1)] text-info opacity-80 mix-blend-screen"
      >
        {text}
      </span>
      <span
        aria-hidden
        className="motion-ambient inset-0 pointer-events-none absolute animate-[glitch-b_2.7s_infinite_steps(1)] text-accent opacity-80 mix-blend-screen"
      >
        {text}
      </span>
    </span>
  )
}
