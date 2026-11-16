export type InlineToken = { type: 'text' | 'strong'; value: string }

/**
 * Parses the tiny markup allowed in recap paragraphs: **bold** only.
 * Kept deliberately small so content stays easy to write and impossible to break layout with.
 */
export function parseInlineMarkup(input: string): InlineToken[] {
  const tokens: InlineToken[] = []
  const pattern = /\*\*(.+?)\*\*/g
  let last = 0
  for (const match of input.matchAll(pattern)) {
    const index = match.index ?? 0
    if (index > last) tokens.push({ type: 'text', value: input.slice(last, index) })
    tokens.push({ type: 'strong', value: match[1] ?? '' })
    last = index + match[0].length
  }
  if (last < input.length) tokens.push({ type: 'text', value: input.slice(last) })
  return tokens
}
