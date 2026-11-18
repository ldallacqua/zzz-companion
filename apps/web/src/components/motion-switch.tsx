'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { Segmented } from '@zzz/ui'
import { useCompanion, type MotionPreference } from '@/lib/store'
import { useMotionLevel } from './providers'

/** Position in the page from layout alone: an animation's transform is not a layout shift. */
function layoutTop(el: HTMLElement | null): number | undefined {
  if (!el) return undefined
  let y = 0
  for (let n: HTMLElement | null = el; n; n = n.offsetParent as HTMLElement | null) y += n.offsetTop
  return y
}

/**
 * The app's real Animations setting (the same one as in Settings), next to a tiny CRT that shows
 * what it does: it powers on with full motion, fades in when reduced and simply sits there when off.
 *
 * Changing it keeps the control where it is on screen, even if anything above it reflows.
 */
export function MotionSwitch() {
  const t = useTranslations('settings')
  const motion = useCompanion((s) => s.motion)
  const setMotion = useCompanion((s) => s.setMotion)
  const level = useMotionLevel()
  const ref = useRef<HTMLDivElement>(null)

  const change = (value: MotionPreference) => {
    const before = layoutTop(ref.current)
    setMotion(value)
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const after = layoutTop(ref.current)
        if (before !== undefined && after !== undefined && after !== before) {
          window.scrollBy({ top: after - before, behavior: 'instant' })
        }
      }),
    )
  }

  return (
    <div ref={ref} className="gap-3 flex w-full flex-col items-center">
      <div
        aria-hidden
        className="h-12 w-20 p-1 relative bg-surface-2 ring-1 ring-border-strong chamfer-sm"
      >
        <div className="relative size-full overflow-hidden bg-[#050506]">
          <div
            key={level}
            className="inset-0 absolute grid place-items-center bg-[radial-gradient(120%_100%_at_50%_100%,#c6ff2e55,transparent_70%)]"
            style={{
              animation:
                level === 'full'
                  ? 'lp-power-on 680ms var(--ease-snap) both'
                  : level === 'reduced'
                    ? 'lp-fade 300ms ease-out both'
                    : undefined,
            }}
          >
            <span className="text-xs font-mono text-primary">▶</span>
            <span className="inset-0 absolute scanlines" />
          </div>
        </div>
      </div>
      {/* 2 × 2: four options fit any tile width in both languages ("Desligadas" is long). */}
      <Segmented<MotionPreference>
        className="sm:w-full grid w-full max-w-[20rem] grid-cols-2"
        label={t('motion')}
        layoutId="landing-motion"
        value={motion}
        onValueChange={change}
        options={[
          { value: 'system', label: t('motionSystem') },
          { value: 'full', label: t('motionFull') },
          { value: 'reduced', label: t('motionReduced') },
          { value: 'off', label: t('motionOff') },
        ]}
      />
    </div>
  )
}
