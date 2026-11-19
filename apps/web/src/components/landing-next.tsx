import type { CSSProperties } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@zzz/ui'
import type { Locale } from '@zzz/core'
import { features, featureTitle } from '@/lib/features'

/**
 * "Next time on": the planned features, as the episode preview that closes a show. A screen of
 * static that has no signal yet, then one title card per feature, in the order they'll ship, with a
 * "Soon" stamp and the features each one builds on (`needs`). A quiet beat before the sign-off.
 * Server-rendered from the registry (`act: 'next'`).
 */
export function LandingNext() {
  const t = useTranslations('home')
  const tf = useTranslations('features')
  const locale = useLocale() as Locale
  const planned = features.filter((f) => f.act === 'next')
  if (planned.length === 0) return null

  return (
    <section aria-labelledby="next-title" data-testid="landing-next" className="py-20 sm:py-28">
      <div className="gap-10 lg:grid-cols-12 lg:gap-12 grid items-center">
        <div aria-hidden className="lg:col-span-5 p-2 bg-surface-2 ring-1 ring-border chamfer">
          <div className="lg:aspect-video relative aspect-[4/1] overflow-hidden bg-[#0c0c0f] chamfer-sm">
            <div className="lp-noise lp-static motion-ambient inset-0 absolute opacity-40" />
            <div className="inset-0 absolute scanlines" />
            <div className="inset-0 absolute grid place-items-center">
              <span className="px-3 py-1.5 font-bold bg-background font-mono text-[0.7rem] tracking-[0.3em] text-foreground uppercase">
                {t('noSignal')}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <h2
            id="next-title"
            className="font-black display text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.9]"
          >
            {t('nextTimeOn')}
          </h2>
          <p className="mt-4 max-w-lg text-lg leading-relaxed text-muted">{t('nextBody')}</p>
        </div>
      </div>

      <ol
        data-arm=""
        className={cn(
          'mt-10 gap-4 grid',
          planned.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2',
        )}
      >
        {planned.map((f, i) => (
          <li
            key={f.id}
            data-feature-id={f.id}
            className="p-5 flex flex-col border border-dashed border-border-strong"
          >
            <div className="gap-3 flex items-center justify-between">
              <p className="font-mono text-[0.6rem] tracking-[0.25em] text-subtle">
                EP. {String(i + 1).padStart(2, '0')}
              </p>
              <span
                className="lp-stamp px-2 py-0.5 font-bold rotate-[-4deg] border-2 border-accent font-mono text-[0.6rem] tracking-[0.2em] text-accent uppercase"
                style={{ '--d': `${200 + i * 140}ms` } as CSSProperties}
              >
                {tf('soonBadge')}
              </span>
            </div>
            <h3 className="mt-3 text-2xl display">{f.title[locale]}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.description[locale]}</p>
            {f.needs && (
              <p className="pt-4 mt-auto font-mono text-[0.6rem] tracking-[0.12em] text-subtle uppercase">
                {t('needs')}: {f.needs.map((id) => featureTitle(id, locale)).join(' · ')}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
