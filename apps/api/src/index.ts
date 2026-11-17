import { createApp } from './app'
import { createAuth } from './auth'
import { createRemoteDb } from './db/remote'
import { readEnv } from './env'

/**
 * Production entry: a Web-standard fetch handler (`export default app`) built from environment
 * variables, talking to Turso over HTTP. Vercel serves it through `src/vercel.ts`; other hosts
 * that run Hono apps (Cloudflare, Deno, Bun…) can serve it as is. A local `file:` database needs
 * the Node server (`src/server.ts`) instead.
 * Run `pnpm --filter @zzz/api db:migrate` against the database before deploying a new schema.
 */
const env = readEnv()
const db = createRemoteDb(env.DATABASE_URL, env.DATABASE_AUTH_TOKEN)
const auth = createAuth(db, env)

export default createApp({ db, auth, origins: env.WEB_ORIGINS })
