import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[0.7rem] font-semibold tracking-[0.12em] uppercase',
  {
    variants: {
      variant: {
        default: 'bg-surface-3 text-muted',
        primary: 'bg-primary text-primary-foreground',
        accent: 'bg-accent text-accent-foreground',
        warning: 'bg-warning text-black',
        outline: 'text-muted shadow-[inset_0_0_0_1px_var(--color-border-strong)]',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export interface BadgeProps
  extends React.ComponentProps<'span'>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
