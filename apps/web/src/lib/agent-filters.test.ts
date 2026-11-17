import { describe, expect, it } from 'vitest'
import type { RosterMap } from '@zzz/core'
import { agents } from '@zzz/game'
import {
  EMPTY_FILTERS,
  filterAgents,
  hasActiveFilters,
  isHidden,
  normalize,
  ownedCount,
  traitFilterCount,
  type AgentFilters,
} from './agent-filters'

const run = (
  patch: Partial<AgentFilters> = {},
  owned: RosterMap = {},
  opts: Parameters<typeof filterAgents>[4] = {},
  locale: 'en' | 'pt-BR' = 'en',
) => filterAgents(agents, owned, { ...EMPTY_FILTERS, ...patch }, locale, opts).map((a) => a.id)

describe('agent filters', () => {
  it('normalizes accents and case', () => {
    expect(normalize('  Lúcia ÉLOWEN ')).toBe('lucia elowen')
  })

  it('keeps spoiler agents hidden until revealed or owned', () => {
    const pyrois = agents.find((a) => a.id === 'pyrois')!
    expect(isHidden(pyrois, {})).toBe(true)
    expect(isHidden(pyrois, { pyrois: 0 })).toBe(false)
    expect(isHidden(pyrois, {}, ['pyrois'])).toBe(false)
    // Listed (as Classified) in the plain list, but never matched by a search or a filter.
    expect(run()).toContain('pyrois')
    expect(run({ query: 'pyro' })).toEqual([])
    expect(run({ attributes: ['ether'] })).not.toContain('pyrois')
    expect(run({ view: 'owned' })).not.toContain('pyrois')
    expect(run({ query: 'pyro' }, {}, { revealed: ['pyrois'] })).toEqual(['pyrois'])
  })

  it('searches full and short names in both languages, without accents', () => {
    expect(run({ query: 'lycaon' })).toEqual(['lycaon'])
    expect(run({ query: 'lúcia' }, {}, {}, 'pt-BR')).toContain('lucia')
    expect(run({ query: 'elowen' }, {}, {}, 'pt-BR')).toEqual(['lucia'])
    expect(run({ query: 'gatilho' }, {}, {}, 'pt-BR')).toEqual(['trigger'])
    expect(run({ query: 'trigger' }, {}, {}, 'pt-BR')).toEqual(['trigger'])
    expect(run({ query: 'rina' })).toContain('rina')
  })

  it('folds attribute variants into their base', () => {
    const ice = run({ attributes: ['ice'] })
    expect(ice).toContain('miyabi') // Frost
    expect(ice).toContain('ellen')
    expect(ice).not.toContain('anby')
  })

  it('filters by specialty, rank and owned view', () => {
    const owned = { anby: 0, ellen: 2 }
    expect(run({ view: 'owned' }, owned).sort()).toEqual(['anby', 'ellen'])
    expect(run({ view: 'missing' }, owned)).not.toContain('anby')
    expect(run({ ranks: ['A'] }, owned)).toContain('anby')
    expect(run({ ranks: ['A'] }, owned)).not.toContain('ellen')
    expect(run({ specialties: ['stun'], view: 'owned' }, owned)).toEqual(['anby'])
  })

  it('keeps pinned agents in place when they stop matching the view', () => {
    const pinned = new Set(['anby'])
    expect(run({ view: 'missing' }, { anby: 0 }, { pinned })).toContain('anby')
    expect(run({ view: 'owned' }, {}, { pinned })).toEqual(['anby'])
  })

  it('sorts newest first or by name', () => {
    expect(run()[0]).toBe(agents[0]!.id)
    const az = run({ sort: 'az' })
    expect(az.indexOf('alice')).toBeLessThan(az.indexOf('zhao'))
  })

  it('counts owned agents over every released agent', () => {
    expect(ownedCount(agents, { anby: 0, pyrois: 1 })).toEqual({ owned: 2, total: agents.length })
  })

  it('knows when filters are active', () => {
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false)
    expect(hasActiveFilters({ ...EMPTY_FILTERS, query: ' ' })).toBe(false)
    expect(hasActiveFilters({ ...EMPTY_FILTERS, view: 'owned' })).toBe(true)
    expect(traitFilterCount({ ...EMPTY_FILTERS, ranks: ['S'], attributes: ['ice', 'fire'] })).toBe(
      3,
    )
  })
})
