/**
 * Helpers for art hotlinked from the wiki CDN. Plain functions (no React), so server components
 * can call them too — `portrait.tsx` is a client module, whose exports a server component can't run.
 */
export const FANDOM_REVISION = '/revision/latest'

/** Fandom/Vignette URLs accept `/scale-to-width-down/{w}`; anything else is returned as is. */
export function resized(src: string, width: number): string {
  return src.includes(FANDOM_REVISION)
    ? src.replace(FANDOM_REVISION, `${FANDOM_REVISION}/scale-to-width-down/${width}`)
    : src
}
