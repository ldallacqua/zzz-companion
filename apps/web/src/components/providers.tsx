'use client'

import { useEffect, useSyncExternalStore, type ReactNode } from 'react'
import { MotionConfig, MotionGlobalConfig } from 'motion/react'
import { useLocale } from 'next-intl'
import { useCompanion, type MotionPreference } from '@/lib/store'
import { LOCALE_STORAGE_KEY } from '@/lib/locale-preference'

export type MotionLevel = 'full' | 'reduced' | 'off'

const query = '(prefers-reduced-motion: reduce)'
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
  useEffect(() => {
    document.documentElement.dataset.motion = level
    MotionGlobalConfig.skipAnimations = level === 'off'
  }, [level])

  return (
    <MotionConfig reducedMotion={level === 'full' ? 'never' : 'always'}>{children}</MotionConfig>
  )
}

/**
 * Runs before React hydrates so the first paint already honors the saved motion preference.
 * Mirrors resolveMotion(); keep both in sync.
 */
export const motionBootScript = `(()=>{try{var p=(JSON.parse(localStorage.getItem('zzz-companion')||'{}').state||{}).motion||'system';var r=matchMedia('${query}').matches;document.documentElement.dataset.motion=p==='system'?(r?'reduced':'full'):p}catch(e){}})()`
