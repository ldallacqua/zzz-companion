'use client'

import { useId } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import type { Character, Locale, RelatedCharacter } from '@zzz/core'
import { Link } from '@/i18n/navigation'
import { Portrait } from './portrait'

/** "Often seen with": unlocked characters ranked by `relatedCharacters` in @zzz/core. */
export function RelatedCharacters({
  related,
}: {
  related: readonly RelatedCharacter<Character>[]
}) {
  const t = useTranslations('characterFile')
  const locale = useLocale() as Locale
  const titleId = useId()
  if (related.length === 0) return null

  return (
    <section aria-labelledby={titleId} className="mt-12">
      <h2 id={titleId} className="text-3xl display">
        {t('seenWith')}
      </h2>
      <ul className="mt-4 gap-1.5 md:grid-cols-2 grid">
        {related.map(({ character: c, sharedParts }) => (
          <li key={c.id}>
            <Link
              href={`/characters/${c.id}`}
              className="group min-h-15 gap-3 p-1.5 pr-3 flex items-center bg-surface focus-inset transition-colors chamfer-sm hover:bg-surface-2"
            >
              <span
                className="size-12 relative block shrink-0 overflow-hidden chamfer-sm"
                style={{ backgroundColor: `${c.color}33`, boxShadow: `inset 0 -2px 0 ${c.color}` }}
              >
                <Portrait
                  src={c.image}
                  name={c.name[locale]}
                  color={c.color}
                  focus={c.focus}
                  framing="face"
                  sizes="48px"
                  monogram="sm"
                  className="transition-[scale] duration-300 group-hover:scale-[1.06] in-data-[motion=reduced]:group-hover:scale-100"
                />
              </span>
              <span className="min-w-0">
                <span className="text-xl leading-tight line-clamp-2 block display">
                  {c.name[locale]}
                </span>
                <span className="block font-mono text-[0.62rem] tracking-[0.14em] text-subtle uppercase">
                  {sharedParts > 0 ? t('sharedParts', { count: sharedParts }) : t('sameFaction')}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
