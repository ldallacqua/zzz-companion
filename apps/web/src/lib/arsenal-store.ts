'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export const ARSENAL_STORAGE_KEY = 'zzz-arsenal'

/** Ids the store keeps at most (the game has ~100 W-Engines); guards against a corrupt copy. */
const MAX_OWNED = 500

interface ArsenalState {
  /** W-Engine ids the player marked as owned, on this device (not synced to accounts yet). */
  wEngines: string[]
  hydrated: boolean
  toggleWEngine: (id: string) => void
}

/**
 * The player's gear (docs/features/builds.md). For now only which W-Engines they own, marked from
 * a build's W-Engine list, so the page can point out the best one they already have.
 */
export const useArsenal = create<ArsenalState>()(
  persist(
    (set) => ({
      wEngines: [],
      hydrated: false,
      toggleWEngine: (id) =>
        set((s) => ({
          wEngines: s.wEngines.includes(id)
            ? s.wEngines.filter((x) => x !== id)
            : [...s.wEngines, id].slice(-MAX_OWNED),
        })),
    }),
    {
      name: ARSENAL_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ wEngines }) => ({ wEngines }),
      merge: (persisted, current) => {
        // Nothing stored yet: keep what's in memory. A corrupt copy keeps only valid ids.
        const ids = (persisted as Partial<ArsenalState> | undefined)?.wEngines
        if (!Array.isArray(ids)) return current
        const wEngines = ids.filter((x): x is string => typeof x === 'string').slice(0, MAX_OWNED)
        return { ...current, wEngines }
      },
      onRehydrateStorage: () => () => useArsenal.setState({ hydrated: true }),
    },
  ),
)
