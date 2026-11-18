'use client'

import { useLocale, useTranslations } from 'next-intl'
import { cn, ProgressTicks } from '@zzz/ui'
import type { Locale } from '@zzz/core'
import { useStory } from '@/lib/use-story'

/**
 * "You are here · Chapter 2 · Part 07" for a returning reader.
 *
 * - `osd`: one line for the hero monitor's lower-third.
 * - `status`: the line plus the segmented progress meter (landing outro).
 *
 * Pages show it only under `html[data-progress="set"]` (set before the first paint), in a slot
 * whose size doesn't depend on the text, so it fills in after hydration without a layout shift.
 */
export function ProgressLine({
  variant = 'osd',
  className,
}: {
  variant?: 'osd' | 'status'
  className?: string
}) {
  const t = useTranslations('home')
  const tp = useTranslations('progress')
  const locale = useLocale() as Locale
  const story = useStory()
  const { current, currentChapter } = story
  const part = current && currentChapter ? currentChapter.segments.indexOf(current) + 1 : 0
  const where =
    current && currentChapter
      ? `${currentChapter.label[locale]} · ${t('mockPart', { n: String(part).padStart(2, '0') })}`
      : '…'

  if (variant === 'osd') {
    return (
      <p className={cn('min-w-0 truncate', className)}>
        <span className="text-primary">{t('statusLabel')}</span>
        <span className="mx-2 text-subtle" aria-hidden>
          ·
        </span>
        <span className="text-foreground">{where}</span>
      </p>
    )
  }

  const ratio = tp('ratio', { done: story.doneCount, total: story.totalCount })
  return (
    <div className={cn('max-w-md mx-auto w-full', className)}>
      <p className="text-xs font-mono tracking-[0.18em] text-subtle uppercase">
        {t('statusLabel')}
      </p>
      <p className="mt-2 text-2xl display">
        {current && currentChapter ? (
          <>
            <span style={{ color: currentChapter.accent }}>{currentChapter.label[locale]}</span> ·{' '}
            {current.title[locale]}
          </>
        ) : (
          '…'
        )}
      </p>
      <ProgressTicks
        className="mt-4"
        total={story.totalCount}
        done={current ? story.doneCount : 0}
        label={ratio}
      />
      <p className="mt-2 text-xs font-mono text-muted">{current ? ratio : ' '}</p>
    </div>
  )
}
