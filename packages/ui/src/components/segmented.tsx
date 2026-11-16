'use client'

import * as React from 'react'
import { ToggleGroup } from 'radix-ui'
import { motion } from 'motion/react'
import { cn } from '../lib/cn'
import { spring } from '../lib/motion'

export interface SegmentedOption<T extends string> {
  value: T
  label: React.ReactNode
}

export interface SegmentedProps<T extends string> {
  value: T
  onValueChange: (value: T) => void
  options: readonly SegmentedOption<T>[]
  /** Accessible name for the group. */
  label: string
  className?: string
  /** Unique id so several controls on a page don't share the sliding highlight. */
  layoutId: string
}

/** Single-choice control with a sliding highlight (keyboard: arrow keys). */
export function Segmented<T extends string>({
  value,
  onValueChange,
  options,
  label,
  className,
  layoutId,
}: SegmentedProps<T>) {
  return (
    <ToggleGroup.Root
      type="single"
      value={value}
      onValueChange={(v) => v && onValueChange(v as T)}
      aria-label={label}
      className={cn('p-1 sm:w-auto inline-flex w-full bg-surface-2 chamfer-sm', className)}
    >
      {options.map((option) => {
        const active = option.value === value
        return (
          <ToggleGroup.Item
            key={option.value}
            value={option.value}
            className={cn(
              'min-h-10 px-3 py-2 text-xs font-semibold sm:flex-none relative isolate flex-1 cursor-pointer font-mono tracking-[0.14em] uppercase focus-inset transition-colors',
              'data-[state=on]:focus-visible:outline-primary-foreground',
              active ? 'text-primary-foreground' : 'text-muted hover:text-foreground',
              // No slide when motion is reduced/off: the active option paints its own highlight,
              // so its contrast never depends on an animation finishing.
              active &&
                'in-data-[motion=off]:bg-primary in-data-[motion=off]:chamfer-sm in-data-[motion=reduced]:bg-primary in-data-[motion=reduced]:chamfer-sm',
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="inset-0 absolute -z-10 bg-primary chamfer-sm in-data-[motion=off]:hidden in-data-[motion=reduced]:hidden"
                transition={spring.snappy}
              />
            )}
            <span className="relative">{option.label}</span>
          </ToggleGroup.Item>
        )
      })}
    </ToggleGroup.Root>
  )
}
