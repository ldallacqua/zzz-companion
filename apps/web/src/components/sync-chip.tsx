'use client'

import { useEffect, useId, useState, useSyncExternalStore } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import {
  CloudAlert,
  CloudCheck,
  CloudOff,
  CloudUpload,
  HardDrive,
  LoaderCircle,
  RefreshCw,
  type LucideIcon,
} from 'lucide-react'
import { Button, cn, Popover, PopoverContent, PopoverTrigger } from '@zzz/ui'
import { Link } from '@/i18n/navigation'
import { useAccount } from '@/lib/account-store'
import { useRoster, type SyncStatus } from '@/lib/roster-store'
import { rememberAuthIntent } from '@/lib/return-to'

export type SyncDisplay = 'local' | 'loading' | 'saving' | 'saved' | 'offline' | 'error' | 'expired'

const LOOK: Record<
  SyncDisplay,
  { icon: LucideIcon; tone: string; spin?: boolean; blink?: boolean }
> = {
  local: { icon: HardDrive, tone: 'text-muted' },
  loading: { icon: LoaderCircle, tone: 'text-info', spin: true },
  saving: { icon: CloudUpload, tone: 'text-info', blink: true },
  saved: { icon: CloudCheck, tone: 'text-primary' },
  offline: { icon: CloudOff, tone: 'text-warning' },
  error: { icon: CloudAlert, tone: 'text-danger' },
  expired: { icon: CloudAlert, tone: 'text-warning' },
}

const subscribeOnline = (cb: () => void) => {
  window.addEventListener('online', cb)
  window.addEventListener('offline', cb)
  return () => {
    window.removeEventListener('online', cb)
    window.removeEventListener('offline', cb)
  }
}

/**
 * What the chip shows, from the stores: "Saving…" stays up for at least 600ms so the label
 * doesn't flicker on every tap, and a failed save while offline reads as "Offline".
 */
export function useSyncDisplay(): SyncDisplay {
  const status = useRoster((s) => s.sync)
  const enabled = useAccount((s) => s.enabled)
  const token = useAccount((s) => s.token)
  const online = useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  )
  const [holdSaving, setHoldSaving] = useState(false)
  const [previous, setPrevious] = useState(status)
  if (status !== previous) {
    setPrevious(status)
    if (status === 'saving') setHoldSaving(true)
  }
  useEffect(() => {
    if (!holdSaving) return
    const timer = setTimeout(() => setHoldSaving(false), 600)
    return () => clearTimeout(timer)
  }, [holdSaving])

  return displayFor(status, { enabled, signedIn: !!token, online, holdSaving })
}

export function displayFor(
  status: SyncStatus,
  {
    enabled,
    signedIn,
    online,
    holdSaving = false,
  }: {
    enabled: boolean
    signedIn: boolean
    online: boolean
    holdSaving?: boolean
  },
): SyncDisplay {
  if (status === 'expired') return 'expired'
  if (!enabled || !signedIn) return 'local'
  if (status === 'error') return online ? 'error' : 'offline'
  if (status === 'saving' || (holdSaving && status === 'saved')) return 'saving'
  if (status === 'loading') return 'loading'
  if (status === 'saved') return 'saved'
  return 'local'
}

function relativeTime(from: number, locale: string) {
  const seconds = Math.round((from - Date.now()) / 1000)
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })
  if (Math.abs(seconds) < 60) return rtf.format(0, 'second')
  const minutes = Math.round(seconds / 60)
  if (Math.abs(minutes) < 60) return rtf.format(minutes, 'minute')
  return rtf.format(Math.round(minutes / 60), 'hour')
}

/** Where the roster lives right now, with a popover that explains it (and offers the fix). */
export function SyncChip({
  display,
  accountsEnabled,
  lastSavedAt,
  onRetry,
  className,
}: {
  display: SyncDisplay
  accountsEnabled: boolean
  lastSavedAt?: number | null
  onRetry: () => void
  className?: string
}) {
  const t = useTranslations('sync')
  const locale = useLocale()
  const titleId = useId()
  const look = LOOK[display]
  const Icon = look.icon
  const label = t(display)

  const body = (() => {
    switch (display) {
      case 'local':
        return {
          title: t('localTitle'),
          body: accountsEnabled ? t('localBody') : t('localOff'),
        }
      case 'loading':
        return { title: t('loadingTitle'), body: t('loadingBody') }
      case 'saving':
        return { title: t('savingTitle'), body: t('savingBody') }
      case 'saved':
        return {
          title: t('savedTitle'),
          body: lastSavedAt
            ? t('savedBody', { time: relativeTime(lastSavedAt, locale) })
            : t('savedBodyNoTime'),
        }
      case 'offline':
        return { title: t('offlineTitle'), body: t('offlineBody') }
      case 'error':
        return { title: t('errorTitle'), body: t('errorBody') }
      case 'expired':
        return { title: t('expiredTitle'), body: t('expiredBody') }
    }
  })()

  return (
    <Popover>
      <PopoverTrigger
        aria-label={t('chipSr', { status: label })}
        data-testid="sync-chip"
        data-sync={display}
        className={cn(
          'h-10 gap-2 px-3 font-semibold inline-flex shrink-0 cursor-pointer items-center bg-surface-2 font-mono text-[0.7rem] tracking-[0.12em] whitespace-nowrap uppercase focus-inset transition-colors chamfer-sm hover:bg-surface-3',
          className,
        )}
      >
        <Icon
          className={cn(
            'size-4 shrink-0',
            look.tone,
            look.spin && 'motion-ambient animate-spin',
            look.blink && 'motion-ambient animate-[blink_1.1s_steps(2,start)_infinite]',
          )}
          aria-hidden
        />
        <span>{label}</span>
        {display === 'error' && <RefreshCw className="size-3.5 text-muted" aria-hidden />}
      </PopoverTrigger>
      <PopoverContent className="w-[min(20rem,calc(100vw-1.5rem))]" aria-labelledby={titleId}>
        <div className="p-4">
          <p id={titleId} className="text-xl display">
            {body.title}
          </p>
          <p className="mt-1 text-sm text-muted">{body.body}</p>
          {display === 'local' && accountsEnabled && (
            <div className="mt-4 gap-2 flex flex-wrap">
              <Button asChild size="sm">
                <Link href="/account#create" onClick={() => rememberAuthIntent('create')}>
                  {t('create')}
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/account" onClick={() => rememberAuthIntent('sign-in')}>
                  {t('signIn')}
                </Link>
              </Button>
            </div>
          )}
          {display === 'saved' && (
            <div className="mt-4">
              <Button asChild size="sm" variant="outline">
                <Link href="/account">{t('manage')}</Link>
              </Button>
            </div>
          )}
          {display === 'error' && (
            <div className="mt-4">
              <Button size="sm" onClick={onRetry}>
                <RefreshCw aria-hidden />
                {t('retry')}
              </Button>
            </div>
          )}
          {display === 'expired' && (
            <div className="mt-4">
              <Button asChild size="sm">
                <Link href="/account" onClick={() => rememberAuthIntent('sign-in')}>
                  {t('signIn')}
                </Link>
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
