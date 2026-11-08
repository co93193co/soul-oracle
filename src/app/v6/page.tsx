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
  ChevronRight,
  ChevronLeft,
  Feather,
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

// V6 神聖四部曲門戶定義
const GATES_DATA = [
  {
    id: 'release',
    stepNumber: '01',
    symbol: '🌙',
    title: '釋放之門',
    subtitle: '心靈傾訴 ‧ 排毒放手',
    english: 'RELEASE & SURRENDER',
    colorName: '靛藍星夜',
    themeColor: 'indigo',
    borderClass: 'border-indigo-400/40 hover:border-indigo-400/70',
    bgGradient: 'from-[#111636]/90 via-[#0d1028]/90 to-[#070919]/95',
    accentText: 'text-indigo-300',
    glowBg: 'bg-indigo-500/15',
    desc: '倒出積壓的心事與煩惱，在文字散去的星塵中放手，透過 4-4 呼吸調頻，接收宇宙智者的三層溫暖回信與解憂覺察卡。',
    actionText: '推開釋放之門 ➔',
  },
  {
    id: 'inquire',
    stepNumber: '02',
    symbol: '🔮',
    title: '提問之門',
    subtitle: '靈魂探問 ‧ 盲點破局',
    english: 'INQUIRE & CLARIFY',
    colorName: '神秘紫晶',
    themeColor: 'purple',
    borderClass: 'border-purple-400/40 hover:border-purple-400/70',
    bgGradient: 'from-[#1d1135]/90 via-[#130a24]/90 to-[#090513]/95',
    accentText: 'text-purple-300',
    glowBg: 'bg-purple-500/15',
    desc: '帶著你心中最核心的困惑與抉擇，向浩瀚宇宙提出真誠探問。撥開盲點迷霧，看見事件背後的深層學習與靈魂方向指引。',
    actionText: '推開提問之門 ➔',
  },
  {
    id: 'receive',
    stepNumber: '03',
    symbol: '🕊️',
    title: '接收之門',
    subtitle: '靈感聆聽 ‧ 箱型呼吸',
    english: 'RECEIVE & MEDITATE',
    colorName: '翡翠天青',
    themeColor: 'teal',
    borderClass: 'border-teal-400/40 hover:border-teal-400/70',
    bgGradient: 'from-[#0a2328]/90 via-[#07171b]/90 to-[#030d10]/95',
    accentText: 'text-teal-300',
    glowBg: 'bg-teal-500/15',
    desc: '放下掌控與內在緊繃，將心輪完全敞開如同一只純淨空杯。透過四方神聖箱型呼吸冥想，盛接宇宙的高頻靈感與恩典卡。',
    actionText: '進入箱型呼吸冥想 ➔',
  },
  {
    id: 'manifest',
    stepNumber: '04',
    symbol: '☀️',
    title: '顯化之門',
    subtitle: '願望播種 ‧ 意圖錨定',
    english: 'MANIFEST & ALIGN',
    colorName: '日光暖金',
    themeColor: 'amber',
    borderClass: 'border-amber-400/40 hover:border-amber-400/70',
    bgGradient: 'from-[#251910]/90 via-[#18110b]/90 to-[#0c0805]/95',
    accentText: 'text-amber-300',
    glowBg: 'bg-amber-500/15',
    desc: '在宇宙中心種下你的渴望，金種入球，透過高頻肯定句冥想對齊心輪，接收宇宙盟友的豐盛祝福、心態盲點提醒與豐盛卡。',
    actionText: '推開顯化之門 ➔',
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
  const [currentView, setCurrentView] = useState<'home' | 'release' | 'inquire' | 'manifest'>('home');
  const [manifestInitialSubView, setManifestInitialSubView] = useState<'menu' | 'seed' | 'audio' | 'wall'>('menu');
  const [activeGateIndex, setActiveGateIndex] = useState(0);

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
  }, [currentView, isArchiveOpen, isMeditationOpen, isMusicOpen]);

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

  const currentGate = GATES_DATA[activeGateIndex];

  const handleEnterActiveGate = () => {
    if (currentGate.id === 'release') {
      sound.playSingingBowl432();
      setCurrentView('release');
    } else if (currentGate.id === 'inquire') {
      sound.playSingingBowl432();
      setCurrentView('inquire');
    } else if (currentGate.id === 'receive') {
      sound.playSingingBowl432();
      setIsMeditationOpen(true);
    } else if (currentGate.id === 'manifest') {
      sound.playSingingBowl528();
      setManifestInitialSubView('menu');
      setCurrentView('manifest');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-400/20 bg-[#060815] text-amber-50">
      {/* ================= 頂部版本提示與切換 ================= */}
      <div className="w-full bg-gradient-to-r from-purple-950/80 via-slate-900/80 to-amber-950/80 border-b border-white/10 py-1.5 px-4 text-center text-xs text-amber-200/80 flex items-center justify-center gap-3">
        <span className="text-[11px]">✦ V6 靈魂四階輪盤切換概念版 ✦</span>
        <div className="flex items-center gap-2 text-[11px]">
          <Link href="/v5" className="text-amber-300 hover:underline">
            ← 切換回 V5 (經典四格)
          </Link>
        </div>
      </div>

      {/* ================= 頂部導覽列 (Header) ================= */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-20">
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
            ✦
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-light tracking-widest text-amber-100 flex items-center gap-1.5">
              <span>靈魂之境</span>
              <span className="text-[10px] text-purple-300 uppercase tracking-widest font-mono bg-purple-400/15 px-1.5 py-0.2 rounded border border-purple-300/30">
                V6 輪盤
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-2.5">
          <div
            onClick={() => setIsArchiveOpen(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/25 text-amber-200 text-xs tracking-wider cursor-pointer hover:bg-amber-400/20 transition-colors shadow-sm"
          >
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
            <span className="font-mono">{points} 點</span>
          </div>

          <button
            onClick={() => {
              sound.playSparkle();
              setIsMusicOpen(true);
            }}
            title="心靈音樂播放器"
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-purple-300/80 hover:text-white transition-colors"
          >
            <Music className="w-4 h-4" />
          </button>

          <button
            onClick={toggleSound}
            aria-label="切換音效"
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-amber-200/70 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsArchiveOpen(true)}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-100 tracking-wider transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">檔案庫</span>
          </button>

          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-100 transition-all"
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
                <span className="hidden sm:inline text-[11px]">登入</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ================= 主體內容區 ================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-3.5 sm:px-6 py-2 sm:py-4 z-10 w-full max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full flex flex-col items-center text-center space-y-3 sm:space-y-4"
            >
              {/* 中央微笑光球 */}
              <div className="my-1 sm:my-2">
                <SmilingCosmicOrb
                  size="md"
                  themeColor={currentGate.themeColor as 'amber' | 'indigo' | 'purple' | 'teal'}
                  guideText="宇宙正溫柔地微笑著看著你，放鬆下來..."
                />
              </div>

              {/* 快速直覺抽卡 */}
              <div>
                <button
                  onClick={handleQuickDraw}
                  className="flex items-center gap-2 py-1.5 px-4 sm:px-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs text-amber-200 tracking-wider transition-all shadow-sm active:scale-95"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-300" />
                  <span>✦ 快速抽取今日靈魂指引卡 ✦</span>
                </button>
              </div>

              {/* ================= V6 核心特色：四階段神聖進階導航切換列 ================= */}
              <div className="w-full max-w-md p-1.5 rounded-2xl bg-black/50 border border-white/15 grid grid-cols-4 gap-1 shadow-inner">
                {GATES_DATA.map((gate, idx) => (
                  <button
                    key={gate.id}
                    onClick={() => {
                      sound.playSparkle();
                      setActiveGateIndex(idx);
                    }}
                    className={`py-2 px-1 rounded-xl transition-all flex flex-col items-center gap-0.5 text-center ${
                      activeGateIndex === idx
                        ? `${gate.bgGradient} ${gate.borderClass} border shadow-lg ring-1 ring-white/20 scale-[1.02]`
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="text-sm">{gate.symbol}</span>
                    <span className="text-[11px] font-medium leading-none mt-0.5">
                      {gate.title.replace('之門', '')}
                    </span>
                    <span className="text-[9px] font-mono opacity-50">{gate.stepNumber}</span>
                  </button>
                ))}
              </div>

              {/* ================= V6 當前門戶大聖殿神聖卡片 ================= */}
              <div className="w-full max-w-xl relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentGate.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleEnterActiveGate}
                    className={`group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b ${currentGate.bgGradient} border ${currentGate.borderClass} shadow-2xl backdrop-blur-xl cursor-pointer text-left transition-all overflow-hidden`}
                  >
                    <div
                      className={`absolute top-0 right-0 -mr-10 -mt-10 w-44 h-44 rounded-full ${currentGate.glowBg} blur-3xl pointer-events-none`}
                    />

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-2xl bg-white/5 border border-white/10 shadow-inner">
                          {currentGate.symbol}
                        </span>
                        <div>
                          <span className="text-[10px] text-white/50 tracking-widest block uppercase font-mono">
                            STEP {currentGate.stepNumber} ‧ {currentGate.english}
                          </span>
                          <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide">
                            {currentGate.symbol} {currentGate.title}
                          </h2>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-amber-200 border border-white/15">
                        {currentGate.subtitle}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light min-h-[72px] mb-6">
                      {currentGate.desc}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className="text-xs text-white/50">點擊卡片直接進入體驗</span>
                      <span
                        className={`text-xs ${currentGate.accentText} font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform`}
                      >
                        {currentGate.actionText}
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* 左右切換箭頭 */}
                <button
                  onClick={() => {
                    sound.playSparkle();
                    setActiveGateIndex(
                      (prev) => (prev - 1 + GATES_DATA.length) % GATES_DATA.length
                    );
                  }}
                  className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/90 active:scale-95 shadow-md"
                  title="上一階段"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    sound.playSparkle();
                    setActiveGateIndex((prev) => (prev + 1) % GATES_DATA.length);
                  }}
                  className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-white flex items-center justify-center hover:bg-black/90 active:scale-95 shadow-md"
                  title="下一階段"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* 底部匿名願望星河流動光帶 */}
              <div
                onClick={() => {
                  sound.playSparkle();
                  setManifestInitialSubView('wall');
                  setCurrentView('manifest');
                }}
                className="w-full max-w-xl p-3 rounded-2xl bg-black/40 border border-teal-400/25 hover:border-teal-400/50 cursor-pointer transition-all shadow-md overflow-hidden relative group text-left"
              >
                <div className="flex items-center gap-2 text-xs text-teal-300 mb-1 px-1 font-mono">
                  <Globe className="w-3.5 h-3.5 animate-pulse" />
                  <span>✦ 宇宙匿名願望之河 ‧ 點擊展開彼此加持「允許發生」✦</span>
                </div>
                <div className="w-full overflow-hidden whitespace-nowrap text-left">
                  <div className="inline-block animate-marquee text-[11px] text-teal-100/80 font-light space-x-6">
                    {TICKER_WISHES.map((wish, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5">
                        <Heart className="w-3 h-3 text-pink-400 inline" />
                        <span>{wish}</span>
                        <span className="text-teal-400/40">✦</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {currentView === 'release' && (
            <ReleaseSanctuary
              onBack={() => setCurrentView('home')}
              onOpenArchive={() => setIsArchiveOpen(true)}
            />
          )}

          {currentView === 'inquire' && (
            <InquireSanctuary
              onBack={() => setCurrentView('home')}
              onOpenArchive={() => setIsArchiveOpen(true)}
            />
          )}

          {currentView === 'manifest' && (
            <ManifestSanctuaryV5
              onBack={() => setCurrentView('home')}
              onOpenArchive={() => setIsArchiveOpen(true)}
              initialSubView={manifestInitialSubView}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="w-full max-w-5xl mx-auto px-4 py-4 text-center text-amber-200/40 text-[11px] tracking-wider z-20">
        <p>宇宙永遠在傾聽，你所渴望的美好正以超越想像的方式走向你 ✨</p>
      </footer>

      {/* 接收之門：V4 冥想彈窗 */}
      <DailyMeditationModalV4
        isOpen={isMeditationOpen}
        onClose={() => setIsMeditationOpen(false)}
        onPointsUpdated={(newPts) => setPoints(newPts)}
      />

      {/* 快速抽卡彈窗 */}
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

      <SoulArchiveModal
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
      />

      <SoulMusicPlayerModal
        isOpen={isMusicOpen}
        onClose={() => setIsMusicOpen(false)}
        currentPoints={points}
        onPointsUpdated={(p) => setPoints(p)}
        onOpenMeditation={() => setIsMeditationOpen(true)}
      />

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
