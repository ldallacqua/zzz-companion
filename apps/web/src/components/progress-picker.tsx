'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { Check, ChevronDown, CircleSlash } from 'lucide-react'
import { cn, ease, ProgressTicks, Sheet, SheetContent, spring } from '@zzz/ui'
import type { Locale } from '@zzz/core'
import { useCompanion } from '@/lib/store'
import { useStory } from '@/lib/use-story'
import { useUi } from '@/lib/ui-store'

/**
 * Lets the player say where they are. Only the open chapter shows episode names,
 * and our own (spoilery) part titles are shown only for parts already finished.
 */
export function ProgressPicker() {
  const t = useTranslations('progress')
  const tc = useTranslations('common')
  const locale = useLocale() as Locale
  const open = useUi((s) => s.pickerOpen)
  const setOpen = useUi((s) => s.setPickerOpen)
  const setProgress = useCompanion((s) => s.setProgress)
  const story = useStory()
  const currentOrder = story.current?.order ?? -1
  const [expanded, setExpanded] = useState<string | null>(null)

  const openChapter = expanded ?? story.current?.chapterId ?? null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent heading={t('title')} description={t('description')} closeLabel={tc('close')}>
        <div className="mb-4">
          <ProgressTicks
            total={story.totalCount}
            done={story.doneCount}
            label={t('ratio', { done: story.doneCount, total: story.totalCount })}
          />
          <p className="mt-2 text-xs font-mono text-muted">
            {t('ratio', { done: story.doneCount, total: story.totalCount })}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setProgress(null)}
          aria-pressed={currentOrder === -1}
          className={cn(
            'mb-3 gap-3 px-4 py-3 flex w-full cursor-pointer items-center text-left focus-inset transition-colors chamfer-sm',
            currentOrder === -1
              ? 'bg-primary text-primary-foreground focus-visible:outline-primary-foreground'
              : 'bg-surface-2 hover:bg-surface-3',
          )}
        >
          <CircleSlash className="size-4 shrink-0" aria-hidden />
          <span className="font-semibold">{t('notStarted')}</span>
        </button>

        <ol className="space-y-2">
          {story.timeline.chapters.map((chapter) => {
            const isOpen = openChapter === chapter.id
            const panelId = `picker-${chapter.id}`
            return (
              <li key={chapter.id} className="bg-surface-2 chamfer-sm">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setExpanded(isOpen ? '' : chapter.id)}
                  className="gap-3 px-4 py-3 flex w-full cursor-pointer items-center text-left focus-inset"
                >
                  <span
                    className="h-8 w-1.5 shrink-0 -skew-x-12"
                    style={{ backgroundColor: chapter.accent }}
                    aria-hidden
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[0.65rem] tracking-[0.18em] text-subtle uppercase">
                      {chapter.label[locale]}
                    </span>
                    <span className="font-semibold block truncate">{chapter.title[locale]}</span>
                  </span>
                  {story.current?.chapterId === chapter.id && (
                    <span className="px-1.5 py-0.5 font-bold tracking-widest bg-primary font-mono text-[0.6rem] text-primary-foreground uppercase">
                      {t('current')}
                    </span>
                  )}
                  <ChevronDown
                    className={cn('size-4 shrink-0 transition-transform', isOpen && 'rotate-180')}
                    aria-hidden
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: ease.outExpo }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-1 px-2 pb-2">
                        {chapter.segments.map((segment, i) => {
                          const selected = segment.order === currentOrder
                          const finished = segment.order <= currentOrder
                          return (
                            <li key={segment.id}>
                              <button
                                type="button"
                                onClick={() => setProgress(segment.id)}
                                aria-pressed={selected}
                                data-testid={`pick-${segment.id}`}
                                className={cn(
                                  'gap-3 px-3 py-2.5 relative flex w-full cursor-pointer items-start text-left focus-inset transition-colors',
                                  selected
                                    ? 'text-primary-foreground focus-visible:outline-primary-foreground'
                                    : 'hover:bg-surface-3',
                                )}
                              >
                                {selected && (
                                  <motion.span
                                    layoutId="picker-selected"
                                    className="inset-0 absolute bg-primary chamfer-sm"
                                    transition={spring.snappy}
                                  />
                                )}
                                <span
                                  className={cn(
                                    'mt-0.5 size-5 font-bold relative grid shrink-0 place-items-center font-mono text-[0.65rem]',
                                    selected
                                      ? 'bg-primary-foreground text-primary'
                                      : finished
                                        ? 'bg-primary/20 text-primary'
                                        : 'bg-surface-3 text-muted',
                                  )}
                                >
                                  {finished ? <Check className="size-3" aria-hidden /> : i + 1}
                                </span>
                                <span className="min-w-0 relative">
                                  {finished && (
                                    <span className="text-sm font-semibold block">
                                      {segment.title[locale]}
                                    </span>
                                  )}
                                  <span
                                    className={cn(
                                      'leading-relaxed block font-mono text-[0.7rem]',
                                      selected ? 'opacity-80' : 'text-muted',
                                    )}
                                  >
                                    {segment.episodes[locale].join(' · ')}
                                  </span>
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ol>
      </SheetContent>
    </Sheet>
  )
}
