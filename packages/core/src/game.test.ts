import { describe, expect, it } from 'vitest'
import { bestOwnedWEngine, BuildSchema, compareVersions } from './game'

const variant = {
  id: 'standard',
  wEngines: [
    { id: 'deep-sea-visitor' },
    { id: 'myriad-eclipse' },
    { id: 'starlight-engine', phase: 5 },
  ],
  discs: [{ four: 'woodpecker-electro', two: [['puffer-electro']] }],
  main: { '4': [['crit-dmg']], '5': [['pen-ratio'], ['ice-dmg']], '6': [['atk-pct']] },
  substats: [['crit-dmg', 'crit-rate'], ['atk-pct']],
  skills: ['chain', 'special', 'basic', 'dodge', 'assist'],
}
const build = {
  agent: 'ellen',
  updated: '2.5',
  sources: [{ label: 'Guide', url: 'https://example.com/ellen' }],
  variants: [variant],
}

describe('builds', () => {
  it('parses a build with defaults filled in', () => {
    const parsed = BuildSchema.parse(build)
    expect(parsed.variants[0]!.wEngines.map((w) => w.phase)).toEqual([1, 1, 5])
  })

  it('needs every skill kind exactly once', () => {
    const skills = ['chain', 'chain', 'basic', 'dodge', 'assist']
    expect(() => BuildSchema.parse({ ...build, variants: [{ ...variant, skills }] })).toThrow()
  })

  it('names every variant when there are several', () => {
    const two = { ...build, variants: [variant, { ...variant, id: 'crit' }] }
    expect(() => BuildSchema.parse(two)).toThrow()
    const named = {
      ...build,
      variants: [
        { ...variant, name: { en: 'Standard', 'pt-BR': 'Padrão' } },
        { ...variant, id: 'crit', name: { en: 'CRIT', 'pt-BR': 'CRIT' } },
      ],
    }
    expect(BuildSchema.parse(named).variants).toHaveLength(2)
  })

  it('finds the best W-Engine the player owns', () => {
    const v = BuildSchema.parse(build).variants[0]!
    expect(bestOwnedWEngine(v, [])).toBeNull()
    expect(bestOwnedWEngine(v, ['starlight-engine', 'myriad-eclipse'])).toEqual({
      id: 'myriad-eclipse',
      rank: 2,
    })
    expect(bestOwnedWEngine(v, new Set(['deep-sea-visitor']))).toEqual({
      id: 'deep-sea-visitor',
      rank: 1,
    })
  })

  it('compares game versions numerically', () => {
    expect(compareVersions('3.10', '3.9')).toBeGreaterThan(0)
    expect(compareVersions('2.5', '3.3')).toBeLessThan(0)
    expect(compareVersions('3.3', '3.3')).toBe(0)
  })
})
