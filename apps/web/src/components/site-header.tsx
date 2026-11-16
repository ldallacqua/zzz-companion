'use client'

import { motion } from 'motion/react'
import { useLocale, useTranslations } from 'next-intl'
import { BookOpenText, Home, Settings2, Users, Library } from 'lucide-react'
import { cn, spring } from '@zzz/ui'
import type { Locale } from '@zzz/core'
import { Link, usePathname } from '@/i18n/navigation'
import { useStory } from '@/lib/use-story'
import { useUi } from '@/lib/ui-store'
import { GameMark } from './game-mark'

const NAV = [
  { href: '/', key: 'home', icon: Home },
  { href: '/recap', key: 'recap', icon: BookOpenText },
  { href: '/characters', key: 'characters', icon: Users },
  { href: '/glossary', key: 'glossary', icon: Library },
] as const

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname.startsWith(href)
}

export function SiteHeader() {
  const t = useTranslations()
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const story = useStory()
  const setPickerOpen = useUi((s) => s.setPickerOpen)
  const setSettingsOpen = useUi((s) => s.setSettingsOpen)

  return (
    <header className="top-0 backdrop-blur-md sticky z-40 border-b border-border bg-background/85">
      <div className="h-16 max-w-6xl gap-3 px-4 sm:px-6 mx-auto flex items-center">
        <Link href="/" className="group gap-2.5 flex items-center" aria-label="ZZZ Companion">
          <GameMark className="h-9 transition-transform duration-300 group-hover:-skew-x-6" />
          <span className="leading-tight sm:block hidden font-mono text-[0.65rem] tracking-[0.2em] text-muted uppercase transition-colors group-hover:text-primary">
            {'//'}
            <br />
            Companion
          </span>
        </Link>

        <nav aria-label={t('nav.main')} className="ml-6 gap-1 md:flex hidden items-center">
          {NAV.map(({ href, key }) => {
            const active = isActive(pathname, href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'px-3 py-2 text-xs font-semibold relative font-mono tracking-[0.16em] uppercase transition-colors',
                  active ? 'text-primary-foreground' : 'text-muted hover:text-foreground',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="inset-0 absolute bg-primary chamfer-sm"
                    transition={spring.snappy}
                  />
                )}
                <span className="relative">{t(`nav.${key}`)}</span>
              </Link>
            )
          })}
        </nav>

        <div className="gap-2 ml-auto flex items-center">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            data-testid="progress-chip"
            className="h-10 min-w-0 gap-2 px-3 flex cursor-pointer items-center bg-surface-2 text-left transition-colors chamfer-sm hover:bg-surface-3"
          >
            <span
              className="motion-ambient size-2 shrink-0 animate-[blink_1.4s_steps(2,start)_infinite] bg-primary"
              aria-hidden
            />
            <span className="min-w-0 flex flex-col leading-none">
              <span className="font-mono text-[0.6rem] tracking-[0.2em] text-subtle uppercase">
                {t('progress.chip')}
              </span>
              <span className="text-xs font-semibold truncate font-mono">
                {!story.hydrated
                  ? '—'
                  : story.currentChapter
                    ? `${story.currentChapter.label[locale]} · ${story.doneCount}/${story.totalCount}`
                    : t('progress.notSet')}
              </span>
            </span>
          </button>
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            aria-label={t('nav.settings')}
            className="size-10 grid cursor-pointer place-items-center bg-surface-2 transition-colors chamfer-sm hover:bg-primary hover:text-primary-foreground"
          >
            <Settings2 className="size-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

/** Thumb-friendly tab bar for phones and small tablets. */
export function MobileNav() {
  const t = useTranslations('nav')
  const pathname = usePathname()
  return (
    <nav
      aria-label={t('main')}
      className="inset-x-0 bottom-0 backdrop-blur-md md:hidden fixed z-40 border-t border-border bg-background/92 pb-[env(safe-area-inset-bottom)]"
    >
      <ul className="max-w-md mx-auto grid grid-cols-4">
        {NAV.map(({ href, key, icon: Icon }) => {
          const active = isActive(pathname, href)
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'h-16 gap-1 font-semibold relative flex flex-col items-center justify-center font-mono text-[0.62rem] tracking-[0.12em] uppercase transition-colors',
                  active ? 'text-primary' : 'text-muted',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="mobile-nav-active"
                    className="inset-x-4 top-0 h-0.5 absolute bg-primary"
                    transition={spring.snappy}
                  />
                )}
                <Icon className="size-5" aria-hidden />
                {t(key)}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
