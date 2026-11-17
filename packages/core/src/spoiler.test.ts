import { describe, expect, it } from 'vitest'
import type { ChapterInput } from './schema'
import { buildTimeline } from './timeline'
import {
  getNextSegment,
  getProgressRatio,
  getRecap,
  isUnlocked,
  appearancesOf,
  knownHistoryAt,
  knownTextAt,
  partitionUnlocked,
  relatedCharacters,
} from './spoiler'
import { parseInlineMarkup } from './inline-markup'

const t = (s: string) => ({ en: s, 'pt-BR': s })
const segment = (id: string) => ({
  id,
  title: t(id),
  episodes: { en: [id], 'pt-BR': [id] },
  tldr: t(`${id} tldr`),
  summary: { en: [`${id} summary`], 'pt-BR': [`${id} resumo`] },
})
const chapter = (id: string, segmentIds: string[]): ChapterInput => ({
  id,
  kind: 'chapter',
  label: t(id),
  title: t(id),
  version: '1.0',
  accent: '#fff',
  segments: segmentIds.map(segment),
  sources: [{ label: 'test', url: 'https://example.com' }],
})

const timeline = buildTimeline([chapter('ch-1', ['a', 'b']), chapter('ch-2', ['c', 'd', 'e'])])

describe('buildTimeline', () => {
  it('orders segments across chapters', () => {
    expect(timeline.segments.map((s) => [s.id, s.order, s.chapterId])).toEqual([
      ['a', 0, 'ch-1'],
      ['b', 1, 'ch-1'],
      ['c', 2, 'ch-2'],
      ['d', 3, 'ch-2'],
      ['e', 4, 'ch-2'],
    ])
  })

  it('rejects duplicate ids', () => {
    expect(() => buildTimeline([chapter('x', ['a']), chapter('y', ['a'])])).toThrow(/Duplicate/)
  })

  it('rejects content missing a locale', () => {
    const broken = chapter('x', ['a'])
    // @ts-expect-error - deliberately invalid content
    broken.segments[0].tldr = { en: 'only english' }
    expect(() => buildTimeline([broken])).toThrow()
  })
})

describe('spoiler gating', () => {
  it('unlocks nothing before the player sets progress', () => {
    const progress = { lastSegmentId: null }
    expect(getRecap(timeline, progress)).toEqual([])
    expect(isUnlocked(timeline, progress, 'a')).toBe(false)
    expect(getProgressRatio(timeline, progress)).toBe(0)
  })

  it('never returns a segment after the current progress', () => {
    for (const current of timeline.segments) {
      const recap = getRecap(timeline, { lastSegmentId: current.id })
      const shown = recap.flatMap((c) => c.segments)
      expect(shown.every((s) => s.order <= current.order)).toBe(true)
      expect(shown).toHaveLength(current.order + 1)
    }
  })

  it('marks chapters complete only when every segment is finished', () => {
    const recap = getRecap(timeline, { lastSegmentId: 'c' })
    expect(recap.map((c) => [c.id, c.complete])).toEqual([
      ['ch-1', true],
      ['ch-2', false],
    ])
  })

  it('partitions gated items and counts what stays hidden', () => {
    const items = [
      { id: 'early', unlockedAt: 'a' },
      { id: 'late', unlockedAt: 'e' },
    ]
    const result = partitionUnlocked(timeline, { lastSegmentId: 'b' }, items)
    expect(result.unlocked.map((i) => i.id)).toEqual(['early'])
    expect(result.lockedCount).toBe(1)
  })

  it('throws on unknown gate ids so typos never leak content', () => {
    expect(() => isUnlocked(timeline, { lastSegmentId: 'a' }, 'nope')).toThrow(/Unknown/)
  })

  it('suggests the next segment', () => {
    expect(getNextSegment(timeline, { lastSegmentId: null })?.id).toBe('a')
    expect(getNextSegment(timeline, { lastSegmentId: 'b' })?.id).toBe('c')
    expect(getNextSegment(timeline, { lastSegmentId: 'e' })).toBeUndefined()
  })
})

describe('parseInlineMarkup', () => {
  it('splits bold tokens', () => {
    expect(parseInlineMarkup('a **b** c')).toEqual([
      { type: 'text', value: 'a ' },
      { type: 'strong', value: 'b' },
      { type: 'text', value: ' c' },
    ])
  })

  it('keeps plain text intact', () => {
    expect(parseInlineMarkup('plain')).toEqual([{ type: 'text', value: 'plain' }])
  })
})

describe('knownTextAt', () => {
  const base = t('a stranger')
  const revisions = [
    { at: 'd', text: t('cleared of all charges') },
    { at: 'b', text: t('a suspect') },
  ]
  const at = (lastSegmentId: string | null) =>
    knownTextAt(timeline, { lastSegmentId }, base, revisions)

  it('uses the base text before any revision is reached', () => {
    expect(at('a').en).toBe('a stranger')
    expect(at(null).en).toBe('a stranger')
  })

  it('switches to a revision exactly at its segment', () => {
    expect(at('b').en).toBe('a suspect')
    expect(at('c').en).toBe('a suspect')
  })

  it('picks the latest reached revision, whatever the array order', () => {
    expect(at('d').en).toBe('cleared of all charges')
    expect(at('e').en).toBe('cleared of all charges')
  })

  it('works without revisions and rejects unknown segments', () => {
    expect(knownTextAt(timeline, { lastSegmentId: 'e' }, base).en).toBe('a stranger')
    expect(() =>
      knownTextAt(timeline, { lastSegmentId: 'e' }, base, [{ at: 'zz', text: base }]),
    ).toThrow()
  })
})

describe('character files', () => {
  const base = t('base')
  const entry = {
    unlockedAt: 'b',
    revisions: [
      { at: 'e', text: t('learned in e') },
      { at: 'c', text: t('learned in c') },
    ],
  }

  it('knownHistoryAt: nothing while the entry is locked', () => {
    expect(knownHistoryAt(timeline, { lastSegmentId: 'a' }, entry, base)).toEqual([])
    expect(knownHistoryAt(timeline, { lastSegmentId: null }, entry, base)).toEqual([])
  })

  it('knownHistoryAt: base text, then finished revisions in story order, never later ones', () => {
    const at = (id: string) =>
      knownHistoryAt(timeline, { lastSegmentId: id }, entry, base).map((n) => [n.at, n.isBase])
    expect(at('b')).toEqual([['b', true]])
    expect(at('d')).toEqual([
      ['b', true],
      ['c', false],
    ])
    expect(at('e')).toEqual([
      ['b', true],
      ['c', false],
      ['e', false],
    ])
  })

  const timelineWithCast = buildTimeline([
    {
      ...chapter('ch-1', ['a', 'b']),
      segments: [
        { ...segment('a'), characters: ['x', 'y'] },
        { ...segment('b'), characters: ['x', 'z'] },
      ],
    },
    {
      ...chapter('ch-2', ['c']),
      segments: [{ ...segment('c'), characters: ['x', 'y'] }],
    },
  ])
  const cast = [
    { id: 'x', unlockedAt: 'a', factions: ['f1'] },
    { id: 'y', unlockedAt: 'a', factions: [] },
    { id: 'z', unlockedAt: 'b', factions: [] },
    { id: 'w', unlockedAt: 'a', factions: ['f1'] },
    { id: 'later', unlockedAt: 'c', factions: ['f1'] },
  ]

  it('appearancesOf: only finished parts that feature the character, grouped by chapter', () => {
    const at = (id: string) =>
      appearancesOf(timelineWithCast, { lastSegmentId: id }, 'x').map((c) => [
        c.id,
        c.segments.map((s) => s.id),
      ])
    expect(at('a')).toEqual([['ch-1', ['a']]])
    expect(at('c')).toEqual([
      ['ch-1', ['a', 'b']],
      ['ch-2', ['c']],
    ])
    expect(appearancesOf(timelineWithCast, { lastSegmentId: 'c' }, 'z').map((c) => c.id)).toEqual([
      'ch-1',
    ])
  })

  it('relatedCharacters: shared finished parts first, then same faction; never locked ones', () => {
    const related = (id: string) =>
      relatedCharacters(timelineWithCast, { lastSegmentId: id }, 'x', cast).map((r) => [
        r.character.id,
        r.sharedParts,
        r.sameFaction,
      ])
    expect(related('a')).toEqual([
      ['y', 1, false],
      ['w', 0, true],
    ])
    expect(related('c')).toEqual([
      ['y', 2, false],
      ['z', 1, false],
      ['w', 0, true],
      ['later', 0, true],
    ])
    expect(relatedCharacters(timelineWithCast, { lastSegmentId: null }, 'x', cast)).toEqual([])
  })
})
