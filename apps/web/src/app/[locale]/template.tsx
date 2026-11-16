'use client'

import { motion } from 'motion/react'
import { ease } from '@zzz/ui'

/**
 * Page transition ("channel switch"): a lime scan bar sweeps across the top
 * while the new page slides up out of a slight blur.
 */
export default function Template({ children }: { children: React.ReactNode }) {
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
        initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
        // `filter` would otherwise linger and trap fixed-position descendants.
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transitionEnd: { filter: 'none' } }}
        transition={{ duration: 0.5, ease: ease.outExpo }}
      >
        {children}
      </motion.div>
    </>
  )
}
