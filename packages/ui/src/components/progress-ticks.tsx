import * as React from 'react'
import { cn } from '../lib/cn'

export interface ProgressTicksProps extends React.ComponentProps<'div'> {
  total: number
  done: number
  label: string
}

/** Segmented progress meter, like the stamina bars in the game's HUD. */
export function ProgressTicks({ total, done, label, className, ...props }: ProgressTicksProps) {
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      className={cn('h-2.5 flex w-full gap-[3px]', className)}
      {...props}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'h-full flex-1 -skew-x-[20deg] transition-colors duration-500',
            i < done ? 'bg-primary' : 'bg-surface-3',
          )}
          style={{ transitionDelay: `${i * 25}ms` }}
        />
      ))}
    </div>
  )
}
