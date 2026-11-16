'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ease } from '@zzz/ui'

/** Becomes true after the first page has mounted: later mounts are client-side navigations. */
let hasNavigated = false

/**
 * Page transition ("channel switch"): a lime scan bar sweeps across the top while the new page
 * slides up out of a slight blur.
 *
 * Only on client-side navigation: the first page load renders fully visible, so the browser can
 * paint the server HTML right away instead of waiting for JavaScript (Largest Contentful Paint).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const [transition] = useState(() => hasNavigated)
  useEffect(() => {
    hasNavigated = true
  }, [])

  return (
    <>
      <motion.div
        aria-hidden
        className="inset-x-0 top-16 h-0.5 pointer-events-none fixed z-30 origin-left bg-primary"
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.7, ease: ease.outExpo }}
      />
      <motion.div
        initial={transition ? { opacity: 0, y: 18, filter: 'blur(6px)' } : false}
        // `filter` would otherwise linger and trap fixed-position descendants.
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
        transition={{ duration: 0.5, ease: ease.outExpo }}
      >
        {children}
      </motion.div>
    </>
  )
}
