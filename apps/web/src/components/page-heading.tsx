'use client'

import { motion } from 'motion/react'
import { ease, GlitchText } from '@zzz/ui'

/** Kicker + huge italic title, with a stamped-in entrance. */
export function PageHeading({
  kicker,
  title,
  lede,
  children,
}: {
  kicker: string
  title: string
  lede?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <header className="pt-10 pb-8 sm:pt-14 relative">
      <motion.p
        initial={{ x: -24 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: ease.outExpo }}
        className="gap-3 text-xs font-semibold flex items-center font-mono tracking-[0.3em] text-primary uppercase"
      >
        <span className="w-8 h-px bg-primary" aria-hidden />
        {kicker}
      </motion.p>
      {/* The title is usually the LCP element: like the kicker, it slides in but is never invisible
          (no opacity fade), so it paints with the HTML instead of waiting for JavaScript. */}
      <motion.h1
        initial={{ y: 30, skewX: -8 }}
        animate={{ y: 0, skewX: 0 }}
        transition={{ duration: 0.7, ease: ease.outExpo, delay: 0.05 }}
        className="mt-3 display text-[clamp(2.75rem,10vw,6.5rem)]"
      >
        <GlitchText text={title} />
      </motion.h1>
      {lede && (
        <motion.p
          initial={{ y: 12 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: ease.outExpo }}
          className="mt-4 max-w-2xl text-base sm:text-lg text-muted"
        >
          {lede}
        </motion.p>
      )}
      {children}
    </header>
  )
}
