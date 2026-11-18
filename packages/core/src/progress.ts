import { z } from 'zod'
import { IdSchema } from './schema'

/**
 * Story progress as an account stores it (ADR 0014): the last part the reader finished
 * (`null` = not started) and when they set it, on their device (ms since the epoch).
 *
 * Shared by the API and the web app. Segment ids are not checked against the story here: an
 * account written by a newer web build may hold parts this build doesn't know yet.
 */
export const SavedProgressSchema = z.object({
  lastSegmentId: IdSchema.max(80).nullable(),
  setAt: z.number().int().nonnegative(),
})
export type SavedProgress = z.infer<typeof SavedProgressSchema>

/**
 * Which copy wins when a device and the account disagree: the most recent choice. Progress can
 * move backwards on purpose (re-reading from an earlier part), so "furthest" would be wrong.
 * A tie keeps the account's copy, so devices converge.
 */
export function newerProgress(device: SavedProgress, account: SavedProgress | null): SavedProgress {
  if (!account) return device
  return device.setAt > account.setAt ? device : account
}

export const sameProgress = (a: SavedProgress | null, b: SavedProgress | null) =>
  a?.lastSegmentId === b?.lastSegmentId && a?.setAt === b?.setAt
