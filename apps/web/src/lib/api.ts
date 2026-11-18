import { RosterSchema, SavedProgressSchema, type Roster, type SavedProgress } from '@zzz/core'
import { API_URL, accountsEnabled } from './api-config'

export { API_URL, accountsEnabled }

/**
 * Client for the accounts API (`apps/api`). The site is a static export, so the API lives on
 * another origin and is optional: when `NEXT_PUBLIC_API_URL` isn't set at build time (forks,
 * Lighthouse builds), accounts are simply unavailable and the roster stays on this device.
 *
 * Auth uses a bearer token, not cookies (third-party cookies are blocked by Safari/Firefox):
 * the API returns it in the `set-auth-token` header and every request sends it back.
 */
export interface AccountUser {
  id: string
  name: string
  email: string
}

export type ApiErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_TAKEN'
  | 'WEAK_PASSWORD'
  | 'INVALID_EMAIL'
  | 'INVALID_NAME'
  | 'RATE_LIMITED'
  | 'UNAUTHORIZED'
  | 'NETWORK'
  | 'UNAVAILABLE'
  | 'UNKNOWN'

export class ApiError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    readonly status = 0,
  ) {
    super(code)
  }
}

/** Better Auth error codes → the few cases the UI explains differently. */
function toCode(status: number, code: string | undefined): ApiErrorCode {
  if (status === 429) return 'RATE_LIMITED'
  switch (code) {
    case 'INVALID_EMAIL_OR_PASSWORD':
    case 'INVALID_PASSWORD':
      return 'INVALID_CREDENTIALS'
    case 'USER_ALREADY_EXISTS':
    case 'USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL':
      return 'EMAIL_TAKEN'
    case 'PASSWORD_TOO_SHORT':
    case 'PASSWORD_TOO_LONG':
      return 'WEAK_PASSWORD'
    case 'INVALID_EMAIL':
      return 'INVALID_EMAIL'
    case 'INVALID_NAME':
      return 'INVALID_NAME'
  }
  if (status === 401) return 'UNAUTHORIZED'
  if (status === 422) return 'EMAIL_TAKEN'
  return 'UNKNOWN'
}

interface Options {
  method?: 'GET' | 'POST' | 'PUT'
  token?: string | null
  json?: unknown
  signal?: AbortSignal
}

async function request<T>(path: string, { method = 'GET', token, json, signal }: Options = {}) {
  if (!accountsEnabled) throw new ApiError('UNAVAILABLE')
  const headers: Record<string, string> = {}
  if (token) headers.authorization = `Bearer ${token}`
  if (json !== undefined) headers['content-type'] = 'application/json'
  let res: Response
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method,
      headers,
      body: json === undefined ? undefined : JSON.stringify(json),
      signal,
      credentials: 'omit',
    })
  } catch (error) {
    if ((error as Error).name === 'AbortError') throw error
    throw new ApiError('NETWORK')
  }
  const body = (await res.json().catch(() => null)) as (T & { code?: string }) | null
  if (!res.ok) throw new ApiError(toCode(res.status, body?.code), res.status)
  return { body: body as T, token: res.headers.get('set-auth-token') }
}

interface AuthResult {
  token: string
  user: AccountUser
}

const pickUser = (u: AccountUser): AccountUser => ({ id: u.id, name: u.name, email: u.email })

async function authenticate(path: string, json: unknown): Promise<AuthResult> {
  const { body, token } = await request<{ token?: string; user: AccountUser }>(path, {
    method: 'POST',
    json,
  })
  const sessionToken = token ?? body.token
  if (!sessionToken) throw new ApiError('UNKNOWN')
  return { token: sessionToken, user: pickUser(body.user) }
}

export const api = {
  /** True when the API answers within `timeoutMs` (the account page warns when it doesn't). */
  async health(timeoutMs = 6000): Promise<boolean> {
    if (!accountsEnabled) return false
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(`${API_URL}/api/health`, { signal: controller.signal })
      return res.ok
    } catch {
      return false
    } finally {
      clearTimeout(timer)
    }
  },

  signUp: (input: { name: string; email: string; password: string }) =>
    authenticate('/auth/sign-up/email', input),

  signIn: (input: { email: string; password: string }) =>
    authenticate('/auth/sign-in/email', { ...input, rememberMe: true }),

  async signOut(token: string) {
    await request('/auth/sign-out', { method: 'POST', token, json: {} })
  },

  /** The current user, or null when the token is no longer valid. */
  async session(token: string, signal?: AbortSignal): Promise<AccountUser | null> {
    const { body } = await request<{ user: AccountUser } | null>('/auth/get-session', {
      token,
      signal,
    })
    return body?.user ? pickUser(body.user) : null
  },

  async deleteAccount(token: string, password: string) {
    await request('/auth/delete-user', { method: 'POST', token, json: { password } })
  },

  async getRoster(token: string, signal?: AbortSignal): Promise<Roster> {
    const { body } = await request<{ entries: unknown }>('/roster', { token, signal })
    // Keep only well-formed entries: a bad row must not take the whole roster down.
    const parsed = RosterSchema.safeParse(body.entries)
    return parsed.success ? parsed.data : []
  },

  async putRoster(token: string, entries: Roster, signal?: AbortSignal) {
    await request('/roster', { method: 'PUT', token, json: { entries }, signal })
  },

  /** The account's story progress; null when it has never been saved (or is unreadable). */
  async getProgress(token: string, signal?: AbortSignal): Promise<SavedProgress | null> {
    const { body } = await request<{ progress: unknown }>('/progress', { token, signal })
    const parsed = SavedProgressSchema.safeParse(body.progress)
    return parsed.success ? parsed.data : null
  },

  /** Saves progress; the answer is what the account keeps (a more recent choice wins). */
  async putProgress(token: string, progress: SavedProgress, signal?: AbortSignal) {
    const { body } = await request<{ progress: unknown }>('/progress', {
      method: 'PUT',
      token,
      json: progress,
      signal,
    })
    const parsed = SavedProgressSchema.safeParse(body.progress)
    return parsed.success ? parsed.data : progress
  },
}
