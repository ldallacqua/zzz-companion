import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { Button } from '@zzz/ui'
import { Link } from '@/i18n/navigation'
import { BigMark } from './big-mark'
import { PickerButton } from './picker-button'
import { ProgressLine } from './progress-line'

/**
 * Sign-off: "To be continued" tape slaps on, one big line, where the reader is, and the call to
 * action. Like the hero, both sets of actions ship in the HTML and `data-progress` picks one;
 * the status fills a reserved slot after hydration. Server-rendered.
 */
export function LandingOutro() {
  const t = useTranslations('home')
  const tp = useTranslations('progress')
  const tape = Array.from({ length: 10 }, () => t('toBeContinued')).join('   ◆   ')

  return (
    <section
      aria-labelledby="outro-title"
      data-testid="landing-outro"
      className="pt-36 pb-24 sm:pt-44 sm:pb-32 relative isolate text-center"
    >
      <div
        aria-hidden
        className="inset-y-0 absolute left-1/2 -z-10 w-screen -translate-x-1/2 overflow-hidden bg-band [clip-path:polygon(0_0,100%_3vw,100%_100%,0_100%)]"
      >
        <div className="inset-0 absolute bg-[radial-gradient(50%_60%_at_50%_100%,#c6ff2e1a,transparent_70%)]" />
        <div className="absolute bottom-[-12%] left-1/2 -translate-x-1/2">
          <BigMark className="w-[clamp(22rem,74vw,68rem)] text-primary/[0.05]" />
        </div>
        <div className="lp-noise inset-0 absolute opacity-[0.03]" />
      </div>

      <div
        data-arm=""
        aria-hidden
        className="pointer-events-none absolute top-[max(2rem,4vw)] left-1/2 w-screen -translate-x-1/2 overflow-x-clip"
      >
        <div className="lp-tape py-2 text-sm font-bold -mx-10 origin-center -rotate-3 overflow-hidden bg-primary font-mono tracking-[0.3em] whitespace-nowrap text-primary-foreground uppercase shadow-[0_10px_30px_rgb(0_0_0/0.6)]">
          {tape}
        </div>
      </div>

      <p className="text-xs font-semibold font-mono tracking-[0.3em] text-primary uppercase">
        {t('outroKicker')}
      </p>
      <h2
        id="outro-title"
        className="mt-5 max-w-5xl font-black mx-auto display text-[clamp(3.25rem,12vw,9rem)] leading-[0.86] text-balance"
      >
        {t('outroTitle')}
      </h2>

      <div className="mt-10 grid min-h-[7.5rem] place-items-center">
        <p className="max-w-md text-lg leading-relaxed text-balance text-muted in-data-[progress=set]:hidden">
          {t('statusEmpty')}
        </p>
        <ProgressLine variant="status" className="hidden in-data-[progress=set]:block" />
      </div>

      <div className="mt-8 gap-3 sm:flex-row flex flex-col items-center justify-center in-data-[progress=set]:hidden">
        <PickerButton size="lg" className="sm:w-auto w-full">
          {t('ctaStart')}
          <ArrowRight
            className="group-hover/button:translate-x-1 transition-transform"
            aria-hidden
          />
        </PickerButton>
      </div>
      <div className="mt-8 gap-3 sm:flex-row hidden flex-col items-center justify-center in-data-[progress=set]:flex">
        <Button asChild size="lg" className="sm:w-auto w-full">
          <Link href="/recap">
            {t('ctaRecap')}
            <ArrowRight
              className="group-hover/button:translate-x-1 transition-transform"
              aria-hidden
            />
          </Link>
        </Button>
        <PickerButton variant="outline" size="lg" className="sm:w-auto w-full">
          {tp('change')}
        </PickerButton>
      </div>
    </section>
  )
}
