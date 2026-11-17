import { agentShortName, type Agent, type AgentRank, type Locale, type RosterMap } from '@zzz/core'
import { baseAttributeOf } from '@zzz/game'

export type OwnedView = 'all' | 'owned' | 'missing'
export type AgentSort = 'newest' | 'az'

export interface AgentFilters {
  query: string
  /** Base attribute ids (Frost counts as Ice). Empty = any. */
  attributes: string[]
  specialties: string[]
  ranks: AgentRank[]
  view: OwnedView
  sort: AgentSort
}

export const EMPTY_FILTERS: AgentFilters = {
  query: '',
  attributes: [],
  specialties: [],
  ranks: [],
  view: 'all',
  sort: 'newest',
}

/** Case- and accent-insensitive ("lucia" finds "Lúcia"). */
export const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()

/** Number of trait filters on (search and view not included), for the Filters button badge. */
export const traitFilterCount = (f: AgentFilters) =>
  f.attributes.length + f.specialties.length + f.ranks.length

export const hasActiveFilters = (f: AgentFilters) =>
  f.query.trim() !== '' || traitFilterCount(f) > 0 || f.view !== 'all'

/** The list is narrower than "every agent" (Mark all only makes sense then). */
export const isNarrowed = hasActiveFilters

/** Names a search matches: full and short, in this locale and in English (players mix both). */
function searchable(agent: Agent, locale: Locale) {
  return normalize(
    [
      agent.name[locale],
      agent.name.en,
      agentShortName(agent)[locale],
      agentShortName(agent).en,
    ].join(' '),
  )
}

/** A spoiler agent shows as a "Classified" tile until it is revealed or owned. */
export const isHidden = (agent: Agent, owned: RosterMap, revealed: readonly string[] = []) =>
  agent.spoiler && !(agent.id in owned) && !revealed.includes(agent.id)

interface FilterOptions {
  /** Spoiler-flagged agents the reader chose to see. */
  revealed?: readonly string[]
  /**
   * Agents edited since the filters last changed: they keep their place even if they no longer
   * match the Owned / Missing view, so tiles never vanish under the reader's finger.
   */
  pinned?: ReadonlySet<string>
}

/**
 * Agents to show, newest first or A–Z. Hidden spoiler agents never match a search or a trait
 * filter (that would hint at what they are): they only appear, as Classified, in the plain list.
 */
export function filterAgents(
  agents: Agent[],
  owned: RosterMap,
  filters: AgentFilters,
  locale: Locale,
  { revealed = [], pinned }: FilterOptions = {},
): Agent[] {
  const query = normalize(filters.query)
  const narrowed = query !== '' || traitFilterCount(filters) > 0
  const list = agents.filter((agent) => {
    const isOwned = agent.id in owned
    if (isHidden(agent, owned, revealed)) return !narrowed && filters.view !== 'owned'
    if (!pinned?.has(agent.id)) {
      if (filters.view === 'owned' && !isOwned) return false
      if (filters.view === 'missing' && isOwned) return false
    }
    if (filters.attributes.length && !filters.attributes.includes(baseAttributeOf(agent)))
      return false
    if (filters.specialties.length && !filters.specialties.includes(agent.specialty)) return false
    if (filters.ranks.length && (!agent.rank || !filters.ranks.includes(agent.rank))) return false
    if (query && !searchable(agent, locale).includes(query)) return false
    return true
  })
  if (filters.sort === 'az') {
    const name = (a: Agent) => agentShortName(a)[locale]
    list.sort((a, b) => name(a).localeCompare(name(b), locale))
  }
  return list
}

/** Owned / total over every released agent (hidden ones count in the total). */
export const ownedCount = (agents: Agent[], owned: RosterMap) => ({
  owned: agents.filter((a) => a.id in owned).length,
  total: agents.length,
})
