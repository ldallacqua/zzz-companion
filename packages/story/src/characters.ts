import type { CharacterInput } from '@zzz/core'

export { factions } from './factions'

/**
 * Character art is © HoYoverse and is NOT stored in this repository.
 * URLs point to the community wiki's CDN (see README → "Assets & licensing").
 */
const img = (path: string) => `https://static.wikia.nocookie.net/zenless-zone-zero/images/${path}`

export const characters = [
  {
    id: 'nicole',
    aliases: ['Nicole'],
    name: 'Nicole Demara',
    unlockedAt: 'p-strongbox',
    factions: ['cunning-hares'],
    color: '#ff4fa3',
    image: img('7/7a/Agent_Nicole_Demara_Portrait.png/revision/latest?cb=20240707011646'),
    blurb: {
      en: 'Boss of the Cunning Hares. Broke, sharp and always haggling — and softer-hearted than she will ever admit.',
      'pt-BR':
        'Chefe da Casa das Lebres Astutas. Dura, esperta e sempre pechinchando — e com um coração mais mole do que ela jamais vai admitir.',
    },
  },
  {
    id: 'anby',
    aliases: ['Anby'],
    name: 'Anby Demara',
    unlockedAt: 'p-strongbox',
    factions: ['cunning-hares'],
    color: '#7ad3ff',
    image: img('b/bd/Agent_Anby_Demara_Portrait.png/revision/latest?cb=20240706234414'),
    blurb: {
      en: 'The Hares’ deadpan swordswoman, who takes most of her life lessons from movies.',
      'pt-BR':
        'A espadachim impassível das Lebres, que tira a maioria das lições de vida dos filmes.',
    },
  },
  {
    id: 'billy',
    aliases: ['Billy'],
    name: 'Billy Kid',
    unlockedAt: 'p-strongbox',
    factions: ['cunning-hares'],
    color: '#ff5a3c',
    image: img('d/dc/Agent_Billy_Kid_Portrait.png/revision/latest?cb=20240707002211'),
    blurb: {
      en: 'The Hares’ gunslinger android and the Starlight Knights’ most devoted fan.',
      'pt-BR': 'O androide pistoleiro das Lebres e o fã mais devoto dos Cavaleiros Estelares.',
    },
  },
  {
    id: 'miguel-silver',
    aliases: ['Silver', 'Silver Tears', 'Lágrimas de Prata'],
    name: 'Miguel Silver',
    unlockedAt: 'p-strongbox',
    factions: ['red-fang'],
    color: '#b8b8c0',
    image: img('1/1c/NPC_Miguel_Silver.png/revision/latest?cb=20250812160017'),
    blurb: {
      en: 'Leader of the Red Fang Gang, nicknamed “Silver Tears”. Wanted by Public Security for the attack on a research institute.',
      'pt-BR':
        'Líder da Gangue da Presa Rubra, apelidado de “Lágrimas de Prata”. Procurado pela Segurança Pública pelo ataque a um instituto de pesquisa.',
    },
  },
  {
    id: 'bringer',
    aliases: ['Bringer', 'Hollow Hero', 'Herói da Esfera'],
    name: 'Justin Bringer',
    unlockedAt: 'p-strongbox',
    factions: ['public-security'],
    color: '#5b7cff',
    image: img('6/6b/NPC_Justin_Bringer.png/revision/latest?cb=20241211020457'),
    blurb: {
      en: 'A senior Public Security officer in the Janus Quarter, often seen giving awkward briefings on TV.',
      'pt-BR':
        'Oficial graduado da Segurança Pública no Distrito Janus, visto com frequência dando entrevistas atrapalhadas na TV.',
    },
  },
  {
    id: 'belle',
    name: 'Belle',
    unlockedAt: 'p-phaethon',
    factions: ['phaethon'],
    color: '#3fd0ff',
    image: img('6/6e/Agent_Belle_Portrait.png/revision/latest?cb=20240707002545'),
    blurb: {
      en: 'Half of Phaethon. Co-runs Random Play with her brother and is usually the one diving into Hollows through Eous.',
      'pt-BR':
        'Metade de Phaethon. Cuida da Random Play com o irmão e costuma ser quem mergulha nas Esferas através de Eous.',
    },
  },
  {
    id: 'wise',
    name: 'Wise',
    unlockedAt: 'p-phaethon',
    factions: ['phaethon'],
    color: '#c7ced8',
    image: img('e/e8/Agent_Wise_Portrait.png/revision/latest?cb=20240707002534'),
    blurb: {
      en: 'The other half of Phaethon. Handles the HDD, the cooking and most of the worrying.',
      'pt-BR':
        'A outra metade de Phaethon. Cuida do HDD, da cozinha e de quase toda a preocupação.',
    },
  },
  {
    id: 'eous',
    name: 'Eous',
    unlockedAt: 'p-phaethon',
    factions: ['phaethon'],
    color: '#f2f2f0',
    image: img('e/eb/Eous_Portrait.png/revision/latest?cb=20250621004314'),
    blurb: {
      en: 'Phaethon’s Bangboo double. Through the HDD, a Proxy’s mind rides along inside it.',
      'pt-BR': 'O Bangboo dublê de Phaethon. Pelo HDD, a mente de um Proxy “viaja” dentro dele.',
    },
  },
  {
    id: 'fairy',
    name: 'Fairy',
    unlockedAt: 'p-fairy',
    factions: ['phaethon'],
    color: '#c6ff2e',
    image: img('7/72/NPC_Fairy.png/revision/latest?cb=20260208044230'),
    blurb: {
      en: 'An AI that appeared in the HDD after the strongbox incident, bound to the siblings by an “agreement” she won’t explain.',
      'pt-BR':
        'Uma IA que apareceu no HDD depois do incidente do cofre, ligada aos irmãos por um “acordo” que ela não explica.',
    },
  },
  {
    id: 'shepherd',
    name: 'Shepherd',
    unlockedAt: 'p-fairy',
    color: '#d9a066',
    image: img('1/15/NPC_Shepherd_Icon.png/revision/latest?cb=20240724021512'),
    blurb: {
      en: 'An Inter-Knot broker and old friend of Phaethon who brings them lucrative commissions.',
      'pt-BR': 'Corretor do Interlaço e velho amigo de Phaethon, que traz serviços lucrativos.',
    },
  },
  {
    id: 'nekomata',
    aliases: ['Nekomata'],
    name: 'Nekomiya Mana',
    unlockedAt: 'c1a-client',
    color: '#b07cff',
    image: img('b/bc/Agent_Nekomiya_Mana_Portrait.png/revision/latest?cb=20240706234603'),
    blurb: {
      en: '“Nekomata”. A cat Thiren who hires the Cunning Hares to recover a family heirloom. Fast, quiet — and keeping secrets.',
      'pt-BR':
        '“Nekomata”. Uma Tirena gata que contrata as Lebres Astutas para recuperar uma herança de família. Rápida, silenciosa — e cheia de segredos.',
    },
  },
  {
    id: 'perlman',
    aliases: ['Perlman'],
    name: 'Charles Perlman',
    unlockedAt: 'c1a-client',
    factions: ['vision'],
    color: '#e0b84a',
    image: img('8/81/NPC_Charles_Perlman_Icon.png/revision/latest?cb=20250221173723'),
    blurb: {
      en: 'Vision Corporation’s representative for the old capital metro renovation.',
      'pt-BR': 'Representante da Corporação Visão na reforma do metrô da antiga capital.',
    },
  },
  {
    id: 'sarah',
    name: 'Sarah',
    unlockedAt: 'c1a-client',
    factions: ['vision'],
    color: '#e8364f',
    image: img('6/60/NPC_Sarah_Floren_Icon.png/revision/latest?cb=20250408183612'),
    blurb: {
      en: 'A woman in red at Perlman’s side, quick to shut down awkward questions.',
      'pt-BR': 'Uma mulher de vermelho ao lado de Perlman, rápida em encerrar perguntas incômodas.',
    },
  },
  {
    id: 'corin',
    aliases: ['Corin'],
    name: 'Corin Wickes',
    unlockedAt: 'c1a-train',
    color: '#9fb4ff',
    image: img('c/cf/Agent_Corin_Wickes_Portrait.png/revision/latest?cb=20240706234305'),
    blurb: {
      en: 'A timid maid from a housekeeping company, lost in the Dead End Hollow with a very large chainsaw.',
      'pt-BR':
        'Uma empregada tímida de uma empresa de serviços domésticos, perdida na Esfera Sem Saída com uma motosserra enorme.',
    },
  },
  {
    id: 'ray',
    name: 'Ray',
    unlockedAt: 'z-hollow-zero',
    factions: ['white-star'],
    color: '#7cf0d0',
    image: img('0/00/NPC_Ray_Yersin.png/revision/latest?cb=20261013090404'),
    blurb: {
      en: 'A White Star Institute researcher at Scott Outpost, endlessly curious about Hollow Zero.',
      'pt-BR':
        'Pesquisadora do Instituto Estrela Branca no Posto Scott, curiosíssima sobre a Hollow Zero.',
    },
  },
  {
    id: 'miyabi',
    aliases: ['Miyabi'],
    name: 'Hoshimi Miyabi',
    unlockedAt: 'z-hollow-zero',
    factions: ['section-6'],
    color: '#ff5d8f',
    image: img('d/da/Agent_Hoshimi_Miyabi_Portrait.png/revision/latest?cb=20250329051641'),
    blurb: {
      en: 'Chief of H.A.N.D.’s Hollow Special Operations Section 6, known as the Void Hunter.',
      'pt-BR':
        'Chefe da Seção 6 das Forças Especiais da H.A.N.D., conhecida como a Caçadora do Vazio.',
    },
  },
  {
    id: 'yanagi',
    aliases: ['Yanagi'],
    name: 'Tsukishiro Yanagi',
    unlockedAt: 'z-hollow-zero',
    factions: ['section-6'],
    color: '#a678ff',
    image: img('c/cb/Agent_Tsukishiro_Yanagi_Portrait.png/revision/latest?cb=20241106030347'),
    blurb: {
      en: 'Deputy chief of Section 6 — and the one who translates the chief’s cryptic remarks.',
      'pt-BR': 'Vice-chefe da Seção 6 — e quem traduz os comentários enigmáticos da chefe.',
    },
  },
  {
    id: 'harumasa',
    aliases: ['Harumasa'],
    name: 'Asaba Harumasa',
    unlockedAt: 'z-hollow-zero',
    factions: ['section-6'],
    color: '#4fd1ff',
    image: img('f/f6/Agent_Asaba_Harumasa_Portrait.png/revision/latest?cb=20241218024124'),
    blurb: {
      en: 'A laid-back Section 6 operative who handles reconnaissance.',
      'pt-BR': 'Agente tranquilão da Seção 6 que cuida do reconhecimento.',
    },
  },
  {
    id: 'soukaku',
    name: 'Soukaku',
    unlockedAt: 'z-hollow-zero',
    factions: ['section-6'],
    color: '#7fe1ff',
    image: img('3/35/Agent_Soukaku_Portrait.png/revision/latest?cb=20240707011630'),
    blurb: {
      en: 'Section 6’s youngest member, who adores Eous on sight.',
      'pt-BR': 'A integrante mais nova da Seção 6, que se encanta por Eous na hora.',
    },
  },
  {
    id: 'anton',
    aliases: ['Anton'],
    name: 'Anton Ivanov',
    unlockedAt: 'c2a-belobog',
    factions: ['belobog'],
    color: '#ffb02e',
    image: img('1/1d/Agent_Anton_Ivanov_Portrait.png/revision/latest?cb=20240707011622'),
    blurb: {
      en: 'Belobog’s hot-blooded driller, who calls his jackhammer “bro”.',
      'pt-BR': 'O perfurador esquentado da Belobog, que chama a britadeira de “brother”.',
    },
  },
  {
    id: 'ben',
    aliases: ['Ben'],
    name: 'Ben Bigger',
    unlockedAt: 'c2a-belobog',
    factions: ['belobog'],
    color: '#c98b4a',
    image: img('3/35/Agent_Ben_Bigger_Portrait.png/revision/latest?cb=20240707004233'),
    blurb: {
      en: 'Belobog’s gentle, extremely polite bear of an accountant.',
      'pt-BR': 'O contador urso da Belobog: gentil e educado ao extremo.',
    },
  },
  {
    id: 'grace',
    aliases: ['Grace'],
    name: 'Grace Howard',
    unlockedAt: 'c2a-belobog',
    factions: ['belobog'],
    color: '#ffd23f',
    image: img('9/9a/Agent_Grace_Howard_Portrait.png/revision/latest?cb=20240707002436'),
    blurb: {
      en: 'Belobog’s brilliant engineer, who treats the company’s machines like her children.',
      'pt-BR': 'A engenheira genial da Belobog, que trata as máquinas da empresa como filhos.',
    },
  },
  {
    id: 'koleda',
    aliases: ['Koleda'],
    name: 'Koleda Belobog',
    unlockedAt: 'c2a-belobog',
    factions: ['belobog'],
    color: '#ff7a2e',
    image: img('d/d6/Agent_Koleda_Belobog_Portrait.png/revision/latest?cb=20240706234545'),
    blurb: {
      en: 'The young president of Belobog Industries — small, fierce and fully in charge.',
      'pt-BR': 'A jovem presidente das Indústrias Belobog — pequena, feroz e no comando.',
    },
  },
  {
    id: 'khors',
    aliases: ['Khors'],
    name: 'Khors Belobog',
    unlockedAt: 'c2a-khors',
    factions: ['belobog'],
    color: '#d9a441',
    image: img('c/c8/NPC_Khors_Belobog.png/revision/latest?cb=20250502002115'),
    blurb: {
      en: 'Belobog’s former president and Koleda’s father, who vanished the night before the old capital fell.',
      'pt-BR':
        'Ex-presidente da Belobog e pai de Koleda, que sumiu na noite anterior à queda da antiga capital.',
    },
  },
  {
    id: 'zhu-yuan',
    name: 'Zhu Yuan',
    unlockedAt: 'i2a-officers',
    factions: ['public-security', 'cisrt'],
    color: '#ff3b5c',
    image: img('0/07/Agent_Zhu_Yuan_Portrait.png/revision/latest?cb=20240708205906'),
    blurb: {
      en: 'Public Security officer of the Criminal Investigation Special Response Team: by-the-book, brave and kind.',
      'pt-BR': 'Oficial da Equipe Especial de Investigação Criminal: certinha, corajosa e gentil.',
    },
  },
  {
    id: 'qingyi',
    name: 'Qingyi',
    unlockedAt: 'i2a-officers',
    factions: ['public-security', 'cisrt'],
    color: '#3ee08f',
    image: img('d/d3/Agent_Qingyi_Portrait.png/revision/latest?cb=20251022204525'),
    blurb: {
      en: 'Zhu Yuan’s partner: sharp intuition, sharper proverbs and a very strong grip.',
      'pt-BR':
        'Parceira de Zhu Yuan: intuição afiada, provérbios mais afiados ainda e uma força absurda.',
    },
  },
] satisfies CharacterInput[]
