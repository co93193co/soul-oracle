export interface OracleCardData {
  id: string;
  code: string;
  deckType: 'release' | 'manifest'; // release(解憂覺察卡) 或 manifest(豐盛種子卡)
  category: string;
  title: string;
  quote: string;
  guide: string;
  colorGradient: string;
}

export const PRESET_CARDS: OracleCardData[] = [
  // ================= 🌙 釋放之門：解憂覺察卡 (Release Deck) =================
  {
    id: 'rel_01',
    code: 'REL_01',
    deckType: 'release',
    category: '輕重能量',
    title: '輕盈的選擇',
    quote: '這是一個讓你的生命變輕盈，還是變沉重的選擇？',
    guide: '閉上眼感受你的胸口。任何讓你感到緊繃沉重的，往往夾雜了非屬於你的負擔；追隨那份即使微小卻通透的「輕」，答案自然現前。',
    colorGradient: 'from-indigo-900/80 via-purple-900/70 to-slate-900/90'
  },
  {
    id: 'rel_02',
    code: 'REL_02',
    deckType: 'release',
    category: '當下臨在',
    title: '完整的當下',
    quote: '當下的你，已經足夠完整，毫無缺漏。',
    guide: '深吸一口氣，將注意力從腦海的劇情拉回腳底踩踏地面的實感。除了你腦中的念頭，此時此刻有任何真正的危機嗎？',
    colorGradient: 'from-blue-950/80 via-slate-900/80 to-teal-950/70'
  },
  {
    id: 'rel_03',
    code: 'REL_03',
    deckType: 'release',
    category: '放下修復',
    title: '無須修復',
    quote: '如果這裡沒有任何事情是需要被修復的，你會是怎樣的自由？',
    guide: '停止自我挑剔與糾正。允許事物暫時維持現在的樣貌，生命有它自然的自我療癒節奏。給自己一個溫柔的深呼吸。',
    colorGradient: 'from-violet-950/85 via-fuchsia-950/60 to-slate-950/90'
  },
  {
    id: 'rel_04',
    code: 'REL_04',
    deckType: 'release',
    category: '能量歸還',
    title: '物歸原主',
    quote: '這份沉重與焦慮，真的是屬於你的嗎？',
    guide: '你可能像海綿一樣，不自覺吸收了周遭環境或他人的緊繃。在心裡默念：「將所有不屬於我的能量，帶著意識之光歸還原主。」感覺身體瞬間鬆開。',
    colorGradient: 'from-cyan-950/80 via-indigo-950/70 to-slate-900/90'
  },
  {
    id: 'rel_05',
    code: 'REL_05',
    deckType: 'release',
    category: '允許脆弱',
    title: '柔軟的勇氣',
    quote: '允許所有的感受如雲朵般飄過，你不是烏雲，你是天空。',
    guide: '不要急著排斥難過或悲傷。抱抱現在這個感到脆弱的自己，你的堅強不需要透過硬撐來證明。',
    colorGradient: 'from-rose-950/70 via-purple-950/70 to-slate-900/90'
  },
  {
    id: 'rel_06',
    code: 'REL_06',
    deckType: 'release',
    category: '打破框架',
    title: '無限可能性',
    quote: '在這裡，還有什麼是我從未考慮過的新可能性？',
    guide: '當你以為走到死胡同時，往往只是舊思維的盡頭。放下對單一解法的執著，向浩瀚宇宙提出提問，靜待新的門窗敞開。',
    colorGradient: 'from-emerald-950/80 via-sky-950/70 to-slate-950/90'
  },

  // ================= ☀️ 顯化之門：豐盛種子卡 (Manifest Deck) =================
  {
    id: 'man_01',
    code: 'MAN_01',
    deckType: 'manifest',
    category: '量子豐盛',
    title: '豐盛同頻',
    quote: '你無須努力爭取豐盛，你只需允許自己成為豐盛本身。',
    guide: '放下匱乏的渴求感。想像願望已經達成的喜悅與從容，今天帶著那份富足優雅的姿態去喝一杯水、說一句話。',
    colorGradient: 'from-amber-950/80 via-yellow-950/60 to-slate-900/90'
  },
  {
    id: 'man_02',
    code: 'MAN_02',
    deckType: 'manifest',
    category: '神聖時機',
    title: '萌芽的種子',
    quote: '你看不到地底下的變化，並不代表種子沒有在生長。',
    guide: '信任宇宙的神聖時間表。你的願望已被宇宙接收，現在你需要做的是保持放鬆灌溉，不要反覆掘土質疑。',
    colorGradient: 'from-emerald-950/80 via-amber-950/70 to-stone-900/90'
  },
  {
    id: 'man_03',
    code: 'MAN_03',
    deckType: 'manifest',
    category: '靈感行動',
    title: '靈感激盪',
    quote: '宇宙喜歡速度與遊戲心，聽從內心那份雀躍的直覺小微步。',
    guide: '顯化不是枯等，而是與宇宙共舞。今天如果有一個輕盈、有趣的靈感閃過，不論多小，立刻去做它！',
    colorGradient: 'from-orange-950/80 via-rose-950/70 to-slate-900/90'
  },
  {
    id: 'man_04',
    code: 'MAN_04',
    deckType: 'manifest',
    category: '心門敞開',
    title: '奇蹟接收者',
    quote: '今天我願意接收超越我頭腦所能想像的宏大禮物。',
    guide: '別限制宇宙必須以哪種形式來幫助你。保持像孩子般的好奇心，觀察今天出現在你生命中的每一個小巧合與溫暖。',
    colorGradient: 'from-fuchsia-950/70 via-amber-950/60 to-purple-950/90'
  },
  {
    id: 'man_05',
    code: 'MAN_05',
    deckType: 'manifest',
    category: '感恩同頻',
    title: '感恩的磁場',
    quote: '感謝已經擁有的一切，是通往更多奇蹟最強大的通道。',
    guide: '在心中真誠列舉三件今天讓你感到被照顧、被溫暖的小事。感恩的高頻震動，會像磁鐵般吸引更多的美好來到身邊。',
    colorGradient: 'from-yellow-950/80 via-teal-950/70 to-slate-900/90'
  }
];

export function getRandomCard(deckType: 'release' | 'manifest'): OracleCardData {
  const filtered = PRESET_CARDS.filter(c => c.deckType === deckType);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex] || PRESET_CARDS[0];
}
