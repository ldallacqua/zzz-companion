// @vitest-environment node
import { existsSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

/**
 * Every component has a Storybook page (AGENTS.md → "Quality gates"). Adding a component without
 * a sibling `*.stories.tsx` fails here; the stories themselves are tested by `pnpm test:storybook`.
 */
const DIRS = {
  'packages/ui': new URL('../../../../packages/ui/src/components/', import.meta.url),
  'apps/web': new URL('./', import.meta.url),
}
/** Non-visual modules that render no UI of their own. */
const EXEMPT = new Set(['providers.tsx'])

describe('Storybook coverage', () => {
  for (const [name, url] of Object.entries(DIRS)) {
    const dir = fileURLToPath(url)
    const components = readdirSync(dir).filter(
      (f) => f.endsWith('.tsx') && !f.endsWith('.stories.tsx') && !EXEMPT.has(f),
    )

    it(`${name}: finds components`, () => {
      expect(components.length).toBeGreaterThan(0)
    })

    it.each(components)(`${name}: %s has stories`, (file) => {
      const stories = file.replace(/\.tsx$/, '.stories.tsx')
      expect(existsSync(`${dir}/${stories}`), `missing ${name}/…/${stories}`).toBe(true)
    })
  }
})
