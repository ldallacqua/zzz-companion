import { useId } from 'react'
import { Badge, Panel } from '@zzz/ui'

/** A section that is planned but not built yet (Build now, the pull advisor later). */
export function ComingSoonPanel({
  title,
  badge,
  children,
  id,
}: {
  title: string
  badge: string
  children: React.ReactNode
  /** Anchor for the section, e.g. "build". */
  id?: string
}) {
  const titleId = useId()
  return (
    <section id={id} aria-labelledby={titleId} className="mt-12 scroll-mt-28">
      <Panel innerClassName="overflow-hidden">
        <div className="h-1.5 hazard" aria-hidden />
        <div className="p-5 sm:p-6">
          <div className="gap-3 flex flex-wrap items-center">
            <h2 id={titleId} className="text-3xl display">
              {title}
            </h2>
            <Badge variant="outline">{badge}</Badge>
          </div>
          <div className="mt-2 max-w-[60ch] text-muted">{children}</div>
        </div>
      </Panel>
    </section>
  )
}
