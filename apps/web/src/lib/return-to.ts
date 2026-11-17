/**
 * What to do after signing in, set by the "Create account" / "Sign in" links on My Agents:
 * where to go back to, and which form to open. sessionStorage: it only matters for this tab and
 * this visit, and (unlike the #create hash) it doesn't depend on when the router writes the URL.
 */
export const RETURN_TO_KEY = 'zzz-return-to'
export const AUTH_MODE_KEY = 'zzz-auth-mode'

const ALLOWED = new Set(['/agents'])

function take(key: string): string | null {
  try {
    const value = sessionStorage.getItem(key)
    sessionStorage.removeItem(key)
    return value
  } catch {
    return null
  }
}

/** Remember the intent before following a link to /account. */
export function rememberAuthIntent(mode: 'create' | 'sign-in', returnTo = '/agents') {
  try {
    sessionStorage.setItem(AUTH_MODE_KEY, mode)
    sessionStorage.setItem(RETURN_TO_KEY, returnTo)
  } catch {
    // Storage blocked: the account page opens on Sign in and stays put after signing in.
  }
}

/** Reads and clears the destination. Only known in-app paths are honoured. */
export function takeReturnTo(): string | null {
  const value = take(RETURN_TO_KEY)
  return value && ALLOWED.has(value) ? value : null
}

/** Reads and clears which form to open. */
export function takeAuthMode(): 'create' | 'sign-in' | null {
  const value = take(AUTH_MODE_KEY)
  return value === 'create' || value === 'sign-in' ? value : null
}
