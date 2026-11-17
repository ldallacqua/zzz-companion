import { describe, expect, it } from 'vitest'
import { createRemoteDb } from './remote'

describe('createRemoteDb', () => {
  it('rejects local file databases (the production bundle has no native SQLite)', () => {
    expect(() => createRemoteDb('file:./.data/dev.db')).toThrow(/remote libSQL URL/)
  })

  it('accepts a Turso URL without connecting', () => {
    expect(() => createRemoteDb('libsql://example.invalid', 'token')).not.toThrow()
  })
})
