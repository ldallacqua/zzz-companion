import type { ChapterInput } from '@zzz/core'

const wiki = 'https://zenless-zone-zero.fandom.com/wiki/'

export const prologue = {
  id: 'prologue',
  kind: 'prologue',
  label: { en: 'Prologue', 'pt-BR': 'Prólogo' },
  title: {
    en: 'Business × Strangeness × Justness',
    'pt-BR': 'Negócios × Estranheza × Justiça',
  },
  version: '1.0',
  accent: '#c6ff2e',
  sources: [
    {
      label: 'ZZZ Wiki — Business x Strangeness x Justness',
      url: `${wiki}Business_x_Strangeness_x_Justness`,
    },
    { label: 'ZZZ Wiki — The Proxy and the Hare (dialogue)', url: `${wiki}The_Proxy_and_the_Hare` },
  ],
  segments: [
    {
      id: 'p-strongbox',
      title: { en: 'The Strongbox Job', 'pt-BR': 'O serviço do cofre' },
      episodes: {
        en: ['A Surprise', 'Hollow Survival Guide', 'Mutated Corruption'],
        'pt-BR': ['Uma Surpresa', 'Guia de Sobrevivência na Esfera Negra', 'Mutação Corrompida'],
      },
      characters: ['nicole', 'anby', 'billy', 'miguel-silver', 'bringer'],
      tldr: {
        en: 'The Cunning Hares steal a mysterious strongbox back from the Red Fang Gang — and an air strike drops Anby, Billy and the gang’s leader into a Hollow.',
        'pt-BR':
          'A Casa das Lebres Astutas rouba de volta um cofre misterioso da Gangue da Presa Rubra — e um ataque aéreo derruba Anby, Billy e o líder da gangue dentro de uma Esfera Negra.',
      },
      summary: {
        en: [
          'A Companion Hollow erupts on Fourteenth Street in the Janus Quarter while Public Security — represented on TV by a flustered **Justin Bringer** — hunts the **Red Fang Gang**. The gang had stolen a **strongbox** from a research institute, and the odd-job agency **Cunning Hares** (Nicole, Anby and Billy) has just stolen it back for an undisclosed client.',
          'Cornered by gang leader **Miguel Silver**, nicknamed “Silver Tears”, Nicole fires a flashbang to attract the Public Security air force. It works a little too well: the air strike blows the building open and Anby, Billy and Silver fall into the **Cretan Hollow**, by the old metro junction.',
          'Inside, Anby records a deadpan “survival log” and reunites with Billy — after quizzing him to make sure he isn’t an Ethereal impostor. They find Silver with the strongbox at his feet, but severe Ether corruption turns him into a superior Ethereal, the **Dullahan**. Outgunned, they retreat.',
        ],
        'pt-BR': [
          'Uma Esfera Negra (Hollow) companheira surge na Rua Catorze, no Distrito Janus, enquanto a Segurança Pública — representada na TV por um atrapalhado **Justin Bringer** — caça a **Gangue da Presa Rubra**. A gangue tinha roubado um **cofre** de um instituto de pesquisa, e a agência de bicos **Casa das Lebres Astutas** (Nicole, Anby e Billy) acabou de roubá-lo de volta para um cliente misterioso.',
          'Encurralada pelo líder da gangue, **Miguel Silver** — o “Lágrimas de Prata” —, Nicole dispara uma granada de luz para atrair a força aérea da Segurança Pública. Funciona até demais: o ataque aéreo abre o prédio e Anby, Billy e Silver caem na **Esfera de Creta**, perto do antigo entroncamento do metrô.',
          'Lá dentro, Anby grava um “diário de sobrevivência” impassível e reencontra Billy — depois de interrogá-lo para garantir que ele não é um Etéreo imitando o colega. Os dois acham Silver com o cofre aos pés, mas a corrupção por Éter o transforma num Etéreo superior, o **Dullahan**. Sem poder de fogo, eles recuam.',
        ],
      },
    },
    {
      id: 'p-phaethon',
      title: { en: 'Enter Phaethon', 'pt-BR': 'Entra Phaethon' },
      episodes: {
        en: ['Proxy Business', 'Emergency'],
        'pt-BR': ['Negócio de Proxy', 'Emergência'],
      },
      characters: ['belle', 'wise', 'eous', 'nicole', 'anby', 'billy'],
      tldr: {
        en: 'Nicole hires the legendary Proxy Phaethon — secretly the siblings Belle and Wise, who run the Random Play video store — to get her team and the strongbox out.',
        'pt-BR':
          'Nicole contrata o lendário Proxy Phaethon — na verdade os irmãos Belle e Wise, donos da locadora Random Play — para tirar a equipe e o cofre da Esfera.',
      },
      summary: {
        en: [
          'On Sixth Street, siblings **Belle** and **Wise** run the **Random Play** video store. Secretly they are **Phaethon**, a legendary **Proxy**: an illegal guide who reads Hollows from the outside and leads people through them, using the **HDD** (Hollow Deep Dive System) to link their mind to the Bangboo **Eous**.',
          'A wounded Nicole barges in. Billy and Anby are stuck in the Hollow, and she can’t ask the Hollow Investigative Association for help without exposing the Hares as **Hollow Raiders**. She promises to finally clear her overdue bill. Phaethon gets the two out, and Nicole hands over a **tooth necklace** — actually Silver’s damaged flash drive — for the siblings to recover.',
          'While the data is restored, Phaethon opens an alternate **Inter-Knot** account (partly so Nicole can keep her usual “discount”) and takes small jobs around Sixth Street; one of them gets Anby a new W-Engine from the Box Galaxy shop. With the data recovered, the Hares lay out the plan: go back into the Cretan Hollow, beat the Dullahan and take the strongbox.',
        ],
        'pt-BR': [
          'Na Rua Seis, os irmãos **Belle** e **Wise** cuidam da locadora **Random Play**. Em segredo, eles são **Phaethon**, um **Proxy** lendário: guias ilegais que leem as Esferas Negras de fora e conduzem pessoas por dentro delas, usando o **HDD** (Sistema de Mergulho Profundo em Esferas) para ligar a mente ao Bangboo **Eous**.',
          'Nicole chega ferida. Billy e Anby estão presos na Esfera, e ela não pode pedir ajuda à Associação de Investigação de Esferas Negras sem expor as Lebres como **Saqueadoras**. Ela promete, enfim, quitar a conta atrasada. Phaethon resgata os dois, e Nicole entrega um **colar de dente** — na verdade o pen drive danificado de Silver — para os irmãos recuperarem.',
          'Enquanto os dados são restaurados, Phaethon cria uma conta alternativa no **Interlaço** (Inter-Knot) — em parte para manter o “desconto” de sempre da Nicole — e faz bicos pela Rua Seis; num deles, Anby ganha um Motor-W novo da loja Box Galaxy. Com os dados recuperados, as Lebres traçam o plano: voltar à Esfera de Creta, derrotar o Dullahan e pegar o cofre.',
        ],
      },
    },
    {
      id: 'p-hacker',
      title: { en: 'Hijacked', 'pt-BR': 'Sequestro digital' },
      episodes: {
        en: ['Hacking Attack', 'Reconnected'],
        'pt-BR': ['Ataque Hacker', 'Conexão Reestabelecida'],
      },
      characters: ['belle', 'wise', 'eous', 'nicole', 'anby', 'billy'],
      tldr: {
        en: 'A hacker hijacks the HDD mid-mission; to save the Hares, Phaethon sacrifices its legendary Inter-Knot account — and opening the strongbox overloads everything.',
        'pt-BR':
          'Um hacker sequestra o HDD no meio da missão; para salvar as Lebres, Phaethon sacrifica sua lendária conta no Interlaço — e abrir o cofre sobrecarrega tudo.',
      },
      summary: {
        en: [
          'Inside the Hollow, Eous starts lagging and goes silent: someone has taken over the HDD. Stranded, Billy suggests trading the Proxy’s identity to nearby investigators — before the election, Public Security goes easy on anyone who reports a Proxy. Nicole refuses and protects the Bangboo instead.',
          'A mysterious **hacker** threatens to wipe the siblings’ data unless they hand over the strongbox’s code, recovered from Silver’s drive. That’s how they learn what is inside: something comparable to the **Rosetta Data**, the master Hollow data the city’s rulers use to recalibrate Carrots — enough to enter and leave Hollows freely.',
          'Belle and Wise play along, hand over the **Phaethon** Inter-Knot account… and immediately report that account to Public Security’s Proxy hotline. The hacker flees and the siblings regain control, but the legendary account is gone. Back in the Hollow, the Hares beat the Dullahan and grab the strongbox, only to find no way out. Phaethon promises to bring them home and has Eous insert the strongbox’s chip — and the link overloads.',
        ],
        'pt-BR': [
          'Dentro da Esfera, Eous começa a travar e fica mudo: alguém invadiu o HDD. Sem saída, Billy sugere entregar a identidade do Proxy aos investigadores ali perto — às vésperas da eleição, a Segurança Pública alivia para quem denuncia Proxies. Nicole recusa e protege o Bangboo.',
          'Um **hacker** misterioso ameaça apagar os dados dos irmãos se eles não entregarem a senha do cofre, recuperada do pen drive de Silver. Assim eles descobrem o que há lá dentro: algo comparável aos **Dados de Rosetta**, os dados-mestre das Esferas que os governantes da cidade usam para recalibrar os Carotenos (Carrots) — o suficiente para entrar e sair de Esferas à vontade.',
          'Belle e Wise fingem ceder, entregam a conta **Phaethon** do Interlaço… e na mesma hora denunciam essa conta à linha direta da Segurança Pública. O hacker foge e eles retomam o controle, mas a conta lendária se perde. De volta à Esfera, as Lebres derrotam o Dullahan e pegam o cofre, mas não encontram saída. Phaethon promete levá-las para casa e faz Eous inserir o chip do cofre — e a conexão sobrecarrega.',
        ],
      },
    },
    {
      id: 'p-fairy',
      title: { en: 'Fairy', 'pt-BR': 'Fairy' },
      episodes: {
        en: ['“Fairy”', 'Prologue: Intermission'],
        'pt-BR': ['“Fada”', 'Prólogo: Interlúdio'],
      },
      characters: ['belle', 'wise', 'fairy', 'shepherd', 'nicole'],
      tldr: {
        en: 'The HDD reboots with a new tenant: Fairy, an AI with access to most of the city’s devices, bound to the siblings by an “agreement” it refuses to explain.',
        'pt-BR':
          'O HDD reinicia com uma nova inquilina: Fairy, uma IA com acesso à maioria dos aparelhos da cidade, ligada aos irmãos por um “acordo” que ela se recusa a explicar.',
      },
      summary: {
        en: [
          'The overloaded sibling wakes up at home. While they were out cold, Eous moved on its own and led everyone to the exit; Nicole brought a mysterious doctor she knows to pull them out of the HDD — and paid her bill in full (minus repairs and medical costs).',
          'The rebooted HDD now hosts **Fairy**, a “type III general-purpose AI” that calls the siblings “Master”. She cites a user agreement they don’t remember signing, says she is waiting for an “opportunity”, and claims access to over 80% of New Eridu’s smart devices. She calculates Hollow escape routes about 270 times faster than the siblings — a power the city’s elites would kill for.',
          'With their legendary account gone, Phaethon starts from zero on the new one. Old broker friend **Shepherd** passes them a rescue job for Vision Corporation, Fairy shoves every other support plug-in aside, and the siblings decide to use her while quietly investigating where she came from. Nicole, meanwhile, digs into who ordered the strongbox job — she only ever dealt with an anonymous middleman.',
        ],
        'pt-BR': [
          'O irmão que estava conectado acorda em casa. Enquanto estava desacordado, Eous se moveu sozinho e guiou todos até a saída; Nicole trouxe um médico misterioso que ela conhece para desconectá-lo do HDD — e pagou a conta inteira (descontados os reparos e o médico).',
          'O HDD reiniciado agora abriga **Fairy**, uma “IA de uso geral tipo III” que chama os irmãos de “Mestre”. Ela cita um contrato de usuário que eles não lembram de ter assinado, diz que está esperando uma “oportunidade” e afirma ter acesso a mais de 80% dos aparelhos inteligentes de Nova Eridu. Ela calcula rotas de fuga das Esferas umas 270 vezes mais rápido que os irmãos — um poder pelo qual a elite da cidade mataria.',
          'Sem a conta lendária, Phaethon recomeça do zero na conta nova. O velho amigo e corretor **Shepherd** passa um resgate encomendado pela Corporação Visão, Fairy descarta todos os outros plug-ins de suporte, e os irmãos decidem usá-la enquanto investigam, em silêncio, de onde ela veio. Nicole, por sua vez, tenta descobrir quem encomendou o serviço do cofre — ela só falou com um intermediário anônimo.',
        ],
      },
    },
  ],
} satisfies ChapterInput
