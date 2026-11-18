'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { cn } from '@zzz/ui'

/**
 * Behaviour for the landing monitor (its look is server-rendered children, see LandingHero):
 *
 * - **Power:** when the monitor's centre scrolls above the top 30% of the screen, the TV switches
 *   off (`data-power="off"`, CSS plays the collapse); scrolling back switches it on again.
 * - **Tilt:** on a desktop with a fine pointer, the monitor leans ±3° towards the mouse and a glare
 *   follows it (CSS variables `--rx`/`--ry`/`--gx`/`--gy`, read by `.lp-tilt` and `.lp-glare`).
 *
 * Both only with full motion; the splash itself is CSS and runs before hydration.
 */
export function TvStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const centre = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    const probe = centre.current
    if (!el || !probe) return
    const root = document.documentElement
    const full = () => root.dataset.motion === 'full'

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry || !full()) return
        const above =
          !entry.isIntersecting && entry.boundingClientRect.top < (entry.rootBounds?.top ?? 0)
        if (above) el.dataset.power = 'off'
        else if (el.dataset.power === 'off') el.dataset.power = 'on'
      },
      { rootMargin: '-30% 0px 0px 0px' },
    )
    io.observe(probe)

    const desktop = window.matchMedia('(pointer: fine) and (min-width: 64rem)')
    const stage = el.closest('section') ?? el
    let frame = 0
    const move = (e: PointerEvent) => {
      if (!desktop.matches || !full()) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        const clamp = (v: number) => Math.max(-1, Math.min(1, v)).toFixed(3)
        el.style.setProperty('--ry', clamp((x - 0.5) * 2))
        el.style.setProperty('--rx', clamp((y - 0.5) * 2))
        el.style.setProperty('--gx', x.toFixed(3))
        el.style.setProperty('--gy', y.toFixed(3))
      })
    }
    const leave = () => {
      cancelAnimationFrame(frame)
      el.style.setProperty('--ry', '0')
      el.style.setProperty('--rx', '0')
    }
    stage.addEventListener('pointermove', move)
    stage.addEventListener('pointerleave', leave)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      stage.removeEventListener('pointermove', move)
      stage.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div ref={ref} className={cn('lp-tv relative', className)}>
      {children}
      <span
        ref={centre}
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 size-px"
      />
    </div>
  )
}
