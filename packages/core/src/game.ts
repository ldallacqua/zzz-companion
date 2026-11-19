import { z } from 'zod'
import { IdSchema, LocalizedTextSchema, sameOrLocalized, SourceSchema } from './schema'

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

// --- Gear and builds (ADR 0015) -------------------------------------------------------------

export const WEngineRankSchema = z.enum(['S', 'A', 'B'])
export type WEngineRank = z.infer<typeof WEngineRankSchema>

export const WEngineSchema = z.object({
  id: IdSchema,
  name: sameOrLocalized(nonEmpty),
  rank: WEngineRankSchema,
  specialty: IdSchema,
  /** The Agent whose exclusive ("signature") W-Engine this is. */
  signature: IdSchema.optional(),
  released: z.iso.date(),
  /** Hotlinked from the community wiki (never committed). */
  icon: z.url(),
  /** What it does, in a few words (our wording of the game's effect text). */
  summary: LocalizedTextSchema.optional(),
})
export type WEngine = z.infer<typeof WEngineSchema>
export type WEngineInput = z.input<typeof WEngineSchema>

export const DiscSetSchema = z.object({
  id: IdSchema,
  name: sameOrLocalized(nonEmpty),
  icon: z.url(),
  /** The 2- and 4-piece bonuses, in our words. */
  two: LocalizedTextSchema.optional(),
  four: LocalizedTextSchema.optional(),
})
export type DiscSet = z.infer<typeof DiscSetSchema>
export type DiscSetInput = z.input<typeof DiscSetSchema>

export const StatSchema = z.object({
  id: IdSchema,
  /** As the game names it ("CRIT Rate", "Taxa CRIT"). */
  name: LocalizedTextSchema,
  /** A short label for tight spots ("ATK%"); defaults to `name`. */
  short: LocalizedTextSchema.optional(),
})
export type Stat = z.infer<typeof StatSchema>

/** The skill types a build ranks for upgrades, in the game's own order. */
export const SKILL_KINDS = ['basic', 'dodge', 'assist', 'special', 'chain'] as const
export const SkillKindSchema = z.enum(SKILL_KINDS)
export type SkillKind = z.infer<typeof SkillKindSchema>

/** Disc slots with a choice of main stat (1–3 are always HP, ATK and DEF). */
export const MAIN_STAT_SLOTS = ['4', '5', '6'] as const
export type MainStatSlot = (typeof MAIN_STAT_SLOTS)[number]

/** Ordered groups: `[['crit-rate', 'crit-dmg'], ['atk-pct']]` reads "CRIT Rate = CRIT DMG > ATK%". */
export const PrioritySchema = z.array(z.array(IdSchema).min(1)).min(1)
export type Priority = z.infer<typeof PrioritySchema>

export const BuildVariantSchema = z.object({
  /** Also the URL hash that opens this variant (`/builds/ellen/#crit`). */
  id: IdSchema,
  /** Required when the Agent has several variants (the tab labels). */
  name: LocalizedTextSchema.optional(),
  /** Best first. `phase` = the W-Engine's Overclock phase the ranking assumes (1–5). */
  wEngines: z
    .array(z.object({ id: IdSchema, phase: z.number().int().min(1).max(5).default(1) }))
    .min(1),
  /** 4-piece sets, best first, each with its 2-piece options (best first; inner = interchangeable). */
  discs: z
    .array(z.object({ four: IdSchema, two: z.array(z.array(IdSchema).min(1)).default([]) }))
    .min(1),
  main: z.object({ '4': PrioritySchema, '5': PrioritySchema, '6': PrioritySchema }),
  substats: PrioritySchema,
  /** Skill upgrade order, every kind once. */
  skills: z
    .array(SkillKindSchema)
    .length(SKILL_KINDS.length)
    .refine((s) => new Set(s).size === s.length, 'each skill kind once'),
})
export type BuildVariant = z.infer<typeof BuildVariantSchema>

export const BuildSchema = z.object({
  agent: IdSchema,
  /** The game version these picks last changed in, e.g. "3.1" (they may still be current). */
  updated: z.string().regex(/^\d+\.\d+$/),
  sources: z.array(SourceSchema).min(1),
  variants: z
    .array(BuildVariantSchema)
    .min(1)
    .refine((v) => v.length === 1 || v.every((x) => x.name), 'name every variant'),
})
export type Build = z.infer<typeof BuildSchema>
export type BuildInput = z.input<typeof BuildSchema>

/** "3.10" > "3.9": compares game versions numerically. */
export const compareVersions = (a: string, b: string) => {
  const [am = 0, an = 0] = a.split('.').map(Number)
  const [bm = 0, bn = 0] = b.split('.').map(Number)
  return am - bm || an - bn
}

/**
 * The highest-ranked W-Engine of a build that the player owns (`rank` is 1-based), or null.
 * The top pick itself counts: the UI only calls it out when it isn't #1.
 */
export function bestOwnedWEngine(
  variant: Pick<BuildVariant, 'wEngines'>,
  owned: Iterable<string>,
): { id: string; rank: number } | null {
  const have = new Set(owned)
  const index = variant.wEngines.findIndex((w) => have.has(w.id))
  return index < 0 ? null : { id: variant.wEngines[index]!.id, rank: index + 1 }
}
