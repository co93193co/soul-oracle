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

  // 6大門戶定義 (01釋放 ➔ 02提問 ➔ 03接收 ➔ 04宣告 ➔ 05顯化 ➔ 06共時)
  const gates = [
    {
      id: 'release',
      tabNumber: '01',
      tabLabel: '01 釋放之門',
      icon: Moon,
      english: 'RELEASE & SURRENDER',
      title: '🌙 釋放之門 ‧ 心靈傾訴',
      description:
        '倒出積壓的心事與煩惱，在文字散去的星塵中放手，透過 4-4 呼吸調頻，接收宇宙智者的三層溫暖回信與解憂覺察卡。',
      actionText: '推開釋放之門 ➔',
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
      tabLabel: '02 提問之門',
      icon: Compass,
      english: 'INQUIRE & CLARIFY',
      title: '🔮 提問之門 ‧ 靈魂探問',
      description:
        '帶著你心中最核心的困惑與抉擇，向浩瀚宇宙提出真誠探問。撥開盲點迷霧，看見事件背後的深層學習與靈魂方向指引。',
      actionText: '推開提問之門 ➔',
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
      tabLabel: '03 接收之門',
      icon: Flame,
      english: 'RECEIVE & MEDITATE',
      title: '🕊️ 接收之門 ‧ 靈感聆聽',
      badge: `+${meditationStats.streakDays}天`,
      description:
        '放下掌控與內在緊繃，將心輪完全敞開如同一只純淨空杯。透過四方神聖箱型呼吸冥想與心靈音樂，盛接宇宙的高頻靈感與恩典卡。',
      actionText: '推開接收之門 (進入冥想與音樂) ➔',
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
      tabLabel: '04 宣告之門',
      icon: Globe,
      english: 'PROCLAIM & ALIGN TO COSMOS',
      title: '💫 宣告之門 ‧ 宇宙發願',
      description:
        '將深藏心底的真摯祈願，化作純淨星塵向浩瀚宇宙大聲宣告。在此寫下匿名心願注入集體星河，彼此加持「允許發生」，信任宇宙必有回響。',
      actionText: '推開宣告之門 (寫下願望星願) ➔',
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
      tabLabel: '05 顯化之門',
      icon: Sun,
      english: 'MANIFEST & ACTUALIZE',
      title: '☀️ 顯化之門 ‧ 願景成真',
      description:
        '當真摯心願已向天宣告，此門為你築起實相顯影的基石。深植信念種子，藉由肯定句頻率洗滌潛意識盲點，信任宇宙安排，體驗『早已圓滿』，靜待一切美好自然成真。',
      actionText: '推開顯化之門 (金種播種‧肯定句) ➔',
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
      tabLabel: '06 共時之門',
      icon: Sparkles,
      english: 'SYNCHRONICITY & ORACLES',
      title: '✨ 共時之門 ‧ 靈魂指引',
      description:
        '匯聚浩瀚宇宙的高頻神聖牌卡。靜心深呼吸，傾聽直覺呼喚，接收今日宇宙金句、守護天使與魔法獨角獸帶來的即時恩典與能量指引。',
      actionText: '推開共時之門 (今日金句‧天使‧獨角獸) ➔',
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
  const GateIcon = currentGate.icon;

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col justify-between selection:bg-amber-400/20 bg-[#070919] text-amber-50">
      {/* ================= 1. 最頂端天際線：宇宙匿名願望之河 (平行向天際跑動宣告) ================= */}
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
        <div className="shrink-0 pl-2 text-[10px] text-teal-300/60 font-mono hidden sm:block">
          ✦ 向天發願 ✦
        </div>
      </div>

      {/* ================= 2. 頂部區域：中央 (憶起 Logo + 微笑圓臉光球 + 引導小字 全部置中) ＆ 右上角 (垂直排列之四連結) ================= */}
      <header className="relative w-full max-w-5xl mx-auto px-3.5 sm:px-6 pt-2 sm:pt-3 pb-1 sm:pb-2 flex items-center justify-center z-20 h-[160px] sm:h-[174px] shrink-0">
        {/* 中央：憶起 Logo + 微笑光球 + 引導小字 (位置全部修正置中，高度大小與右側一致) */}
        <div
          onClick={() => {
            if (currentView !== 'home') setCurrentView('home');
          }}
          className={`h-full flex flex-col items-center justify-between text-center max-w-[calc(100%-116px)] sm:max-w-md ${
            currentView !== 'home' ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
          }`}
          title={currentView !== 'home' ? '點擊返回首頁' : '憶起'}
        >
          <SmilingCosmicOrb
            size="sm"
            themeColor="amber"
            logoText="憶起"
            logoPosition="left"
            align="center"
            className="h-full"
            onLogoClick={() => {
              if (currentView !== 'home') setCurrentView('home');
            }}
            onOrbClick={() => {
              sound.playHeartbeat();
              if (currentView !== 'home') setCurrentView('home');
            }}
            guideText={
              currentView === 'home'
                ? '宇宙正溫柔地微笑著看著你，\n放鬆下來...'
                : '✦ 點擊返回首頁靈魂殿堂 ✦'
            }
          />
        </div>

        {/* 右上角：四個按鈕由上而下垂直排列 (1.登入 2.聲音 3.記錄 4.星光點數) */}
        <div className="absolute right-3.5 sm:right-6 top-2 sm:top-3 bottom-1 sm:bottom-2 flex flex-col justify-between items-center w-[54px] sm:w-[60px] py-0.5">
          {/* 1. 👤 登入 */}
          <button
            onClick={() => {
              sound.playSparkle();
              setIsAuthOpen(true);
            }}
            title={currentUser.isLoggedIn ? currentUser.nickname : '會員登入'}
            className="w-full h-[35px] sm:h-[38px] rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 flex flex-col items-center justify-center gap-0.5 text-amber-200/80 hover:text-white transition-all shadow-sm active:scale-95 group cursor-pointer"
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
            <span className="text-[9px] text-amber-200/70 group-hover:text-amber-100 tracking-wider max-w-[46px] truncate leading-none">
              {currentUser.isLoggedIn ? currentUser.nickname : '登入'}
            </span>
          </button>

          {/* 2. 🔊 聲音 */}
          <button
            onClick={toggleSound}
            title={isMuted ? '開啟聲音' : '關閉聲音'}
            className="w-full h-[35px] sm:h-[38px] rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 flex flex-col items-center justify-center gap-0.5 text-amber-200/80 hover:text-white transition-all shadow-sm active:scale-95 group cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-amber-300/60 group-hover:text-amber-200 transition-colors" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-[9px] text-amber-200/70 group-hover:text-amber-100 tracking-wider leading-none">
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
            className="w-full h-[35px] sm:h-[38px] rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 flex flex-col items-center justify-center gap-0.5 text-amber-200/80 hover:text-white transition-all shadow-sm active:scale-95 group cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300 group-hover:scale-110 transition-transform" />
            <span className="text-[9px] text-amber-200/70 group-hover:text-amber-100 tracking-wider leading-none">
              記錄
            </span>
          </button>

          {/* 4. ⭐ 星光點數 */}
          <button
            onClick={() => {
              sound.playSparkle();
              setIsArchiveOpen(true);
            }}
            title="星光點數"
            className="w-full h-[35px] sm:h-[38px] rounded-xl sm:rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-300/30 flex flex-col items-center justify-center gap-0.5 text-amber-200 transition-all shadow-sm active:scale-95 group cursor-pointer"
          >
            <div className="flex items-center gap-0.5 leading-none">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300 animate-pulse" />
              <span className="font-mono text-[10.5px] font-semibold text-amber-100 leading-none">{points}</span>
            </div>
            <span className="text-[8.5px] text-amber-300/80 tracking-wider leading-none">
              星光點數
            </span>
          </button>
        </div>
      </header>

      {/* ================= 3. 主體內容區 (響應式零垂直滾動，僅左右滑動切換) ================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-6 py-1 sm:py-2 z-10 w-full max-w-5xl mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          {/* ================= 視圖：首頁六大門戶左右滑動選取 ================= */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-4xl flex flex-col items-center text-center my-auto"
            >
              {/* 左右滑動引導提示微光文字 */}
              <div className="flex items-center justify-center gap-2 mb-1.5 text-[11px] sm:text-xs text-amber-200/80 font-mono tracking-wider animate-pulse select-none">
                <span className="text-amber-300 font-bold">←</span>
                <span>左右滑動探索 01～06 聖門 ‧ 點擊推開進入</span>
                <span className="text-amber-300 font-bold">→</span>
              </div>

              {/* 6個門左右滑動選取標籤列 (01 釋放之門 ~ 06 共時之門) */}
              <div className="w-full flex items-center justify-center gap-1 sm:gap-2 px-1 mb-2 sm:mb-2.5 overflow-x-auto scrollbar-none py-1">
                {gates.map((g, idx) => {
                  const isActive = activeGateIndex === idx;
                  return (
                    <button
                      key={g.id}
                      onClick={() => changeGate(idx)}
                      className={`flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl sm:rounded-2xl text-[10.5px] sm:text-xs font-medium whitespace-nowrap transition-all shrink-0 active:scale-95 cursor-pointer ${
                        isActive
                          ? 'bg-amber-400/20 border border-amber-300/70 text-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)] font-semibold scale-105'
                          : 'bg-white/5 border border-white/10 text-white/60 hover:text-white/90 hover:bg-white/10'
                      }`}
                    >
                      <span className={isActive ? 'text-amber-300 font-bold' : 'text-white/40'}>
                        {g.tabNumber}
                      </span>
                      <span>{g.tabLabel.replace(/^\d+\s*/, '')}</span>
                    </button>
                  );
                })}
              </div>

              {/* 左右滑動選取之門戶卡片區 (大小與釋放之門一致，RWD 自適應零上下滾動) */}
              <div className="w-full flex items-center justify-center gap-1.5 sm:gap-4 relative px-1">
                {/* 左切換箭頭 (呼吸微光) */}
                <button
                  onClick={handlePrevGate}
                  title="上一個門"
                  className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white/70 hover:text-amber-200 transition-all active:scale-90 shrink-0 cursor-pointer shadow-[0_0_10px_rgba(251,191,36,0.15)] hover:shadow-[0_0_15px_rgba(251,191,36,0.35)]"
                >
                  <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>

                {/* 當前門戶卡片 (左右滑動切換動畫，觸控支援左右拖拉) */}
                <div className="flex-1 max-w-xl overflow-hidden py-1">
                  <AnimatePresence mode="wait" custom={slideDirection}>
                    <motion.div
                      key={currentGate.id}
                      custom={slideDirection}
                      initial={{ opacity: 0, x: slideDirection * 60 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -slideDirection * 60 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragEnd={(e, { offset }) => {
                        if (offset.x < -40) handleNextGate();
                        else if (offset.x > 40) handlePrevGate();
                      }}
                      onClick={currentGate.onClick}
                      className={`group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b ${currentGate.themeGradient} border ${currentGate.borderClass} shadow-2xl backdrop-blur-xl cursor-pointer flex flex-col justify-between transition-all overflow-hidden min-h-[260px] sm:min-h-[280px] w-full select-none text-left`}
                    >
                      <div
                        className={`absolute top-0 right-0 -mr-8 -mt-8 w-36 h-36 rounded-full ${currentGate.blobColor} blur-2xl group-hover:scale-125 transition-all pointer-events-none`}
                      />

                      <div>
                        <div className="flex items-center justify-between mb-3.5">
                          <div
                            className={`w-10 h-10 rounded-2xl ${currentGate.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                          >
                            <GateIcon className="w-5 h-5" />
                          </div>
                          <div className="flex items-center gap-1.5">
                            {currentGate.badge && (
                              <span className="text-[10px] text-teal-300 font-mono px-2 py-0.5 rounded bg-teal-400/20 border border-teal-300/30">
                                {currentGate.badge}
                              </span>
                            )}
                            <span className="text-xs text-white/40 font-mono px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10">
                              {currentGate.tabNumber} / 06
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[11px] ${currentGate.accentColor} opacity-70 tracking-widest block uppercase mb-1 font-mono`}
                        >
                          {currentGate.english}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-light text-white mb-2 tracking-wide">
                          {currentGate.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-light min-h-[66px] sm:min-h-[72px]">
                          {currentGate.description}
                        </p>
                      </div>

                      <div
                        className={`mt-5 flex items-center gap-1.5 text-xs ${currentGate.accentColor} font-medium group-hover:translate-x-1.5 transition-transform`}
                      >
                        <span>{currentGate.actionText}</span>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* 右切換箭頭 (呼吸微光) */}
                <button
                  onClick={handleNextGate}
                  title="下一個門"
                  className="p-2 sm:p-2.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-white/70 hover:text-amber-200 transition-all active:scale-90 shrink-0 cursor-pointer shadow-[0_0_10px_rgba(251,191,36,0.15)] hover:shadow-[0_0_15px_rgba(251,191,36,0.35)]"
                >
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>

              {/* 6門位置指示點 */}
              <div className="flex items-center justify-center gap-1.5 mt-2.5 sm:mt-3">
                {gates.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => changeGate(idx)}
                    className={`transition-all rounded-full cursor-pointer ${
                      activeGateIndex === idx
                        ? 'w-6 h-1.5 bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]'
                        : 'w-1.5 h-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                    aria-label={`切換至門戶 ${idx + 1}`}
                  />
                ))}
              </div>

              {/* 底部靈性低語引導 */}
              <div className="mt-2 text-[10.5px] sm:text-[11px] text-amber-200/40 font-light tracking-wider">
                ✦ 宇宙正溫柔地傾聽你的宣告，允許一切美好自然發生 ✦
              </div>
            </motion.div>
          )}

          {/* ================= 視圖：釋放之門流程頁 ================= */}
          {currentView === 'release' && (
            <div className="w-full h-full overflow-y-auto">
              <ReleaseSanctuary
                onBack={() => setCurrentView('home')}
                onOpenArchive={() => setIsArchiveOpen(true)}
              />
            </div>
          )}

          {/* ================= 視圖：提問之門流程頁 ================= */}
          {currentView === 'inquire' && (
            <div className="w-full h-full overflow-y-auto">
              <InquireSanctuary
                onBack={() => setCurrentView('home')}
                onOpenArchive={() => setIsArchiveOpen(true)}
              />
            </div>
          )}

          {/* ================= 視圖：顯化之門流程頁 (含肯定句音檔與匿名願望星河) ================= */}
          {currentView === 'manifest' && (
            <div className="w-full h-full overflow-y-auto">
              <ManifestSanctuaryV5
                onBack={() => setCurrentView('home')}
                onOpenArchive={() => setIsArchiveOpen(true)}
                initialSubView={manifestInitialSubView}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= 4. 底部資訊 (Footer) ================= */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-2 sm:py-2.5 text-center text-amber-200/40 text-[11px] tracking-wider z-20 shrink-0">
        <p>宇宙永遠在傾聽，你所渴望的美好正以超越想像的方式走向你 ✨</p>
      </footer>

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
