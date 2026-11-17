'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { MINDSCAPE_MAX, type RosterMap } from '@zzz/core'

export const ROSTER_STORAGE_KEY = 'zzz-roster'

/**
 * - `local`: kept on this device only (guest, or accounts unavailable on this build)
 * - `loading`: fetching the account's roster
 * - `saving` / `saved`: syncing edits to the account
 * - `error`: the last save failed (edits are kept and retried)
 * - `expired`: the session ended with unsaved edits; they were kept as a guest roster and merge
 *   into the account at the next sign-in
 */
export type SyncStatus = 'local' | 'loading' | 'saving' | 'saved' | 'error' | 'expired'

interface RosterState {
  /** Agent id → Mindscape level (0–6). Absent = not owned. */
  owned: RosterMap
  /** Account id this copy belongs to; null = a guest roster on this device. */
  owner: string | null
  /** Edits made while signed in that the account doesn't have yet. */
  dirty: boolean
  /** Spoiler-flagged agents the reader chose to see (this device only, never synced). */
  revealed: string[]
  /** The "keep your Agents" card was dismissed for good (this device only). */
  nudgeDismissed: boolean
  /** Bumped on every local edit, so the sync can debounce saves. */
  revision: number
  sync: SyncStatus
  lastSavedAt: number | null
  /** Bumped by retry(): re-runs the account load + merge + save. */
  attempt: number
  hydrated: boolean
  toggle: (agentId: string) => void
  setMindscape: (agentId: string, level: number) => void
  /** Mark several agents as owned (at M0) in one edit, i.e. one save. */
  ownMany: (agentIds: string[]) => void
  disownMany: (agentIds: string[]) => void
  reveal: (agentId: string) => void
  dismissNudge: () => void
  /** Replace the roster with the account's copy (after a fetch or a merge). */
  adopt: (owner: string, owned: RosterMap, dirty: boolean) => void
  /** Keep the device copy as a guest roster (session ended with unsaved edits). */
  keepAsGuest: () => void
  markSaved: () => void
  setSync: (sync: SyncStatus) => void
  retry: () => void
  /** Forget the device copy (sign-out, account deleted, session expired with nothing pending). */
  reset: () => void
}

const clamp = (level: number) => Math.min(MINDSCAPE_MAX, Math.max(0, Math.round(level)))

export const useRoster = create<RosterState>()(
  persist(
    (set) => {
      const edit = (s: RosterState, owned: RosterMap) => ({
        owned,
        dirty: s.owner !== null,
        revision: s.revision + 1,
      })
      return {
        owned: {},
        owner: null,
        dirty: false,
        revealed: [],
        nudgeDismissed: false,
        revision: 0,
        sync: 'local',
        lastSavedAt: null,
        attempt: 0,
        hydrated: false,
        toggle: (agentId) =>
          set((s) => {
            const owned = { ...s.owned }
            if (agentId in owned) delete owned[agentId]
            else owned[agentId] = 0
            return edit(s, owned)
          }),
        setMindscape: (agentId, level) =>
          set((s) => edit(s, { ...s.owned, [agentId]: clamp(level) })),
        ownMany: (agentIds) =>
          set((s) => {
            const owned = { ...s.owned }
            for (const id of agentIds) owned[id] ??= 0
            return edit(s, owned)
          }),
        disownMany: (agentIds) =>
          set((s) => {
            const owned = { ...s.owned }
            for (const id of agentIds) delete owned[id]
            return edit(s, owned)
          }),
        reveal: (agentId) =>
          set((s) => (s.revealed.includes(agentId) ? s : { revealed: [...s.revealed, agentId] })),
        dismissNudge: () => set({ nudgeDismissed: true }),
        adopt: (owner, owned, dirty) => set({ owner, owned, dirty }),
        keepAsGuest: () => set({ owner: null, dirty: false, sync: 'expired' }),
        markSaved: () => set({ dirty: false, sync: 'saved', lastSavedAt: Date.now() }),
        setSync: (sync) => set({ sync }),
        retry: () => set((s) => ({ attempt: s.attempt + 1 })),
        reset: () =>
          set({ owned: {}, owner: null, dirty: false, sync: 'local', lastSavedAt: null }),
      }
    },
    {
      name: ROSTER_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ owned, owner, dirty, revealed, nudgeDismissed }) => ({
        owned,
        owner,
        dirty,
        revealed,
        nudgeDismissed,
      }),
      onRehydrateStorage: () => () => useRoster.setState({ hydrated: true }),
    },
  ),
)
