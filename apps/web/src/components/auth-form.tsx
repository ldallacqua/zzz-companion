'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { ArrowRight, Circle, CircleCheck, LoaderCircle, TriangleAlert } from 'lucide-react'
import { Button, describedBy, ease, Field, Input, PasswordInput, Segmented } from '@zzz/ui'
import { api, ApiError, type AccountUser, type ApiErrorCode } from '@/lib/api'

export type AuthMode = 'sign-in' | 'create'

const NAME_MAX = 32
const PASSWORD_MIN = 8
const PASSWORD_MAX = 128
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

type FieldName = 'name' | 'email' | 'password'
type ErrorKey =
  | 'nameRequired'
  | 'nameLength'
  | 'emailRequired'
  | 'emailInvalid'
  | 'emailTaken'
  | 'passwordRequired'
  | 'passwordShort'
  | 'passwordLong'
type AlertKey = 'wrongCredentials' | 'rateLimited' | 'network' | 'unknown'

interface Values {
  name: string
  email: string
  password: string
}

function validate(mode: AuthMode, v: Values): Partial<Record<FieldName, ErrorKey>> {
  const errors: Partial<Record<FieldName, ErrorKey>> = {}
  if (mode === 'create') {
    const name = v.name.trim()
    if (!name) errors.name = 'nameRequired'
    else if (name.length > NAME_MAX) errors.name = 'nameLength'
  }
  if (!v.email.trim()) errors.email = 'emailRequired'
  else if (!EMAIL.test(v.email.trim())) errors.email = 'emailInvalid'
  if (!v.password) errors.password = 'passwordRequired'
  else if (mode === 'create' && v.password.length < PASSWORD_MIN) errors.password = 'passwordShort'
  else if (v.password.length > PASSWORD_MAX) errors.password = 'passwordLong'
  return errors
}

/** Where each server error is shown (ux spec §5.4). */
function placeServerError(code: ApiErrorCode): { field?: [FieldName, ErrorKey]; alert?: AlertKey } {
  switch (code) {
    case 'INVALID_CREDENTIALS':
    case 'UNAUTHORIZED':
      return { alert: 'wrongCredentials' }
    case 'EMAIL_TAKEN':
      return { field: ['email', 'emailTaken'] }
    case 'WEAK_PASSWORD':
      return { field: ['password', 'passwordShort'] }
    case 'INVALID_EMAIL':
      return { field: ['email', 'emailInvalid'] }
    case 'INVALID_NAME':
      return { field: ['name', 'nameLength'] }
    case 'RATE_LIMITED':
      return { alert: 'rateLimited' }
    case 'NETWORK':
    case 'UNAVAILABLE':
      return { alert: 'network' }
    default:
      return { alert: 'unknown' }
  }
}

/**
 * Sign in / create account. Never submits natively (method="post" + preventDefault), so even
 * without JavaScript credentials can't end up in a URL. Validates on submit, then live.
 */
export function AuthForm({
  mode,
  onModeChange,
  onSuccess,
}: {
  mode: AuthMode
  onModeChange: (mode: AuthMode) => void
  onSuccess: (session: { token: string; user: AccountUser }, mode: AuthMode) => void
}) {
  const t = useTranslations('account')
  const te = useTranslations('account.errors')
  const id = useId()
  const ids = {
    name: `${id}-name`,
    email: `${id}-email`,
    password: `${id}-password`,
  }
  const [values, setValues] = useState<Values>({ name: '', email: '', password: '' })
  const [submitted, setSubmitted] = useState(false)
  const [serverErrors, setServerErrors] = useState<Partial<Record<FieldName, ErrorKey>>>({})
  const [alert, setAlert] = useState<AlertKey | null>(null)
  const [pending, setPending] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)
  const passwordRef = useRef<HTMLInputElement>(null)
  const focusField = (field: FieldName) =>
    ({ name: nameRef, email: emailRef, password: passwordRef })[field].current?.focus()

  const clientErrors = submitted ? validate(mode, values) : {}
  const errors = { ...clientErrors, ...serverErrors }
  const set = (field: FieldName, value: string) => {
    setValues((v) => ({ ...v, [field]: value }))
    setServerErrors((e) => ({ ...e, [field]: undefined }))
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (pending) return
    setSubmitted(true)
    setAlert(null)
    setServerErrors({})
    const found = validate(mode, values)
    const first = (['name', 'email', 'password'] as const).find((f) => found[f])
    if (first) {
      focusField(first)
      return
    }
    setPending(true)
    try {
      const email = values.email.trim()
      const session =
        mode === 'create'
          ? await api.signUp({ name: values.name.trim(), email, password: values.password })
          : await api.signIn({ email, password: values.password })
      onSuccess(session, mode)
    } catch (error) {
      const placed = placeServerError(error instanceof ApiError ? error.code : 'UNKNOWN')
      if (placed.field) {
        const [field, key] = placed.field
        setServerErrors({ [field]: key })
        focusField(field)
      }
      if (placed.alert) setAlert(placed.alert)
    } finally {
      setPending(false)
    }
  }

  const errorId = (f: FieldName) => (errors[f] ? `${ids[f]}-error` : undefined)
  const passwordOk = values.password.length >= PASSWORD_MIN

  return (
    <form
      method="post"
      noValidate
      onSubmit={submit}
      aria-busy={pending || undefined}
      className="space-y-5"
      data-testid="auth-form"
    >
      <Segmented<AuthMode>
        label={t('mode')}
        layoutId="auth-mode"
        className="grid grid-cols-2"
        value={mode}
        onValueChange={(next) => {
          setSubmitted(false)
          setServerErrors({})
          setAlert(null)
          onModeChange(next)
        }}
        options={[
          { value: 'sign-in', label: t('signIn') },
          { value: 'create', label: t('create') },
        ]}
      />

      {alert && (
        <div
          role="alert"
          className="gap-3 p-3 text-sm flex bg-danger/10 shadow-[inset_3px_0_0_var(--color-danger)]"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
          <p className="text-foreground">{te(alert)}</p>
        </div>
      )}

      <AnimatePresence initial={false}>
        {mode === 'create' && (
          <motion.div
            key="name"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: ease.outExpo }}
            className="overflow-hidden"
          >
            <Field
              label={t('name')}
              htmlFor={ids.name}
              hint={t('nameHint')}
              hintId={`${ids.name}-hint`}
              error={errors.name && te(errors.name)}
              errorId={errorId('name')}
            >
              <Input
                ref={nameRef}
                id={ids.name}
                name="name"
                type="text"
                autoComplete="nickname"
                maxLength={NAME_MAX}
                spellCheck={false}
                required
                value={values.name}
                onChange={(e) => set('name', e.target.value)}
                invalid={!!errors.name}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={describedBy(errorId('name'), `${ids.name}-hint`)}
              />
            </Field>
          </motion.div>
        )}
      </AnimatePresence>

      <Field
        label={t('email')}
        htmlFor={ids.email}
        error={
          errors.email && (
            <>
              {te(errors.email)}
              {errors.email === 'emailTaken' && (
                <>
                  {' '}
                  <button
                    type="button"
                    className="min-h-10 font-semibold inline-flex cursor-pointer items-center text-foreground underline underline-offset-4"
                    onClick={() => {
                      setServerErrors({})
                      onModeChange('sign-in')
                      // The values are kept: the password is the next step.
                      requestAnimationFrame(() => passwordRef.current?.focus())
                    }}
                  >
                    {te('signInInstead')}
                  </button>
                </>
              )}
            </>
          )
        }
        errorId={errorId('email')}
      >
        <Input
          ref={emailRef}
          id={ids.email}
          name="email"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          spellCheck={false}
          autoComplete={mode === 'sign-in' ? 'username' : 'email'}
          required
          value={values.email}
          onChange={(e) => set('email', e.target.value)}
          invalid={!!errors.email}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy(errorId('email'))}
        />
      </Field>

      <Field
        label={t('password')}
        htmlFor={ids.password}
        error={errors.password && te(errors.password)}
        errorId={errorId('password')}
        hintId={mode === 'create' ? `${ids.password}-rule` : undefined}
        hint={
          mode === 'create' ? (
            <span className="gap-1.5 flex items-center">
              {passwordOk ? (
                <CircleCheck className="size-4 text-primary" aria-hidden />
              ) : (
                <Circle className="size-4" aria-hidden />
              )}
              {t('passwordRule')}
              {passwordOk && <span className="sr-only">{t('ruleMet')}</span>}
            </span>
          ) : undefined
        }
      >
        <PasswordInput
          ref={passwordRef}
          id={ids.password}
          name="password"
          showLabel={t('showPassword')}
          autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
          minLength={mode === 'create' ? PASSWORD_MIN : undefined}
          maxLength={PASSWORD_MAX}
          required
          value={values.password}
          onChange={(e) => set('password', e.target.value)}
          invalid={!!errors.password}
          aria-invalid={errors.password ? true : undefined}
          aria-describedby={describedBy(
            errorId('password'),
            mode === 'create' && `${ids.password}-rule`,
          )}
        />
      </Field>

      <Button type="submit" size="lg" className="w-full" aria-disabled={pending || undefined}>
        {pending
          ? mode === 'create'
            ? t('pendingCreate')
            : t('pendingSignIn')
          : mode === 'create'
            ? t('create')
            : t('signIn')}
        {pending ? (
          <LoaderCircle className="motion-ambient animate-spin" aria-hidden />
        ) : (
          <ArrowRight aria-hidden />
        )}
      </Button>

      <p className="gap-2 text-xs flex text-muted">
        <TriangleAlert className="size-4 shrink-0 text-warning" aria-hidden />
        {mode === 'create' ? t('noResetCreate') : t('noResetSignIn')}
      </p>
    </form>
  )
}
