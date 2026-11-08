export interface CosmicOneLinerCard {
  id: string;
  code: string;
  quote: string;
  subtext: string;
  vibe: string;
  colorGradient: string;
}

export const COSMIC_ONE_LINERS: CosmicOneLinerCard[] = [
  {
    id: 'cos_01',
    code: 'COS_01',
    quote: '你所尋找的，正急切地在尋找你。',
    subtext: '停止焦急的東奔西跑，讓自己成為安靜的磁鐵，美好自會順著頻率湧入。',
    vibe: '豐盛吸引',
    colorGradient: 'from-amber-950/80 via-indigo-950/70 to-slate-900/90'
  },
  {
    id: 'cos_02',
    code: 'COS_02',
    quote: '允許一切如其所是，你便成為了自由的風。',
    subtext: '所有痛苦皆源於對「現在」的抗拒。當你說出一聲全心的「我允許」，鎖鏈便化為塵埃。',
    vibe: '終極放手',
    colorGradient: 'from-blue-950/80 via-slate-900/80 to-purple-950/90'
  },
  {
    id: 'cos_03',
    code: 'COS_03',
    quote: '如果沒有任何需要被修復的事，你會怎麼過今天？',
    subtext: '放下「我還不夠好」的妄念。在宇宙眼中，你此刻就是完美的創造。',
    vibe: 'Access 覺察',
    colorGradient: 'from-violet-950/85 via-fuchsia-950/60 to-slate-950/90'
  },
  {
    id: 'cos_04',
    code: 'COS_04',
    quote: '把擔心換成祝福，因為擔憂是對宇宙最隱晦的詛咒。',
    subtext: '當你為某事焦慮時，你是在向它輸送匱乏能量。轉為祝福吧，祝福將改變一切物理走向。',
    vibe: '能量逆轉',
    colorGradient: 'from-rose-950/80 via-orange-950/70 to-slate-900/90'
  },
  {
    id: 'cos_05',
    code: 'COS_05',
    quote: '宇宙從不對你說「不」，它只說：「有更好的，請稍等」。',
    subtext: '若一扇門關閉了，是因為門後的世界已經裝不下你即將展現的廣大。',
    vibe: '神聖時機',
    colorGradient: 'from-emerald-950/80 via-teal-950/70 to-slate-900/90'
  },
  {
    id: 'cos_06',
    code: 'COS_06',
    quote: '你是一片浩瀚的大海，何必為了幾滴混濁的浪花感到慌張？',
    subtext: '回到你內在深處不可動搖的平靜，所有表層的情緒風浪，都會在深海中化為平靜。',
    vibe: '當下臨在',
    colorGradient: 'from-cyan-950/80 via-blue-950/80 to-slate-950/90'
  }
];

export function getRandomCosmicOneLiner(): CosmicOneLinerCard {
  const index = Math.floor(Math.random() * COSMIC_ONE_LINERS.length);
  return COSMIC_ONE_LINERS[index] || COSMIC_ONE_LINERS[0];
}
