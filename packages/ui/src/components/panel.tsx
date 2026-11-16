import * as React from 'react'
import { cn } from '../lib/cn'

export interface PanelProps extends React.ComponentProps<'div'> {
  /** Border color of the chamfered frame. Defaults to the neutral border token. */
  frame?: string
  innerClassName?: string
}

/**
 * Chamfered card. clip-path removes normal borders, so the frame is a 1px
 * gap between an outer colored shape and an inner surface shape.
 */
export function Panel({ className, innerClassName, frame, style, children, ...props }: PanelProps) {
  return (
    <div
      className={cn('bg-border p-px chamfer', className)}
      style={{ ...(frame ? { backgroundColor: frame } : null), ...style }}
      {...props}
    >
      <div className={cn('relative h-full bg-surface chamfer', innerClassName)}>{children}</div>
    </div>
  )
}
