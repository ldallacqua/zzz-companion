import { cn } from '@zzz/ui'

/**
 * Broadcast act bumper: "ACT 1 ——————— THE SHIELD". The hairline draws in once when the act
 * arrives (armed, see `app/landing.css`). Server-safe.
 */
export function ActBumper({
  act,
  title,
  className,
}: {
  /** e.g. "Act 1" */
  act: string
  /** e.g. "The shield" */
  title: string
  className?: string
}) {
  return (
    <div
      data-arm=""
      className={cn(
        'h-12 gap-4 font-semibold flex items-center font-mono text-[0.7rem] tracking-[0.3em] uppercase',
        className,
      )}
    >
      <span className="text-primary">{act}</span>
      <span aria-hidden className="lp-draw h-px flex-1 origin-left bg-border-strong" />
      <span className="text-subtle">{title}</span>
    </div>
  )
}
