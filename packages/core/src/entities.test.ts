import { describe, expect, it } from 'vitest'
import { createEntityMatcher, stripParenthetical, tokenizeRich } from './entities'

const matcher = createEntityMatcher([
  { key: 'term:dead-end-hollow', aliases: ['Dead End Hollow'] },
  { key: 'term:hollow', aliases: ['Hollow', 'Hollows'] },
  { key: 'term:hand', aliases: ['H.A.N.D.'] },
  { key: 'term:tops', aliases: ['TOPS'] },
  { key: 'character:koleda', aliases: ['Koleda Belobog', 'Koleda'] },
  { key: 'faction:belobog', aliases: ['Belobog', 'Koleda'] },
])

const links = (text: string) =>
  tokenizeRich([text], matcher)[0]!
    .filter((t) => t.entity)
    .map((t) => [t.value, t.entity])

describe('entity linking', () => {
  it('prefers the longest alias', () => {
    expect(links('Into the Dead End Hollow.')).toEqual([
      ['Dead End Hollow', 'term:dead-end-hollow'],
    ])
    expect(links('Koleda Belobog leads Belobog.')).toEqual([
      ['Koleda Belobog', 'character:koleda'],
      ['Belobog', 'faction:belobog'],
    ])
  })

  it('links only the first mention of each entity per block', () => {
    const [p1, p2] = tokenizeRich(['A Hollow appears.', 'Another Hollow.'], matcher)
    expect(p1!.some((t) => t.entity === 'term:hollow')).toBe(true)
    expect(p2!.some((t) => t.entity)).toBe(false)
  })

  it('is case-sensitive and respects word boundaries', () => {
    expect(links('stop the tops of Hollowness')).toEqual([])
    expect(links('the TOPS alliance')).toEqual([['TOPS', 'term:tops']])
  })

  it('handles punctuation inside aliases', () => {
    expect(links('sent to H.A.N.D. for analysis')).toEqual([['H.A.N.D.', 'term:hand']])
  })

  it('keeps bold markup on linked text', () => {
    const [tokens] = tokenizeRich(['Meet **Koleda** now'], matcher)
    expect(tokens).toContainEqual({ value: 'Koleda', strong: true, entity: 'character:koleda' })
  })

  it('first registration wins for shared aliases', () => {
    expect(links('Koleda')).toEqual([['Koleda', 'character:koleda']])
  })

  it('works with no entities', () => {
    expect(tokenizeRich(['plain'], createEntityMatcher([]))).toEqual([
      [{ value: 'plain', strong: false }],
    ])
  })

  it('strips trailing parentheticals', () => {
    expect(stripParenthetical('Esfera Negra (Hollow)')).toBe('Esfera Negra')
  })
})
