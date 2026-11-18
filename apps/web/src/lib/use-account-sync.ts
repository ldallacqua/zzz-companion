'use client'

import { useEffect, useRef } from 'react'
import { mergeRosters, rosterFromMap, rosterToMap, sameRoster } from '@zzz/core'
import { api, ApiError } from './api'
import { useAccount } from './account-store'
import { useRoster } from './roster-store'
import { useProgressSync } from './use-progress-sync'

const SAVE_DELAY_MS = 700

/**
 * The session is gone (expired, revoked, account deleted elsewhere). Unsaved edits are kept as a
 * guest roster, so the next sign-in merges them; with nothing pending the device copy is dropped.
 */
function endSession() {
  const roster = useRoster.getState()
  if (roster.dirty) roster.keepAsGuest()
  useAccount.getState().expire()
}

/**
 * Keeps the roster on this device and the signed-in account in step (ADR 0011).
 *
 * - Signed out: the roster is a guest roster, kept only in this browser.
 * - Signing in: the account's roster is fetched; guest picks are merged into it (union, higher
 *   Mindscape wins) and saved. Edits made while signed in but offline are pushed on retry.
 * - Signed in: every edit is saved (debounced) with a whole-roster PUT.
 * - Signed out / account deleted: the device copy is forgotten.
 */
export function useAccountSync() {
  const accountReady = useAccount((s) => s.hydrated)
  const rosterReady = useRoster((s) => s.hydrated)
  const ready = accountReady && rosterReady
  const enabled = useAccount((s) => s.enabled)
  const token = useAccount((s) => s.token)
  const userId = useAccount((s) => s.user?.id ?? null)
  const attempt = useRoster((s) => s.attempt)
  const revision = useRoster((s) => s.revision)
  /** The account roster has been loaded (and merged) for this token. */
  const loaded = useRef(false)

  // Load + merge whenever the signed-in account changes (or on retry).
  useEffect(() => {
    loaded.current = false
    if (!ready) return
    const roster = useRoster.getState()
    if (!enabled || !token || !userId) {
      if (roster.owner !== null) roster.reset()
      else if (roster.sync !== 'expired') roster.setSync('local')
      return
    }

    const controller = new AbortController()
    const { signal } = controller
    roster.setSync('loading')
    ;(async () => {
      try {
        const user = await api.session(token, signal)
        if (!user) return endSession()
        useAccount.getState().setUser(user)

        const server = rosterToMap(await api.getRoster(token, signal))
        const { owned, owner, dirty } = useRoster.getState()
        let next = server
        if (owner === null) next = mergeRosters(owned, server)
        else if (owner === user.id && dirty) next = owned
        const push = !sameRoster(next, server)
        useRoster.getState().adopt(user.id, next, push)
        if (push) await api.putRoster(token, rosterFromMap(next), signal)
        useRoster.getState().markSaved()
        loaded.current = true
      } catch (error) {
        if (signal.aborted) return
        if (error instanceof ApiError && error.code === 'UNAUTHORIZED') return endSession()
        useRoster.getState().setSync('error')
      }
    })()
    return () => controller.abort()
  }, [ready, enabled, token, userId, attempt])

  // Save edits made while signed in.
  useEffect(() => {
    if (!token || !loaded.current || !useRoster.getState().dirty) return
    const controller = new AbortController()
    useRoster.getState().setSync('saving')
    const timer = setTimeout(async () => {
      const startedAt = useRoster.getState().revision
      try {
        await api.putRoster(token, rosterFromMap(useRoster.getState().owned), controller.signal)
        // A newer edit is already queued: let its save mark the roster as saved.
        if (useRoster.getState().revision === startedAt) useRoster.getState().markSaved()
      } catch (error) {
        if (controller.signal.aborted) return
        if (error instanceof ApiError && error.code === 'UNAUTHORIZED') return endSession()
        useRoster.getState().setSync('error')
      }
    }, SAVE_DELAY_MS)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [token, revision])

  // Back online: retry whatever failed.
  useEffect(() => {
    const onOnline = () => {
      const { sync, retry } = useRoster.getState()
      if (sync === 'error') retry()
    }
    window.addEventListener('online', onOnline)
    return () => window.removeEventListener('online', onOnline)
  }, [])
}

/**
 * Mount once in the layout (not in <Providers>, so stories control the stores themselves): keeps
 * the roster and the story progress in step with the signed-in account.
 */
export function AccountSync() {
  useAccountSync()
  useProgressSync()
  return null
}
