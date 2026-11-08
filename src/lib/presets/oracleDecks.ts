import { localStore } from '@/lib/storage';

export interface OracleDeckCard {
  id: string;
  title: string;
  quote: string;
  guide: string;
  category: string;
  colorGradient: string;
}

export interface OracleDeck {
  id: string;
  name: string;
  english: string;
  icon: string;
  description: string;
  costPerDraw: number; // 抽一張卡扣除的點數 (可在後台/設定中自訂修改)
  themeGradient: string;
  borderClass: string;
  accentText: string;
  cards: OracleDeckCard[];
}

export const DEFAULT_ORACLE_DECKS: OracleDeck[] = [
  // ================= 1. 🌌 宇宙靈魂指引卡 =================
  {
    id: 'cosmic_soul',
    name: '宇宙靈魂指引卡',
    english: 'COSMIC SOUL ORACLE',
    icon: '✨',
    description: '連結源頭宇宙意識高頻共振，穿透迷霧，指引靈魂當前生命課題與最佳走向。',
    costPerDraw: 5,
    themeGradient: 'from-indigo-950/90 via-purple-950/80 to-[#070919]/95',
    borderClass: 'border-indigo-400/40 hover:border-indigo-400/80',
    accentText: 'text-indigo-300',
    cards: [
      {
        id: 'cs_01',
        title: '宇宙的信任之網',
        category: '源頭信賴',
        quote: '你從未落單，宇宙萬物的慈悲正悄然托住你的每一步。',
        guide: '閉上眼睛做三次悠長的深呼吸。放下頭腦對「如何達成」的緊抓，信任那隻看不見的宇宙神聖之手正為你安排最完美的相遇。',
        colorGradient: 'from-indigo-900/80 via-purple-900/70 to-slate-900/90',
      },
      {
        id: 'cs_02',
        title: '純粹的靈魂本質',
        category: '自我憶起',
        quote: '在所有的角色與標籤剝落之後，你依然是那束純淨光芒。',
        guide: '你不是你的成就，更不是你的失誤。今天溫柔地抱抱自己，對自己說：「我是完整的，我生來就值得無條件被愛。」',
        colorGradient: 'from-blue-950/80 via-indigo-900/70 to-slate-950/90',
      },
      {
        id: 'cs_03',
        title: '神聖時機的奧祕',
        category: '自然流動',
        quote: '所有看似停滯的等待，都是根系在土壤深處積蓄養分。',
        guide: '不要在種子剛剛播下的清晨焦慮掘土。安下心來，把注意力放在照顧好今天的自己，時機成熟時，綻放勢不可擋。',
        colorGradient: 'from-purple-950/85 via-fuchsia-950/60 to-slate-950/90',
      },
      {
        id: 'cs_04',
        title: '宇宙同步共時性',
        category: '奇蹟線索',
        quote: '注意身邊細微的重覆密碼，宇宙正透過萬事萬物對你低語。',
        guide: '一首收音機播出的老歌、一位陌生人微笑的一句話、偶遇的天使數字。當你敞開感官，你會驚覺整個世界都在為你打氣。',
        colorGradient: 'from-cyan-950/80 via-blue-950/70 to-slate-900/90',
      },
      {
        id: 'cs_05',
        title: '宏觀視角的禮物',
        category: '跨越迷局',
        quote: '若從靈魂永恆的旅程俯瞰，眼前的困頓只是一場精彩的體驗。',
        guide: '試著將視線抽離目前的瑣碎情緒，站在未來十年甚至星宿的高度看著現在。這份考驗正在打磨你內在最珍貴的韌性寶石。',
        colorGradient: 'from-violet-950/80 via-indigo-950/70 to-slate-950/90',
      },
    ],
  },

  // ================= 2. 🪽 大天使守護陪伴卡 =================
  {
    id: 'angel_guardians',
    name: '大天使守護陪伴卡',
    english: 'ARCHANGEL GUARDIANS',
    icon: '🪽',
    description: '大天使麥可、拉斐爾與加百列的慈悲羽翼，提供無條件勇氣、身心療癒與清晰話語。',
    costPerDraw: 10,
    themeGradient: 'from-[#1a1c38]/90 via-[#101228]/90 to-[#090b16]/95',
    borderClass: 'border-sky-400/40 hover:border-sky-400/80',
    accentText: 'text-sky-300',
    cards: [
      {
        id: 'ag_01',
        title: '大天使麥可 ‧ 勇氣之盾',
        category: '守護與斬斷恐懼',
        quote: '我是大天使麥可，我以藍色光之劍斬斷一切依附的恐懼與疑慮，你是安全且自由的。',
        guide: '想像深藍色燦爛的聖光籠罩你的全身氣場。深呼吸，把你對未知的害怕、退縮交給麥可，跨出勇敢的第一步。',
        colorGradient: 'from-blue-900/80 via-indigo-950/80 to-slate-950/90',
      },
      {
        id: 'ag_02',
        title: '大天使拉斐爾 ‧ 翡翠療癒之泉',
        category: '心輪修復與健康',
        quote: '我是大天使拉斐爾，我將翡翠綠色的療癒光芒注入你的心與身體，帶走所有疲憊。',
        guide: '將右手輕輕放在胸口中央。感受一股溫暖、舒暢的翡翠綠光包圍你的每個細胞，所有緊繃都如晨霧在陽光下消融。',
        colorGradient: 'from-emerald-950/85 via-teal-900/70 to-slate-950/90',
      },
      {
        id: 'ag_03',
        title: '大天使加百列 ‧ 真實的表達',
        category: '靈魂之聲與創造力',
        quote: '我是大天使加百列，你的聲音是珍貴的禮物，勇敢說出你內心真實的想法與愛。',
        guide: '不再壓抑喉輪的表達。帶著溫柔且堅定的語氣，向身邊人傳遞你的真誠，宇宙會為真話的力量大開方便之門。',
        colorGradient: 'from-amber-950/80 via-yellow-900/70 to-slate-950/90',
      },
      {
        id: 'ag_04',
        title: '大天使夏彌爾 ‧ 和解與真愛',
        category: '心靈平靜與愛之流動',
        quote: '我是大天使夏彌爾，我協助你找到失落的平靜，並吸引與你靈魂深層同頻的美好關聯。',
        guide: '放下防衛的硬殼。用慈悲的眼光看待過去讓你受傷的人事物，因為愛不是對外的索求，而是你內在源源不絕的泉源。',
        colorGradient: 'from-pink-950/80 via-rose-950/70 to-slate-950/90',
      },
      {
        id: 'ag_05',
        title: '大天使烏列爾 ‧ 靈感神智之光',
        category: '智慧指引與解困',
        quote: '我是大天使烏列爾，當你感到困惑，我將如金黃燭光照亮你眼前的下一步實用道路。',
        guide: '不需要一次看清整個未來的百步，你只需要看清並邁出此刻腳下的這一步。微小的靈感正是奇蹟的起點。',
        colorGradient: 'from-amber-950/85 via-orange-950/70 to-stone-950/90',
      },
    ],
  },

  // ================= 3. 🦄 獨角獸純淨奇蹟卡 =================
  {
    id: 'unicorn_miracle',
    name: '獨角獸純淨奇蹟卡',
    english: 'UNICORN MIRACLE ORACLE',
    icon: '🦄',
    description: '第七次元純白獨角獸之光，吹拂世俗塵埃，重拾純真無畏的童心，召喚生命奇蹟。',
    costPerDraw: 10,
    themeGradient: 'from-[#270f2d]/90 via-[#19091d]/90 to-[#0e0411]/95',
    borderClass: 'border-fuchsia-400/40 hover:border-fuchsia-400/80',
    accentText: 'text-fuchsia-300',
    cards: [
      {
        id: 'um_01',
        title: '純白獨角獸之角 ‧ 奇蹟破曉',
        category: '奇蹟意識',
        quote: '願望已經進入顯化的最後衝刺，用天真無瑕的心情等待驚喜吧！',
        guide: '獨角獸的螺旋之角是聚集第七次元神聖奇蹟的天線。像期待生日禮物的小孩一樣微笑，不可思議的美好即將叩門。',
        colorGradient: 'from-fuchsia-950/80 via-purple-900/70 to-slate-900/90',
      },
      {
        id: 'um_02',
        title: '純真的遊戲心',
        category: '能量解綁',
        quote: '你太嚴肅、太用力了。生命本是一場在地球上的輕盈遊戲。',
        guide: '今天找一件完全沒有功利目標、純粹讓你開懷大笑的事做。當你玩得開心，原本膠著的難題會以意想不到的方式自動解開。',
        colorGradient: 'from-pink-950/80 via-fuchsia-900/70 to-slate-950/90',
      },
      {
        id: 'um_03',
        title: '彩虹瀑布的洗滌',
        category: '情緒釋放',
        quote: '站在獨角獸引領的彩虹瀑布下，將所有委屈與沉重徹底洗淨。',
        guide: '去洗個熱水澡，想像水流帶著彩虹的七彩光芒，帶走每一絲留在身上的負面情緒，換回最清亮透澈的靈魂外衣。',
        colorGradient: 'from-indigo-950/85 via-cyan-950/65 to-slate-950/90',
      },
      {
        id: 'um_04',
        title: '大膽夢想你的天賦',
        category: '潛能綻放',
        quote: '別為了迎合世界的標準而壓抑你天生獨特的色彩，世界正渴望你的特別。',
        guide: '獨角獸告訴你：你的古怪與特別，正是你靈魂最有吸引力的秘密武器。毫不保留地活出最真實燦爛的自己吧！',
        colorGradient: 'from-violet-950/80 via-pink-950/70 to-slate-950/90',
      },
      {
        id: 'um_05',
        title: '無條件的原諒之光',
        category: '自由飛翔',
        quote: '原諒他人不是為了成全對方，而是為了剪斷束縛你翅膀的枷鎖。',
        guide: '將沉重的情感包袱輕輕放在地上，獨角獸會以純白之火將其轉化為智慧。你現在可以輕快地奔跑了。',
        colorGradient: 'from-rose-950/80 via-purple-950/70 to-slate-950/90',
      },
    ],
  },

  // ================= 4. 🌸 大地女神豐盛恩典卡 =================
  {
    id: 'goddess_abundance',
    name: '大地女神豐盛恩典卡',
    english: 'GODDESS ABUNDANCE ORACLE',
    icon: '🌸',
    description: '大地之母蓋亞與豐盛女神的溫柔滋養，扎根大地，盛接物質財富與靈性圓滿。',
    costPerDraw: 8,
    themeGradient: 'from-[#2b1f06]/90 via-[#1d1403]/90 to-[#0e0901]/95',
    borderClass: 'border-amber-400/50 hover:border-amber-300/80',
    accentText: 'text-amber-300',
    cards: [
      {
        id: 'ga_01',
        title: '扎根大地 ‧ 穩固基石',
        category: '落實扎根',
        quote: '大樹能長多高，取決於它的根扎得多深。回到身體的踏實感受。',
        guide: '脫下鞋子踩踩草地或地板，深吸一口氣，將能量導向下方的土地。在物質世界中扎好根，豐盛果實自然結實累累。',
        colorGradient: 'from-amber-950/85 via-yellow-950/70 to-stone-950/90',
      },
      {
        id: 'ga_02',
        title: '豐收之角 ‧ 允許盛接',
        category: '敞開接收',
        quote: '宇宙的金幣與恩賜正傾瀉而下，請將你的雙手做成敞開的捧杯。',
        guide: '停止拒絕他人的好意與稱讚。當別人對你說「謝謝」或給予幫助時，優雅地微笑回應「我全心收下，謝謝你」。',
        colorGradient: 'from-yellow-950/80 via-amber-900/70 to-slate-950/90',
      },
      {
        id: 'ga_03',
        title: '豐饒繁衍 ‧ 創造力種子',
        category: '創作與生育',
        quote: '一個孕育已久的點子即將誕生，帶著溫柔的耐心陪伴它成形。',
        guide: '不要急於求成。如同春天的花苞，在溫暖陽光與清泉的灌溉下，你的計畫正以最健康的速度萌發生長。',
        colorGradient: 'from-emerald-950/80 via-amber-950/70 to-stone-900/90',
      },
    ],
  },
];

const LOCAL_STORAGE_KEY_DECKS = 'soul_oracle_custom_decks_v1';

// 取得所有牌卡套組 (若後台曾自訂修改點數或牌卡，優先使用自訂資料)
export function getOracleDecks(): OracleDeck[] {
  if (typeof window === 'undefined') return DEFAULT_ORACLE_DECKS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_DECKS);
    if (!raw) return DEFAULT_ORACLE_DECKS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Error loading custom oracle decks:', e);
  }
  return DEFAULT_ORACLE_DECKS;
}

// 儲存修改後的牌組設定 (例如修改扣除點數或新增卡片)
export function saveOracleDecks(decks: OracleDeck[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_DECKS, JSON.stringify(decks));
  } catch (e) {
    console.error('Error saving custom oracle decks:', e);
  }
}

// 重設回原廠預設牌組設定
export function resetOracleDecksToDefault(): OracleDeck[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY_DECKS);
  }
  return DEFAULT_ORACLE_DECKS;
}

// 從指定套組隨機抽取一張卡
export function drawCardFromDeck(deckId: string, decks: OracleDeck[] = DEFAULT_ORACLE_DECKS): OracleDeckCard | null {
  const targetDeck = decks.find((d) => d.id === deckId) || decks[0];
  if (!targetDeck || targetDeck.cards.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * targetDeck.cards.length);
  return targetDeck.cards[randomIndex];
}
