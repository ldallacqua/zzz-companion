import { describe, expect, it } from 'vitest'
import { LOCALES } from '@zzz/core'
import {
  characters,
  charactersById,
  factions,
  factionsById,
  glossary,
  linkableEntities,
  timeline,
} from './index'

/**
 * Content integrity tests. These are the guard rails that keep the recap spoiler-safe
 * no matter who (or which AI) edits the content.
 */
describe('story content', () => {
  it('has a non-empty timeline', () => {
    expect(timeline.segments.length).toBeGreaterThan(0)
  })

  it('every gated item points at a real segment', () => {
    for (const item of [...characters, ...factions, ...glossary]) {
      expect(timeline.orderOf(item.unlockedAt), `${item.id} → ${item.unlockedAt}`).not.toBe(-1)
    }
  })

  it('segments only reference characters that are already unlocked (no spoiler leaks)', () => {
    for (const segment of timeline.segments) {
      for (const id of segment.characters) {
        const character = charactersById.get(id)
        expect(character, `unknown character "${id}" in ${segment.id}`).toBeDefined()
        const unlockedAt = timeline.orderOf(character!.unlockedAt)
        expect(
          unlockedAt,
          `${id} appears in ${segment.id} before it is unlocked (${character!.unlockedAt})`,
        ).toBeLessThanOrEqual(segment.order)
      }
    }
  })

  it('characters only belong to factions the reader already knows', () => {
    for (const character of characters) {
      for (const factionId of character.factions) {
        const faction = factionsById.get(factionId)
        expect(faction, `unknown faction "${factionId}"`).toBeDefined()
        expect(timeline.orderOf(faction!.unlockedAt)).toBeLessThanOrEqual(
          timeline.orderOf(character.unlockedAt),
        )
      }
    }
  })

  it('every character is introduced in the segment that unlocks them', () => {
    for (const character of characters) {
      const segment = timeline.getSegment(character.unlockedAt)!
      const appearsLater = timeline.segments.some((s) => s.characters.includes(character.id))
      expect(appearsLater, `${character.id} never appears in any segment`).toBe(true)
      expect(segment).toBeDefined()
    }
  })

  it('has full translations with balanced bold markup', () => {
    for (const segment of timeline.segments) {
      for (const locale of LOCALES) {
        for (const paragraph of segment.summary[locale]) {
          const stars = paragraph.match(/\*\*/g)?.length ?? 0
          expect(stars % 2, `unbalanced ** in ${segment.id} (${locale})`).toBe(0)
        }
      }
      expect(segment.summary.en.length).toBe(segment.summary['pt-BR'].length)
    }
  })

  it('every glossary term is reachable from the recap text in every locale (aliases are right)', () => {
    for (const locale of LOCALES) {
      const corpus = timeline.segments
        .flatMap((s) => [s.tldr[locale], ...s.summary[locale]])
        .join('\n')
        .replace(/\*\*/g, '')
      for (const entity of linkableEntities.filter((e) => e.kind === 'term')) {
        const found = entity.aliases[locale].some((alias) => corpus.includes(alias))
        expect(found, `${entity.key} has no alias found in ${locale} text`).toBe(true)
      }
    }
  })

  it('ids are unique across characters, factions and glossary', () => {
    for (const list of [characters, factions, glossary]) {
      const ids = list.map((i) => i.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })
})
