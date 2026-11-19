import type { Stat } from '@zzz/core'

/**
 * Drive Disc stats, named as each game client shows them (wiki stat pages, "Other Languages":
 * PV, ATQ, Taxa CRIT, Taxa de Perfuração…). `short` is for the loadout board's tight slots.
 * Percent stats say so ("ATK%"); flat ones don't, which is how players tell them apart.
 */
const attributeDmg = (id: string, en: string, pt: string): Stat => ({
  id: `${id}-dmg`,
  name: { en: `${en} DMG Bonus`, 'pt-BR': `Bônus de Dano ${pt}` },
  short: { en: `${en} DMG%`, 'pt-BR': `Dano ${pt}%` },
})

export const stats: Stat[] = [
  // Flat stats: `short` says "flat", so a substat list never reads like the percent version.
  { id: 'hp', name: { en: 'HP', 'pt-BR': 'PV' }, short: { en: 'HP (flat)', 'pt-BR': 'PV (fixo)' } },
  {
    id: 'atk',
    name: { en: 'ATK', 'pt-BR': 'ATQ' },
    short: { en: 'ATK (flat)', 'pt-BR': 'ATQ (fixo)' },
  },
  {
    id: 'def',
    name: { en: 'DEF', 'pt-BR': 'DEF' },
    short: { en: 'DEF (flat)', 'pt-BR': 'DEF (fixa)' },
  },
  { id: 'hp-pct', name: { en: 'HP%', 'pt-BR': 'PV%' } },
  { id: 'atk-pct', name: { en: 'ATK%', 'pt-BR': 'ATQ%' } },
  { id: 'def-pct', name: { en: 'DEF%', 'pt-BR': 'DEF%' } },
  { id: 'crit-rate', name: { en: 'CRIT Rate', 'pt-BR': 'Taxa CRIT' } },
  { id: 'crit-dmg', name: { en: 'CRIT DMG', 'pt-BR': 'Dano CRIT' } },
  {
    id: 'pen',
    name: { en: 'PEN', 'pt-BR': 'Perfuração' },
    short: { en: 'PEN (flat)', 'pt-BR': 'Perfuração (fixa)' },
  },
  {
    id: 'pen-ratio',
    name: { en: 'PEN Ratio', 'pt-BR': 'Taxa de Perfuração' },
    short: { en: 'PEN Ratio', 'pt-BR': 'Taxa de Perf.' },
  },
  {
    id: 'anomaly-proficiency',
    name: { en: 'Anomaly Proficiency', 'pt-BR': 'Proficiência de Anomalia' },
    short: { en: 'Anomaly Prof.', 'pt-BR': 'Prof. de Anomalia' },
  },
  {
    id: 'anomaly-mastery',
    name: { en: 'Anomaly Mastery', 'pt-BR': 'Maestria de Anomalia' },
    short: { en: 'Anomaly Mastery', 'pt-BR': 'Maestria de Anom.' },
  },
  { id: 'impact', name: { en: 'Impact', 'pt-BR': 'Impacto' } },
  {
    id: 'energy-regen',
    name: { en: 'Energy Regen', 'pt-BR': 'Recuperação de Energia' },
    short: { en: 'Energy Regen', 'pt-BR': 'Recup. de Energia' },
  },
  attributeDmg('physical', 'Physical', 'Físico'),
  attributeDmg('fire', 'Fire', 'de Fogo'),
  attributeDmg('ice', 'Ice', 'de Gelo'),
  attributeDmg('electric', 'Electric', 'Elétrico'),
  attributeDmg('ether', 'Ether', 'de Éter'),
  attributeDmg('wind', 'Wind', 'de Vento'),
]

/** Main stats each slot can roll (wiki "Drive Disc" → Main Stats); slots 1–3 are fixed. */
export const slotStats: Record<'4' | '5' | '6', string[]> = {
  '4': ['hp-pct', 'atk-pct', 'def-pct', 'crit-rate', 'crit-dmg', 'anomaly-proficiency'],
  '5': [
    'hp-pct',
    'atk-pct',
    'def-pct',
    'pen-ratio',
    ...stats.filter((s) => s.id.endsWith('-dmg') && s.id !== 'crit-dmg').map((s) => s.id),
  ],
  '6': ['hp-pct', 'atk-pct', 'def-pct', 'anomaly-mastery', 'impact', 'energy-regen'],
}

/** Stats a disc can roll as a substat (wiki "Drive Disc" → Sub-Stats). */
export const substatPool = [
  'hp',
  'atk',
  'def',
  'hp-pct',
  'atk-pct',
  'def-pct',
  'crit-rate',
  'crit-dmg',
  'pen',
  'anomaly-proficiency',
]

/** The fixed main stat of slots 1–3. */
export const fixedSlotStats: Record<'1' | '2' | '3', string> = { '1': 'hp', '2': 'atk', '3': 'def' }
