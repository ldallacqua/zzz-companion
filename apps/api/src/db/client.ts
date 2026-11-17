import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { fileURLToPath } from 'node:url'
import { schema } from './schema'

export type Db = ReturnType<typeof createDb>

/**
 * `url`: `libsql://<db>-<org>.turso.io` (Turso, needs `authToken`) or `file:./.data/dev.db`
 * (a local SQLite file — no account needed for development and tests).
 */
export function createDb(url: string, authToken?: string) {
  const client = createClient({ url, authToken })
  return drizzle(client, { schema })
}

export const MIGRATIONS_FOLDER = fileURLToPath(new URL('../../drizzle', import.meta.url))

export async function migrateDb(db: Db) {
  await migrate(db, { migrationsFolder: MIGRATIONS_FOLDER })
}
