import type { AttributeInput, GameFaction, Specialty } from '@zzz/core'

/**
 * Agent traits. Names come from each term's wiki page ("Other Languages" → Portuguese), which
 * is how the pt-BR game client labels them (e.g. "Éter" for the Ether attribute — not "Etéreo",
 * the story's word for Ethereals).
 *
 * Colors are this app's accents (not game assets), each ≥ 4.5:1 on the surface tokens.
 */
export const attributes: AttributeInput[] = [
  { id: 'physical', name: { en: 'Physical', 'pt-BR': 'Físico' }, color: '#f2c94c' },
  { id: 'fire', name: { en: 'Fire', 'pt-BR': 'Fogo' }, color: '#ff6a3d' },
  { id: 'ice', name: { en: 'Ice', 'pt-BR': 'Gelo' }, color: '#6fd6ff' },
  { id: 'electric', name: { en: 'Electric', 'pt-BR': 'Elétrico' }, color: '#5b9dff' },
  { id: 'ether', name: { en: 'Ether', 'pt-BR': 'Éter' }, color: '#ff5fcf' },
  { id: 'wind', name: { en: 'Wind', 'pt-BR': 'Vento' }, color: '#58eaa0' },
  { id: 'lumiflux', name: { en: 'Lumiflux', 'pt-BR': 'Lúmen' }, color: '#c4b2ff' },
  // Agent-exclusive variants of a base attribute.
  { id: 'frost', name: { en: 'Frost', 'pt-BR': 'Geada' }, color: '#a6ecff', base: 'ice' },
  { id: 'auric-ink', name: { en: 'Auric Ink', 'pt-BR': 'Sépia' }, color: '#e6bd57', base: 'ether' },
  {
    id: 'honed-edge',
    name: { en: 'Honed Edge', 'pt-BR': 'Lâmina Afiada' },
    color: '#e6dcc6',
    base: 'physical',
  },
]

export const specialties: Specialty[] = [
  { id: 'attack', name: { en: 'Attack', 'pt-BR': 'Atacante' } },
  { id: 'stun', name: { en: 'Stun', 'pt-BR': 'Atordoador' } },
  { id: 'anomaly', name: { en: 'Anomaly', 'pt-BR': 'Anômalo' } },
  { id: 'support', name: { en: 'Support', 'pt-BR': 'Assistência' } },
  { id: 'defense', name: { en: 'Defense', 'pt-BR': 'Defensor' } },
  { id: 'rupture', name: { en: 'Rupture', 'pt-BR': 'Destruidor' } },
  { id: 'armorer', name: { en: 'Armorer', 'pt-BR': 'Armeiro' } },
]

/** Agent factions. Ids shared with `@zzz/story` factions keep the same names there. */
export const gameFactions: GameFaction[] = [
  { id: 'cunning-hares', name: { en: 'Cunning Hares', 'pt-BR': 'Casa das Lebres Astutas' } },
  {
    id: 'belobog',
    name: { en: 'Belobog Heavy Industries', 'pt-BR': 'Indústrias Pesadas Belobog' },
  },
  {
    id: 'victoria-housekeeping',
    name: { en: 'Victoria Housekeeping Co.', 'pt-BR': 'Serviços Domésticos Victória' },
  },
  { id: 'phaethon', name: { en: 'Phaethon', 'pt-BR': 'Phaethon' } },
  {
    id: 'section-6',
    name: {
      en: 'Hollow Special Operations Section 6',
      'pt-BR': 'Forças Especiais em Esferas Negras Seção 6',
    },
  },
  { id: 'obol-squad', name: { en: 'Obol Squad', 'pt-BR': 'Esquadrão OBOLS' } },
  {
    id: 'cisrt',
    name: {
      en: 'Criminal Investigation Special Response Team',
      'pt-BR': 'Equipe Especial de Investigação Criminal',
    },
  },
  { id: 'sons-of-calydon', name: { en: 'Sons of Calydon', 'pt-BR': 'Filhos de Calydon' } },
  {
    id: 'angels-of-delusion',
    name: { en: 'Angels of Delusion', 'pt-BR': 'Os Anjos da Desilusão' },
  },
  { id: 'stars-of-lyra', name: { en: 'Stars of Lyra', 'pt-BR': 'Estrelas de Lyra' } },
  { id: 'mockingbird', name: { en: 'Mockingbird', 'pt-BR': 'Sabiá' } },
  {
    id: 'silver-squad',
    name: {
      en: 'Defense Force - Silver Squad',
      'pt-BR': 'Força de Defesa — Companhia de Prata',
    },
  },
  { id: 'yunkui-summit', name: { en: 'Yunkui Summit', 'pt-BR': 'Monte Yunkui' } },
  { id: 'spook-shack', name: { en: 'Spook Shack', 'pt-BR': 'Casa Paranormal' } },
  { id: 'krampus', name: { en: 'Krampus Compliance Authority', 'pt-BR': 'Auditoria Krampus' } },
  {
    id: 'metropolitan-order',
    name: { en: 'Metropolitan Order Division', 'pt-BR': 'Departamento de Ordem Metropolitana' },
  },
  {
    id: 'external-strategy',
    name: { en: 'External Strategy Department', 'pt-BR': 'Departamento de Estratégia Externa' },
  },
  { id: 'covenant-of-dayat', name: { en: 'Covenant of Dayat', 'pt-BR': 'Aliança de Dayat' } },
  {
    id: 'airspace-patrol',
    name: { en: 'Airspace Patrol Department', 'pt-BR': 'Departamento de Patrulha Aérea' },
  },
  { id: 'flint-workshop', name: { en: 'Flint Workshop', 'pt-BR': 'Oficina Flint' } },
]
