import { z } from 'zod'
import { IdSchema, LocalizedTextSchema, sameOrLocalized } from './schema'

/**
 * Game data (not story): the Agents a player can own, and the traits builds and pull advice will
 * reason about. Attributes, specialties and factions are data, not enums — the game keeps adding
 * them (Wind and Lumiflux arrived in 3.x, the Armorer specialty in 3.2).
 */

const nonEmpty = z.string().trim().min(1)
const hexColor = z.string().regex(/^#[0-9a-f]{6}$/i, 'colors are #rrggbb')

export const AttributeSchema = z.object({
  id: IdSchema,
  name: LocalizedTextSchema,
  /** Accent used for the attribute's chip and an agent tile's frame. */
  color: hexColor,
  /**
   * Agent-exclusive variants (Frost, Auric Ink, Honed Edge) count as their base attribute for
   * filters, Drive Disc sets and team bonuses.
   */
  base: IdSchema.optional(),
})
export type Attribute = z.infer<typeof AttributeSchema>
export type AttributeInput = z.input<typeof AttributeSchema>

export const SpecialtySchema = z.object({
  id: IdSchema,
  name: LocalizedTextSchema,
})
export type Specialty = z.infer<typeof SpecialtySchema>

export const GameFactionSchema = z.object({
  id: IdSchema,
  name: LocalizedTextSchema,
})
export type GameFaction = z.infer<typeof GameFactionSchema>

/** S and A come from Signal Search; agents outside that system (Pyrois) have no rank. */
export const AgentRankSchema = z.enum(['S', 'A'])
export type AgentRank = z.infer<typeof AgentRankSchema>

export const AgentSchema = z.object({
  /** Same id as the story character when the agent also appears in `@zzz/story`. */
  id: IdSchema,
  /** Full name, as each game client shows it. */
  name: sameOrLocalized(nonEmpty),
  /** The short name the game uses in lists and squads (e.g. "Lycaon"). Defaults to `name`. */
  short: sameOrLocalized(nonEmpty).optional(),
  rank: AgentRankSchema.optional(),
  attribute: IdSchema,
  specialty: IdSchema,
  faction: IdSchema,
  /** Game version the agent was released in, e.g. "1.0". */
  version: z.string().regex(/^\d+\.\d+$/),
  /** Release date (YYYY-MM-DD), used to sort newest first. */
  released: z.iso.date(),
  /** Square head-and-shoulders icon, hotlinked from the community wiki (never committed). */
  icon: z.url(),
  /**
   * The agent's name or art gives away story the app doesn't cover yet (Pyrois comes from a
   * 3.0 story quest). Hidden in lists until the reader asks to see it or owns the agent.
   */
  spoiler: z.boolean().default(false),
})
export type Agent = z.infer<typeof AgentSchema>
export type AgentInput = z.input<typeof AgentSchema>

/** Short name for tiles and squads. */
export const agentShortName = (agent: Agent) => agent.short ?? agent.name
