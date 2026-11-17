import {
  AgentSchema,
  AttributeSchema,
  GameFactionSchema,
  SpecialtySchema,
  type Agent,
  type Attribute,
  type GameFaction,
  type Specialty,
} from '@zzz/core'
import { agents as agentInput } from './agents'
import {
  attributes as attributeInput,
  gameFactions as factionInput,
  specialties as specialtyInput,
} from './traits'

/** Newest first (then by name), the order the game's own agent list favours. */
export const agents: Agent[] = agentInput
  .map((a) => AgentSchema.parse(a))
  .sort((a, b) => b.released.localeCompare(a.released) || a.name.en.localeCompare(b.name.en))
export const attributes: Attribute[] = attributeInput.map((a) => AttributeSchema.parse(a))
export const specialties: Specialty[] = specialtyInput.map((s) => SpecialtySchema.parse(s))
export const gameFactions: GameFaction[] = factionInput.map((f) => GameFactionSchema.parse(f))

export const agentsById = new Map(agents.map((a) => [a.id, a]))
export const attributesById = new Map(attributes.map((a) => [a.id, a]))
export const specialtiesById = new Map(specialties.map((s) => [s.id, s]))
export const gameFactionsById = new Map(gameFactions.map((f) => [f.id, f]))

/** Base attributes only (variants such as Frost fold into Ice), for filters. */
export const baseAttributes = attributes.filter((a) => !a.base)

/** The base attribute an agent counts as (Miyabi's Frost → Ice). */
export const baseAttributeOf = (agent: Agent) => {
  const attribute = attributesById.get(agent.attribute)
  return attribute?.base ?? agent.attribute
}

/** Specialties that at least one agent has, in data order. */
export const usedSpecialties = specialties.filter((s) => agents.some((a) => a.specialty === s.id))
