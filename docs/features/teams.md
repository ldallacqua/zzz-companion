# Teams (planned)

The best teams for every Agent: the ones you can field today, and the ones you're one Agent away
from. Status: **planned**. It's next on the roadmap, after [Builds](builds.md) and before rotations.

## Why a feature of its own

- A team is a cross-Agent object: three Agents (plus a Bangboo) with synergies that no single
  build shows. In the game, Additional Abilities trigger when teammates share an attribute or
  faction, and teams are shaped by roles: Stun, Attack, Anomaly, Support, Defense and Rupture.
- The roster makes it useful. With My Agents we can say which teams you can field now and which
  ones need one more Agent.
- The features after it depend on it. A rotation is how to play a build **in a team**, and the
  pull advisor weighs which pull completes a team.

## Shape (to be refined when it's built)

- **`/[locale]/teams/`**: teams by Agent and by archetype, with "Can field now" and "One Agent
  away" when there is a roster. Search and filters work like My Agents and Builds.
- **On each build page**: the reserved "Teams & rotation" panel becomes "Best teams" for the
  Agent, linking to the team. Rotations then fill in how to play the build in each team.
- **Navigation**: no sixth tab on phones. A "Builds | Teams" switch sits at the top of both pages.
- **Roster rules** ("can field", "one away") are pure functions in `@zzz/core`, tested like
  `mergeRosters`.

## Data rules (same bar as builds)

- Researched from the sources a build cites, never from memory, and cited in each team's
  `sources`. Keep the picks only, in our own words.
- Both locales. Before the copy uses them, confirm the pt-BR client terms on the wiki for "Squad"
  and "Additional Ability".
- Spoiler Agents stay classified in teams, as in My Agents and on build pages, until the reader
  shows or owns them.
