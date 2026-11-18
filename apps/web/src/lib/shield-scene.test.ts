import { describe, expect, it } from 'vitest'
import { SHIELD_FINAL, SHIELD_START, sameScene, sceneAt, sceneForStep } from './shield-scene'

describe('Act 1 scene script', () => {
  it('starts with the marker on the first part and nothing redacted', () => {
    expect(sceneAt(0)).toMatchObject({ step: 0, here: 0, shield: false, full: false })
  })

  it('walks the marker down, then drops the shield before step 2', () => {
    const heres = [0, 0.1, 0.17, 0.25].map((p) => sceneAt(p).here)
    expect(heres).toEqual([0, 1, 2, 3])
    expect(sceneAt(0.27).shield).toBe(false)
    expect(sceneAt(0.3)).toMatchObject({ step: 0, here: 3, shield: true })
  })

  it('never moves backwards as the reader scrolls down', () => {
    let previous = sceneAt(0)
    for (let p = 0; p <= 1; p += 0.01) {
      const scene = sceneAt(p)
      expect(scene.step).toBeGreaterThanOrEqual(previous.step)
      expect(scene.here).toBeGreaterThanOrEqual(previous.here)
      for (const key of ['shield', 'full', 'intel', 'files'] as const) {
        if (previous[key]) expect(scene[key], `${key} at ${p}`).toBe(true)
      }
      previous = scene
    }
  })

  it('ends on the final frame the HTML ships', () => {
    expect(sameScene(sceneAt(1), SHIELD_FINAL)).toBe(true)
    expect(sameScene(sceneForStep(2), SHIELD_FINAL)).toBe(true)
  })

  it('maps phone captions to cumulative scenes', () => {
    expect(sceneForStep(-1)).toEqual(SHIELD_START)
    expect(sceneForStep(0)).toMatchObject({ shield: true, full: false, files: false })
    expect(sceneForStep(1)).toMatchObject({ full: true, intel: false })
  })
})
