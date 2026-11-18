'use client'

import { useEffect } from 'react'

/** Arrival animations that will end: time-based and finite (ambient loops never finish). */
const finite = (a: Animation) =>
  a.timeline === document.timeline && a.effect?.getComputedTiming().iterations !== Infinity

/**
 * Progressive arming for the landing page's arrival animations (see `app/landing.css`).
 *
 * The HTML is the final frame, so the page is complete without JavaScript. Once mounted, every
 * `[data-arm]` block still below the fold gets `data-armed` (its CSS animations wait on their
 * first frame) and, when it scrolls into view, `data-inview` (they play once). When they have
 * finished, both attributes go away: the block has arrived for good, so changing the Animations
 * setting later never replays it. Blocks already on screen are left alone, so nothing visible
 * ever jumps back. With motion "off" nothing is armed.
 */
export function LandingArm() {
  useEffect(() => {
    if (document.documentElement.dataset.motion === 'off') return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const el = entry.target as HTMLElement
          el.dataset.inview = ''
          io.unobserve(el)
          // Let the styles apply first, then wait for this block's arrival to end.
          requestAnimationFrame(() => {
            const running = el.getAnimations({ subtree: true }).filter(finite)
            void Promise.allSettled(running.map((a) => a.finished)).then(() => {
              delete el.dataset.armed
              delete el.dataset.inview
            })
          })
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
