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
  ArrowRight,
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
import { sound } from '@/lib/sound';
import { localStore, SoulUser, MeditationStats } from '@/lib/storage';
import { getRandomCard, OracleCardData } from '@/lib/presets/cardsData';

type GateId = 'release' | 'inquire' | 'receive' | 'manifest';

interface GateConfig {
  id: GateId;
  index: number;
  tabLabel: string;
  iconSymbol: string;
  title: string;
  corePhrase: string; // 用戶指定的核心文字
  english: string;
  themeColor: 'indigo' | 'purple' | 'teal' | 'amber';
  bgGradient: string;
  borderClass: string;
  glowBg: string;
  accentText: string;
}

const GATES_CONFIG: GateConfig[] = [
  {
    id: 'release',
    index: 0,
    tabLabel: '釋放之門',
    iconSymbol: '🌙',
    title: '🌙 釋放之門',
    corePhrase: '心情書寫 ‧ 覺察恐懼',
    english: 'RELEASE & SURRENDER',
    themeColor: 'indigo',
    bgGradient: 'from-[#111636]/90 via-[#0d1028]/90 to-[#070919]/95',
    borderClass: 'border-indigo-400/40 hover:border-indigo-400/80',
    glowBg: 'bg-indigo-500/20',
    accentText: 'text-indigo-300',
  },
  {
    id: 'inquire',
    index: 1,
    tabLabel: '提問之門',
    iconSymbol: '🔮',
    title: '🔮 提問之門',
    corePhrase: '靈魂探問 ‧ 盲點覺察',
    english: 'INQUIRE & CLARIFY',
    themeColor: 'purple',
    bgGradient: 'from-[#1d1135]/90 via-[#130a24]/90 to-[#090513]/95',
    borderClass: 'border-purple-400/40 hover:border-purple-400/80',
    glowBg: 'bg-purple-500/20',
    accentText: 'text-purple-300',
  },
  {
    id: 'receive',
    index: 2,
    tabLabel: '接收之門',
    iconSymbol: '🕊️',
    title: '🕊️ 接收之門',
    corePhrase: '靈感聆聽 ‧ 冥想覺察',
    english: 'RECEIVE & MEDITATE',
    themeColor: 'teal',
    bgGradient: 'from-[#0a2328]/90 via-[#07171b]/90 to-[#030d10]/95',
    borderClass: 'border-teal-400/40 hover:border-teal-400/80',
    glowBg: 'bg-teal-500/20',
    accentText: 'text-teal-300',
  },
  {
    id: 'manifest',
    index: 3,
    tabLabel: '顯化之門',
    iconSymbol: '☀️',
    title: '☀️ 顯化之門',
    corePhrase: '願望播種 ‧ 允許顯化',
    english: 'MANIFEST & ALIGN',
    themeColor: 'amber',
    bgGradient: 'from-[#251910]/90 via-[#18110b]/90 to-[#0c0805]/95',
    borderClass: 'border-amber-400/40 hover:border-amber-400/80',
    glowBg: 'bg-amber-500/20',
    accentText: 'text-amber-300',
  },
];

const TICKER_WISHES = [
  '願家人健康平安，身心無病無憂 ‧ ✦ 允許發生 ✦',
  '放下過去的執念，擁抱全新的光與可能 ‧ ✦ 允許發生 ✦',
  '信任豐盛正在以意想不到的方式走向我 ‧ ✦ 允許發生 ✦',
  '允許自己在下週的挑戰中發揮最好實力 ‧ ✦ 允許發生 ✦',
  '敞開迎接真正懂我、珍惜我的靈魂伴侶 ‧ ✦ 允許發生 ✦',
];

export default function V6Page() {
  // 首頁上當前選取的門戶 (0: 釋放之門, 1: 提問之門, 2: 接收之門, 3: 顯化之門)
  const [selectedGateIndex, setSelectedGateIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(0);

  // 點入後的專屬門戶頁面狀態 (null = 在首頁, 有值 = 進入獨立頁面)
  const [activeSanctuary, setActiveSanctuary] = useState<GateId | null>(null);

  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isMeditationOpen, setIsMeditationOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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

  const [quickCard, setQuickCard] = useState<OracleCardData | null>(null);

  useEffect(() => {
    setCurrentUser(localStore.getUser());
    setPoints(localStore.getPoints() || 365);
    setMeditationStats(localStore.getMeditationStats());
  }, [activeSanctuary, isArchiveOpen, isMeditationOpen, isMusicOpen]);

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

  const currentGate = GATES_CONFIG[selectedGateIndex];

  // 左右切換 (支援點選四門連動與左右滑動)
  const handleSelectGate = (idx: number) => {
    sound.playSparkle();
    setSwipeDirection(idx > selectedGateIndex ? 1 : -1);
    setSelectedGateIndex(idx);
  };

  const handlePrevGate = () => {
    sound.playSparkle();
    setSwipeDirection(-1);
    setSelectedGateIndex((prev) => (prev - 1 + GATES_CONFIG.length) % GATES_CONFIG.length);
  };

  const handleNextGate = () => {
    sound.playSparkle();
    setSwipeDirection(1);
    setSelectedGateIndex((prev) => (prev + 1) % GATES_CONFIG.length);
  };

  // 點入進入專屬頁面
  const handleEnterCurrentGate = () => {
    if (currentGate.id === 'release') {
      sound.playSingingBowl432();
      setActiveSanctuary('release');
    } else if (currentGate.id === 'inquire') {
      sound.playSingingBowl432();
      setActiveSanctuary('inquire');
    } else if (currentGate.id === 'receive') {
      sound.playSingingBowl432();
      setActiveSanctuary('receive');
    } else if (currentGate.id === 'manifest') {
      sound.playSingingBowl528();
      setActiveSanctuary('manifest');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-400/20 bg-[#060814] text-amber-50">
      {/* ================= 第一行：靈魂之境改為 (憶起) ＋ 其餘鏈接不變 ================= */}
      <header className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-2 sm:py-4 flex items-center justify-between z-20">
        {/* 左側：改為「憶起」(可點擊返回V5) */}
        <Link
          href="/v5"
          className="flex items-center gap-2 group cursor-pointer"
          title="憶起"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
            ✦
          </div>
          <span className="text-base sm:text-lg font-light tracking-widest text-amber-100 group-hover:text-amber-300 transition-colors">
            憶起
          </span>
        </Link>

        {/* 右側：其餘鏈接完全保留 (點數、音樂、音效、檔案庫、登入) */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* 星光點數 */}
          <div
            onClick={() => setIsArchiveOpen(true)}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/25 text-amber-200 text-xs tracking-wider cursor-pointer hover:bg-amber-400/20 transition-colors shadow-sm"
          >
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
            <span className="font-mono">{points} 點</span>
          </div>

          {/* 心靈音樂 */}
          <button
            onClick={() => {
              sound.playSparkle();
              setIsMusicOpen(true);
            }}
            title="心靈音樂播放器"
            className="p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-purple-300/80 hover:text-white transition-colors"
          >
            <Music className="w-4 h-4" />
          </button>

          {/* 音效開關 */}
          <button
            onClick={toggleSound}
            aria-label="切換音效"
            className="p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-amber-200/70 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* 檔案庫 */}
          <button
            onClick={() => setIsArchiveOpen(true)}
            className="flex items-center gap-1.5 py-1 px-2.5 sm:px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-100 tracking-wider transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[11px] sm:text-xs">檔案庫</span>
          </button>

          {/* Google 登入 */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-1.5 py-1 px-2.5 sm:px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-100 transition-all"
          >
            {currentUser.isLoggedIn ? (
              <>
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                  alt={currentUser.nickname}
                  className="w-4 h-4 rounded-full border border-amber-300/60"
                />
                <span className="max-w-[60px] truncate hidden sm:inline text-[11px]">
                  {currentUser.nickname}
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span className="text-[11px]">登入</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ================= 主體內容區 ================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-6 py-1 sm:py-4 z-10 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ================= 狀態 A：首頁 ================= */}
          {activeSanctuary === null && (
            <motion.div
              key="v6-home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full flex flex-col items-center text-center space-y-1.5 sm:space-y-4"
            >
              {/* 中央微笑光球 (安詳呼吸) */}
              <div className="my-0.5 sm:my-2">
                <SmilingCosmicOrb
                  size="md"
                  themeColor={currentGate.themeColor}
                  guideText="宇宙正溫柔地微笑著看著你，放鬆下來..."
                />
              </div>

              {/* 快速抽取今日靈魂指引卡 (與上圖完全一致) */}
              <div>
                <button
                  onClick={handleQuickDraw}
                  className="flex items-center gap-1.5 sm:gap-2 py-1 sm:py-2 px-4 sm:px-5 rounded-full bg-gradient-to-r from-white/10 to-amber-400/10 hover:from-white/20 hover:to-amber-400/20 border border-amber-300/35 text-[11px] sm:text-xs text-amber-200 tracking-wider sm:tracking-widest transition-all shadow-md group active:scale-95"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform" />
                  <span>✦ 快速抽取今日靈魂指引卡 ✦</span>
                </button>
              </div>

              {/* ================= 四大門切換連結欄 (釋放之門、提問之門、接收之門、顯化之門) ================= */}
              <div className="w-full max-w-md p-1 sm:p-1.5 rounded-2xl bg-black/60 border border-white/15 grid grid-cols-4 gap-1 sm:gap-1.5 shadow-inner">
                {GATES_CONFIG.map((gate, idx) => {
                  const isSelected = selectedGateIndex === idx;
                  return (
                    <button
                      key={gate.id}
                      onClick={() => handleSelectGate(idx)}
                      className={`py-1 sm:py-2 px-0.5 sm:px-1 rounded-xl transition-all flex flex-col items-center justify-center gap-0.5 text-center ${
                        isSelected
                          ? `${gate.bgGradient} ${gate.borderClass} border shadow-lg ring-1 ring-white/25 scale-[1.02]`
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="text-sm sm:text-base">{gate.iconSymbol}</span>
                      <span className="text-[10px] sm:text-[11px] font-medium leading-tight mt-0.5">
                        {gate.tabLabel}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-mono opacity-50">0{idx + 1}</span>
                    </button>
                  );
                })}
              </div>

              {/* ================= 下方方框 (連動與左右滑動切換，極簡兩行緊湊設計) ================= */}
              <div className="w-full max-w-md relative select-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentGate.id}
                    initial={{ opacity: 0, x: swipeDirection > 0 ? 30 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: swipeDirection > 0 ? -30 : 30 }}
                    transition={{ duration: 0.25 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -40) {
                        handleNextGate();
                      } else if (info.offset.x > 40) {
                        handlePrevGate();
                      }
                    }}
                    onClick={handleEnterCurrentGate}
                    className={`group relative p-3 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-b ${currentGate.bgGradient} border ${currentGate.borderClass} shadow-2xl backdrop-blur-xl cursor-pointer text-center transition-all overflow-hidden active:scale-98`}
                  >
                    <div
                      className={`absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full ${currentGate.glowBg} blur-3xl pointer-events-none`}
                    />

                    {/* 第一行：心情書寫 ‧ 覺察恐懼 (依門戶切換) */}
                    <div className="py-0.5 sm:py-2">
                      <p className="text-sm sm:text-lg font-light text-white tracking-wider sm:tracking-widest">
                        {currentGate.corePhrase}
                      </p>
                    </div>

                    {/* 第二行：推門進入與箭頭符號 */}
                    <div className="pt-1.5 sm:pt-3 flex items-center justify-center">
                      <span
                        className={`inline-flex items-center gap-1.5 sm:gap-2 py-1 sm:py-2 px-4 sm:px-7 rounded-full bg-white/10 group-hover:bg-white/20 border border-white/20 text-xs sm:text-sm font-medium ${currentGate.accentText} group-hover:text-white transition-all shadow-md group-hover:scale-105`}
                      >
                        <span>推門進入</span>
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* 左右輔助按鈕 */}
                <button
                  onClick={handlePrevGate}
                  className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/90 active:scale-95 shadow-md"
                  title="前一門"
                >
                  <ChevronLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={handleNextGate}
                  className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/90 active:scale-95 shadow-md"
                  title="下一門"
                >
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* ================= 下面接：快速抽取宇宙給你的靈魂訊息 連結 ================= */}
              <div className="pt-0.5 sm:pt-1">
                <button
                  onClick={handleQuickDraw}
                  className="inline-flex items-center gap-1.5 sm:gap-2 py-1 sm:py-2 px-4 sm:px-5 rounded-full bg-gradient-to-r from-amber-400/15 via-purple-400/15 to-indigo-400/15 hover:from-amber-400/25 hover:via-purple-400/25 hover:to-indigo-400/25 border border-amber-300/35 text-[10px] sm:text-xs text-amber-200 tracking-wider transition-all shadow-sm active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>✦ 快速抽取宇宙給你的靈魂訊息 ✦</span>
                </button>
              </div>

              {/* ================= 下面是：宇宙匿名願望之河 (原本最底下一樣) ================= */}
              <div
                onClick={() => setActiveSanctuary('manifest')}
                className="w-full max-w-md p-1.5 sm:p-3 rounded-2xl bg-black/40 border border-teal-400/25 hover:border-teal-400/50 cursor-pointer transition-all shadow-md overflow-hidden relative group text-left my-0.5 sm:my-1"
                title="點擊展開宇宙集體願望星河"
              >
                <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-teal-300 mb-0.5 sm:mb-1 px-1 font-mono">
                  <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" />
                  <span>✦ 宇宙匿名願望之河 ‧ 點入展開彼此加持「允許發生」✦</span>
                </div>
                <div className="w-full overflow-hidden whitespace-nowrap text-left">
                  <div className="inline-block animate-marquee text-[10px] sm:text-[11px] text-teal-100/80 font-light space-x-6">
                    {TICKER_WISHES.map((wish, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5">
                        <Heart className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-pink-400 inline" />
                        <span>{wish}</span>
                        <span className="text-teal-400/40">✦</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ================= 狀態 B：點入特定門戶的專屬頁面 (含 (X) 回首頁 與 前後4大框點入鏈接) ================= */}
          {activeSanctuary !== null && (
            <motion.div
              key={`sanctuary-${activeSanctuary}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex flex-col items-center"
            >
              {/* 專屬頂部導覽列：(X) 回首頁 ＋ 前後4大框點入鏈接 (全響應式) */}
              <div className="w-full max-w-3xl mb-4 sm:mb-6 p-2.5 sm:p-3 rounded-2xl bg-black/50 border border-white/15 backdrop-blur-xl flex flex-col gap-2.5 shadow-xl">
                {/* 第一列：左側前一門、中央(X)回首頁、右側後一門 */}
                <div className="w-full flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      sound.playSparkle();
                      const currentIdx = GATES_CONFIG.findIndex((g) => g.id === activeSanctuary);
                      const prevIdx = (currentIdx - 1 + GATES_CONFIG.length) % GATES_CONFIG.length;
                      setActiveSanctuary(GATES_CONFIG[prevIdx].id);
                    }}
                    className="flex items-center gap-1 sm:gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-200 transition-all shrink-0 active:scale-95"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>前一門</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playSparkle();
                      setActiveSanctuary(null);
                    }}
                    className="flex items-center gap-1.5 py-1.5 px-3 sm:px-4 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-400/20 hover:from-amber-400/30 hover:to-yellow-400/30 border border-amber-300/40 text-xs text-amber-200 hover:text-white font-medium transition-all shadow-sm active:scale-95"
                    title="關閉並返回首頁"
                  >
                    <X className="w-3.5 h-3.5 text-amber-300" />
                    <span>回首頁</span>
                  </button>

                  <button
                    onClick={() => {
                      sound.playSparkle();
                      const currentIdx = GATES_CONFIG.findIndex((g) => g.id === activeSanctuary);
                      const nextIdx = (currentIdx + 1) % GATES_CONFIG.length;
                      setActiveSanctuary(GATES_CONFIG[nextIdx].id);
                    }}
                    className="flex items-center gap-1 sm:gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-200 transition-all shrink-0 active:scale-95"
                  >
                    <span>下一門</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 第二列：四大門戶直接點入切換標籤 */}
                <div className="w-full grid grid-cols-4 gap-1.5 pt-1.5 border-t border-white/10">
                  {GATES_CONFIG.map((g) => {
                    const isCurrent = g.id === activeSanctuary;
                    return (
                      <button
                        key={g.id}
                        onClick={() => {
                          sound.playSparkle();
                          setActiveSanctuary(g.id);
                        }}
                        className={`py-1.5 px-1 rounded-xl text-center transition-all flex items-center justify-center gap-1 ${
                          isCurrent
                            ? `${g.bgGradient} ${g.borderClass} border shadow-md ring-1 ring-white/20 text-white font-medium`
                            : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs'
                        }`}
                      >
                        <span className="text-xs">{g.iconSymbol}</span>
                        <span className="text-[11px] truncate">{g.tabLabel}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 門戶專屬主體內容 (全響應式 RWD) */}
              <div className="w-full max-w-3xl">
                {activeSanctuary === 'release' && (
                  <ReleaseSanctuary
                    onBack={() => setActiveSanctuary(null)}
                    onOpenArchive={() => setIsArchiveOpen(true)}
                  />
                )}

                {activeSanctuary === 'inquire' && (
                  <InquireSanctuary
                    onBack={() => setActiveSanctuary(null)}
                    onOpenArchive={() => setIsArchiveOpen(true)}
                  />
                )}

                {activeSanctuary === 'receive' && (
                  <div className="w-full max-w-2xl mx-auto flex flex-col items-center px-3.5 sm:px-4 py-4 sm:py-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 mb-3 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                      <Flame className="w-6 h-6 text-teal-300" />
                    </div>

                    <span className="text-[10px] text-teal-300/80 uppercase tracking-widest font-mono mb-1">
                      ✦ SACRED BOX BREATHING SANCTUARY ✦
                    </span>
                    <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide mb-3">
                      🕊️ 接收之門 ‧ 靈感聆聽
                    </h2>

                    <div className="w-full p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0a2328]/90 via-[#07171b]/90 to-[#030d10]/95 border border-teal-400/40 text-left shadow-2xl relative overflow-hidden mb-6">
                      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
                      <p className="text-sm text-teal-100/90 leading-relaxed font-light mb-4">
                        「如同四方穩固的能量方框，每一個停留都是對當下的完全臨在。吸氣聚集光芒、閉氣凝聚力量、吐氣釋放緊繃、閉氣回歸空白。」
                      </p>
                      <p className="text-xs sm:text-sm text-teal-200/70 leading-relaxed font-light">
                        放下掌控與內在緊繃，將心輪完全敞開如同一只純淨空杯。透過四方神聖箱型呼吸冥想，盛接宇宙的高頻靈感與恩典卡。
                      </p>

                      <div className="mt-4 pt-3 border-t border-teal-400/20 flex flex-wrap items-center justify-between text-xs text-teal-300 gap-2 font-mono">
                        <span>連續累積：{meditationStats.streakDays} 天</span>
                        <span>✨ 1分=1點 ~ 5分=5點 (每日上限10點)</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        sound.playSingingBowl432();
                        setIsMeditationOpen(true);
                      }}
                      className="w-full sm:w-auto py-3.5 px-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-bold text-sm tracking-widest transition-all shadow-[0_0_25px_rgba(20,184,166,0.4)] active:scale-95"
                    >
                      ✦ 點入開啟 16 秒四方箱型呼吸冥想 ✦
                    </button>
                  </div>
                )}

                {activeSanctuary === 'manifest' && (
                  <ManifestSanctuaryV5
                    onBack={() => setActiveSanctuary(null)}
                    onOpenArchive={() => setIsArchiveOpen(true)}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= 底部資訊 (Footer) ================= */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-1.5 sm:py-4 text-center text-amber-200/40 text-[10px] sm:text-[11px] tracking-wider z-20">
        <p>宇宙永遠在傾聽，你所渴望的美好正以超越想像的方式走向你 ✨</p>
      </footer>

      {/* ================= 接收之門：V4 冥想殿堂全螢幕彈窗 ================= */}
      <DailyMeditationModalV4
        isOpen={isMeditationOpen}
        onClose={() => setIsMeditationOpen(false)}
        onPointsUpdated={(newPts) => setPoints(newPts)}
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
