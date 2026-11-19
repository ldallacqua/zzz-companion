import type { Agent, Build, BuildVariant, DiscSet, WEngine } from '@zzz/core'
import { agentsById, buildsByAgent, discSetsById, isSpoilerWEngine, wEnginesById } from '@zzz/game'

/**
 * The build the landing page's product shot shows (Act 4, `LandingLoadout`): a launch S-Rank
 * whose name and art spoil nothing, and the same Agent as the README's builds screenshot.
 */
export const SHOWCASE_AGENT = 'ellen'

export interface LoadoutShowcase {
  agent: Agent
  build: Build
  variant: BuildVariant
  /** The first three W-Engines of the ladder (never a spoiler Agent's signature). */
  engines: WEngine[]
  /** The one the mock pretends the reader owns (#3), so the shot can say "Best you have". */
  owned: { engine: WEngine; rank: number }
  four: DiscSet
  two: DiscSet[]
}

export function loadoutShowcase(id: string = SHOWCASE_AGENT): LoadoutShowcase {
  const agent = agentsById.get(id)
  const build = buildsByAgent.get(id)
  const variant = build?.variants[0]
  if (!agent || agent.spoiler || !build || !variant) {
    throw new Error(`The landing showcase needs a non-spoiler Agent with a build, got "${id}"`)
  }
  const engines = variant.wEngines
    .flatMap((pick) => wEnginesById.get(pick.id) ?? [])
    .filter((w) => !isSpoilerWEngine(w))
    .slice(0, 3)
  const pick = variant.discs[0]
  const four = pick && discSetsById.get(pick.four)
  const owned = engines[2]
  if (!four || !owned) {
    throw new Error(`"${id}" needs three W-Engines and a 4-piece set for the landing showcase`)
  }
  const two = (pick.two[0] ?? []).flatMap((s) => discSetsById.get(s) ?? [])
  return { agent, build, variant, engines, owned: { engine: owned, rank: 3 }, four, two }
}
