'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { cn, ease, spring } from '@zzz/ui'
import type { Locale } from '@zzz/core'
import { useStory } from '@/lib/use-story'
import { CharacterCard, LockedCard } from './character-card'
import { PageHeading } from './page-heading'
import { useHashFocus } from '@/lib/use-hash-focus'

export function CharactersView() {
  const t = useTranslations('characters')
  const locale = useLocale() as Locale
  const story = useStory()
  const [faction, setFaction] = useState<string>('all')
  useHashFocus(story.hydrated)

  const factionsWithMembers = story.factions.unlocked.filter((f) =>
    story.characters.unlocked.some((c) => c.factions.includes(f.id)),
  )
  const activeFaction = factionsWithMembers.some((f) => f.id === faction) ? faction : 'all'
  const visible = story.characters.unlocked.filter(
    (c) => activeFaction === 'all' || c.factions.includes(activeFaction),
  )
  const filters = [
    { id: 'all', label: t('all') },
    ...factionsWithMembers.map((f) => ({ id: f.id, label: f.name[locale] })),
  ]

  return (
    <>
      <PageHeading kicker={t('kicker')} title={t('title')} lede={t('lede')} />

      {story.hydrated && filters.length > 1 && (
        <div
          role="group"
          aria-label={t('filter')}
          className="-mx-4 mb-8 gap-2 px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 flex overflow-x-auto"
        >
          {filters.map((f) => {
            const active = f.id === activeFaction
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFaction(f.id)}
                className={cn(
                  'px-3 py-2 font-semibold relative shrink-0 cursor-pointer font-mono text-[0.7rem] tracking-[0.12em] whitespace-nowrap uppercase focus-inset transition-colors',
                  active
                    ? 'text-primary-foreground focus-visible:outline-primary-foreground'
                    : 'bg-surface-2 text-muted chamfer-sm hover:text-foreground',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="faction-filter"
                    className="inset-0 absolute bg-primary chamfer-sm"
                    transition={spring.snappy}
                  />
                )}
                <span className="relative">{f.label}</span>
              </button>
            )
          })}
        </div>
      )}

      <div className="min-h-[70dvh]">
        {!story.hydrated ? (
          <p className="py-20 text-sm text-center font-mono text-muted" role="status">
            …
          </p>
        ) : (
          <motion.ul
            layout
            className="gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 grid grid-cols-2"
            data-testid="character-grid"
          >
            <AnimatePresence mode="popLayout">
              {visible.map((character, i) => (
                <motion.li
                  key={character.id}
                  id={`character-${character.id}`}
                  className="scroll-mt-28 data-[flash=true]:[&_article]:drop-shadow-[0_0_18px_var(--color-primary)]"
                  layout
                  initial={{ opacity: 0, scale: 0.92, y: 20 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    transition: {
                      delay: Math.min(i * 0.04, 0.4),
                      duration: 0.45,
                      ease: ease.outExpo,
                    },
                  }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                >
                  <CharacterCard character={character} priority={i < 4} />
                </motion.li>
              ))}
              {activeFaction === 'all' &&
                Array.from({ length: Math.min(story.characters.lockedCount, 4) }, (_, i) => (
                  <motion.li
                    key={`locked-${i}`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <LockedCard label={t('lockedName')} />
                  </motion.li>
                ))}
            </AnimatePresence>
          </motion.ul>
        )}
      </div>

      {story.hydrated && story.characters.lockedCount > 0 && (
        <p className="mt-8 text-xs font-mono text-subtle">
          {t('locked', { count: story.characters.lockedCount })}
        </p>
      )}
    </>
  )
}
