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

/** One version of an entry's text, and the story part where the reader learned it. */
export interface KnownNote {
  at: string
  text: LocalizedText
  /** The text the entry starts with at `unlockedAt` (not a revision). */
  isBase: boolean
}

/**
 * Every version of an entry the reader has unlocked, oldest first: the base text at `unlockedAt`,
 * then each finished revision. Empty while the entry itself is locked. Nothing later than the
 * reader's progress is ever returned, so a "file" built from it never hints at what's next.
 */
export function knownHistoryAt(
  timeline: Timeline,
  progress: Progress,
  entry: { unlockedAt: string; revisions?: readonly Revision[] },
  base: LocalizedText,
): KnownNote[] {
  if (!isUnlocked(timeline, progress, entry.unlockedAt)) return []
  const max = progressOrder(timeline, progress)
  const revisions = (entry.revisions ?? [])
    .map((revision) => {
      const order = timeline.orderOf(revision.at)
      if (order === -1) throw new Error(`Unknown segment "${revision.at}"`)
      return { revision, order }
    })
    .filter(({ order }) => order <= max)
    .sort((a, b) => a.order - b.order)
  return [
    { at: entry.unlockedAt, text: base, isBase: true },
    ...revisions.map(({ revision }) => ({ at: revision.at, text: revision.text, isBase: false })),
  ]
}

/** The finished recap parts a character appears in, grouped by chapter, in story order. */
export function appearancesOf(
  timeline: Timeline,
  progress: Progress,
  characterId: string,
): RecapChapter[] {
  return getRecap(timeline, progress)
    .map((chapter) => ({
      ...chapter,
      segments: chapter.segments.filter((s) => s.characters.includes(characterId)),
    }))
    .filter((chapter) => chapter.segments.length > 0)
}

export interface RelatedCharacter<C> {
  character: C
  /** Finished parts both characters appear in. */
  sharedParts: number
  sameFaction: boolean
}

/**
 * Unlocked characters the reader has most often seen with `characterId` (shared finished parts),
 * then those from the same faction. Empty while `characterId` is locked.
 */
export function relatedCharacters<
  C extends { id: string; unlockedAt: string; factions: readonly string[] },
>(
  timeline: Timeline,
  progress: Progress,
  characterId: string,
  all: readonly C[],
  limit = 6,
): RelatedCharacter<C>[] {
  const self = all.find((c) => c.id === characterId)
  if (!self || !isUnlocked(timeline, progress, self.unlockedAt)) return []
  const finished = getRecap(timeline, progress).flatMap((c) => c.segments)
  return all
    .filter((c) => c.id !== characterId && isUnlocked(timeline, progress, c.unlockedAt))
    .map((character) => ({
      character,
      sharedParts: finished.filter(
        (s) => s.characters.includes(characterId) && s.characters.includes(character.id),
      ).length,
      sameFaction: character.factions.some((f) => self.factions.includes(f)),
    }))
    .filter((r) => r.sharedParts > 0 || r.sameFaction)
    .sort((a, b) => b.sharedParts - a.sharedParts || Number(b.sameFaction) - Number(a.sameFaction))
    .slice(0, limit)
}
