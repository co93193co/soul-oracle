'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Compass,
  Star,
  X,
  User,
  Flame,
  BookOpen,
  Music,
  Globe,
  Heart,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import SmilingCosmicOrb from '@/components/shared/SmilingCosmicOrb';
import OracleCard from '@/components/shared/OracleCard';
import ReleaseSanctuary from '@/components/release/ReleaseSanctuary';
import InquireSanctuary from '@/components/inquire/InquireSanctuary';
import ManifestSanctuaryV5 from '@/components/manifest/ManifestSanctuaryV5';
import DailyMeditationModalV4 from '@/components/meditation/DailyMeditationModalV4';
import SoulArchiveModal from '@/components/sanctuary/SoulArchiveModal';
import SoulMusicPlayerModal from '@/components/music/SoulMusicPlayerModal';
import AuthModal from '@/components/auth/AuthModal';
import MultiDeckDrawModal from '@/components/shared/MultiDeckDrawModal';
import { sound } from '@/lib/sound';
import { localStore, SoulUser, MeditationStats } from '@/lib/storage';
import { getRandomCard, OracleCardData } from '@/lib/presets/cardsData';

// 天際線跑馬燈：宇宙匿名願望之河宣告文字
const TICKER_WISHES = [
  '願家人健康平安，身心無病無憂 ‧ ✦ 允許發生 ✦',
  '放下過去的執念，擁抱全新的光與可能 ‧ ✦ 允許發生 ✦',
  '信任豐盛正在以意想不到的方式走向我 ‧ ✦ 允許發生 ✦',
  '允許自己在下週的挑戰中發揮最好實力 ‧ ✦ 允許發生 ✦',
  '敞開迎接真正懂我、珍惜我的靈魂伴侶 ‧ ✦ 允許發生 ✦',
  '解除對金錢的匱乏恐懼，活在富足喜悅中 ‧ ✦ 允許發生 ✦',
  '抱抱內在脆弱的自己，我是被宇宙深深愛著的 ‧ ✦ 允許發生 ✦',
];

export default function V5Page() {
  const [currentView, setCurrentView] = useState<'home' | 'release' | 'inquire' | 'manifest'>('home');
  const [manifestInitialSubView, setManifestInitialSubView] = useState<'menu' | 'seed' | 'audio' | 'wall'>('menu');
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isMeditationOpen, setIsMeditationOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMultiDeckModalOpen, setIsMultiDeckModalOpen] = useState(false);

  // 6大門戶左右滑動選取狀態 (01~06)
  const [activeGateIndex, setActiveGateIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);

  const [isMuted, setIsMuted] = useState(false);
  const [points, setPoints] = useState(365);
  const [currentUser, setCurrentUser] = useState<SoulUser>({
    id: 'guest',
    email: '',
    nickname: '尋光同行者',
    isLoggedIn: false,
    isVip: false,
  });
  const [meditationStats, setMeditationStats] = useState<MeditationStats>({
    streakDays: 0,
    totalMinutes: 0,
    lastMeditationDate: null,
    badges: [],
    canPostWishWall: false,
  });

  // 快速抽卡
  const [quickCard, setQuickCard] = useState<OracleCardData | null>(null);

  useEffect(() => {
    setCurrentUser(localStore.getUser());
    setPoints(localStore.getPoints() || 365);
    setMeditationStats(localStore.getMeditationStats());
  }, [currentView, isArchiveOpen, isMeditationOpen, isMusicOpen, isMultiDeckModalOpen]);

  const toggleSound = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sound.isMuted = nextMuted;
    if (!nextMuted) {
      sound.playSparkle();
    }
  };

  const handleQuickDraw = () => {
    sound.playSingingBowl432();
    const card = getRandomCard();
    setQuickCard(card);
  };

  // 開啟願望牆 (04 宣告之門)
  const handleOpenWishWall = () => {
    sound.playSparkle();
    setManifestInitialSubView('wall');
    setCurrentView('manifest');
  };

  // 切換門戶
  const changeGate = (newIndex: number) => {
    if (newIndex === activeGateIndex) return;
    setSlideDirection(newIndex > activeGateIndex ? 1 : -1);
    setActiveGateIndex(newIndex);
    sound.playSparkle();
  };

  const handlePrevGate = () => {
    setSlideDirection(-1);
    setActiveGateIndex((prev) => (prev === 0 ? 5 : prev - 1));
    sound.playSparkle();
  };

  const handleNextGate = () => {
    setSlideDirection(1);
    setActiveGateIndex((prev) => (prev === 5 ? 0 : prev + 1));
    sound.playSparkle();
  };

  // 6大門戶定義 (標籤名稱刪除「之門」，04為告知心願，06為奇蹟密碼且獨角獸卡帶...)
  const gates = [
    {
      id: 'release',
      tabNumber: '01',
      tabLabel: '01 釋放',
      icon: Moon,
      english: 'RELEASE & SURRENDER',
      title: '🌙 釋放之門 ‧ 放手清理',
      description:
        '倒出心底積壓的疲憊與心事，看著文字如星光輕輕散去。跟著我深呼吸，放手清理，找回內在的輕鬆與平靜。',
      actionText: '進入 ➔',
      themeGradient: 'from-[#111636]/90 via-[#0d1028]/90 to-[#070919]/95',
      borderClass: 'border-indigo-400/40 hover:border-indigo-400/80',
      accentColor: 'text-indigo-300',
      blobColor: 'bg-indigo-500/15',
      iconBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-400/30',
      onClick: () => {
        sound.playSingingBowl432();
        setCurrentView('release');
      },
    },
    {
      id: 'inquire',
      tabNumber: '02',
      tabLabel: '02 提問',
      icon: Compass,
      english: 'INQUIRE & CLARIFY',
      title: '🔮 提問之門 ‧ 靈魂探問',
      description:
        '帶著你心裡的疑問，向浩瀚宇宙真誠聊聊。撥開紛亂的想法，靜下來，聽聽內心聲音，知曉內在真正的需要，看見答案與前行方向。',
      actionText: '進入 ➔',
      themeGradient: 'from-[#1d1135]/90 via-[#130a24]/90 to-[#090513]/95',
      borderClass: 'border-purple-400/40 hover:border-purple-400/80',
      accentColor: 'text-purple-300',
      blobColor: 'bg-purple-500/15',
      iconBg: 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      onClick: () => {
        sound.playSingingBowl432();
        setCurrentView('inquire');
      },
    },
    {
      id: 'receive',
      tabNumber: '03',
      tabLabel: '03 接收',
      icon: Flame,
      english: 'RECEIVE & MEDITATE',
      title: '🕊️ 接收之門 ‧ 靈感聆聽',
      badge: `+${meditationStats.streakDays}天`,
      description:
        '暫時放下頭腦的忙碌與緊繃，給自己一段安靜放空的時光。在舒緩的深呼吸與心靈音樂中放鬆身心，盛接宇宙為你準備的滿滿靈感與暖心祝福。',
      actionText: '進入 ➔',
      themeGradient: 'from-[#0a2328]/90 via-[#07171b]/90 to-[#030d10]/95',
      borderClass: 'border-teal-400/40 hover:border-teal-400/80',
      accentColor: 'text-teal-300',
      blobColor: 'bg-teal-500/15',
      iconBg: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
      onClick: () => {
        sound.playSingingBowl432();
        setIsMeditationOpen(true);
      },
    },
    {
      id: 'proclaim',
      tabNumber: '04',
      tabLabel: '04 宣告',
      icon: Globe,
      english: 'PROCLAIM & ALIGN',
      title: '💫 宣告之門 ‧ 告知心願',
      description:
        '把你心底最真誠的心願與期待，化作星光向廣闊宇宙大聲說出來。在此寫下匿名願望注入大家的心願星河，彼此溫柔祝福「允許發生」，宇宙正認真聽著你的聲音。',
      actionText: '進入 ➔',
      themeGradient: 'from-[#0b252c]/90 via-[#06191f]/90 to-[#020e12]/95',
      borderClass: 'border-teal-400/40 hover:border-teal-300/80',
      accentColor: 'text-teal-300',
      blobColor: 'bg-teal-500/15',
      iconBg: 'bg-teal-500/20 text-teal-300 border-teal-400/30',
      onClick: () => {
        handleOpenWishWall();
      },
    },
    {
      id: 'manifest',
      tabNumber: '05',
      tabLabel: '05 顯化',
      icon: Sun,
      english: 'MANIFEST & ACTUALIZE',
      title: '☀️ 顯化之門 ‧ 願景成真',
      description:
        '當真心許下的願望已經出發，此門為你築起夢想成真的溫暖基石。深植信心種子，藉由肯定句慢慢融化自我懷疑，體驗當下的踏實與安心，靜待一切美好自然到來。',
      actionText: '進入 ➔',
      themeGradient: 'from-[#251910]/90 via-[#18110b]/90 to-[#0c0805]/95',
      borderClass: 'border-amber-400/40 hover:border-amber-400/80',
      accentColor: 'text-amber-300',
      blobColor: 'bg-amber-500/15',
      iconBg: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
      onClick: () => {
        sound.playSingingBowl528();
        setManifestInitialSubView('menu');
        setCurrentView('manifest');
      },
    },
    {
      id: 'synchronicity',
      tabNumber: '06',
      tabLabel: '06 共時',
      icon: Sparkles,
      english: 'SYNCHRONICITY & ORACLES',
      title: '✨ 共時之門 ‧ 奇蹟密碼',
      description:
        '每一次直覺的相遇，都是宇宙為你準備的心靈默契。靜心做個深呼吸，跟隨直覺抽取今日金句卡、陪伴天使卡、獨角獸卡...，感受奇蹟密碼。',
      actionText: '進入 ➔',
      themeGradient: 'from-[#22102f]/90 via-[#160a22]/90 to-[#0a0412]/95',
      borderClass: 'border-fuchsia-400/40 hover:border-amber-300/80',
      accentColor: 'text-amber-200',
      blobColor: 'bg-fuchsia-500/15',
      iconBg: 'bg-fuchsia-500/20 text-amber-300 border-amber-300/30',
      onClick: () => {
        sound.playSingingBowl432();
        setIsMultiDeckModalOpen(true);
      },
    },
  ];

  const currentGate = gates[activeGateIndex];

  return (
    <div
      className={`w-full selection:bg-amber-400/20 bg-[#070919] text-amber-50 flex flex-col justify-between overflow-x-hidden ${
        currentView === 'home'
          ? 'v5-screen-container'
          : 'min-h-screen min-h-dvh h-auto overflow-y-auto'
      }`}
    >
      {/* ================= 1. 最頂端天際線：宇宙匿名願望之河 (右上宇宙允許已刪除) ================= */}
      <div
        onClick={() => {
          sound.playSparkle();
          changeGate(3); // 切換至 04 宣告之門
        }}
        className="w-full bg-gradient-to-r from-[#060818] via-[#0b132a] to-[#060818] border-b border-teal-400/25 px-2.5 sm:px-4 py-1 flex items-center justify-between text-[10.5px] sm:text-[11px] text-teal-200/90 z-30 shrink-0 cursor-pointer hover:bg-white/5 transition-colors group select-none"
        title="點擊跳轉至 04 宣告之門（寫下匿名願望注入星河）"
      >
        <div className="flex items-center gap-1.5 shrink-0 pr-2 border-r border-teal-400/30 text-teal-300 font-mono text-[10px] sm:text-xs">
          <Globe className="w-3 h-3 text-teal-300 animate-pulse" />
          <span className="font-medium whitespace-nowrap">宇宙宣告之河</span>
          <span className="text-[9px] text-teal-400/50 hidden md:inline">‧ 點擊跳轉宣告之門</span>
        </div>
        <div className="flex-1 overflow-hidden whitespace-nowrap px-2">
          <div className="inline-block animate-marquee font-light text-teal-100/80 space-x-6">
            {TICKER_WISHES.map((wish, idx) => (
              <span key={idx} className="inline-flex items-center gap-1.5">
                <Heart className="w-2.5 h-2.5 text-pink-400/90 inline" />
                <span>{wish}</span>
                <span className="text-teal-400/40">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {currentView === 'home' ? (
        <>
          {/* ================= 2. 頂部區域：方案 B (神聖中軸垂直排列：憶起 ➔ RECALLING ➔ 加大微笑光球 ➔ 允許自己成為自己) ================= */}
          <header className="relative w-full max-w-xl mx-auto px-3 sm:px-4 pt-3.5 sm:pt-4 md:pt-5 pb-1 sm:pb-2 flex flex-col items-center justify-center z-20 h-auto shrink-0">
            {/* 中央神聖中軸容器 (方案 B：全部垂直置中依序排版) */}
            <div className="flex flex-col items-center justify-center text-center select-none w-full max-w-xs sm:max-w-md">
              {/* 1. 憶起 (最大金光字 + 7秒週期宇宙流星流光掠過動態) */}
              <div className="relative inline-flex items-center justify-center">
                <motion.h1
                  animate={{
                    backgroundPosition: ['-140% 0%', '240% 0%', '240% 0%'],
                  }}
                  transition={{
                    duration: 7,
                    times: [0, 0.22, 1],
                    repeat: Infinity,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-light tracking-widest text-transparent bg-clip-text bg-[linear-gradient(110deg,#fbbf24_0%,#fef08a_25%,#ffffff_50%,#fef08a_75%,#f59e0b_100%)] bg-[length:260%_100%] drop-shadow-[0_0_25px_rgba(251,191,36,0.5)] leading-tight text-center select-none"
                >
                  憶起
                </motion.h1>

                {/* 流星彗核與拖曳星軌 (由左上至右下優雅飛越「憶起」) */}
                <motion.div
                  animate={{
                    x: [-40, 110],
                    y: [-4, 26],
                    opacity: [0, 1, 1, 0],
                    scale: [0.6, 1.3, 0.9, 0],
                  }}
                  transition={{
                    duration: 7,
                    times: [0, 0.08, 0.18, 0.23],
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="absolute -top-1 left-4 pointer-events-none z-10"
                >
                  {/* 流星核心微光 */}
                  <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff,0_0_20px_#fde047]" />
                  {/* 流星拖曳彗尾 */}
                  <div className="absolute top-1/2 -left-7 -translate-y-1/2 w-7 h-0.5 bg-gradient-to-r from-transparent via-amber-200/70 to-white -rotate-12 blur-[0.5px]" />
                </motion.div>
              </div>

              {/* 2. ✦ RECALLING ✦ (流星接力點亮雙側星芒與字母光浪) */}
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-0.5 text-center select-none">
                {/* 左側四芒星 */}
                <motion.span
                  animate={{
                    scale: [1, 1.5, 1.7, 1],
                    opacity: [0.7, 1, 1, 0.7],
                    filter: [
                      'drop-shadow(0 0 2px rgba(251,191,36,0.3))',
                      'drop-shadow(0 0 10px rgba(255,255,255,1)) drop-shadow(0 0 16px rgba(251,191,36,0.9))',
                      'drop-shadow(0 0 12px rgba(255,255,255,0.9)) drop-shadow(0 0 18px rgba(251,191,36,0.8))',
                      'drop-shadow(0 0 2px rgba(251,191,36,0.3))',
                    ],
                    rotate: [0, 45, 90, 0],
                  }}
                  transition={{
                    duration: 7,
                    times: [0.2, 0.28, 0.36, 0.45],
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="text-[10px] sm:text-xs text-amber-200 inline-block font-mono"
                >
                  ✦
                </motion.span>

                {/* RECALLING 字母微浪潮浮現 */}
                <motion.span
                  animate={{
                    letterSpacing: ['0.2em', '0.24em', '0.2em'],
                    color: ['rgba(253, 230, 138, 0.85)', '#ffffff', 'rgba(253, 230, 138, 0.85)'],
                    filter: [
                      'drop-shadow(0 0 2px rgba(251,191,36,0.2))',
                      'drop-shadow(0 0 8px rgba(255,255,255,0.85)) drop-shadow(0 0 14px rgba(251,191,36,0.6))',
                      'drop-shadow(0 0 2px rgba(251,191,36,0.2))',
                    ],
                  }}
                  transition={{
                    duration: 7,
                    times: [0.22, 0.32, 0.46],
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-[10px] sm:text-xs text-amber-200/90 font-mono tracking-[0.2em] font-medium"
                >
                  RECALLING
                </motion.span>

                {/* 右側四芒星 */}
                <motion.span
                  animate={{
                    scale: [1, 1.5, 1.7, 1],
                    opacity: [0.7, 1, 1, 0.7],
                    filter: [
                      'drop-shadow(0 0 2px rgba(251,191,36,0.3))',
                      'drop-shadow(0 0 10px rgba(255,255,255,1)) drop-shadow(0 0 16px rgba(251,191,36,0.9))',
                      'drop-shadow(0 0 12px rgba(255,255,255,0.9)) drop-shadow(0 0 18px rgba(251,191,36,0.8))',
                      'drop-shadow(0 0 2px rgba(251,191,36,0.3))',
                    ],
                    rotate: [0, -45, -90, 0],
                  }}
                  transition={{
                    duration: 7,
                    times: [0.24, 0.32, 0.4, 0.48],
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                  className="text-[10px] sm:text-xs text-amber-200 inline-block font-mono"
                >
                  ✦
                </motion.span>
              </div>

              {/* 3. 微笑圓臉動畫加大置中 (直立單頁視野內最大化) */}
              <div className="my-1 sm:my-1.5 relative flex items-center justify-center">
                <SmilingCosmicOrb
                  size="md"
                  themeColor="amber"
                  align="center"
                  sparkleStyle="star"
                  onOrbClick={() => {
                    sound.playHeartbeat();
                  }}
                />
              </div>

              {/* 4. 允許自己成為自己 (方案 B：純白加粗・字體安穩固定・純白聖光微光暈呼吸) */}
              <motion.p
                animate={{
                  opacity: [0.92, 1, 0.92],
                  filter: [
                    'drop-shadow(0 0 5px rgba(255,255,255,0.35)) drop-shadow(0 0 12px rgba(255,255,255,0.2))',
                    'drop-shadow(0 0 14px rgba(255,255,255,0.85)) drop-shadow(0 0 26px rgba(255,255,255,0.5)) drop-shadow(0 0 40px rgba(251,191,36,0.25))',
                    'drop-shadow(0 0 5px rgba(255,255,255,0.35)) drop-shadow(0 0 12px rgba(255,255,255,0.2))',
                  ],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="text-[14.5px] xs:text-[16px] sm:text-[17.5px] md:text-lg text-white font-bold tracking-[0.1em] sm:tracking-[0.15em] text-center whitespace-nowrap leading-relaxed select-none"
              >
                允許自己成為自己
              </motion.p>
            </div>

            {/* 右上角：四個按鈕由上而下垂直排列 (1.登入 2.聲音 3.記錄 4.星光點數：星星在上方，下方365點) */}
            <div className="absolute right-2 sm:right-3 top-3.5 sm:top-4 bottom-1 sm:bottom-2 flex flex-col justify-between items-center w-[52px] sm:w-[56px] py-0.5">
              {/* 1. 👤 登入 */}
              <button
                onClick={() => {
                  sound.playSparkle();
                  setIsAuthOpen(true);
                }}
                title={currentUser.isLoggedIn ? currentUser.nickname : '會員登入'}
                className="w-full h-[35px] sm:h-[37px] rounded-xl sm:rounded-2xl bg-white/[0.07] hover:bg-amber-400/15 border border-white/15 hover:border-amber-300/40 flex flex-col items-center justify-center gap-0.5 text-amber-100/90 hover:text-amber-50 transition-all shadow-sm active:scale-95 group cursor-pointer"
              >
                {currentUser.isLoggedIn ? (
                  <img
                    src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                    alt={currentUser.nickname}
                    className="w-3.5 h-3.5 rounded-full border border-amber-300/60"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[9px] text-amber-100/90 group-hover:text-amber-50 tracking-wider max-w-[46px] truncate leading-none">
                  {currentUser.isLoggedIn ? currentUser.nickname : '登入'}
                </span>
              </button>

              {/* 2. 🔊 聲音 */}
              <button
                onClick={toggleSound}
                title={isMuted ? '開啟聲音' : '關閉聲音'}
                className="w-full h-[35px] sm:h-[37px] rounded-xl sm:rounded-2xl bg-white/[0.07] hover:bg-amber-400/15 border border-white/15 hover:border-amber-300/40 flex flex-col items-center justify-center gap-0.5 text-amber-100/90 hover:text-amber-50 transition-all shadow-sm active:scale-95 group cursor-pointer"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5 text-amber-300/60 group-hover:text-amber-200 transition-colors" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[9px] text-amber-100/90 group-hover:text-amber-50 tracking-wider leading-none">
                  聲音
                </span>
              </button>

              {/* 3. 📖 記錄 */}
              <button
                onClick={() => {
                  sound.playSparkle();
                  setIsArchiveOpen(true);
                }}
                title="靈魂記錄與檔案庫"
                className="w-full h-[35px] sm:h-[37px] rounded-xl sm:rounded-2xl bg-white/[0.07] hover:bg-amber-400/15 border border-white/15 hover:border-amber-300/40 flex flex-col items-center justify-center gap-0.5 text-amber-100/90 hover:text-amber-50 transition-all shadow-sm active:scale-95 group cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
                <span className="text-[9px] text-amber-100/90 group-hover:text-amber-50 tracking-wider leading-none">
                  記錄
                </span>
              </button>

              {/* 4. ⭐ 星光點數 (星星符號在上方，下方365點) */}
              <button
                onClick={() => {
                  sound.playSparkle();
                  setIsArchiveOpen(true);
                }}
                title={`星光點數：${points}點`}
                className="w-full h-[35px] sm:h-[37px] rounded-xl sm:rounded-2xl bg-amber-400/15 hover:bg-amber-400/25 border border-amber-300/40 hover:border-amber-300/70 flex flex-col items-center justify-center gap-0.5 text-amber-200 transition-all shadow-sm active:scale-95 group cursor-pointer"
              >
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse group-hover:scale-110 transition-transform" />
                <span className="text-[9.5px] font-mono text-amber-100 font-semibold tracking-wider leading-none">
                  {points}點
                </span>
              </button>
            </div>
          </header>

          {/* ================= 3. 主體內容區 (首頁六大門戶選取，往下排版與上方允許...形成明顯區隔) ================= */}
          <main className="flex-1 flex flex-col items-center justify-center px-2.5 sm:px-6 pt-2.5 sm:pt-4 md:pt-5 pb-0.5 z-10 w-full max-w-xl mx-auto landscape:py-4 landscape:pb-10">
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full flex flex-col items-center text-center my-auto"
            >
              {/* 探索指引標題 (與上方「允許自己成為自己」保持明顯空隙區隔，貼緊下方01-06標籤) */}
              <div className="flex items-center justify-center mt-0.5 sm:mt-1 mb-1.5 sm:mb-2 text-[11px] sm:text-xs text-amber-300 font-medium tracking-wide drop-shadow-[0_0_8px_rgba(251,191,36,0.3)] select-none whitespace-nowrap">
                ✦ 點擊或滑動下方 01～06 探索之門 ✦
              </div>

              {/* 中間01-06小鏈接分水嶺居中 (字體排版留意手機為一行字，色彩明晰溫暖) */}
              <div className="w-full flex items-center justify-between gap-1 sm:gap-1.5 px-0.5 mb-2 sm:mb-2.5 overflow-x-auto scrollbar-none py-1">
                {gates.map((g, idx) => {
                  const isActive = activeGateIndex === idx;
                  return (
                    <button
                      key={g.id}
                      onClick={() => changeGate(idx)}
                      className={`flex items-center justify-center gap-1 sm:gap-1.5 flex-1 min-w-0 py-1 sm:py-1.5 px-1 sm:px-2 rounded-xl text-[11px] sm:text-xs md:text-[13px] whitespace-nowrap transition-all shrink-0 active:scale-95 cursor-pointer group ${
                        isActive
                          ? 'bg-gradient-to-r from-amber-400/25 via-amber-300/30 to-amber-400/25 border border-amber-300/90 text-amber-50 shadow-[0_0_15px_rgba(251,191,36,0.4)] font-bold scale-105'
                          : 'bg-white/[0.07] border border-white/15 text-stone-200 hover:text-white hover:bg-white/15 hover:border-amber-300/30 font-medium'
                      }`}
                    >
                      <span className={isActive ? 'text-amber-300 font-extrabold' : 'text-amber-200/70 group-hover:text-amber-200 font-mono font-medium'}>
                        {g.tabNumber}
                      </span>
                      <span className={isActive ? 'text-amber-50 drop-shadow-[0_0_6px_rgba(251,191,36,0.4)]' : 'text-stone-200 group-hover:text-white'}>
                        {g.tabLabel.replace(/^\d+\s*/, '')}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 下方大方框鏈接區 (按鈕更精巧，預留更多寬度給卡片) */}
              <div className="w-full flex items-center justify-center gap-1 sm:gap-2 relative">
                {/* 左切換箭頭 */}
                <button
                  onClick={handlePrevGate}
                  title="上一個門"
                  className="p-1.5 sm:p-2 rounded-full bg-amber-400/10 hover:bg-amber-400/25 border border-amber-300/30 hover:border-amber-300/70 text-amber-200/90 hover:text-amber-100 transition-all active:scale-90 shrink-0 cursor-pointer shadow-[0_0_10px_rgba(251,191,36,0.15)] hover:shadow-[0_0_15px_rgba(251,191,36,0.35)]"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* 當前門戶大方框卡片 (大小與標題調小，在手機上確保是一行字不要變成兩行字) */}
                <div className="flex-1 overflow-hidden py-0.5 min-w-0">
                  <AnimatePresence mode="wait" custom={slideDirection}>
                    <motion.div
                      key={currentGate.id}
                      custom={slideDirection}
                      initial={{ opacity: 0, x: slideDirection * 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -slideDirection * 50 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(e, { offset }) => {
                        if (offset.x < -40) handleNextGate();
                        else if (offset.x > 40) handlePrevGate();
                      }}
                      onClick={currentGate.onClick}
                      className={`group relative p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-gradient-to-b ${currentGate.themeGradient} border ${currentGate.borderClass} shadow-2xl backdrop-blur-xl cursor-pointer flex flex-col justify-between transition-all overflow-hidden min-h-[165px] sm:min-h-[190px] w-full select-none text-left`}
                    >
                      <div
                        className={`absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full ${currentGate.blobColor} blur-2xl group-hover:scale-125 transition-all pointer-events-none`}
                      />

                      <div>
                        {/* 最上面頂部欄 (保留英文副標與序號標籤) */}
                        <div className="flex items-center justify-between mb-1 sm:mb-1.5">
                          <span
                            className={`text-[11px] sm:text-xs ${currentGate.accentColor} opacity-90 tracking-[0.2em] uppercase font-mono font-semibold drop-shadow-sm whitespace-nowrap`}
                          >
                            {currentGate.english}
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {currentGate.badge && (
                              <span className="text-[9.5px] sm:text-[10px] text-teal-200 font-mono px-2 py-0.5 rounded-full bg-teal-400/25 border border-teal-300/50 shadow-[0_0_8px_rgba(45,212,191,0.25)] whitespace-nowrap">
                                {currentGate.badge}
                              </span>
                            )}
                            <span className="text-[11px] sm:text-xs text-amber-100/90 font-mono px-2.5 py-0.5 rounded-full bg-white/10 border border-white/20 shadow-inner whitespace-nowrap">
                              {currentGate.tabNumber} / 06
                            </span>
                          </div>
                        </div>

                        {/* 主標題 (空隙加大，確保手機上一行字不換行) */}
                        <h2 className="text-[15.5px] xs:text-[17px] sm:text-lg md:text-xl font-normal text-white mb-2.5 sm:mb-3.5 tracking-wide whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)]">
                          {currentGate.title}
                        </h2>

                        {/* 說明文字 (與上方主標題空隙加大，行距舒適美觀) */}
                        <p className="text-xs sm:text-[13px] md:text-sm text-stone-100/95 leading-relaxed font-light min-h-[40px] sm:min-h-[48px] drop-shadow-sm">
                          {currentGate.description}
                        </p>
                      </div>

                      {/* 框內最右下邊：進入 ➔ */}
                      <div className="mt-2 sm:mt-2.5 flex justify-end items-center">
                        <span
                          className={`inline-flex items-center gap-1 text-sm sm:text-base font-semibold ${currentGate.accentColor} group-hover:translate-x-1.5 transition-transform drop-shadow-[0_0_10px_currentColor]`}
                        >
                          <span>進入</span>
                          <span className="text-base sm:text-lg font-bold">➔</span>
                        </span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* 右切換箭頭 */}
                <button
                  onClick={handleNextGate}
                  title="下一個門"
                  className="p-1.5 sm:p-2 rounded-full bg-amber-400/10 hover:bg-amber-400/25 border border-amber-300/30 hover:border-amber-300/70 text-amber-200/90 hover:text-amber-100 transition-all active:scale-90 shrink-0 cursor-pointer shadow-[0_0_10px_rgba(251,191,36,0.15)] hover:shadow-[0_0_15px_rgba(251,191,36,0.35)]"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* 6門位置指示點 */}
              <div className="flex items-center justify-center gap-1.5 mt-1 sm:mt-1.5">
                {gates.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => changeGate(idx)}
                    className={`transition-all rounded-full cursor-pointer ${
                      activeGateIndex === idx
                        ? 'w-6 h-1.5 bg-gradient-to-r from-amber-300 to-yellow-200 shadow-[0_0_8px_rgba(251,191,36,0.7)]'
                        : 'w-1.5 h-1.5 bg-white/35 hover:bg-white/60'
                    }`}
                    aria-label={`切換至門戶 ${idx + 1}`}
                  />
                ))}
              </div>

              {/* 底部靈性低語引導 */}
              <div className="mt-1 sm:mt-1.5 text-[10px] sm:text-[11.5px] text-amber-200/90 font-light tracking-wider whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-2 drop-shadow-sm">
                ✦ 感恩一切發生都是最好的安排 ✦
              </div>
            </motion.div>
          </main>

          {/* ================= 4. 底部資訊 (Footer：只在首頁顯示，底部空隙如同上方宣告之河與憶起之空隙) ================= */}
          <footer className="w-full max-w-xl mx-auto px-2 pt-1 pb-3.5 sm:pb-4 md:pb-5 text-center text-amber-100 font-light text-[10.5px] sm:text-xs tracking-tight sm:tracking-normal z-20 shrink-0 whitespace-nowrap overflow-hidden text-ellipsis drop-shadow-sm landscape:py-3">
            <p>宇宙永遠在傾聽，你所渴望的美好正以超越想像的方式走向你 ✨</p>
          </footer>
        </>
      ) : (
        /* ================= 獨立殿堂流程頁面 (無首頁雙重圓臉Logo，獨立全螢幕體驗) ================= */
        <main className="flex-1 w-full max-w-2xl mx-auto px-3 sm:px-6 py-2 sm:py-4 overflow-y-auto z-20">
          <AnimatePresence mode="wait">
            {/* ================= 視圖：釋放之門流程頁 ================= */}
            {currentView === 'release' && (
              <motion.div
                key="release"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full h-full"
              >
                <ReleaseSanctuary
                  onBack={() => setCurrentView('home')}
                  onOpenArchive={() => setIsArchiveOpen(true)}
                />
              </motion.div>
            )}

            {/* ================= 視圖：提問之門流程頁 ================= */}
            {currentView === 'inquire' && (
              <motion.div
                key="inquire"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full h-full"
              >
                <InquireSanctuary
                  onBack={() => setCurrentView('home')}
                  onOpenArchive={() => setIsArchiveOpen(true)}
                />
              </motion.div>
            )}

            {/* ================= 視圖：顯化之門流程頁 (含肯定句音檔與匿名願望星河) ================= */}
            {currentView === 'manifest' && (
              <motion.div
                key="manifest"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full h-full"
              >
                <ManifestSanctuaryV5
                  onBack={() => setCurrentView('home')}
                  onOpenArchive={() => setIsArchiveOpen(true)}
                  initialSubView={manifestInitialSubView}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      )}

      {/* ================= 接收之門：V4 冥想殿堂全螢幕彈窗 (含心靈音樂) ================= */}
      <DailyMeditationModalV4
        isOpen={isMeditationOpen}
        onClose={() => setIsMeditationOpen(false)}
        onPointsUpdated={(newPts) => setPoints(newPts)}
        onOpenMusic={() => setIsMusicOpen(true)}
      />

      {/* ================= 06 共時之門：神聖多牌組抽取全螢幕彈窗 (含今日宇宙金句卡、陪伴天使卡、獨角獸卡、Google試算表後台) ================= */}
      <MultiDeckDrawModal
        isOpen={isMultiDeckModalOpen}
        onClose={() => setIsMultiDeckModalOpen(false)}
        currentPoints={points}
        onPointsUpdated={(newPts) => setPoints(newPts)}
        onOpenArchive={() => setIsArchiveOpen(true)}
      />

      {/* ================= 快速抽卡彈窗 ================= */}
      <AnimatePresence>
        {quickCard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-sm w-full flex flex-col items-center"
            >
              <button
                onClick={() => setQuickCard(null)}
                className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <OracleCard card={quickCard} />
              <button
                onClick={() => setQuickCard(null)}
                className="mt-6 py-2 px-6 rounded-full bg-white/10 hover:bg-white/20 text-xs text-amber-200 border border-white/10"
              >
                收起卡片
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= 星空檔案庫彈窗 ================= */}
      <SoulArchiveModal
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
      />

      {/* ================= 音樂播放器彈窗 ================= */}
      <SoulMusicPlayerModal
        isOpen={isMusicOpen}
        onClose={() => setIsMusicOpen(false)}
        currentPoints={points}
        onPointsUpdated={(p) => setPoints(p)}
        onOpenMeditation={() => setIsMeditationOpen(true)}
      />

      {/* ================= Google 登入彈窗 ================= */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUserChange={(u: SoulUser) => setCurrentUser(u)}
        currentPoints={points}
      />
    </div>
  );
}
