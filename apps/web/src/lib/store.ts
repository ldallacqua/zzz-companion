'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type MotionPreference = 'system' | 'full' | 'reduced' | 'off'
export type RecapMode = 'tldr' | 'full'

export const STORAGE_KEY = 'zzz-companion'

export interface CompanionState {
  /** Last finished story segment; null = nothing finished yet. */
  lastSegmentId: string | null
  recapMode: RecapMode
  motion: MotionPreference
  hydrated: boolean
  setProgress: (segmentId: string | null) => void
  setRecapMode: (mode: RecapMode) => void
  setMotion: (motion: MotionPreference) => void
  resetProgress: () => void
}

/**
 * Local-first state (see docs/adr/0004-local-first-state.md).
 * `skipHydration` keeps the first client render identical to the server render;
 * <Providers> rehydrates after mount and flips `hydrated`.
 */
export const useCompanion = create<CompanionState>()(
  persist(
    (set) => ({
      lastSegmentId: null,
      recapMode: 'full',
      motion: 'system',
      hydrated: false,
      setProgress: (lastSegmentId) => set({ lastSegmentId }),
      setRecapMode: (recapMode) => set({ recapMode }),
      setMotion: (motion) => set({ motion }),
      resetProgress: () => set({ lastSegmentId: null }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ lastSegmentId, recapMode, motion }) => ({ lastSegmentId, recapMode, motion }),
      onRehydrateStorage: () => () => useCompanion.setState({ hydrated: true }),
    },
  ),
)
