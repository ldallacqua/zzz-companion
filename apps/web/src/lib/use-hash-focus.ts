'use client'

import { useEffect } from 'react'

/**
 * Content on these pages renders after local progress hydrates, so the browser's
 * native #hash scroll misses it. Once ready, scroll to the target and flash it.
 */
export function useHashFocus(ready: boolean) {
  useEffect(() => {
    if (!ready) return
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id) return
    const frame = requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (!el) return
      el.scrollIntoView({ block: 'center' })
      el.dataset.flash = 'true'
      window.setTimeout(() => delete el.dataset.flash, 1800)
    })
    return () => cancelAnimationFrame(frame)
  }, [ready])
}
