import { sql } from 'drizzle-orm'
import { index, integer, primaryKey, sqliteTable, text } from 'drizzle-orm/sqlite-core'

/**
 * Database schema (SQLite / libSQL — Turso in production, a local file in development).
 * Change it here, then run `pnpm --filter @zzz/api db:generate` to write a migration.
 *
 * The first five tables are Better Auth's (names and fields must match what it expects; keys of
 * the exported `schema` object are its model names). `roster_entry` and `progress` are ours.
 */

const now = sql`(cast(unixepoch('subsecond') * 1000 as integer))`
const createdAt = () => integer('created_at', { mode: 'timestamp_ms' }).notNull().default(now)
const updatedAt = () =>
  integer('updated_at', { mode: 'timestamp_ms' })
    .notNull()
    .default(now)
    .$onUpdate(() => new Date())

export const user = sqliteTable('user', {
  id: text('id').primaryKey(),
  /** The player's display name ("Proxy name" in the UI). */
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).notNull().default(false),
  image: text('image'),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
})

export const session = sqliteTable(
  'session',
  {
    id: text('id').primaryKey(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    token: text('token').notNull().unique(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
  },
  (t) => [index('session_user_id_idx').on(t.userId)],
)

export const account = sqliteTable(
  'account',
  {
    id: text('id').primaryKey(),
    accountId: text('account_id').notNull(),
    providerId: text('provider_id').notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    idToken: text('id_token'),
    accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp_ms' }),
    refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp_ms' }),
    scope: text('scope'),
    /** Password hash (scrypt), only for email + password accounts. */
    password: text('password'),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('account_user_id_idx').on(t.userId)],
)

export const verification = sqliteTable(
  'verification',
  {
    id: text('id').primaryKey(),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: integer('expires_at', { mode: 'timestamp_ms' }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('verification_identifier_idx').on(t.identifier)],
)

/** Better Auth's rate limiter keeps its counters here, so limits hold across server instances. */
export const rateLimit = sqliteTable('rate_limit', {
  id: text('id').primaryKey(),
  key: text('key').notNull().unique(),
  count: integer('count').notNull(),
  lastRequest: integer('last_request').notNull(),
})

/** One row per Agent the player owns. Not owning an agent = no row. */
export const rosterEntry = sqliteTable(
  'roster_entry',
  {
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    /** Agent id from `@zzz/game` (kebab-case). Unknown ids are kept, so a newer web build works. */
    agentId: text('agent_id').notNull(),
    /** Mindscape Cinema level, 0–6. */
    mindscape: integer('mindscape').notNull().default(0),
    updatedAt: updatedAt(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.agentId] })],
)

/** The player's story progress (ADR 0014). One row per player; no row = never synced. */
export const progress = sqliteTable('progress', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  /** Segment id from `@zzz/story`, or null = not started. Unknown ids are kept (newer web build). */
  lastSegmentId: text('last_segment_id'),
  /** When the player set it on their device. The most recent choice wins across devices. */
  setAt: integer('set_at', { mode: 'timestamp_ms' }).notNull(),
  updatedAt: updatedAt(),
})

export const schema = { user, session, account, verification, rateLimit, rosterEntry, progress }
