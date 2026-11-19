// @vitest-environment node
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { features } from './features'

const readme = readFileSync(
  fileURLToPath(new URL('../../../../README.md', import.meta.url)),
  'utf8',
)

/**
 * Guard rail for AGENTS.md → "Docs that must stay in sync":
 * the landing page renders `features`, so README must list the same features.
 */
describe('feature registry ↔ README', () => {
  it('README mentions every feature by its English title', () => {
    const missing = features.filter((f) => !readme.includes(f.title.en)).map((f) => f.title.en)
    expect(missing, `Add these to README.md: ${missing.join(', ')}`).toEqual([])
  })

  it('feature ids are unique', () => {
    const ids = features.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('planned features close the landing page (Next time on); shipped ones sit in an act', () => {
    for (const f of features) expect(f.act === 'next', f.id).toBe(f.status === 'planned')
  })

  it('a planned feature only builds on features listed before it', () => {
    for (const [i, f] of features.entries()) {
      if (!f.needs) continue
      expect(f.status, f.id).toBe('planned')
      const earlier = features.slice(0, i).map((e) => e.id)
      for (const need of f.needs) expect(earlier, `${f.id} needs ${need}`).toContain(need)
    }
  })
})
