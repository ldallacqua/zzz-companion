'use client'

import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { accountsEnabled } from './api-config'
import type { AccountUser } from './api'

export const ACCOUNT_STORAGE_KEY = 'zzz-account'

/** One-off messages shown after an account change (not persisted). */
export type AccountNotice =
  | { kind: 'merged'; count: number }
  | { kind: 'welcome'; count: number }
  | { kind: 'signedOut' }
  | { kind: 'deleted' }
  | { kind: 'sessionEnded' }

interface AccountState {
  /** This build can reach an accounts API (NEXT_PUBLIC_API_URL). Stories may override it. */
  enabled: boolean
  /** Session token for the API (bearer). Null = signed out. */
  token: string | null
  /** Last known profile, so the header can show who's signed in before the API answers. */
  user: AccountUser | null
  notice: AccountNotice | null
  hydrated: boolean
  setSession: (token: string, user: AccountUser, notice?: AccountNotice) => void
  setUser: (user: AccountUser) => void
  /** Signed out on purpose (or account deleted). */
  clear: (notice?: AccountNotice) => void
  /** The API no longer accepts the session. */
  expire: () => void
  setNotice: (notice: AccountNotice | null) => void
}

/**
 * The signed-in account on this device (see docs/adr/0011-accounts-and-roster-sync.md).
 * Hydrated after mount like the main store, so server and first client render match.
 */
export const useAccount = create<AccountState>()(
  persist(
    (set) => ({
      enabled: accountsEnabled,
      token: null,
      user: null,
      notice: null,
      hydrated: false,
      setSession: (token, user, notice) => set({ token, user, notice: notice ?? null }),
      setUser: (user) => set({ user }),
      clear: (notice) => set({ token: null, user: null, notice: notice ?? null }),
      expire: () => set({ token: null, user: null, notice: { kind: 'sessionEnded' } }),
      setNotice: (notice) => set({ notice }),
    }),
    {
      name: ACCOUNT_STORAGE_KEY,
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
      partialize: ({ token, user }) => ({ token, user }),
      onRehydrateStorage: () => () => useAccount.setState({ hydrated: true }),
    },
  ),
)
