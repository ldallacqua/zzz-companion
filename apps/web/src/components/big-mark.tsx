import { cn } from '@zzz/ui'

/**
 * Giant outlined "ZZZ" for backdrops (`.lp-mark` in `app/landing.css`): an SVG outline used as a
 * mask over `currentColor`. Not text: it stays out of the accessibility tree and contrast checks,
 * never waits for the display font, and can't become the page's Largest Contentful Paint (a font
 * swap on a 38rem glyph made Lighthouse's LCP swing by seconds). Size it with a width class and
 * tint it with `text-*`. Server-safe.
 */
export function BigMark({ className }: { className?: string }) {
  return (
    <span aria-hidden className={cn('lp-mark pointer-events-none block select-none', className)} />
  )
}
