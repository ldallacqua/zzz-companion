'use client'

import * as React from 'react'
import { Switch as SwitchPrimitive } from 'radix-ui'
import { cn } from '../lib/cn'

export function Switch({ className, ...props }: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        'peer h-7 w-12 p-1 inline-flex shrink-0 cursor-pointer items-center bg-surface-3 transition-colors chamfer-sm data-[state=checked]:bg-primary',
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="size-5 data-[state=checked]:translate-x-5 block bg-foreground transition-transform duration-200 ease-(--ease-snap) chamfer-sm data-[state=checked]:bg-primary-foreground" />
    </SwitchPrimitive.Root>
  )
}
