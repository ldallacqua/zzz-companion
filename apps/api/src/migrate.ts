import { mkdirSync } from 'node:fs'
import { createDb, migrateDb } from './db/client'
import { readEnv } from './env'

/** Applies pending migrations (`drizzle/`) to DATABASE_URL — run before deploying the API. */
const env = readEnv()
if (env.DATABASE_URL.startsWith('file:./.data/')) mkdirSync('.data', { recursive: true })
await migrateDb(createDb(env.DATABASE_URL, env.DATABASE_AUTH_TOKEN))
console.log(`Migrations applied to ${env.DATABASE_URL.replace(/\?.*$/, '')}`)
