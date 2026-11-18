'use client'

import { useEffect } from 'react'

/**
 * Progressive arming for the landing page's arrival animations (see `app/landing.css`).
 *
 * The HTML is the final frame, so the page is complete without JavaScript. Once mounted, every
 * `[data-arm]` block still below the fold gets `data-armed` (its CSS animations wait on their
 * first frame) and, when it scrolls into view, `data-inview` (they play once). Blocks already on
 * screen are left alone, so nothing visible ever jumps back. With motion "off" nothing is armed.
 */
export function LandingArm() {
  useEffect(() => {
    if (document.documentElement.dataset.motion === 'off') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.inview = ''
          io.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -12% 0px' },
    )
    const fold = window.innerHeight
    for (const el of document.querySelectorAll<HTMLElement>('[data-arm]')) {
      if (el.getBoundingClientRect().top < fold) continue
      el.dataset.armed = ''
      io.observe(el)
    }
    return () => io.disconnect()
  }, [])
  return null
}
