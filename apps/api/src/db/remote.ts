import { createClient } from '@libsql/client/web'
import { drizzle } from 'drizzle-orm/libsql/web'
import type { Db } from './client'
import { schema } from './schema'

/**
 * Database for serverless hosts: talks to Turso over HTTP (`@libsql/client/web`) and loads no
 * native module, so the production bundle is a single portable file. Local `file:` databases
 * need the Node client (`./client.ts`), which the dev server, migrations and tests use.
 */
export function createRemoteDb(url: string, authToken?: string): Db {
  if (url.startsWith('file:')) {
    throw new Error('The fetch handler needs a remote libSQL URL; use src/server.ts for file: DBs.')
  }
  return drizzle(createClient({ url, authToken }), { schema })
}
