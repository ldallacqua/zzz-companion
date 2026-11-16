import { describe, expect, it } from 'vitest'
import { resolveMotion } from './providers'

describe('resolveMotion', () => {
  it('follows the OS setting when the preference is "system"', () => {
    expect(resolveMotion('system', false)).toBe('full')
    expect(resolveMotion('system', true)).toBe('reduced')
  })

  it('lets an explicit preference win over the OS setting', () => {
    expect(resolveMotion('full', true)).toBe('full')
    expect(resolveMotion('off', false)).toBe('off')
    expect(resolveMotion('reduced', false)).toBe('reduced')
  })
})
