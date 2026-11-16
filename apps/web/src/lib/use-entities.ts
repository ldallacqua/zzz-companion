'use client'

import { useMemo } from 'react'
import { useLocale } from 'next-intl'
import { createEntityMatcher, isUnlocked, type Locale } from '@zzz/core'
import { linkableEntities, timeline } from '@zzz/story'
import { useStory } from './use-story'

/**
 * Matcher for clickable names in recap text, limited to entities the player has unlocked.
 * Locked entities are never turned into links, so a popover can't spoil anything.
 */
export function useEntityMatcher() {
  const locale = useLocale() as Locale
  const { progress } = useStory()
  return useMemo(() => {
    const unlocked = linkableEntities.filter((e) => isUnlocked(timeline, progress, e.unlockedAt))
    return createEntityMatcher(unlocked.map((e) => ({ key: e.key, aliases: e.aliases[locale] })))
  }, [locale, progress])
}
