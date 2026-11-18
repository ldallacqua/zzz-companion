import { describe, expect, it } from 'vitest'
import { deviceProgress, reconcileProgress } from './progress-sync'

const at = (lastSegmentId: string | null, setAt: number) => ({ lastSegmentId, setAt })

describe('progress sync', () => {
  it('reads the device copy; untimed progress from before sync is the oldest choice', () => {
    expect(deviceProgress({ lastSegmentId: null, progressSetAt: null })).toBeNull()
    expect(deviceProgress({ lastSegmentId: 'c1a-train', progressSetAt: null })).toEqual(
      at('c1a-train', 0),
    )
    expect(deviceProgress({ lastSegmentId: null, progressSetAt: 5 })).toEqual(at(null, 5))
  })

  it('sends this device’s progress to an account that has none', () => {
    expect(reconcileProgress(at('c1a-train', 0), null)).toEqual({
      winner: at('c1a-train', 0),
      save: true,
      adopt: false,
    })
  })

  it('takes the account’s progress on a device that never set one', () => {
    expect(reconcileProgress(null, at('i2b-farewell', 9))).toEqual({
      winner: at('i2b-farewell', 9),
      save: false,
      adopt: true,
    })
    expect(reconcileProgress(null, null)).toEqual({ winner: null, save: false, adopt: false })
  })

  it('keeps the most recent choice, even when it moves back in the story', () => {
    expect(reconcileProgress(at('p-strongbox', 20), at('i2b-farewell', 10))).toMatchObject({
      winner: at('p-strongbox', 20),
      save: true,
      adopt: false,
    })
    expect(reconcileProgress(at('i2b-farewell', 10), at('p-strongbox', 20))).toMatchObject({
      winner: at('p-strongbox', 20),
      save: false,
      adopt: true,
    })
  })

  it('does nothing when both already agree', () => {
    expect(reconcileProgress(at('c1a-train', 7), at('c1a-train', 7))).toEqual({
      winner: at('c1a-train', 7),
      save: false,
      adopt: false,
    })
  })
})
