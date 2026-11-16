import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'

/**
 * Public origin of the deployed site. hreflang and canonical links must be absolute, so the
 * deploy workflow sets NEXT_PUBLIC_SITE_ORIGIN (e.g. https://<user>.github.io).
 */
export const SITE_ORIGIN = process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'http://localhost:3000'
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Canonical URL plus one hreflang alternate per locale for a page (`path` has no locale). */
export function localizedAlternates(locale: string, path = ''): Metadata['alternates'] {
  const url = (l: string) => `${BASE_PATH}/${l}${path}/`
  return {
    canonical: url(locale),
    languages: {
      ...Object.fromEntries(routing.locales.map((l) => [l, url(l)])),
      'x-default': url(routing.defaultLocale),
    },
  }
}
