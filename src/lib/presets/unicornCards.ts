export interface UnicornCardData {
  id: string;
  code: string;
  title: string;
  quote: string;
  guidance: string;
  theme: string;
  colorGradient: string;
}

export const UNICORN_CARDS: UnicornCardData[] = [
  {
    id: 'uni_01',
    code: 'UNI_01',
    title: '純真與奇蹟',
    quote: '保持如孩子般純真的眼睛，奇蹟正隱藏在你最意想不到的轉角。',
    guidance: '獨角獸提醒你：放下世俗的複雜算計，當你以玩樂與好奇的心情面對生活，純淨的奇蹟之門就會自動敞開。',
    theme: '奇蹟顯化',
    colorGradient: 'from-pink-900/80 via-purple-900/70 to-indigo-950/90'
  },
  {
    id: 'uni_02',
    code: 'UNI_02',
    title: '光芒的綻放',
    quote: '不要為了迎合他人而縮小自己的光芒，你天生就是為了照亮世界。',
    guidance: '允許自己完全展現真實的才華與熱情。當你不再害怕引人注目，那份靈魂的光芒將會吸引屬於你的靈魂家人。',
    theme: '自信自我',
    colorGradient: 'from-fuchsia-900/80 via-rose-900/70 to-slate-950/90'
  },
  {
    id: 'uni_03',
    code: 'UNI_03',
    title: '無條件的原諒',
    quote: '原諒不是為他人開脫，而是還給自己自由飛翔的翅膀。',
    guidance: '帶著獨角獸的慈悲之光，放下胸口積壓的怨懟。將這段過往包覆在粉紫色的光暈中，祝福彼此走入各自的最高善。',
    theme: '心靈療癒',
    colorGradient: 'from-violet-950/80 via-pink-950/70 to-slate-900/90'
  },
  {
    id: 'uni_04',
    code: 'UNI_04',
    title: '靈魂的召喚',
    quote: '那個反覆在你心中升起的微小願望，正是靈魂給你的神聖導航。',
    guidance: '別再拖延了！哪怕只是邁出一小步，去報名一門課、畫一幅畫、開始一個創作，獨角獸王國會全力為你護航。',
    theme: '人生使命',
    colorGradient: 'from-cyan-950/80 via-indigo-900/70 to-slate-950/90'
  },
  {
    id: 'uni_05',
    code: 'UNI_05',
    title: '甜美的安歇',
    quote: '休息不是退縮，而是在柔軟的光暈中重新充盈你的靈性羽翼。',
    guidance: '今天給自己一個無所事事的夜晚。泡個熱水澡、點一盞香氛，允許身體在深度的安全感中修復與重生。',
    theme: '身體能量',
    colorGradient: 'from-sky-950/80 via-teal-950/70 to-slate-900/90'
  },
  {
    id: 'uni_06',
    code: 'UNI_06',
    title: '水晶般的直覺',
    quote: '第一瞬間的直覺感受，永遠比大腦的千思萬緒更接近真相。',
    guidance: '靜下心來，感覺身體最直接的訊號（輕鬆或緊繃？前進或後退？）。相信第一感，那是獨角獸傳遞給你的心電感應。',
    theme: '直覺靈感',
    colorGradient: 'from-amber-950/80 via-rose-950/70 to-purple-950/90'
  }
];

export function getRandomUnicornCard(): UnicornCardData {
  const index = Math.floor(Math.random() * UNICORN_CARDS.length);
  return UNICORN_CARDS[index] || UNICORN_CARDS[0];
}
