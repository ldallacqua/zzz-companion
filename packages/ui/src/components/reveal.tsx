'use client'

import * as React from 'react'
import { motion, type Variants } from 'motion/react'
import { riseIn, stagger } from '../lib/motion'

type RevealProps = React.ComponentProps<typeof motion.div> & {
  variants?: Variants
  /** Animate when scrolled into view (default) or immediately on mount. */
  trigger?: 'view' | 'mount'
}

/**
 * Scroll-triggered entrance. Children marked with <RevealItem> stagger in.
 *
 * It fires as soon as any part of the block is on screen (`amount: 0`): a threshold relative to
 * the block's height never fires for blocks taller than the screen. Keep reveals small (one card,
 * not a whole list) so each one starts when *it* arrives. With motion off, `data-reveal` makes
 * everything show at once (see styles.css), even before it is scrolled into view.
 */
export function Reveal({ variants, trigger = 'view', children, ...props }: RevealProps) {
  const triggerProps =
    trigger === 'view'
      ? { whileInView: 'show', viewport: { once: true, amount: 0, margin: '0px 0px -8% 0px' } }
      : { animate: 'show' }
  return (
    <motion.div
      data-reveal=""
      initial="hidden"
      variants={variants ?? stagger()}
      {...triggerProps}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({
  variants,
  ...props
}: React.ComponentProps<typeof motion.div> & { variants?: Variants }) {
  return <motion.div data-reveal="" variants={variants ?? riseIn} {...props} />
}
