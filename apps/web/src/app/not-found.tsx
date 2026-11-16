const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ''

/** Global 404 (outside any locale). Styled inline: it can't rely on the locale layout. */
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100dvh',
          display: 'grid',
          placeItems: 'center',
          background: '#08080a',
          color: '#f3f3ee',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
        }}
      >
        <main>
          <p style={{ color: '#c6ff2e', letterSpacing: '0.3em', fontFamily: 'monospace' }}>404</p>
          <h1 style={{ fontStyle: 'italic', textTransform: 'uppercase', fontSize: 48, margin: 8 }}>
            Signal lost
          </h1>
          <p>
            <a href={`${base}/en/`} style={{ color: '#c6ff2e' }}>
              Back home
            </a>
            {' · '}
            <a href={`${base}/pt-BR/`} style={{ color: '#c6ff2e' }}>
              Voltar ao início
            </a>
          </p>
        </main>
      </body>
    </html>
  )
}
