import { parseInlineMarkup } from './inline-markup'

/**
 * Entity linking: turns plain recap text into tokens where known names
 * (characters, glossary terms, factions) become references the UI can make clickable.
 * Pure and deterministic so it can be unit-tested and reused by any frontend.
 */

export type EntityKind = 'character' | 'term' | 'faction'

/** Stable key such as `term:hand` or `character:koleda`. */
export type EntityKey = `${EntityKind}:${string}`

export const entityKey = (kind: EntityKind, id: string): EntityKey => `${kind}:${id}`

export interface EntityAliases {
  key: EntityKey
  aliases: readonly string[]
}

export interface EntityMatcher {
  pattern: RegExp | null
  keyByAlias: ReadonlyMap<string, EntityKey>
}

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/**
 * Builds one regex for all aliases. Longest aliases win ("Dead End Hollow" before "Hollow"),
 * matching is case-sensitive (so "TOPS" ≠ "tops") and respects Unicode word boundaries.
 * When two entities share an alias, the first one registered wins.
 */
export function createEntityMatcher(entries: readonly EntityAliases[]): EntityMatcher {
  const keyByAlias = new Map<string, EntityKey>()
  for (const { key, aliases } of entries) {
    for (const alias of aliases) {
      const a = alias.trim()
      if (a && !keyByAlias.has(a)) keyByAlias.set(a, key)
    }
  }
  if (keyByAlias.size === 0) return { pattern: null, keyByAlias }
  const alternation = [...keyByAlias.keys()]
    .sort((a, b) => b.length - a.length)
    .map(escapeRegExp)
    .join('|')
  const pattern = new RegExp(`(?<![\\p{L}\\p{N}_])(?:${alternation})(?![\\p{L}\\p{N}_])`, 'gu')
  return { pattern, keyByAlias }
}

export interface RichToken {
  value: string
  strong: boolean
  /** Set on the first mention of an entity within the block. */
  entity?: EntityKey
}

/**
 * Tokenizes a block of paragraphs (bold markup + entity links).
 * Only the first mention of each entity in the block is linked, like an encyclopedia.
 */
export function tokenizeRich(paragraphs: readonly string[], matcher: EntityMatcher): RichToken[][] {
  const seen = new Set<EntityKey>()
  return paragraphs.map((paragraph) => {
    const out: RichToken[] = []
    for (const token of parseInlineMarkup(paragraph)) {
      const strong = token.type === 'strong'
      if (!matcher.pattern) {
        out.push({ value: token.value, strong })
        continue
      }
      let last = 0
      for (const match of token.value.matchAll(matcher.pattern)) {
        const key = matcher.keyByAlias.get(match[0])
        if (!key || seen.has(key)) continue
        seen.add(key)
        const index = match.index ?? 0
        if (index > last) out.push({ value: token.value.slice(last, index), strong })
        out.push({ value: match[0], strong, entity: key })
        last = index + match[0].length
      }
      if (last < token.value.length) out.push({ value: token.value.slice(last), strong })
    }
    return out
  })
}

/** Removes a trailing parenthetical: "Esfera Negra (Hollow)" → "Esfera Negra". */
export const stripParenthetical = (s: string) => s.replace(/\s*\([^)]*\)\s*$/, '').trim()
