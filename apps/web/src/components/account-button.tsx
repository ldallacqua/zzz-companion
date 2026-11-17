'use client'

import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { UserRound } from 'lucide-react'
import { cn, stampIn } from '@zzz/ui'
import { Link, usePathname } from '@/i18n/navigation'
import { useAccount } from '@/lib/account-store'
import { useRoster } from '@/lib/roster-store'

/**
 * Header entry to the account page: "Sign in" when signed out, the Proxy name's initial when
 * signed in (with a red dot when sync is failing). Hidden when this build has no accounts.
 */
export function AccountButton() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  const enabled = useAccount((s) => s.enabled)
  const hydrated = useAccount((s) => s.hydrated)
  const user = useAccount((s) => s.user)
  const token = useAccount((s) => s.token)
  const justSignedIn = useAccount(
    (s) => s.notice?.kind === 'merged' || s.notice?.kind === 'welcome',
  )
  const syncError = useRoster((s) => s.sync === 'error')
  const current = pathname.replace(/\/$/, '') === '/account' ? 'page' : undefined

  if (!enabled) return null
  if (!hydrated) {
    return (
      <span
        aria-hidden
        className="size-10 grid shrink-0 place-items-center bg-surface-2 text-subtle chamfer-sm"
      >
        <UserRound className="size-5" />
      </span>
    )
  }
  if (!user || !token) {
    return (
      <Link
        href="/account"
        aria-current={current}
        data-testid="account-button"
        className="h-10 min-w-10 gap-2 px-2.5 inline-flex shrink-0 items-center justify-center bg-surface-2 focus-inset transition-colors chamfer-sm hover:bg-surface-3"
      >
        <UserRound className="size-5" aria-hidden />
        <span className="xl:not-sr-only text-xs font-semibold sr-only font-mono tracking-[0.16em] uppercase">
          {t('signIn')}
        </span>
      </Link>
    )
  }
  const label = `${t('account', { name: user.name })}${syncError ? ` ${t('syncProblem')}` : ''}`
  return (
    <span className="relative shrink-0">
      <Link
        href="/account"
        aria-current={current}
        aria-label={label}
        data-testid="account-button"
        className="size-10 text-xl grid place-items-center bg-primary display text-primary-foreground focus-inset chamfer-sm focus-visible:outline-primary-foreground"
      >
        <motion.span
          aria-hidden
          variants={stampIn}
          initial={justSignedIn ? 'hidden' : false}
          animate="show"
        >
          {user.name.trim().charAt(0).toUpperCase() || '?'}
        </motion.span>
      </Link>
      {syncError && (
        <span
          aria-hidden
          className={cn('-top-1 -right-1 size-2.5 absolute bg-danger ring-2 ring-background')}
        />
      )}
    </span>
  )
}
