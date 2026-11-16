import type { GlossaryTermInput } from '@zzz/core'

/** Portuguese terms follow the official pt-BR localization of the game where one exists. */
export const glossary = [
  {
    id: 'hollow',
    aliases: {
      en: ['Hollow', 'Hollows', 'Companion Hollow'],
      'pt-BR': ['Esfera Negra', 'Esferas Negras', 'Esfera', 'Esferas'],
    },
    unlockedAt: 'p-strongbox',
    term: { en: 'Hollow', 'pt-BR': 'Esfera Negra (Hollow)' },
    definition: {
      en: 'A spatial disaster that swallows parts of the city. Inside, space keeps shifting and Ether corrupts anyone who stays too long.',
      'pt-BR':
        'Um desastre espacial que engole partes da cidade. Lá dentro o espaço muda o tempo todo e o Éter corrompe quem fica tempo demais.',
    },
  },
  {
    id: 'ethereal',
    aliases: { en: ['Ethereal', 'Ethereals'], 'pt-BR': ['Etéreo', 'Etéreos'] },
    unlockedAt: 'p-strongbox',
    term: { en: 'Ethereal', 'pt-BR': 'Etéreo' },
    definition: {
      en: 'Monsters that roam the Hollows. Some superior Ethereals were once people consumed by Ether corruption.',
      'pt-BR':
        'Monstros que vagam pelas Esferas. Alguns Etéreos superiores já foram pessoas consumidas pela corrupção por Éter.',
    },
  },
  {
    id: 'ether-corruption',
    aliases: { en: ['Ether corruption'], 'pt-BR': ['corrupção por Éter'] },
    unlockedAt: 'p-strongbox',
    term: { en: 'Ether corruption', 'pt-BR': 'Corrupção por Éter' },
    definition: {
      en: 'What a Hollow does to the people inside it. Ether aptitude only slows it down.',
      'pt-BR':
        'O que uma Esfera faz com quem está dentro dela. A aptidão para Éter só retarda o processo.',
    },
  },
  {
    id: 'new-eridu',
    unlockedAt: 'p-strongbox',
    term: { en: 'New Eridu', 'pt-BR': 'Nova Eridu' },
    definition: {
      en: 'The city where the story takes place, built to live alongside — and profit from — the Hollows.',
      'pt-BR':
        'A cidade onde a história se passa, construída para conviver com as Esferas — e lucrar com elas.',
    },
  },
  {
    id: 'proxy',
    aliases: { en: ['Proxy', 'Proxies'], 'pt-BR': ['Proxy', 'Proxies'] },
    unlockedAt: 'p-phaethon',
    term: { en: 'Proxy', 'pt-BR': 'Proxy' },
    definition: {
      en: 'An illegal guide who reads Hollows from the outside and leads people through them. Public Security is cracking down on them before the election.',
      'pt-BR':
        'Guia ilegal que lê as Esferas de fora e conduz pessoas por dentro delas. A Segurança Pública está apertando o cerco antes da eleição.',
    },
  },
  {
    id: 'phaethon',
    unlockedAt: 'p-phaethon',
    term: { en: 'Phaethon', 'pt-BR': 'Phaethon' },
    definition: {
      en: 'The legendary Proxy identity shared by Belle and Wise.',
      'pt-BR': 'A identidade de Proxy lendário compartilhada por Belle e Wise.',
    },
  },
  {
    id: 'hdd',
    aliases: { en: ['HDD'], 'pt-BR': ['HDD'] },
    unlockedAt: 'p-phaethon',
    term: { en: 'HDD', 'pt-BR': 'HDD' },
    definition: {
      en: 'Hollow Deep Dive System: Phaethon’s rig for processing Hollow data and linking a Proxy’s mind to a Bangboo.',
      'pt-BR':
        'Sistema de Mergulho Profundo em Esferas: o equipamento de Phaethon que processa dados das Esferas e liga a mente de um Proxy a um Bangboo.',
    },
  },
  {
    id: 'bangboo',
    aliases: { en: ['Bangboo'], 'pt-BR': ['Bangboo'] },
    unlockedAt: 'p-phaethon',
    term: { en: 'Bangboo', 'pt-BR': 'Bangboo' },
    definition: {
      en: 'Small rabbit-eared robots found all over New Eridu — running shops, working in Hollows, carrying Proxies.',
      'pt-BR':
        'Pequenos robôs de orelhas de coelho espalhados por Nova Eridu — cuidando de lojas, trabalhando em Esferas, levando Proxies.',
    },
  },
  {
    id: 'inter-knot',
    aliases: { en: ['Inter-Knot'], 'pt-BR': ['Interlaço'] },
    unlockedAt: 'p-phaethon',
    term: { en: 'Inter-Knot', 'pt-BR': 'Interlaço (Inter-Knot)' },
    definition: {
      en: 'An anonymous forum where Proxies, raiders and clients trade commissions and gossip.',
      'pt-BR': 'Fórum anônimo onde Proxies, saqueadores e clientes trocam serviços e fofocas.',
    },
  },
  {
    id: 'hollow-raider',
    aliases: {
      en: ['Hollow Raider', 'Hollow Raiders'],
      'pt-BR': ['Saqueador', 'Saqueadores', 'Saqueadoras'],
    },
    unlockedAt: 'p-phaethon',
    term: { en: 'Hollow Raider', 'pt-BR': 'Saqueador' },
    definition: {
      en: 'Someone who enters Hollows illegally for profit — like the Cunning Hares.',
      'pt-BR': 'Quem entra nas Esferas ilegalmente para lucrar — como as Lebres Astutas.',
    },
  },
  {
    id: 'hia',
    aliases: {
      en: ['Hollow Investigative Association', 'HIA'],
      'pt-BR': ['Associação de Investigação de Esferas Negras', 'Associação'],
    },
    unlockedAt: 'p-phaethon',
    term: {
      en: 'Hollow Investigative Association (HIA)',
      'pt-BR': 'Associação de Investigação de Esferas Negras',
    },
    definition: {
      en: 'The official agency for Hollow disasters, investigations and rescues.',
      'pt-BR': 'A agência oficial para desastres, investigações e resgates em Esferas.',
    },
  },
  {
    id: 'w-engine',
    aliases: { en: ['W-Engine', 'W-Engines'], 'pt-BR': ['Motor-W', 'Motores-W'] },
    unlockedAt: 'p-phaethon',
    term: { en: 'W-Engine', 'pt-BR': 'Motor-W' },
    definition: {
      en: 'Gadgets that boost an Agent’s weapon — sold, very unofficially, at the Box Galaxy toy shop.',
      'pt-BR':
        'Aparelhos que turbinam a arma de um Agente — vendidos, bem por baixo dos panos, na loja Box Galaxy.',
    },
  },
  {
    id: 'carrot',
    aliases: { en: ['Carrot', 'Carrots'], 'pt-BR': ['Caroteno', 'Carotenos'] },
    unlockedAt: 'p-hacker',
    term: { en: 'Carrot', 'pt-BR': 'Caroteno (Carrot)' },
    definition: {
      en: 'Route data for getting in and out of a Hollow. It drifts as the Hollow changes and has to be recalibrated.',
      'pt-BR':
        'Dados de rota para entrar e sair de uma Esfera. Eles desatualizam conforme a Esfera muda e precisam ser recalibrados.',
    },
  },
  {
    id: 'rosetta-data',
    unlockedAt: 'p-hacker',
    term: { en: 'Rosetta Data', 'pt-BR': 'Dados de Rosetta' },
    definition: {
      en: 'Master Hollow data held by the city’s rulers and used to recalibrate Carrots. The strongbox held something comparable.',
      'pt-BR':
        'Dados-mestre das Esferas, guardados pelos governantes da cidade e usados para recalibrar Carotenos. O cofre guardava algo comparável.',
    },
  },
  {
    id: 'old-capital',
    aliases: { en: ['old capital'], 'pt-BR': ['antiga capital'] },
    unlockedAt: 'c1a-client',
    term: { en: 'The old capital', 'pt-BR': 'A antiga capital' },
    definition: {
      en: 'The city that fell to the Hollows before New Eridu rose. Its ruins and old metro lines still sit inside Hollows.',
      'pt-BR':
        'A cidade que caiu para as Esferas antes de Nova Eridu surgir. Suas ruínas e linhas de metrô ainda estão dentro das Esferas.',
    },
  },
  {
    id: 'thiren',
    aliases: { en: ['Thiren'], 'pt-BR': ['Tireno', 'Tirena'] },
    unlockedAt: 'c1a-client',
    term: { en: 'Thiren', 'pt-BR': 'Tireno' },
    definition: {
      en: 'People with animal traits, like the cat Thiren Nekomata.',
      'pt-BR': 'Pessoas com traços animais, como a Tirena gata Nekomata.',
    },
  },
  {
    id: 'tops',
    unlockedAt: 'c1a-client',
    term: { en: 'TOPS', 'pt-BR': 'TOPS' },
    definition: {
      en: 'The alliance of New Eridu’s most powerful corporations. Vision wanted a seat badly enough to cut deadly corners.',
      'pt-BR':
        'A aliança das corporações mais poderosas de Nova Eridu. A Visão queria tanto entrar que topou atalhos mortais.',
    },
  },
  {
    id: 'dead-end-hollow',
    aliases: { en: ['Dead End Hollow'], 'pt-BR': ['Esfera Sem Saída'] },
    unlockedAt: 'c1a-hideouts',
    term: { en: 'Dead End Hollow', 'pt-BR': 'Esfera Sem Saída' },
    definition: {
      en: 'The Hollow between the city and Canvas Street, home of the Dead End Butcher.',
      'pt-BR': 'A Esfera entre a cidade e a Rua Canvas, lar do Carniceiro do Beco.',
    },
  },
  {
    id: 'hollow-zero',
    unlockedAt: 'z-hollow-zero',
    term: { en: 'Hollow Zero', 'pt-BR': 'Hollow Zero' },
    definition: {
      en: 'The oldest and most dangerous Hollow, source of the city’s major Hollows and of much of the old capital’s destruction.',
      'pt-BR':
        'A Esfera mais antiga e perigosa, origem das grandes Esferas da cidade e de boa parte da destruição da antiga capital.',
    },
  },
  {
    id: 'hand',
    unlockedAt: 'z-hollow-zero',
    term: { en: 'H.A.N.D.', 'pt-BR': 'H.A.N.D.' },
    definition: {
      en: 'Government body whose Hollow Special Operations sections — like Section 6 — handle the deadliest Hollow threats.',
      'pt-BR':
        'Órgão do governo cujas Forças Especiais em Esferas — como a Seção 6 — cuidam das ameaças mais letais.',
    },
  },
  {
    id: 'blg-prototype',
    revisions: [
      {
        at: 'c2b-monster',
        text: {
          en: 'Belobog’s first smart construction machine, lost when the old capital fell. Found in the monument, it held the receipt that cleared Khors.',
          'pt-BR':
            'A primeira máquina de construção inteligente da Belobog, perdida na queda da antiga capital. Encontrada no monumento, guardava o recibo que inocentou Khors.',
        },
      },
    ],
    unlockedAt: 'c2a-khors',
    term: { en: 'BLG_prototype', 'pt-BR': 'BLG_prototype' },
    definition: {
      en: 'Belobog’s first smart construction machine, lost when the old capital fell — and still sending signals.',
      'pt-BR':
        'A primeira máquina de construção inteligente da Belobog, perdida na queda da antiga capital — e ainda emitindo sinais.',
    },
  },
  {
    id: 'emp',
    revisions: [
      {
        at: 'i2b-convoy',
        text: {
          en: 'An illegal device that fries nearby electronics. The gang using it was really after the convoy carrying the monster’s remains.',
          'pt-BR':
            'Aparelho ilegal que frita os eletrônicos ao redor. A gangue que o usava queria, na verdade, o comboio com os restos do monstro.',
        },
      },
    ],
    aliases: { en: ['EMP emitter', 'EMP'], 'pt-BR': ['emissor de PEM', 'PEM'] },
    unlockedAt: 'i2a-emp',
    term: { en: 'EMP emitter', 'pt-BR': 'Emissor de PEM' },
    definition: {
      en: 'An illegal device that fries nearby electronics; a Hollow Raider gang has been using them to steal vehicles.',
      'pt-BR':
        'Aparelho ilegal que frita os eletrônicos ao redor; uma gangue de Saqueadores vem usando para roubar veículos.',
    },
  },
  {
    id: 'dullahan',
    unlockedAt: 'p-strongbox',
    term: { en: 'Dullahan', 'pt-BR': 'Dullahan' },
    definition: {
      en: 'The superior Ethereal — sword for an arm — that Miguel Silver became after severe Ether corruption inside the Hollow.',
      'pt-BR':
        'O Etéreo superior — com uma espada no lugar do braço — em que Miguel Silver se transformou após a corrupção por Éter dentro da Esfera.',
    },
  },
  {
    id: 'random-play',
    unlockedAt: 'p-phaethon',
    term: { en: 'Random Play', 'pt-BR': 'Random Play' },
    definition: {
      en: 'The video rental store on Sixth Street run by Belle and Wise — and the perfect cover for Phaethon.',
      'pt-BR':
        'A locadora de vídeos da Rua Seis tocada por Belle e Wise — e o disfarce perfeito para Phaethon.',
    },
  },
  {
    id: 'sixth-street',
    unlockedAt: 'p-phaethon',
    term: { en: 'Sixth Street', 'pt-BR': 'Rua Seis' },
    definition: {
      en: 'The neighborhood around Random Play: a noodle shop, a café, an arcade, a convenience store run by Bangboo and lots of curious neighbors.',
      'pt-BR':
        'O bairro da Random Play: lámen, café, fliperama, uma loja de conveniência tocada por Bangboo e muitos vizinhos curiosos.',
    },
  },
  {
    id: 'canvas-street',
    unlockedAt: 'c1a-client',
    term: { en: 'Canvas Street', 'pt-BR': 'Rua Canvas' },
    definition: {
      en: 'An old neighborhood by the abandoned metro lines, inside the area Vision plans to demolish.',
      'pt-BR':
        'Um bairro antigo junto às linhas abandonadas do metrô, dentro da área que a Visão planeja demolir.',
    },
  },
  {
    id: 'dead-end-butcher',
    revisions: [
      {
        at: 'c1b-butcher',
        text: {
          en: 'The enormous Ethereal that ruled the Dead End Hollow — until Phaethon killed it with Vision’s own explosives and the Hollow shrank.',
          'pt-BR':
            'O Etéreo enorme que dominava a Esfera Sem Saída — até Phaethon matá-lo com os explosivos da própria Visão e a Esfera encolher.',
        },
      },
    ],
    unlockedAt: 'c1a-hideouts',
    term: { en: 'Dead End Butcher', 'pt-BR': 'Carniceiro do Beco' },
    aliases: { en: ['Butcher'], 'pt-BR': ['Carniceiro'] },
    definition: {
      en: 'An infamous, enormous Ethereal that rules the Dead End Hollow. Even Vision preferred to sneak its trains around it.',
      'pt-BR':
        'Um Etéreo enorme e temido que domina a Esfera Sem Saída. Até a Visão preferiu desviar seus trens dele.',
    },
  },
  {
    id: 'nineveh',
    unlockedAt: 'z-hollow-zero',
    term: { en: 'Nineveh', 'pt-BR': 'Nineveh' },
    definition: {
      en: 'A colossal Ethereal in Hollow Zero. Even Section 6’s chief couldn’t seriously hurt it with one clean slash.',
      'pt-BR':
        'Um Etéreo colossal da Hollow Zero. Nem um golpe certeiro da chefe da Seção 6 conseguiu feri-lo de verdade.',
    },
  },
  {
    id: 'pioneers-plaza',
    unlockedAt: 'c2b-sisters',
    term: { en: 'Pioneer’s Memorial Plaza', 'pt-BR': 'Praça Memorial dos Pioneiros' },
    definition: {
      en: 'The memorial plaza Belobog was building in a development area near the old capital when Khors disappeared.',
      'pt-BR':
        'A praça memorial que a Belobog construía numa área de expansão perto da antiga capital quando Khors sumiu.',
    },
  },
] satisfies GlossaryTermInput[]
