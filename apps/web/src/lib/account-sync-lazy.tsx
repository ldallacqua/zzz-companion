'use client'

import dynamic from 'next/dynamic'
import { accountsEnabled } from './api-config'

/**
 * The account sync loads after hydration, in its own chunk, and only on builds that have an
 * accounts API: pages that never touch the roster don't pay for it before their first paint
 * (Lighthouse audits a build without an API).
 */
const Sync = dynamic(() => import('./use-account-sync').then((m) => m.AccountSync), {
  ssr: false,
})

export function LazyAccountSync() {
  return accountsEnabled ? <Sync /> : null
}
