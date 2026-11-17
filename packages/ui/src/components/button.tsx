import * as React from 'react'
import { Slot } from 'radix-ui'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../lib/cn'

export const buttonVariants = cva(
  [
    'group/button relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2',
    'font-display text-base font-extrabold tracking-wide uppercase italic whitespace-nowrap select-none',
    'transition-[transform,background-color,color,box-shadow] duration-200 ease-(--ease-snap)',
    'active:translate-y-px disabled:pointer-events-none disabled:opacity-40',
    // Chamfered: the clip-path would cut an outer outline, so focus is drawn inside.
    'focus-inset',
    '[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  ],
  {
    variants: {
      variant: {
        primary:
          'chamfer-sm bg-primary text-primary-foreground focus-visible:outline-primary-foreground hover:-translate-y-0.5 hover:shadow-[0_6px_0_-1px_var(--color-accent)]',
        accent:
          'chamfer-sm bg-accent text-accent-foreground hover:-translate-y-0.5 hover:shadow-[0_6px_0_-1px_var(--color-primary)]',
        secondary:
          'chamfer-sm bg-surface-3 text-foreground hover:bg-border-strong hover:-translate-y-0.5',
        outline:
          'chamfer-sm bg-transparent text-foreground shadow-[inset_0_0_0_1.5px_var(--color-border-strong)] hover:text-primary hover:shadow-[inset_0_0_0_1.5px_var(--color-primary)]',
        ghost: 'text-muted hover:text-foreground',
        /** Irreversible actions (delete account). Dark text on the danger fill (~5.9:1). */
        danger:
          'chamfer-sm bg-danger text-background focus-visible:outline-background hover:-translate-y-0.5 hover:shadow-[0_6px_0_-1px_var(--color-foreground)]',
      },
      size: {
        sm: 'h-10 px-3.5 text-sm',
        md: 'h-11 px-5',
        lg: 'h-13 px-7 text-lg',
        icon: 'size-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
