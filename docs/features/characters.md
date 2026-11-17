# Feature spec — Characters and character files

## Goal

Answer "who is this again?" with everything the reader is allowed to know, and nothing more.

## User stories

- I browse everyone I've met, filtered by faction (Characters page).
- I open a character's **file**: full-body art, their name and factions, where I first saw them,
  what I know about them **now**, and — when the story changed what I knew — the earlier notes,
  newest first, each "as of" the part where I learned it.
- I see the parts they appear in and jump back to that part of the recap.
- I see who they're often seen with and open those files too.
- For playable Agents, I see that builds are coming.
- A character I haven't met shows a generic "File locked" page that tells me nothing about them.

## Design

Design consultation (before building) by a UI/UX + art-direction agent; decisions:

- **Poster** as a video-store rental sleeve: chamfered frame in the character's colour, colour
  slab, giant outlined name, halftone, a hazard "floor" and scanlines. Art kinds
  (`character.art`): `cutout` (transparent full body, sticker edge), `bust` (head-and-shoulders
  rising from the floor), `scene` (opaque still as a taped screen grab). Missing art falls back to
  outlined initials in the same box. The poster is decorative (`aria-hidden`); the h1 names them.
- **Layout**: stacked cover on phones (identity label overlapping the poster), two columns with a
  sticky poster from `md`, plus a vertical spine on `lg`.
- **Dossier**: "Now" on top, earlier notes newest first, ending at "On file since". No counts, ghost
  rows or "more to come". Hidden when there is only one note.
- **Motion**: transform/clip only (pull-back on the figure, wipe on the slab, stamp on badges);
  everything static with motion reduced or off.

## Acceptance criteria

- Every id has a static page; the HTML and metadata of every page, in both locales, contain no
  name, text or image of the character (e2e, ADR 0010). Pages are `noindex`.
- With progress before `unlockedAt`, the file is locked and shows nothing about them; after it,
  the file opens in place.
- Notes come from `knownHistoryAt`: never a revision past the reader's progress.
- "Appears in" lists only finished parts and links to `/recap#part-<id>`.
- pt-BR uses the Portuguese client's names (Fairy is "Fada").
- No horizontal overflow at 360px (long pt-BR faction names wrap); no serious axe violations;
  tap targets ≥ 40px; every component has stories.

## Later

Builds and the pull advisor in the file; a shared-element transition from the index card; tappable
names inside notes; time-aware faction membership; previous/next file navigation.
