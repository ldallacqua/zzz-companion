'use client'

import type { ReactNode } from 'react'
import {
  NextIntlClientProvider,
  useLocale,
  useMessages,
  type AbstractIntlMessages,
} from 'next-intl'

/**
 * Adds a route's own message namespaces to the ones the layout already sent. The layout leaves
 * route-only namespaces out (e.g. `builds`), so every other page's HTML doesn't carry them; this
 * merges them back in for the route's subtree without sending the shared ones twice.
 */
export function RouteMessages({
  messages,
  children,
}: {
  messages: AbstractIntlMessages
  children: ReactNode
}) {
  const shared = useMessages()
  const locale = useLocale()
  return (
    <NextIntlClientProvider locale={locale} messages={{ ...shared, ...messages }}>
      {children}
    </NextIntlClientProvider>
  )
}
