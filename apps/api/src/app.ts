import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'
import { eq, max } from 'drizzle-orm'
import { RosterSchema, ROSTER_MAX_ENTRIES } from '@zzz/core'
import { z } from 'zod'
import type { Auth } from './auth'
import type { Db } from './db/client'
import { rosterEntry } from './db/schema'

type Session = NonNullable<Awaited<ReturnType<Auth['api']['getSession']>>>
type Vars = { Variables: { user: Session['user'] } }

const RosterBody = z.object({ entries: RosterSchema })

/**
 * The HTTP API. Runtime-agnostic (Web `Request`/`Response`): `server.ts` serves it with Node for
 * development; any host that runs a fetch handler can serve it in production.
 *
 *   /api/auth/*   Better Auth (sign-up, sign-in, sign-out, get-session, delete-user…)
 *   /api/roster   GET / PUT the signed-in player's roster
 *   /api/health   liveness check
 */
export function createApp({ db, auth, origins }: { db: Db; auth: Auth; origins: string[] }) {
  const app = new Hono<Vars>().basePath('/api')

  app.use('*', secureHeaders())
  app.use(
    '*',
    cors({
      origin: origins,
      allowHeaders: ['Authorization', 'Content-Type'],
      allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
      exposeHeaders: ['set-auth-token'],
      maxAge: 600,
    }),
  )

  app.get('/health', (c) => c.json({ ok: true }))

  app.on(['GET', 'POST'], '/auth/*', (c) => auth.handler(c.req.raw))

  const roster = new Hono<Vars>()
  roster.use('*', async (c, next) => {
    const session = await auth.api.getSession({ headers: c.req.raw.headers })
    if (!session) return c.json({ error: 'UNAUTHORIZED' }, 401)
    c.set('user', session.user)
    await next()
  })

  roster.get('/', async (c) => {
    const userId = c.get('user').id
    const rows = await db
      .select({ agentId: rosterEntry.agentId, mindscape: rosterEntry.mindscape })
      .from(rosterEntry)
      .where(eq(rosterEntry.userId, userId))
      .orderBy(rosterEntry.agentId)
    const [meta] = await db
      .select({ updatedAt: max(rosterEntry.updatedAt) })
      .from(rosterEntry)
      .where(eq(rosterEntry.userId, userId))
    return c.json({ entries: rows, updatedAt: meta?.updatedAt ?? null })
  })

  /** Replaces the whole roster (it is small: ~60 agents), atomically. */
  roster.put('/', async (c) => {
    const userId = c.get('user').id
    const body = await c.req.json().catch(() => null)
    const parsed = RosterBody.safeParse(body)
    if (!parsed.success) {
      return c.json({ error: 'INVALID_ROSTER', max: ROSTER_MAX_ENTRIES }, 400)
    }
    const entries = parsed.data.entries
    const now = new Date()
    await db.batch([
      db.delete(rosterEntry).where(eq(rosterEntry.userId, userId)),
      ...(entries.length
        ? [db.insert(rosterEntry).values(entries.map((e) => ({ ...e, userId, updatedAt: now })))]
        : []),
    ])
    return c.json({
      entries: [...entries].sort((a, b) => a.agentId.localeCompare(b.agentId)),
      updatedAt: now,
    })
  })

  app.route('/roster', roster)

  app.notFound((c) => c.json({ error: 'NOT_FOUND' }, 404))
  app.onError((err, c) => {
    console.error(err)
    return c.json({ error: 'INTERNAL' }, 500)
  })

  return app
}
