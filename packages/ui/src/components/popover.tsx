'use client'

import * as React from 'react'
import { Popover as PopoverPrimitive } from 'radix-ui'
import { cn } from '../lib/cn'

export const Popover = PopoverPrimitive.Root
export const PopoverTrigger = PopoverPrimitive.Trigger
export const PopoverClose = PopoverPrimitive.Close

/**
 * Chamfered "intel card" popover. Positioning, focus and dismissal come from Radix;
 * enter/exit use tw-animate-css keyframes (silenced when motion is off).
 */
export function PopoverContent({
  className,
  sideOffset = 10,
  collisionPadding = 12,
  frame = 'var(--color-primary)',
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content> & { frame?: string }) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        sideOffset={sideOffset}
        collisionPadding={collisionPadding}
        className={cn(
          'z-50 w-[min(22rem,calc(100vw-1.5rem))] outline-none',
          'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 duration-200',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
          className,
        )}
        {...props}
      >
        <div className="shadow-2xl p-px chamfer" style={{ backgroundColor: frame }}>
          <div className="relative overflow-hidden bg-surface chamfer">{children}</div>
        </div>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}
