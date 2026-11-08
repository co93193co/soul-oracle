export interface AffirmationItem {
  id: string;
  category: 'release' | 'manifest';
  quote: string;
  theme: string;
}

export const PRESET_AFFIRMATIONS: AffirmationItem[] = [
  // 🌙 釋放調頻肯定句
  {
    id: 'aff_rel_1',
    category: 'release',
    theme: '放手交託',
    quote: '我在此時此刻放下對特定結果的控制，允許生命用最溫柔的方式為我展開。'
  },
  {
    id: 'aff_rel_2',
    category: 'release',
    theme: '全然接納',
    quote: '我允許所有的感受流過身體，我深知自己是被浩瀚宇宙深深守護與理解的。'
  },
  {
    id: 'aff_rel_3',
    category: 'release',
    theme: '清空雜音',
    quote: '我放下頭腦的重擔，回到當下的呼吸，每一下吸氣都在將我帶回內在的寧靜。'
  },
  {
    id: 'aff_rel_4',
    category: 'release',
    theme: '自我寬恕',
    quote: '我原諒過去那個慌亂的自己，我已經做得很好，現在的我已然完整自由。'
  },

  // ☀️ 顯化共振肯定句
  {
    id: 'aff_man_1',
    category: 'manifest',
    theme: '豐盛對齊',
    quote: '我與宇宙的無限豐盛處於相同的頻率，所有屬於我的美好正以輕鬆喜悅的方式向我湧來。'
  },
  {
    id: 'aff_man_2',
    category: 'manifest',
    theme: '心願播種',
    quote: '我深深信任宇宙已經接納我的心願，我帶著雀躍與感恩，迎接奇蹟在物質界綻放。'
  },
  {
    id: 'aff_man_3',
    category: 'manifest',
    theme: '值得擁有',
    quote: '我天生值得擁有所有的愛、自由、富足與喜悅，無須證明，只需敞開接收。'
  },
  {
    id: 'aff_man_4',
    category: 'manifest',
    theme: '遊戲與創造',
    quote: '生命是一場無拘無束的遊戲，我懷抱著輕盈的心情，在今天創造全新的奇蹟。'
  }
];

export function getRandomAffirmation(category: 'release' | 'manifest'): AffirmationItem {
  const filtered = PRESET_AFFIRMATIONS.filter(a => a.category === category);
  const randomIndex = Math.floor(Math.random() * filtered.length);
  return filtered[randomIndex] || PRESET_AFFIRMATIONS[0];
}
