import type { CSSProperties } from 'react'
import { useTranslations } from 'next-intl'

/**
 * "Previously on": the promise, said by a narrator in the dark right after the TV switches off.
 * The one quiet screen of the page, in the sans voice (the broadcast voice is the display face).
 *
 * Each word lights up in turn as the statement crosses the screen: a CSS scroll-driven animation
 * (`.lp-lit` in `app/landing.css`), no JavaScript. Without support, or with reduced/off motion,
 * the text is simply lit. The last sentence lights up in lime, the only lime on this screen.
 * Server-rendered.
 */
export function LandingManifesto() {
  const t = useTranslations('home')
  const sentences = t('manifesto').split(/(?<=[.?!])\s+/)
  const words = sentences.flatMap((sentence, s) =>
    sentence.split(' ').map((word) => ({ word, accent: s === sentences.length - 1 })),
  )

  return (
    <div
      data-testid="landing-manifesto"
      className="lp-manifesto py-16 sm:py-24 lg:min-h-[80svh] flex min-h-[56svh] items-center"
    >
      <p className="font-semibold lg:ml-[8.333%] max-w-[16em] text-[clamp(2rem,5.2vw,4.75rem)] leading-[1.08] tracking-[-0.035em] text-balance">
        {words.map(({ word, accent }, i) => (
          <span key={i}>
            {i > 0 && ' '}
            <span
              className="lp-lit"
              style={
                {
                  '--i': i,
                  '--n': words.length,
                  ...(accent ? { '--lit': 'var(--color-primary)' } : null),
                } as CSSProperties
              }
            >
              {word}
            </span>
          </span>
        ))}
      </p>
    </div>
  )
}
