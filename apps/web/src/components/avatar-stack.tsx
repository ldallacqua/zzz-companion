'use client'

import { charactersById } from '@zzz/story'
import { Portrait } from './portrait'

/** Small chamfered portraits for the characters featured in a recap part. */
export function AvatarStack({ ids, label }: { ids: readonly string[]; label: string }) {
  const people = ids.map((id) => charactersById.get(id)).filter((c) => c !== undefined)
  if (people.length === 0) return null
  return (
    <div className="gap-2 flex flex-wrap items-center">
      <span className="mr-1 font-mono text-[0.62rem] tracking-[0.2em] text-subtle uppercase">
        {label}
      </span>
      <ul className="gap-1.5 flex flex-wrap">
        {people.map((c) => (
          <li key={c.id} title={c.name}>
            <span
              className="size-9 relative block overflow-hidden chamfer-sm"
              style={{ backgroundColor: `${c.color}33`, boxShadow: `inset 0 -2px 0 ${c.color}` }}
            >
              <Portrait
                src={c.image}
                name={c.name}
                color={c.color}
                alt={c.name}
                focus={c.focus}
                framing="face"
                sizes="36px"
                monogram="sm"
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
