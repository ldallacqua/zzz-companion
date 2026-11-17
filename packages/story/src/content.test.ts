import { describe, expect, it } from 'vitest'
import { createEntityMatcher, LOCALES, type LocalizedText, type Revision } from '@zzz/core'
import {
  characters,
  charactersById,
  factions,
  factionsById,
  glossary,
  linkableEntities,
  timeline,
} from './index'

/** WCAG relative luminance and contrast ratio of two #rrggbb colours. */
const luminance = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!
}
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi! + 0.05) / (lo! + 0.05)
}
/** `--color-surface` and `--color-primary-foreground` in packages/ui/src/styles.css. */
const SURFACE = '#111114'
const INK = '#0b0d02'

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

  // Names show on avatars, cards and intel cards from `unlockedAt` on. A character the story only
  // describes ("a woman in red") must not unlock before the recap actually names them.
  it('every character is named in the recap text by the time they unlock', () => {
    for (const locale of LOCALES) {
      for (const entity of linkableEntities.filter((e) => e.kind === 'character')) {
        const unlockedAt = timeline.orderOf(entity.unlockedAt)
        const corpus = timeline.segments
          .filter((s) => s.order <= unlockedAt)
          .flatMap((s) => [s.tldr[locale], ...s.summary[locale]])
          .join('\n')
          .replace(/\*\*/g, '')
        const named = entity.aliases[locale].some((alias) => corpus.includes(alias))
        expect(
          named,
          `${entity.key} unlocks at ${entity.unlockedAt} but is not named in the ${locale} text up to there`,
        ).toBe(true)
      }
    }
  })

  it('every segment lists the same episodes in every locale', () => {
    for (const segment of timeline.segments) {
      expect(segment.episodes['pt-BR'].length, segment.id).toBe(segment.episodes.en.length)
    }
  })

  // Character colours are used as text on the surface (names, outlines) and as backgrounds for
  // dark text (character file spine, chips). Both must stay readable.
  it('character colours keep text readable (WCAG AA)', () => {
    for (const c of characters) {
      expect(c.color, c.id).toMatch(/^#[0-9a-f]{6}$/i)
      expect(contrast(c.color, SURFACE), `${c.id} on surface`).toBeGreaterThanOrEqual(4.5)
      expect(contrast(INK, c.color), `dark text on ${c.id}`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('ids are unique across characters, factions and glossary', () => {
    for (const list of [characters, factions, glossary]) {
      const ids = list.map((i) => i.id)
      expect(new Set(ids).size).toBe(ids.length)
    }
  })

  // Every entry text, with the segment from which a reader can see it.
  const versions = linkableEntities.flatMap((entity) => {
    const base: LocalizedText =
      entity.kind === 'character'
        ? entity.data.blurb
        : entity.kind === 'term'
          ? entity.data.definition
          : entity.data.description
    const revisions: Revision[] = entity.data.revisions
    return [
      { key: entity.key, at: entity.unlockedAt, text: base },
      ...revisions.map((r) => ({ key: entity.key, at: r.at, text: r.text })),
    ]
  })

  // When the pt-BR client renames someone (Fairy → Fada, Miguel Silver → Miguel Argento), the
  // English-only names must not leak into pt-BR text.
  it('pt-BR text uses the pt-BR names of characters', () => {
    const corpus = [
      ...timeline.segments.flatMap((s) => [s.tldr['pt-BR'], ...s.summary['pt-BR']]),
      ...versions.map((v) => v.text['pt-BR']),
    ]
      .join('\n')
      .replace(/\*\*/g, '')
    for (const c of characters) {
      // Word by word, so half-translated names (“Argento Tears”) are caught too.
      const words = (names: string[]) => names.flatMap((n) => n.split(/\s+/)).filter(Boolean)
      const ptWords = new Set(words([c.name['pt-BR'], ...c.aliases['pt-BR']]))
      for (const en of words([c.name.en, ...c.aliases.en]).filter((w) => !ptWords.has(w))) {
        const word = new RegExp(
          `(?<![\\p{L}])${en.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?![\\p{L}])`,
          'u',
        )
        expect(corpus, `"${en}" (${c.id}) appears in pt-BR text`).not.toMatch(word)
      }
    }
  })

  it('revisions come after the entry is unlocked, in story order', () => {
    for (const entity of linkableEntities) {
      let previous = timeline.orderOf(entity.unlockedAt)
      for (const revision of entity.data.revisions) {
        const order = timeline.orderOf(revision.at)
        expect(order, `${entity.key} revision → unknown segment ${revision.at}`).not.toBe(-1)
        expect(
          order,
          `${entity.key} revision at ${revision.at} is not after the previous text`,
        ).toBeGreaterThan(previous)
        previous = order
      }
    }
  })

  it('no entry text names anything the reader has not met by the time it is shown', () => {
    for (const locale of LOCALES) {
      const matcher = createEntityMatcher(
        linkableEntities.map((e) => ({ key: e.key, aliases: e.aliases[locale] })),
      )
      const unlockedAtByKey = new Map(linkableEntities.map((e) => [e.key, e.unlockedAt]))
      for (const version of versions) {
        const shownAt = timeline.orderOf(version.at)
        for (const match of version.text[locale].matchAll(matcher.pattern!)) {
          const key = matcher.keyByAlias.get(match[0])!
          expect(
            timeline.orderOf(unlockedAtByKey.get(key)!),
            `${version.key} (${locale}, from ${version.at}) mentions ${key} before it is unlocked`,
          ).toBeLessThanOrEqual(shownAt)
        }
      }
    }
  })
})
