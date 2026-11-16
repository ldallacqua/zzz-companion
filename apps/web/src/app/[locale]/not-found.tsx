import { getTranslations } from 'next-intl/server'
import { Button, GlitchText } from '@zzz/ui'
import { Link } from '@/i18n/navigation'

export default async function NotFound() {
  const t = await getTranslations('notFound')
  return (
    <section className="gap-6 py-16 flex min-h-[60dvh] flex-col items-start justify-center">
      <p className="text-sm font-mono tracking-[0.3em] text-primary uppercase">404</p>
      <h1 className="text-6xl sm:text-8xl display">
        <GlitchText text={t('title')} />
      </h1>
      <p className="text-lg text-muted">{t('body')}</p>
      <Button asChild>
        <Link href="/">{t('back')}</Link>
      </Button>
    </section>
  )
}
