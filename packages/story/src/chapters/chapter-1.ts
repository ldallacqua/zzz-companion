import type { ChapterInput } from '@zzz/core'

const wiki = 'https://zenless-zone-zero.fandom.com/wiki/'

export const chapter1a = {
  id: 'chapter-1a',
  kind: 'chapter',
  label: { en: 'Ch. 1A', 'pt-BR': 'Cap. 1A' },
  title: { en: 'Cat’s Lost & Found (A)', 'pt-BR': 'Achados e Perdidos do Gato (A)' },
  version: '1.0',
  accent: '#ff8a1f',
  sources: [
    { label: 'ZZZ Wiki — Cat’s Lost & Found (A)', url: `${wiki}Cat%27s_Lost_%26_Found_(A)` },
    {
      label: 'ZZZ Wiki — Explosive Last Train (HDD dialogue)',
      url: `${wiki}Explosive_Last_Train_(HDD)`,
    },
  ],
  segments: [
    {
      id: 'c1a-client',
      title: { en: 'A Client with Two Tails', 'pt-BR': 'Uma cliente de duas caudas' },
      episodes: {
        en: ['An Uninvited Guest', 'Client with Two Tails'],
        'pt-BR': ['Uma Visita Inesperada', 'Cliente com Duas Caudas'],
      },
      characters: ['perlman', 'nekomata', 'nicole', 'anby', 'billy', 'fairy'],
      tldr: {
        en: 'Vision Corporation is shipping explosives through the Dead End Hollow to demolish the old metro — and a cat Thiren named Nekomata says the Cunning Hares are trapped in the blast zone.',
        'pt-BR':
          'A Corporação Visão está levando explosivos pela Esfera Sem Saída para demolir o antigo metrô — e uma Tirena gata chamada Nekomata diz que as Lebres Astutas estão presas na zona de explosão.',
      },
      summary: {
        en: [
          'On TV, **Charles Perlman** of the **Vision Corporation** brags about the old capital metro renovation. Vision beat Belobog Industries for the contract by promising less time and money, and is moving Ether explosives by train through the **Dead End Hollow** to demolish the old lines around Canvas Street. When a reporter asks how they cut costs, a woman in red at his side shuts the question down.',
          'Then a cat Thiren crashes into Random Play: **Nekomata** (Nekomiya Mana), sent by Nicole. She insists the Hares are inside Vision’s supposedly evacuated blast zone, and Fairy plays back the recordings from Nicole’s Bangboo to show what happened.',
          'The footage: Red Fang Gang leftovers blame the Hares for Silver’s death and corner Nicole. Nekomata saves her and hires the Hares to recover a **family heirloom** that Silver took from her, hidden in one of three gang hideouts recently swallowed by Hollows. Anby notices she fights like someone from the gangs, but Nicole takes the job — the hideouts might also hold clues about the strongbox.',
        ],
        'pt-BR': [
          'Na TV, **Charles Perlman**, da **Corporação Visão**, se gaba da reforma do metrô da Velha Capital. A Visão venceu a Belobog na licitação prometendo menos prazo e menos custo, e está levando explosivos de Éter de trem pela **Esfera Sem Saída** para demolir as linhas antigas perto da Rua Canvas. Quando um repórter pergunta como eles cortaram custos, uma mulher de vermelho ao lado dele encerra o assunto.',
          'Aí uma Tirena gata invade a Random Play: **Nekomata** (Nekomiya Mana), enviada pela Nicole. Ela garante que as Lebres estão dentro da zona de explosão que a Visão diz ter evacuado, e Fada reproduz as gravações do Bangboo da Nicole para mostrar o que aconteceu.',
          'Nas imagens: sobras da Gangue da Presa Rubra culpam as Lebres pela morte de Argento e encurralam Nicole. Nekomata a salva e contrata as Lebres para recuperar uma **herança de família** que Argento teria tirado dela, guardada num dos três esconderijos da gangue engolidos por Esferas. Anby percebe que ela luta como alguém das gangues, mas Nicole aceita — os esconderijos podem ter pistas sobre o cofre.',
        ],
      },
    },
    {
      id: 'c1a-hideouts',
      title: { en: 'The Hideouts', 'pt-BR': 'Os esconderijos' },
      episodes: {
        en: ['Abandoned Rally Point', 'Lost Item'],
        'pt-BR': ['Ponto de Encontro Abandonado', 'Itens Perdidos'],
      },
      characters: ['nekomata', 'nicole', 'anby', 'billy'],
      tldr: {
        en: 'The heirloom hunt reveals a Red Fang Gang falling apart and leads to the last hideout: inside the Dead End Hollow, home of the infamous Dead End Butcher.',
        'pt-BR':
          'A caça à herança mostra uma Gangue da Presa Rubra em ruínas e leva ao último esconderijo: dentro da Esfera Sem Saída, lar do temido Carniceiro do Beco.',
      },
      summary: {
        en: [
          'The first hideouts show a gang in collapse: members deserting, ledgers burned, its old turf on Canvas Street now inside Vision’s demolition zone. Nekomata listens to the gangsters’ gossip a little too intently — and still won’t say what the heirloom actually is.',
          'She also flatters the Hares with forum posts claiming they “lured Silver into a Hollow and defeated him”, a story they awkwardly fail to correct. The last hideout is in the **Dead End Hollow**, the same Hollow Vision uses for its explosives train and home to the infamous **Dead End Butcher**. Nekomata raises the fee by 30%, and Nicole agrees to go in.',
        ],
        'pt-BR': [
          'Os primeiros esconderijos mostram uma gangue em colapso: membros desertando, livros-caixa queimados e o antigo território na Rua Canvas agora dentro da zona de demolição da Visão. Nekomata presta atenção demais à fofoca dos bandidos — e continua sem dizer o que é, afinal, a tal herança.',
          'Ela também bajula as Lebres com posts do fórum dizendo que elas “atraíram Argento para uma Esfera e o derrotaram”, história que elas, sem graça, não corrigem. O último esconderijo fica na **Esfera Sem Saída**, a mesma que a Visão usa para o trem de explosivos e lar do temido **Carniceiro do Beco** (Dead End Butcher). Nekomata aumenta o pagamento em 30%, e Nicole topa entrar.',
        ],
      },
    },
    {
      id: 'c1a-train',
      title: { en: 'The Last Train', 'pt-BR': 'O último trem' },
      episodes: {
        en: ['Explosive Last Train', 'Doubts Arise'],
        'pt-BR': ['Último Trem Explosivo', 'Novas Dúvidas'],
      },
      characters: ['nekomata', 'corin', 'fairy', 'eous', 'belle', 'wise'],
      tldr: {
        en: 'Phaethon reroutes Vision’s explosives train from inside the Hollow, but the “driverless” train turns out to be full of fake police officers.',
        'pt-BR':
          'Phaethon desvia o trem de explosivos da Visão por dentro da Esfera, mas o trem “sem condutor” está cheio de policiais falsos.',
      },
      summary: {
        en: [
          'Back in the present, Vision’s last explosives train is about to leave while Nicole and the others are still in the blast zone. Stopping it in public would expose everyone, so Fairy suggests intercepting it inside the Hollow. Nekomata carries Eous through the Dead End Hollow toward a track control room.',
          'On the way they meet **Corin**, a timid maid from a housekeeping company who got lost in the Hollow and saws through a wrecked train car with her chainsaw. They switch the tracks, guide Corin to an exit, and Nekomata throws Eous onto the roof of the passing train.',
          'Inside, the “unmanned” train is packed with armed men dressed as Public Security officers, complaining about their costumes and reporting to “Director Perlman”. Nekomata pulls Eous out and stays behind with her own Carrot. Vision quietly postpones the demolition for “technical difficulties”, and the siblings start to suspect Nekomata isn’t telling them everything.',
        ],
        'pt-BR': [
          'De volta ao presente: o último trem de explosivos da Visão está prestes a partir, e Nicole e os outros continuam na zona de explosão. Pará-lo em público exporia todo mundo, então Fada sugere interceptá-lo dentro da Esfera. Nekomata carrega Eous pela Esfera Sem Saída até uma sala de controle dos trilhos.',
          'No caminho eles encontram **Corin**, uma empregada tímida de uma empresa de serviços domésticos que se perdeu na Esfera e abre caminho por um vagão destruído com sua motosserra. Eles trocam os trilhos, levam Corin até uma saída, e Nekomata arremessa Eous no teto do trem que passa.',
          'Lá dentro, o trem “sem tripulação” está lotado de homens armados vestidos de policiais da Segurança Pública, reclamando das fantasias e se reportando ao “Diretor Perlman”. Nekomata tira Eous de lá e fica para trás com seu próprio Caroteno. A Visão adia a demolição em silêncio por “dificuldades técnicas”, e os irmãos começam a desconfiar que Nekomata não está contando tudo.',
        ],
      },
    },
  ],
} satisfies ChapterInput

export const chapter1b = {
  id: 'chapter-1b',
  kind: 'chapter',
  label: { en: 'Ch. 1B', 'pt-BR': 'Cap. 1B' },
  title: { en: 'Cat’s Lost & Found (B)', 'pt-BR': 'Achados e Perdidos do Gato (B)' },
  version: '1.0',
  accent: '#ff8a1f',
  sources: [
    { label: 'ZZZ Wiki — Cat’s Lost & Found (B)', url: `${wiki}Cat%27s_Lost_%26_Found_(B)` },
    {
      label: 'ZZZ Wiki — Earlybird Ticket to Safety (dialogue)',
      url: `${wiki}Earlybird_Ticket_to_Safety`,
    },
    { label: 'ZZZ Wiki — Charles Perlman', url: `${wiki}Charles_Perlman` },
  ],
  segments: [
    {
      id: 'c1b-captives',
      title: { en: 'The Girl in the Hollow', 'pt-BR': 'A menina na Esfera' },
      episodes: {
        en: ['Hidden Stories', 'Unexpected Captives'],
        'pt-BR': ['Histórias Ocultas', 'Prisioneiros Inesperados'],
      },
      characters: ['nekomata', 'nicole', 'anby', 'billy'],
      tldr: {
        en: 'Chasing a lost child through the Dead End Hollow, the Hares stumble onto Vision’s secret: over a hundred residents were never evacuated from the blast zone.',
        'pt-BR':
          'Correndo atrás de uma criança perdida na Esfera Sem Saída, as Lebres descobrem o segredo da Visão: mais de cem moradores nunca foram retirados da zona de explosão.',
      },
      summary: {
        en: [
          'Confronted by the siblings, Nekomata asks them to watch the rest of the recording. In the Dead End Hollow she spots a little girl running deeper in. Anby objects that it isn’t part of the job until Nekomata offers to pay extra — then says she’ll go anyway, no bribe needed — and the whole group gives chase.',
          'The girl, who has Ether aptitude, is actually the one rescuing them: she leads them away from the Butcher’s territory until the monster shows up and everyone tumbles through an exit — onto **Canvas Street**, inside the blast zone that was supposed to be empty.',
          'More than a hundred residents, mostly elderly or sick and without Ether aptitude, have been cut off for a week; a “Public Security officer” told them to wait for a train. The truth clicks: Vision won the bid by never paying to relocate anyone. Nicole smells a lawsuit (and a payday), Anby refuses to leave — “I won’t make the same mistake again” — and Nicole sends Nekomata back through the Hollow with her Bangboo to get Phaethon.',
        ],
        'pt-BR': [
          'Confrontada pelos irmãos, Nekomata pede que eles vejam o resto da gravação. Na Esfera Sem Saída, ela vê uma menininha correndo para o fundo. Anby reclama que isso não faz parte do serviço até Nekomata oferecer pagar a mais — e então diz que vai de qualquer jeito, sem precisar de suborno — e o grupo todo sai atrás.',
          'A menina, que tem aptidão para Éter, é quem está salvando o grupo: ela os afasta do território do Carniceiro até o monstro aparecer e todos caírem por uma saída — direto na **Rua Canvas**, dentro da zona de explosão que deveria estar vazia.',
          'Mais de cem moradores, quase todos idosos ou doentes e sem aptidão para Éter, estão isolados há uma semana; um “policial” mandou que esperassem um trem. A ficha cai: a Visão venceu a licitação porque nunca pagou para realocar ninguém. Nicole sente cheiro de processo (e de dinheiro), Anby se recusa a ir embora — “não vou cometer o mesmo erro de novo” — e Nicole manda Nekomata de volta pela Esfera com seu Bangboo para buscar Phaethon.',
        ],
      },
    },
    {
      id: 'c1b-train',
      title: { en: 'Seizing the Train', 'pt-BR': 'Tomando o trem' },
      episodes: { en: ['Second Rescue', 'Endlessness'], 'pt-BR': ['Segundo Resgate', 'Extinção'] },
      characters: ['nekomata', 'nicole', 'anby', 'billy', 'perlman', 'fairy'],
      tldr: {
        en: 'The plan to hijack Vision’s train collapses when Perlman’s men blow up the tracks — and Nekomata confesses she grew up with the Red Fang Gang.',
        'pt-BR':
          'O plano de sequestrar o trem da Visão desmorona quando os homens de Perlman explodem os trilhos — e Nekomata confessa que cresceu com a Gangue da Presa Rubra.',
      },
      summary: {
        en: [
          'Phaethon’s plan: slip behind the mercenaries through the Hollow, seize the train at the surveillance point and let Fairy drive the residents out. Before the assault, an elderly resident explains that the Red Fang Gang once took in local orphans and protected Canvas Street — until Silver changed. She also mentions Silver fell into the Hollow while fleeing Public Security, and Nekomata realizes the Hares never killed him.',
          'The Hares take the train and capture **Perlman** himself, but one of his mercenaries blows up the only track back to New Eridu. With Perlman as a hostage, the standoff freezes.',
          'Then Nekomata shows her “heirloom”: a photo of herself with Silver. She was one of the orphans the gang raised, and came to the Dead End Hollow looking for revenge on the Hares — who instead saved a child and stayed behind for strangers. To make up for what the gang became, she locks the others inside the train and walks Perlman through the Hollow to negotiate with Vision alone.',
        ],
        'pt-BR': [
          'O plano de Phaethon: contornar os mercenários pela Esfera, tomar o trem no posto de vigilância e deixar Fada dirigir os moradores para fora. Antes do ataque, uma moradora conta que a Presa Rubra já acolheu os órfãos do bairro e protegeu a Rua Canvas — até Argento mudar. Ela também comenta que Argento caiu na Esfera fugindo da Segurança Pública, e Nekomata percebe que as Lebres nunca o mataram.',
          'As Lebres tomam o trem e capturam o próprio **Perlman**, mas um dos mercenários explode o único trilho de volta a Nova Eridu. Com Perlman como refém, o impasse congela.',
          'Então Nekomata mostra sua “herança”: uma foto dela com Argento. Ela foi uma das órfãs criadas pela gangue e veio à Esfera Sem Saída para se vingar das Lebres — que, em vez disso, salvaram uma criança e ficaram por estranhos. Para compensar o que a gangue virou, ela tranca os outros no trem e leva Perlman a pé pela Esfera para negociar sozinha com a Visão.',
        ],
      },
    },
    {
      id: 'c1b-butcher',
      title: { en: 'The Butcher’s End', 'pt-BR': 'O fim do Carniceiro' },
      episodes: {
        en: ['Endlessness', 'Vagrant’s Final Resting Place', 'Chapter 1 Intermission'],
        'pt-BR': ['Extinção', 'O Descanso Final do Andarilho', 'Capítulo I: Interlúdio'],
      },
      characters: ['nicole', 'anby', 'billy', 'nekomata', 'sarah', 'perlman', 'fairy', 'eous'],
      tldr: {
        en: 'Phaethon kills the Dead End Butcher with Vision’s own explosives, the shrunken Hollow frees the residents, and Vision’s scheme is exposed live on TV.',
        'pt-BR':
          'Phaethon mata o Carniceiro do Beco com os explosivos da própria Visão, a Esfera encolhe e liberta os moradores, e o esquema da Visão é exposto ao vivo na TV.',
      },
      summary: {
        en: [
          'If the residents can’t cross the Hollow, shrink it: the Dead End Butcher alone carries the Ether of thousands of Ethereals. The Hares hold the Butcher off while Eous loads Vision’s own Ether explosives onto the train, and Fairy detonates them right on top of the monster.',
          'Outside, Nekomata offers herself as a scapegoat — “the Red Fang remnant who held residents hostage”. Instead, **Sarah**, the woman in red, sedates Perlman (“he’s not as useful to us as you think”), reveals she is the real mind behind the demolition plan and sets off the blast. But with the Butcher dead the Hollow has shrunk, and the residents walk out through the tunnel.',
          'Sarah orders her men to open fire — just as Public Security, the press and **Belobog Industries**, tipped off by Nicole, arrive. The mercenaries surrender with no residents hurt, Sarah disappears, Vision’s scandal goes public and Perlman is arrested. Thanks to her gang ties, Nekomata gets the Red Fang Gang off the Hares’ backs and joins the Cunning Hares. The leftovers of the gang know little about the strongbox: Silver took that job from a mysterious client.',
        ],
        'pt-BR': [
          'Se os moradores não conseguem atravessar a Esfera, ela precisa encolher: só o Carniceiro do Beco tem o Éter de milhares de Etéreos. As Lebres seguram o Carniceiro enquanto Eous carrega no trem os explosivos de Éter da própria Visão, e Fada os detona bem em cima do monstro.',
          'Do lado de fora, Nekomata se oferece como bode expiatório — “a remanescente da Presa Rubra que fez os moradores de reféns”. Em vez disso, **Sarah**, a mulher de vermelho, seda Perlman (“ele não é tão útil para nós quanto você pensa”), revela que é a verdadeira mente por trás da demolição e aciona a explosão. Mas, com o Carniceiro morto, a Esfera encolheu, e os moradores saem andando pelo túnel.',
          'Sarah manda seus homens abrirem fogo — bem na hora em que chegam a Segurança Pública, a imprensa e as **Indústrias Pesadas Belobog**, avisadas pela Nicole. Os mercenários se rendem sem nenhum morador ferido, Sarah desaparece, o escândalo da Visão vem a público e Perlman é preso. Graças aos laços com a gangue, Nekomata tira a Presa Rubra do pé das Lebres e entra para a Casa das Lebres Astutas. O que sobrou da gangue sabe pouco sobre o cofre: Argento pegou aquele serviço de um cliente misterioso.',
        ],
      },
    },
  ],
} satisfies ChapterInput

export const zeroZone = {
  id: 'zero-zone',
  kind: 'intermission',
  label: { en: 'Intermission', 'pt-BR': 'Intermissão' },
  title: { en: 'The Zero Zone', 'pt-BR': '“Zero” Eventos Estranhos' },
  version: '1.0',
  accent: '#2ee6ff',
  sources: [
    { label: 'ZZZ Wiki — The Zero Zone', url: `${wiki}The_Zero_Zone` },
    {
      label: 'ZZZ Wiki — Qualification Assessment (dialogue)',
      url: `${wiki}Qualification_Assessment`,
    },
  ],
  segments: [
    {
      id: 'z-hollow-zero',
      title: { en: 'Hollow Zero', 'pt-BR': 'Hollow Zero' },
      episodes: {
        en: ['Restricted Area Investigation', 'Mysterious Encounter', 'Frontline Pursuit'],
        'pt-BR': [
          'Investigação de Área Restrita',
          'Encontro Misterioso',
          'Perseguição na Linha de Frente',
        ],
      },
      characters: ['shepherd', 'fairy', 'ray', 'miyabi', 'yanagi', 'harumasa', 'soukaku', 'eous'],
      tldr: {
        en: 'A back-door test earns Phaethon a Hollow Zero license — and drops them into Section 6’s hunt for a colossal Ethereal.',
        'pt-BR':
          'Um teste “por baixo dos panos” rende a Phaethon uma licença para a Hollow Zero — e o coloca no meio da caçada da Seção 6 a um Etéreo colossal.',
      },
      summary: {
        en: [
          'Shepherd shows up late at night with news: the HIA is resuming investigations in **Hollow Zero**, the oldest and most dangerous Hollow — the source of New Eridu’s major Hollows and of much of the old capital’s destruction. He has arranged a test that could make Phaethon licensed independent investigators.',
          'The siblings grew up in the old capital and want answers inside Hollow Zero, though they keep their reasons from Fairy. At Scott Outpost they meet **Ray**, a White Star Institute researcher hungry for observation data.',
          'Mid-assessment, a colossal Ethereal called **Nineveh** appears. H.A.N.D.’s **Hollow Special Operations Section 6** — chief **Hoshimi Miyabi** (the “Void Hunter”), deputy **Tsukishiro Yanagi**, **Asaba Harumasa** and **Soukaku** — requisitions Eous as a “navigation Bangboo”, never suspecting it is remote-controlled. Miyabi’s blade barely hurts Nineveh, but together they drive it off, and Phaethon earns its license.',
        ],
        'pt-BR': [
          'Pastor aparece tarde da noite com uma notícia: a Associação vai retomar as investigações na **Hollow Zero**, a Esfera mais antiga e perigosa — origem das grandes Esferas de Nova Eridu e de boa parte da destruição da Velha Capital. Ele arranjou um teste que pode transformar Phaethon em investigadores independentes licenciados.',
          'Os irmãos cresceram na Velha Capital e querem respostas dentro da Hollow Zero, mas escondem os motivos de Fada. No Posto Avançado Scott eles conhecem **Ray**, pesquisadora do Instituto Estrela Branca faminta por dados de observação.',
          'No meio da avaliação surge um Etéreo colossal chamado **Nínive**. A **Seção 6 das Forças Especiais em Esferas Negras**, da H.A.N.D. — a chefe **Hoshimi Miyabi** (a “Caçadora do Vazio”), a vice **Tsukishiro Yanagi**, **Asaba Harumasa** e **Soukaku** — requisita Eous como “Bangboo de navegação”, sem suspeitar que ele é controlado remotamente. A lâmina de Miyabi mal fere Nínive, mas juntos eles o afastam, e Phaethon ganha a licença.',
        ],
      },
    },
  ],
} satisfies ChapterInput
