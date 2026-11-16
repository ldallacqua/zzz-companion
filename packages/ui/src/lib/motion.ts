import type { Transition, Variants } from 'motion/react'

/**
 * Shared motion language. Snappy, slightly overshooting, never floaty —
 * think of a TV channel switching, not a balloon drifting.
 */
export const ease = {
  snap: [0.2, 0.9, 0.1, 1] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
}

export const spring = {
  snappy: { type: 'spring', stiffness: 520, damping: 34, mass: 0.7 } satisfies Transition,
  soft: { type: 'spring', stiffness: 260, damping: 30 } satisfies Transition,
}

/** Rises in from slightly below with a tiny skew, like a sticker being slapped on. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 28, skewY: 2 },
  show: { opacity: 1, y: 0, skewY: 0, transition: { duration: 0.6, ease: ease.outExpo } },
}

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -48 },
  show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: ease.outExpo } },
}

export const stagger = (staggerChildren = 0.07, delayChildren = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
})

/**
 * CRT power-on: a thin bright line that expands vertically. The "off" state is a visible line, not
 * opacity 0, so content inside paints with the HTML (no Largest Contentful Paint delay).
 */
export const crtOn: Variants = {
  hidden: { scaleY: 0.004, scaleX: 0.6, filter: 'brightness(3)' },
  show: {
    scaleY: [0.004, 0.004, 1],
    scaleX: [0.6, 1, 1],
    filter: ['brightness(3)', 'brightness(2)', 'brightness(1)'],
    transition: { duration: 0.75, times: [0, 0.35, 1], ease: ease.snap },
  },
}
