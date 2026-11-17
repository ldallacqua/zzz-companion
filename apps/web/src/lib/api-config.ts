/**
 * Accounts API location, set at build time (ADR 0011). Kept apart from the client (`api.ts`) so
 * that what every page loads (header, settings, stores) doesn't pull the client in.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? '').replace(/\/$/, '')
export const accountsEnabled = API_URL !== ''
