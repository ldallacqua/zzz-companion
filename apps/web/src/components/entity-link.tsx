'use client'

import { useLocale, useTranslations } from 'next-intl'
import { ArrowUpRight, BookMarked, Flag, UserRound } from 'lucide-react'
import { cn, Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@zzz/ui'
import { knownTextAt, type EntityKey, type Locale } from '@zzz/core'
import { factionsById, linkableByKey, timeline } from '@zzz/story'
import { Link } from '@/i18n/navigation'
import { useContextProgress } from '@/lib/use-entities'
import { Portrait } from './portrait'

/**
 * Tappable name that opens an "intel card" about it: inline in recap text (`appearance="text"`),
 * or wrapped around a character's avatar (`appearance="avatar"`).
 * `at` is the recap part the name appears in: the card explains it as known at that point.
 */
export function EntityLink({
  entityKey,
  children,
  strong,
  at,
  appearance = 'text',
}: {
  entityKey: EntityKey
  children: React.ReactNode
  strong?: boolean
  at?: string
  appearance?: 'text' | 'avatar'
}) {
  const locale = useLocale() as Locale
  const entity = linkableByKey.get(entityKey)
  if (!entity) return <>{children}</>
  const color = entity.kind === 'character' ? entity.data.color : 'var(--color-primary)'
  const name = entity.kind === 'term' ? entity.data.term[locale] : entity.data.name[locale]
  return (
    <Popover>
      <PopoverTrigger
        data-entity={entityKey}
        className={cn(
          appearance === 'avatar'
            ? 'hover:-translate-y-0.5 relative block cursor-pointer focus-inset transition-transform chamfer-sm data-[state=open]:outline-2 data-[state=open]:-outline-offset-4 data-[state=open]:outline-primary data-[state=open]:outline-solid'
            : [
                // One calm, neutral underline for every name; the entity's colour shows on hover,
                // on focus and in the card's frame.
                'cursor-pointer rounded-[2px] underline decoration-subtle decoration-dotted decoration-2 underline-offset-[5px] transition-colors',
                'hover:bg-primary/15 hover:text-primary hover:decoration-(--entity) focus-visible:bg-primary/15 focus-visible:decoration-(--entity)',
                'data-[state=open]:bg-primary data-[state=open]:text-primary-foreground',
                strong ? 'font-semibold text-foreground' : 'text-foreground/90',
              ],
        )}
        style={{ ['--entity' as string]: color }}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent frame={color} side="top" align="center" aria-label={name}>
        <EntityCard entityKey={entityKey} at={at} />
      </PopoverContent>
    </Popover>
  )
}

function EntityCard({ entityKey, at }: { entityKey: EntityKey; at?: string }) {
  const t = useTranslations('entity')
  const locale = useLocale() as Locale
  const progress = useContextProgress(at)
  const entity = linkableByKey.get(entityKey)!
  const asOf = at ? <AsOf at={at} /> : null

  if (entity.kind === 'character') {
    const c = entity.data
    return (
      <div className="gap-4 p-4 flex">
        <span
          className="size-20 relative shrink-0 overflow-hidden chamfer-sm"
          style={{ backgroundColor: `${c.color}26`, boxShadow: `inset 0 -3px 0 ${c.color}` }}
        >
          <Portrait
            src={c.image}
            name={c.name[locale]}
            color={c.color}
            focus={c.focus}
            framing="face"
            sizes="80px"
            monogram="sm"
          />
        </span>
        <div className="min-w-0">
          <Kicker icon={<UserRound className="size-3" aria-hidden />}>{t('character')}</Kicker>
          <p className="mt-1 text-2xl display leading-none">{c.name[locale]}</p>
          {c.factions.length > 0 && (
            <p className="mt-1 font-mono text-[0.6rem] tracking-[0.14em] text-subtle uppercase">
              {c.factions.map((id) => factionsById.get(id)?.name[locale]).join(' / ')}
            </p>
          )}
          <p className="mt-2 text-sm leading-snug text-muted">
            {knownTextAt(timeline, progress, c.blurb, c.revisions)[locale]}
          </p>
          {asOf}
          <MoreLink href={`/characters#character-${c.id}`} label={t('seeAllCharacters')} />
        </div>
      </div>
    )
  }

  const isTerm = entity.kind === 'term'
  const title = isTerm ? entity.data.term[locale] : entity.data.name[locale]
  const body = knownTextAt(
    timeline,
    progress,
    isTerm ? entity.data.definition : entity.data.description,
    entity.data.revisions,
  )[locale]
  const anchor = `/glossary#${entity.kind}-${entity.data.id}`
  return (
    <div className="p-4 pr-14">
      <div
        className="inset-y-0 right-0 w-10 absolute halftone text-primary opacity-15"
        aria-hidden
      />
      <Kicker
        icon={
          isTerm ? (
            <BookMarked className="size-3" aria-hidden />
          ) : (
            <Flag className="size-3" aria-hidden />
          )
        }
      >
        {isTerm ? t('term') : t('faction')}
      </Kicker>
      <p className="mt-1 text-2xl relative display leading-none">{title}</p>
      <p className="mt-2 text-sm leading-snug relative text-muted">{body}</p>
      {asOf}
      <MoreLink href={anchor} label={t('seeGlossary')} />
    </div>
  )
}

/** "As of Ch. 1A · The Hideouts": the point of the story this card describes. */
function AsOf({ at }: { at: string }) {
  const t = useTranslations('entity')
  const locale = useLocale() as Locale
  const segment = timeline.getSegment(at)
  if (!segment) return null
  const chapter = timeline.getChapter(segment.chapterId)
  const part = `${chapter?.label[locale] ?? ''} · ${segment.title[locale]}`
  return (
    <p className="mt-2 relative font-mono text-[0.6rem] tracking-[0.12em] text-subtle uppercase">
      {t('asOf', { part })}
    </p>
  )
}

function Kicker({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <p className="gap-1.5 font-semibold flex items-center font-mono text-[0.6rem] tracking-[0.2em] text-primary uppercase">
      {icon}
      {children}
    </p>
  )
}

function MoreLink({ href, label }: { href: string; label: string }) {
  return (
    <PopoverClose asChild>
      <Link
        href={href}
        className="mt-1 min-h-10 gap-1 font-semibold relative inline-flex items-center font-mono text-[0.65rem] tracking-[0.14em] text-foreground uppercase hover:text-primary"
      >
        {label}
        <ArrowUpRight className="size-3" aria-hidden />
      </Link>
    </PopoverClose>
  )
}
