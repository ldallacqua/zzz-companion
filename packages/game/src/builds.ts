import type { BuildInput } from '@zzz/core'

/**
 * Recommended builds (ADR 0015), one per Agent, compiled from each Agent's community build guide
 * (linked in `sources`; `updated` = the game version the guide's picks last changed in) and
 * cross-checked against the item effects on the wiki. Every build was reviewed for
 * `BUILDS_REVIEWED_FOR`; bump it after re-checking them all for a new version.
 *
 * Lists are in priority order. Priorities are groups: [['crit-rate', 'crit-dmg'], ['atk-pct']]
 * reads "CRIT Rate = CRIT DMG > ATK%".
 *
 * Updating a build: edit its entry, set `updated` to the current version, and run
 * `pnpm --filter @zzz/game test`.
 */
export const BUILDS_REVIEWED_FOR = '3.3'

const guide = (slug: string) => ({
  label: 'Prydwen.gg',
  url: `https://www.prydwen.gg/zenless/characters/${slug}`,
})

export const builds: BuildInput[] = [
  {
    agent: 'alice',
    updated: '2.1',
    sources: [guide('alice')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'practiced-perfection', phase: 1 },
          { id: 'sharpened-stinger', phase: 1 },
          { id: 'fusion-compiler', phase: 1 },
          { id: 'weeping-gemini', phase: 5 },
          { id: 'electro-lip-gloss', phase: 5 },
        ],
        discs: [
          {
            four: 'fanged-metal',
            two: [['phaethons-melody'], ['puffer-electro'], ['freedom-blues', 'chaos-jazz']],
          },
          {
            four: 'hormone-punk',
            two: [['phaethons-melody'], ['puffer-electro'], ['freedom-blues', 'chaos-jazz']],
          },
        ],
        main: {
          '4': [['anomaly-proficiency'], ['atk-pct']],
          '5': [['pen-ratio'], ['physical-dmg'], ['atk-pct']],
          '6': [['anomaly-mastery']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['basic', 'chain', 'special', 'dodge', 'assist'],
      },
    ],
  },
  {
    agent: 'anby',
    updated: '2.0',
    sources: [guide('anby-demara')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'hellfire-gears', phase: 1 },
          { id: 'steam-oven', phase: 5 },
          { id: 'precious-fossilized-core', phase: 5 },
          { id: 'the-restrained', phase: 1 },
          { id: 'demara-battery-mark-ii', phase: 5 },
        ],
        discs: [
          { four: 'king-of-the-summit', two: [['shockstar-disco'], ['swing-jazz']] },
          {
            four: 'astral-voice',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz']],
          },
          {
            four: 'proto-punk',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz']],
          },
        ],
        main: {
          '4': [['crit-rate', 'crit-dmg']],
          '5': [['electric-dmg'], ['atk-pct']],
          '6': [['impact']],
        },
        substats: [['crit-rate', 'crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['special', 'basic', 'chain', 'dodge', 'assist'],
      },
    ],
  },
  {
    agent: 'anton',
    updated: '1.5',
    sources: [guide('anton')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'zanshin-herb-case', phase: 1 },
          { id: 'the-brimstone', phase: 1 },
          { id: 'street-superstar', phase: 5 },
          { id: 'starlight-engine', phase: 5 },
          { id: 'marcato-desire', phase: 5 },
          { id: 'cannon-rotor', phase: 5 },
          { id: 'gilded-blossom', phase: 5 },
          { id: 'drill-rig-red-axis', phase: 5 },
        ],
        discs: [
          {
            four: 'thunder-metal',
            two: [['woodpecker-electro'], ['hormone-punk'], ['puffer-electro']],
          },
          {
            four: 'puffer-electro',
            two: [['woodpecker-electro'], ['hormone-punk'], ['thunder-metal']],
          },
          {
            four: 'woodpecker-electro',
            two: [['puffer-electro'], ['hormone-punk'], ['thunder-metal']],
          },
        ],
        main: { '4': [['crit-rate', 'crit-dmg']], '5': [['electric-dmg']], '6': [['atk-pct']] },
        substats: [['crit-rate', 'crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['chain', 'basic', 'special', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'aria',
    updated: '2.6',
    sources: [guide('aria')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'angel-in-the-shell', phase: 1 },
          { id: 'flight-of-fancy', phase: 1 },
          { id: 'electro-lip-gloss', phase: 5 },
          { id: 'weeping-gemini', phase: 5 },
          { id: 'fusion-compiler', phase: 1 },
        ],
        discs: [
          {
            four: 'phaethons-melody',
            two: [
              ['freedom-blues', 'chaos-jazz'],
              ['shining-aria', 'chaotic-metal'],
            ],
          },
          { four: 'shining-aria', two: [['phaethons-melody'], ['freedom-blues', 'chaos-jazz']] },
        ],
        main: {
          '4': [['anomaly-proficiency']],
          '5': [['ether-dmg', 'atk-pct'], ['pen-ratio']],
          '6': [['anomaly-mastery']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['basic', 'assist', 'special', 'chain', 'dodge'],
      },
    ],
  },
  {
    agent: 'astra',
    updated: '2.2',
    sources: [guide('astra-yao')],
    variants: [
      {
        id: 'standard',
        name: { en: 'Standard', 'pt-BR': 'Padrão' },
        wEngines: [
          { id: 'elegant-vanity', phase: 1 },
          { id: 'bashful-demon', phase: 5 },
          { id: 'kaboom-the-cannon', phase: 5 },
          { id: 'the-vault', phase: 5 },
        ],
        discs: [
          { four: 'astral-voice', two: [['swing-jazz', 'moonlight-lullaby'], ['hormone-punk']] },
          { four: 'moonlight-lullaby', two: [['swing-jazz'], ['hormone-punk', 'astral-voice']] },
        ],
        main: { '4': [['atk-pct']], '5': [['atk-pct']], '6': [['energy-regen', 'atk-pct']] },
        substats: [['atk-pct'], ['atk'], ['anomaly-proficiency'], ['pen']],
        skills: ['special', 'chain', 'assist', 'dodge', 'basic'],
      },
      {
        id: 'crit',
        name: { en: 'CRIT', 'pt-BR': 'CRIT' },
        wEngines: [
          { id: 'elegant-vanity', phase: 1 },
          { id: 'bashful-demon', phase: 5 },
          { id: 'kaboom-the-cannon', phase: 5 },
          { id: 'the-vault', phase: 5 },
        ],
        discs: [
          { four: 'astral-voice', two: [['swing-jazz', 'moonlight-lullaby'], ['hormone-punk']] },
          { four: 'moonlight-lullaby', two: [['swing-jazz'], ['hormone-punk', 'astral-voice']] },
        ],
        main: { '4': [['atk-pct']], '5': [['atk-pct']], '6': [['energy-regen', 'atk-pct']] },
        substats: [['atk-pct'], ['atk'], ['crit-rate', 'crit-dmg'], ['pen']],
        skills: ['special', 'chain', 'assist', 'dodge', 'basic'],
      },
    ],
  },
  {
    agent: 'banyue',
    updated: '2.4',
    sources: [guide('banyue')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'wrathful-vajra', phase: 1 },
          { id: 'qingming-birdcage', phase: 1 },
          { id: 'cauldron-of-clarity', phase: 5 },
          { id: 'grill-owisp', phase: 5 },
          { id: 'puzzle-sphere', phase: 5 },
          { id: 'radiowave-journey', phase: 5 },
        ],
        discs: [{ four: 'yunkui-tales', two: [['woodpecker-electro'], ['branch-and-blade-song']] }],
        main: {
          '4': [['crit-dmg'], ['crit-rate']],
          '5': [['fire-dmg'], ['hp-pct']],
          '6': [['hp-pct']],
        },
        substats: [['crit-rate', 'crit-dmg'], ['hp-pct'], ['atk-pct'], ['hp']],
        skills: ['chain', 'special', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'ben',
    updated: '2.6',
    sources: [guide('ben')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'tremor-trigram-vessel', phase: 5 },
          { id: 'cloudcleave-radiance', phase: 1 },
          { id: 'hailstorm-shrine', phase: 1 },
          { id: 'severed-innocence', phase: 1 },
          { id: 'heartstring-nocturne', phase: 1 },
        ],
        discs: [
          {
            four: 'inferno-metal',
            two: [
              ['woodpecker-electro'],
              ['branch-and-blade-song'],
              ['astral-voice', 'hormone-punk'],
            ],
          },
          {
            four: 'woodpecker-electro',
            two: [['branch-and-blade-song'], ['inferno-metal'], ['astral-voice', 'hormone-punk']],
          },
          {
            four: 'puffer-electro',
            two: [['woodpecker-electro'], ['branch-and-blade-song'], ['inferno-metal']],
          },
        ],
        main: {
          '4': [['crit-rate', 'crit-dmg']],
          '5': [['fire-dmg', 'pen-ratio']],
          '6': [['atk-pct']],
        },
        substats: [['crit-rate', 'crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['chain', 'special', 'assist', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'billy',
    updated: '2.8',
    sources: [guide('billy-kid')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'the-brimstone', phase: 5 },
          { id: 'cloudcleave-radiance', phase: 1 },
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'steel-cushion', phase: 1 },
          { id: 'starlight-engine-replica', phase: 5 },
          { id: 'starlight-engine', phase: 5 },
          { id: 'street-superstar', phase: 5 },
          { id: 'cannon-rotor', phase: 5 },
          { id: 'gilded-blossom', phase: 5 },
        ],
        discs: [
          {
            four: 'woodpecker-electro',
            two: [['branch-and-blade-song'], ['hormone-punk', 'astral-voice'], ['puffer-electro']],
          },
          {
            four: 'shadow-harmony',
            two: [['woodpecker-electro'], ['branch-and-blade-song'], ['puffer-electro']],
          },
          {
            four: 'puffer-electro',
            two: [
              ['woodpecker-electro'],
              ['branch-and-blade-song'],
              ['hormone-punk', 'astral-voice'],
            ],
          },
        ],
        main: {
          '4': [['crit-rate', 'crit-dmg']],
          '5': [['pen-ratio', 'atk-pct'], ['physical-dmg']],
          '6': [['atk-pct']],
        },
        substats: [['crit-rate', 'crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['chain', 'special', 'dodge', 'basic', 'assist'],
      },
    ],
  },
  {
    agent: 'burnice',
    updated: '2.5',
    sources: [guide('burnice')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'flamemaker-shaker', phase: 1 },
          { id: 'practiced-perfection', phase: 1 },
          { id: 'electro-lip-gloss', phase: 5 },
          { id: 'weeping-gemini', phase: 5 },
        ],
        discs: [
          { four: 'freedom-blues', two: [['swing-jazz', 'moonlight-lullaby']] },
          { four: 'chaos-jazz', two: [['swing-jazz', 'moonlight-lullaby']] },
        ],
        main: {
          '4': [['anomaly-proficiency']],
          '5': [['pen-ratio', 'fire-dmg']],
          '6': [['anomaly-mastery']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['special', 'chain', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'caesar',
    updated: '2.0',
    sources: [guide('caesar')],
    variants: [
      {
        id: 'crit',
        name: { en: 'CRIT', 'pt-BR': 'CRIT' },
        wEngines: [
          { id: 'tusks-of-fury', phase: 1 },
          { id: 'original-transmorpher', phase: 5 },
          { id: 'spring-embrace', phase: 5 },
          { id: 'peacekeeper-specialized', phase: 5 },
        ],
        discs: [
          {
            four: 'astral-voice',
            two: [['shockstar-disco'], ['king-of-the-summit'], ['proto-punk']],
          },
          { four: 'proto-punk', two: [['shockstar-disco'], ['king-of-the-summit']] },
          {
            four: 'freedom-blues',
            two: [['shockstar-disco'], ['king-of-the-summit'], ['proto-punk']],
          },
        ],
        main: {
          '4': [['crit-rate']],
          '5': [['physical-dmg'], ['atk-pct', 'pen-ratio']],
          '6': [['impact']],
        },
        substats: [['crit-rate', 'crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['assist', 'special', 'basic', 'dodge', 'chain'],
      },
      {
        id: 'anomaly',
        name: { en: 'Anomaly', 'pt-BR': 'Anomalia' },
        wEngines: [
          { id: 'tusks-of-fury', phase: 1 },
          { id: 'original-transmorpher', phase: 5 },
          { id: 'spring-embrace', phase: 5 },
          { id: 'peacekeeper-specialized', phase: 5 },
        ],
        discs: [
          {
            four: 'astral-voice',
            two: [['shockstar-disco'], ['king-of-the-summit'], ['proto-punk']],
          },
          { four: 'proto-punk', two: [['shockstar-disco'], ['king-of-the-summit']] },
          {
            four: 'freedom-blues',
            two: [['shockstar-disco'], ['king-of-the-summit'], ['proto-punk']],
          },
        ],
        main: {
          '4': [['anomaly-proficiency']],
          '5': [['physical-dmg'], ['atk-pct', 'pen-ratio']],
          '6': [['impact']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['assist', 'special', 'basic', 'dodge', 'chain'],
      },
    ],
  },
  {
    agent: 'cissia',
    updated: '2.7',
    sources: [guide('cissia')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'serpentine-seeker', phase: 1 },
          { id: 'bellicose-blaze', phase: 1 },
          { id: 'drill-rig-red-axis', phase: 5 },
          { id: 'cordis-germina', phase: 1 },
          { id: 'severed-innocence', phase: 1 },
        ],
        discs: [
          {
            four: 'astral-voice',
            two: [
              ['swing-jazz', 'moonlight-lullaby'],
              ['branch-and-blade-song'],
              ['thunder-metal'],
            ],
          },
          {
            four: 'dawns-bloom',
            two: [
              ['swing-jazz', 'moonlight-lullaby'],
              ['branch-and-blade-song'],
              ['astral-voice', 'hormone-punk'],
            ],
          },
          {
            four: 'thunder-metal',
            two: [['swing-jazz', 'moonlight-lullaby'], ['branch-and-blade-song']],
          },
        ],
        main: {
          '4': [['crit-rate'], ['crit-dmg']],
          '5': [['electric-dmg'], ['atk-pct']],
          '6': [['energy-regen']],
        },
        substats: [['crit-rate', 'crit-dmg', 'atk-pct'], ['pen'], ['atk']],
        skills: ['basic', 'special', 'chain', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'claret',
    updated: '3.2',
    sources: [guide('claret')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'crimson-thirst', phase: 1 },
          { id: 'bloodmarrow-coffer', phase: 5 },
          { id: 'catty-luck', phase: 1 },
        ],
        discs: [
          {
            four: 'thorned-rose',
            two: [['puffer-electro'], ['woodpecker-electro'], ['soul-rock']],
          },
        ],
        main: { '4': [['crit-rate']], '5': [['pen-ratio']], '6': [['def-pct']] },
        substats: [['crit-rate'], ['def-pct'], ['crit-dmg'], ['pen'], ['def']],
        skills: ['special', 'chain', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'corin',
    updated: '2.4',
    sources: [guide('corin')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'cordis-germina', phase: 1 },
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'steel-cushion', phase: 1 },
          { id: 'myriad-eclipse', phase: 1 },
          { id: 'housekeeper', phase: 5 },
          { id: 'starlight-engine', phase: 5 },
        ],
        discs: [
          {
            four: 'puffer-electro',
            two: [['woodpecker-electro'], ['branch-and-blade-song'], ['fanged-metal']],
          },
          {
            four: 'hormone-punk',
            two: [['woodpecker-electro'], ['branch-and-blade-song'], ['fanged-metal']],
          },
        ],
        main: {
          '4': [['crit-rate']],
          '5': [['pen-ratio'], ['atk-pct', 'physical-dmg']],
          '6': [['atk-pct']],
        },
        substats: [['crit-rate', 'crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['chain', 'special', 'assist', 'dodge', 'basic'],
      },
    ],
  },
  {
    agent: 'dialyn',
    updated: '2.4',
    sources: [guide('dialyn')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'yesterday-calls', phase: 1 },
          { id: 'hellfire-gears', phase: 1 },
          { id: 'steam-oven', phase: 5 },
          { id: 'precious-fossilized-core', phase: 5 },
        ],
        discs: [{ four: 'king-of-the-summit', two: [['woodpecker-electro'], ['swing-jazz']] }],
        main: {
          '4': [['crit-rate']],
          '5': [['atk-pct', 'physical-dmg', 'pen-ratio']],
          '6': [['energy-regen']],
        },
        substats: [['crit-rate'], ['crit-dmg', 'atk-pct'], ['pen'], ['atk']],
        skills: ['chain', 'special', 'assist', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'ellen',
    updated: '2.5',
    sources: [guide('ellen')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'deep-sea-visitor', phase: 1 },
          { id: 'myriad-eclipse', phase: 1 },
          { id: 'cordis-germina', phase: 1 },
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'steel-cushion', phase: 1 },
          { id: 'starlight-engine', phase: 5 },
        ],
        discs: [
          {
            four: 'puffer-electro',
            two: [['woodpecker-electro'], ['polar-metal'], ['branch-and-blade-song']],
          },
          {
            four: 'woodpecker-electro',
            two: [['puffer-electro'], ['polar-metal'], ['branch-and-blade-song']],
          },
          {
            four: 'shadow-harmony',
            two: [['puffer-electro'], ['woodpecker-electro'], ['branch-and-blade-song']],
          },
        ],
        main: { '4': [['crit-dmg']], '5': [['pen-ratio'], ['ice-dmg']], '6': [['atk-pct']] },
        substats: [['crit-dmg', 'crit-rate'], ['atk-pct'], ['pen', 'atk']],
        skills: ['chain', 'special', 'basic', 'dodge', 'assist'],
      },
    ],
  },
  {
    agent: 'evelyn',
    updated: '2.4',
    sources: [guide('evelyn')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'severed-innocence', phase: 1 },
          { id: 'cordis-germina', phase: 1 },
          { id: 'starlight-engine', phase: 5 },
          { id: 'steel-cushion', phase: 1 },
        ],
        discs: [
          { four: 'hormone-punk', two: [] },
          { four: 'puffer-electro', two: [] },
          { four: 'astral-voice', two: [] },
        ],
        main: {
          '4': [['atk-pct'], ['crit-dmg']],
          '5': [['pen-ratio'], ['fire-dmg'], ['atk-pct']],
          '6': [['atk-pct']],
        },
        substats: [['crit-rate'], ['crit-dmg', 'atk-pct'], ['pen'], ['atk']],
        skills: ['chain', 'basic', 'special', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'grace',
    updated: '2.5',
    sources: [guide('grace-howard')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'timeweaver', phase: 1 },
          { id: 'practiced-perfection', phase: 1 },
          { id: 'fusion-compiler', phase: 1 },
          { id: 'electro-lip-gloss', phase: 5 },
          { id: 'weeping-gemini', phase: 5 },
        ],
        discs: [
          {
            four: 'thunder-metal',
            two: [['puffer-electro'], ['phaethons-melody'], ['freedom-blues']],
          },
          {
            four: 'chaos-jazz',
            two: [['puffer-electro'], ['phaethons-melody'], ['freedom-blues']],
          },
        ],
        main: {
          '4': [['anomaly-proficiency'], ['atk-pct']],
          '5': [['pen-ratio'], ['electric-dmg', 'atk-pct']],
          '6': [['anomaly-mastery']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['special', 'chain', 'assist', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'harumasa',
    updated: '2.6',
    sources: [guide('harumasa')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'cordis-germina', phase: 1 },
          { id: 'zanshin-herb-case', phase: 1 },
          { id: 'the-brimstone', phase: 1 },
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'severed-innocence', phase: 1 },
          { id: 'starlight-engine', phase: 5 },
        ],
        discs: [
          {
            four: 'thunder-metal',
            two: [['hormone-punk', 'astral-voice'], ['branch-and-blade-song'], ['shadow-harmony']],
          },
          {
            four: 'shadow-harmony',
            two: [
              ['branch-and-blade-song'],
              ['woodpecker-electro'],
              ['astral-voice', 'hormone-punk'],
            ],
          },
        ],
        main: {
          '4': [['atk-pct'], ['crit-dmg', 'crit-rate']],
          '5': [['atk-pct'], ['electric-dmg']],
          '6': [['atk-pct']],
        },
        substats: [['crit-rate'], ['atk-pct'], ['crit-dmg'], ['pen'], ['atk']],
        skills: ['dodge', 'chain', 'special', 'basic', 'assist'],
      },
    ],
  },
  {
    agent: 'hugo',
    updated: '2.4',
    sources: [guide('hugo')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'myriad-eclipse', phase: 1 },
          { id: 'cordis-germina', phase: 1 },
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'steel-cushion', phase: 1 },
          { id: 'marcato-desire', phase: 5 },
        ],
        discs: [
          {
            four: 'hormone-punk',
            two: [['polar-metal'], ['woodpecker-electro'], ['puffer-electro']],
          },
          {
            four: 'puffer-electro',
            two: [['polar-metal'], ['woodpecker-electro'], ['hormone-punk', 'astral-voice']],
          },
        ],
        main: {
          '4': [['crit-dmg'], ['crit-rate']],
          '5': [['ice-dmg'], ['atk-pct', 'pen-ratio']],
          '6': [['atk-pct']],
        },
        substats: [['crit-rate'], ['crit-dmg'], ['atk-pct'], ['atk'], ['pen']],
        skills: ['special', 'chain', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'jane',
    updated: '3.1',
    sources: [guide('jane-doe')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'sharpened-stinger', phase: 5 },
          { id: 'practiced-perfection', phase: 1 },
          { id: 'fusion-compiler', phase: 1 },
          { id: 'weeping-gemini', phase: 5 },
        ],
        discs: [
          {
            four: 'fanged-metal',
            two: [['puffer-electro'], ['phaethons-melody'], ['freedom-blues', 'chaos-jazz']],
          },
        ],
        main: {
          '4': [['anomaly-proficiency']],
          '5': [['pen-ratio'], ['physical-dmg'], ['atk-pct']],
          '6': [['anomaly-mastery']],
        },
        substats: [['anomaly-proficiency', 'atk-pct'], ['pen'], ['atk']],
        skills: ['chain', 'special', 'basic', 'dodge', 'assist'],
      },
    ],
  },
  {
    agent: 'ju-fufu',
    updated: '2.0',
    sources: [guide('ju-fufu')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'roaring-fur-nace', phase: 1 },
          { id: 'blazing-laurel', phase: 1 },
          { id: 'hellfire-gears', phase: 1 },
          { id: 'precious-fossilized-core', phase: 5 },
        ],
        discs: [
          {
            four: 'king-of-the-summit',
            two: [['shockstar-disco'], ['woodpecker-electro'], ['astral-voice', 'hormone-punk']],
          },
          {
            four: 'swing-jazz',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['astral-voice', 'hormone-punk']],
          },
          {
            four: 'proto-punk',
            two: [['king-of-the-summit'], ['astral-voice', 'hormone-punk'], ['swing-jazz']],
          },
        ],
        main: { '4': [['crit-rate', 'atk-pct']], '5': [['atk-pct']], '6': [['impact', 'atk-pct']] },
        substats: [['crit-rate'], ['atk-pct', 'atk'], ['crit-dmg'], ['pen']],
        skills: ['chain', 'special', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'koleda',
    updated: '3.2',
    sources: [guide('koleda')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'hellfire-gears', phase: 5 },
          { id: 'precious-fossilized-core', phase: 5 },
          { id: 'blazing-laurel', phase: 1 },
          { id: 'steam-oven', phase: 5 },
          { id: 'chief-sidekick', phase: 1 },
        ],
        discs: [
          {
            four: 'king-of-the-summit',
            two: [['shockstar-disco'], ['swing-jazz', 'moonlight-lullaby']],
          },
          {
            four: 'astral-voice',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz', 'moonlight-lullaby']],
          },
        ],
        main: {
          '4': [['crit-rate', 'crit-dmg']],
          '5': [['fire-dmg'], ['atk-pct']],
          '6': [['impact']],
        },
        substats: [['crit-rate'], ['crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['special', 'chain', 'assist', 'dodge', 'basic'],
      },
    ],
  },
  {
    agent: 'lighter',
    updated: '2.0',
    sources: [guide('lighter')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'blazing-laurel', phase: 1 },
          { id: 'ice-jade-teapot', phase: 1 },
          { id: 'hellfire-gears', phase: 1 },
          { id: 'precious-fossilized-core', phase: 5 },
          { id: 'the-restrained', phase: 1 },
        ],
        discs: [
          { four: 'king-of-the-summit', two: [['shockstar-disco'], ['swing-jazz']] },
          {
            four: 'astral-voice',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz']],
          },
          {
            four: 'proto-punk',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz']],
          },
        ],
        main: {
          '4': [['crit-rate', 'crit-dmg']],
          '5': [['atk-pct', 'fire-dmg', 'pen-ratio']],
          '6': [['impact']],
        },
        substats: [['crit-rate'], ['crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['basic', 'special', 'chain', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'lucia',
    updated: '2.3',
    sources: [guide('lucia')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'dreamlit-hearth', phase: 1 },
          { id: 'weeping-cradle', phase: 1 },
          { id: 'kaboom-the-cannon', phase: 5 },
          { id: 'unfettered-game-ball', phase: 5 },
        ],
        discs: [{ four: 'moonlight-lullaby', two: [['yunkui-tales']] }],
        main: { '4': [['hp-pct']], '5': [['hp-pct']], '6': [['hp-pct']] },
        substats: [['hp-pct'], ['hp'], ['crit-rate', 'crit-dmg']],
        skills: ['special', 'chain', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'lucy',
    updated: '2.2',
    sources: [guide('lucy')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'kaboom-the-cannon', phase: 5 },
          { id: 'weeping-cradle', phase: 1 },
          { id: 'slice-of-time', phase: 5 },
          { id: 'reverb-mark-ii', phase: 5 },
          { id: 'unfettered-game-ball', phase: 5 },
        ],
        discs: [
          {
            four: 'moonlight-lullaby',
            two: [['puffer-electro'], ['astral-voice', 'hormone-punk'], ['phaethons-melody']],
          },
          {
            four: 'astral-voice',
            two: [['puffer-electro'], ['hormone-punk'], ['phaethons-melody']],
          },
          {
            four: 'swing-jazz',
            two: [['puffer-electro'], ['astral-voice', 'hormone-punk'], ['phaethons-melody']],
          },
        ],
        main: {
          '4': [['atk-pct'], ['crit-rate']],
          '5': [['atk-pct']],
          '6': [['energy-regen', 'atk-pct']],
        },
        substats: [
          ['atk-pct', 'crit-rate', 'crit-dmg'],
          ['pen', 'atk'],
        ],
        skills: ['special', 'chain', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'lycaon',
    updated: '2.6',
    sources: [guide('lycaon')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'blazing-laurel', phase: 1 },
          { id: 'precious-fossilized-core', phase: 5 },
          { id: 'steam-oven', phase: 5 },
          { id: 'hellfire-gears', phase: 1 },
          { id: 'the-restrained', phase: 1 },
        ],
        discs: [
          {
            four: 'king-of-the-summit',
            two: [['shockstar-disco'], ['swing-jazz', 'moonlight-lullaby']],
          },
          {
            four: 'astral-voice',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz', 'moonlight-lullaby']],
          },
          {
            four: 'proto-punk',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz', 'moonlight-lullaby']],
          },
        ],
        main: {
          '4': [['crit-rate', 'crit-dmg']],
          '5': [['ice-dmg'], ['atk-pct']],
          '6': [['impact']],
        },
        substats: [['crit-rate', 'crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['special', 'assist', 'chain', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'manato',
    updated: '2.4',
    sources: [guide('manato')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'grill-owisp', phase: 5 },
          { id: 'wrathful-vajra', phase: 1 },
          { id: 'qingming-birdcage', phase: 1 },
          { id: 'radiowave-journey', phase: 5 },
          { id: 'puzzle-sphere', phase: 5 },
        ],
        discs: [
          {
            four: 'yunkui-tales',
            two: [
              ['woodpecker-electro'],
              ['branch-and-blade-song'],
              ['astral-voice', 'hormone-punk'],
            ],
          },
        ],
        main: {
          '4': [['crit-rate', 'crit-dmg']],
          '5': [['fire-dmg'], ['hp-pct']],
          '6': [['hp-pct']],
        },
        substats: [['crit-rate', 'crit-dmg'], ['hp-pct'], ['hp'], ['atk-pct'], ['atk']],
        skills: ['chain', 'assist', 'basic', 'special', 'dodge'],
      },
    ],
  },
  {
    agent: 'miyabi',
    updated: '2.1',
    sources: [guide('miyabi')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'hailstorm-shrine', phase: 1 },
          { id: 'fusion-compiler', phase: 1 },
          { id: 'electro-lip-gloss', phase: 5 },
          { id: 'rainforest-gourmet', phase: 5 },
          { id: 'weeping-gemini', phase: 5 },
        ],
        discs: [
          {
            four: 'branch-and-blade-song',
            two: [['polar-metal'], ['astral-voice', 'hormone-punk'], ['puffer-electro']],
          },
          {
            four: 'woodpecker-electro',
            two: [['polar-metal'], ['astral-voice', 'hormone-punk'], ['puffer-electro']],
          },
          {
            four: 'polar-metal',
            two: [
              ['woodpecker-electro'],
              ['astral-voice', 'hormone-punk'],
              ['branch-and-blade-song'],
            ],
          },
        ],
        main: {
          '4': [['crit-rate', 'atk-pct']],
          '5': [['ice-dmg', 'atk-pct']],
          '6': [['atk-pct']],
        },
        substats: [
          ['crit-rate', 'crit-dmg', 'atk-pct'],
          ['anomaly-proficiency', 'atk', 'pen'],
        ],
        skills: ['basic', 'chain', 'special', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'nangong-yu',
    updated: '2.7',
    sources: [guide('nangong-yu')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'neon-fantasies', phase: 1 },
          { id: 'hellfire-gears', phase: 1 },
          { id: 'the-simmering-pot', phase: 5 },
          { id: 'precious-fossilized-core', phase: 5 },
          { id: 'roaring-fur-nace', phase: 1 },
        ],
        discs: [
          {
            four: 'phaethons-melody',
            two: [
              ['freedom-blues', 'chaos-jazz'],
              ['shining-aria', 'chaotic-metal'],
              ['astral-voice', 'hormone-punk'],
            ],
          },
          { four: 'freedom-blues', two: [['phaethons-melody']] },
        ],
        main: {
          '4': [['anomaly-proficiency']],
          '5': [['ether-dmg', 'atk-pct'], ['pen-ratio']],
          '6': [['anomaly-mastery']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['special', 'chain', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'nekomata',
    updated: '3.1',
    sources: [guide('nekomata')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'steel-cushion', phase: 1 },
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'cordis-germina', phase: 1 },
          { id: 'severed-innocence', phase: 1 },
          { id: 'starlight-engine', phase: 5 },
        ],
        discs: [
          {
            four: 'woodpecker-electro',
            two: [['puffer-electro'], ['branch-and-blade-song'], ['fanged-metal']],
          },
          {
            four: 'puffer-electro',
            two: [['woodpecker-electro'], ['branch-and-blade-song'], ['fanged-metal']],
          },
        ],
        main: {
          '4': [['crit-rate'], ['crit-dmg', 'atk-pct']],
          '5': [['pen-ratio'], ['atk-pct'], ['physical-dmg']],
          '6': [['atk-pct']],
        },
        substats: [
          ['crit-rate', 'crit-dmg', 'atk-pct'],
          ['pen', 'atk'],
        ],
        skills: ['dodge', 'chain', 'special', 'basic', 'assist'],
      },
    ],
  },
  {
    agent: 'nicole',
    updated: '2.2',
    sources: [guide('nicole-demara')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'the-vault', phase: 5 },
          { id: 'weeping-cradle', phase: 1 },
          { id: 'kaboom-the-cannon', phase: 5 },
          { id: 'slice-of-time', phase: 5 },
          { id: 'reverb-mark-ii', phase: 5 },
          { id: 'unfettered-game-ball', phase: 5 },
        ],
        discs: [
          {
            four: 'moonlight-lullaby',
            two: [
              ['phaethons-melody'],
              ['astral-voice', 'hormone-punk'],
              ['chaos-jazz', 'freedom-blues'],
            ],
          },
          {
            four: 'astral-voice',
            two: [['phaethons-melody'], ['hormone-punk'], ['chaos-jazz', 'freedom-blues']],
          },
          {
            four: 'swing-jazz',
            two: [
              ['phaethons-melody'],
              ['astral-voice', 'hormone-punk'],
              ['chaos-jazz', 'freedom-blues'],
            ],
          },
        ],
        main: {
          '4': [['atk-pct', 'anomaly-proficiency']],
          '5': [['ether-dmg'], ['atk-pct']],
          '6': [['energy-regen', 'atk-pct']],
        },
        substats: [
          ['anomaly-proficiency', 'atk-pct'],
          ['pen', 'atk'],
        ],
        skills: ['chain', 'special', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'norma',
    updated: '3.0',
    sources: [guide('norma')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'chief-sidekick', phase: 1 },
          { id: 'hellfire-gears', phase: 5 },
          { id: 'steam-oven', phase: 5 },
          { id: 'blazing-laurel', phase: 1 },
          { id: 'the-simmering-pot', phase: 5 },
        ],
        discs: [
          {
            four: 'king-of-the-summit',
            two: [['swing-jazz', 'moonlight-lullaby'], ['woodpecker-electro']],
          },
          {
            four: 'astral-voice',
            two: [['swing-jazz', 'moonlight-lullaby'], ['woodpecker-electro']],
          },
        ],
        main: {
          '4': [['crit-rate']],
          '5': [['fire-dmg'], ['pen-ratio'], ['atk-pct']],
          '6': [['energy-regen', 'impact']],
        },
        substats: [['crit-rate'], ['crit-dmg', 'atk-pct'], ['pen'], ['atk']],
        skills: ['special', 'chain', 'assist', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'orphie',
    updated: '2.2',
    sources: [guide('orphie-and-magus')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'bellicose-blaze', phase: 1 },
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'severed-innocence', phase: 1 },
          { id: 'myriad-eclipse', phase: 1 },
          { id: 'cordis-germina', phase: 1 },
          { id: 'gilded-blossom', phase: 5 },
          { id: 'marcato-desire', phase: 5 },
        ],
        discs: [
          { four: 'shadow-harmony', two: [['swing-jazz'], ['moonlight-lullaby']] },
          { four: 'astral-voice', two: [['swing-jazz'], ['moonlight-lullaby']] },
        ],
        main: {
          '4': [['crit-dmg', 'crit-rate']],
          '5': [['fire-dmg', 'atk-pct']],
          '6': [['energy-regen', 'atk-pct']],
        },
        substats: [['crit-dmg', 'crit-rate'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['special', 'chain', 'assist', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'pan-yinhu',
    updated: '2.0',
    sources: [guide('pan-yinhu')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'tusks-of-fury', phase: 1 },
          { id: 'tremor-trigram-vessel', phase: 5 },
          { id: 'spring-embrace', phase: 5 },
          { id: 'peacekeeper-specialized', phase: 5 },
        ],
        discs: [
          { four: 'astral-voice', two: [['hormone-punk'], ['swing-jazz'], ['fanged-metal']] },
          { four: 'proto-punk', two: [['hormone-punk'], ['swing-jazz'], ['fanged-metal']] },
          { four: 'swing-jazz', two: [['hormone-punk'], ['fanged-metal']] },
        ],
        main: {
          '4': [['crit-rate', 'crit-dmg'], ['atk-pct']],
          '5': [['physical-dmg'], ['atk-pct']],
          '6': [['atk-pct']],
        },
        substats: [['atk-pct', 'atk'], ['crit-rate', 'crit-dmg'], ['pen']],
        skills: ['chain', 'assist', 'special', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'phoenix',
    updated: '3.3',
    sources: [guide('phoenix')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'plume-of-rebirth', phase: 1 },
          { id: 'angel-in-the-shell', phase: 1 },
          { id: 'electro-lip-gloss', phase: 5 },
          { id: 'flight-of-fancy', phase: 1 },
          { id: 'weeping-gemini', phase: 5 },
        ],
        discs: [
          { four: 'freedom-blues', two: [['phaethons-melody']] },
          { four: 'chaos-jazz', two: [['phaethons-melody']] },
          { four: 'feathered-fate', two: [['phaethons-melody']] },
        ],
        main: {
          '4': [['anomaly-proficiency']],
          '5': [['fire-dmg'], ['pen-ratio'], ['atk-pct']],
          '6': [['anomaly-mastery']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['basic', 'chain', 'assist', 'special', 'dodge'],
      },
    ],
  },
  {
    agent: 'piper',
    updated: '2.4',
    sources: [guide('piper')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'practiced-perfection', phase: 1 },
          { id: 'sharpened-stinger', phase: 1 },
          { id: 'weeping-gemini', phase: 5 },
          { id: 'roaring-ride', phase: 5 },
          { id: 'electro-lip-gloss', phase: 5 },
        ],
        discs: [
          {
            four: 'fanged-metal',
            two: [['phaethons-melody'], ['puffer-electro'], ['chaos-jazz', 'freedom-blues']],
          },
        ],
        main: {
          '4': [['anomaly-proficiency']],
          '5': [['pen-ratio', 'atk-pct', 'physical-dmg']],
          '6': [['anomaly-mastery']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['pen', 'atk']],
        skills: ['special', 'assist', 'chain', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'promeia',
    updated: '2.8',
    sources: [guide('promeia')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'frostfall-sickle', phase: 1 },
          { id: 'fusion-compiler', phase: 5 },
          { id: 'angel-in-the-shell', phase: 1 },
          { id: 'electro-lip-gloss', phase: 5 },
          { id: 'weeping-gemini', phase: 5 },
        ],
        discs: [
          {
            four: 'notes-from-the-chained',
            two: [
              ['phaethons-melody'],
              ['freedom-blues', 'chaos-jazz'],
              ['astral-voice', 'hormone-punk'],
            ],
          },
        ],
        main: {
          '4': [['anomaly-proficiency']],
          '5': [['ice-dmg', 'atk-pct'], ['pen-ratio']],
          '6': [['anomaly-mastery']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['special', 'chain', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'pulchra',
    updated: '1.6',
    sources: [guide('pulchra')],
    variants: [
      {
        id: 'anomaly',
        name: { en: 'Anomaly', 'pt-BR': 'Anomalia' },
        wEngines: [
          { id: 'blazing-laurel', phase: 1 },
          { id: 'box-cutter', phase: 5 },
          { id: 'steam-oven', phase: 5 },
          { id: 'hellfire-gears', phase: 1 },
          { id: 'precious-fossilized-core', phase: 5 },
          { id: 'vortex-arrow', phase: 5 },
          { id: 'six-shooter', phase: 5 },
        ],
        discs: [
          { four: 'king-of-the-summit', two: [['shockstar-disco'], ['swing-jazz']] },
          {
            four: 'astral-voice',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz']],
          },
          {
            four: 'proto-punk',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz']],
          },
        ],
        main: {
          '4': [['anomaly-proficiency']],
          '5': [['atk-pct', 'physical-dmg']],
          '6': [['impact']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['special', 'chain', 'assist', 'basic', 'dodge'],
      },
      {
        id: 'crit',
        name: { en: 'CRIT', 'pt-BR': 'CRIT' },
        wEngines: [
          { id: 'blazing-laurel', phase: 1 },
          { id: 'box-cutter', phase: 5 },
          { id: 'steam-oven', phase: 5 },
          { id: 'hellfire-gears', phase: 1 },
          { id: 'precious-fossilized-core', phase: 5 },
          { id: 'vortex-arrow', phase: 5 },
          { id: 'six-shooter', phase: 5 },
        ],
        discs: [
          { four: 'king-of-the-summit', two: [['shockstar-disco'], ['swing-jazz']] },
          {
            four: 'astral-voice',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz']],
          },
          {
            four: 'proto-punk',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz']],
          },
        ],
        main: {
          '4': [['crit-rate', 'crit-dmg']],
          '5': [['atk-pct', 'physical-dmg']],
          '6': [['impact']],
        },
        substats: [['crit-rate', 'crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['special', 'chain', 'assist', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'pyrois',
    updated: '3.0',
    sources: [guide('pyrois')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'sol-exuvia', phase: 1 },
          { id: 'cordis-germina', phase: 1 },
        ],
        discs: [
          {
            four: 'the-sky-ablaze',
            two: [['puffer-electro'], ['branch-and-blade-song'], ['chaotic-metal', 'shining-aria']],
          },
          {
            four: 'puffer-electro',
            two: [['branch-and-blade-song'], ['astral-voice', 'hormone-punk']],
          },
        ],
        main: {
          '4': [['crit-rate'], ['crit-dmg']],
          '5': [['pen-ratio'], ['ether-dmg'], ['atk-pct']],
          '6': [['atk-pct']],
        },
        substats: [['crit-rate'], ['crit-dmg', 'atk-pct'], ['pen'], ['atk']],
        skills: ['chain', 'basic', 'special', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'qingyi',
    updated: '1.5',
    sources: [guide('qingyi')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'ice-jade-teapot', phase: 1 },
          { id: 'the-restrained', phase: 1 },
          { id: 'steam-oven', phase: 5 },
          { id: 'precious-fossilized-core', phase: 5 },
        ],
        discs: [
          { four: 'king-of-the-summit', two: [['shockstar-disco'], ['swing-jazz']] },
          {
            four: 'astral-voice',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz']],
          },
          {
            four: 'proto-punk',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz']],
          },
        ],
        main: {
          '4': [['crit-rate', 'crit-dmg']],
          '5': [['electric-dmg'], ['atk-pct']],
          '6': [['impact']],
        },
        substats: [['crit-rate'], ['crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['basic', 'special', 'chain', 'dodge', 'assist'],
      },
    ],
  },
  {
    agent: 'remielle',
    updated: '3.1',
    sources: [guide('remielle')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'ode-of-resurrected-wings', phase: 1 },
          { id: 'weeping-gemini', phase: 5 },
        ],
        discs: [
          {
            four: 'feathered-fate',
            two: [
              ['freedom-blues', 'chaos-jazz'],
              ['astral-voice', 'hormone-punk'],
            ],
          },
        ],
        main: { '4': [['anomaly-proficiency']], '5': [['atk-pct']], '6': [['atk-pct']] },
        substats: [['atk-pct'], ['anomaly-proficiency'], ['pen']],
        skills: ['chain', 'basic', 'assist', 'special', 'dodge'],
      },
    ],
  },
  {
    agent: 'rina',
    updated: '3.1',
    sources: [guide('rina')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'weeping-cradle', phase: 1 },
          { id: 'kaboom-the-cannon', phase: 5 },
        ],
        discs: [{ four: 'moonlight-lullaby', two: [['puffer-electro']] }],
        main: {
          '4': [['atk-pct', 'anomaly-proficiency', 'crit-rate']],
          '5': [['pen-ratio']],
          '6': [['energy-regen']],
        },
        substats: [['anomaly-proficiency', 'crit-rate', 'atk-pct'], ['crit-dmg'], ['pen'], ['atk']],
        skills: ['chain', 'special', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'roxy',
    updated: '3.2',
    sources: [guide('roxy')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'crimson-moon-casket', phase: 1 },
          { id: 'steam-oven', phase: 5 },
          { id: 'hellfire-gears', phase: 1 },
        ],
        discs: [
          { four: 'king-of-the-summit', two: [['moonlight-lullaby', 'swing-jazz']] },
          { four: 'astral-voice', two: [['moonlight-lullaby', 'swing-jazz']] },
        ],
        main: {
          '4': [['crit-rate']],
          '5': [['pen-ratio'], ['wind-dmg', 'atk-pct']],
          '6': [['energy-regen']],
        },
        substats: [['crit-rate'], ['crit-dmg'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['special', 'chain', 'assist', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'seed',
    updated: '2.2',
    sources: [guide('seed')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'cordis-germina', phase: 1 },
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'myriad-eclipse', phase: 1 },
          { id: 'zanshin-herb-case', phase: 1 },
          { id: 'riot-suppressor-mark-vi', phase: 1 },
          { id: 'the-brimstone', phase: 1 },
          { id: 'marcato-desire', phase: 5 },
        ],
        discs: [
          {
            four: 'dawns-bloom',
            two: [['woodpecker-electro'], ['branch-and-blade-song'], ['puffer-electro']],
          },
          {
            four: 'woodpecker-electro',
            two: [['branch-and-blade-song'], ['puffer-electro'], ['dawns-bloom']],
          },
          {
            four: 'hormone-punk',
            two: [['woodpecker-electro'], ['branch-and-blade-song'], ['dawns-bloom']],
          },
        ],
        main: {
          '4': [['crit-dmg'], ['crit-rate']],
          '5': [['pen-ratio', 'atk-pct', 'electric-dmg']],
          '6': [['atk-pct']],
        },
        substats: [['crit-dmg', 'crit-rate'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['basic', 'chain', 'special', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'seth',
    updated: '1.5',
    sources: [guide('seth')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'peacekeeper-specialized', phase: 5 },
          { id: 'spring-embrace', phase: 5 },
          { id: 'bunny-band', phase: 5 },
          { id: 'original-transmorpher', phase: 5 },
        ],
        discs: [
          { four: 'astral-voice', two: [['swing-jazz'], ['freedom-blues', 'chaos-jazz']] },
          { four: 'swing-jazz', two: [['hormone-punk', 'proto-punk'], ['shockstar-disco']] },
          { four: 'proto-punk', two: [['swing-jazz'], ['hormone-punk'], ['shockstar-disco']] },
        ],
        main: {
          '4': [['atk-pct', 'anomaly-proficiency']],
          '5': [['atk-pct', 'electric-dmg']],
          '6': [['energy-regen', 'anomaly-mastery']],
        },
        substats: [['atk-pct'], ['anomaly-proficiency'], ['atk'], ['pen']],
        skills: ['chain', 'special', 'assist', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'severian',
    updated: '3.3',
    sources: [guide('severian')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'incarcerating-grip', phase: 1 },
          { id: 'cordis-germina', phase: 1 },
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'sol-exuvia', phase: 1 },
          { id: 'the-brimstone', phase: 1 },
          { id: 'starlight-engine', phase: 5 },
        ],
        discs: [
          {
            four: 'dawns-bloom',
            two: [['puffer-electro'], ['branch-and-blade-song'], ['wuthering-salon']],
          },
          { four: 'woodpecker-electro', two: [['puffer-electro']] },
          { four: 'hormone-punk', two: [['puffer-electro']] },
        ],
        main: { '4': [['crit-rate']], '5': [['pen-ratio']], '6': [['atk-pct']] },
        substats: [['crit-rate'], ['crit-dmg'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['basic', 'chain', 'assist', 'special', 'dodge'],
      },
    ],
  },
  {
    agent: 'sigrid',
    updated: '3.1',
    sources: [guide('sigrid')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'knights-extolment', phase: 1 },
          { id: 'the-brimstone', phase: 5 },
          { id: 'severed-innocence', phase: 1 },
          { id: 'starlight-engine', phase: 5 },
        ],
        discs: [
          { four: 'hormone-punk', two: [['puffer-electro']] },
          {
            four: 'puffer-electro',
            two: [['branch-and-blade-song'], ['astral-voice', 'hormone-punk'], ['polar-metal']],
          },
          { four: 'dawns-bloom', two: [['puffer-electro']] },
        ],
        main: { '4': [['crit-dmg'], ['atk-pct']], '5': [['pen-ratio']], '6': [['atk-pct']] },
        substats: [['crit-rate'], ['crit-dmg', 'atk-pct'], ['pen'], ['atk']],
        skills: ['basic', 'chain', 'special', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'soldier-0-anby',
    updated: '2.5',
    sources: [guide('anby-demara-soldier-0')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'severed-innocence', phase: 1 },
          { id: 'cordis-germina', phase: 1 },
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'marcato-desire', phase: 5 },
          { id: 'starlight-engine', phase: 5 },
        ],
        discs: [
          {
            four: 'shadow-harmony',
            two: [['woodpecker-electro'], ['hormone-punk', 'astral-voice'], ['thunder-metal']],
          },
        ],
        main: {
          '4': [['crit-rate', 'crit-dmg']],
          '5': [['electric-dmg'], ['atk-pct']],
          '6': [['atk-pct']],
        },
        substats: [['crit-rate', 'crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['special', 'chain', 'basic', 'dodge', 'assist'],
      },
    ],
  },
  {
    agent: 'soldier-11',
    updated: '2.5',
    sources: [guide('soldier-11')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'heartstring-nocturne', phase: 1 },
          { id: 'cordis-germina', phase: 1 },
          { id: 'myriad-eclipse', phase: 1 },
          { id: 'severed-innocence', phase: 1 },
          { id: 'the-brimstone', phase: 1 },
          { id: 'starlight-engine', phase: 5 },
        ],
        discs: [
          {
            four: 'puffer-electro',
            two: [
              ['woodpecker-electro'],
              ['astral-voice', 'hormone-punk'],
              ['branch-and-blade-song'],
            ],
          },
          {
            four: 'woodpecker-electro',
            two: [['puffer-electro'], ['inferno-metal'], ['branch-and-blade-song']],
          },
          {
            four: 'dawns-bloom',
            two: [
              ['woodpecker-electro'],
              ['astral-voice', 'hormone-punk'],
              ['branch-and-blade-song'],
            ],
          },
        ],
        main: {
          '4': [['crit-rate', 'atk-pct', 'crit-dmg']],
          '5': [['pen-ratio', 'atk-pct'], ['fire-dmg']],
          '6': [['atk-pct']],
        },
        substats: [
          ['crit-rate', 'crit-dmg'],
          ['atk-pct'],
          ['anomaly-proficiency'],
          ['pen'],
          ['atk'],
        ],
        skills: ['basic', 'chain', 'special', 'dodge', 'assist'],
      },
    ],
  },
  {
    agent: 'soukaku',
    updated: '2.2',
    sources: [guide('soukaku')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'bashful-demon', phase: 5 },
          { id: 'weeping-cradle', phase: 1 },
          { id: 'kaboom-the-cannon', phase: 5 },
          { id: 'slice-of-time', phase: 5 },
          { id: 'reverb-mark-ii', phase: 5 },
          { id: 'unfettered-game-ball', phase: 5 },
        ],
        discs: [
          {
            four: 'freedom-blues',
            two: [['phaethons-melody'], ['astral-voice', 'hormone-punk'], ['chaos-jazz']],
          },
          {
            four: 'moonlight-lullaby',
            two: [
              ['phaethons-melody'],
              ['astral-voice', 'hormone-punk'],
              ['chaos-jazz', 'freedom-blues'],
            ],
          },
          {
            four: 'astral-voice',
            two: [['phaethons-melody'], ['hormone-punk'], ['chaos-jazz', 'freedom-blues']],
          },
        ],
        main: {
          '4': [['atk-pct'], ['crit-rate']],
          '5': [['atk-pct'], ['ice-dmg']],
          '6': [['energy-regen', 'atk-pct']],
        },
        substats: [
          ['atk-pct', 'crit-rate', 'crit-dmg'],
          ['pen', 'atk'],
        ],
        skills: ['special', 'chain', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'starlight-billy',
    updated: '2.8',
    sources: [guide('billy-starlight')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'starlight-rider-faceplate', phase: 1 },
          { id: 'qingming-birdcage', phase: 1 },
          { id: 'cauldron-of-clarity', phase: 5 },
          { id: 'steel-cushion', phase: 1 },
          { id: 'grill-owisp', phase: 5 },
          { id: 'puzzle-sphere', phase: 5 },
          { id: 'radiowave-journey', phase: 5 },
        ],
        discs: [
          {
            four: 'yunkui-tales',
            two: [
              ['woodpecker-electro'],
              ['branch-and-blade-song'],
              ['fanged-metal', 'white-water-ballad'],
            ],
          },
        ],
        main: {
          '4': [['crit-rate', 'crit-dmg', 'hp-pct']],
          '5': [['physical-dmg'], ['hp-pct']],
          '6': [['hp-pct']],
        },
        substats: [['crit-rate'], ['crit-dmg', 'hp-pct'], ['hp'], ['atk']],
        skills: ['chain', 'special', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'sunna',
    updated: '2.6',
    sources: [guide('sunna')],
    variants: [
      {
        id: 'standard',
        name: { en: 'Standard', 'pt-BR': 'Padrão' },
        wEngines: [
          { id: 'thoughtbop', phase: 1 },
          { id: 'weeping-cradle', phase: 1 },
          { id: 'kaboom-the-cannon', phase: 5 },
          { id: 'unfettered-game-ball', phase: 5 },
        ],
        discs: [
          { four: 'moonlight-lullaby', two: [['swing-jazz'], ['astral-voice', 'hormone-punk']] },
        ],
        main: { '4': [['atk-pct']], '5': [['atk-pct']], '6': [['energy-regen']] },
        substats: [['atk-pct'], ['atk'], ['anomaly-proficiency'], ['pen']],
        skills: ['special', 'chain', 'assist', 'basic', 'dodge'],
      },
      {
        id: 'crit',
        name: { en: 'CRIT', 'pt-BR': 'CRIT' },
        wEngines: [
          { id: 'thoughtbop', phase: 1 },
          { id: 'weeping-cradle', phase: 1 },
          { id: 'kaboom-the-cannon', phase: 5 },
          { id: 'unfettered-game-ball', phase: 5 },
        ],
        discs: [
          { four: 'moonlight-lullaby', two: [['swing-jazz'], ['astral-voice', 'hormone-punk']] },
        ],
        main: { '4': [['atk-pct']], '5': [['atk-pct']], '6': [['energy-regen']] },
        substats: [['atk-pct'], ['atk'], ['crit-rate', 'crit-dmg'], ['pen']],
        skills: ['special', 'chain', 'assist', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'trigger',
    updated: '2.0',
    sources: [guide('trigger')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'spectral-gaze', phase: 1 },
          { id: 'blazing-laurel', phase: 1 },
          { id: 'ice-jade-teapot', phase: 1 },
          { id: 'the-restrained', phase: 1 },
          { id: 'precious-fossilized-core', phase: 5 },
          { id: 'steam-oven', phase: 5 },
          { id: 'hellfire-gears', phase: 1 },
        ],
        discs: [
          { four: 'king-of-the-summit', two: [['shockstar-disco'], ['swing-jazz']] },
          {
            four: 'astral-voice',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz']],
          },
          {
            four: 'proto-punk',
            two: [['king-of-the-summit'], ['shockstar-disco'], ['swing-jazz']],
          },
        ],
        main: { '4': [['crit-rate']], '5': [['electric-dmg'], ['atk-pct']], '6': [['impact']] },
        substats: [['crit-rate', 'crit-dmg'], ['atk-pct'], ['pen', 'atk']],
        skills: ['basic', 'special', 'chain', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'velina',
    updated: '3.0',
    sources: [guide('velina')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'joyau-dore', phase: 1 },
          { id: 'flamemaker-shaker', phase: 1 },
          { id: 'kaboom-the-cannon', phase: 5 },
          { id: 'weeping-gemini', phase: 5 },
          { id: 'boisterous-echoes', phase: 5 },
        ],
        discs: [{ four: 'wuthering-salon', two: [['moonlight-lullaby', 'swing-jazz']] }],
        main: {
          '4': [['anomaly-proficiency']],
          '5': [['pen-ratio'], ['wind-dmg'], ['atk-pct']],
          '6': [['energy-regen']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['special', 'chain', 'assist', 'basic', 'dodge'],
      },
    ],
  },
  {
    agent: 'vivian',
    updated: '2.3',
    sources: [guide('vivian')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'flight-of-fancy', phase: 1 },
          { id: 'weeping-gemini', phase: 5 },
        ],
        discs: [
          {
            four: 'phaethons-melody',
            two: [
              ['chaos-jazz', 'freedom-blues'],
              ['chaotic-metal'],
              ['astral-voice', 'hormone-punk'],
            ],
          },
        ],
        main: {
          '4': [['anomaly-proficiency']],
          '5': [['ether-dmg'], ['pen-ratio', 'atk-pct']],
          '6': [['anomaly-mastery']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['atk', 'pen']],
        skills: ['basic', 'chain', 'special', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'yanagi',
    updated: '2.3',
    sources: [guide('yanagi')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'timeweaver', phase: 1 },
          { id: 'weeping-gemini', phase: 5 },
          { id: 'electro-lip-gloss', phase: 5 },
        ],
        discs: [
          {
            four: 'chaos-jazz',
            two: [['freedom-blues', 'feathered-fate'], ['puffer-electro'], ['thunder-metal']],
          },
          {
            four: 'feathered-fate',
            two: [['freedom-blues', 'chaos-jazz'], ['puffer-electro'], ['thunder-metal']],
          },
          {
            four: 'freedom-blues',
            two: [['chaos-jazz', 'feathered-fate'], ['puffer-electro'], ['thunder-metal']],
          },
        ],
        main: {
          '4': [['anomaly-proficiency']],
          '5': [['pen-ratio', 'electric-dmg'], ['atk-pct']],
          '6': [['anomaly-mastery'], ['atk-pct']],
        },
        substats: [['anomaly-proficiency'], ['atk-pct'], ['pen', 'atk']],
        skills: ['special', 'chain', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'ye-shunguang',
    updated: '2.5',
    sources: [guide('ye-shunguang')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'cloudcleave-radiance', phase: 1 },
          { id: 'the-brimstone', phase: 5 },
          { id: 'severed-innocence', phase: 1 },
          { id: 'starlight-engine', phase: 5 },
        ],
        discs: [
          {
            four: 'white-water-ballad',
            two: [['branch-and-blade-song'], ['puffer-electro'], ['astral-voice', 'hormone-punk']],
          },
        ],
        main: {
          '4': [['atk-pct'], ['crit-dmg']],
          '5': [['pen-ratio', 'atk-pct']],
          '6': [['atk-pct']],
        },
        substats: [['crit-dmg', 'crit-rate'], ['atk-pct'], ['pen'], ['atk']],
        skills: ['basic', 'chain', 'special', 'dodge', 'assist'],
      },
    ],
  },
  {
    agent: 'yidhari',
    updated: '2.5',
    sources: [guide('yidhari')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'krakens-cradle', phase: 1 },
          { id: 'grill-owisp', phase: 5 },
          { id: 'cauldron-of-clarity', phase: 5 },
          { id: 'qingming-birdcage', phase: 1 },
          { id: 'radiowave-journey', phase: 5 },
          { id: 'puzzle-sphere', phase: 5 },
        ],
        discs: [{ four: 'yunkui-tales', two: [['woodpecker-electro'], ['branch-and-blade-song']] }],
        main: {
          '4': [['crit-rate', 'crit-dmg']],
          '5': [['ice-dmg'], ['hp-pct']],
          '6': [['hp-pct']],
        },
        substats: [['crit-rate', 'crit-dmg'], ['hp-pct'], ['atk-pct', 'hp']],
        skills: ['special', 'chain', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'yixuan',
    updated: '2.5',
    sources: [guide('yixuan')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'qingming-birdcage', phase: 1 },
          { id: 'cauldron-of-clarity', phase: 5 },
          { id: 'radiowave-journey', phase: 5 },
          { id: 'puzzle-sphere', phase: 5 },
          { id: 'krakens-cradle', phase: 1 },
          { id: 'grill-owisp', phase: 5 },
        ],
        discs: [{ four: 'yunkui-tales', two: [['woodpecker-electro'], ['branch-and-blade-song']] }],
        main: {
          '4': [['crit-dmg', 'crit-rate']],
          '5': [['ether-dmg'], ['hp-pct']],
          '6': [['hp-pct']],
        },
        substats: [['crit-rate', 'crit-dmg'], ['hp-pct'], ['atk-pct'], ['hp']],
        skills: ['chain', 'special', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'yuzuha',
    updated: '2.6',
    sources: [guide('ukinami-yuzuha')],
    variants: [
      {
        id: 'standard',
        name: { en: 'Standard', 'pt-BR': 'Padrão' },
        wEngines: [
          { id: 'weeping-cradle', phase: 5 },
          { id: 'thoughtbop', phase: 1 },
          { id: 'metanukimorphosis', phase: 1 },
          { id: 'kaboom-the-cannon', phase: 5 },
          { id: 'unfettered-game-ball', phase: 5 },
        ],
        discs: [
          {
            four: 'moonlight-lullaby',
            two: [
              ['phaethons-melody'],
              ['astral-voice', 'hormone-punk'],
              ['chaos-jazz', 'freedom-blues'],
            ],
          },
          {
            four: 'astral-voice',
            two: [['phaethons-melody'], ['hormone-punk'], ['chaos-jazz', 'freedom-blues']],
          },
        ],
        main: {
          '4': [['atk-pct', 'anomaly-proficiency']],
          '5': [['atk-pct', 'pen-ratio']],
          '6': [['anomaly-mastery', 'atk-pct']],
        },
        substats: [['atk-pct'], ['atk'], ['anomaly-proficiency'], ['pen']],
        skills: ['basic', 'chain', 'special', 'assist', 'dodge'],
      },
      {
        id: 'physical',
        name: { en: 'Physical teams', 'pt-BR': 'Equipes de Físico' },
        wEngines: [
          { id: 'weeping-cradle', phase: 5 },
          { id: 'thoughtbop', phase: 1 },
          { id: 'metanukimorphosis', phase: 1 },
          { id: 'kaboom-the-cannon', phase: 5 },
          { id: 'unfettered-game-ball', phase: 5 },
        ],
        discs: [
          {
            four: 'moonlight-lullaby',
            two: [
              ['phaethons-melody'],
              ['astral-voice', 'hormone-punk'],
              ['chaos-jazz', 'freedom-blues'],
            ],
          },
          {
            four: 'astral-voice',
            two: [['phaethons-melody'], ['hormone-punk'], ['chaos-jazz', 'freedom-blues']],
          },
        ],
        main: {
          '4': [['atk-pct', 'anomaly-proficiency']],
          '5': [['atk-pct', 'pen-ratio']],
          '6': [['anomaly-mastery', 'atk-pct']],
        },
        substats: [
          ['atk-pct'],
          ['atk'],
          ['anomaly-proficiency'],
          ['crit-rate', 'crit-dmg'],
          ['pen'],
        ],
        skills: ['basic', 'chain', 'special', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'zhao',
    updated: '2.5',
    sources: [guide('zhao')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'half-sugar-bunny', phase: 1 },
          { id: 'tusks-of-fury', phase: 1 },
          { id: 'original-transmorpher', phase: 5 },
        ],
        discs: [
          {
            four: 'bunny-in-wonderland',
            two: [['yunkui-tales'], ['moonlight-lullaby', 'swing-jazz']],
          },
          { four: 'astral-voice', two: [['moonlight-lullaby', 'swing-jazz'], ['yunkui-tales']] },
        ],
        main: { '4': [['hp-pct']], '5': [['hp-pct']], '6': [['energy-regen']] },
        substats: [['hp-pct'], ['hp'], ['crit-rate', 'crit-dmg']],
        skills: ['special', 'chain', 'basic', 'assist', 'dodge'],
      },
    ],
  },
  {
    agent: 'zhu-yuan',
    updated: '2.4',
    sources: [guide('zhu-yuan')],
    variants: [
      {
        id: 'standard',
        wEngines: [
          { id: 'cordis-germina', phase: 1 },
          { id: 'the-brimstone', phase: 1 },
          { id: 'riot-suppressor-mark-vi', phase: 1 },
          { id: 'marcato-desire', phase: 5 },
          { id: 'starlight-engine', phase: 5 },
        ],
        discs: [
          {
            four: 'chaotic-metal',
            two: [
              ['woodpecker-electro'],
              ['astral-voice', 'hormone-punk'],
              ['branch-and-blade-song'],
            ],
          },
          {
            four: 'puffer-electro',
            two: [
              ['woodpecker-electro'],
              ['branch-and-blade-song'],
              ['astral-voice', 'hormone-punk'],
            ],
          },
          {
            four: 'woodpecker-electro',
            two: [['branch-and-blade-song'], ['chaotic-metal'], ['astral-voice', 'hormone-punk']],
          },
        ],
        main: {
          '4': [['crit-dmg', 'crit-rate']],
          '5': [['atk-pct'], ['ether-dmg', 'pen-ratio']],
          '6': [['atk-pct']],
        },
        substats: [['crit-rate', 'crit-dmg', 'atk-pct'], ['pen'], ['atk']],
        skills: ['basic', 'chain', 'special', 'dodge', 'assist'],
      },
    ],
  },
]
