# Builds

What to equip on every Agent. Data and sourcing: [ADR 0015](../adr/0015-builds-data.md).

## Index (`/[locale]/builds/`)

- Every released Agent as a tile that opens their build. Tiles are in colour for everyone (a
  catalogue, not a checklist); owned Agents add their frame colour and Mindscape (M0–M6).
- **The player's Agents come first** ("Your Agents"), then "Other Agents". With no roster there is
  one grid ("All Agents") and a hint that links to My Agents.
- My Agents' search, filters (rank, attribute, specialty) and sort. Spoiler Agents show as
  "Classified" until shown or owned.
- A strip says how many Agents have builds and the game version the data describes.

## Agent page (`/[locale]/builds/[agent]/`)

- **Identity**: name, rank, attribute (variants show their base, e.g. "Ice · Frost"), specialty and
  "Picks from {version} · checked for {reviewed}". A row says whether the Agent is in My Agents
  (with their Mindscape) or offers "I have this Agent", which adds them at M0.
- **Variants**: when an Agent has several builds, tabs switch between them; the URL hash names the
  variant (`#crit`), so each one has a link. A line says what changes between them ("slot 4 and
  substats"). Only the slots that change roll to their new stat.
- **Loadout board**: the six disc slots around the Agent, 1 on top then clockwise like the game.
  Slots 1–3 are fixed (HP, ATK, DEF) and recede; 4–6 show the main stat to aim for and the
  fallbacks. Below: the 4 + 2 set split and the top W-Engine, plus "Best you have" when the player
  owns a lower-ranked one.
- **W-Engines**: ranked list (#1 large), each with rank, "Signature" for the Agent's own, the
  Overclock phase when the ranking assumes duplicates (P5), a one-line summary and an "I have it"
  toggle. Lists longer than four collapse.
- **Drive Discs**: the best 4-piece set (both bonuses) and 2-piece set, each with up to two
  alternatives. When the source names no 2-piece set, the board says the other two slots can be
  any set.
- **Substats** and **skill priority** as ordered chains (ties shown with "=").
- **Rotation**: reserved, "Soon" — it arrives with team rotations, per variant.
- **Sources**: the build guide it was compiled from and the wiki, plus a note that item summaries
  are our own words. If builds were last reviewed for an older version than the game's, a warning
  says some picks may have changed.
- Spoiler Agents: a generic "Classified Agent" page (no name, art or picks) until shown or owned.

## Navigation

- Header (from lg): Home · Recap · Characters · Glossary | Agents · Builds. Below lg (phones and
  tablets) the tab bar has Recap · Characters · Glossary · Agents · Builds; the logo links home.
- The character file's Build section links to the Agent's build; the landing page's roster act
  has "See builds". "All builds" returns to the Agent's tile in the index.

## Data on the device

- Owned W-Engines are saved in this browser (`zzz-arsenal`), marked from any build page. They are
  not synced to accounts yet.

## Not in v1

- W-Engine sync with accounts, a Drive Disc inventory and "what your gear is missing".
- Target stats (e.g. CRIT ratio), Mindscape-specific notes, team context, rotations.
