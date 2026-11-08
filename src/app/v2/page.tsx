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
  ArrowRight,
} from 'lucide-react';
import SmilingCosmicOrb from '@/components/shared/SmilingCosmicOrb';
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

export default function V2Page() {
  const [currentView, setCurrentView] = useState<'home' | 'release' | 'manifest'>('home');
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isMeditationOpen, setIsMeditationOpen] = useState(false);
  const [isSpecialDecksOpen, setIsSpecialDecksOpen] = useState(false);
  const [isMusicOpen, setIsMusicOpen] = useState(false);
  const [isWishWallOpen, setIsWishWallOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-400/20">
      {/* ================= 版本切換通知橫幅 ================= */}
      <div className="w-full bg-gradient-to-r from-purple-950/80 via-indigo-950/80 to-purple-950/80 border-b border-pink-400/30 py-1.5 px-4 text-center text-xs text-pink-200 flex items-center justify-center gap-2">
        <span className="px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-medium text-[10px]">
          V2 能量版
        </span>
        <span>當前為【Google登入 + 冥想點數(1/3/5分) + 7/21天里程碑 + 願望牆 + 音樂播放器】</span>
        <Link
          href="/"
          className="ml-2 text-amber-300 hover:text-white underline flex items-center gap-0.5 font-medium"
        >
          <span>切換回原始乾淨版 (/)</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* ================= 頂部導覽列 (Header) ================= */}
      <header className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between z-20">
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-light tracking-widest text-amber-100 flex items-center gap-1.5">
              <span>靈魂之境</span>
              <span className="text-[10px] text-pink-300/80 uppercase tracking-widest font-mono">
                V2 能量殿堂
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
            <span className="text-[10px] text-amber-300 px-1 py-0.2 rounded bg-black/30">21天</span>
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
          {/* 視圖一：首頁雙門戶入口 */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full flex flex-col items-center text-center"
            >
              {/* 中央微笑光球 (呼吸與心跳動態) */}
              <div className="my-2 sm:my-3">
                <SmilingCosmicOrb
                  size="md"
                  themeColor="amber"
                  guideText="宇宙正溫柔地微笑著看著你，放鬆下來..."
                />
              </div>

              {/* 每日冥想賺點數橫幅推薦 (1分=1點、3分=3點、5分=5點) */}
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
                    <p className="text-[11px] text-amber-200/50">
                      連續 7 天解鎖金句卡 ‧ 連續 21 天解鎖宇宙願望牆許願 ✨
                    </p>
                  </div>
                </div>
                <span className="text-xs text-amber-300 font-medium ml-2">開始 ➔</span>
              </motion.div>

              {/* 雙門戶選擇區 (Dual Sanctuary) */}
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

              {/* 底部三大功能按鈕 */}
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

                {/* 🎵 心靈音樂播放器 */}
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
        <p>宇宙永遠在傾聽，你所渴望的美好正以超越想像的方式走向你 ✨</p>
      </footer>

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

      {/* ================= 每日冥想共修室 Modal ================= */}
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

      {/* ================= 心靈音樂殿堂 Modal ================= */}
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
