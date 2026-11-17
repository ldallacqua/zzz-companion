import { describe, expect, it } from 'vitest'
import { LOCALES } from '@zzz/core'
import { characters, factionsById as storyFactionsById } from '@zzz/story'
import {
  agents,
  agentsById,
  attributes,
  attributesById,
  baseAttributes,
  gameFactions,
  gameFactionsById,
  specialties,
  specialtiesById,
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
/** The darkest and lightest surfaces an attribute colour sits on (packages/ui/src/styles.css). */
const SURFACES = ['#08080a', '#111114', '#18181c', '#222228']
const INK = '#0b0d02'

const unique = (ids: string[]) => new Set(ids).size === ids.length

describe('game data', () => {
  it('has unique ids', () => {
    expect(unique(agents.map((a) => a.id))).toBe(true)
    expect(unique(attributes.map((a) => a.id))).toBe(true)
    expect(unique(specialties.map((s) => s.id))).toBe(true)
    expect(unique(gameFactions.map((f) => f.id))).toBe(true)
  })

  it('every agent points at a real attribute, specialty and faction', () => {
    for (const agent of agents) {
      expect(attributesById.has(agent.attribute), `${agent.id} → ${agent.attribute}`).toBe(true)
      expect(specialtiesById.has(agent.specialty), `${agent.id} → ${agent.specialty}`).toBe(true)
      expect(gameFactionsById.has(agent.faction), `${agent.id} → ${agent.faction}`).toBe(true)
    }
  })

  it('attribute variants fold into a base attribute', () => {
    for (const attribute of attributes) {
      if (!attribute.base) continue
      const base = attributesById.get(attribute.base)
      expect(base, `${attribute.id} → ${attribute.base}`).toBeDefined()
      expect(base?.base, `${attribute.base} must itself be a base attribute`).toBeUndefined()
    }
    expect(baseAttributes.length).toBeGreaterThan(0)
  })

  it('names exist in every locale', () => {
    for (const item of [...agents, ...attributes, ...specialties, ...gameFactions]) {
      for (const locale of LOCALES) expect(item.name[locale].trim(), item.id).not.toBe('')
    }
  })

  it('attribute colours are legible as text and as a fill under dark ink', () => {
    for (const { id, color } of attributes) {
      for (const surface of SURFACES)
        expect(contrast(color, surface), `${id} on ${surface}`).toBeGreaterThanOrEqual(4.5)
      expect(contrast(color, INK), `ink on ${id}`).toBeGreaterThanOrEqual(4.5)
    }
  })

  it('icons come from the community wiki CDN (art is never committed)', () => {
    for (const agent of agents)
      expect(agent.icon, agent.id).toMatch(/^https:\/\/static\.wikia\.nocookie\.net\//)
  })

  it('every playable story character is an agent with the same id', () => {
    for (const character of characters.filter((c) => c.playable)) {
      expect(agentsById.has(character.id), `story "${character.id}" has no agent`).toBe(true)
    }
  })

  it('factions shared with the story use the same names', () => {
    for (const faction of gameFactions) {
      const story = storyFactionsById.get(faction.id)
      if (story) expect(faction.name, faction.id).toEqual(story.name)
    }
  })

  it('lists agents newest first', () => {
    const dates = agents.map((a) => a.released)
    expect(dates).toEqual([...dates].sort().reverse())
  })
})
