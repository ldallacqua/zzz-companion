// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { agents, isSpoilerWEngine } from '@zzz/game'
import { loadoutShowcase, SHOWCASE_AGENT } from './loadout-showcase'

describe('landing loadout showcase', () => {
  it('shows a non-spoiler Agent with a full build', () => {
    const shot = loadoutShowcase()
    expect(shot.agent.id).toBe(SHOWCASE_AGENT)
    expect(shot.agent.spoiler).toBeFalsy()
    expect(shot.engines).toHaveLength(3)
    expect(shot.engines.some(isSpoilerWEngine)).toBe(false)
    expect(shot.owned.engine).toBe(shot.engines[2])
    expect(shot.four.icon).toMatch(/^https:/)
  })

  it('refuses a spoiler Agent', () => {
    const spoiler = agents.find((a) => a.spoiler)
    expect(spoiler, 'the roster has a spoiler Agent to test with').toBeDefined()
    expect(() => loadoutShowcase(spoiler!.id)).toThrow(/non-spoiler/)
  })
})
