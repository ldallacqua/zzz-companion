import { mkdirSync } from 'node:fs'
import { serve } from '@hono/node-server'
import { createApp } from './app'
import { createAuth } from './auth'
import { createDb, migrateDb } from './db/client'
import { readEnv } from './env'

/**
 * Node server for development and E2E tests. Applies pending migrations on start, so a fresh
 * checkout only needs `pnpm dev:api`.
 */
const env = readEnv()
if (env.DATABASE_URL.startsWith('file:./.data/')) mkdirSync('.data', { recursive: true })

const db = createDb(env.DATABASE_URL, env.DATABASE_AUTH_TOKEN)
await migrateDb(db)
const app = createApp({ db, auth: createAuth(db, env), origins: env.WEB_ORIGINS })

serve({ fetch: app.fetch, port: env.PORT }, ({ port }) => {
  console.log(`ZZZ Companion API on http://localhost:${port}/api (db: ${env.DATABASE_URL})`)
})
