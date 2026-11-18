import { newerProgress, sameProgress, type SavedProgress } from '@zzz/core'

/**
 * This device's progress in the account's format, or null when the reader never set it here.
 * Progress saved before sync existed has no timestamp: it counts as the oldest possible choice
 * (it wins only over an account that has none).
 */
export function deviceProgress(state: {
  lastSegmentId: string | null
  progressSetAt: number | null
}): SavedProgress | null {
  if (state.progressSetAt === null && state.lastSegmentId === null) return null
  return { lastSegmentId: state.lastSegmentId, setAt: state.progressSetAt ?? 0 }
}

/**
 * Signing in: what to do with this device's progress and the account's.
 * - `save`: the device's choice is newer (or the account has none): send it.
 * - `adopt`: the account's choice is newer: take it on this device.
 */
export function reconcileProgress(device: SavedProgress | null, account: SavedProgress | null) {
  if (!device) return { winner: account, save: false, adopt: account !== null }
  const winner = newerProgress(device, account)
  return {
    winner,
    save: !sameProgress(winner, account),
    adopt: !sameProgress(winner, device),
  }
}
