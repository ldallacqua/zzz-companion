import type { Locale, Localized } from '@zzz/core'

/**
 * Single source of truth for the product's feature list.
 *
 * - The landing page renders straight from this array: each entry in the act named by `act`.
 * - `features.test.ts` fails if README.md doesn't mention every entry by its English title.
 *
 * Shipping a notable feature? Add or update it here (and in README) in the same change.
 * See AGENTS.md → "Docs that must stay in sync".
 */
export type FeatureStatus = 'shipped' | 'planned'
/**
 * Where the landing page shows the feature: the act whose scene demonstrates it (`shield`:
 * Act 1, `bento`: Act 2, `roster`: Act 3) or `next` ("Next time on", for planned features).
 * Every entry is rendered exactly once (the e2e tests check `[data-feature-id]`).
 */
export type FeatureAct = 'shield' | 'bento' | 'roster' | 'next'
export type FeatureIcon =
  | 'tv'
  | 'shield'
  | 'pointer'
  | 'users'
  | 'book'
  | 'languages'
  | 'sparkles'
  | 'smartphone'
  | 'lock'
  | 'swords'
  | 'dice'
  | 'roster'
  | 'cloud'

export interface Feature {
  id: string
  status: FeatureStatus
  icon: FeatureIcon
  act: FeatureAct
  title: Localized<string>
  description: Localized<string>
}

export const features: Feature[] = [
  {
    id: 'recap',
    status: 'shipped',
    icon: 'tv',
    act: 'shield',
    title: { en: 'Story recap', 'pt-BR': 'Recap da história' },
    description: {
      en: 'Prologue → Chapter 2 Interlude, part by part, short or in full — researched from the game’s transcripts.',
      'pt-BR':
        'Do Prólogo ao Interlúdio do Cap. 2, parte por parte, resumido ou completo — pesquisado nas transcrições do jogo.',
    },
  },
  {
    id: 'spoiler-gating',
    status: 'shipped',
    icon: 'shield',
    act: 'shield',
    title: { en: 'Spoiler shield', 'pt-BR': 'Escudo anti-spoiler' },
    description: {
      en: 'Tell it where you are and nothing past that point shows up — not in the recap, the characters or the glossary.',
      'pt-BR':
        'Diga onde você está e nada além disso aparece — nem no recap, nem nos personagens, nem no glossário.',
    },
  },
  {
    id: 'intel-cards',
    status: 'shipped',
    icon: 'pointer',
    act: 'bento',
    title: { en: 'Tap-to-explain names', 'pt-BR': 'Nomes clicáveis' },
    description: {
      en: 'Characters, factions and terms in the recap — and the faces of who was there — are tappable: an intel card explains who or what they are, as of that point in the story.',
      'pt-BR':
        'Personagens, facções e termos do recap — e os rostos de quem estava em cena — são clicáveis: um cartão explica quem ou o que eles são, naquele ponto da história.',
    },
  },
  {
    id: 'characters',
    status: 'shipped',
    icon: 'users',
    act: 'bento',
    title: { en: 'Character files', 'pt-BR': 'Fichas de personagens' },
    description: {
      en: 'Everyone you’ve met, each with a file that grows as you play: full-body art, what you know now and how it changed, and every part they appear in.',
      'pt-BR':
        'Todo mundo que você já conheceu, cada um com uma ficha que cresce conforme você joga: arte de corpo inteiro, o que você sabe agora e como isso mudou, e as partes em que aparece.',
    },
  },
  {
    id: 'glossary',
    status: 'shipped',
    icon: 'book',
    act: 'bento',
    title: { en: 'Searchable glossary', 'pt-BR': 'Glossário com busca' },
    description: {
      en: 'Hollows, Ethereals, H.A.N.D., TOPS… every term and faction, unlocked as the story introduces it.',
      'pt-BR':
        'Esferas Negras, Etéreos, H.A.N.D., TOPS… cada termo e facção, liberado quando a história apresenta.',
    },
  },
  {
    id: 'roster',
    status: 'shipped',
    icon: 'roster',
    act: 'roster',
    title: { en: 'My Agents roster', 'pt-BR': 'Meus Agentes' },
    description: {
      en: 'Tick the Agents you own and their Mindscape: fast enough for the whole roster, and the base for builds and pull advice.',
      'pt-BR':
        'Marque os Agentes que você tem e o Mindscape de cada um: rápido mesmo com todos os Agentes, e a base das builds e dos conselhos de pulls.',
    },
  },
  {
    id: 'i18n',
    status: 'shipped',
    icon: 'languages',
    act: 'bento',
    title: { en: 'English + Português', 'pt-BR': 'Inglês + Português' },
    description: {
      en: 'Full Brazilian Portuguese with the game’s official localized terms.',
      'pt-BR': 'Português do Brasil completo, com os termos oficiais da localização do jogo.',
    },
  },
  {
    id: 'motion',
    status: 'shipped',
    icon: 'sparkles',
    act: 'bento',
    title: { en: 'Motion with an off switch', 'pt-BR': 'Animações com botão de desligar' },
    description: {
      en: 'CRT power-ons, glitch titles and hazard tape — or Reduced / Off in one tap. Follows your system setting by default.',
      'pt-BR':
        'TV ligando, títulos com glitch e fita zebrada — ou Reduzidas / Desligadas com um toque. Segue o sistema por padrão.',
    },
  },
  {
    id: 'responsive',
    status: 'shipped',
    icon: 'smartphone',
    act: 'bento',
    title: { en: 'Phone to desktop', 'pt-BR': 'Do celular ao desktop' },
    description: {
      en: 'Built mobile-first with a thumb-friendly tab bar; tested on phone, tablet and desktop.',
      'pt-BR':
        'Feito primeiro para o celular, com barra de abas inferior; testado em celular, tablet e desktop.',
    },
  },
  {
    id: 'local-first',
    status: 'shipped',
    icon: 'lock',
    act: 'bento',
    title: { en: 'Private by default', 'pt-BR': 'Privado por padrão' },
    description: {
      en: 'No tracking. Settings stay in your browser; an account is optional and only syncs your progress and Agents.',
      'pt-BR':
        'Sem rastreamento. Os ajustes ficam no seu navegador; a conta é opcional e só sincroniza seu progresso e seus Agentes.',
    },
  },
  {
    id: 'accounts',
    status: 'shipped',
    icon: 'cloud',
    act: 'bento',
    title: { en: 'Accounts & sync', 'pt-BR': 'Conta e sincronização' },
    description: {
      en: 'An optional account keeps your progress and Agents on every device. No email spam, no tracking; delete it any time.',
      'pt-BR':
        'Uma conta opcional leva seu progresso e seus Agentes para qualquer aparelho. Sem e-mails, sem rastreamento; apague quando quiser.',
    },
  },
  {
    id: 'builds',
    status: 'planned',
    icon: 'swords',
    act: 'next',
    title: { en: 'Character builds', 'pt-BR': 'Builds de personagens' },
    description: {
      en: 'Recommended W-Engines and Drive Discs, plus what your current gear is missing.',
      'pt-BR': 'Motores-W e Discos recomendados, e o que falta no seu equipamento atual.',
    },
  },
  {
    id: 'pull-advisor',
    status: 'planned',
    icon: 'dice',
    act: 'next',
    title: { en: 'Pull advisor', 'pt-BR': 'Conselheiro de pulls' },
    description: {
      en: 'Should you pull on the current banner? Odds from your pity and currency, weighed against your Agents and plans.',
      'pt-BR':
        'Vale a pena puxar no banner atual? Chances pelo seu pity e moeda, pesadas contra seus Agentes e seus planos.',
    },
  },
]

/** A feature's title in one locale, e.g. for a landing-page label (falls back to the id). */
export const featureTitle = (id: string, locale: Locale): string =>
  features.find((f) => f.id === id)?.title[locale] ?? id
