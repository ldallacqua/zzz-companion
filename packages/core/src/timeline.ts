import { ChapterSchema, type Chapter, type ChapterInput, type Segment } from './schema'

export interface TimelineSegment extends Segment {
  /** 0-based position in the whole story. */
  order: number
  chapterId: string
}

export interface TimelineChapter extends Omit<Chapter, 'segments'> {
  order: number
  segments: TimelineSegment[]
}

export interface Timeline {
  chapters: TimelineChapter[]
  segments: TimelineSegment[]
  /** Global order of a segment, or -1 when the id is unknown or null. */
  orderOf(segmentId: string | null | undefined): number
  getSegment(segmentId: string): TimelineSegment | undefined
  getChapter(chapterId: string): TimelineChapter | undefined
}

/**
 * Validates chapters and flattens them into one ordered story line.
 * The order of the input array IS story order.
 */
export function buildTimeline(input: readonly ChapterInput[]): Timeline {
  const chapters = input.map((c) => ChapterSchema.parse(c))
  const seen = new Set<string>()
  const segments: TimelineSegment[] = []

  const timelineChapters: TimelineChapter[] = chapters.map((chapter, chapterIndex) => {
    if (seen.has(chapter.id)) throw new Error(`Duplicate id "${chapter.id}"`)
    seen.add(chapter.id)
    const chapterSegments = chapter.segments.map((segment) => {
      if (seen.has(segment.id)) throw new Error(`Duplicate id "${segment.id}"`)
      seen.add(segment.id)
      const s: TimelineSegment = { ...segment, order: segments.length, chapterId: chapter.id }
      segments.push(s)
      return s
    })
    return { ...chapter, order: chapterIndex, segments: chapterSegments }
  })

  const segmentsById = new Map(segments.map((s) => [s.id, s]))
  const chaptersById = new Map(timelineChapters.map((c) => [c.id, c]))

  return {
    chapters: timelineChapters,
    segments,
    orderOf: (id) => (id ? (segmentsById.get(id)?.order ?? -1) : -1),
    getSegment: (id) => segmentsById.get(id),
    getChapter: (id) => chaptersById.get(id),
  }
}
