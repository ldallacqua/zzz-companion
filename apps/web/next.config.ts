import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/**
 * `STATIC_EXPORT=true` builds a fully static site (what Vercel serves, ADR 0012).
 * `BASE_PATH` is an optional sub-path to serve the site from (empty on Vercel).
 * The app has no server-only features, so dev, `next start` and static export behave the same.
 */
const isStatic = process.env.STATIC_EXPORT === 'true'
const basePath = process.env.BASE_PATH ?? ''

const nextConfig: NextConfig = {
  output: isStatic ? 'export' : undefined,
  basePath,
  trailingSlash: true,
  // The floating dev badge overlaps the mobile tab bar (and README screenshots).
  devIndicators: false,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Workspace packages ship TypeScript source ("just-in-time" internal packages).
  transpilePackages: ['@zzz/core', '@zzz/game', '@zzz/story', '@zzz/ui'],
  images: {
    // Character art is © HoYoverse, hotlinked from the community wiki CDN (never committed).
    // That CDN rejects server-side image proxies, so the browser loads images directly.
    unoptimized: true,
  },
}

export default withNextIntl(nextConfig)
