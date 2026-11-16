import type { Metadata } from 'next'
import { routing } from '@/i18n/routing'
import { LOCALE_STORAGE_KEY } from '@/lib/locale-preference'

export const metadata: Metadata = {
  title: 'ZZZ Companion',
  robots: { index: false },
}

const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/**
 * `/` → `/{locale}/`. Works on static hosting (no server, no middleware):
 * saved choice first, then the browser languages, then the default locale.
 */
const redirectScript = `(()=>{var b=${JSON.stringify(base)},L=${JSON.stringify(routing.locales)},d=${JSON.stringify(routing.defaultLocale)},l=null;try{l=localStorage.getItem(${JSON.stringify(LOCALE_STORAGE_KEY)})}catch(e){}if(L.indexOf(l)<0){l=d;var n=navigator.languages||[navigator.language];for(var i=0;i<n.length;i++){var c=String(n[i]).toLowerCase();if(c.indexOf('pt')===0){l='pt-BR';break}if(c.indexOf('en')===0){l='en';break}}}location.replace(b+'/'+l+'/'+location.hash)})()`

export default function RootRedirect() {
  return (
    <html lang="en">
      <head>
        <meta name="color-scheme" content="dark" />
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
        <noscript>
          <meta httpEquiv="refresh" content={`0; url=${base}/${routing.defaultLocale}/`} />
        </noscript>
      </head>
      <body style={{ background: '#08080a', color: '#f3f3ee', fontFamily: 'system-ui' }}>
        <p style={{ padding: 24 }}>
          <a href={`${base}/en/`} style={{ color: '#c6ff2e' }}>
            English
          </a>
          {' · '}
          <a href={`${base}/pt-BR/`} style={{ color: '#c6ff2e' }}>
            Português
          </a>
        </p>
      </body>
    </html>
  )
}
