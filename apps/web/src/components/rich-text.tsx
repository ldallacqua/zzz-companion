'use client'

import { Fragment, useMemo } from 'react'
import { tokenizeRich, type RichToken } from '@zzz/core'
import { useEntityMatcher } from '@/lib/use-entities'
import { EntityLink } from './entity-link'

/**
 * Renders a block of recap paragraphs: **bold** markup plus clickable characters/terms
 * (first mention per block only). No dangerouslySetInnerHTML anywhere.
 */
export function RichBlock({
  paragraphs,
  render,
}: {
  paragraphs: readonly string[]
  render: (children: React.ReactNode, index: number) => React.ReactNode
}) {
  const matcher = useEntityMatcher()
  const blocks = useMemo(() => tokenizeRich(paragraphs, matcher), [paragraphs, matcher])
  return (
    <>
      {blocks.map((tokens, i) => (
        <Fragment key={i}>{render(<Tokens tokens={tokens} />, i)}</Fragment>
      ))}
    </>
  )
}

function Tokens({ tokens }: { tokens: RichToken[] }) {
  return (
    <>
      {tokens.map((token, i) =>
        token.entity ? (
          <EntityLink key={i} entityKey={token.entity} strong={token.strong}>
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
