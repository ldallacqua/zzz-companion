import type { LocalizedText } from '@zzz/core'

/**
 * What W-Engines and Drive Disc sets do, in our own words: short summaries of the effect text on
 * each item's wiki page (never the game's wording). Every item a build recommends needs one
 * (`content.test.ts`). Keep them to one line: the build page shows them under the item's name.
 */
const t = (en: string, pt: string): LocalizedText => ({ en, 'pt-BR': pt })

export const wEngineNotes: Record<string, LocalizedText> = {
  'angel-in-the-shell': t(
    'Anomaly Proficiency; more DMG to enemies with an Attribute Anomaly.',
    'Proficiência de Anomalia; mais dano em inimigos com Anomalia de Atributo.',
  ),
  'bashful-demon': t(
    'Ice DMG; squad ATK stacks with each EX Special Attack.',
    'Dano de Gelo; o ATQ da equipe acumula a cada Ataque Especial EX.',
  ),
  'bellicose-blaze': t(
    'CRIT Rate; Fire Aftershocks ignore part of the target’s DEF.',
    'Taxa CRIT; Aftershocks de Fogo ignoram parte da DEF do alvo.',
  ),
  'blazing-laurel': t(
    'Impact after Quick Assists; Basic Attacks mark the target to raise the squad’s Ice and Fire CRIT DMG.',
    'Impacto após Assistências Rápidas; Ataques Básicos marcam o alvo e aumentam o Dano CRIT de Gelo e Fogo da equipe.',
  ),
  'bloodmarrow-coffer': t(
    'More DMG for every point of CRIT Rate above 100%.',
    'Mais dano para cada ponto de Taxa CRIT acima de 100%.',
  ),
  'boisterous-echoes': t(
    'Energy when triggering Vortex; more DMG to enemies with an Attribute Anomaly.',
    'Energia ao ativar Vórtice; mais dano em inimigos com Anomalia de Atributo.',
  ),
  'box-cutter': t(
    'Physical DMG and Daze after an Aftershock.',
    'Dano Físico e Atordoamento após um Aftershock.',
  ),
  'bunny-band': t('Max HP; ATK while shielded.', 'PV máx.; ATQ enquanto tiver escudo.'),
  'cannon-rotor': t(
    'ATK; critical hits deal extra DMG.',
    'ATQ; acertos críticos causam dano extra.',
  ),
  'catty-luck': t(
    'DEF, and more after an EX Special Attack.',
    'DEF, e mais após um Ataque Especial EX.',
  ),
  'cauldron-of-clarity': t(
    'DMG stacks with EX Special Attacks; CRIT Rate at full stacks.',
    'O dano acumula com Ataques Especiais EX; Taxa CRIT com o máximo de acúmulos.',
  ),
  'chief-sidekick': t(
    'Impact and Fire RES ignore; Fire EX Special Attacks raise the squad’s DMG.',
    'Impacto e ignora RES a Fogo; Ataques Especiais EX de Fogo aumentam o dano da equipe.',
  ),
  'cloudcleave-radiance': t(
    'Ignores Physical RES; DMG and CRIT DMG after an Ether Veil.',
    'Ignora RES Física; dano e Dano CRIT após um Véu de Éter.',
  ),
  'cordis-germina': t(
    'CRIT Rate; Electric DMG stacks, then Basic Attacks and Ultimates ignore DEF.',
    'Taxa CRIT; o Dano Elétrico acumula e, depois, Ataques Básicos e Ultimates ignoram DEF.',
  ),
  'crimson-moon-casket': t(
    'CRIT Rate and Wind RES ignore; Wind EX Special Attacks raise Daze and the squad’s DMG.',
    'Taxa CRIT e ignora RES a Vento; Ataques Especiais EX de Vento aumentam o Atordoamento e o dano da equipe.',
  ),
  'crimson-thirst': t(
    'CRIT Rate and Electric DMG, plus more after EX Special Attacks.',
    'Taxa CRIT e Dano Elétrico, e mais após Ataques Especiais EX.',
  ),
  'deep-sea-visitor': t(
    'Ice DMG; CRIT Rate after Basic Attacks and Ice Dash Attacks.',
    'Dano de Gelo; Taxa CRIT após Ataques Básicos e Ataques de Investida de Gelo.',
  ),
  'demara-battery-mark-ii': t(
    'Electric DMG; Energy after Dodge Counters and Assists.',
    'Dano Elétrico; Energia após Contra-ataques de Esquiva e Assistências.',
  ),
  'dreamlit-hearth': t(
    'Energy Regen; an Ether Veil gives the squad DMG and Max HP.',
    'Recuperação de Energia; o Véu de Éter dá dano e PV máx. à equipe.',
  ),
  'drill-rig-red-axis': t(
    'Electric DMG on Basic and Dash Attacks after an EX Special or Chain Attack.',
    'Dano Elétrico em Ataques Básicos e de Investida após um Ataque Especial EX ou em Cadeia.',
  ),
  'electro-lip-gloss': t(
    'ATK and DMG while an enemy has an Attribute Anomaly.',
    'ATQ e dano enquanto um inimigo tem Anomalia de Atributo.',
  ),
  'elegant-vanity': t(
    'Energy when teammates swap in; the squad’s DMG rises after spending Energy.',
    'Energia quando aliados entram em campo; o dano da equipe sobe após gastar Energia.',
  ),
  'flamemaker-shaker': t(
    'Energy off-field; DMG stacks from EX Special Attacks and Assists.',
    'Energia fora de campo; o dano acumula com Ataques Especiais EX e Assistências.',
  ),
  'flight-of-fancy': t(
    'Anomaly Buildup; Anomaly Proficiency stacks from Ether DMG.',
    'Acúmulo de Anomalia; a Proficiência de Anomalia acumula com Dano de Éter.',
  ),
  'frostfall-sickle': t(
    'Ice DMG stacks from Special Attacks; more Abloom DMG at 2 stacks.',
    'O Dano de Gelo acumula com Ataques Especiais; mais dano de Abloom com 2 acúmulos.',
  ),
  'fusion-compiler': t(
    'ATK; Anomaly Proficiency stacks from Special Attacks.',
    'ATQ; a Proficiência de Anomalia acumula com Ataques Especiais.',
  ),
  'gilded-blossom': t('ATK and EX Special Attack DMG.', 'ATQ e dano de Ataque Especial EX.'),
  'grill-owisp': t('Fire DMG; CRIT Rate when losing HP.', 'Dano de Fogo; Taxa CRIT ao perder PV.'),
  'hailstorm-shrine': t(
    'CRIT DMG; Ice DMG stacks from EX Special Attacks and Anomalies.',
    'Dano CRIT; o Dano de Gelo acumula com Ataques Especiais EX e Anomalias.',
  ),
  'half-sugar-bunny': t(
    'Energy Regen; squad ATK and HP, plus CRIT DMG from an Ether Veil.',
    'Recuperação de Energia; ATQ e PV para a equipe, e Dano CRIT com o Véu de Éter.',
  ),
  'heartstring-nocturne': t(
    'CRIT DMG; Chain Attacks and Ultimates ignore Fire RES.',
    'Dano CRIT; Ataques em Cadeia e Ultimates ignoram RES a Fogo.',
  ),
  'hellfire-gears': t(
    'Energy off-field; Impact after EX Special Attacks.',
    'Energia fora de campo; Impacto após Ataques Especiais EX.',
  ),
  housekeeper: t(
    'Energy off-field; Physical DMG stacks from EX Special Attack hits.',
    'Energia fora de campo; o Dano Físico acumula com acertos de Ataque Especial EX.',
  ),
  'ice-jade-teapot': t(
    'Impact stacks from Basic Attacks; the squad’s DMG rises at 15 stacks.',
    'O Impacto acumula com Ataques Básicos; o dano da equipe sobe com 15 acúmulos.',
  ),
  'incarcerating-grip': t(
    'CRIT Rate; ATK and Wind RES ignore after Basic Attacks.',
    'Taxa CRIT; ATQ e ignora RES a Vento após Ataques Básicos.',
  ),
  'joyau-dore': t(
    'Anomaly Proficiency; Vortex DMG stacks, then the squad gains Proficiency.',
    'Proficiência de Anomalia; o dano de Vórtice acumula e, depois, a equipe ganha Proficiência.',
  ),
  'kaboom-the-cannon': t(
    'Squad ATK stacks as teammates land hits.',
    'O ATQ da equipe acumula conforme os aliados acertam.',
  ),
  'knights-extolment': t(
    'CRIT DMG stacks from heavy Basic and EX Special Attack hits.',
    'O Dano CRIT acumula com golpes pesados de Ataque Básico e Especial EX.',
  ),
  'krakens-cradle': t(
    'DMG stacks when losing HP; CRIT Rate below half HP.',
    'O dano acumula ao perder PV; Taxa CRIT abaixo da metade do PV.',
  ),
  'marcato-desire': t(
    'ATK after EX Special or Chain Attacks, more against Anomalies.',
    'ATQ após Ataques Especiais EX ou em Cadeia, mais contra Anomalias.',
  ),
  metanukimorphosis: t(
    'Anomaly Mastery; Aftershocks give the squad Anomaly Proficiency.',
    'Maestria de Anomalia; Aftershocks dão Proficiência de Anomalia à equipe.',
  ),
  'myriad-eclipse': t(
    'CRIT DMG; ignores DEF after Ice EX Specials, Chain Attacks and Ultimates.',
    'Dano CRIT; ignora DEF após Especiais EX, Ataques em Cadeia e Ultimates de Gelo.',
  ),
  'neon-fantasies': t(
    'Anomaly Proficiency; Ether hits raise the squad’s DMG.',
    'Proficiência de Anomalia; acertos de Éter aumentam o dano da equipe.',
  ),
  'ode-of-resurrected-wings': t(
    'Anomaly Proficiency; Refringe raises Anomaly DMG and the squad’s DMG.',
    'Proficiência de Anomalia; Refringe aumenta o dano de Anomalia e o da equipe.',
  ),
  'original-transmorpher': t('Max HP; Impact when attacked.', 'PV máx.; Impacto ao ser atacado.'),
  'peacekeeper-specialized': t(
    'Energy while shielded; more Anomaly Buildup from EX Specials and Assist Follow-Ups.',
    'Energia com escudo; mais acúmulo de Anomalia com Especiais EX e Assistências de Acompanhamento.',
  ),
  'plume-of-rebirth': t(
    'Anomaly Proficiency; Fire DMG when Anomaly DMG lands a critical hit.',
    'Proficiência de Anomalia; Dano de Fogo quando o dano de Anomalia é crítico.',
  ),
  'practiced-perfection': t(
    'Anomaly Mastery; Physical DMG stacks from Assault.',
    'Maestria de Anomalia; o Dano Físico acumula com Assault.',
  ),
  'precious-fossilized-core': t(
    'More Daze on healthy targets.',
    'Mais Atordoamento em alvos com muito PV.',
  ),
  'puzzle-sphere': t(
    'CRIT DMG after EX Special Attacks; more against targets below half HP.',
    'Dano CRIT após Ataques Especiais EX; mais contra alvos com menos da metade do PV.',
  ),
  'qingming-birdcage': t(
    'CRIT Rate; Ether DMG stacks from EX Special Attacks.',
    'Taxa CRIT; o Dano de Éter acumula com Ataques Especiais EX.',
  ),
  'radiowave-journey': t(
    'Sheer Force stacks from Chain Attacks and Ultimates.',
    'A Força Bruta acumula com Ataques em Cadeia e Ultimates.',
  ),
  'rainforest-gourmet': t(
    'ATK stacks as Energy is spent.',
    'O ATQ acumula conforme a Energia é gasta.',
  ),
  'reverb-mark-ii': t(
    'Squad Anomaly Mastery and Proficiency after an EX Special or Chain Attack.',
    'Maestria e Proficiência de Anomalia para a equipe após um Ataque Especial EX ou em Cadeia.',
  ),
  'riot-suppressor-mark-vi': t(
    'CRIT Rate; EX Specials charge stronger Ether Basic and Dash Attacks.',
    'Taxa CRIT; Especiais EX carregam Ataques Básicos e de Investida de Éter mais fortes.',
  ),
  'roaring-fur-nace': t(
    'Daze on EX Specials, Chain Attacks and Ultimates; Fire Chain Attacks raise the squad’s DMG.',
    'Atordoamento em Especiais EX, Ataques em Cadeia e Ultimates; Cadeias de Fogo aumentam o dano da equipe.',
  ),
  'roaring-ride': t(
    'A random ATK, Anomaly Proficiency or Buildup boost after EX Special Attacks.',
    'Um bônus aleatório de ATQ, Proficiência ou acúmulo de Anomalia após Ataques Especiais EX.',
  ),
  'serpentine-seeker': t(
    'CRIT Rate; spending Energy lets Electric DMG ignore DEF.',
    'Taxa CRIT; gastar Energia faz o Dano Elétrico ignorar DEF.',
  ),
  'severed-innocence': t(
    'CRIT DMG, stacking from Basic, Special and Aftershock hits.',
    'Dano CRIT, que acumula com acertos Básicos, Especiais e de Aftershock.',
  ),
  'sharpened-stinger': t(
    'Physical DMG stacks from Dash Attacks.',
    'O Dano Físico acumula com Ataques de Investida.',
  ),
  'six-shooter': t(
    'EX Special Attacks spend stored charges for extra Daze.',
    'Ataques Especiais EX gastam cargas guardadas para mais Atordoamento.',
  ),
  'slice-of-time': t(
    'More Decibels for the squad, plus Energy.',
    'Mais Decibéis para a equipe, e Energia.',
  ),
  'sol-exuvia': t(
    'CRIT Rate; ignores Ether RES (made for its own Agent).',
    'Taxa CRIT; ignora RES a Éter (feito para o próprio Agente).',
  ),
  'spectral-gaze': t(
    'Aftershocks lower the target’s DEF; Impact stacks while off-field.',
    'Aftershocks reduzem a DEF do alvo; o Impacto acumula fora de campo.',
  ),
  'spring-embrace': t(
    'Less DMG taken; Energy Generation that passes to the next Agent.',
    'Menos dano recebido; geração de Energia que passa para o próximo Agente.',
  ),
  'starlight-engine': t(
    'ATK after a Dodge Counter or Quick Assist.',
    'ATQ após um Contra-ataque de Esquiva ou Assistência Rápida.',
  ),
  'starlight-engine-replica': t(
    'Physical DMG on Basic and Dash Attack hits from range.',
    'Dano Físico em acertos de Ataque Básico e de Investida à distância.',
  ),
  'starlight-rider-faceplate': t(
    'CRIT Rate; Physical DMG stacks from Special Attacks.',
    'Taxa CRIT; o Dano Físico acumula com Ataques Especiais.',
  ),
  'steam-oven': t('Impact grows with stored Energy.', 'O Impacto cresce com a Energia acumulada.'),
  'steel-cushion': t(
    'Physical DMG; more DMG when hitting from behind.',
    'Dano Físico; mais dano ao atacar pelas costas.',
  ),
  'street-superstar': t(
    'Chain Attacks charge a stronger Ultimate.',
    'Ataques em Cadeia carregam um Ultimate mais forte.',
  ),
  'the-brimstone': t(
    'ATK stacks from Basic, Dash and Dodge Counter hits.',
    'O ATQ acumula com acertos Básicos, de Investida e de Contra-ataque de Esquiva.',
  ),
  'the-restrained': t(
    'Basic Attack DMG and Daze stack on hit.',
    'O dano e o Atordoamento de Ataques Básicos acumulam a cada acerto.',
  ),
  'the-simmering-pot': t(
    'Daze and DMG after an Assist Follow-Up.',
    'Atordoamento e dano após uma Assistência de Acompanhamento.',
  ),
  'the-vault': t(
    'Ether hits raise everyone’s DMG against the target, plus Energy.',
    'Acertos de Éter aumentam o dano de todos contra o alvo, e dão Energia.',
  ),
  thoughtbop: t(
    'Energy off-field; Physical EX Special Attacks raise the squad’s DMG.',
    'Energia fora de campo; Ataques Especiais EX Físicos aumentam o dano da equipe.',
  ),
  timeweaver: t(
    'Electric Anomaly Buildup; Proficiency against Anomalies, and more Disorder DMG.',
    'Acúmulo de Anomalia Elétrica; Proficiência contra Anomalias e mais dano de Desordem.',
  ),
  'tremor-trigram-vessel': t(
    'EX Special and Ultimate DMG; Energy when the squad is hit or healed.',
    'Dano de Especial EX e Ultimate; Energia quando a equipe sofre dano ou é curada.',
  ),
  'tusks-of-fury': t(
    'Stronger shields; the squad’s DMG and Daze rise after Interrupts or Perfect Dodges.',
    'Escudos mais fortes; o dano e o Atordoamento da equipe sobem após Interrupções ou Esquivas Perfeitas.',
  ),
  'unfettered-game-ball': t(
    'Attribute Counters raise everyone’s CRIT Rate against the target.',
    'Contra-ataques de Atributo aumentam a Taxa CRIT de todos contra o alvo.',
  ),
  'vortex-arrow': t('More Daze on the main target.', 'Mais Atordoamento no alvo principal.'),
  'weeping-cradle': t(
    'Energy off-field; hits raise everyone’s DMG against the target.',
    'Energia fora de campo; acertos aumentam o dano de todos contra o alvo.',
  ),
  'weeping-gemini': t(
    'Anomaly Proficiency stacks as the squad applies Anomalies.',
    'A Proficiência de Anomalia acumula conforme a equipe aplica Anomalias.',
  ),
  'wrathful-vajra': t(
    'CRIT Rate; Fire DMG stacks from EX Special Attacks.',
    'Taxa CRIT; o Dano de Fogo acumula com Ataques Especiais EX.',
  ),
  'yesterday-calls': t(
    'Energy off-field; Physical EX Specials build Daze, then give the squad CRIT DMG.',
    'Energia fora de campo; Especiais EX Físicos aumentam o Atordoamento e, depois, dão Dano CRIT à equipe.',
  ),
  'zanshin-herb-case': t(
    'CRIT Rate and Electric Dash Attack DMG; more CRIT Rate after Anomalies or Stuns.',
    'Taxa CRIT e dano Elétrico de Investida; mais Taxa CRIT após Anomalias ou Atordoamentos.',
  ),
}

export const discSetNotes: Record<string, { two: LocalizedText; four: LocalizedText }> = {
  'astral-voice': {
    two: t('ATK +10%', 'ATQ +10%'),
    four: t(
      'Quick Assists stack DMG for the Agent coming in.',
      'Assistências Rápidas acumulam dano para o Agente que entra.',
    ),
  },
  'branch-and-blade-song': {
    two: t('CRIT DMG +16%', 'Dano CRIT +16%'),
    four: t(
      'CRIT DMG with 115+ Anomaly Mastery; CRIT Rate after Freeze or Shatter.',
      'Dano CRIT com 115+ de Maestria de Anomalia; Taxa CRIT após Congelar ou Estilhaçar.',
    ),
  },
  'bunny-in-wonderland': {
    two: t('HP +10%', 'PV +10%'),
    four: t(
      'Defense Agents raise the squad’s DMG with EX Specials and Defensive or Evasive Assists.',
      'Defensores aumentam o dano da equipe com Especiais EX e Assistências Defensivas ou Evasivas.',
    ),
  },
  'chaos-jazz': {
    two: t('Anomaly Proficiency +30', 'Proficiência de Anomalia +30'),
    four: t(
      'Fire and Electric DMG; EX Special and Assist DMG while off-field.',
      'Dano de Fogo e Elétrico; dano de Especial EX e Assistência fora de campo.',
    ),
  },
  'chaotic-metal': {
    two: t('Ether DMG +10%', 'Dano de Éter +10%'),
    four: t(
      'CRIT DMG, more when Corruption triggers.',
      'Dano CRIT, e mais quando a Corrupção é ativada.',
    ),
  },
  'dawns-bloom': {
    two: t('Basic Attack DMG +15%', 'Dano de Ataque Básico +15%'),
    four: t(
      'More Basic Attack DMG, and more for Attack Agents after EX Specials or Ultimates.',
      'Mais dano de Ataque Básico, e mais para Atacantes após Especiais EX ou Ultimates.',
    ),
  },
  'fanged-metal': {
    two: t('Physical DMG +10%', 'Dano Físico +10%'),
    four: t('More DMG to targets hit by Assault.', 'Mais dano em alvos afetados por Assault.'),
  },
  'feathered-fate': {
    two: t('Anomaly Proficiency +30', 'Proficiência de Anomalia +30'),
    four: t(
      'Anomaly Proficiency on entering the field; Lumiflux Agents also gain Anomaly DMG.',
      'Proficiência de Anomalia ao entrar em campo; Agentes de Lúmen também ganham dano de Anomalia.',
    ),
  },
  'freedom-blues': {
    two: t('Anomaly Proficiency +30', 'Proficiência de Anomalia +30'),
    four: t(
      'EX Special Attacks lower the target’s Anomaly Buildup RES.',
      'Ataques Especiais EX reduzem a RES do alvo ao acúmulo de Anomalia.',
    ),
  },
  'hormone-punk': {
    two: t('ATK +10%', 'ATQ +10%'),
    four: t(
      'ATK +25% for 10s on entering combat or switching in.',
      'ATQ +25% por 10s ao entrar em combate ou em campo.',
    ),
  },
  'inferno-metal': {
    two: t('Fire DMG +10%', 'Dano de Fogo +10%'),
    four: t(
      'CRIT Rate when hitting Burning enemies.',
      'Taxa CRIT ao acertar inimigos em Queimadura.',
    ),
  },
  'king-of-the-summit': {
    two: t('Daze +6%', 'Atordoamento +6%'),
    four: t(
      'Stun Agents give the squad CRIT DMG, more with 50%+ CRIT Rate.',
      'Atordoadores dão Dano CRIT à equipe, e mais com 50%+ de Taxa CRIT.',
    ),
  },
  'moonlight-lullaby': {
    two: t('Energy Regen +20%', 'Recuperação de Energia +20%'),
    four: t(
      'Support Agents raise the squad’s DMG with EX Specials or Ultimates.',
      'Agentes de Assistência aumentam o dano da equipe com Especiais EX ou Ultimates.',
    ),
  },
  'notes-from-the-chained': {
    two: t('Ice DMG +10%', 'Dano de Gelo +10%'),
    four: t(
      'Anomaly Proficiency after Abloom; Anomaly DMG after Freeze.',
      'Proficiência de Anomalia após Abloom; dano de Anomalia após Congelar.',
    ),
  },
  'phaethons-melody': {
    two: t('Anomaly Mastery +8%', 'Maestria de Anomalia +8%'),
    four: t(
      'Anomaly Proficiency when anyone uses an EX Special; Ether DMG if it was a teammate.',
      'Proficiência de Anomalia quando alguém usa um Especial EX; Dano de Éter se foi um aliado.',
    ),
  },
  'polar-metal': {
    two: t('Ice DMG +10%', 'Dano de Gelo +10%'),
    four: t(
      'Basic and Dash Attack DMG, more after Freeze or Shatter.',
      'Dano de Ataque Básico e de Investida, e mais após Congelar ou Estilhaçar.',
    ),
  },
  'proto-punk': {
    two: t('Shield +15%', 'Escudo +15%'),
    four: t(
      'Defensive or Evasive Assists raise the squad’s DMG.',
      'Assistências Defensivas ou Evasivas aumentam o dano da equipe.',
    ),
  },
  'puffer-electro': {
    two: t('PEN Ratio +8%', 'Taxa de Perfuração +8%'),
    four: t(
      'Ultimate DMG, and ATK after an Ultimate.',
      'Dano de Ultimate, e ATQ após um Ultimate.',
    ),
  },
  'shadow-harmony': {
    two: t('Aftershock and Dash Attack DMG +15%', 'Dano de Aftershock e de Investida +15%'),
    four: t(
      'ATK and CRIT Rate stack from on-attribute Aftershocks and Dash Attacks.',
      'ATQ e Taxa CRIT acumulam com Aftershocks e Investidas do próprio Atributo.',
    ),
  },
  'shining-aria': {
    two: t('Ether DMG +10%', 'Dano de Éter +10%'),
    four: t(
      'Anomaly Proficiency from Basic Attacks; DMG while an enemy is stunned.',
      'Proficiência de Anomalia com Ataques Básicos; dano enquanto um inimigo está atordoado.',
    ),
  },
  'shockstar-disco': {
    two: t('Impact +6%', 'Impacto +6%'),
    four: t(
      'More Daze from Basic, Dash and Dodge Counter hits.',
      'Mais Atordoamento com Ataques Básicos, de Investida e Contra-ataques de Esquiva.',
    ),
  },
  'soul-rock': {
    two: t('DEF +16%', 'DEF +16%'),
    four: t(
      'Less DMG taken briefly after being hit.',
      'Menos dano recebido por um instante após ser atingido.',
    ),
  },
  'swing-jazz': {
    two: t('Energy Regen +20%', 'Recuperação de Energia +20%'),
    four: t(
      'Chain Attacks and Ultimates raise the squad’s DMG.',
      'Ataques em Cadeia e Ultimates aumentam o dano da equipe.',
    ),
  },
  'the-sky-ablaze': {
    two: t('Ether DMG +10%', 'Dano de Éter +10%'),
    four: t(
      'CRIT DMG for Ether Agents; ATK after EX Specials or Ultimates.',
      'Dano CRIT para Agentes de Éter; ATQ após Especiais EX ou Ultimates.',
    ),
  },
  'thorned-rose': {
    two: t('DEF +16%', 'DEF +16%'),
    four: t(
      'DMG, plus CRIT Rate with high initial DEF.',
      'Dano, e Taxa CRIT com DEF inicial alta.',
    ),
  },
  'thunder-metal': {
    two: t('Electric DMG +10%', 'Dano Elétrico +10%'),
    four: t('ATK while an enemy is Shocked.', 'ATQ enquanto um inimigo está em Choque.'),
  },
  'white-water-ballad': {
    two: t('Physical DMG +10%', 'Dano Físico +10%'),
    four: t(
      'CRIT Rate inside an Ether Veil; Attack Agents also gain ATK.',
      'Taxa CRIT dentro de um Véu de Éter; Atacantes também ganham ATQ.',
    ),
  },
  'woodpecker-electro': {
    two: t('CRIT Rate +8%', 'Taxa CRIT +8%'),
    four: t(
      'ATK after critical Basic, Dodge Counter or EX Special hits.',
      'ATQ após acertos críticos Básicos, de Contra-ataque de Esquiva ou Especial EX.',
    ),
  },
  'wuthering-salon': {
    two: t('Wind DMG +10%', 'Dano de Vento +10%'),
    four: t(
      'Anomaly Proficiency from EX Specials; DMG after Windswept.',
      'Proficiência de Anomalia com Especiais EX; dano após Windswept.',
    ),
  },
  'yunkui-tales': {
    two: t('HP +10%', 'PV +10%'),
    four: t(
      'CRIT Rate stacks from EX Specials, Chain Attacks and Ultimates; Sheer DMG at 3 stacks.',
      'Taxa CRIT acumula com Especiais EX, Ataques em Cadeia e Ultimates; Dano Bruto com 3 acúmulos.',
    ),
  },
}
