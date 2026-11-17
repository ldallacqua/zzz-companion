import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createApp } from './app'
import { createAuth } from './auth'
import { createDb, migrateDb } from './db/client'
import { readEnv } from './env'

const WEB = 'http://localhost:3100'
const dir = mkdtempSync(join(tmpdir(), 'zzz-api-'))
const env = readEnv({
  DATABASE_URL: pathToFileURL(join(dir, 'test.db')).href,
  WEB_ORIGINS: WEB,
})
const db = createDb(env.DATABASE_URL)
const app = createApp({ db, auth: createAuth(db, env), origins: env.WEB_ORIGINS })

let ip = 0
/** Each call looks like a different client, so rate limits don't leak between tests. */
function call(path: string, init: RequestInit & { token?: string; json?: unknown } = {}) {
  const headers = new Headers(init.headers)
  headers.set('origin', WEB)
  headers.set('x-forwarded-for', `10.0.0.${++ip % 250}`)
  if (init.token) headers.set('authorization', `Bearer ${init.token}`)
  if (init.json !== undefined) headers.set('content-type', 'application/json')
  return app.request(`/api${path}`, {
    ...init,
    headers,
    body: init.json !== undefined ? JSON.stringify(init.json) : init.body,
  })
}

async function signUp(email: string, password = 'hollow-raider-42', name = 'Wise') {
  const res = await call('/auth/sign-up/email', { method: 'POST', json: { email, password, name } })
  return { res, token: res.headers.get('set-auth-token') }
}

beforeAll(async () => {
  await migrateDb(db)
})
afterAll(() => {
  db.$client.close()
  // Windows can hold the database file for a moment after close; the OS cleans tmp anyway.
  try {
    rmSync(dir, { recursive: true, force: true })
  } catch {
    /* ignore */
  }
})

describe('api', () => {
  it('answers health checks', async () => {
    const res = await call('/health')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ ok: true })
  })

  it('allows the web origin through CORS and exposes the token header', async () => {
    const res = await call('/roster', {
      method: 'OPTIONS',
      headers: { 'access-control-request-method': 'PUT' },
    })
    expect(res.headers.get('access-control-allow-origin')).toBe(WEB)
    const other = await app.request('/api/health', { headers: { origin: 'https://evil.example' } })
    expect(other.headers.get('access-control-allow-origin')).toBeNull()
  })

  it('signs up, signs in and returns a bearer token', async () => {
    const { res, token } = await signUp('belle@example.com')
    expect(res.status).toBe(200)
    expect(token).toBeTruthy()
    expect(res.headers.get('access-control-expose-headers')).toContain('set-auth-token')

    const signIn = await call('/auth/sign-in/email', {
      method: 'POST',
      json: { email: 'belle@example.com', password: 'hollow-raider-42' },
    })
    expect(signIn.status).toBe(200)
    const signInToken = signIn.headers.get('set-auth-token')
    expect(signInToken).toBeTruthy()

    const session = await call('/auth/get-session', { token: signInToken! })
    const body = (await session.json()) as { user: { email: string; name: string } }
    expect(body.user).toMatchObject({ email: 'belle@example.com', name: 'Wise' })
  })

  it('rejects a wrong password, a taken email, a short password and a blank name', async () => {
    await signUp('taken@example.com')
    const wrong = await call('/auth/sign-in/email', {
      method: 'POST',
      json: { email: 'taken@example.com', password: 'not-the-password' },
    })
    expect(wrong.status).toBe(401)
    expect((await signUp('taken@example.com')).res.status).toBe(422)
    expect((await signUp('short@example.com', '1234567')).res.status).toBe(400)
    expect((await signUp('blank@example.com', 'hollow-raider-42', '   ')).res.status).toBe(400)
  })

  it('requires a session for the roster', async () => {
    expect((await call('/roster')).status).toBe(401)
    expect((await call('/roster', { token: 'nope' })).status).toBe(401)
  })

  it('stores, replaces and isolates rosters', async () => {
    const { token: a } = await signUp('a@example.com')
    const { token: b } = await signUp('b@example.com')

    const empty = await call('/roster', { token: a! })
    expect(await empty.json()).toEqual({ entries: [], updatedAt: null })

    const put = await call('/roster', {
      method: 'PUT',
      token: a!,
      json: {
        entries: [
          { agentId: 'miyabi', mindscape: 2 },
          { agentId: 'anby', mindscape: 6 },
        ],
      },
    })
    expect(put.status).toBe(200)

    const got = (await (await call('/roster', { token: a! })).json()) as {
      entries: unknown[]
      updatedAt: number | null
    }
    expect(got.entries).toEqual([
      { agentId: 'anby', mindscape: 6 },
      { agentId: 'miyabi', mindscape: 2 },
    ])
    expect(got.updatedAt).not.toBeNull()

    // Replacing drops what's missing.
    await call('/roster', {
      method: 'PUT',
      token: a!,
      json: { entries: [{ agentId: 'anby', mindscape: 0 }] },
    })
    const replaced = (await (await call('/roster', { token: a! })).json()) as { entries: unknown[] }
    expect(replaced.entries).toEqual([{ agentId: 'anby', mindscape: 0 }])

    // Another player sees only their own.
    const other = (await (await call('/roster', { token: b! })).json()) as { entries: unknown[] }
    expect(other.entries).toEqual([])
  })

  it('rejects invalid rosters', async () => {
    const { token } = await signUp('invalid@example.com')
    for (const entries of [
      [{ agentId: 'anby', mindscape: 7 }],
      [{ agentId: 'Anby!', mindscape: 0 }],
      [
        { agentId: 'anby', mindscape: 0 },
        { agentId: 'anby', mindscape: 1 },
      ],
    ]) {
      const res = await call('/roster', { method: 'PUT', token: token!, json: { entries } })
      expect(res.status, JSON.stringify(entries)).toBe(400)
    }
    const garbage = await call('/roster', { method: 'PUT', token: token!, body: 'not json' })
    expect(garbage.status).toBe(400)
  })

  it('deletes the account and its roster with the password', async () => {
    const { token } = await signUp('gone@example.com')
    await call('/roster', {
      method: 'PUT',
      token: token!,
      json: { entries: [{ agentId: 'anby', mindscape: 1 }] },
    })
    const wrong = await call('/auth/delete-user', {
      method: 'POST',
      token: token!,
      json: { password: 'wrong-password' },
    })
    expect(wrong.status).toBeGreaterThanOrEqual(400)

    const res = await call('/auth/delete-user', {
      method: 'POST',
      token: token!,
      json: { password: 'hollow-raider-42' },
    })
    expect(res.status).toBe(200)
    expect((await call('/roster', { token: token! })).status).toBe(401)
    const rows = await db.$client.execute(
      'select count(*) as n from roster_entry r join user u on u.id = r.user_id where u.email = ?',
      ['gone@example.com'],
    )
    expect(Number(rows.rows[0]!.n)).toBe(0)
    const orphans = await db.$client.execute(
      'select count(*) as n from roster_entry where user_id not in (select id from user)',
    )
    expect(Number(orphans.rows[0]!.n)).toBe(0)
  })

  it('rate-limits repeated sign-in attempts from one client', async () => {
    const headers = {
      origin: WEB,
      'x-forwarded-for': '10.9.9.9',
      'content-type': 'application/json',
    }
    const body = JSON.stringify({ email: 'nobody@example.com', password: 'whatever-123' })
    const statuses: number[] = []
    for (let i = 0; i < 12; i++) {
      const res = await app.request('/api/auth/sign-in/email', { method: 'POST', headers, body })
      statuses.push(res.status)
    }
    expect(statuses).toContain(429)
  })
})
