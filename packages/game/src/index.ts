import {
  AgentSchema,
  AttributeSchema,
  BuildSchema,
  compareVersions,
  DiscSetSchema,
  GameFactionSchema,
  SpecialtySchema,
  WEngineSchema,
  type Agent,
  type Attribute,
  type Build,
  type DiscSet,
  type GameFaction,
  type Specialty,
  type WEngine,
} from '@zzz/core'
import { agents as agentInput } from './agents'
import { builds as buildInput, BUILDS_REVIEWED_FOR } from './builds'
import { discSets as discSetInput } from './disc-sets'
import { discSetNotes, wEngineNotes } from './gear-notes'
import { stats } from './stats'
import { wEngines as wEngineInput } from './w-engines'
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

// --- Gear and builds (ADR 0015) -------------------------------------------------------------

/** Newest first, like the game's own W-Engine list. Summaries come from `gear-notes.ts`. */
export const wEngines: WEngine[] = wEngineInput
  .map((w) => WEngineSchema.parse({ ...w, summary: wEngineNotes[w.id] }))
  .sort((a, b) => b.released.localeCompare(a.released) || a.name.en.localeCompare(b.name.en))
export const discSets: DiscSet[] = discSetInput.map((d) =>
  DiscSetSchema.parse({ ...d, ...discSetNotes[d.id] }),
)
export const builds: Build[] = buildInput.map((b) => BuildSchema.parse(b))

export const wEnginesById = new Map(wEngines.map((w) => [w.id, w]))
export const discSetsById = new Map(discSets.map((d) => [d.id, d]))
export const statsById = new Map(stats.map((s) => [s.id, s]))
export const buildsByAgent = new Map(builds.map((b) => [b.agent, b]))

/**
 * The game version the data describes (the newest Agent's). When builds were last reviewed for an
 * older version, every build page says some picks may have changed.
 */
export const GAME_VERSION = agents.reduce(
  (v, a) => (compareVersions(a.version, v) > 0 ? a.version : v),
  '1.0',
)

/** A W-Engine whose name or art would give away a spoiler Agent (their signature). */
export const isSpoilerWEngine = (w: WEngine) =>
  w.signature !== undefined && agentsById.get(w.signature)?.spoiler === true

export { BUILDS_REVIEWED_FOR }
export { fixedSlotStats, slotStats, stats, substatPool } from './stats'
