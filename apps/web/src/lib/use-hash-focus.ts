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
      // Tall targets (a recap part on a phone) go to their top, below the sticky header
      // (scroll-margin); short ones are centred.
      const tall = el.getBoundingClientRect().height > window.innerHeight * 0.7
      el.scrollIntoView({ block: tall ? 'start' : 'center' })
      el.dataset.flash = 'true'
      window.setTimeout(() => delete el.dataset.flash, 1800)
    })
    return () => cancelAnimationFrame(frame)
  }, [ready])
}
