'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowLeft } from 'lucide-react'
import { Badge, Button, cn, ease, GlitchText, Reveal, riseInSolid, stampIn } from '@zzz/ui'
import {
  appearancesOf,
  knownHistoryAt,
  relatedCharacters,
  type Character,
  type Locale,
} from '@zzz/core'
import { characters, factionsById, timeline } from '@zzz/story'
import { Link } from '@/i18n/navigation'
import { useStory } from '@/lib/use-story'
import { useDocumentTitle } from '@/lib/use-document-title'
import { useUi } from '@/lib/ui-store'
import { Appearances } from './appearances'
import { CharacterPoster, LockedPoster } from './character-poster'
import { ComingSoonPanel } from './coming-soon-panel'
import { Dossier, usePartLabel } from './dossier'
import { RelatedCharacters } from './related-characters'

const GRID =
  'mt-4 grid gap-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start md:gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14'

/**
 * A character's file. The server only knows the id: everything about the character renders after
 * local progress hydrates, and only if the reader has met them (gating in @zzz/core). Until then,
 * and for characters still locked, the page shows the same generic "File locked" state for every
 * id — no name, colour, art or chapter.
 */
export function CharacterFileView({ id }: { id: string }) {
  const story = useStory()
  const character = story.hydrated ? story.characters.unlocked.find((c) => c.id === id) : undefined
  // Remember if this visit started locked, to stamp the file "Unlocked" when progress opens it.
  const [wasLocked, setWasLocked] = useState(false)
  if (story.hydrated && !character && !wasLocked) setWasLocked(true)

  // Relocking (progress moved back) shows the locked state from the top, not at the footer.
  const openId = useRef<string | undefined>(undefined)
  useEffect(() => {
    if (openId.current && !character) window.scrollTo({ top: 0 })
    openId.current = character?.id
  }, [character])

  return (
    <div className="pt-6 pb-16">
      {character ? (
        <OpenFile character={character} justUnlocked={wasLocked} />
      ) : (
        <LockedFile pending={!story.hydrated} noProgress={!story.current} />
      )}
    </div>
  )
}

function BackLink({ href }: { href: string }) {
  const t = useTranslations('characterFile')
  return (
    <Link
      href={href}
      className="min-h-10 gap-2 font-semibold text-xs inline-flex items-center font-mono tracking-[0.2em] text-muted uppercase focus-inset transition-colors hover:text-primary"
    >
      <ArrowLeft className="size-4" aria-hidden />
      {t('back')}
    </Link>
  )
}

function OpenFile({ character, justUnlocked }: { character: Character; justUnlocked: boolean }) {
  const t = useTranslations('characterFile')
  const tf = useTranslations('features')
  const locale = useLocale() as Locale
  const story = useStory()
  const part = usePartLabel()
  const setPickerOpen = useUi((s) => s.setPickerOpen)
  const name = character.name[locale]
  const firstSegment = timeline.getSegment(character.unlockedAt)
  const firstChapter = firstSegment ? timeline.getChapter(firstSegment.chapterId) : undefined

  useDocumentTitle(`${name} · ${t('kicker')} · ZZZ Companion`)

  const notes = knownHistoryAt(timeline, story.progress, character, character.blurb)
  const appearances = appearancesOf(timeline, story.progress, character.id)
  const related = relatedCharacters(timeline, story.progress, character.id, characters)

  return (
    <>
      <BackLink href={`/characters#character-${character.id}`} />
      <div className={GRID}>
        <div className="md:sticky md:top-24">
          <CharacterPoster character={character} firstSeen={firstChapter?.label[locale] ?? ''} />
        </div>

        <div className="min-w-0">
          {/* On phones the identity block overlaps the bottom of the poster like a sleeve label. */}
          <div
            className="mx-3 -mt-10 px-4 py-3 md:mx-0 md:mt-0 md:p-0 md:border-l-0 md:bg-transparent md:[clip-path:none] relative z-10 border-l-8 bg-surface-2 chamfer-tr"
            style={{ borderLeftColor: character.color }}
          >
            <p className="gap-3 text-xs font-semibold flex items-center font-mono tracking-[0.3em] text-primary uppercase">
              <span className="w-8 h-px bg-primary" aria-hidden />
              {t('kicker')}
              {justUnlocked && (
                <motion.span variants={stampIn} initial="hidden" animate="show">
                  <Badge variant="primary">{t('unlocked')}</Badge>
                </motion.span>
              )}
            </p>
            <motion.h1
              initial={{ y: 30, skewX: -8 }}
              animate={{ y: 0, skewX: 0 }}
              transition={{ duration: 0.7, ease: ease.outExpo }}
              className="mt-2 display text-[clamp(2.5rem,8vw,5.5rem)]"
            >
              <GlitchText text={name} />
            </motion.h1>
          </div>

          {character.factions.length > 0 && (
            <ul className="mt-4 gap-2 flex flex-wrap" aria-label={t('factions')}>
              {character.factions.map((fid) => (
                <li key={fid} className="max-w-full">
                  <Link
                    href={`/glossary#faction-${fid}`}
                    className="min-h-10 inline-flex max-w-full items-center focus-inset"
                  >
                    <Badge variant="outline" className="py-1 whitespace-normal">
                      {factionsById.get(fid)?.name[locale]}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <p className="mt-3 font-mono text-[0.68rem] tracking-[0.14em] text-muted uppercase">
            {t('firstSeen', { part: part(character.unlockedAt) })}
          </p>

          <div className="mt-4 gap-3 py-1.5 pr-1.5 pl-3 flex items-center justify-between border border-dashed border-border-strong">
            <p className="min-w-0 font-mono text-[0.64rem] tracking-[0.14em] text-muted uppercase">
              {t('asOfYou')}{' '}
              <span className="text-foreground">{story.current ? part(story.current.id) : ''}</span>
            </p>
            <Button variant="secondary" size="sm" onClick={() => setPickerOpen(true)}>
              {t('change')}
              <span className="sr-only">{t('changeSr')}</span>
            </Button>
          </div>

          <Dossier notes={notes} />

          <Reveal variants={riseInSolid}>
            <Appearances chapters={appearances} />
          </Reveal>
          <Reveal variants={riseInSolid}>
            <RelatedCharacters related={related} />
          </Reveal>
          {character.playable && (
            <Reveal variants={riseInSolid}>
              <ComingSoonPanel id="build" title={t('buildTitle')} badge={tf('soonBadge')}>
                {t('buildBody', { name })}
              </ComingSoonPanel>
            </Reveal>
          )}
        </div>
      </div>
    </>
  )
}

/**
 * Identical for every locked id. Before hydration it is already in the HTML, so a first visit
 * paints it at once; for returning readers (data-progress="set") it stays invisible until their
 * file (or the locked state) replaces it.
 */
function LockedFile({ pending, noProgress }: { pending: boolean; noProgress: boolean }) {
  const t = useTranslations('characterFile')
  const tr = useTranslations('recap')
  const tp = useTranslations('progress')
  const setPickerOpen = useUi((s) => s.setPickerOpen)
  // Same title for every locked id (and back to generic after a relock).
  useDocumentTitle(`${t('kicker')} · ZZZ Companion`)
  return (
    <>
      {pending && (
        <p className="sr-only" aria-live="polite">
          {t('loading')}
        </p>
      )}
      <div
        className={cn(pending && 'in-data-[progress=set]:invisible')}
        aria-busy={pending || undefined}
        data-testid="character-file-locked"
      >
        <BackLink href="/characters" />
        <div className={GRID}>
          <LockedPoster label={t('classified')} />
          <div className="min-w-0">
            <p className="gap-3 text-xs font-semibold flex items-center font-mono tracking-[0.3em] text-primary uppercase">
              <span className="w-8 h-px bg-primary" aria-hidden />
              {t('kicker')}
            </p>
            <h1 className="mt-2 display text-[clamp(2.5rem,8vw,5.5rem)]">{t('lockedTitle')}</h1>
            <p className="mt-3 text-lg max-w-[50ch] text-muted">
              {noProgress ? t('lockedNoProgress') : t('lockedBody')}
            </p>
            {/* One action: the back link above already leads to all characters. */}
            <Button className="mt-6" onClick={() => setPickerOpen(true)}>
              {noProgress ? tp('set') : tr('endCta')}
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
