'use client'

import * as React from 'react'
import { motion, type Variants } from 'motion/react'
import { riseIn, stagger } from '../lib/motion'

type RevealProps = React.ComponentProps<typeof motion.div> & {
  variants?: Variants
  /** Animate when scrolled into view (default) or immediately on mount. */
  trigger?: 'view' | 'mount'
}

/** Scroll-triggered entrance. Children marked with <RevealItem> stagger in. */
export function Reveal({ variants, trigger = 'view', children, ...props }: RevealProps) {
  const triggerProps =
    trigger === 'view'
      ? { whileInView: 'show', viewport: { once: true, amount: 0.15, margin: '0px 0px -8% 0px' } }
      : { animate: 'show' }
  return (
    <motion.div initial="hidden" variants={variants ?? stagger()} {...triggerProps} {...props}>
      {children}
    </motion.div>
  )
}

export function RevealItem({
  variants,
  ...props
}: React.ComponentProps<typeof motion.div> & { variants?: Variants }) {
  return <motion.div variants={variants ?? riseIn} {...props} />
}
