'use client'

import { useMemo } from 'react'
import {
  getProgressRatio,
  getRecap,
  partitionUnlocked,
  progressOrder,
  type Progress,
} from '@zzz/core'
import { characters, factions, glossary, timeline } from '@zzz/story'
import { useCompanion } from './store'

/** Everything the UI may show for the current progress. Spoiler gating happens in @zzz/core. */
export function useStory() {
  const lastSegmentId = useCompanion((s) => s.lastSegmentId)
  const hydrated = useCompanion((s) => s.hydrated)

  return useMemo(() => {
    // Defend against stale ids saved before content changed.
    const safeId = lastSegmentId && timeline.getSegment(lastSegmentId) ? lastSegmentId : null
    const progress: Progress = { lastSegmentId: safeId }
    const current = safeId ? timeline.getSegment(safeId) : undefined
    return {
      hydrated,
      progress,
      timeline,
      current,
      currentChapter: current ? timeline.getChapter(current.chapterId) : undefined,
      doneCount: progressOrder(timeline, progress) + 1,
      totalCount: timeline.segments.length,
      ratio: getProgressRatio(timeline, progress),
      recap: getRecap(timeline, progress),
      characters: partitionUnlocked(timeline, progress, characters),
      factions: partitionUnlocked(timeline, progress, factions),
      glossary: partitionUnlocked(timeline, progress, glossary),
    }
  }, [lastSegmentId, hydrated])
}
