import type { DiscSetInput } from '@zzz/core'

/**
 * Every Drive Disc set (wiki "Category:Drive Discs", 30 as of v3.3, Nov 2026; sets the game
 * removed are left out). Names: each page's "Other Languages" table. Icons are hotlinked from the
 * wiki CDN, never committed. The 2- and 4-piece bonuses, in our words, live in `gear-notes.ts`.
 */
export const discSets: DiscSetInput[] = [
  {
    id: 'astral-voice',
    name: { en: 'Astral Voice', 'pt-BR': 'Voz Astral' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/c/cf/Drive_Disc_Astral_Voice_Icon.png/revision/latest?cb=20241220071227',
  },
  {
    id: 'branch-and-blade-song',
    name: { en: 'Branch & Blade Song', 'pt-BR': 'Canção da Espada de Ramo' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/b/b7/Drive_Disc_Branch_%26_Blade_Song_Icon.png/revision/latest?cb=20241220071219',
  },
  {
    id: 'bunny-in-wonderland',
    name: { en: 'Bunny in Wonderland', 'pt-BR': 'Coelhinho no País das Maravilhas' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/b/b6/Drive_Disc_Bunny_in_Wonderland_Icon.png/revision/latest?cb=20260324214635',
  },
  {
    id: 'chaos-jazz',
    name: { en: 'Chaos Jazz', 'pt-BR': 'Jazz Caótico' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/2/2e/Drive_Disc_Chaos_Jazz_Icon.png/revision/latest?cb=20241223020130',
  },
  {
    id: 'chaotic-metal',
    name: { en: 'Chaotic Metal', 'pt-BR': 'Metal Caótico' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/a/a5/Drive_Disc_Chaotic_Metal_Icon.png/revision/latest?cb=20241222103950',
  },
  {
    id: 'dawns-bloom',
    name: { en: "Dawn's Bloom", 'pt-BR': 'Florescer da Alvorada' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/7/78/Drive_Disc_Dawn%27s_Bloom_Icon.png/revision/latest?cb=20250922162614',
  },
  {
    id: 'fanged-metal',
    name: { en: 'Fanged Metal', 'pt-BR': 'Metal de Presas' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/1/16/Drive_Disc_Fanged_Metal_Icon.png/revision/latest?cb=20241222104934',
  },
  {
    id: 'feathered-fate',
    name: { en: 'Feathered Fate', 'pt-BR': 'Destino Emplumado' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/9/9d/Drive_Disc_Feathered_Fate_Icon.png/revision/latest?cb=20260731224923',
  },
  {
    id: 'freedom-blues',
    name: { en: 'Freedom Blues', 'pt-BR': 'Blues Livre' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/e/ea/Drive_Disc_Freedom_Blues_Icon.png/revision/latest?cb=20241222111636',
  },
  {
    id: 'hormone-punk',
    name: { en: 'Hormone Punk', 'pt-BR': 'Punk Hormonal' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/1/14/Drive_Disc_Hormone_Punk_Icon.png/revision/latest?cb=20241222223211',
  },
  {
    id: 'inferno-metal',
    name: { en: 'Inferno Metal', 'pt-BR': 'Metal Infernal' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/6/62/Drive_Disc_Inferno_Metal_Icon.png/revision/latest?cb=20241222111407',
  },
  {
    id: 'king-of-the-summit',
    name: { en: 'King of the Summit', 'pt-BR': 'Rei do Monte' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/b/be/Drive_Disc_King_of_the_Summit_Icon.png/revision/latest?cb=20250607050621',
  },
  {
    id: 'moonlight-lullaby',
    name: { en: 'Moonlight Lullaby', 'pt-BR': 'Ode ao Cavaleiro Lunar' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/b/ba/Drive_Disc_Moonlight_Lullaby_Icon.png/revision/latest?cb=20250922162639',
  },
  {
    id: 'notes-from-the-chained',
    name: { en: 'Notes From the Chained', 'pt-BR': 'Diário de um Detento' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/b/bf/Drive_Disc_Notes_From_the_Chained_Icon.png/revision/latest?cb=20260325100529',
  },
  {
    id: 'phaethons-melody',
    name: { en: "Phaethon's Melody", 'pt-BR': 'Melodia de Phaethon' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/3/3a/Drive_Disc_Phaethon%27s_Melody_Icon.png/revision/latest?cb=20250312034103',
  },
  {
    id: 'polar-metal',
    name: { en: 'Polar Metal', 'pt-BR': 'Metal Polar' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/e/e3/Drive_Disc_Polar_Metal_Icon.png/revision/latest?cb=20241222111236',
  },
  {
    id: 'proto-punk',
    name: { en: 'Proto Punk', 'pt-BR': 'Punk Primitivo' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/a/a0/Drive_Disc_Proto_Punk_Icon.png/revision/latest?cb=20241222111127',
  },
  {
    id: 'puffer-electro',
    name: { en: 'Puffer Electro', 'pt-BR': 'Techno Baiacu' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/d/d6/Drive_Disc_Puffer_Electro_Icon.png/revision/latest?cb=20241223015904',
  },
  {
    id: 'shadow-harmony',
    name: { en: 'Shadow Harmony', 'pt-BR': 'Harmonia das Sombras' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/5/5e/Drive_Disc_Shadow_Harmony_Icon.png/revision/latest?cb=20250312034109',
  },
  {
    id: 'shining-aria',
    name: { en: 'Shining Aria', 'pt-BR': 'Ária Reluzente' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/0/01/Drive_Disc_Shining_Aria_Icon.png/revision/latest?cb=20251231144111',
  },
  {
    id: 'shockstar-disco',
    name: { en: 'Shockstar Disco', 'pt-BR': 'Disco Estrelante' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/8/81/Drive_Disc_Shockstar_Disco_Icon.png/revision/latest?cb=20241222110749',
  },
  {
    id: 'soul-rock',
    name: { en: 'Soul Rock', 'pt-BR': 'Rock Espiritual' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/b/b6/Drive_Disc_Soul_Rock_Icon.png/revision/latest?cb=20241223020006',
  },
  {
    id: 'swing-jazz',
    name: { en: 'Swing Jazz', 'pt-BR': 'Jazz Com Swing' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/3/3e/Drive_Disc_Swing_Jazz_Icon.png/revision/latest?cb=20241222110616',
  },
  {
    id: 'the-sky-ablaze',
    name: { en: 'The Sky Ablaze', 'pt-BR': 'Crônicas da Alvorada' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/f/f6/Drive_Disc_The_Sky_Ablaze_Icon.png/revision/latest?cb=20260617075447',
  },
  {
    id: 'thorned-rose',
    name: { en: 'Thorned Rose', 'pt-BR': 'Rosa Espinhosa' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/0/08/Drive_Disc_Thorned_Rose_Icon.png/revision/latest?cb=20260731225004',
  },
  {
    id: 'thunder-metal',
    name: { en: 'Thunder Metal', 'pt-BR': 'Metal Trovoador' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/2/2b/Drive_Disc_Thunder_Metal_Icon.png/revision/latest?cb=20241222104206',
  },
  {
    id: 'white-water-ballad',
    name: { en: 'White Water Ballad', 'pt-BR': 'Canção das Ondas' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/6/61/Drive_Disc_White_Water_Ballad_Icon.png/revision/latest?cb=20251231144251',
  },
  {
    id: 'woodpecker-electro',
    name: { en: 'Woodpecker Electro', 'pt-BR': 'Techno Pica-Pau' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/1/1c/Drive_Disc_Woodpecker_Electro_Icon.png/revision/latest?cb=20241222223444',
  },
  {
    id: 'wuthering-salon',
    name: { en: 'Wuthering Salon', 'pt-BR': 'Salão Sibilante' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/f/f2/Drive_Disc_Wuthering_Salon_Icon.png/revision/latest?cb=20260617075312',
  },
  {
    id: 'yunkui-tales',
    name: { en: 'Yunkui Tales', 'pt-BR': 'Fábulas de Yunkui' },
    icon: 'https://static.wikia.nocookie.net/zenless-zone-zero/images/c/c7/Drive_Disc_Yunkui_Tales_Icon.png/revision/latest?cb=20250607050425',
  },
]
