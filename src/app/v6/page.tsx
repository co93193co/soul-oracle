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
  ArrowLeft,
  Home as HomeIcon,
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

interface GateMeta {
  id: GateId;
  index: number;
  iconSymbol: string;
  title: string;
  subtitle: string;
  english: string;
  shortDesc: string;
  fullDesc: string;
  themeColor: 'indigo' | 'purple' | 'teal' | 'amber';
  bgGradient: string;
  borderClass: string;
  glowBg: string;
  accentText: string;
}

const GATES_META: GateMeta[] = [
  {
    id: 'release',
    index: 0,
    iconSymbol: '🌙',
    title: '🌙 釋放之門 ‧ 心靈傾訴',
    subtitle: '心靈傾訴 ‧ 排毒放手',
    english: 'RELEASE & SURRENDER',
    shortDesc: '倒出積壓心事，星塵中放手',
    fullDesc:
      '倒出積壓的心事與煩惱，在文字散去的星塵中放手，透過 4-4 呼吸調頻，接收宇宙智者的三層溫暖回信與解憂覺察卡。',
    themeColor: 'indigo',
    bgGradient: 'from-[#111636]/90 via-[#0d1028]/90 to-[#070919]/95',
    borderClass: 'border-indigo-400/40 hover:border-indigo-400/80',
    glowBg: 'bg-indigo-500/15',
    accentText: 'text-indigo-300',
  },
  {
    id: 'inquire',
    index: 1,
    iconSymbol: '🔮',
    title: '🔮 提問之門 ‧ 靈魂探問',
    subtitle: '靈魂探問 ‧ 盲點破局',
    english: 'INQUIRE & CLARIFY',
    shortDesc: '提出核心疑惑，照亮盲點',
    fullDesc:
      '帶著你心中最核心的困惑與抉擇，向浩瀚宇宙提出真誠探問。撥開盲點迷霧，看見事件背後的深層學習與靈魂方向指引。',
    themeColor: 'purple',
    bgGradient: 'from-[#1d1135]/90 via-[#130a24]/90 to-[#090513]/95',
    borderClass: 'border-purple-400/40 hover:border-purple-400/80',
    glowBg: 'bg-purple-500/15',
    accentText: 'text-purple-300',
  },
  {
    id: 'receive',
    index: 2,
    iconSymbol: '🕊️',
    title: '🕊️ 接收之門 ‧ 靈感聆聽',
    subtitle: '靈感聆聽 ‧ 箱型呼吸',
    english: 'RECEIVE & MEDITATE',
    shortDesc: '心輪敞開空杯，四方箱型呼吸',
    fullDesc:
      '放下掌控與內在緊繃，將心輪完全敞開如同一只純淨空杯。透過四方神聖箱型呼吸冥想，盛接宇宙的高頻靈感與恩典卡。',
    themeColor: 'teal',
    bgGradient: 'from-[#0a2328]/90 via-[#07171b]/90 to-[#030d10]/95',
    borderClass: 'border-teal-400/40 hover:border-teal-400/80',
    glowBg: 'bg-teal-500/15',
    accentText: 'text-teal-300',
  },
  {
    id: 'manifest',
    index: 3,
    iconSymbol: '☀️',
    title: '☀️ 顯化之門 ‧ 願望播種',
    subtitle: '願望播種 ‧ 意圖錨定',
    english: 'MANIFEST & ALIGN',
    shortDesc: '播下渴望金種，肯定句調頻',
    fullDesc:
      '在宇宙中心種下你的渴望，金種入球，透過高頻肯定句冥想對齊心輪，接收宇宙盟友的豐盛祝福、心態盲點提醒與豐盛卡。',
    themeColor: 'amber',
    bgGradient: 'from-[#251910]/90 via-[#18110b]/90 to-[#0c0805]/95',
    borderClass: 'border-amber-400/40 hover:border-amber-400/80',
    glowBg: 'bg-amber-500/15',
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
  // activeGate: null = 首頁 (只放光球與 4 個點入連結按鈕)
  // activeGate: 'release' | 'inquire' | 'receive' | 'manifest' = 進入該門戶獨立頁面
  const [activeGate, setActiveGate] = useState<GateId | null>(null);

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
  }, [activeGate, isArchiveOpen, isMeditationOpen, isMusicOpen]);

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

  // 當前門戶資訊
  const currentGateMeta = GATES_META.find((g) => g.id === activeGate) || GATES_META[0];

  // 前後門切換邏輯 (點入切換，不滑動)
  const handleGoPrevGate = () => {
    sound.playSparkle();
    const prevIndex = (currentGateMeta.index - 1 + GATES_META.length) % GATES_META.length;
    setActiveGate(GATES_META[prevIndex].id);
  };

  const handleGoNextGate = () => {
    sound.playSparkle();
    const nextIndex = (currentGateMeta.index + 1) % GATES_META.length;
    setActiveGate(GATES_META[nextIndex].id);
  };

  const prevGateMeta =
    GATES_META[(currentGateMeta.index - 1 + GATES_META.length) % GATES_META.length];
  const nextGateMeta = GATES_META[(currentGateMeta.index + 1) % GATES_META.length];

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-400/20 bg-[#060814] text-amber-50">
      {/* ================= 頂部版本提示與切換 ================= */}
      <div className="w-full bg-gradient-to-r from-purple-950/80 via-slate-900/80 to-amber-950/80 border-b border-white/10 py-1.5 px-4 text-center text-xs text-amber-200/80 flex items-center justify-between z-30">
        <span className="text-[11px] flex items-center gap-1">
          <span>✦ V6 點入式門戶獨立頁面版</span>
          <span className="text-white/40">|</span>
          <span className="text-purple-300">不用滑動 ‧ 點入進入</span>
        </span>
        <div className="flex items-center gap-2 text-[11px]">
          <Link href="/v5" className="text-amber-300 hover:underline">
            ← 切換至 V5 (經典四格)
          </Link>
        </div>
      </div>

      {/* ================= 頂部導覽列 (Header) ================= */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-20">
        <div
          onClick={() => setActiveGate(null)}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-amber-400 flex items-center justify-center text-slate-950 font-bold text-xs shadow-md group-hover:scale-105 transition-transform">
            ✦
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-light tracking-widest text-amber-100 flex items-center gap-1.5">
              <span>靈魂之境</span>
              <span className="text-[10px] text-purple-300 uppercase tracking-widest font-mono bg-purple-400/15 px-1.5 py-0.2 rounded border border-purple-300/30">
                V6
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
      <main className="flex-1 flex flex-col items-center justify-center px-3.5 sm:px-6 py-2 sm:py-5 z-10 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ================= 狀態 A：首頁 (4大框不在下面，而是點入連結按鈕) ================= */}
          {activeGate === null && (
            <motion.div
              key="v6-home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full flex flex-col items-center text-center space-y-4 sm:space-y-5"
            >
              {/* 中央微笑光球 (安詳呼吸) */}
              <div className="my-1 sm:my-2">
                <SmilingCosmicOrb
                  size="md"
                  themeColor="amber"
                  guideText="宇宙正溫柔地微笑著看著你，放鬆下來..."
                />
              </div>

              {/* 快速直覺抽卡按鈕 */}
              <div>
                <button
                  onClick={handleQuickDraw}
                  className="flex items-center gap-2 py-2 px-5 rounded-full bg-gradient-to-r from-white/10 to-amber-400/10 hover:from-white/20 hover:to-amber-400/20 border border-amber-300/35 text-xs text-amber-200 tracking-widest transition-all shadow-md group active:scale-95"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform" />
                  <span>✦ 快速抽取今日宇宙靈魂牌卡 ✦</span>
                </button>
              </div>

              {/* ================= 四大門戶點入連結區 (精巧按鈕，點入進入另一個頁面，手機不用滑動) ================= */}
              <div className="w-full max-w-2xl text-left">
                <div className="text-[11px] text-amber-300/70 font-mono mb-2 px-1 text-center sm:text-left">
                  ✦ 四方神聖門戶（點入進入獨立殿堂）：
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  {GATES_META.map((gate) => (
                    <motion.button
                      key={gate.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        sound.playSingingBowl432();
                        setActiveGate(gate.id);
                      }}
                      className={`p-4 rounded-2xl bg-gradient-to-r ${gate.bgGradient} border ${gate.borderClass} text-left transition-all shadow-lg flex items-center justify-between group active:scale-98`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform">
                          {gate.iconSymbol}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] text-white/50 tracking-widest block uppercase font-mono">
                            {gate.english}
                          </span>
                          <h3 className="text-sm sm:text-base font-light text-white tracking-wide truncate">
                            {gate.title}
                          </h3>
                          <p className="text-[11px] text-white/60 truncate mt-0.5">
                            {gate.shortDesc}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs text-amber-300 font-medium shrink-0 group-hover:translate-x-1 transition-transform ml-2 pl-1 border-l border-white/10">
                        <span className="text-[11px]">點入</span>
                        <span>➔</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* 底部慢速流動的匿名願望星河光帶 */}
              <div
                onClick={() => setActiveGate('manifest')}
                className="w-full max-w-2xl p-3 rounded-2xl bg-black/40 border border-teal-400/25 hover:border-teal-400/50 cursor-pointer transition-all shadow-md overflow-hidden relative group text-left"
                title="點擊展開宇宙集體願望星河"
              >
                <div className="flex items-center gap-2 text-xs text-teal-300 mb-1 px-1 font-mono">
                  <Globe className="w-3.5 h-3.5 animate-pulse" />
                  <span>✦ 宇宙匿名願望之河 ‧ 點入展開彼此加持「允許發生」✦</span>
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

          {/* ================= 狀態 B：進入特定門戶的專屬頁面 (含 (X) 回首頁 與 前後4大框點入鏈接) ================= */}
          {activeGate !== null && (
            <motion.div
              key={`gate-${activeGate}`}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full flex flex-col items-center"
            >
              {/* ================= 專屬頂部導覽列：(X) 回首頁 ＋ 前後4大框點入鏈接 (全響應式) ================= */}
              <div className="w-full max-w-3xl mb-4 sm:mb-6 p-2.5 sm:p-3 rounded-2xl bg-black/50 border border-white/15 backdrop-blur-xl flex flex-col gap-2.5 shadow-xl">
                {/* 第一列：左側前一門、中央(X)回首頁、右側後一門 */}
                <div className="w-full flex items-center justify-between gap-2">
                  {/* ← 到前一門鏈接 */}
                  <button
                    onClick={handleGoPrevGate}
                    className="flex items-center gap-1 sm:gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-200 transition-all shrink-0 active:scale-95"
                    title={`前往：${prevGateMeta.title}`}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">前一門：</span>
                    <span>{prevGateMeta.iconSymbol} {prevGateMeta.title.split(' ')[0].replace(/[^\u4e00-\u9fa5]/g, '')}</span>
                  </button>

                  {/* ★ (X) 回首頁 鏈接 (核心要求) */}
                  <button
                    onClick={() => {
                      sound.playSparkle();
                      setActiveGate(null);
                    }}
                    className="flex items-center gap-1.5 py-1.5 px-3 sm:px-4 rounded-full bg-gradient-to-r from-amber-400/20 to-yellow-400/20 hover:from-amber-400/30 hover:to-yellow-400/30 border border-amber-300/40 text-xs text-amber-200 hover:text-white font-medium transition-all shadow-sm active:scale-95"
                    title="關閉並返回首頁"
                  >
                    <X className="w-3.5 h-3.5 text-amber-300" />
                    <span>回首頁</span>
                  </button>

                  {/* 到後一門鏈接 → */}
                  <button
                    onClick={handleGoNextGate}
                    className="flex items-center gap-1 sm:gap-1.5 py-1.5 px-2.5 sm:px-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-200 transition-all shrink-0 active:scale-95"
                    title={`前往：${nextGateMeta.title}`}
                  >
                    <span className="hidden sm:inline">下一門：</span>
                    <span>{nextGateMeta.iconSymbol} {nextGateMeta.title.split(' ')[0].replace(/[^\u4e00-\u9fa5]/g, '')}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 第二列：四大門戶直接點入切換標籤 (不用滑動，直接點入切換！) */}
                <div className="w-full grid grid-cols-4 gap-1.5 pt-1.5 border-t border-white/10">
                  {GATES_META.map((g) => {
                    const isCurrent = g.id === activeGate;
                    return (
                      <button
                        key={g.id}
                        onClick={() => {
                          sound.playSparkle();
                          setActiveGate(g.id);
                        }}
                        className={`py-1.5 px-1 rounded-xl text-center transition-all flex items-center justify-center gap-1 ${
                          isCurrent
                            ? `${g.bgGradient} ${g.borderClass} border shadow-md ring-1 ring-white/20 text-white font-medium`
                            : 'bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-xs'
                        }`}
                      >
                        <span className="text-xs">{g.iconSymbol}</span>
                        <span className="text-[11px] truncate">{g.title.split(' ')[0].replace(/[^\u4e00-\u9fa5]/g, '')}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ================= 門戶專屬說明與主體內容 (全響應式 RWD) ================= */}
              <div className="w-full max-w-3xl">
                {/* 1. 🌙 釋放之門 專屬頁面 */}
                {activeGate === 'release' && (
                  <ReleaseSanctuary
                    onBack={() => setActiveGate(null)}
                    onOpenArchive={() => setIsArchiveOpen(true)}
                  />
                )}

                {/* 2. 🔮 提問之門 專屬頁面 */}
                {activeGate === 'inquire' && (
                  <InquireSanctuary
                    onBack={() => setActiveGate(null)}
                    onOpenArchive={() => setIsArchiveOpen(true)}
                  />
                )}

                {/* 3. 🕊️ 接收之門 專屬頁面 (含四方箱型呼吸冥想入口) */}
                {activeGate === 'receive' && (
                  <div className="w-full max-w-2xl mx-auto flex flex-col items-center px-3.5 sm:px-4 py-4 sm:py-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 mb-3 shadow-[0_0_20px_rgba(20,184,166,0.3)]">
                      <Flame className="w-6 h-6 text-teal-300" />
                    </div>

                    <span className="text-[10px] text-teal-300/80 uppercase tracking-widest font-mono mb-1">
                      ✦ SACRED BOX BREATHING SANCTUARY ✦
                    </span>
                    <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide mb-3">
                      🕊️ 接收之門 ‧ 靈魂調頻靜心
                    </h2>

                    <div className="w-full p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0a2328]/90 via-[#07171b]/90 to-[#030d10]/95 border border-teal-400/40 text-left shadow-2xl relative overflow-hidden mb-6">
                      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
                      <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed font-light mb-4">
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

                    {/* 點入開啟 V4 全螢幕箱型呼吸冥想殿堂按鈕 */}
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

                {/* 4. ☀️ 顯化之門 專屬頁面 (含願望播種、肯定句音檔加強艙、宇宙祈願星河) */}
                {activeGate === 'manifest' && (
                  <ManifestSanctuaryV5
                    onBack={() => setActiveGate(null)}
                    onOpenArchive={() => setIsArchiveOpen(true)}
                  />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ================= 底部資訊 (Footer) ================= */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-4 text-center text-amber-200/40 text-[11px] tracking-wider z-20">
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
