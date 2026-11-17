'use client'

import { useId, type ReactNode } from 'react'
import { useLocale, useTranslations } from 'next-intl'
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
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { Button, cn, Segmented, Sheet, SheetContent } from '@zzz/ui'
import type { AgentRank, Locale } from '@zzz/core'
import { attributesById, baseAttributes, specialtiesById, usedSpecialties } from '@zzz/game'
import {
  EMPTY_FILTERS,
  traitFilterCount,
  type AgentFilters as Filters,
  type AgentSort,
} from '@/lib/agent-filters'

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

/** An attribute's or specialty's icon (attribute variants use their base's icon). */
export function TraitIcon({
  kind,
  id,
  ...props
}: { kind: 'attribute' | 'specialty'; id: string } & React.ComponentProps<LucideIcon>) {
  const key = kind === 'attribute' ? (attributesById.get(id)?.base ?? id) : id
  const Icon = (kind === 'attribute' ? ATTRIBUTE_ICONS : SPECIALTY_ICONS)[key] ?? Hexagon
  return <Icon {...props} />
}

/** Icon for an attribute id; variants use their base attribute's icon. */
export function attributeIcon(id: string): LucideIcon {
  const base = attributesById.get(id)?.base ?? id
  return ATTRIBUTE_ICONS[base] ?? Hexagon
}
export const specialtyIcon = (id: string): LucideIcon => SPECIALTY_ICONS[id] ?? Hexagon

const RANKS: AgentRank[] = ['S', 'A']

const toggleIn = <T,>(list: T[], item: T) =>
  list.includes(item) ? list.filter((x) => x !== item) : [...list, item]

/**
 * Toggle chip (`aria-pressed`). On = lime fill; off = dark with a tinted icon.
 * `toggle={false}` keeps the look but drops aria-pressed (e.g. "remove filter" chips).
 */
export function FilterChip({
  pressed,
  toggle = true,
  onClick,
  icon: Icon,
  iconColor,
  children,
  className,
  ...props
}: {
  pressed: boolean
  toggle?: boolean
  onClick: () => void
  icon?: LucideIcon
  iconColor?: string
  children: ReactNode
  className?: string
  'aria-label'?: string
}) {
  return (
    <button
      type="button"
      aria-pressed={toggle ? pressed : undefined}
      onClick={onClick}
      className={cn(
        'min-h-10 min-w-10 gap-1.5 px-3 font-semibold inline-flex shrink-0 cursor-pointer items-center justify-center font-mono text-[0.7rem] tracking-[0.12em] whitespace-nowrap uppercase focus-inset transition-colors chamfer-sm',
        pressed
          ? 'bg-primary text-primary-foreground focus-visible:outline-primary-foreground'
          : 'bg-surface-2 text-muted hover:text-foreground',
        className,
      )}
      {...props}
    >
      {Icon && (
        <Icon
          className="size-3.5 shrink-0"
          style={pressed ? undefined : { color: iconColor }}
          aria-hidden
        />
      )}
      {children}
    </button>
  )
}

function Group({
  title,
  inline,
  children,
}: {
  title: string
  inline: boolean
  children: ReactNode
}) {
  const id = useId()
  return (
    <div
      role="group"
      aria-labelledby={id}
      className={cn(inline ? 'gap-2 flex flex-wrap items-center' : 'space-y-3')}
    >
      <p
        id={id}
        className={cn(
          'font-mono text-[0.7rem] tracking-[0.2em] text-subtle uppercase',
          inline && 'mr-1',
        )}
      >
        {title}
      </p>
      <div className="gap-2 flex flex-wrap">{children}</div>
    </div>
  )
}

/** Sort control (Newest / A–Z). */
export function SortControl({
  value,
  onChange,
  layoutId,
  className,
}: {
  value: AgentSort
  onChange: (sort: AgentSort) => void
  layoutId: string
  className?: string
}) {
  const t = useTranslations('agents')
  return (
    <Segmented<AgentSort>
      label={t('sort')}
      layoutId={layoutId}
      className={className}
      value={value}
      onValueChange={onChange}
      options={[
        { value: 'newest', label: t('sortNewest') },
        { value: 'az', label: t('sortAz') },
      ]}
    />
  )
}

/**
 * Rank, attribute and specialty chips. OR within a group, AND across groups.
 * `sheet`: stacked groups (Filters sheet, below lg) · `inline`: two rows (lg and up).
 */
export function AgentFilters({
  value,
  onChange,
  layout,
  className,
}: {
  value: Filters
  onChange: (next: Filters) => void
  layout: 'sheet' | 'inline'
  className?: string
}) {
  const t = useTranslations('agents')
  const locale = useLocale() as Locale
  const inline = layout === 'inline'

  const rank = (
    <Group title={t('rank')} inline={inline}>
      {RANKS.map((r) => (
        <FilterChip
          key={r}
          pressed={value.ranks.includes(r)}
          onClick={() => onChange({ ...value, ranks: toggleIn(value.ranks, r) })}
          aria-label={t(r === 'S' ? 'rankS' : 'rankA')}
        >
          {r}
        </FilterChip>
      ))}
    </Group>
  )
  const attribute = (
    <Group title={t('attribute')} inline={inline}>
      {baseAttributes.map((a) => (
        <FilterChip
          key={a.id}
          pressed={value.attributes.includes(a.id)}
          onClick={() => onChange({ ...value, attributes: toggleIn(value.attributes, a.id) })}
          icon={attributeIcon(a.id)}
          iconColor={a.color}
        >
          {a.name[locale]}
        </FilterChip>
      ))}
    </Group>
  )
  const specialty = (
    <Group title={t('specialty')} inline={inline}>
      {usedSpecialties.map((s) => (
        <FilterChip
          key={s.id}
          pressed={value.specialties.includes(s.id)}
          onClick={() => onChange({ ...value, specialties: toggleIn(value.specialties, s.id) })}
          icon={specialtyIcon(s.id)}
        >
          {s.name[locale]}
        </FilterChip>
      ))}
    </Group>
  )

  if (inline) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="gap-x-6 gap-y-3 flex flex-wrap items-center">
          {rank}
          {attribute}
        </div>
        <div className="gap-x-6 gap-y-3 flex flex-wrap items-center">
          {specialty}
          {traitFilterCount(value) > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onChange({ ...value, ranks: [], attributes: [], specialties: [] })}
            >
              {t('clearFilters')}
            </Button>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className={cn('space-y-6', className)}>
      <Group title={t('sort')} inline={false}>
        <SortControl
          value={value.sort}
          onChange={(sort) => onChange({ ...value, sort })}
          layoutId="roster-sort-sheet"
        />
      </Group>
      {rank}
      {attribute}
      {specialty}
    </div>
  )
}

/** Filters sheet for phones and tablets: chips apply live; the footer shows the result count. */
export function AgentFilterSheet({
  open,
  onOpenChange,
  value,
  onChange,
  resultCount,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  value: Filters
  onChange: (next: Filters) => void
  resultCount: number
}) {
  const t = useTranslations('agents')
  const tc = useTranslations('common')
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent heading={t('filters')} closeLabel={tc('close')}>
        <AgentFilters layout="sheet" value={value} onChange={onChange} />
        <div className="bottom-0 -mx-5 mt-6 gap-2 px-5 py-3 sticky flex border-t border-border bg-surface">
          <Button
            variant="outline"
            onClick={() =>
              onChange({ ...value, ranks: [], attributes: [], specialties: [], sort: 'newest' })
            }
          >
            {t('clearAll')}
          </Button>
          <Button
            className="flex-1"
            aria-disabled={resultCount === 0 || undefined}
            onClick={() => resultCount > 0 && onOpenChange(false)}
          >
            {t('showResults', { count: resultCount })}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

/** Removable chips for the filters that are on (below lg, under the toolbar). */
export function ActiveFilters({
  value,
  onChange,
  className,
}: {
  value: Filters
  onChange: (next: Filters) => void
  className?: string
}) {
  const t = useTranslations('agents')
  const locale = useLocale() as Locale
  if (traitFilterCount(value) === 0) return null

  const chips = [
    ...value.ranks.map((r) => ({
      key: `rank-${r}`,
      label: t(r === 'S' ? 'rankS' : 'rankA'),
      icon: undefined,
      remove: () => onChange({ ...value, ranks: value.ranks.filter((x) => x !== r) }),
    })),
    ...value.attributes.map((id) => ({
      key: `attr-${id}`,
      label: attributesById.get(id)?.name[locale] ?? id,
      icon: attributeIcon(id),
      remove: () => onChange({ ...value, attributes: value.attributes.filter((x) => x !== id) }),
    })),
    ...value.specialties.map((id) => ({
      key: `spec-${id}`,
      label: specialtiesById.get(id)?.name[locale] ?? id,
      icon: specialtyIcon(id),
      remove: () => onChange({ ...value, specialties: value.specialties.filter((x) => x !== id) }),
    })),
  ]
  return (
    <div className={cn('-mx-4 gap-2 px-4 pb-1 flex items-center overflow-x-auto', className)}>
      {chips.map((chip) => (
        <FilterChip
          key={chip.key}
          pressed
          toggle={false}
          onClick={chip.remove}
          icon={chip.icon}
          aria-label={t('removeFilter', { name: chip.label })}
        >
          {chip.label}
          <X className="size-3.5" aria-hidden />
        </FilterChip>
      ))}
      <Button
        variant="ghost"
        size="sm"
        className="shrink-0"
        onClick={() => onChange({ ...EMPTY_FILTERS, query: value.query, view: value.view })}
      >
        {t('clearAll')}
      </Button>
    </div>
  )
}
