import type { FactionInput } from '@zzz/core'

/** Descriptions only state what the reader knows at `unlockedAt`. */
export const factions = [
  {
    id: 'phaethon',
    unlockedAt: 'p-phaethon',
    name: { en: 'Phaethon', 'pt-BR': 'Phaethon' },
    description: {
      en: 'The legendary Proxy alias shared by Belle and Wise.',
      'pt-BR': 'O lendário codinome de Proxy compartilhado por Belle e Wise.',
    },
  },
  {
    id: 'cunning-hares',
    unlockedAt: 'p-strongbox',
    name: { en: 'Cunning Hares', 'pt-BR': 'Casa das Lebres Astutas' },
    aliases: { en: ['Hares'], 'pt-BR': ['Lebres Astutas', 'Lebres'] },
    description: {
      en: 'An odd-job agency run by Nicole Demara: retrievals, escorts and the occasional illegal Hollow raid — for the right price.',
      'pt-BR':
        'Agência de bicos comandada por Nicole Demara: recuperações, escoltas e uma ou outra incursão ilegal em Esferas — pelo preço certo.',
    },
  },
  {
    id: 'red-fang',
    unlockedAt: 'p-strongbox',
    name: { en: 'Red Fang Gang', 'pt-BR': 'Gangue da Presa Rubra' },
    aliases: { en: ['Red Fang'], 'pt-BR': ['Presa Rubra'] },
    description: {
      en: 'A street gang led by Miguel Silver, wanted by Public Security for an attack on a research institute.',
      'pt-BR':
        'Gangue de rua liderada por Miguel Silver, procurada pela Segurança Pública por um ataque a um instituto de pesquisa.',
    },
  },
  {
    id: 'public-security',
    unlockedAt: 'p-strongbox',
    name: { en: 'Public Security', 'pt-BR': 'Segurança Pública' },
    aliases: { en: ['PubSec'], 'pt-BR': [] },
    description: {
      en: 'New Eridu’s police. With an election coming, it is cracking down hard on Proxies.',
      'pt-BR':
        'A polícia de Nova Eridu. Com a eleição chegando, está apertando o cerco aos Proxies.',
    },
  },
  {
    id: 'vision',
    unlockedAt: 'c1a-client',
    name: { en: 'Vision Corporation', 'pt-BR': 'Corporação Visão' },
    aliases: { en: ['Vision'], 'pt-BR': ['Visão'] },
    description: {
      en: 'A construction company that won the old capital metro renovation by promising to do it faster and cheaper.',
      'pt-BR':
        'Construtora que venceu a reforma do metrô da antiga capital prometendo fazer mais rápido e mais barato.',
    },
  },
  {
    id: 'belobog',
    unlockedAt: 'c1a-client',
    name: { en: 'Belobog Heavy Industries', 'pt-BR': 'Indústrias Pesadas Belobog' },
    aliases: {
      en: ['Belobog Industries', 'Belobog'],
      'pt-BR': ['Indústrias Belobog', 'Belobog'],
    },
    description: {
      en: 'A rising construction and smart-machinery company with a good reputation — and the rival Vision beat for the metro contract.',
      'pt-BR':
        'Empresa emergente de construção e máquinas inteligentes, com boa reputação — e a rival que a Visão derrotou na licitação do metrô.',
    },
  },
  {
    id: 'section-6',
    unlockedAt: 'z-hollow-zero',
    name: {
      en: 'Hollow Special Operations Section 6',
      'pt-BR': 'Forças Especiais em Esferas Negras — Seção 6',
    },
    aliases: {
      en: ['Section 6'],
      'pt-BR': ['Seção 6 das Forças Especiais em Esferas Negras', 'Seção 6'],
    },
    description: {
      en: 'An elite H.A.N.D. unit that deals with the deadliest Hollow threats, led by Hoshimi Miyabi.',
      'pt-BR':
        'Unidade de elite da H.A.N.D. que lida com as ameaças mais letais das Esferas, liderada por Hoshimi Miyabi.',
    },
  },
  {
    id: 'white-star',
    unlockedAt: 'z-hollow-zero',
    name: { en: 'White Star Institute', 'pt-BR': 'Instituto Estrela Branca' },
    description: {
      en: 'A research institute that studies the Hollows and keeps researchers at Hollow Zero’s outposts.',
      'pt-BR':
        'Instituto que estuda as Esferas e mantém pesquisadores nos postos avançados da Hollow Zero.',
    },
  },
  {
    id: 'cisrt',
    unlockedAt: 'i2a-officers',
    name: {
      en: 'Criminal Investigation Special Response Team',
      'pt-BR': 'Equipe Especial de Investigação Criminal',
    },
    description: {
      en: 'An elite Public Security team for serious criminal cases. Zhu Yuan and Qingyi are part of it.',
      'pt-BR':
        'Equipe de elite da Segurança Pública para casos criminais graves. Zhu Yuan e Qingyi fazem parte dela.',
    },
  },
] satisfies FactionInput[]
