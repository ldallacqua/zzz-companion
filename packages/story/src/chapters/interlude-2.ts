import type { ChapterInput } from '@zzz/core'

const wiki = 'https://zenless-zone-zero.fandom.com/wiki/'

export const interlude2a = {
  id: 'interlude-2a',
  kind: 'interlude',
  label: { en: 'Ch. 2 Interlude A', 'pt-BR': 'Interlúdio do Cap. 2 (A)' },
  title: { en: 'Mission Unthinkable (A)', 'pt-BR': 'Missão Extraordinária I' },
  version: '1.0',
  accent: '#ff3b5c',
  sources: [
    { label: 'ZZZ Wiki — Mission Unthinkable (A)', url: `${wiki}Mission_Unthinkable_(A)` },
    { label: 'ZZZ Wiki — Zhu Yuan (Lore)', url: `${wiki}Zhu_Yuan/Lore` },
  ],
  segments: [
    {
      id: 'i2a-officers',
      title: { en: 'Two Officers', 'pt-BR': 'Duas oficiais' },
      episodes: ['Crisis on the Street Corner', 'Unexpected Reunion'],
      characters: ['zhu-yuan', 'qingyi', 'bringer', 'koleda', 'belle', 'wise', 'nicole'],
      tldr: {
        en: 'A strange car accident introduces Officers Zhu Yuan and Qingyi, who handled the monster case — and whose boss, Inspector Bringer, seems more worried about the election than the evidence.',
        'pt-BR':
          'Um acidente de carro estranho apresenta as oficiais Zhu Yuan e Qingyi, que cuidaram do caso do monstro — e cujo chefe, o inspetor Bringer, parece mais preocupado com a eleição do que com as provas.',
      },
      summary: {
        en: [
          'Public Security keeps the monster’s remains, but an automated evidence carrier will deliver them through the Hollow to **H.A.N.D.** for expert analysis. Meanwhile, renewing their driver’s licenses in Lumina Square, the siblings are nearly hit by a car that loses control; Officer **Zhu Yuan** pulls Belle to safety. The driver can’t remember anything before the crash.',
          'Zhu Yuan and her partner **Qingyi**, of the Criminal Investigation Special Response Team, were the officers at the monument — to them, Eous was just “Belobog’s malfunctioning Bangboo”. Fairy’s footage shows Inspector **Justin Bringer** arriving for a photo op, fretting that news of an unknown monster could hurt his election and visibly startled that the evidence is going to H.A.N.D. He then reassigns both officers to organize his “Public Security Safety Awareness Month” seminar.',
        ],
        'pt-BR': [
          'A Segurança Pública fica com os restos do monstro, mas um transportador automático de provas vai levá-los pela Esfera até a **H.A.N.D.** para análise especializada. Enquanto isso, renovando a carteira de motorista na Praça Lumina, os irmãos quase são atropelados por um carro desgovernado; a oficial **Zhu Yuan** puxa Belle para longe. O motorista não lembra de nada antes da batida.',
          'Zhu Yuan e sua parceira **Qingyi**, da Equipe Especial de Investigação Criminal, eram as oficiais no monumento — para elas, Eous era só “o Bangboo com defeito da Belobog”. As gravações de Fairy mostram o inspetor **Justin Bringer** chegando atrás de uma foto, preocupado que a notícia de um monstro desconhecido atrapalhe sua eleição e visivelmente abalado por saber que as provas vão para a H.A.N.D. Em seguida, ele transfere as duas para organizar o seminário do “Mês de Conscientização sobre Segurança Pública”.',
        ],
      },
    },
    {
      id: 'i2a-hero',
      title: { en: 'The Hollow Hero', 'pt-BR': 'O Herói da Esfera' },
      episodes: ['Unproductive Visit'],
      characters: ['zhu-yuan', 'qingyi', 'bringer'],
      tldr: {
        en: 'Sixth Street snubs Bringer’s seminar: the old “Hollow Hero” now looks like a politician cozying up to TOPS — yet he once saved Zhu Yuan’s life.',
        'pt-BR':
          'A Rua Seis esnoba o seminário de Bringer: o antigo “Herói da Esfera” agora parece um político puxa-saco da TOPS — mas ele já salvou a vida de Zhu Yuan.',
      },
      summary: {
        en: [
          'Helping the officers hand out questionnaires, the siblings collect polite refusals from Asha, old Spike and General Chop. The General explains: before the old capital fell, Bringer was a beloved local commander who vanished in a Hollow during a rescue and miraculously came back — the “**Hollow Hero**”. Now residents see a man performing for cameras, favoring TOPS corporations and using the seminar to campaign for Commander of the Janus Quarter.',
          'Zhu Yuan takes it hard: as a child she was trapped in a Hollow, and Bringer saved her by giving up his own anti-corruption gear — the reason she became an officer. Qingyi’s take: only Bringer knows whether his conscience is clean; their job is to do what’s right.',
        ],
        'pt-BR': [
          'Ajudando as oficiais a distribuir questionários, os irmãos colecionam recusas educadas de Asha, do velho Spike e do General Chop. O General explica: antes da queda da antiga capital, Bringer era um comandante querido no bairro, que sumiu numa Esfera durante um resgate e voltou milagrosamente — o “**Herói da Esfera**”. Hoje os moradores veem um homem atuando para as câmeras, favorecendo as corporações da TOPS e usando o seminário como campanha para Comandante do Distrito Janus.',
          'Zhu Yuan sente o golpe: quando criança, ela ficou presa numa Esfera, e Bringer a salvou entregando o próprio equipamento anticorrupção — o motivo de ela ter virado policial. A visão de Qingyi: só Bringer sabe se tem a consciência limpa; o trabalho delas é fazer o que é certo.',
        ],
      },
    },
    {
      id: 'i2a-emp',
      title: { en: 'The Sixth Street Theft Case', 'pt-BR': 'O caso do furto na Rua Seis' },
      episodes: ['Sixth Street Theft Case', 'Invisible Assistant'],
      characters: ['zhu-yuan', 'qingyi', 'fairy', 'belle', 'wise'],
      tldr: {
        en: 'A Bangboo is accused of freeing a truckload of prize ducks; the real culprit is an EMP-wielding Hollow Raider, caught with Phaethon’s secret help.',
        'pt-BR':
          'Um Bangboo é acusado de soltar um caminhão de patos valiosos; o verdadeiro culpado é um Saqueador com um emissor de PEM, pego com a ajuda secreta de Phaethon.',
      },
      summary: {
        en: [
          'A Pegasos Logistics driver accuses Give Change, a convenience-store Bangboo, of opening his truck and releasing a load of expensive ducks. While everyone hunts ducks — Fairy quietly pointing the siblings to the hiding spots, which Qingyi finds suspiciously impressive — more vehicles act up: a van that won’t start, a car that swerves, headlights that won’t turn off.',
          'The officers connect the dots: an **EMP emitter** is frying electronics, including the phone of the driver in the Lumina Square crash. The suspect, **Carlo Maroon**, flees into a Hollow; Phaethon follows secretly through the HDD and helps corner him, while Qingyi senses “something small and agile” nearby. Maroon belongs to a Hollow Raider gang building EMP devices to steal vehicles, and the impressed residents agree to attend the seminar after all.',
        ],
        'pt-BR': [
          'Um motorista da Pegasos Logistics acusa o Give Change, Bangboo da loja de conveniência, de abrir seu caminhão e soltar uma carga de patos caríssimos. Enquanto todo mundo caça patos — com Fairy indicando discretamente os esconderijos aos irmãos, o que Qingyi acha impressionante até demais —, outros veículos dão pane: uma van que não liga, um carro que desvia sozinho, faróis que não apagam.',
          'As oficiais ligam os pontos: um **emissor de PEM** está fritando eletrônicos, inclusive o celular do motorista do acidente na Praça Lumina. O suspeito, **Carlo Maroon**, foge para uma Esfera; Phaethon o segue em segredo pelo HDD e ajuda a encurralá-lo, enquanto Qingyi sente “algo pequeno e ágil” por perto. Maroon faz parte de uma gangue de Saqueadores que fabrica emissores de PEM para roubar veículos, e os moradores, impressionados, decidem ir ao seminário afinal.',
        ],
      },
    },
  ],
} satisfies ChapterInput

export const interlude2b = {
  id: 'interlude-2b',
  kind: 'interlude',
  label: { en: 'Ch. 2 Interlude B', 'pt-BR': 'Interlúdio do Cap. 2 (B)' },
  title: { en: 'Mission Unthinkable (B)', 'pt-BR': 'Missão Extraordinária II' },
  version: '1.0',
  accent: '#ff3b5c',
  sources: [
    { label: 'ZZZ Wiki — Mission Unthinkable (B)', url: `${wiki}Mission_Unthinkable_(B)` },
    { label: 'ZZZ Wiki — Justin Bringer', url: `${wiki}Justin_Bringer` },
    { label: 'ZZZ Wiki — We’ll Meet Again', url: `${wiki}We%27ll_Meet_Again` },
  ],
  segments: [
    {
      id: 'i2b-convoy',
      title: { en: 'The Evidence Convoy', 'pt-BR': 'O comboio de provas' },
      episodes: [
        'Emerging Crisis',
        'Emergency Operation',
        'Shared Beliefs',
        'Moment to Counterattack',
      ],
      characters: ['zhu-yuan', 'qingyi', 'fairy', 'bringer'],
      confidence: 'partial',
      tldr: {
        en: 'On seminar day, Zhu Yuan and Qingyi realize the EMP gang’s real target is the convoy carrying the monster’s remains — and, with Phaethon’s help, take the evidence back.',
        'pt-BR':
          'No dia do seminário, Zhu Yuan e Qingyi percebem que o verdadeiro alvo da gangue do PEM é o comboio com os restos do monstro — e, com a ajuda de Phaethon, recuperam as provas.',
      },
      summary: {
        en: [
          'The EMP thefts were only the warm-up. On the day of Bringer’s seminar, the same gang strikes the **evidence convoy** carrying the monster’s Ether remains to H.A.N.D. Zhu Yuan and Qingyi notice that the EMP incidents line up with the convoy’s route and leave the event to stop the theft.',
          'The route was top secret, so the officers conclude someone inside Public Security must be feeding the thieves — a mole they can’t yet identify. With Phaethon guiding them through the Hollow, they find the evidence carrier, beat the attackers and recover the evidence, building real trust with the mysterious Proxy along the way.',
        ],
        'pt-BR': [
          'Os furtos com PEM eram só o aquecimento. No dia do seminário de Bringer, a mesma gangue ataca o **comboio de provas** que leva os restos de Éter do monstro para a H.A.N.D. Zhu Yuan e Qingyi percebem que os incidentes com PEM batem com a rota do comboio e saem do evento para impedir o roubo.',
          'A rota era ultrassecreta, então as oficiais concluem que alguém de dentro da Segurança Pública está passando informações aos ladrões — um infiltrado que elas ainda não conseguem identificar. Com Phaethon guiando as duas pela Esfera, elas encontram o transportador de provas, derrotam os atacantes e recuperam as provas, ganhando confiança de verdade no Proxy misterioso.',
        ],
      },
    },
    {
      id: 'i2b-farewell',
      title: { en: 'We’ll Meet Again', 'pt-BR': 'Até a próxima' },
      episodes: ['We’ll Meet Again'],
      characters: ['zhu-yuan', 'qingyi', 'miyabi', 'sarah', 'perlman'],
      confidence: 'partial',
      tldr: {
        en: 'The officers’ temporary posting ends with a goodbye — and a final scene in prison hints that the Vision conspiracy is far from over.',
        'pt-BR':
          'A missão temporária das oficiais termina com uma despedida — e uma cena final na prisão indica que a conspiração da Visão está longe de acabar.',
      },
      summary: {
        en: [
          'With the evidence safe, Zhu Yuan and Qingyi’s temporary assignment comes to an end and they say goodbye to the siblings — though, as the title promises, they’ll meet again. Section 6’s Hoshimi Miyabi also appears in this closing episode.',
          'The interlude closes away from Sixth Street: in prison, the jailed **Charles Perlman** and **Sarah**, the woman who walked away from the Vision scandal, cross paths again. Whatever they are plotting, the story clearly isn’t done with them.',
        ],
        'pt-BR': [
          'Com as provas a salvo, a missão temporária de Zhu Yuan e Qingyi chega ao fim e elas se despedem dos irmãos — mas, como o título promete, eles vão se ver de novo. Hoshimi Miyabi, da Seção 6, também aparece nesse episódio de encerramento.',
          'O interlúdio termina longe da Rua Seis: na prisão, o detido **Charles Perlman** e **Sarah**, a mulher que escapou do escândalo da Visão, voltam a se cruzar. Seja o que for que estejam tramando, a história claramente não terminou com eles.',
        ],
      },
    },
  ],
} satisfies ChapterInput
