'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowLeft,
  Sun,
  Headphones,
  Globe,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  CheckCircle2,
  Heart,
  Send,
  Flame,
} from 'lucide-react';
import SmilingCosmicOrb from '@/components/shared/SmilingCosmicOrb';
import OracleCard from '@/components/shared/OracleCard';
import VoiceInputButton from '@/components/shared/VoiceInputButton';
import { getRandomCard, OracleCardData } from '@/lib/presets/cardsData';
import { getRandomAffirmation } from '@/lib/presets/affirmations';
import { sound } from '@/lib/sound';
import { localStore } from '@/lib/storage';

interface ManifestSanctuaryV5Props {
  onBack: () => void;
  onOpenArchive: () => void;
  initialSubView?: 'menu' | 'seed' | 'audio' | 'wall';
}

const WISH_CATEGORIES = ['事業與志業', '金錢與豐盛', '靈魂伴侶與愛', '身心活力', '自我成長與夢想'];

// 肯定句主題音艙數據
const AFFIRMATION_THEMES = [
  {
    id: 'wealth',
    title: '💰 金錢與豐盛意識',
    desc: '放下匱乏焦慮，與宇宙無竭富足頻率同頻共振',
    color: 'from-amber-500/20 to-yellow-500/20 border-amber-400/40 text-amber-200',
    quotes: [
      '我敞開允許宇宙源源不絕的財富與豐盛自然流向我。',
      '我是一塊純淨的豐盛磁鐵，生命隨處充滿驚喜與饋贈。',
      '我的價值無須透過焦慮證明，我生來就配得享受富足與自由。',
      '金錢是我靈魂創造美好體驗的盟友，它以愛的形式流動。',
      '當我信任宇宙，所有我需要的資源都已在向我靠攏。',
    ],
  },
  {
    id: 'love',
    title: '💖 自愛與神聖連結',
    desc: '消融自我批判，讓心輪被無條件的溫暖愛意包裹',
    color: 'from-rose-500/20 to-pink-500/20 border-rose-400/40 text-rose-200',
    quotes: [
      '我全然接納現在的自己，我就是宇宙最獨特、最完美的造化。',
      '我放下向外索求認同的執著，我內在的愛豐盈且自給自足。',
      '我深信這世間最純粹的愛與溫暖，正以最美好的方式走向我。',
      '我的存在本身就是一份珍貴的禮物，我值得被世間溫柔以待。',
      '我原諒過去所有的遺憾，把愛與自由全心還給自己。',
    ],
  },
  {
    id: 'health',
    title: '🌿 身心活力與調癒',
    desc: '啟動細胞自我修復節奏，安住於寧靜與深邃活力',
    color: 'from-emerald-500/20 to-teal-500/20 border-emerald-400/40 text-emerald-200',
    quotes: [
      '每一次緩慢深呼吸，宇宙都在修復與更新我身體的每一個細胞。',
      '我的身心深感平靜與安全，我與大自然的神聖節奏同頻共振。',
      '我釋放所有的緊繃與焦慮，將身體全然交托給自癒的生機。',
      '我的心跳平穩而有力，我的身心每一刻都更加健康輕盈。',
      '我感謝我的身體一路以來的守護，我願意好好愛護它。',
    ],
  },
  {
    id: 'confidence',
    title: '🌟 靈魂天賦與自信',
    desc: '撥開懷疑陰霾，篤定站在自己的力量中心發光',
    color: 'from-purple-500/20 to-indigo-500/20 border-purple-400/40 text-purple-200',
    quotes: [
      '我擁有無限的靈魂潛能，我所做的一切選擇都將開花結果。',
      '宇宙正在全心為我鋪路，我走在通往最高版本的坦途上。',
      '我不受限於過去的失敗，今天就是我重塑生命的全新起點。',
      '我的直覺清晰銳利，我勇敢聽從內在那個智慧的聲音。',
      '我信任宇宙的神聖時間表，所有一切的發生都在成就我。',
    ],
  },
];

// 預設匿名願望星河流動數據
interface AnonymousWish {
  id: string;
  text: string;
  category: string;
  allowsCount: number;
  isAllowedByMe?: boolean;
  timeLabel: string;
}

const INITIAL_ANON_WISHES: AnonymousWish[] = [
  {
    id: 'w1',
    text: '願身邊所有所愛之人皆得健康平安，無病無憂。',
    category: '身心活力',
    allowsCount: 128,
    timeLabel: '剛剛',
  },
  {
    id: 'w2',
    text: '允許自己順利通過下週的重要挑戰，自在發揮最好的實力！',
    category: '事業與志業',
    allowsCount: 94,
    timeLabel: '3分鐘前',
  },
  {
    id: 'w3',
    text: '放下一段長久消耗我的關係，給自己重新開始與被愛的勇氣。',
    category: '靈魂伴侶與愛',
    allowsCount: 156,
    timeLabel: '8分鐘前',
  },
  {
    id: 'w4',
    text: '願豐盛如潮水般湧入生活，不再為金錢匱乏焦慮，從容生活。',
    category: '金錢與豐盛',
    allowsCount: 243,
    timeLabel: '15分鐘前',
  },
  {
    id: 'w5',
    text: '允許自己找回對生命的熱情，勇敢追隨那個深埋在心底的夢想。',
    category: '自我成長與夢想',
    allowsCount: 182,
    timeLabel: '20分鐘前',
  },
];

export default function ManifestSanctuaryV5({
  onBack,
  onOpenArchive,
  initialSubView = 'menu',
}: ManifestSanctuaryV5Props) {
  const [subView, setSubView] = useState<'menu' | 'seed' | 'audio' | 'wall'>(initialSubView);

  // 1. 願望播種狀態
  const [seedStep, setSeedStep] = useState<'input' | 'seeding' | 'affirming' | 'revealing'>('input');
  const [seedCategory, setSeedCategory] = useState(WISH_CATEGORIES[0]);
  const [seedText, setSeedText] = useState('');
  const [universeBlessing, setUniverseBlessing] = useState('');
  const [drawnCard, setDrawnCard] = useState<OracleCardData | null>(null);
  const [currentAffirmation, setCurrentAffirmation] = useState('');

  // 2. 肯定句能量艙狀態
  const [selectedTheme, setSelectedTheme] = useState(AFFIRMATION_THEMES[0]);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [audioProgress, setAudioProgress] = useState(0); // 0 - 100
  const audioTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 3. 宇宙祈願星河狀態
  const [anonWishes, setAnonWishes] = useState<AnonymousWish[]>(INITIAL_ANON_WISHES);
  const [myAnonWish, setMyAnonWish] = useState('');
  const [myAnonCategory, setMyAnonCategory] = useState(WISH_CATEGORIES[0]);
  const [hasPostedSuccess, setHasPostedSuccess] = useState(false);

  // 音頻播放器定時器
  useEffect(() => {
    if (isPlayingAudio) {
      sound.playSingingBowl528(6);
      audioTimerRef.current = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setQuoteIndex((qPrev) => (qPrev + 1) % selectedTheme.quotes.length);
            sound.playSparkle();
            return 0;
          }
          return prev + 2;
        });
      }, 160);
    } else {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    }
    return () => {
      if (audioTimerRef.current) clearInterval(audioTimerRef.current);
    };
  }, [isPlayingAudio, selectedTheme]);

  // 播種願望提交
  const handleSeedManifest = async () => {
    if (!seedText.trim()) return;

    sound.playSingingBowl528();
    setSeedStep('seeding');

    const card = getRandomCard('manifest');
    setDrawnCard(card);
    const aff = getRandomAffirmation('manifest');
    setCurrentAffirmation(aff.quote);

    const apiPromise = fetch('/api/universe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'manifest', input: seedText, tag: seedCategory }),
    })
      .then((res) => res.json())
      .catch(() => ({ reply: '宇宙已欣喜接下你的願望種子，請信任這份流動，奇蹟已然在路上...' }));

    setTimeout(() => {
      setSeedStep('affirming');
      sound.playSparkle();

      setTimeout(async () => {
        const data = await apiPromise;
        const blessingText = data.reply || '';
        setUniverseBlessing(blessingText);

        localStore.saveWish({
          category: seedCategory,
          wishText: seedText,
          universeBlessing: blessingText,
          card,
        });

        sound.playSingingBowl528();
        setSeedStep('revealing');
      }, 7000);
    }, 1400);
  };

  // 匿名願望投遞
  const handlePostAnonWish = () => {
    if (!myAnonWish.trim()) return;
    sound.playSparkle();
    const newWish: AnonymousWish = {
      id: 'w_' + Date.now(),
      text: myAnonWish.trim(),
      category: myAnonCategory,
      allowsCount: 1,
      isAllowedByMe: true,
      timeLabel: '剛剛',
    };
    setAnonWishes([newWish, ...anonWishes]);
    setMyAnonWish('');
    setHasPostedSuccess(true);
    setTimeout(() => setHasPostedSuccess(false), 3500);
  };

  // 點擊「允許發生」
  const toggleAllowWish = (id: string) => {
    sound.playSparkle();
    setAnonWishes((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const nextState = !w.isAllowedByMe;
          return {
            ...w,
            isAllowedByMe: nextState,
            allowsCount: nextState ? w.allowsCount + 1 : w.allowsCount - 1,
          };
        }
        return w;
      })
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center px-3.5 sm:px-4 py-4 sm:py-8 relative selection:bg-amber-400/20">
      {/* 頂部導覽 */}
      <div className="w-full flex justify-between items-center mb-5 sm:mb-8">
        <button
          onClick={() => {
            if (subView !== 'menu') {
              setSubView('menu');
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-1.5 text-xs text-amber-200/80 hover:text-white transition-colors py-1.5 px-3 rounded-full bg-white/5 border border-white/10 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{subView === 'menu' ? '返回靈魂殿堂' : '返回顯化選單'}</span>
        </button>
        <span className="text-xs tracking-widest text-amber-300 font-light flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          ☀️ 顯化之門 ‧ 願望播種
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* ================= 第 1 層：顯化殿堂三選一選單 ================= */}
        {subView === 'menu' && (
          <motion.div
            key="menu"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full flex flex-col items-center text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 mb-1 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
              <Sun className="w-6 h-6" />
            </div>

            <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide">
              顯化殿堂 ‧ 選擇你的創造儀式
            </h2>
            <p className="text-xs sm:text-sm text-amber-200/70 max-w-md mx-auto leading-relaxed mb-4">
              在宇宙中心種下純粹渴望。你可以播種具體心願、進入肯定句語音能量艙，或在集體星河中彼此加持「允許發生」。
            </p>

            <div className="grid grid-cols-1 gap-3.5 w-full max-w-lg mt-2">
              {/* 選項一：願望播種儀式 */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  sound.playSparkle();
                  setSubView('seed');
                }}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/70 to-yellow-950/50 border border-amber-400/30 hover:border-amber-400/70 text-left cursor-pointer transition-all shadow-lg flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-300/30 flex items-center justify-center text-amber-300 group-hover:scale-110 transition-transform shrink-0">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-amber-100 flex items-center gap-1.5">
                      <span>🌱 願望播種儀式</span>
                      <span className="text-[10px] text-amber-300 px-1.5 py-0.2 rounded bg-amber-400/20 font-mono">
                        個人心願
                      </span>
                    </h3>
                    <p className="text-xs text-amber-200/70 mt-0.5">
                      播下金色種子，透過調頻肯定句對齊心輪，接收宇宙盟友的祝福與豐盛卡。
                    </p>
                  </div>
                </div>
                <span className="text-xs text-amber-300 shrink-0 font-medium group-hover:translate-x-1 transition-transform ml-2">
                  進入 ➔
                </span>
              </motion.div>

              {/* 選項二：肯定句能量艙 */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  sound.playSparkle();
                  setSubView('audio');
                }}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-950/70 to-indigo-950/50 border border-purple-400/30 hover:border-purple-400/70 text-left cursor-pointer transition-all shadow-lg flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-400/20 border border-purple-300/30 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform shrink-0">
                    <Headphones className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-purple-100 flex items-center gap-1.5">
                      <span>🎧 肯定句能量艙</span>
                      <span className="text-[10px] text-purple-300 px-1.5 py-0.2 rounded bg-purple-400/20 font-mono">
                        528Hz 音檔
                      </span>
                    </h3>
                    <p className="text-xs text-purple-200/70 mt-0.5">
                      4 大主題高頻肯定句語音循環，重新編程潛意識，隨身聽隨時對齊高頻。
                    </p>
                  </div>
                </div>
                <span className="text-xs text-purple-300 shrink-0 font-medium group-hover:translate-x-1 transition-transform ml-2">
                  進入 ➔
                </span>
              </motion.div>

              {/* 選項三：宇宙集體願望星河 */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => {
                  sound.playSparkle();
                  setSubView('wall');
                }}
                className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-950/70 to-blue-950/50 border border-teal-400/30 hover:border-teal-400/70 text-left cursor-pointer transition-all shadow-lg flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-400/20 border border-teal-300/30 flex items-center justify-center text-teal-300 group-hover:scale-110 transition-transform shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-teal-100 flex items-center gap-1.5">
                      <span>🌌 宇宙集體祈願星河</span>
                      <span className="text-[10px] text-teal-300 px-1.5 py-0.2 rounded bg-teal-400/20 font-mono">
                        不具名流動
                      </span>
                    </h3>
                    <p className="text-xs text-teal-200/70 mt-0.5">
                      不具名投遞願望，看大家的渴望在星空中流動，點擊「✦ 允許發生 ✦」集體加持。
                    </p>
                  </div>
                </div>
                <span className="text-xs text-teal-300 shrink-0 font-medium group-hover:translate-x-1 transition-transform ml-2">
                  進入 ➔
                </span>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* ================= 子頁面一：🌱 願望播種儀式 ================= */}
        {subView === 'seed' && (
          <motion.div
            key="seed"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full flex flex-col items-center text-center"
          >
            {seedStep === 'input' && (
              <>
                <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide mb-2">
                  在宇宙中心播下渴望
                </h2>
                <p className="text-xs sm:text-sm text-amber-200/70 max-w-md mx-auto leading-relaxed mb-5">
                  願望如同種子，帶著清晰與喜悅的心念播下，放下對時間與方式的掌控，宇宙必將豐盛回應。
                </p>

                {/* 主題選擇 */}
                <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
                  {WISH_CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSeedCategory(cat)}
                      className={`text-xs py-1.5 px-3.5 rounded-full transition-all ${
                        seedCategory === cat
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                          : 'bg-white/5 text-amber-200/70 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 願望書寫框 */}
                <div className="w-full relative mb-6">
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <span className="text-xs text-amber-200/80 font-light">
                      顯化願望（直接輸入或語音許願）：
                    </span>
                    <VoiceInputButton
                      value={seedText}
                      onChange={setSeedText}
                      themeColor="amber"
                      size="sm"
                      label="語音輸入"
                    />
                  </div>
                  <textarea
                    value={seedText}
                    onChange={(e) => setSeedText(e.target.value)}
                    placeholder="以肯定而感恩的語氣寫下你的願望...（例如：我感謝並欣喜迎接一份讓我發揮天賦且豐盛的工作）"
                    rows={4}
                    className="w-full p-4 rounded-2xl bg-black/40 border border-amber-400/30 focus:border-amber-400/80 focus:ring-1 focus:ring-amber-400/80 outline-none text-amber-100 placeholder:text-amber-300/30 text-sm leading-relaxed resize-none transition-all shadow-inner"
                  />
                </div>

                <button
                  onClick={handleSeedManifest}
                  disabled={!seedText.trim()}
                  className="w-full sm:w-auto py-3 px-8 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-sm tracking-widest transition-all shadow-[0_0_25px_rgba(251,191,36,0.4)] active:scale-95"
                >
                  ✦ 播下金種 ‧ 啟動宇宙顯化 ✦
                </button>
              </>
            )}

            {seedStep === 'seeding' && (
              <div className="flex flex-col items-center justify-center py-10">
                <SmilingCosmicOrb
                  size="lg"
                  themeColor="amber"
                  guideText="金色種子正緩緩沉入宇宙中心，與量子豐盛場域同頻..."
                />
              </div>
            )}

            {seedStep === 'affirming' && (
              <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <span className="text-xs text-amber-300 tracking-widest uppercase font-mono">
                  ✦ ALIGNING AFFIRMATION ✦
                </span>
                <p className="text-lg sm:text-2xl font-light text-amber-100 tracking-wider max-w-lg leading-relaxed border-y border-amber-300/30 py-6 my-2">
                  「{currentAffirmation}」
                </p>
                <p className="text-xs text-amber-200/60 font-light">
                  閉上眼，深吸一口氣，將這句話帶入心輪三次...
                </p>
              </div>
            )}

            {seedStep === 'revealing' && drawnCard && (
              <div className="w-full flex flex-col items-center space-y-6">
                <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-400/15 border border-amber-300/30 px-3.5 py-1.5 rounded-full shadow-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>願望種子已深植 ‧ 豐盛之門已為你盛開</span>
                </div>

                <div className="w-full flex justify-center py-2">
                  <OracleCard card={drawnCard} isInitiallyRevealed={false} />
                </div>

                <div className="w-full p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#24170d]/90 via-[#180f08]/90 to-[#0d0804]/95 border border-amber-400/40 text-left shadow-2xl relative overflow-hidden">
                  <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-400/20">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <h3 className="text-sm font-medium text-amber-200 tracking-wider">
                      宇宙盟友的豐盛祝福與提醒
                    </h3>
                  </div>
                  <div className="text-xs sm:text-sm text-amber-100/90 leading-relaxed space-y-3 font-light whitespace-pre-line">
                    {universeBlessing}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
                  <button
                    onClick={() => {
                      sound.playSparkle();
                      onOpenArchive();
                    }}
                    className="py-2.5 px-5 rounded-full bg-amber-400/20 hover:bg-amber-400/30 border border-amber-400/40 text-xs text-amber-100 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>查看星空檔案庫</span>
                  </button>

                  <button
                    onClick={() => {
                      setSeedText('');
                      setSeedStep('input');
                    }}
                    className="py-2.5 px-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-200 transition-all active:scale-95"
                  >
                    再播下一顆種子
                  </button>

                  <button
                    onClick={() => setSubView('menu')}
                    className="py-2.5 px-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-all active:scale-95"
                  >
                    返回顯化選單
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* ================= 子頁面二：🎧 肯定句能量艙 ================= */}
        {subView === 'audio' && (
          <motion.div
            key="audio"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full flex flex-col items-center text-center space-y-5"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 mb-1 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Headphones className="w-6 h-6" />
            </div>

            <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide">
              528Hz 肯定句高頻能量艙
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/70 max-w-md mx-auto leading-relaxed">
              戴上耳機，選擇共振主題。伴隨 528Hz 奇蹟修復頻率，讓純淨肯定句金句深深灌入你的潛意識。
            </p>

            {/* 4 大主題選擇鈕 */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 w-full max-w-md">
              {AFFIRMATION_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    sound.playSparkle();
                    setSelectedTheme(theme);
                    setQuoteIndex(0);
                    setAudioProgress(0);
                  }}
                  className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all ${
                    selectedTheme.id === theme.id
                      ? `${theme.color} ring-1 ring-white/30 shadow-lg scale-[1.02]`
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div className="text-xs font-medium truncate">{theme.title}</div>
                  <div className="text-[10px] text-white/50 truncate mt-0.5">{theme.desc}</div>
                </button>
              ))}
            </div>

            {/* 中央沉浸金句展示卡 */}
            <div className="w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#180e2b]/90 via-[#0f091c]/90 to-[#07040d]/95 border border-purple-400/40 flex flex-col items-center justify-center min-h-[220px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-12 -mt-12 w-44 h-44 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

              <span className="text-[10px] text-purple-300/70 uppercase tracking-widest font-mono mb-3">
                ✦ 528Hz SUB-CONSCIOUS REPROGRAMMING ✦
              </span>

              {/* 當前高頻肯定金句 */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex + selectedTheme.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-base sm:text-xl font-light text-purple-100 tracking-wider leading-relaxed my-2 max-w-md"
                >
                  「{selectedTheme.quotes[quoteIndex]}」
                </motion.p>
              </AnimatePresence>

              {/* 進度條 */}
              <div className="w-full max-w-xs h-1 rounded-full bg-white/10 mt-5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-150"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
              <span className="text-[10px] text-purple-300/50 mt-1 font-mono">
                {quoteIndex + 1} / {selectedTheme.quotes.length}
              </span>
            </div>

            {/* 音頻控制按鈕群 */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                onClick={() => {
                  sound.playSparkle();
                  setQuoteIndex(
                    (prev) => (prev - 1 + selectedTheme.quotes.length) % selectedTheme.quotes.length
                  );
                  setAudioProgress(0);
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 active:scale-95"
                title="上一句"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="py-3 px-7 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-medium text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-95"
              >
                {isPlayingAudio ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>暫停能量流動</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-white" />
                    <span>開始沉浸導引</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  sound.playSparkle();
                  setQuoteIndex((prev) => (prev + 1) % selectedTheme.quotes.length);
                  setAudioProgress(0);
                }}
                className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 active:scale-95"
                title="下一句"
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= 子頁面三：🌌 宇宙集體願望星河 (不具名願望牆) ================= */}
        {subView === 'wall' && (
          <motion.div
            key="wall"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full flex flex-col items-center text-center space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 mb-1 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
              <Globe className="w-6 h-6" />
            </div>

            <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide">
              宇宙集體願望星河
            </h2>
            <p className="text-xs sm:text-sm text-teal-200/70 max-w-md mx-auto leading-relaxed">
              全體不具名。在此向宇宙宣告心願，看大家的渴望在星海中奔流。點擊「✦ 允許發生 ✦」，以眾人善念匯聚成實現的波流。
            </p>

            {/* 不具名投遞心願框 */}
            <div className="w-full max-w-lg p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#0a2327]/90 to-[#040f11]/90 border border-teal-400/35 text-left shadow-xl space-y-3">
              <div className="flex items-center justify-between text-xs text-teal-300">
                <span className="flex items-center gap-1 font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  ✦ 不具名投遞心願至星河：
                </span>
                <select
                  value={myAnonCategory}
                  onChange={(e) => setMyAnonCategory(e.target.value)}
                  className="bg-black/40 border border-teal-400/30 rounded-lg px-2 py-0.5 text-xs text-teal-200 outline-none"
                >
                  {WISH_CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-slate-900 text-white">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={myAnonWish}
                  onChange={(e) => setMyAnonWish(e.target.value)}
                  placeholder="寫下你的不具名心願...（例如：願家人健康、允許自己豐盛富足）"
                  maxLength={60}
                  className="w-full py-2.5 px-3.5 pr-20 rounded-xl bg-black/50 border border-teal-400/30 text-xs text-teal-100 placeholder:text-teal-300/30 outline-none focus:border-teal-400/80 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handlePostAnonWish();
                  }}
                />
                <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                  <VoiceInputButton
                    value={myAnonWish}
                    onChange={setMyAnonWish}
                    variant="icon"
                    themeColor="teal"
                    size="sm"
                  />
                  <button
                    onClick={handlePostAnonWish}
                    disabled={!myAnonWish.trim()}
                    className="p-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 disabled:opacity-40 text-slate-950 font-bold transition-all active:scale-95 cursor-pointer"
                    title="投遞"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {hasPostedSuccess && (
                <div className="text-[11px] text-teal-300 bg-teal-400/15 border border-teal-300/30 py-1 px-2.5 rounded-lg text-center animate-fade-in">
                  ✨ 心願已送入宇宙星河！眾星已為你見證：「允許發生」！
                </div>
              )}
            </div>

            {/* 流動願望留言列表 */}
            <div className="w-full max-w-lg space-y-2.5 pt-2 text-left">
              <div className="flex items-center justify-between text-xs text-teal-300/70 px-1 font-mono">
                <span>✦ 流動中的星空留言（實時共振）：</span>
                <span>{anonWishes.length} 顆願望之星</span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {anonWishes.map((wish) => (
                  <motion.div
                    key={wish.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3.5 rounded-xl border transition-all ${
                      wish.isAllowedByMe
                        ? 'bg-teal-950/60 border-teal-400/60 shadow-[0_0_15px_rgba(20,184,166,0.2)]'
                        : 'bg-white/5 border-white/10 hover:border-teal-400/30'
                    } flex items-center justify-between gap-3`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-400/15 text-teal-300 border border-teal-300/20">
                          {wish.category}
                        </span>
                        <span className="text-[10px] text-white/40">{wish.timeLabel}</span>
                      </div>
                      <p className="text-xs text-white/90 leading-relaxed font-light break-words">
                        {wish.text}
                      </p>
                    </div>

                    {/* 允許發生 按鈕 */}
                    <button
                      onClick={() => toggleAllowWish(wish.id)}
                      className={`flex items-center gap-1 py-1 px-2.5 rounded-full text-[11px] font-medium transition-all shrink-0 active:scale-95 ${
                        wish.isAllowedByMe
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(251,191,36,0.5)]'
                          : 'bg-white/10 hover:bg-white/20 text-amber-200 border border-amber-300/30'
                      }`}
                    >
                      <Heart
                        className={`w-3 h-3 ${
                          wish.isAllowedByMe ? 'fill-slate-950 text-slate-950' : 'text-amber-300'
                        }`}
                      />
                      <span>允許發生</span>
                      <span className="text-[10px] opacity-80 font-mono font-bold">
                        +{wish.allowsCount}
                      </span>
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
