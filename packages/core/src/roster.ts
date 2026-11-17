import { z } from 'zod'
import { IdSchema } from './schema'

/**
 * The player's roster: which Agents they own and at what Mindscape Cinema level (M0–M6).
 * Shared by the web app (local copy + sync) and the API (validation), so both agree on the shape.
 */

export const MINDSCAPE_MAX = 6
/** Generous cap: the game has ~60 agents; this only stops abuse of the API. */
export const ROSTER_MAX_ENTRIES = 300

export const MindscapeSchema = z.number().int().min(0).max(MINDSCAPE_MAX)

export const RosterEntrySchema = z.object({
  agentId: IdSchema.max(64),
  mindscape: MindscapeSchema,
})
export type RosterEntry = z.infer<typeof RosterEntrySchema>

export const RosterSchema = z
  .array(RosterEntrySchema)
  .max(ROSTER_MAX_ENTRIES)
  .refine((entries) => new Set(entries.map((e) => e.agentId)).size === entries.length, {
    message: 'Each agent can appear only once',
  })
export type Roster = z.infer<typeof RosterSchema>

/** Map form used by the UI: agent id → Mindscape level. Absent = not owned. */
export type RosterMap = Record<string, number>

export const rosterToMap = (roster: Roster): RosterMap =>
  Object.fromEntries(roster.map((e) => [e.agentId, e.mindscape]))

/** Sorted by agent id, so equal rosters serialize the same way. */
export const rosterFromMap = (map: RosterMap): Roster =>
  Object.entries(map)
    .map(([agentId, mindscape]) => ({ agentId, mindscape }))
    .sort((a, b) => a.agentId.localeCompare(b.agentId))

/**
 * Union of two rosters (e.g. what a guest picked on this device + what their account already
 * has). Owning an agent is never undone by a merge, and the higher Mindscape wins: a merge can't
 * know which side is newer, and losing a pick is worse than keeping one.
 */
export function mergeRosters(a: RosterMap, b: RosterMap): RosterMap {
  const out: RosterMap = { ...a }
  for (const [id, level] of Object.entries(b)) out[id] = Math.max(out[id] ?? 0, level)
  return out
}

export const sameRoster = (a: RosterMap, b: RosterMap) =>
  JSON.stringify(rosterFromMap(a)) === JSON.stringify(rosterFromMap(b))
