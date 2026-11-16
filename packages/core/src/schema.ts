import { z } from 'zod'

/**
 * Domain contract for the companion app.
 * Every piece of story content is validated against these schemas in CI,
 * so these types are the single source of truth for humans and AI agents alike.
 */

export const LOCALES = ['en', 'pt-BR'] as const
export const LocaleSchema = z.enum(LOCALES)
export type Locale = z.infer<typeof LocaleSchema>

/** A value that must exist in every supported locale. */
export const localized = <T extends z.ZodType>(schema: T) =>
  z.object({ en: schema, 'pt-BR': schema })
export type Localized<T> = Record<Locale, T>

const nonEmpty = z.string().trim().min(1)
export const LocalizedTextSchema = localized(nonEmpty)
export type LocalizedText = z.infer<typeof LocalizedTextSchema>
export const LocalizedParagraphsSchema = localized(z.array(nonEmpty).min(1))

/** kebab-case ids keep URLs, storage keys and test names predictable. */
export const IdSchema = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'ids must be kebab-case')

export const SourceSchema = z.object({
  label: nonEmpty,
  url: z.url(),
})
export type Source = z.infer<typeof SourceSchema>

/**
 * How well a summary is backed by primary sources (full transcripts) vs. secondary ones.
 * `partial` is surfaced in the UI so readers know a section is lighter on detail.
 */
export const ConfidenceSchema = z.enum(['high', 'partial'])
export type Confidence = z.infer<typeof ConfidenceSchema>

export const SegmentSchema = z.object({
  id: IdSchema,
  title: LocalizedTextSchema,
  /** In-game episode names this segment covers, as shown in the English client. */
  episodes: z.array(nonEmpty).min(1),
  /** One-sentence version for the TL;DR mode. */
  tldr: LocalizedTextSchema,
  /** Full recap. Supports **bold** inline markup only. */
  summary: LocalizedParagraphsSchema,
  /** Character ids that appear in this segment. Each must be unlocked at or before it. */
  characters: z.array(IdSchema).default([]),
  confidence: ConfidenceSchema.default('high'),
})
export type Segment = z.infer<typeof SegmentSchema>
export type SegmentInput = z.input<typeof SegmentSchema>

export const ChapterKindSchema = z.enum(['prologue', 'chapter', 'intermission', 'interlude'])
export type ChapterKind = z.infer<typeof ChapterKindSchema>

export const ChapterSchema = z.object({
  id: IdSchema,
  kind: ChapterKindSchema,
  /** Short label such as "Ch. 1A" or "Prologue". */
  label: LocalizedTextSchema,
  title: LocalizedTextSchema,
  /** Game version the chapter shipped in, e.g. "1.0". */
  version: z.string().regex(/^\d+\.\d+$/),
  /** Accent color for the chapter "tape" (any CSS color). */
  accent: nonEmpty,
  segments: z.array(SegmentSchema).min(1),
  sources: z.array(SourceSchema).min(1),
})
export type Chapter = z.infer<typeof ChapterSchema>
export type ChapterInput = z.input<typeof ChapterSchema>

/** Anything that can be spoiler-gated points at the segment where it becomes known. */
export const GatedSchema = z.object({ unlockedAt: IdSchema })

/**
 * What the reader knows about an entry changes as the story goes on (a suspect is cleared, a
 * secret comes out). A revision replaces the entry's text from segment `at` onward. Revisions are
 * gated like everything else: they are never shown to a reader (or in a recap part) before `at`.
 */
export const RevisionSchema = z.object({
  at: IdSchema,
  text: LocalizedTextSchema,
})
export type Revision = z.infer<typeof RevisionSchema>
const revisions = z.array(RevisionSchema).default([])

/**
 * Extra spellings that should link to an entity inside recap text (plurals, short names,
 * official pt-BR variants). The canonical name/term is always included automatically.
 */
export const LocalizedAliasesSchema = localized(z.array(nonEmpty)).optional()

export const FactionSchema = GatedSchema.extend({
  id: IdSchema,
  name: LocalizedTextSchema,
  /** What the reader knows about the group at `unlockedAt`. */
  description: LocalizedTextSchema,
  /** Later versions of `description`, in story order (see RevisionSchema). */
  revisions,
  aliases: LocalizedAliasesSchema,
})
export type Faction = z.infer<typeof FactionSchema>
export type FactionInput = z.input<typeof FactionSchema>

export const CharacterSchema = GatedSchema.extend({
  id: IdSchema,
  name: nonEmpty,
  /** Faction ids. Kept as data (not an enum) because the game keeps adding factions. */
  factions: z.array(IdSchema).default([]),
  /** What the reader knows about them at `unlockedAt` - never later facts. */
  blurb: LocalizedTextSchema,
  /** Later versions of `blurb`, in story order (see RevisionSchema). */
  revisions,
  image: z.url().optional(),
  /**
   * Framing for crops of `image`: where the face is (fractions of the image's width/height)
   * and how far to zoom for a waist-up shot (image height ÷ frame height).
   * Full-body art usually needs ~2; head-and-shoulders art ~1.
   */
  focus: z
    .object({
      x: z.number().min(0).max(1),
      y: z.number().min(0).max(1),
      zoom: z.number().min(0.5).max(5),
      /** The art has its own background, so crops must cover the whole frame (no visible edge). */
      opaque: z.boolean().optional(),
    })
    .default({ x: 0.5, y: 0.13, zoom: 2.1 }),
  /** Accent color used by the card frame. */
  color: nonEmpty,
  /** Short names / nicknames used in recap text (same in every locale). */
  aliases: z.array(nonEmpty).default([]),
})
export type Character = z.infer<typeof CharacterSchema>
export type CharacterInput = z.input<typeof CharacterSchema>

export const GlossaryTermSchema = GatedSchema.extend({
  id: IdSchema,
  term: LocalizedTextSchema,
  definition: LocalizedTextSchema,
  /** Later versions of `definition`, in story order (see RevisionSchema). */
  revisions,
  aliases: LocalizedAliasesSchema,
})
export type GlossaryTerm = z.infer<typeof GlossaryTermSchema>
export type GlossaryTermInput = z.input<typeof GlossaryTermSchema>

/** What the player has finished. `null` means nothing yet (show nothing spoilery). */
export const ProgressSchema = z.object({
  lastSegmentId: IdSchema.nullable(),
})
export type Progress = z.infer<typeof ProgressSchema>
