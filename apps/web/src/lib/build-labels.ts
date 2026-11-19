import type { Locale, Priority, WEngine } from '@zzz/core'
import { agentsById, isSpoilerWEngine, statsById } from '@zzz/game'
import { isHidden } from './agent-filters'

/** A stat's full name in this locale ("Taxa CRIT"); unknown ids fall back to the id. */
export const statName = (id: string, locale: Locale) => statsById.get(id)?.name[locale] ?? id

/** A stat's short label for tight spots ("Prof. de Anomalia"). */
export const statShort = (id: string, locale: Locale) => {
  const stat = statsById.get(id)
  return stat ? (stat.short ?? stat.name)[locale] : id
}

/** A priority's ids as localized labels, keeping its groups. */
export const priorityLabels = (
  priority: Priority,
  locale: Locale,
  label: (id: string, locale: Locale) => string = statName,
) => priority.map((group) => group.map((id) => label(id, locale)))

/**
 * A W-Engine stays classified while its Agent is a spoiler the reader hasn't revealed or owned
 * (`owned`/`revealed` from the roster; pass null before it hydrates, which keeps it classified).
 */
export function isClassifiedWEngine(
  w: WEngine,
  roster: { owned: Record<string, number>; revealed: readonly string[] } | null,
) {
  if (!isSpoilerWEngine(w)) return false
  const agent = w.signature ? agentsById.get(w.signature) : undefined
  if (!agent || !roster) return true
  return isHidden(agent, roster.owned, roster.revealed)
}
