'use client'

import { useEffect, useRef } from 'react'
import { sameProgress, type SavedProgress } from '@zzz/core'
import { api } from './api'
import { useAccount } from './account-store'
import { deviceProgress, reconcileProgress } from './progress-sync'
import { useCompanion } from './store'

const SAVE_DELAY_MS = 500

/**
 * Keeps the reader's story progress the same on every device they sign in on (ADR 0014).
 *
 * - Signing in: the device's and the account's progress are compared; the most recent choice
 *   wins (a reader can move back on purpose) and is saved or taken on this device.
 * - Signed in: every change is saved (debounced). The API keeps the most recent choice, so an
 *   old tab can't roll another device's newer progress back.
 * - Signed out or offline: progress simply stays on the device, as it always has. Failures are
 *   silent: the next change, or the next sign-in, tries again.
 *
 * Session expiry is handled by the roster sync, which runs next to it.
 */
export function useProgressSync() {
  const accountReady = useAccount((s) => s.hydrated)
  const progressReady = useCompanion((s) => s.hydrated)
  const ready = accountReady && progressReady
  const enabled = useAccount((s) => s.enabled)
  const token = useAccount((s) => s.token)
  const userId = useAccount((s) => s.user?.id ?? null)
  const lastSegmentId = useCompanion((s) => s.lastSegmentId)
  const setAt = useCompanion((s) => s.progressSetAt)
  /** The account whose progress has been loaded, and the copy it holds. */
  const loadedFor = useRef<string | null>(null)
  const accountCopy = useRef<SavedProgress | null>(null)

  // Load and reconcile when the signed-in account changes.
  useEffect(() => {
    loadedFor.current = null
    if (!ready || !enabled || !token || !userId) return
    const controller = new AbortController()
    const { signal } = controller
    ;(async () => {
      try {
        const account = await api.getProgress(token, signal)
        const device = deviceProgress(useCompanion.getState())
        const { winner, save, adopt } = reconcileProgress(device, account)
        accountCopy.current =
          save && winner ? await api.putProgress(token, winner, signal) : account
        const kept = accountCopy.current
        if (kept && (adopt || !sameProgress(kept, winner)))
          useCompanion.getState().adoptProgress(kept)
        loadedFor.current = userId
      } catch {
        // Offline, API unreachable or not updated yet: progress stays on this device.
      }
    })()
    return () => controller.abort()
  }, [ready, enabled, token, userId])

  // Save changes made while signed in.
  useEffect(() => {
    if (!token || !userId || loadedFor.current !== userId || setAt === null) return
    const current = { lastSegmentId, setAt }
    if (sameProgress(current, accountCopy.current)) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      try {
        const kept = await api.putProgress(token, current, controller.signal)
        accountCopy.current = kept
        if (!sameProgress(kept, current)) useCompanion.getState().adoptProgress(kept)
      } catch {
        // Kept on this device; the next change or sign-in sends it again.
      }
    }, SAVE_DELAY_MS)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [token, userId, lastSegmentId, setAt])
}
