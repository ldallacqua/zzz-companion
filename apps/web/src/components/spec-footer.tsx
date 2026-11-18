import type { ReactNode } from 'react'
import { useLocale } from 'next-intl'
import { cn } from '@zzz/ui'
import type { Locale } from '@zzz/core'
import type { Feature } from '@/lib/features'

/**
 * The registry entries an act demonstrates, as an Apple-style spec line: white title, grey
 * description. Each entry carries `data-feature-id` (every feature appears once on the page).
 */
export function SpecFooter({
  features,
  className,
  children,
}: {
  features: readonly Feature[]
  className?: string
  /** Extra fine print under the entries (e.g. the coverage line). */
  children?: ReactNode
}) {
  const locale = useLocale() as Locale
  return (
    <div className={cn('pt-6 border-t border-border', className)}>
      <dl className="gap-x-10 gap-y-5 sm:grid-cols-2 grid">
        {features.map((f) => (
          <div key={f.id} data-feature-id={f.id}>
            <dt className="font-semibold text-foreground">{f.title[locale]}</dt>
            <dd className="mt-1 leading-relaxed max-w-[60ch] text-[0.95rem] text-muted">
              {f.description[locale]}
            </dd>
          </div>
        ))}
      </dl>
      {children}
    </div>
  )
}
