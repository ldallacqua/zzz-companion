import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { APIError, createAuthMiddleware } from 'better-auth/api'
import { bearer } from 'better-auth/plugins'
import { eq } from 'drizzle-orm'
import type { Db } from './db/client'
import { rosterEntry, schema } from './db/schema'
import type { Env } from './env'

export const PASSWORD_MIN = 8
export const PASSWORD_MAX = 128
export const NAME_MAX = 32
const DAY = 60 * 60 * 24

/**
 * Email + password accounts (Better Auth). The web app is a static site on another origin, so it
 * authenticates with a bearer token (`Authorization: Bearer …`, issued in the `set-auth-token`
 * response header) instead of third-party cookies, which Safari and Firefox block.
 *
 * No email verification or password reset yet: there is no mail service (see ADR 0011).
 */
export function createAuth(db: Db, env: Env) {
  return betterAuth({
    appName: 'ZZZ Companion',
    baseURL: env.BETTER_AUTH_URL,
    basePath: '/api/auth',
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: env.WEB_ORIGINS,
    database: drizzleAdapter(db, { provider: 'sqlite', schema }),
    emailAndPassword: {
      enabled: true,
      autoSignIn: true,
      minPasswordLength: PASSWORD_MIN,
      maxPasswordLength: PASSWORD_MAX,
    },
    session: { expiresIn: 30 * DAY, updateAge: DAY },
    user: {
      deleteUser: {
        enabled: true,
        // Foreign keys cascade too, but SQLite only enforces them when the connection asks to.
        beforeDelete: async (user) => {
          await db.delete(rosterEntry).where(eq(rosterEntry.userId, user.id))
        },
      },
    },
    rateLimit: {
      enabled: env.AUTH_RATE_LIMIT === 'on',
      storage: 'database',
      window: 60,
      max: 100,
      customRules: {
        '/sign-in/email': { window: 60, max: 10 },
        '/sign-up/email': { window: 60, max: 5 },
        '/delete-user': { window: 60, max: 5 },
      },
    },
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path !== '/sign-up/email') return
        const name = typeof ctx.body?.name === 'string' ? ctx.body.name.trim() : ''
        if (name.length < 1 || name.length > NAME_MAX) {
          throw new APIError('BAD_REQUEST', {
            code: 'INVALID_NAME',
            message: `Name must be 1–${NAME_MAX} characters`,
          })
        }
        return { context: { ...ctx, body: { ...ctx.body, name } } }
      }),
    },
    plugins: [bearer()],
    telemetry: { enabled: false },
  })
}

export type Auth = ReturnType<typeof createAuth>
