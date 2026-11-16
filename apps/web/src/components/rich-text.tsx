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

function Tokens({ tokens, at }: { tokens: RichToken[]; at?: string }) {
  return (
    <>
      {tokens.map((token, i) =>
        token.entity ? (
          <EntityLink key={i} entityKey={token.entity} strong={token.strong} at={at}>
            {token.value}
          </EntityLink>
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
