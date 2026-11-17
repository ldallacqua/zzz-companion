'use client'

import { useLocale } from 'next-intl'
import { entityKey, type Locale } from '@zzz/core'
import { charactersById } from '@zzz/story'
import { EntityLink } from './entity-link'
import { Portrait } from './portrait'

/**
 * Chamfered portraits of the characters featured in a recap part. With `at` (the part's id) each
 * one is a 40px button that opens the character's intel card as of that part — so who-is-who
 * works on touch screens too, where there is no hover tooltip.
 */
export function AvatarStack({
  ids,
  label,
  listLabel = label,
  at,
}: {
  ids: readonly string[]
  /** Visible caption, e.g. "Featuring". */
  label: string
  /** Screen-reader name for the list, when the caption alone says too little. */
  listLabel?: string
  /** Recap part these characters appear in; makes each avatar open its intel card. */
  at?: string
}) {
  const locale = useLocale() as Locale
  const people = ids.map((id) => charactersById.get(id)).filter((c) => c !== undefined)
  if (people.length === 0) return null
  return (
    <div className="gap-2 flex flex-wrap items-center">
      <span
        className="mr-1 font-mono text-[0.62rem] tracking-[0.2em] text-subtle uppercase"
        aria-hidden
      >
        {label}
      </span>
      <ul className="gap-1.5 flex flex-wrap" aria-label={listLabel}>
        {people.map((c) => {
          const avatar = (
            <span
              className="size-10 relative block overflow-hidden chamfer-sm"
              style={{ backgroundColor: `${c.color}33`, boxShadow: `inset 0 -2px 0 ${c.color}` }}
            >
              <Portrait
                src={c.image}
                name={c.name[locale]}
                color={c.color}
                alt={c.name[locale]}
                focus={c.focus}
                framing="face"
                sizes="40px"
                monogram="sm"
              />
            </span>
          )
          return (
            <li key={c.id} title={at ? undefined : c.name[locale]}>
              {at ? (
                <EntityLink entityKey={entityKey('character', c.id)} at={at} appearance="avatar">
                  {avatar}
                </EntityLink>
              ) : (
                avatar
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
