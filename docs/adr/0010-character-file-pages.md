# ADR 0010 — Character file pages: generic static shell, client gating, noindex

- Status: accepted
- Date: 2026-11-16

## Context

Each character now gets a page (`/[locale]/characters/[id]/`) with full-body art, what the reader
knows about them, how that changed, and the parts they appear in. The site is a static export
(ADR 0006), so a page must exist at build time for **every** id — including characters the reader
hasn't met. Progress lives only in the browser (ADR 0004), so the server can't know what to hide.
Anything rendered into the HTML, the RSC payload or the metadata of a locked character's page
would be a spoiler for anyone who opens the URL or sees it in search results.

## Decision

- `generateStaticParams` lists every character id and `dynamicParams = false`. The server page
  passes **only the id** to the client view; passing the `Character` object would serialise its
  name, texts and art into every `index.html`.
- Metadata is generic ("Character file" / "Ficha de personagem"), with `robots: noindex, follow`,
  no Open Graph image and no sitemap entry. The tab title is set on the client once the file is
  open (`useDocumentTitle`).
- Before hydration the page shows the same "File locked" shell for every id (hidden for
  returning readers via `data-progress`, like the empty recap). After hydration, `@zzz/core`
  decides: `partitionUnlocked` for access, `knownHistoryAt` for the notes, `appearancesOf` and
  `relatedCharacters` for the rest. The locked state never shows a colour, name, art or chapter.
- URLs keep readable ids (`/characters/sarah/`). An id only appears when someone shares or types
  it, and opaque ids would hurt sharing for a small gain.
- `aliases` are never displayed: they are matching aids and not spoiler-gated.

## Consequences

- An e2e test fetches the raw HTML of every character page in both locales and fails if a name,
  text or image URL appears in it.
- Lighthouse audits a character page as a first-time visitor (the locked shell) with SEO excluded
  for that URL only, because `noindex` is intentional.
- Character pages can't be previewed by link unfurlers (generic title and no image). That is the
  price of being spoiler-safe by default.
