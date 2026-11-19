import { describe, expect, it } from 'vitest'
import { compareVersions, LOCALES, MAIN_STAT_SLOTS } from '@zzz/core'
import {
  agents,
  agentsById,
  builds,
  BUILDS_REVIEWED_FOR,
  discSets,
  discSetsById,
  GAME_VERSION,
  slotStats,
  specialtiesById,
  stats,
  statsById,
  substatPool,
  wEngines,
  wEnginesById,
} from './index'

const unique = (ids: string[]) => new Set(ids).size === ids.length
const WIKI = /^https:\/\/static\.wikia\.nocookie\.net\//

describe('gear', () => {
  it('has unique ids and names in every locale', () => {
    expect(unique(wEngines.map((w) => w.id))).toBe(true)
    expect(unique(discSets.map((d) => d.id))).toBe(true)
    expect(unique(stats.map((s) => s.id))).toBe(true)
    for (const item of [...wEngines, ...discSets, ...stats])
      for (const locale of LOCALES) expect(item.name[locale].trim(), item.id).not.toBe('')
  })

  it('no localized text carries wiki markup or HTML entities', () => {
    const texts = [...wEngines, ...discSets, ...stats].flatMap((item) => [
      ...LOCALES.map((l) => item.name[l]),
      ...('summary' in item && item.summary ? LOCALES.map((l) => item.summary![l]) : []),
      ...('two' in item && item.two ? LOCALES.map((l) => item.two![l]) : []),
      ...('four' in item && item.four ? LOCALES.map((l) => item.four![l]) : []),
    ])
    for (const text of texts) expect(text).not.toMatch(/&[a-z]+;|&#\d+;|\{\{|\[\[|'''/)
  })

  it('W-Engines point at a real specialty and, if exclusive, a real Agent', () => {
    for (const w of wEngines) {
      expect(specialtiesById.has(w.specialty), `${w.id} → ${w.specialty}`).toBe(true)
      if (w.signature) expect(agentsById.has(w.signature), `${w.id} → ${w.signature}`).toBe(true)
    }
  })

  it('icons come from the community wiki CDN (art is never committed)', () => {
    for (const item of [...wEngines, ...discSets]) expect(item.icon, item.id).toMatch(WIKI)
  })
})

describe('builds', () => {
  it('one build per Agent, for real Agents', () => {
    expect(unique(builds.map((b) => b.agent))).toBe(true)
    for (const b of builds) expect(agentsById.has(b.agent), b.agent).toBe(true)
  })

  it('every Agent has a build', () => {
    const missing = agents.filter((a) => !builds.some((b) => b.agent === a.id)).map((a) => a.id)
    expect(missing).toEqual([])
  })

  it('dates every build to a released game version and cites its sources', () => {
    expect(compareVersions(BUILDS_REVIEWED_FOR, GAME_VERSION)).toBeLessThanOrEqual(0)
    for (const b of builds) {
      expect(compareVersions(b.updated, BUILDS_REVIEWED_FOR), b.agent).toBeLessThanOrEqual(0)
      expect(b.sources.length, b.agent).toBeGreaterThan(0)
    }
  })

  it('variants have unique ids', () => {
    for (const b of builds) expect(unique(b.variants.map((v) => v.id)), b.agent).toBe(true)
  })

  it('recommends real W-Engines (each once) and real Drive Disc sets', () => {
    for (const b of builds)
      for (const v of b.variants) {
        const where = `${b.agent}/${v.id}`
        expect(unique(v.wEngines.map((w) => w.id)), where).toBe(true)
        for (const w of v.wEngines) expect(wEnginesById.has(w.id), `${where} → ${w.id}`).toBe(true)
        for (const d of v.discs)
          for (const id of [d.four, ...d.two.flat()])
            expect(discSetsById.has(id), `${where} → ${id}`).toBe(true)
      }
  })

  it('main stats are ones the slot can roll, substats ones a disc can roll', () => {
    for (const b of builds)
      for (const v of b.variants) {
        for (const slot of MAIN_STAT_SLOTS)
          for (const id of v.main[slot].flat())
            expect(slotStats[slot], `${b.agent}/${v.id} slot ${slot}: ${id}`).toContain(id)
        for (const id of v.substats.flat())
          expect(substatPool, `${b.agent}/${v.id} substat ${id}`).toContain(id)
      }
    for (const ids of [...Object.values(slotStats), substatPool])
      for (const id of ids) expect(statsById.has(id), id).toBe(true)
  })

  it('a priority never lists a stat twice', () => {
    for (const b of builds)
      for (const v of b.variants)
        for (const p of [v.main['4'], v.main['5'], v.main['6'], v.substats])
          expect(unique(p.flat()), `${b.agent}/${v.id}`).toBe(true)
  })

  it('every recommended item has a summary in our words, in both locales', () => {
    for (const b of builds)
      for (const v of b.variants) {
        for (const { id } of v.wEngines) {
          const w = wEnginesById.get(id)
          for (const locale of LOCALES)
            expect(w?.summary?.[locale], `${id} (${locale})`).toBeTruthy()
        }
        for (const id of v.discs.flatMap((d) => [d.four, ...d.two.flat()])) {
          const set = discSetsById.get(id)
          for (const locale of LOCALES) {
            expect(set?.two?.[locale], `${id} 2-piece (${locale})`).toBeTruthy()
            expect(set?.four?.[locale], `${id} 4-piece (${locale})`).toBeTruthy()
          }
        }
      }
  })
})
