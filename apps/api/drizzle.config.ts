import { defineConfig } from 'drizzle-kit'

/** `pnpm --filter @zzz/api db:generate` writes a SQL migration to ./drizzle from src/db/schema.ts. */
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  out: './drizzle',
})
