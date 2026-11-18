import { cn } from '@zzz/ui'

/**
 * Giant outlined "ZZZ" for backdrops. Drawn by a pseudo-element: it is decoration, not text, so
 * it stays out of the accessibility tree and out of contrast checks. Size and tint it with
 * `text-*` classes. Server-safe.
 */
export function BigMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none block display leading-none select-none [-webkit-text-fill-color:transparent] [-webkit-text-stroke:2px_currentColor] before:content-['ZZZ']",
        className,
      )}
    />
  )
}
