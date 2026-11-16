'use client'

import { useLocale, useTranslations } from 'next-intl'
import {
  BookOpen,
  Dices,
  Languages,
  Lock,
  MousePointerClick,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Swords,
  Tv,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Badge, Panel, Reveal, RevealItem, stagger } from '@zzz/ui'
import type { Locale } from '@zzz/core'
import { features, type FeatureIcon } from '@/lib/features'

const ICONS: Record<FeatureIcon, LucideIcon> = {
  tv: Tv,
  shield: ShieldCheck,
  pointer: MousePointerClick,
  users: Users,
  book: BookOpen,
  languages: Languages,
  sparkles: Sparkles,
  smartphone: Smartphone,
  lock: Lock,
  swords: Swords,
  dice: Dices,
}

/** Landing page feature grid. Rendered from the feature registry — never hand-edit copy here. */
export function FeaturesSection() {
  const t = useTranslations('features')
  const locale = useLocale() as Locale
  const shipped = features.filter((f) => f.status === 'shipped')
  const planned = features.filter((f) => f.status === 'planned')

  return (
    <section className="mt-20" aria-labelledby="features" data-testid="features">
      <p className="gap-3 text-xs font-semibold flex items-center font-mono tracking-[0.3em] text-primary uppercase">
        <span className="w-8 h-px bg-primary" aria-hidden />
        {t('kicker')}
      </p>
      <h2 id="features" className="mt-3 text-5xl sm:text-6xl display">
        {t('title')}
      </h2>

      <Reveal className="mt-8 gap-4 sm:grid-cols-2 lg:grid-cols-3 grid" variants={stagger(0.06)}>
        {shipped.map((f, i) => {
          const Icon = ICONS[f.icon]
          return (
            <RevealItem key={f.id} className="h-full">
              <Panel innerClassName="group h-full p-6" className="h-full">
                <div className="flex items-start justify-between">
                  <span className="size-11 grid place-items-center bg-primary text-primary-foreground transition-transform duration-300 chamfer-sm group-hover:-rotate-6">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="text-xs font-mono text-subtle">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-4 text-2xl display">{f.title[locale]}</h3>
                <p className="mt-2 leading-relaxed text-muted">{f.description[locale]}</p>
              </Panel>
            </RevealItem>
          )
        })}
      </Reveal>

      {planned.length > 0 && (
        <>
          <h3 className="mt-12 text-xs font-semibold font-mono tracking-[0.3em] text-subtle uppercase">
            {t('soon')}
          </h3>
          <Reveal className="mt-4 gap-4 sm:grid-cols-2 grid" variants={stagger(0.08)}>
            {planned.map((f) => {
              const Icon = ICONS[f.icon]
              return (
                <RevealItem key={f.id}>
                  <div className="gap-4 p-5 relative flex overflow-hidden border border-dashed border-border-strong">
                    <div className="inset-0 absolute hazard opacity-[0.04]" aria-hidden />
                    <Icon className="mt-1 size-5 relative shrink-0 text-muted" aria-hidden />
                    <div className="relative">
                      <div className="gap-2 flex flex-wrap items-center">
                        <h4 className="text-xl display">{f.title[locale]}</h4>
                        <Badge variant="outline">{t('soonBadge')}</Badge>
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {f.description[locale]}
                      </p>
                    </div>
                  </div>
                </RevealItem>
              )
            })}
          </Reveal>
        </>
      )}
    </section>
  )
}
