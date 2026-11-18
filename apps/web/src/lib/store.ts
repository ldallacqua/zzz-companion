'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { SavedProgress } from '@zzz/core'

export type MotionPreference = 'system' | 'full' | 'reduced' | 'off'
export type RecapMode = 'tldr' | 'full'

export const STORAGE_KEY = 'zzz-companion'

export interface CompanionState {
  /** Last finished story segment; null = nothing finished yet. */
  lastSegmentId: string | null
  /**
   * When the reader last set (or reset) their progress, in ms; null = never, on this device.
   * With an account, the most recent choice wins across devices (ADR 0014).
   */
  progressSetAt: number | null
  recapMode: RecapMode
  motion: MotionPreference
  hydrated: boolean
  setProgress: (segmentId: string | null) => void
  setRecapMode: (mode: RecapMode) => void
  setMotion: (motion: MotionPreference) => void
  resetProgress: () => void
  /** Take the account's copy (it is more recent than this device's). */
  adoptProgress: (saved: SavedProgress) => void
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
      progressSetAt: null,
      recapMode: 'full',
      motion: 'system',
      hydrated: false,
      setProgress: (lastSegmentId) => set({ lastSegmentId, progressSetAt: Date.now() }),
      setRecapMode: (recapMode) => set({ recapMode }),
      setMotion: (motion) => set({ motion }),
      resetProgress: () => set({ lastSegmentId: null, progressSetAt: Date.now() }),
      adoptProgress: ({ lastSegmentId, setAt }) => set({ lastSegmentId, progressSetAt: setAt }),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ lastSegmentId, progressSetAt, recapMode, motion }) => ({
        lastSegmentId,
        progressSetAt,
        recapMode,
        motion,
      }),
      onRehydrateStorage: () => () => useCompanion.setState({ hydrated: true }),
    },
  ),
)
