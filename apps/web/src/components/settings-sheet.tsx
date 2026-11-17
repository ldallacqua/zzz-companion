'use client'

import { useLocale, useTranslations } from 'next-intl'
import { RotateCcw, UserRound } from 'lucide-react'
import { Button, Segmented, Sheet, SheetContent } from '@zzz/ui'
import type { Locale } from '@zzz/core'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { useAccount } from '@/lib/account-store'
import { useCompanion, type MotionPreference, type RecapMode } from '@/lib/store'
import { useUi } from '@/lib/ui-store'

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <section className="py-5 first:pt-1 border-t border-border first:border-t-0">
      <h3 className="mb-3 font-semibold font-mono text-[0.7rem] tracking-[0.2em] text-subtle uppercase">
        {title}
      </h3>
      {children}
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </section>
  )
}

export function SettingsSheet() {
  const t = useTranslations('settings')
  const tr = useTranslations('recap')
  const tc = useTranslations('common')
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const open = useUi((s) => s.settingsOpen)
  const setOpen = useUi((s) => s.setSettingsOpen)
  const motion = useCompanion((s) => s.motion)
  const setMotion = useCompanion((s) => s.setMotion)
  const recapMode = useCompanion((s) => s.recapMode)
  const setRecapMode = useCompanion((s) => s.setRecapMode)
  const resetProgress = useCompanion((s) => s.resetProgress)
  const accountsEnabled = useAccount((s) => s.enabled)
  const accountUser = useAccount((s) => (s.token ? s.user : null))

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent heading={t('title')} closeLabel={tc('close')}>
        <Section title={t('language')}>
          <Segmented<Locale>
            label={t('language')}
            layoutId="settings-locale"
            value={locale}
            onValueChange={(next) => router.replace(pathname, { locale: next, scroll: false })}
            options={[
              { value: 'en', label: 'English' },
              { value: 'pt-BR', label: 'Português' },
            ]}
          />
        </Section>
        <Section title={t('motion')} hint={t('motionHint')}>
          <Segmented<MotionPreference>
            label={t('motion')}
            layoutId="settings-motion"
            className="grid grid-cols-2"
            value={motion}
            onValueChange={setMotion}
            options={[
              { value: 'system', label: t('motionSystem') },
              { value: 'full', label: t('motionFull') },
              { value: 'reduced', label: t('motionReduced') },
              { value: 'off', label: t('motionOff') },
            ]}
          />
        </Section>
        <Section title={t('recapMode')}>
          <Segmented<RecapMode>
            label={t('recapMode')}
            layoutId="settings-recap"
            value={recapMode}
            onValueChange={setRecapMode}
            options={[
              { value: 'tldr', label: tr('tldr') },
              { value: 'full', label: tr('full') },
            ]}
          />
        </Section>
        {accountsEnabled && (
          <Section title={t('account')}>
            <p className="mb-3 text-sm text-muted">
              {accountUser
                ? t.rich('accountSignedIn', {
                    name: accountUser.name,
                    strong: (chunks) => <strong className="text-foreground">{chunks}</strong>,
                  })
                : t('accountGuest')}
            </p>
            <Button variant="outline" size="sm" asChild>
              <Link href="/account" onClick={() => setOpen(false)}>
                <UserRound aria-hidden />
                {accountUser ? t('accountManage') : t('accountGuestCta')}
              </Link>
            </Button>
          </Section>
        )}
        <Section title={t('data')} hint={t('dataHint')}>
          <Button variant="outline" size="sm" onClick={() => resetProgress()}>
            <RotateCcw aria-hidden />
            {t('reset')}
          </Button>
        </Section>
        <Section title={t('about')}>
          <p className="text-sm leading-relaxed text-muted">{t('aboutBody')}</p>
        </Section>
      </SheetContent>
    </Sheet>
  )
}
