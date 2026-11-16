'use client'

import { useRef } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { CheckCheck, CircleDashed, Info, Tv } from 'lucide-react'
import {
  Badge,
  Button,
  cn,
  ease,
  Panel,
  ProgressTicks,
  Reveal,
  RevealItem,
  Segmented,
  slideInLeft,
} from '@zzz/ui'
import type { Locale, RecapChapter, TimelineSegment } from '@zzz/core'
import { useCompanion, type RecapMode } from '@/lib/store'
import { useStory } from '@/lib/use-story'
import { useUi } from '@/lib/ui-store'
import { RichBlock } from './rich-text'
import { AvatarStack } from './avatar-stack'
import { PageHeading } from './page-heading'

export function RecapView() {
  const t = useTranslations('recap')
  const tp = useTranslations('progress')
  const story = useStory()
  const mode = useCompanion((s) => s.recapMode)
  const setMode = useCompanion((s) => s.setRecapMode)
  const setPickerOpen = useUi((s) => s.setPickerOpen)

  return (
    <>
      <PageHeading kicker={t('kicker')} title={t('title')}>
        <div className="mt-8 gap-4 sm:flex-row sm:items-end sm:justify-between flex flex-col">
          <div className="max-w-sm w-full">
            <ProgressTicks
              total={story.totalCount}
              done={story.hydrated ? story.doneCount : 0}
              label={tp('ratio', { done: story.doneCount, total: story.totalCount })}
            />
            <p className="mt-2 text-xs font-mono text-muted">
              {tp('ratio', { done: story.doneCount, total: story.totalCount })}
            </p>
          </div>
          <div className="gap-3 sm:flex-row sm:items-center flex flex-col">
            <Segmented<RecapMode>
              label={t('mode')}
              layoutId="recap-mode"
              value={mode}
              onValueChange={setMode}
              options={[
                { value: 'tldr', label: t('tldr') },
                { value: 'full', label: t('full') },
              ]}
            />
            <Button variant="outline" size="sm" onClick={() => setPickerOpen(true)}>
              {tp('change')}
            </Button>
          </div>
        </div>
      </PageHeading>

      <div className="min-h-[70dvh]">
        {story.hydrated && story.recap.length > 0 ? (
          <Timeline chapters={story.recap} mode={mode} />
        ) : (
          <EmptyRecap pending={!story.hydrated} onPick={() => setPickerOpen(true)} />
        )}
      </div>
    </>
  )
}

/**
 * Shown to readers without progress. Before hydration (`pending`) it is already in the HTML, so a
 * first visit paints it immediately; the boot script marks <html data-progress="set"> for readers
 * with saved progress, and for them it stays invisible until their timeline replaces it.
 */
function EmptyRecap({ onPick, pending }: { onPick: () => void; pending: boolean }) {
  const t = useTranslations('recap')
  const tp = useTranslations('progress')
  return (
    <Panel
      className={cn('mt-6 max-w-xl mx-auto', pending && 'in-data-[progress=set]:invisible')}
      innerClassName="p-8 text-center"
      aria-busy={pending || undefined}
    >
      <Tv className="size-10 mx-auto text-primary" aria-hidden />
      <h2 className="mt-4 text-4xl display">{t('emptyTitle')}</h2>
      <p className="mt-3 text-muted">{t('emptyBody')}</p>
      <Button className="mt-6" onClick={onPick}>
        {tp('set')}
      </Button>
    </Panel>
  )
}

/** Timeline geometry (md+): the spine and every chapter node share one axis. */
const SPINE_X = '1rem'
const TIMELINE_PAD = '3.5rem'

function Timeline({ chapters, mode }: { chapters: RecapChapter[]; mode: RecapMode }) {
  const t = useTranslations('recap')
  const ref = useRef<HTMLDivElement>(null)
  // Starts filling when the timeline reaches 70% of the viewport and is full once its end is on
  // screen — so the spine always reaches the "you're caught up" card at the bottom of the page.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end end'] })
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 })

  return (
    <div
      ref={ref}
      className="md:pl-(--timeline-pad) relative"
      style={{ ['--timeline-pad' as string]: TIMELINE_PAD }}
      data-testid="recap-timeline"
    >
      {/* Scroll-linked spine (md+), 2px wide, centred on SPINE_X */}
      <div
        className="top-0 bottom-0 w-0.5 md:block absolute hidden -translate-x-1/2 bg-border"
        style={{ left: SPINE_X }}
        aria-hidden
      >
        <motion.div className="h-full w-full origin-top bg-primary" style={{ scaleY: fill }} />
      </div>

      <div className="space-y-16">
        {chapters.map((chapter) => (
          <ChapterBlock key={chapter.id} chapter={chapter} mode={mode} />
        ))}
      </div>

      <Reveal className="mt-16">
        <RevealItem>
          <Panel frame="var(--color-primary)" innerClassName="p-6 sm:p-8">
            <p className="text-xs font-mono tracking-[0.3em] text-primary uppercase">
              ■ {t('endTitle')}
            </p>
            <p className="mt-2 max-w-xl text-muted">{t('endBody')}</p>
          </Panel>
        </RevealItem>
      </Reveal>
    </div>
  )
}

function ChapterBlock({ chapter, mode }: { chapter: RecapChapter; mode: RecapMode }) {
  const t = useTranslations('recap')
  const locale = useLocale() as Locale
  return (
    <section aria-labelledby={`ch-${chapter.id}`} className="relative">
      {/* Node on the spine: centred on the spine's axis (see SPINE_X), whatever the padding */}
      <span
        className="top-6 size-4 md:block absolute hidden -translate-x-1/2 rotate-45 ring-4 ring-background"
        style={{ backgroundColor: chapter.accent, left: `calc(${SPINE_X} - ${TIMELINE_PAD})` }}
        aria-hidden
      />
      {/* VHS tape label */}
      <Reveal variants={slideInLeft} className="mb-6">
        <div
          className="relative overflow-hidden"
          style={{ ['--accent' as string]: chapter.accent }}
        >
          <div className="relative flex items-stretch bg-surface-2 chamfer-tr">
            <div className="w-2 shrink-0" style={{ backgroundColor: chapter.accent }} aria-hidden />
            <div className="min-w-0 px-4 py-4 sm:px-6 flex-1">
              <div className="gap-2 flex flex-wrap items-center">
                <span
                  className="px-2 py-0.5 font-bold text-black font-mono text-[0.68rem] tracking-[0.18em] uppercase"
                  style={{ backgroundColor: chapter.accent }}
                >
                  {chapter.label[locale]}
                </span>
                <Badge variant="outline">v{chapter.version}</Badge>
                <span className="gap-1.5 ml-auto flex items-center font-mono text-[0.68rem] tracking-[0.14em] text-muted uppercase">
                  {chapter.complete ? (
                    <CheckCheck className="size-3.5" aria-hidden />
                  ) : (
                    <CircleDashed className="size-3.5" aria-hidden />
                  )}
                  {chapter.complete ? t('chapterDone') : t('chapterOngoing')}
                </span>
              </div>
              <h2 id={`ch-${chapter.id}`} className="mt-2 text-3xl sm:text-5xl display">
                {chapter.title[locale]}
              </h2>
            </div>
            <div
              className="w-28 sm:block hidden shrink-0 halftone opacity-50"
              style={{ color: chapter.accent }}
              aria-hidden
            />
          </div>
        </div>
      </Reveal>

      <Reveal className="space-y-4">
        {chapter.segments.map((segment, i) => (
          <RevealItem key={segment.id}>
            <SegmentCard segment={segment} index={i} mode={mode} accent={chapter.accent} />
          </RevealItem>
        ))}
      </Reveal>

      <p className="mt-4 tracking-wide font-mono text-[0.65rem] text-subtle">
        {t('sources')}:{' '}
        {chapter.sources.map((s, i) => (
          <span key={s.url}>
            {i > 0 && ' · '}
            <a
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2 hover:text-primary"
            >
              {s.label}
            </a>
          </span>
        ))}
      </p>
    </section>
  )
}

function SegmentCard({
  segment,
  index,
  mode,
  accent,
}: {
  segment: TimelineSegment
  index: number
  mode: RecapMode
  accent: string
}) {
  const t = useTranslations('recap')
  const locale = useLocale() as Locale
  return (
    <Panel innerClassName="p-5 sm:p-7" data-testid={`segment-${segment.id}`}>
      <div className="gap-x-4 gap-y-2 flex flex-wrap items-start">
        <span
          className="text-5xl sm:text-6xl display leading-none text-outline"
          style={{ color: accent }}
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[0.65rem] tracking-[0.18em] text-subtle uppercase">
            <span className="sr-only">{t('partNumber', { n: index + 1 })} — </span>
            {t('episodes')}: {segment.episodes.join(' · ')}
          </p>
          <h3 className="mt-1 text-2xl sm:text-3xl display">{segment.title[locale]}</h3>
        </div>
        {segment.confidence === 'partial' && (
          <Badge variant="warning" title={t('partialHint')}>
            <Info className="size-3" aria-hidden />
            {t('partial')}
          </Badge>
        )}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25, ease: ease.outExpo }}
          className="mt-4"
        >
          {mode === 'tldr' ? (
            <RichBlock
              at={segment.id}
              paragraphs={[segment.tldr[locale]]}
              render={(children) => (
                <p
                  className="pl-4 text-base leading-relaxed sm:text-lg border-l-2 text-foreground/90"
                  style={{ borderColor: accent }}
                >
                  {children}
                </p>
              )}
            />
          ) : (
            <div className="space-y-3 leading-relaxed sm:text-base text-[0.98rem] text-muted">
              <RichBlock
                at={segment.id}
                paragraphs={segment.summary[locale]}
                render={(children) => <p>{children}</p>}
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {segment.confidence === 'partial' && mode === 'full' && (
        <p className="mt-4 gap-2 text-xs flex items-start text-warning/80">
          <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden />
          {t('partialHint')}
        </p>
      )}

      <div className="mt-5 pt-4 border-t border-border">
        <AvatarStack ids={segment.characters} label={t('featuring')} />
      </div>
    </Panel>
  )
}
