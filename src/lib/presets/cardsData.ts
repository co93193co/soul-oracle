export interface OracleCardData {
  id: string;
  code: string;
  deckType: 'release' | 'manifest' | 'inquire' | 'receive'; // 釋放 / 顯化 / 提問 / 接收
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

  // ================= 🔮 提問之門：靈魂啟明卡 (Inquire Deck) =================
  {
    id: 'inq_01',
    code: 'INQ_01',
    deckType: 'inquire',
    category: '核心轉化',
    title: '問題背後的禮物',
    quote: '如果眼前這個障礙不是懲罰，而是偽裝成挑戰的靈魂禮物，它想帶給你什麼？',
    guide: '放下「為什麼倒楣的是我」的受害者視角，換成靈魂探險家的好奇心：「這件事在教導我長出什麼樣的內在肌肉？」當視角轉換，卡點立刻鬆開。',
    colorGradient: 'from-purple-950/85 via-indigo-950/75 to-slate-950/90'
  },
  {
    id: 'inq_02',
    code: 'INQ_02',
    deckType: 'inquire',
    category: '盲點照見',
    title: '確定感的幻覺',
    quote: '你正在緊抓著什麼「自以為必須的確定感」，而推開了更大的可能？',
    guide: '大腦喜歡確定，但靈魂熱愛擴展。閉上雙眼問自己：「若我不再需要證明自己是對的，我現在能有多麼自由？」',
    colorGradient: 'from-fuchsia-950/80 via-purple-900/70 to-slate-900/90'
  },
  {
    id: 'inq_03',
    code: 'INQ_03',
    deckType: 'inquire',
    category: '靈魂天賦',
    title: '內在真實羅盤',
    quote: '如果世界上沒有任何人會評判你，你此刻最渴望做出的真實決定是什麼？',
    guide: '將他人的眼光、世俗的標準如灰塵般輕輕拂去。感受內心深處那一簇跳動的微光，那才是你真正的北極星。',
    colorGradient: 'from-violet-950/85 via-sky-950/70 to-stone-900/90'
  },
  {
    id: 'inq_04',
    code: 'INQ_04',
    deckType: 'inquire',
    category: '高維俯瞰',
    title: '三年後的視角',
    quote: '三年後的那個活在喜悅與豐盛中的你，會給現在的自己一句什麼指引？',
    guide: '抽離當下的情緒風暴，站在更高的時間軸上向下看。你會發現，眼前的糾結只是一段精彩旅程中短暫的一朵小水花。',
    colorGradient: 'from-blue-950/85 via-purple-950/70 to-slate-900/90'
  },
  {
    id: 'inq_05',
    code: 'INQ_05',
    deckType: 'inquire',
    category: '直覺洞悉',
    title: '身體不會說謊',
    quote: '當你的邏輯分析停止運轉，你的身體正在用怎樣的感覺回答你？',
    guide: '將右手放在心口，左手放在腹部。想起這個問題時，你的身體是擴展放鬆的、還是收縮抗拒的？信任身體的第一秒直覺。',
    colorGradient: 'from-indigo-950/80 via-emerald-950/70 to-slate-950/90'
  },
  {
    id: 'inq_06',
    code: 'INQ_06',
    deckType: 'inquire',
    category: '空間敞開',
    title: '未被允許的知曉',
    quote: '在這裡，還有什麼是你早就知道、卻一直不敢承認的內在真理？',
    guide: '你比你想像的更有智慧。深吸一口氣，允許那個安靜的聲音浮上水面。承認它並不需要馬上做劇烈改變，看見就是解脫的開始。',
    colorGradient: 'from-purple-950/80 via-rose-950/60 to-slate-950/90'
  },

  // ================= 🕊️ 接收之門：今日恩典卡 (Receive Deck) =================
  {
    id: 'rec_01',
    code: 'REC_01',
    deckType: 'receive',
    category: '空杯以待',
    title: '純淨的空杯',
    quote: '當你把手掌向上攤開、徹底放鬆，宇宙的所有豐盛才能自然落入掌心。',
    guide: '抓緊的拳頭無法盛接任何水滴。現在，將手掌朝上自然放在膝蓋上，深呼吸，對宇宙輕聲說：「我準備好接收了。」',
    colorGradient: 'from-teal-950/85 via-emerald-950/70 to-slate-950/90'
  },
  {
    id: 'rec_02',
    code: 'REC_02',
    deckType: 'receive',
    category: '神聖允許',
    title: '無為的安住',
    quote: '允許一切按照宇宙的神聖節奏自然發生，無須催促，無須擔憂。',
    guide: '花朵不需要用力催促自己綻放，它只是在陽光與露水中安住。今天試著放下掌控欲，信任一切都在最恰當的時機到位。',
    colorGradient: 'from-cyan-950/80 via-teal-900/70 to-slate-900/90'
  },
  {
    id: 'rec_03',
    code: 'REC_03',
    deckType: 'receive',
    category: '同步巧合',
    title: '宇宙的暗號',
    quote: '留意今天與你擦肩而過的人事物，奇蹟往往穿著平凡的衣服來到。',
    guide: '一句路人無意間說的話、一首突然播出的歌、一串重複的數字天使密碼。宇宙正在對你眨眼，請保持像孩子般敏銳的好奇心。',
    colorGradient: 'from-emerald-950/85 via-sky-950/70 to-stone-900/90'
  },
  {
    id: 'rec_04',
    code: 'REC_04',
    deckType: 'receive',
    category: '愛的包裹',
    title: '無條件的浸潤',
    quote: '此刻你無須用力證明自己，深吸一口氣，盛接整個宇宙對你的溫柔愛護。',
    guide: '你存在本身就是奇蹟。感受四周空氣像溫暖的光芒包裹著你，不需要交換，不需要配得感，你生來就值得被世間萬物深深愛著。',
    colorGradient: 'from-teal-950/80 via-indigo-950/70 to-slate-900/90'
  },
  {
    id: 'rec_05',
    code: 'REC_05',
    deckType: 'receive',
    category: '靈感湧現',
    title: '晨露般的答案',
    quote: '當身心徹底沉靜放鬆，困擾多時的答案會像清晨朝露般悄然浮現。',
    guide: '不要在水波混濁時攪動尋找。安靜坐著，等泥沙沉澱，水面自然清澈見底。靈感只會在安靜與空無中誕生。',
    colorGradient: 'from-sky-950/85 via-teal-950/70 to-slate-950/90'
  },
  {
    id: 'rec_06',
    code: 'REC_06',
    deckType: 'receive',
    category: '寧靜之力',
    title: '深海的包容',
    quote: '世界上最強大的力量不是尖銳的對抗，而是如深海般安詳的寧靜與包容。',
    guide: '任憑海面上風浪翻騰，深海十米之下永遠靜止無波。讓你的心回到深海核心，在此刻的平靜中，你無懈可擊。',
    colorGradient: 'from-teal-950/80 via-blue-950/75 to-slate-950/90'
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

export function getRandomCard(deckType?: 'release' | 'manifest' | 'inquire' | 'receive'): OracleCardData {
  const filtered = deckType ? PRESET_CARDS.filter(c => c.deckType === deckType) : PRESET_CARDS;
  const list = filtered.length > 0 ? filtered : PRESET_CARDS;
  const randomIndex = Math.floor(Math.random() * list.length);
  return list[randomIndex] || PRESET_CARDS[0];
}
