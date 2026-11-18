import type { ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { cn } from '@zzz/ui'
import type { Locale } from '@zzz/core'
import { features, type Feature } from '@/lib/features'
import { ActBumper } from './act-bumper'
import {
  FilesArt,
  GlossaryArt,
  IntelArt,
  LanguagesArt,
  PrivateArt,
  ScreensArt,
  SyncArt,
} from './feature-art'
import { MotionSwitch } from './motion-switch'

/** Bento placement (12 columns, 280px rows on desktop) and art for each Act 2 feature. */
const TILES: Record<string, { className: string; art: ReactNode; hero?: boolean }> = {
  'intel-cards': {
    className: 'md:col-span-6 lg:col-span-7 lg:row-span-2',
    art: <IntelArt />,
    hero: true,
  },
  characters: {
    className: 'md:col-span-6 lg:col-span-5 lg:row-span-2',
    art: <FilesArt />,
    hero: true,
  },
  glossary: { className: 'md:col-span-3 lg:col-span-4', art: <GlossaryArt /> },
  i18n: { className: 'md:col-span-3 lg:col-span-4', art: <LanguagesArt /> },
  motion: {
    className: 'md:col-span-3 lg:col-span-4',
    art: (
      <div className="inset-0 px-5 absolute grid place-items-center">
        <MotionSwitch />
      </div>
    ),
  },
  responsive: { className: 'md:col-span-3 lg:col-span-4', art: <ScreensArt /> },
}
/** Two short features share one wide tile. */
const PAIR = ['local-first', 'accounts'] as const
const PAIR_ART: Record<(typeof PAIR)[number], ReactNode> = {
  'local-first': <PrivateArt />,
  accounts: <SyncArt />,
}

/**
 * Act 2, "between sessions": the features that aren't the recap itself, as a bento grid of product
 * shots. Rendered from the feature registry (`act: 'bento'`); an entry without a tailored tile still
 * gets a plain one, so every feature is always on the page. Server-rendered.
 */
export function FeaturesSection() {
  const t = useTranslations('features')
  const th = useTranslations('home')
  const bento = features.filter((f) => f.act === 'bento')
  const pair = PAIR.map((id) => bento.find((f) => f.id === id)).filter((f) => f !== undefined)
  const singles = bento.filter((f) => !pair.includes(f))
  const total = bento.length

  return (
    <section
      aria-labelledby="features-title"
      data-testid="features"
      className="py-24 sm:py-32 lg:py-44"
    >
      <ActBumper act={th('act', { n: 2 })} title={th('actBetween')} />
      <h2
        id="features-title"
        className="mt-10 max-w-4xl font-black display text-[clamp(2.75rem,8vw,6rem)] leading-[0.88] text-balance"
      >
        {t('title')}
      </h2>

      <div className="mt-12 gap-4 md:grid-cols-6 lg:grid-cols-12 lg:auto-rows-[minmax(280px,auto)] grid grid-flow-dense">
        {singles.map((f) => {
          const tile = TILES[f.id]
          return (
            <Tile
              key={f.id}
              feature={f}
              index={bento.indexOf(f) + 1}
              total={total}
              className={tile?.className ?? 'md:col-span-3 lg:col-span-4'}
              hero={tile?.hero}
            >
              {tile?.art}
            </Tile>
          )
        })}
        {pair.length > 0 && (
          <div data-arm="" className="lp-rise group md:col-span-6 lg:col-span-8 relative">
            <TileFrame>
              <div className="sm:grid-cols-2 sm:divide-x sm:divide-y-0 grid h-full divide-y divide-border">
                {pair.map((f) => (
                  <article key={f.id} data-feature-id={f.id} className="flex flex-col">
                    <Slate index={bento.indexOf(f) + 1} total={total} />
                    <div className="px-5 pt-6 pb-2 sm:px-6 flex flex-1 items-center">
                      {PAIR_ART[f.id as (typeof PAIR)[number]]}
                    </div>
                    <TileText feature={f} />
                  </article>
                ))}
              </div>
            </TileFrame>
          </div>
        )}
      </div>
    </section>
  )
}

function TileFrame({ children }: { children: ReactNode }) {
  return (
    <div className="h-full bg-border p-px transition-colors duration-300 chamfer-tr-lg group-hover:bg-border-strong">
      <div className="relative h-full overflow-hidden bg-surface chamfer-tr-lg">
        <div
          aria-hidden
          className="inset-x-0 top-0 h-24 from-white/[0.04] pointer-events-none absolute bg-gradient-to-b to-transparent"
        />
        {children}
      </div>
    </div>
  )
}

function Slate({ index, total }: { index: number; total: number }) {
  return (
    <div
      aria-hidden
      className="px-5 pt-4 sm:px-6 relative flex items-center justify-between font-mono text-[0.6rem] tracking-[0.25em] text-subtle tabular-nums"
    >
      <span>
        {String(index).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>
    </div>
  )
}

function TileText({ feature }: { feature: Feature }) {
  const locale = useLocale() as Locale
  return (
    <div className="px-5 pb-5 sm:px-6 sm:pb-6 relative">
      <h3 className="text-2xl sm:text-[1.75rem] display">{feature.title[locale]}</h3>
      <p className="mt-2 leading-relaxed max-w-[52ch] text-[0.95rem] text-muted">
        {feature.description[locale]}
      </p>
    </div>
  )
}

function Tile({
  feature,
  index,
  total,
  className,
  hero,
  children,
}: {
  feature: Feature
  index: number
  total: number
  className: string
  hero?: boolean
  children?: ReactNode
}) {
  return (
    <article
      data-arm=""
      data-feature-id={feature.id}
      className={cn('lp-rise group relative', className)}
    >
      <TileFrame>
        <div className="flex h-full flex-col">
          <Slate index={index} total={total} />
          <div
            className={cn(
              'relative',
              hero
                ? 'sm:aspect-[4/3] md:aspect-[2/1] lg:aspect-auto lg:flex-1 aspect-square'
                : 'h-44',
            )}
          >
            {children}
          </div>
          <TileText feature={feature} />
        </div>
      </TileFrame>
    </article>
  )
}
