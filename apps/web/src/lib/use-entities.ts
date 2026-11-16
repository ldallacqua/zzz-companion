'use client'

import { useMemo } from 'react'
import { useLocale } from 'next-intl'
import { createEntityMatcher, isUnlocked, type Locale, type Progress } from '@zzz/core'
import { linkableEntities, timeline } from '@zzz/story'
import { useStory } from './use-story'

/**
 * Matcher for clickable names in recap text. Only entities known at `at` are linked: the recap part
 * being read (inside the recap) or, without `at`, the reader's progress. Locked entities are never
 * turned into links, so a popover can't spoil anything.
 */
export function useEntityMatcher(at?: string) {
  const locale = useLocale() as Locale
  const gateId = useContextProgress(at).lastSegmentId
  return useMemo(() => {
    const known = linkableEntities.filter((e) =>
      isUnlocked(timeline, { lastSegmentId: gateId }, e.unlockedAt),
    )
    return createEntityMatcher(known.map((e) => ({ key: e.key, aliases: e.aliases[locale] })))
  }, [locale, gateId])
}

/** Progress to explain an entity at: the recap part it's mentioned in, or the reader's progress. */
export function useContextProgress(at?: string): Progress {
  const { progress } = useStory()
  return at ? { lastSegmentId: at } : progress
}
