import {
  buildTimeline,
  CharacterSchema,
  entityKey,
  FactionSchema,
  GlossaryTermSchema,
  LOCALES,
  stripParenthetical,
  type Character,
  type EntityKey,
  type Faction,
  type GlossaryTerm,
  type Localized,
} from '@zzz/core'
import { prologue } from './chapters/prologue'
import { chapter1a, chapter1b, zeroZone } from './chapters/chapter-1'
import { chapter2a, chapter2b } from './chapters/chapter-2'
import { interlude2a, interlude2b } from './chapters/interlude-2'
import { characters as characterInput, factions as factionInput } from './characters'
import { glossary as glossaryInput } from './glossary'

/** Story order. Add new chapters at the end, in the order the game presents them. */
export const chapterInputs = [
  prologue,
  chapter1a,
  chapter1b,
  zeroZone,
  chapter2a,
  chapter2b,
  interlude2a,
  interlude2b,
]

export const timeline = buildTimeline(chapterInputs)
export const characters: Character[] = characterInput.map((c) => CharacterSchema.parse(c))
export const factions: Faction[] = factionInput.map((f) => FactionSchema.parse(f))
export const glossary: GlossaryTerm[] = glossaryInput.map((g) => GlossaryTermSchema.parse(g))

export const charactersById = new Map(characters.map((c) => [c.id, c]))
export const factionsById = new Map(factions.map((f) => [f.id, f]))
export const glossaryById = new Map(glossary.map((g) => [g.id, g]))

/** Everything that can be linked from recap text, with its spoiler gate. */
export type LinkableEntity =
  | {
      key: EntityKey
      kind: 'character'
      unlockedAt: string
      aliases: Localized<string[]>
      data: Character
    }
  | {
      key: EntityKey
      kind: 'term'
      unlockedAt: string
      aliases: Localized<string[]>
      data: GlossaryTerm
    }
  | {
      key: EntityKey
      kind: 'faction'
      unlockedAt: string
      aliases: Localized<string[]>
      data: Faction
    }

const withCanonical = (
  canonical: Localized<string>,
  extra?: Localized<string[]>,
): Localized<string[]> =>
  Object.fromEntries(
    LOCALES.map((l) => [l, [stripParenthetical(canonical[l]), ...(extra?.[l] ?? [])]]),
  ) as Localized<string[]>

/**
 * Registration order matters: when two entities share an alias, the first wins.
 * Characters first (people are what readers tap most), then glossary, then factions.
 */
export const linkableEntities: LinkableEntity[] = [
  ...characters.map((c) => ({
    key: entityKey('character', c.id),
    kind: 'character' as const,
    unlockedAt: c.unlockedAt,
    aliases: Object.fromEntries(LOCALES.map((l) => [l, [c.name[l], ...c.aliases[l]]])) as Localized<
      string[]
    >,
    data: c,
  })),
  ...glossary.map((g) => ({
    key: entityKey('term', g.id),
    kind: 'term' as const,
    unlockedAt: g.unlockedAt,
    aliases: withCanonical(g.term, g.aliases),
    data: g,
  })),
  ...factions.map((f) => ({
    key: entityKey('faction', f.id),
    kind: 'faction' as const,
    unlockedAt: f.unlockedAt,
    aliases: withCanonical(f.name, f.aliases),
    data: f,
  })),
]

export const linkableByKey = new Map(linkableEntities.map((e) => [e.key, e]))

/** Where the story content stops. Shown in the UI so players know what is covered. */
export const coverage = {
  lastChapterId: interlude2b.id,
  gameVersion: '1.0',
} as const
