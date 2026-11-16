import type { Localized } from '@zzz/core'

/**
 * Single source of truth for the product's feature list.
 *
 * - The landing page "Features" section renders straight from this array.
 * - `features.test.ts` fails if README.md doesn't mention every entry by its English title.
 *
 * Shipping a notable feature? Add or update it here (and in README) in the same change.
 * See AGENTS.md → "Docs that must stay in sync".
 */
export type FeatureStatus = 'shipped' | 'planned'
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

export interface Feature {
  id: string
  status: FeatureStatus
  icon: FeatureIcon
  title: Localized<string>
  description: Localized<string>
}

export const features: Feature[] = [
  {
    id: 'recap',
    status: 'shipped',
    icon: 'tv',
    title: { en: 'Story recap', 'pt-BR': 'Recap da história' },
    description: {
      en: 'Prologue → Chapter 2 Interlude, part by part, in TL;DR or full mode — researched from the game’s transcripts.',
      'pt-BR':
        'Do Prólogo ao Interlúdio do Cap. 2, parte por parte, em TL;DR ou completo — pesquisado nas transcrições do jogo.',
    },
  },
  {
    id: 'spoiler-gating',
    status: 'shipped',
    icon: 'shield',
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
    title: { en: 'Tap-to-explain names', 'pt-BR': 'Nomes clicáveis' },
    description: {
      en: 'Characters, factions and terms in the recap are tappable: an intel card explains who or what they are — as of that point in the story.',
      'pt-BR':
        'Personagens, facções e termos do recap são clicáveis: um cartão explica quem ou o que eles são — naquele ponto da história.',
    },
  },
  {
    id: 'characters',
    status: 'shipped',
    icon: 'users',
    title: { en: 'Character files', 'pt-BR': 'Fichas de personagens' },
    description: {
      en: 'Everyone you’ve met, filterable by faction, described only with what you already know.',
      'pt-BR': 'Todo mundo que você já conheceu, com filtro por facção e só o que você já sabe.',
    },
  },
  {
    id: 'glossary',
    status: 'shipped',
    icon: 'book',
    title: { en: 'Searchable glossary', 'pt-BR': 'Glossário com busca' },
    description: {
      en: 'Hollows, Ethereals, H.A.N.D., TOPS… every term and faction, unlocked as the story introduces it.',
      'pt-BR':
        'Esferas Negras, Etéreos, H.A.N.D., TOPS… cada termo e facção, liberado quando a história apresenta.',
    },
  },
  {
    id: 'i18n',
    status: 'shipped',
    icon: 'languages',
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
    title: { en: 'Private by default', 'pt-BR': 'Privado por padrão' },
    description: {
      en: 'No account and no tracking: your progress lives only in your browser.',
      'pt-BR': 'Sem conta e sem rastreamento: seu progresso fica só no seu navegador.',
    },
  },
  {
    id: 'builds',
    status: 'planned',
    icon: 'swords',
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
    title: { en: 'Pull advisor', 'pt-BR': 'Conselheiro de pulls' },
    description: {
      en: 'Should you pull on the current banner? Odds from your pity and currency, weighed against your roster and plans.',
      'pt-BR':
        'Vale a pena puxar no banner atual? Chances pelo seu pity e moeda, pesadas contra seu elenco e seus planos.',
    },
  },
]
