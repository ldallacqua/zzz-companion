import type { ChapterInput } from '@zzz/core'

const wiki = 'https://zenless-zone-zero.fandom.com/wiki/'

export const chapter2a = {
  id: 'chapter-2a',
  kind: 'chapter',
  label: { en: 'Ch. 2A', 'pt-BR': 'Cap. 2A' },
  title: {
    en: 'A Call From the Hollow’s Heart (A)',
    'pt-BR': 'Chamado do Coração da Esfera Negra…? (A)',
  },
  version: '1.0',
  accent: '#ffd23f',
  sources: [
    {
      label: 'ZZZ Wiki — A Call From the Hollow’s Heart (A)',
      url: `${wiki}A_Call_From_the_Hollow%27s_Heart_(A)`,
    },
  ],
  segments: [
    {
      id: 'c2a-belobog',
      title: { en: 'Belobog Calls', 'pt-BR': 'A Belobog chama' },
      episodes: ['Assigned Commission', 'Problem Child'],
      characters: ['anton', 'ben', 'grace', 'koleda', 'fairy'],
      tldr: {
        en: 'Short on money, Phaethon takes a mysterious, well-paid job: Belobog Industries, now running the metro project, needs three runaway smart machines brought home.',
        'pt-BR':
          'Sem dinheiro, Phaethon aceita um serviço misterioso e bem pago: as Indústrias Pesadas Belobog, que assumiram a obra do metrô, precisam trazer de volta três máquinas inteligentes fugitivas.',
      },
      summary: {
        en: [
          'Money is tight: the new account earns a fraction of what Phaethon used to make. A large anonymous commission arrives, and Fairy traces the client’s avatar photo to the old capital metro construction site — now run by **Belobog Industries**, which took over after Vision’s fall. On a kids’ TV show, a Belobog worker gets ambushed with questions about an old company scandal.',
          'That worker, **Anton**, meets the siblings at 5 a.m. on Sixth Street (the Cunning Hares recommended Phaethon — for a cut, of course). At the site they meet engineer **Grace Howard**, accountant **Ben Bigger** and the young president **Koleda Belobog**. Rival companies are sabotaging Belobog at every turn, and after a logic-core update using code “he left behind”, three of Grace’s smart construction machines walked off deep into a Hollow.',
        ],
        'pt-BR': [
          'O dinheiro está curto: a conta nova rende uma fração do que Phaethon ganhava. Chega uma encomenda anônima generosa, e Fairy rastreia a foto de perfil do cliente até a obra do metrô da antiga capital — agora tocada pelas **Indústrias Pesadas Belobog**, que assumiram depois da queda da Visão. Num programa infantil de TV, um funcionário da Belobog é encurralado com perguntas sobre um antigo escândalo da empresa.',
          'Esse funcionário, **Anton**, encontra os irmãos às 5 da manhã na Rua Seis (as Lebres Astutas recomendaram Phaethon — em troca de comissão, claro). Na obra eles conhecem a engenheira **Grace Howard**, o contador **Ben Bigger** e a jovem presidente **Koleda Belobog**. Empresas rivais sabotam a Belobog o tempo todo, e, depois de uma atualização de núcleo lógico usando um código que “ele deixou”, três máquinas de construção inteligentes de Grace fugiram para o fundo de uma Esfera.',
        ],
      },
    },
    {
      id: 'c2a-machines',
      title: { en: 'Problem Children', 'pt-BR': 'Filhos problemáticos' },
      episodes: ['The Essence of Being a Bro', 'The Only Embrace', 'Savior’s Mission'],
      characters: ['anton', 'ben', 'grace', 'koleda'],
      tldr: {
        en: 'Each runaway machine has grown a personality — a self-proclaimed “bro”, a lovestruck borer and a pile driver ranting about a seal and its mentor, Khors.',
        'pt-BR':
          'Cada máquina fugitiva ganhou personalidade — um “brother” autodeclarado, uma perfuratriz apaixonada e um bate-estacas falando de um selo e de seu mestre, Khors.',
      },
      summary: {
        en: [
          'The grappler **Hans** now wants to be a fearless “bro”; Anton wins him over by saving him from an Ethereal and promising a proper rematch. The boring machine **Greta** has fallen in love with an old building, “Mr. White” — when she accidentally saws through it, Grace convinces her to come home and “rebuild him on new land”.',
          'The pile driver **Friday** ran deepest of all, near the old capital. It calls itself the “Enlightened Sinner”, insists it must “stabilize the seal” before it breaks, and swears it hears the call of its mentor: **Khors**. Koleda freezes at the name.',
        ],
        'pt-BR': [
          'A garra pesada **Hans** agora quer ser um “brother” destemido; Anton o conquista ao salvá-lo de um Etéreo e prometer uma revanche de verdade. A perfuratriz **Greta** se apaixonou por um prédio velho, o “Sr. White” — quando ela o corta sem querer, Grace a convence a voltar para casa e “reconstruí-lo em terra nova”.',
          'O bate-estacas **Friday** foi o que fugiu para mais longe, perto da antiga capital. Ele se diz o “Pecador Iluminado”, insiste que precisa “estabilizar o selo” antes que ele se rompa e jura ouvir o chamado de seu mestre: **Khors**. Koleda congela ao ouvir o nome.',
        ],
      },
    },
    {
      id: 'c2a-khors',
      title: { en: 'That Name', 'pt-BR': 'Aquele nome' },
      episodes: ['That Name'],
      characters: ['koleda', 'grace', 'ben', 'anton', 'khors'],
      tldr: {
        en: 'Khors Belobog — Koleda’s father — vanished the night before the old capital fell, accused of stealing company funds; now a signal from his lost prototype is calling the machines.',
        'pt-BR':
          'Khors Belobog — pai de Koleda — sumiu na noite anterior à queda da antiga capital, acusado de desviar dinheiro da empresa; agora um sinal do protótipo perdido dele está chamando as máquinas.',
      },
      summary: {
        en: [
          '**Khors Belobog** was Belobog’s former president and Koleda’s father. In a flashback, he promises a young Koleda she’ll ride the machine he is building and asks her to give it a name. The night before the old capital fell, a large sum vanished from the company’s accounts and Khors left after a strange phone call (“what exactly is in there?”). Public Security concluded he embezzled the money and ran.',
          'Koleda says she stopped thinking of him as her father long ago; Grace insists nobody ever proved he took the money, and the two clash. Then Grace finds why the machines ran: all three received a signal from deep in a Hollow coded **BLG_prototype** — Belobog’s first smart machine, built for Khors and lost along with its manufacturer when the old capital fell.',
        ],
        'pt-BR': [
          '**Khors Belobog** era o antigo presidente da Belobog e pai de Koleda. Num flashback, ele promete à pequena Koleda que ela vai andar na máquina que ele está construindo e pede que ela escolha um nome para ela. Na noite anterior à queda da antiga capital, uma grande quantia sumiu das contas da empresa e Khors saiu depois de um telefonema estranho (“o que exatamente tem lá dentro?”). A Segurança Pública concluiu que ele desviou o dinheiro e fugiu.',
          'Koleda diz que deixou de considerá-lo pai há muito tempo; Grace insiste que ninguém nunca provou que ele pegou o dinheiro, e as duas brigam. Então Grace descobre por que as máquinas fugiram: as três receberam um sinal do fundo de uma Esfera com o código **BLG_prototype** — a primeira máquina inteligente da Belobog, feita para Khors e perdida junto com o fabricante quando a antiga capital caiu.',
        ],
      },
    },
  ],
} satisfies ChapterInput

export const chapter2b = {
  id: 'chapter-2b',
  kind: 'chapter',
  label: { en: 'Ch. 2B', 'pt-BR': 'Cap. 2B' },
  title: {
    en: 'A Call From the Hollow’s Heart (B)',
    'pt-BR': 'Chamado do Coração da Esfera Negra…? (B)',
  },
  version: '1.0',
  accent: '#ffd23f',
  sources: [
    {
      label: 'ZZZ Wiki — A Call From the Hollow’s Heart (B)',
      url: `${wiki}A_Call_From_the_Hollow%27s_Heart_(B)`,
    },
  ],
  segments: [
    {
      id: 'c2b-sisters',
      title: { en: 'Sisters', 'pt-BR': 'Irmãs' },
      episodes: ['Searching for the Prototype', 'Sisters'],
      characters: ['koleda', 'grace', 'anton', 'ben', 'fairy'],
      tldr: {
        en: 'Using the three machines as relays, Belobog triangulates the prototype — and Grace’s reckless stand finally gets Koleda to say what she saw the night Khors left.',
        'pt-BR':
          'Usando as três máquinas como repetidoras, a Belobog triangula o protótipo — e a imprudência de Grace finalmente faz Koleda contar o que viu na noite em que Khors partiu.',
      },
      summary: {
        en: [
          'Koleda officially orders the search. Grace’s plan: place Hans, Greta and Friday as relays in a Hollow near the old capital border and triangulate the prototype’s fading replies. When Ethereals swarm her position, Grace refuses to stop transmitting; Koleda screams “Sis!” and the team rushes to save her.',
          'Fairy pins down the location: the monument at the center of **Pioneer’s Memorial Plaza**, the project Belobog was building when Khors disappeared. On the way, Koleda confesses that she saw her father leave that night with a bag stuffed with banknotes — why she stopped believing in him. Grace reminds her that facts aren’t always the truth.',
        ],
        'pt-BR': [
          'Koleda autoriza oficialmente a busca. O plano de Grace: posicionar Hans, Greta e Friday como repetidoras numa Esfera perto da fronteira da antiga capital e triangular as respostas cada vez mais fracas do protótipo. Quando Etéreos cercam a posição dela, Grace se recusa a parar a transmissão; Koleda grita “Mana!” e a equipe corre para salvá-la.',
          'Fairy encontra a localização: o monumento no centro da **Praça Memorial dos Pioneiros**, a obra que a Belobog estava construindo quando Khors sumiu. No caminho, Koleda confessa que viu o pai sair naquela noite com uma bolsa cheia de dinheiro — o motivo de ter deixado de acreditar nele. Grace lembra que fatos nem sempre são a verdade.',
        ],
      },
    },
    {
      id: 'c2b-monster',
      title: { en: 'The Monster in the Monument', 'pt-BR': 'O monstro no monumento' },
      episodes: ['Steel Devourer', 'Call That Name'],
      characters: ['koleda', 'grace', 'anton', 'ben', 'fairy', 'belle', 'wise'],
      tldr: {
        en: 'The prototype holds a receipt that clears Khors — and the monument hides a monster that devours Belobog’s machines until Koleda pilots her father’s machine.',
        'pt-BR':
          'O protótipo guarda um recibo que inocenta Khors — e o monumento esconde um monstro que devora as máquinas da Belobog até Koleda pilotar a máquina do pai.',
      },
      summary: {
        en: [
          'The prototype is clamped onto the monument. Its cockpit is riddled with close-range bullet holes, and on the console lies a signed bill: the missing money paid for the prototype itself. Khors didn’t run off with company funds — something terrible happened to him here, probably tied to that last phone call.',
          'Then the monument moves. A creature with shockingly high Ether — neither an Ethereal nor a corrupted human — absorbs Hans and Friday and grows huge. Koleda climbs into the prototype, remembers her father asking her to name it, and pins the monster against the monument until it falls.',
          'Public Security collects the remains. Koleda entrusts Phaethon with the prototype’s **encrypted memory unit**, which may show what Khors found. The siblings have their own reasons to study the monster — it may be linked to what they’ve been chasing — and the sibling who was there admits their eyes felt strange near it. Fairy suggests a hacker named **Rain**, one of Nicole’s contacts, to crack the encryption.',
        ],
        'pt-BR': [
          'O protótipo está agarrado ao monumento. A cabine está cheia de buracos de bala disparados à queima-roupa, e no painel há uma nota assinada: o dinheiro desaparecido pagou o próprio protótipo. Khors não fugiu com o dinheiro da empresa — algo terrível aconteceu com ele ali, provavelmente ligado àquele último telefonema.',
          'Então o monumento se mexe. Uma criatura com Éter absurdamente alto — nem Etéreo, nem humano corrompido — absorve Hans e Friday e fica gigante. Koleda entra no protótipo, lembra do pai pedindo que ela desse um nome à máquina e prensa o monstro contra o monumento até ele cair.',
          'A Segurança Pública recolhe os restos. Koleda confia a Phaethon a **unidade de memória criptografada** do protótipo, que pode mostrar o que Khors descobriu. Os irmãos têm motivos próprios para estudar o monstro — ele pode estar ligado ao que eles procuram — e quem estava lá admite que os olhos ficaram estranhos perto dele. Fairy sugere uma hacker chamada **Rain**, contato da Nicole, para quebrar a criptografia.',
        ],
      },
    },
  ],
} satisfies ChapterInput
