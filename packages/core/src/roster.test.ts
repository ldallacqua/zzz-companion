import { describe, expect, it } from 'vitest'
import {
  mergeRosters,
  rosterFromMap,
  rosterToMap,
  RosterSchema,
  ROSTER_MAX_ENTRIES,
  sameRoster,
} from './roster'

describe('roster', () => {
  it('round-trips between list and map, sorted by id', () => {
    const map = { yanagi: 2, anby: 0, ellen: 6 }
    expect(rosterFromMap(map).map((e) => e.agentId)).toEqual(['anby', 'ellen', 'yanagi'])
    expect(rosterToMap(rosterFromMap(map))).toEqual(map)
  })

  it('merges as a union and keeps the higher Mindscape', () => {
    expect(mergeRosters({ anby: 1, ellen: 0 }, { ellen: 2, miyabi: 0 })).toEqual({
      anby: 1,
      ellen: 2,
      miyabi: 0,
    })
    expect(mergeRosters({}, {})).toEqual({})
  })

  it('compares rosters regardless of key order', () => {
    expect(sameRoster({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true)
    expect(sameRoster({ a: 1 }, { a: 2 })).toBe(false)
  })

  it('validates entries', () => {
    expect(RosterSchema.safeParse([{ agentId: 'anby', mindscape: 6 }]).success).toBe(true)
    expect(RosterSchema.safeParse([{ agentId: 'anby', mindscape: 7 }]).success).toBe(false)
    expect(RosterSchema.safeParse([{ agentId: 'anby', mindscape: 1.5 }]).success).toBe(false)
    expect(RosterSchema.safeParse([{ agentId: 'Not An Id', mindscape: 0 }]).success).toBe(false)
    expect(
      RosterSchema.safeParse([
        { agentId: 'anby', mindscape: 0 },
        { agentId: 'anby', mindscape: 1 },
      ]).success,
    ).toBe(false)
    const tooMany = Array.from({ length: ROSTER_MAX_ENTRIES + 1 }, (_, i) => ({
      agentId: `a-${i}`,
      mindscape: 0,
    }))
    expect(RosterSchema.safeParse(tooMany).success).toBe(false)
  })
})
