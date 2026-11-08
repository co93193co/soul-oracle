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
  BookOpen,
  Compass,
  Star,
  X,
  User,
  Flame,
  Layers,
  Music,
  Globe,
  Award,
  ArrowRight,
} from 'lucide-react';
import BoxBreathingSmilingOrb from '@/components/shared/BoxBreathingSmilingOrb';
import OracleCard from '@/components/shared/OracleCard';
import ReleaseSanctuary from '@/components/release/ReleaseSanctuary';
import ManifestSanctuary from '@/components/manifest/ManifestSanctuary';
import SoulArchiveModal from '@/components/sanctuary/SoulArchiveModal';
import DailyMeditationModal from '@/components/meditation/DailyMeditationModal';
import SpecialDecksModal from '@/components/decks/SpecialDecksModal';
import SoulMusicPlayerModal from '@/components/music/SoulMusicPlayerModal';
import CosmicWishWallModal from '@/components/wishwall/CosmicWishWallModal';
import AuthModal from '@/components/auth/AuthModal';
import { sound } from '@/lib/sound';
import { localStore, SoulUser, MeditationStats } from '@/lib/storage';
import { getRandomCard, OracleCardData } from '@/lib/presets/cardsData';
import { COSMIC_ONE_LINERS } from '@/lib/presets/cosmicOneLiners';

export default function V3Page() {
  const [currentView, setCurrentView] = useState<'home' | 'release' | 'manifest'>('home');
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isMeditationOpen, setIsMeditationOpen] = useState(false);
  const [isSpecialDecksOpen, setIsSpecialDecksOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isWishWallOpen, setIsWishWallOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [is7DaysQuoteOpen, setIs7DaysQuoteOpen] = useState(false);

  const [isMuted, setIsMuted] = useState(false);
  const [points, setPoints] = useState(0);
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
    setPoints(localStore.getPoints());
    setMeditationStats(localStore.getMeditationStats());
  }, [currentView, isArchiveOpen, isMeditationOpen, isSpecialDecksOpen, isMusicOpen, isWishWallOpen]);

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
    const card = getRandomCard(Math.random() > 0.5 ? 'release' : 'manifest');
    setQuickCard(card);
  };

  const has7DaysBadge =
    meditationStats.streakDays >= 7 || meditationStats.badges.some((b) => b.badgeType === '7_days_quote');
  const has21DaysBadge =
    meditationStats.streakDays >= 21 || meditationStats.canPostWishWall;

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-400/20">
      {/* ================= 版本切換通知橫幅 ================= */}
      <div className="w-full bg-gradient-to-r from-amber-950/80 via-rose-950/80 to-purple-950/80 border-b border-amber-400/30 py-1.5 px-4 text-center text-xs text-amber-200 flex items-center justify-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 font-bold text-[10px]">
          V3 呼吸進化版
        </span>
        <span>建立在 V2 完整架構上：升級【16秒箱型呼吸笑臉(黃/紅/粉/平靜) + 1/3/5分點數 + 7天金句/21天願望牆】</span>
        <div className="flex gap-2 ml-2">
          <Link href="/" className="text-white hover:text-amber-300 underline font-medium">
            回V1原版 (/)
          </Link>
          <span>|</span>
          <Link href="/v2" className="text-pink-300 hover:text-white underline font-medium">
            回V2版 (/v2)
          </Link>
        </div>
      </div>

      {/* ================= 頂部導覽列 (Header) ================= */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-20">
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-slate-950 font-bold text-xs shadow-[0_0_15px_rgba(251,191,36,0.5)]">
            😌
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-light tracking-widest text-amber-100 flex items-center gap-1.5">
              <span>靈魂之境</span>
              <span className="text-[10px] text-amber-300 uppercase tracking-widest font-mono font-semibold">
                V3 呼吸殿堂
              </span>
            </h1>
          </div>
        </div>

        {/* 頂部操作按鈕群 */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* 🎵 心靈音樂播放器 */}
          <button
            onClick={() => {
              sound.playSparkle();
              setIsMusicOpen(true);
            }}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-purple-500/15 hover:bg-purple-500/25 border border-purple-400/30 text-purple-200 text-xs tracking-wider transition-all shadow-sm"
          >
            <Music className="w-3.5 h-3.5 text-pink-400" />
            <span className="hidden sm:inline">心靈音樂</span>
          </button>

          {/* 🌟 21天宇宙願望牆 */}
          <button
            onClick={() => {
              sound.playSparkle();
              setIsWishWallOpen(true);
            }}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-amber-500/15 hover:bg-amber-500/25 border border-amber-400/30 text-amber-200 text-xs tracking-wider transition-all shadow-sm"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">願望牆</span>
            <span className="text-[10px] text-amber-300 px-1 py-0.2 rounded bg-black/30">
              {meditationStats.streakDays}/21天
            </span>
          </button>

          {/* 🧘 每日冥想打卡按鈕 */}
          <button
            onClick={() => {
              sound.playSingingBowl432();
              setIsMeditationOpen(true);
            }}
            className="flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-400/30 text-indigo-200 text-xs tracking-wider transition-all shadow-sm"
          >
            <Flame className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span className="hidden sm:inline">每日冥想</span>
            <span className="text-[11px] text-amber-300 font-mono">+{meditationStats.streakDays}天</span>
          </button>

          {/* 心靈點數指示器 */}
          <div
            onClick={() => setIsSpecialDecksOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-amber-400/10 border border-amber-300/25 text-amber-200 text-xs tracking-wider cursor-pointer hover:bg-amber-400/20 transition-colors shadow-sm"
          >
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            <span>{points} 點</span>
          </div>

          {/* 音效開關 */}
          <button
            onClick={toggleSound}
            aria-label="切換音效"
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-amber-200/70 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Google 會員頭像 / 登入按鈕 */}
          <button
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-2 py-1 px-2.5 sm:px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-100 transition-all"
          >
            {currentUser.isLoggedIn ? (
              <>
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                  alt={currentUser.nickname}
                  className="w-5 h-5 rounded-full border border-amber-300/60"
                />
                <span className="max-w-[70px] truncate hidden sm:inline">
                  {currentUser.nickname}
                </span>
              </>
            ) : (
              <>
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span>Google 登入</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ================= 主體內容區 ================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-6 z-10 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* 視圖一：首頁雙門戶入口 (內嵌升級後的 16秒箱型呼吸笑臉) */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full flex flex-col items-center text-center"
            >
              {/* 核心升級模組 1：箱型呼吸動態笑臉 (16秒：吸氣4s黃光 ➔ 憋氣4s漲紅 ➔ 吐氣4s粉紅光 ➔ 憋氣4s平靜) */}
              <div className="my-2 sm:my-3">
                <BoxBreathingSmilingOrb isPlaying={true} size="md" />
              </div>

              {/* 核心升級模組 2 & 3：每日冥想打卡橫幅 (1分=1點、3分=3點、5分=5點) 與 7/21天里程碑 */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  sound.playSingingBowl432();
                  setIsMeditationOpen(true);
                }}
                className="w-full max-w-xl my-3 py-2.5 px-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-purple-950/50 to-amber-950/40 border border-amber-300/30 hover:border-amber-300/60 flex items-center justify-between cursor-pointer transition-all shadow-lg"
              >
                <div className="flex items-center gap-2.5 text-left">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-amber-300">
                    <Flame className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-amber-100 flex items-center gap-1.5">
                      <span>每日冥想共修 ‧ 累積心靈點數</span>
                      <span className="text-[10px] text-amber-300 px-1.5 py-0.2 rounded bg-amber-400/20">
                        1分=1點 / 3分=3點 / 5分=5點
                      </span>
                    </h3>
                    <p className="text-[11px] text-amber-200/60 flex items-center gap-2">
                      <span>連續打卡 {meditationStats.streakDays} 天</span>
                      <span>•</span>
                      {has7DaysBadge ? (
                        <span className="text-emerald-400">✓ 7天金句卡已解鎖</span>
                      ) : (
                        <span>7天解鎖金句卡 ({meditationStats.streakDays}/7)</span>
                      )}
                      <span>•</span>
                      {has21DaysBadge ? (
                        <span className="text-amber-300">✓ 21天願望牆已解鎖</span>
                      ) : (
                        <span>21天願望牆 ({meditationStats.streakDays}/21)</span>
                      )}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-amber-300 font-medium ml-2">進入共修 ➔</span>
              </motion.div>

              {/* 雙門戶選擇區 (V2 原汁原味保留：釋放之門 & 顯化之門) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full max-w-3xl mt-3 sm:mt-5">
                {/* 🌙 釋放之門 (陰 / 傾訴與放手) */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    sound.playSingingBowl432();
                    setCurrentView('release');
                  }}
                  className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#111636]/80 via-[#0d1028]/80 to-[#070919]/90 border border-indigo-400/30 hover:border-indigo-400/70 shadow-2xl backdrop-blur-xl cursor-pointer flex flex-col justify-between text-left transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 mb-4 group-hover:scale-110 transition-transform">
                      <Moon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] text-indigo-300/70 tracking-widest block uppercase mb-1">
                      Release & Inquire
                    </span>
                    <h2 className="text-xl sm:text-2xl font-light text-white mb-2 tracking-wide">
                      🌙 釋放之門 ‧ 心靈傾訴
                    </h2>
                    <p className="text-xs sm:text-sm text-indigo-200/70 leading-relaxed font-light">
                      倒出沉重心事，在文字散去的星塵中放手，透過 4-4 呼吸調頻，接收宇宙智者的三層溫暖回信與覺察卡。
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-xs text-indigo-300 font-medium group-hover:translate-x-1 transition-transform">
                    <span>推開釋放之門 ➔</span>
                  </div>
                </motion.div>

                {/* ☀️ 顯化之門 (陽 / 願望與肯定) */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    sound.playSingingBowl528();
                    setCurrentView('manifest');
                  }}
                  className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#251910]/80 via-[#18110b]/80 to-[#0c0805]/90 border border-amber-400/30 hover:border-amber-400/70 shadow-2xl backdrop-blur-xl cursor-pointer flex flex-col justify-between text-left transition-all overflow-hidden"
                >
                  <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-110 transition-transform">
                      <Sun className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] text-amber-300/70 tracking-widest block uppercase mb-1">
                      Manifest & Align
                    </span>
                    <h2 className="text-xl sm:text-2xl font-light text-white mb-2 tracking-wide">
                      ☀️ 顯化之門 ‧ 願望播種
                    </h2>
                    <p className="text-xs sm:text-sm text-amber-200/70 leading-relaxed font-light">
                      種下你的渴望，金種入球，透過高頻肯定句冥想對齊心輪，接收宇宙盟友的豐盛祝福、盲點提醒與豐盛卡。
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-xs text-amber-300 font-medium group-hover:translate-x-1 transition-transform">
                    <span>推開顯化之門 ➔</span>
                  </div>
                </motion.div>
              </div>

              {/* 底部三大功能：專屬牌卡館 & 心靈音樂 & 快速抽卡 */}
              <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
                {/* 🦄 靈魂專屬牌卡館 (獨角獸卡 & 宇宙一句話) */}
                <button
                  onClick={() => {
                    sound.playSparkle();
                    setIsSpecialDecksOpen(true);
                  }}
                  className="flex items-center gap-2 py-2.5 px-5 rounded-full bg-gradient-to-r from-purple-950/60 to-indigo-950/60 hover:from-purple-900/70 hover:to-indigo-900/70 border border-pink-400/40 text-xs text-pink-200 tracking-wider transition-all shadow-md group"
                >
                  <Layers className="w-3.5 h-3.5 text-pink-300 group-hover:scale-110 transition-transform" />
                  <span>🦄 專屬牌卡館 (獨角獸卡 / 宇宙一句話)</span>
                  <span className="text-[10px] text-amber-300 px-1.5 py-0.5 rounded-full bg-black/40">
                    扣 5 點
                  </span>
                </button>

                {/* 🎵 心靈音樂播放器 (模組 4) */}
                <button
                  onClick={() => {
                    sound.playSparkle();
                    setIsMusicOpen(true);
                  }}
                  className="flex items-center gap-2 py-2.5 px-5 rounded-full bg-white/5 hover:bg-white/10 border border-purple-300/30 text-xs text-purple-200 tracking-wider transition-all shadow-md"
                >
                  <Music className="w-3.5 h-3.5 text-purple-300" />
                  <span>🎵 心靈音樂殿堂 (點數解鎖)</span>
                </button>

                {/* 快速直覺抽卡 */}
                <button
                  onClick={handleQuickDraw}
                  className="flex items-center gap-2 py-2.5 px-5 rounded-full bg-white/5 hover:bg-white/10 border border-amber-300/30 text-xs text-amber-200 tracking-widest transition-all shadow-md group"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform" />
                  <span>✦ 抽取今日靈魂指引卡 ✦</span>
                </button>

                {/* 7天金句卡 (達成7天時顯示) */}
                {has7DaysBadge && (
                  <button
                    onClick={() => setIs7DaysQuoteOpen(true)}
                    className="flex items-center gap-2 py-2.5 px-5 rounded-full bg-purple-500/20 hover:bg-purple-500/30 border border-pink-400/50 text-xs text-pink-200 tracking-wider transition-all shadow-md"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>查看 7天里程碑金句卡</span>
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* 視圖二：釋放之門流程頁 */}
          {currentView === 'release' && (
            <ReleaseSanctuary
              onBack={() => setCurrentView('home')}
              onOpenArchive={() => setIsArchiveOpen(true)}
            />
          )}

          {/* 視圖三：顯化之門流程頁 */}
          {currentView === 'manifest' && (
            <ManifestSanctuary
              onBack={() => setCurrentView('home')}
              onOpenArchive={() => setIsArchiveOpen(true)}
            />
          )}
        </AnimatePresence>
      </main>

      {/* ================= 底部資訊 (Footer) ================= */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-4 text-center text-amber-200/40 text-[11px] tracking-wider z-20">
        <p>16秒箱型呼吸：吸氣 4s (黃光) ➔ 憋氣 4s (漲紅) ➔ 吐氣 4s (粉紅光) ➔ 憋氣 4s (平靜) ✨</p>
      </footer>

      {/* ================= 7天金句卡揭曉彈窗 ================= */}
      <AnimatePresence>
        {is7DaysQuoteOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-sm w-full p-6 rounded-3xl bg-gradient-to-b from-[#1c1438] via-[#100c24] to-[#070512] border border-pink-400/50 shadow-2xl text-center"
            >
              <button
                onClick={() => setIs7DaysQuoteOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/60 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-amber-300 text-xs font-mono tracking-widest uppercase mb-2">
                ✦ 7 DAYS MILESTONE REWARD ✦
              </div>
              <h3 className="text-lg font-light text-white mb-4">
                宇宙告訴你的一句話
              </h3>

              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 my-4 text-center">
                <p className="text-base text-pink-200 leading-relaxed font-light">
                  「{COSMIC_ONE_LINERS[0].quote}」
                </p>
                <span className="text-xs text-amber-200/60 block mt-3">
                  {COSMIC_ONE_LINERS[0].subtext}
                </span>
              </div>

              <p className="text-xs text-amber-200/70 mb-4">
                恭喜達成連續 7 天冥想！這句金句代表你此刻靈魂與宇宙的共鳴。
              </p>

              <button
                onClick={() => setIs7DaysQuoteOpen(false)}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-bold text-xs"
              >
                收下這份宇宙金句
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      {/* ================= 每日冥想共修室 Modal (1分=1點、3分=3點、5分=5點) ================= */}
      <DailyMeditationModal
        isOpen={isMeditationOpen}
        onClose={() => setIsMeditationOpen(false)}
        onPointsUpdated={(newPoints) => setPoints(newPoints)}
        onOpenWishWall={() => setIsWishWallOpen(true)}
      />

      {/* ================= 靈魂專屬牌卡館 Modal (獨角獸卡 & 宇宙一句話) ================= */}
      <SpecialDecksModal
        isOpen={isSpecialDecksOpen}
        onClose={() => setIsSpecialDecksOpen(false)}
        currentPoints={points}
        onPointsUpdated={(newPoints) => setPoints(newPoints)}
        onOpenMeditation={() => setIsMeditationOpen(true)}
      />

      {/* ================= 心靈音樂殿堂 Modal (點數解鎖) ================= */}
      <SoulMusicPlayerModal
        isOpen={isMusicOpen}
        onClose={() => setIsMusicOpen(false)}
        currentPoints={points}
        onPointsUpdated={(newPoints) => setPoints(newPoints)}
        onOpenMeditation={() => setIsMeditationOpen(true)}
      />

      {/* ================= 21天宇宙願望牆 Modal ================= */}
      <CosmicWishWallModal
        isOpen={isWishWallOpen}
        onClose={() => setIsWishWallOpen(false)}
        onOpenMeditation={() => setIsMeditationOpen(true)}
      />

      {/* ================= Google 會員登入 / 資訊 Modal ================= */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onUserChange={(user) => setCurrentUser(user)}
        currentPoints={points}
      />

      {/* ================= 星空靈魂檔案庫 Modal ================= */}
      <SoulArchiveModal
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
      />
    </div>
  );
}
