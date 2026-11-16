import { getTranslations } from 'next-intl/server'
import { Marquee } from '@zzz/ui'

export async function SiteFooter() {
  const t = await getTranslations('footer')
  return (
    <footer className="mt-24 pb-24 md:pb-0">
      <Marquee items={['Zenless Zone Zero', 'Companion', 'Fan made']} tone="dark" duration={40} />
      <div className="max-w-6xl space-y-2 px-4 py-8 text-xs leading-relaxed sm:px-6 mx-auto text-muted">
        <p>{t('disclaimer')}</p>
        <p>
          {t('sources')}{' '}
          <a
            className="text-foreground underline decoration-primary underline-offset-4 hover:text-primary"
            href="https://zenless-zone-zero.fandom.com/wiki/Phaethon%27s_Story"
            target="_blank"
            rel="noreferrer"
          >
            zenless-zone-zero.fandom.com
          </a>
        </p>
      </div>
    </footer>
  )
}
