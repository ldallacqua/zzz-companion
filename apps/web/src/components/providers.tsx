'use client'

import { useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { MotionConfig, MotionGlobalConfig } from 'motion/react'
import { useLocale } from 'next-intl'
import { useCompanion, type MotionPreference } from '@/lib/store'
import { LOCALE_STORAGE_KEY } from '@/lib/locale-preference'
import { useAccount } from '@/lib/account-store'
import { useArsenal } from '@/lib/arsenal-store'
import { useRoster } from '@/lib/roster-store'

export type MotionLevel = 'full' | 'reduced' | 'off'

const query = '(prefers-reduced-motion: reduce)'

// bootScript has already set <html data-motion> before any module runs, so animations that
// start during hydration (before <Providers>' effect) already respect "off".
if (typeof document !== 'undefined' && document.documentElement.dataset.motion === 'off') {
  MotionGlobalConfig.skipAnimations = true
}
function subscribe(callback: () => void) {
  const mql = window.matchMedia(query)
  mql.addEventListener('change', callback)
  return () => mql.removeEventListener('change', callback)
}
const systemPrefersReduced = () => window.matchMedia(query).matches

export function resolveMotion(pref: MotionPreference, prefersReduced: boolean): MotionLevel {
  if (pref === 'system') return prefersReduced ? 'reduced' : 'full'
  return pref
}

export function useMotionLevel(): MotionLevel {
  const pref = useCompanion((s) => s.motion)
  const prefersReduced = useSyncExternalStore(subscribe, systemPrefersReduced, () => false)
  return resolveMotion(pref, prefersReduced)
}

/**
 * Global motion switch:
 *  - full    → every animation
 *  - reduced → motion keeps fades but drops transforms; ambient CSS loops stop
 *  - off     → Motion skips all animations; CSS durations collapse to ~0
 */
export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useCompanion.persist.rehydrate()
    void useAccount.persist.rehydrate()
    void useRoster.persist.rehydrate()
    void useArsenal.persist.rehydrate()
  }, [])

  const locale = useLocale()
  useEffect(() => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale)
    } catch {
      // Private mode / blocked storage: the root page falls back to browser languages.
    }
  }, [locale])

  const level = useMotionLevel()
  const hydrated = useCompanion((s) => s.hydrated)
  useEffect(() => {
    // Until the saved preference is loaded, `level` is the default ("system"); the boot script's
    // value is the right one, so don't overwrite it (an "Off" reader would get a burst of motion).
    if (!hydrated) return
    document.documentElement.dataset.motion = level
    MotionGlobalConfig.skipAnimations = level === 'off'
  }, [level, hydrated])

  // Keep the boot script's `data-progress` in step with the store, so CSS that swaps first-paint
  // states (e.g. the landing page's calls to action) follows progress set or reset on the page.
  const hasProgress = useCompanion((s) => s.lastSegmentId !== null)
  useEffect(() => {
    if (!hydrated) return
    if (hasProgress) document.documentElement.dataset.progress = 'set'
    else delete document.documentElement.dataset.progress
  }, [hydrated, hasProgress])

  return (
    <MotionConfig reducedMotion={level === 'full' ? 'never' : 'always'}>{children}</MotionConfig>
  )
}

/**
 * Runs before React hydrates so the first paint already honors the saved preferences:
 *  - `data-motion`: the motion level (mirrors resolveMotion(); keep both in sync)
 *  - `data-motion-start`: the same level, never updated afterwards. Layout that depends on motion
 *    (the landing page's pinned act) keys on it, so changing the setting doesn't reflow the page
 *  - `data-roster="set"` / `data-account="in"`: the reader has picked Agents / is signed in
 *    (My Agents keeps its grid hidden until hydration instead of flashing an empty roster)
 *  - `data-progress="set"`: the reader has saved progress (lets static HTML pick the right
 *    first-paint state, e.g. the recap's empty state is only shown to first-time visitors)
 */
export const bootScript = `(()=>{try{var d=document.documentElement,s=JSON.parse(localStorage.getItem('zzz-companion')||'{}').state||{},p=s.motion||'system',r=matchMedia('${query}').matches;d.dataset.motion=d.dataset.motionStart=p==='system'?(r?'reduced':'full'):p;if(s.lastSegmentId)d.dataset.progress='set';var o=(JSON.parse(localStorage.getItem('zzz-roster')||'{}').state||{}).owned;if(o&&Object.keys(o).length)d.dataset.roster='set';if((JSON.parse(localStorage.getItem('zzz-account')||'{}').state||{}).token)d.dataset.account='in'}catch(e){}})()`
