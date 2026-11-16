'use client'

import { Fragment, useMemo } from 'react'
import { tokenizeRich, type RichToken } from '@zzz/core'
import { useEntityMatcher } from '@/lib/use-entities'
import { EntityLink } from './entity-link'

/**
 * Renders a block of recap paragraphs: **bold** markup plus clickable characters/terms
 * (first mention per block only). No dangerouslySetInnerHTML anywhere.
 *
 * `at` is the recap part the text belongs to: names are linked and explained as of that part, so
 * an intel card in Chapter 1 never uses facts from Chapter 2.
 */
export function RichBlock({
  paragraphs,
  render,
  at,
}: {
  paragraphs: readonly string[]
  render: (children: React.ReactNode, index: number) => React.ReactNode
  at?: string
}) {
  const matcher = useEntityMatcher(at)
  const blocks = useMemo(() => tokenizeRich(paragraphs, matcher), [paragraphs, matcher])
  return (
    <>
      {blocks.map((tokens, i) => (
        <Fragment key={i}>{render(<Tokens tokens={tokens} at={at} />, i)}</Fragment>
      ))}
    </>
  )
}

/** Punctuation that must stay on the same line as the name it touches: "(Nicole", "Fairy’s", "Billy)". */
const OPENING = /[(\[“"‘]+$/u
const CLOSING = /^(?:[’']s(?![\p{L}]))?[)\]”"’.,;:!?…]*/u

/**
 * A tappable name is an atomic inline, so the browser may break a line right next to it and leave
 * "(" or ")" alone at a line edge. Glue touching punctuation from plain neighbouring text to it.
 */
function glue(tokens: RichToken[]) {
  const items = tokens.map((t) => ({ ...t, before: '', after: '' }))
  items.forEach((item, i) => {
    if (!item.entity) return
    const prev = items[i - 1]
    const next = items[i + 1]
    if (prev && !prev.entity && !prev.strong) {
      const m = prev.value.match(OPENING)
      if (m) {
        item.before = m[0]
        prev.value = prev.value.slice(0, -m[0].length)
      }
    }
    if (next && !next.entity && !next.strong) {
      const m = next.value.match(CLOSING)
      if (m?.[0]) {
        item.after = m[0]
        next.value = next.value.slice(m[0].length)
      }
    }
  })
  return items
}

function Tokens({ tokens, at }: { tokens: RichToken[]; at?: string }) {
  const items = useMemo(() => glue(tokens), [tokens])
  return (
    <>
      {items.map((token, i) =>
        token.entity ? (
          <span key={i} className={token.before || token.after ? 'whitespace-nowrap' : undefined}>
            {token.before}
            <EntityLink entityKey={token.entity} strong={token.strong} at={at}>
              {token.value}
            </EntityLink>
            {token.after}
          </span>
        ) : token.strong ? (
          <strong key={i} className="font-semibold text-foreground">
            {token.value}
          </strong>
        ) : (
          <Fragment key={i}>{token.value}</Fragment>
        ),
      )}
    </>
  )
}
