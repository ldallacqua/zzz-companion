'use client'

import { useTranslations } from 'next-intl'
import { Segmented } from '@zzz/ui'
import { useCompanion, type MotionPreference } from '@/lib/store'
import { useMotionLevel } from './providers'

/**
 * The app's real Animations setting (the same one as in Settings), next to a tiny CRT that shows
 * what it does: it powers on with full motion, fades in when reduced and simply sits there when off.
 */
export function MotionSwitch() {
  const t = useTranslations('settings')
  const motion = useCompanion((s) => s.motion)
  const setMotion = useCompanion((s) => s.setMotion)
  const level = useMotionLevel()

  return (
    <div className="gap-4 flex w-full flex-col items-center">
      <div
        aria-hidden
        className="h-16 w-24 p-1 relative bg-surface-2 ring-1 ring-border-strong chamfer-sm"
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
      <Segmented<MotionPreference>
        label={t('motion')}
        layoutId="landing-motion"
        value={motion}
        onValueChange={setMotion}
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
