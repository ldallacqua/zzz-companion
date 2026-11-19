import type { ComponentProps } from 'react'
import {
  Anvil,
  Atom,
  Axe,
  Flame,
  HandFist,
  Hammer,
  HeartHandshake,
  Hexagon,
  Shield,
  Snowflake,
  Sparkle,
  Sun,
  Sword,
  Wind,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { attributesById } from '@zzz/game'

/*
 * Icons for Agent traits. No 'use client' and no hooks, so server components (the landing page's
 * product shots) can render them as well as the client screens.
 */

const ATTRIBUTE_ICONS: Record<string, LucideIcon> = {
  physical: HandFist,
  fire: Flame,
  ice: Snowflake,
  electric: Zap,
  ether: Sparkle,
  wind: Wind,
  lumiflux: Sun,
}
const SPECIALTY_ICONS: Record<string, LucideIcon> = {
  attack: Sword,
  stun: Hammer,
  anomaly: Atom,
  support: HeartHandshake,
  defense: Shield,
  rupture: Axe,
  armorer: Anvil,
}

/** Icon for an attribute id; variants use their base attribute's icon. */
export function attributeIcon(id: string): LucideIcon {
  const base = attributesById.get(id)?.base ?? id
  return ATTRIBUTE_ICONS[base] ?? Hexagon
}
export const specialtyIcon = (id: string): LucideIcon => SPECIALTY_ICONS[id] ?? Hexagon

/** An attribute's or specialty's icon (attribute variants use their base's icon). */
export function TraitIcon({
  kind,
  id,
  ...props
}: { kind: 'attribute' | 'specialty'; id: string } & ComponentProps<LucideIcon>) {
  const key = kind === 'attribute' ? (attributesById.get(id)?.base ?? id) : id
  const Icon = (kind === 'attribute' ? ATTRIBUTE_ICONS : SPECIALTY_ICONS)[key] ?? Hexagon
  return <Icon {...props} />
}
