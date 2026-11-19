# ADR 0015 — Builds as researched game data, with variants ready for rotations

- Status: accepted
- Date: 2026-11-18
- Builds on [ADR 0011](0011-accounts-and-roster-sync.md) (game data and the roster) and
  [ADR 0010](0010-character-file-pages.md) (generic shells for spoiler entities).

## Context

Builds come before team rotations on the roadmap: how an Agent is played depends on what they
equip. A build page needs data the app didn't have: every W-Engine and Drive Disc set (names in
both locales, icons, effects), the stats each disc slot can roll, and a recommendation per Agent.
Recommendations are opinions that change with patches, and the repo's rule is that content is
researched and cited, never written from memory.

## Decision

- **Catalogues come from the wiki.** `@zzz/game` gains `w-engines.ts` (103 W-Engines: rank,
  specialty, release, signature Agent) and `disc-sets.ts` (30 sets the game still drops), pulled
  from each page's infobox, categories and "Other Languages" table (pt-BR names), icons hotlinked
  from the wiki CDN like Agent icons. Stats and slot pools live in `stats.ts`, named as each
  client shows them (PV, ATQ, Taxa CRIT…).
- **What items do is written by us.** `gear-notes.ts` holds one-line summaries of each W-Engine's
  effect and each set's 2- and 4-piece bonuses, in both locales, paraphrased from the wiki's effect
  text. Every item a build recommends must have one.
- **Recommendations are compiled from a community guide and cited per build.** `builds.ts` has one
  build per Agent with its source link: W-Engines in order (with the Overclock phase a ranking
  assumes), 4-piece sets with their 2-piece options, main-stat priorities for slots 4–6, substat
  priority and skill order. Priorities are ordered groups (ties allowed). An empty 2-piece list
  means the source names no specific set: the page says the other two slots can be any set. We keep
  the picks only, never the guide's write-ups or calculations, and check them against the items'
  effects.
- **Two dates.** `updated` is the version a build's picks last changed in (many builds stay right
  for several patches). `BUILDS_REVIEWED_FOR` is the version every build was last re-checked for;
  the page shows both ("Picks from 2.4 · checked for 3.3"), and when it falls behind the newest
  Agent's version, every build page says some picks may have changed instead of hiding anything.
- **Variants are first-class.** A build has one or more named variants (Caesar: CRIT / Anomaly)
  where the sources clearly split; the page says what changes between them (computed from the data,
  e.g. "slot 4 and substats"). Each variant is addressable by URL hash (`/builds/caesar/#anomaly`)
  so the page stays one static file per Agent, and each will get its own rotation.
- **Personal answers stay on the device for now.** The player marks the W-Engines they own from a
  build's list (`zzz-arsenal` in `localStorage`); the page calls out the best one they have. It
  isn't synced to accounts yet (that needs an API migration, a later change). "What your gear is
  missing" needs a Drive Disc inventory and is left for later.
- **Spoiler Agents stay classified.** A `spoiler: true` Agent's build page and metadata are generic
  and `noindex`; their signature W-Engine shows as "Classified" in other Agents' lists until the
  reader shows or owns them. Every other build page renders in full on the server and is indexed.

## Consequences

- Each new Agent needs a build in the same change; `builds.test.ts` fails otherwise, and also
  checks references, slot pools, ordering rules and summaries in both locales.
- Regenerating the catalogues after a patch is a data pull; summaries for new items are written
  by hand.
- When a guide's picks change, the entry is edited and `updated` bumped; after re-checking every
  build for a new version, `BUILDS_REVIEWED_FOR` is bumped.
- A few pt-BR mechanic names in summaries (Aftershock, Abloom, Refringe, Windswept, Assault) stay in
  English until the pt-BR client's terms are confirmed.
