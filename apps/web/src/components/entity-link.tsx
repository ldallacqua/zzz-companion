'use client'

import { useLocale, useTranslations } from 'next-intl'
import { ArrowUpRight, BookMarked, Flag, UserRound } from 'lucide-react'
import { cn, Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@zzz/ui'
import type { EntityKey, Locale } from '@zzz/core'
import { factionsById, linkableByKey } from '@zzz/story'
import { Link } from '@/i18n/navigation'
import { Portrait } from './portrait'

/** Inline, tappable name inside recap text that opens an "intel card" about it. */
export function EntityLink({
  entityKey,
  children,
  strong,
}: {
  entityKey: EntityKey
  children: string
  strong?: boolean
}) {
  const entity = linkableByKey.get(entityKey)
  if (!entity) return <>{children}</>
  const color = entity.kind === 'character' ? entity.data.color : 'var(--color-primary)'
  return (
    <Popover>
      <PopoverTrigger
        data-entity={entityKey}
        className={cn(
          'cursor-pointer rounded-[2px] underline decoration-dotted decoration-2 underline-offset-[5px] transition-colors',
          'hover:bg-primary/15 hover:text-primary focus-visible:bg-primary/15 data-[state=open]:bg-primary data-[state=open]:text-primary-foreground',
          strong ? 'font-semibold text-foreground' : 'text-foreground/90',
        )}
        style={{ textDecorationColor: color }}
      >
        {children}
      </PopoverTrigger>
      <PopoverContent frame={color} side="top" align="center">
        <EntityCard entityKey={entityKey} />
      </PopoverContent>
    </Popover>
  )
}

function EntityCard({ entityKey }: { entityKey: EntityKey }) {
  const t = useTranslations('entity')
  const locale = useLocale() as Locale
  const entity = linkableByKey.get(entityKey)!

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
            name={c.name}
            color={c.color}
            sizes="80px"
            monogram="sm"
            className="object-cover object-top"
          />
        </span>
        <div className="min-w-0">
          <Kicker icon={<UserRound className="size-3" aria-hidden />}>{t('character')}</Kicker>
          <p className="mt-1 text-2xl display leading-none">{c.name}</p>
          {c.factions.length > 0 && (
            <p className="mt-1 font-mono text-[0.6rem] tracking-[0.14em] text-subtle uppercase">
              {c.factions.map((id) => factionsById.get(id)?.name[locale]).join(' / ')}
            </p>
          )}
          <p className="mt-2 text-sm leading-snug text-muted">{c.blurb[locale]}</p>
          <MoreLink href={`/characters#character-${c.id}`} label={t('seeAllCharacters')} />
        </div>
      </div>
    )
  }

  const isTerm = entity.kind === 'term'
  const title = isTerm ? entity.data.term[locale] : entity.data.name[locale]
  const body = isTerm ? entity.data.definition[locale] : entity.data.description[locale]
  const anchor = `/glossary#${entity.kind}-${entity.data.id}`
  return (
    <div className="p-4">
      <div
        className="inset-y-0 right-0 w-16 absolute halftone text-primary opacity-15"
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
      <MoreLink href={anchor} label={t('seeGlossary')} />
    </div>
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
        className="mt-3 gap-1 font-semibold relative inline-flex items-center font-mono text-[0.65rem] tracking-[0.14em] text-foreground uppercase hover:text-primary"
      >
        {label}
        <ArrowUpRight className="size-3" aria-hidden />
      </Link>
    </PopoverClose>
  )
}
