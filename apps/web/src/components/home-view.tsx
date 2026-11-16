'use client'

import { motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Radio } from 'lucide-react'
import {
  Button,
  crtOn,
  ease,
  GlitchText,
  Panel,
  ProgressTicks,
  Reveal,
  RevealItem,
  stagger,
} from '@zzz/ui'
import type { Locale } from '@zzz/core'
import { charactersById, coverage } from '@zzz/story'
import { Link } from '@/i18n/navigation'
import { useStory } from '@/lib/use-story'
import { useUi } from '@/lib/ui-store'
import { Portrait } from './portrait'
import { FeaturesSection } from './features-section'

/** Hero collage: the protagonists are never spoilers. */
const HERO_CAST = ['belle', 'wise', 'eous'] as const

export function HomeView() {
  const t = useTranslations('home')
  const tp = useTranslations('progress')
  const locale = useLocale() as Locale
  const story = useStory()
  const setPickerOpen = useUi((s) => s.setPickerOpen)
  const hasProgress = story.hydrated && story.current

  return (
    <div className="pb-8">
      <section className="gap-10 pt-10 sm:pt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14 grid items-center">
        <motion.div initial="hidden" animate="show" variants={stagger(0.09)}>
          <motion.p
            variants={{
              hidden: { opacity: 0, x: -30 },
              show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: ease.outExpo } },
            }}
            className="gap-3 text-xs font-semibold flex items-center font-mono tracking-[0.35em] text-primary uppercase"
          >
            <Radio
              className="motion-ambient size-4 animate-[flicker_3.5s_linear_infinite]"
              aria-hidden
            />
            {t('kicker')}
          </motion.p>
          <motion.h1
            variants={{
              hidden: { opacity: 0, y: 40, skewX: -10 },
              show: {
                opacity: 1,
                y: 0,
                skewX: 0,
                transition: { duration: 0.8, ease: ease.outExpo },
              },
            }}
            className="mt-4 display text-[clamp(3.5rem,15vw,9.5rem)]"
          >
            <GlitchText text={t('title')} />
          </motion.h1>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-muted"
          >
            {t('lede')}
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
            }}
            className="mt-8 gap-3 sm:flex-row flex flex-col"
          >
            {hasProgress ? (
              <Button asChild size="lg">
                <Link href="/recap">
                  {t('ctaRecap')}
                  <ArrowRight
                    className="group-hover/button:translate-x-1 transition-transform"
                    aria-hidden
                  />
                </Link>
              </Button>
            ) : (
              <Button size="lg" onClick={() => setPickerOpen(true)}>
                {t('ctaStart')}
                <ArrowRight
                  className="group-hover/button:translate-x-1 transition-transform"
                  aria-hidden
                />
              </Button>
            )}
            {hasProgress && (
              <Button variant="outline" size="lg" onClick={() => setPickerOpen(true)}>
                {tp('change')}
              </Button>
            )}
          </motion.div>
        </motion.div>

        {/* CRT monitor */}
        <motion.div initial="hidden" animate="show" variants={crtOn} className="relative">
          <Panel frame="var(--color-primary)" innerClassName="overflow-hidden">
            <div className="relative aspect-[4/3] overflow-hidden bg-[radial-gradient(120%_90%_at_50%_100%,#c6ff2e33,transparent_60%)]">
              <div className="inset-0 absolute halftone text-primary opacity-15" aria-hidden />
              <div className="inset-0 absolute flex items-end justify-center">
                {HERO_CAST.map((id, i) => {
                  const c = charactersById.get(id)
                  if (!c?.image) return null
                  return (
                    <motion.div
                      key={id}
                      className="relative -mx-[3%] h-[92%] w-[38%]"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 + i * 0.12, duration: 0.7, ease: ease.outExpo }}
                      style={{
                        zIndex: id === 'eous' ? 3 : 2 - i,
                        height: id === 'eous' ? '42%' : undefined,
                      }}
                    >
                      <Portrait
                        src={c.image}
                        name={c.name}
                        color={c.color}
                        alt={c.name}
                        priority
                        sizes="(min-width: 1024px) 18vw, 36vw"
                        className="object-contain object-bottom drop-shadow-[0_10px_30px_rgba(0,0,0,0.6)]"
                      />
                    </motion.div>
                  )
                })}
              </div>
              <div className="inset-0 pointer-events-none absolute scanlines" aria-hidden />
              <div
                className="motion-ambient inset-x-0 top-0 via-white/6 pointer-events-none absolute h-1/4 animate-[scan_5s_linear_infinite] bg-gradient-to-b from-transparent to-transparent"
                aria-hidden
              />
              <div className="top-3 left-4 gap-2 font-bold text-white/80 absolute flex items-center font-mono text-[0.65rem] tracking-[0.2em]">
                <span className="motion-ambient size-2 bg-red-500 animate-[blink_1.4s_steps(2,start)_infinite]" />
                CH-06 · RANDOM PLAY
              </div>
              <div className="right-4 bottom-3 absolute font-mono text-[0.65rem] tracking-[0.2em] text-primary">
                ▶ PLAY
              </div>
            </div>
          </Panel>
        </motion.div>
      </section>

      {/* Status */}
      <Reveal className="mt-16">
        <RevealItem>
          <Panel innerClassName="grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="font-mono text-[0.7rem] tracking-[0.25em] text-subtle uppercase">
                {t('statusLabel')}
              </p>
              {hasProgress && story.current && story.currentChapter ? (
                <>
                  <p className="mt-2 text-3xl sm:text-4xl display">
                    <span style={{ color: story.currentChapter.accent }}>
                      {story.currentChapter.label[locale]}
                    </span>{' '}
                    · {story.current.title[locale]}
                  </p>
                  <ProgressTicks
                    className="mt-4 max-w-md"
                    total={story.totalCount}
                    done={story.doneCount}
                    label={tp('ratio', { done: story.doneCount, total: story.totalCount })}
                  />
                  <p className="mt-2 text-xs font-mono text-muted">
                    {tp('ratio', { done: story.doneCount, total: story.totalCount })}
                  </p>
                </>
              ) : (
                <p className="mt-2 text-lg text-muted">{t('statusEmpty')}</p>
              )}
            </div>
            <Button
              variant={hasProgress ? 'secondary' : 'primary'}
              onClick={() => setPickerOpen(true)}
            >
              {hasProgress ? tp('change') : tp('set')}
            </Button>
          </Panel>
        </RevealItem>
      </Reveal>

      <FeaturesSection />

      {/* How it works */}
      <section className="mt-20" aria-labelledby="how">
        <h2 id="how" className="text-4xl sm:text-5xl display">
          {t('stepsTitle')}
        </h2>
        <Reveal className="mt-6 gap-4 sm:grid-cols-3 grid" variants={stagger(0.1)}>
          {(['step1', 'step2', 'step3'] as const).map((key, i) => (
            <RevealItem key={key}>
              <Panel innerClassName="p-6 h-full">
                <span className="text-6xl display text-outline text-primary">0{i + 1}</span>
                <p className="mt-3 text-lg leading-snug">{t(key)}</p>
              </Panel>
            </RevealItem>
          ))}
        </Reveal>
        <p className="mt-6 text-xs font-mono text-subtle">
          {t('coverage', { version: coverage.gameVersion })}
        </p>
      </section>
    </div>
  )
}
