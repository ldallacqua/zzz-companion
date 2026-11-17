import { z } from 'zod'

/**
 * Configuration from environment variables (see `.env.example`). Development works with no
 * variables at all: a local SQLite file and a fixed, clearly-marked dev secret.
 */
const DEV_SECRET = 'dev-only-secret-change-me-in-production-0123456789'

const EnvSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().int().positive().default(8787),
  /** `libsql://…` for Turso, or `file:…` for a local SQLite file. */
  DATABASE_URL: z.string().min(1).default('file:./.data/dev.db'),
  /** Turso database token (not needed for `file:` URLs). */
  DATABASE_AUTH_TOKEN: z.string().optional(),
  /** Signs sessions. 32+ random characters; generate with `openssl rand -base64 32`. */
  BETTER_AUTH_SECRET: z.string().min(32).default(DEV_SECRET),
  /** Public URL of this API, e.g. `https://zzz-companion-api.vercel.app`. */
  BETTER_AUTH_URL: z.url().default('http://localhost:8787'),
  /** `off` only for E2E runs, where every test signs up from the same address. */
  AUTH_RATE_LIMIT: z.enum(['on', 'off']).default('on'),
  /** Comma-separated origins of the web app allowed to call the API. */
  WEB_ORIGINS: z
    .string()
    .default('http://localhost:3000,http://localhost:3100')
    .transform((v) =>
      v
        .split(',')
        .map((o) => o.trim().replace(/\/$/, ''))
        .filter(Boolean),
    ),
})
export type Env = z.infer<typeof EnvSchema>

export function readEnv(source: Record<string, string | undefined> = process.env): Env {
  const env = EnvSchema.parse(source)
  if (env.NODE_ENV === 'production' && env.BETTER_AUTH_SECRET === DEV_SECRET) {
    throw new Error('Set BETTER_AUTH_SECRET in production (32+ random characters).')
  }
  return env
}
