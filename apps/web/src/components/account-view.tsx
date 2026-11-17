'use client'

import { useEffect, useId, useState, type FormEvent } from 'react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { ArrowRight, CloudOff, LogOut, RefreshCw, ServerOff, TriangleAlert } from 'lucide-react'
import {
  Button,
  crtOn,
  describedBy,
  Field,
  Panel,
  PasswordInput,
  Sheet,
  SheetContent,
} from '@zzz/ui'
import { agents } from '@zzz/game'
import { Link, useRouter } from '@/i18n/navigation'
import { api, ApiError, type AccountUser } from '@/lib/api'
import { useAccount } from '@/lib/account-store'
import { useRoster } from '@/lib/roster-store'
import { takeAuthMode, takeReturnTo } from '@/lib/return-to'
import { AuthForm, type AuthMode } from './auth-form'
import { PageHeading } from './page-heading'
import { MergeNotice, Notice } from './roster-sections'
import { SyncChip, useSyncDisplay } from './sync-chip'

/**
 * Account page (docs/features/agents-and-accounts.md). Optional by design: every state leaves
 * the reader a way forward, and the roster keeps working on the device whatever happens here.
 */
export function AccountView() {
  const t = useTranslations('account')
  const enabled = useAccount((s) => s.enabled)
  const accountReady = useAccount((s) => s.hydrated)
  const rosterReady = useRoster((s) => s.hydrated)
  const token = useAccount((s) => s.token)
  const user = useAccount((s) => s.user)

  return (
    <>
      <PageHeading kicker={t('kicker')} title={t('title')} lede={t('lede')} />
      {!enabled ? (
        <AccountsOff />
      ) : !accountReady || !rosterReady ? (
        <div className="min-h-[28rem] bg-surface chamfer" aria-busy data-testid="account-loading">
          <p className="sr-only">{t('checking')}</p>
        </div>
      ) : token && user ? (
        <SignedIn user={user} token={token} />
      ) : (
        <SignedOut />
      )}
    </>
  )
}

/** This build has no account server (NEXT_PUBLIC_API_URL unset). */
export function AccountsOff() {
  const t = useTranslations('account')
  return (
    <Panel innerClassName="overflow-hidden" data-testid="accounts-off">
      <div className="h-1.5 hazard" aria-hidden />
      <section className="p-6 sm:p-8">
        <ServerOff className="size-8 text-subtle" aria-hidden />
        <h2 className="mt-3 text-3xl display">{t('offTitle')}</h2>
        <p className="mt-2 max-w-[55ch] text-muted">{t('offBody')}</p>
        <Button asChild className="mt-6">
          <Link href="/agents">
            {t('offCta')}
            <ArrowRight aria-hidden />
          </Link>
        </Button>
      </section>
    </Panel>
  )
}

function Why() {
  const t = useTranslations('account')
  const bullet = <span aria-hidden className="mt-1.5 size-2 shrink-0 rotate-45 bg-primary" />
  return (
    <aside className="text-sm space-y-6 text-muted">
      <section>
        <h2 className="mb-3 font-mono text-[0.7rem] tracking-[0.2em] text-subtle uppercase">
          {t('whyTitle')}
        </h2>
        <ul className="space-y-2">
          {(['why1', 'why2', 'why3'] as const).map((key) => (
            <li key={key} className="gap-3 flex items-start text-foreground">
              {bullet}
              {t(key)}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="mb-2 font-mono text-[0.7rem] tracking-[0.2em] text-subtle uppercase">
          {t('storeTitle')}
        </h2>
        <p>{t('storeBody')}</p>
      </section>
    </aside>
  )
}

function SignedOut() {
  const t = useTranslations('account')
  const router = useRouter()
  const notice = useAccount((s) => s.notice)
  const setNotice = useAccount((s) => s.setNotice)
  const setSession = useAccount((s) => s.setSession)
  // Client-only (rendered after hydration), so reading the hash here can't mismatch the HTML.
  const [mode, setModeState] = useState<AuthMode>(
    () => takeAuthMode() ?? (window.location.hash === '#create' ? 'create' : 'sign-in'),
  )
  const [reachable, setReachable] = useState(true)

  // A link to /account#create while already here only changes the hash.
  useEffect(() => {
    const onHash = () => setModeState(window.location.hash === '#create' ? 'create' : 'sign-in')
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])
  const setMode = (next: AuthMode) => {
    setModeState(next)
    const url = `${window.location.pathname}${window.location.search}${next === 'create' ? '#create' : ''}`
    window.history.replaceState(window.history.state, '', url)
  }

  const ping = () => {
    void api.health().then(setReachable)
  }
  useEffect(ping, [])

  const onSuccess = (session: { token: string; user: AccountUser }, done: AuthMode) => {
    const roster = useRoster.getState()
    const guestCount = roster.owner === null ? Object.keys(roster.owned).length : 0
    setSession(session.token, session.user, {
      kind: done === 'create' ? 'welcome' : 'merged',
      count: guestCount,
    })
    const back = takeReturnTo()
    if (back) router.push(back)
    else window.history.replaceState(window.history.state, '', window.location.pathname)
  }

  const messages = {
    signedOut: t('signedOut'),
    deleted: t('deleted'),
    sessionEnded: t('sessionEnded'),
  }
  const shown =
    notice &&
    (notice.kind === 'signedOut' || notice.kind === 'deleted' || notice.kind === 'sessionEnded')
      ? notice
      : null

  return (
    <div className="mt-2 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 lg:items-start grid">
      <div>
        {shown && (
          <Notice
            tone={shown.kind === 'sessionEnded' ? 'warning' : 'success'}
            onDismiss={() => setNotice(null)}
          >
            {messages[shown.kind]}
          </Notice>
        )}
        {!reachable && (
          <div
            role="status"
            className="mb-4 gap-3 p-3 flex flex-wrap items-center bg-warning/10 shadow-[inset_3px_0_0_var(--color-warning)]"
            data-testid="api-down"
          >
            <CloudOff className="size-5 shrink-0 text-warning" aria-hidden />
            <p className="text-sm min-w-0 flex-1">{t('downBody')}</p>
            <Button variant="outline" size="sm" onClick={ping}>
              <RefreshCw aria-hidden />
              {t('retry')}
            </Button>
          </div>
        )}
        <Panel innerClassName="overflow-hidden">
          <div className="h-1.5 hazard" aria-hidden />
          <div className="p-5 sm:p-8">
            <AuthForm mode={mode} onModeChange={setMode} onSuccess={onSuccess} />
          </div>
        </Panel>
      </div>
      <Why />
    </div>
  )
}

function SignedIn({ user, token }: { user: AccountUser; token: string }) {
  const t = useTranslations('account')
  const notice = useAccount((s) => s.notice)
  const setNotice = useAccount((s) => s.setNotice)
  const owned = useRoster((s) => Object.keys(s.owned).length)
  const retry = useRoster((s) => s.retry)
  const lastSavedAt = useRoster((s) => s.lastSavedAt)
  const display = useSyncDisplay()
  // Animate the ID card only when the reader just signed in here (a client-side change).
  const [justSignedIn] = useState(notice?.kind === 'merged' || notice?.kind === 'welcome')
  const mergeCount = notice?.kind === 'merged' || notice?.kind === 'welcome' ? notice.count : null

  return (
    <div className="mt-2 gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 lg:items-start grid">
      <div>
        {notice?.kind === 'welcome' && (
          <p className="mb-3 text-2xl display text-primary" role="status">
            {t('welcome', { name: user.name })}
          </p>
        )}
        {mergeCount !== null && (
          <MergeNotice count={mergeCount} onDismiss={() => setNotice(null)} />
        )}
        <motion.div
          variants={crtOn}
          initial={justSignedIn ? 'hidden' : false}
          animate="show"
          data-testid="account-card"
        >
          <Panel frame="var(--color-primary)">
            <section className="p-5 sm:p-6">
              <div className="gap-4 flex items-center">
                <span
                  aria-hidden
                  className="size-16 text-4xl grid shrink-0 place-items-center bg-primary display text-primary-foreground chamfer-sm"
                >
                  {user.name.trim().charAt(0).toUpperCase() || '?'}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-4xl display break-words">{user.name}</h2>
                  <p className="mt-1 text-xs font-mono break-all text-muted">{user.email}</p>
                </div>
                <span className="sm:block hidden self-start font-mono text-[0.6rem] tracking-[0.2em] text-subtle uppercase">
                  {t('kicker')}
                </span>
              </div>
              <dl className="mt-5 pt-5 gap-4 grid border-t border-border">
                <div className="gap-3 flex flex-wrap items-center justify-between">
                  <dt className="font-mono text-[0.7rem] tracking-[0.2em] text-subtle uppercase">
                    {t('agentsSaved')}
                  </dt>
                  <dd className="gap-3 flex items-center">
                    <span className="text-2xl display text-primary">
                      {owned}
                      <span className="text-sm font-mono text-muted not-italic">
                        /{agents.length}
                      </span>
                    </span>
                    <Button asChild variant="outline" size="sm">
                      <Link href="/agents">
                        {t('openRoster')}
                        <ArrowRight aria-hidden />
                      </Link>
                    </Button>
                  </dd>
                </div>
                <div className="gap-3 flex flex-wrap items-center justify-between">
                  <dt className="font-mono text-[0.7rem] tracking-[0.2em] text-subtle uppercase">
                    {t('syncLabel')}
                  </dt>
                  <dd>
                    <SyncChip
                      display={display}
                      accountsEnabled
                      lastSavedAt={lastSavedAt}
                      onRetry={retry}
                    />
                  </dd>
                </div>
              </dl>
            </section>
          </Panel>
        </motion.div>
      </div>
      <div className="space-y-6">
        <SignOutPanel token={token} />
        <DangerPanel email={user.email} token={token} />
      </div>
    </div>
  )
}

/** Sign out. Asks first when edits haven't reached the account yet. */
export function SignOutPanel({ token }: { token: string }) {
  const t = useTranslations('account')
  const tc = useTranslations('common')
  const dirty = useRoster((s) => s.dirty)
  const retry = useRoster((s) => s.retry)
  const [confirming, setConfirming] = useState(false)

  const signOut = async () => {
    setConfirming(false)
    // Best effort: the session is dropped on this device either way.
    await api.signOut(token).catch(() => undefined)
    useRoster.getState().reset()
    useAccount.getState().clear({ kind: 'signedOut' })
  }

  return (
    <Panel>
      <section className="p-5 sm:p-6">
        <h2 className="text-2xl display">{t('signOut')}</h2>
        <p className="mt-1 text-sm text-muted">{t('signOutBody')}</p>
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => (dirty ? setConfirming(true) : void signOut())}
        >
          <LogOut aria-hidden />
          {t('signOut')}
        </Button>
      </section>
      <Sheet open={confirming} onOpenChange={setConfirming}>
        <SheetContent
          heading={t('unsyncedTitle')}
          description={t('unsyncedBody')}
          closeLabel={tc('close')}
        >
          <div className="mt-2 gap-2 sm:flex-row flex flex-col">
            <Button
              onClick={() => {
                retry()
                setConfirming(false)
              }}
            >
              <RefreshCw aria-hidden />
              {t('unsyncedRetry')}
            </Button>
            <Button variant="outline" onClick={() => void signOut()}>
              {t('unsyncedConfirm')}
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </Panel>
  )
}

/** Delete account: needs the password, in a confirmation sheet. */
export function DangerPanel({ email, token }: { email: string; token: string }) {
  const t = useTranslations('account')
  return (
    <Panel frame="var(--color-danger)" innerClassName="overflow-hidden">
      <div className="h-1.5 hazard [--hazard-color:var(--color-danger)]" aria-hidden />
      <section className="p-5 sm:p-6">
        <h2 className="text-2xl display">{t('dangerTitle')}</h2>
        <p className="mt-1 text-sm text-muted">{t('dangerBody')}</p>
        <DeleteAccountSheet email={email} token={token} />
      </section>
    </Panel>
  )
}

export function DeleteAccountSheet({
  email,
  token,
  defaultOpen = false,
}: {
  email: string
  token: string
  defaultOpen?: boolean
}) {
  const t = useTranslations('account')
  const te = useTranslations('account.errors')
  const tc = useTranslations('common')
  const id = useId()
  const [open, setOpen] = useState(defaultOpen)
  const [password, setPassword] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [alert, setAlert] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (pending) return
    setAlert(null)
    if (!password) {
      setFieldError(te('passwordRequired'))
      return
    }
    setFieldError(null)
    setPending(true)
    try {
      await api.deleteAccount(token, password)
      useRoster.getState().reset()
      useAccount.getState().clear({ kind: 'deleted' })
    } catch (error) {
      const code = error instanceof ApiError ? error.code : 'UNKNOWN'
      if (code === 'INVALID_CREDENTIALS') setFieldError(t('deleteWrongPassword'))
      else if (code === 'UNAUTHORIZED') useAccount.getState().expire()
      else if (code === 'RATE_LIMITED') setAlert(te('rateLimited'))
      else if (code === 'NETWORK' || code === 'UNAVAILABLE') setAlert(te('network'))
      else setAlert(te('unknown'))
    } finally {
      setPending(false)
    }
  }

  const errorId = fieldError ? `${id}-error` : undefined
  return (
    <>
      <Button
        variant="outline"
        className="mt-4 text-danger hover:text-danger hover:shadow-[inset_0_0_0_1.5px_var(--color-danger)]"
        onClick={() => setOpen(true)}
      >
        {t('deleteOpen')}
      </Button>
      <Sheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next)
          if (!next) {
            setPassword('')
            setFieldError(null)
            setAlert(null)
          }
        }}
      >
        <SheetContent
          heading={t('deleteTitle')}
          description={t('deleteBody', { email })}
          closeLabel={tc('close')}
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            document.getElementById(`${id}-password`)?.focus()
          }}
        >
          <form method="post" noValidate onSubmit={submit} className="mt-2 space-y-5">
            {alert && (
              <div
                role="alert"
                className="gap-3 p-3 text-sm flex bg-danger/10 shadow-[inset_3px_0_0_var(--color-danger)]"
              >
                <TriangleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                <p>{alert}</p>
              </div>
            )}
            <Field
              label={t('deletePassword')}
              htmlFor={`${id}-password`}
              error={fieldError}
              errorId={errorId}
            >
              <PasswordInput
                id={`${id}-password`}
                name="password"
                showLabel={t('showPassword')}
                autoComplete="current-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setFieldError(null)
                }}
                invalid={!!fieldError}
                aria-invalid={fieldError ? true : undefined}
                aria-describedby={describedBy(errorId)}
              />
            </Field>
            <div className="mt-6 gap-2 sm:flex-row flex flex-col-reverse">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                {t('deleteCancel')}
              </Button>
              <Button type="submit" variant="danger" aria-disabled={pending || undefined}>
                {pending ? t('deletePending') : t('deleteConfirm')}
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </>
  )
}
