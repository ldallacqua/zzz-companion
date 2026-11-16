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
              'px-3 py-2 text-xs font-semibold sm:flex-none relative flex-1 cursor-pointer font-mono tracking-[0.14em] uppercase transition-colors',
              active ? 'text-primary-foreground' : 'text-muted hover:text-foreground',
            )}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="inset-0 absolute bg-primary chamfer-sm"
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
