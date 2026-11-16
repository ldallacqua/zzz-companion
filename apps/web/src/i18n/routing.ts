import { defineRouting } from 'next-intl/routing'
import { LOCALES } from '@zzz/core'

export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: 'en',
  // The first visit is redirected using the browser language, then remembered in a cookie.
  localePrefix: 'always',
})
