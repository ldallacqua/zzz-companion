import type { LocalizedText, Progress, Revision } from './schema'
import type { Timeline, TimelineChapter, TimelineSegment } from './timeline'

/**
 * Spoiler gating lives here and only here.
 * UI code must never compare story orders itself - it asks these functions.
 */

/** Order of the last finished segment, or -1 when nothing is finished. */
export function progressOrder(timeline: Timeline, progress: Progress): number {
  return timeline.orderOf(progress.lastSegmentId)
}

export function isUnlocked(timeline: Timeline, progress: Progress, unlockedAt: string): boolean {
  const target = timeline.orderOf(unlockedAt)
  if (target === -1) throw new Error(`Unknown segment "${unlockedAt}"`)
  return target <= progressOrder(timeline, progress)
}

/** Splits gated items into what the reader may see and how many stay hidden. */
export function partitionUnlocked<T extends { unlockedAt: string }>(
  timeline: Timeline,
  progress: Progress,
  items: readonly T[],
): { unlocked: T[]; lockedCount: number } {
  const unlocked = items.filter((item) => isUnlocked(timeline, progress, item.unlockedAt))
  return { unlocked, lockedCount: items.length - unlocked.length }
}

/**
 * An entry's text as the reader knows it at `progress`: the latest revision whose `at` is already
 * finished, otherwise the base text. Use the reader's progress for reference pages and the
 * segment being read (`{ lastSegmentId: segment.id }`) inside the recap, so a name tapped in
 * Chapter 1 explains it as of Chapter 1 — never with later facts.
 */
export function knownTextAt(
  timeline: Timeline,
  progress: Progress,
  base: LocalizedText,
  revisions: readonly Revision[] = [],
): LocalizedText {
  const max = progressOrder(timeline, progress)
  let best = { order: -1, text: base }
  for (const revision of revisions) {
    const order = timeline.orderOf(revision.at)
    if (order === -1) throw new Error(`Unknown segment "${revision.at}"`)
    if (order <= max && order > best.order) best = { order, text: revision.text }
  }
  return best.text
}

export interface RecapChapter extends Omit<TimelineChapter, 'segments'> {
  segments: TimelineSegment[]
  /** True when every segment of the chapter is finished. */
  complete: boolean
}

/** The recap: every finished segment, grouped by chapter, in story order. */
export function getRecap(timeline: Timeline, progress: Progress): RecapChapter[] {
  const max = progressOrder(timeline, progress)
  return timeline.chapters
    .map((chapter) => {
      const segments = chapter.segments.filter((s) => s.order <= max)
      return { ...chapter, segments, complete: segments.length === chapter.segments.length }
    })
    .filter((chapter) => chapter.segments.length > 0)
}

/** 0..1 share of the known story that the player has finished. */
export function getProgressRatio(timeline: Timeline, progress: Progress): number {
  if (timeline.segments.length === 0) return 0
  return (progressOrder(timeline, progress) + 1) / timeline.segments.length
}

export function getNextSegment(
  timeline: Timeline,
  progress: Progress,
): TimelineSegment | undefined {
  return timeline.segments[progressOrder(timeline, progress) + 1]
}
