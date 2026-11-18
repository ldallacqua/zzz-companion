'use client'

import { Button, type ButtonProps } from '@zzz/ui'
import { useUi } from '@/lib/ui-store'

/** A button that opens the progress picker. A tiny client island for server-rendered pages. */
export function PickerButton(props: Omit<ButtonProps, 'onClick' | 'asChild'>) {
  const setPickerOpen = useUi((s) => s.setPickerOpen)
  return <Button {...props} onClick={() => setPickerOpen(true)} />
}
