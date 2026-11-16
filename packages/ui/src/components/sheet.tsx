'use client'

import * as React from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'
import { X } from 'lucide-react'
import { cn } from '../lib/cn'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close

export interface SheetContentProps extends React.ComponentProps<typeof DialogPrimitive.Content> {
  heading: React.ReactNode
  description?: React.ReactNode
  closeLabel: string
}

/**
 * Bottom sheet on phones, right-side drawer from `md` up.
 * Enter/exit use tw-animate-css keyframes, which the motion preference can switch off.
 *
 * On close, focus returns to whatever was focused when the sheet opened. Radix only does that for
 * a <SheetTrigger>; sheets opened from app state (several buttons, no trigger) would otherwise
 * drop focus on <body> and send keyboard users back to the top of the page. If the opener no
 * longer exists, focus goes to a focusable `<main tabindex="-1">`.
 */
export function SheetContent({
  className,
  children,
  heading,
  description,
  closeLabel,
  onOpenAutoFocus,
  onCloseAutoFocus,
  ...props
}: SheetContentProps) {
  const opener = React.useRef<HTMLElement | null>(null)
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 inset-0 bg-black/70 backdrop-blur-sm fixed z-50" />
      <DialogPrimitive.Content
        className={cn(
          'fixed z-50 flex flex-col bg-surface shadow-[0_0_0_1px_var(--color-border)] outline-none',
          'inset-x-0 bottom-0 max-h-[88dvh] rounded-none',
          'md:inset-y-0 md:right-0 md:left-auto md:max-h-none md:w-[440px]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out duration-300',
          'data-[state=open]:slide-in-from-bottom data-[state=closed]:slide-out-to-bottom',
          'md:data-[state=open]:slide-in-from-right md:data-[state=closed]:slide-out-to-right md:data-[state=open]:slide-in-from-bottom-0 md:data-[state=closed]:slide-out-to-bottom-0',
          className,
        )}
        onOpenAutoFocus={(event) => {
          const active = document.activeElement
          opener.current = active instanceof HTMLElement && active !== document.body ? active : null
          onOpenAutoFocus?.(event)
        }}
        onCloseAutoFocus={(event) => {
          onCloseAutoFocus?.(event)
          if (event.defaultPrevented) return
          // The opener can be gone (e.g. "Set my progress" disappears once progress is set):
          // then continue from the page's main landmark rather than the top of the document.
          const target = opener.current?.isConnected
            ? opener.current
            : document.querySelector<HTMLElement>('main[tabindex]')
          if (target) {
            event.preventDefault()
            target.focus({ preventScroll: true })
          }
        }}
        {...props}
      >
        <div className="h-1.5 shrink-0 hazard" aria-hidden />
        <header className="gap-4 px-5 pt-5 pb-3 flex items-start justify-between">
          <div>
            <DialogPrimitive.Title className="text-3xl display">{heading}</DialogPrimitive.Title>
            {description ? (
              <DialogPrimitive.Description className="mt-1 text-sm text-muted">
                {description}
              </DialogPrimitive.Description>
            ) : (
              <DialogPrimitive.Description className="sr-only">
                {heading}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close
            className="size-10 grid shrink-0 cursor-pointer place-items-center bg-surface-3 focus-inset transition-colors chamfer-sm hover:bg-primary hover:text-primary-foreground"
            aria-label={closeLabel}
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
        </header>
        <div className="min-h-0 px-5 pb-6 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  )
}
