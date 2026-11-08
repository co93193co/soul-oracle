'use client';

import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import SmilingCosmicOrb from '@/components/shared/SmilingCosmicOrb';
import OracleCard from '@/components/shared/OracleCard';
import ReleaseSanctuary from '@/components/release/ReleaseSanctuary';
import ManifestSanctuary from '@/components/manifest/ManifestSanctuary';
import SoulArchiveModal from '@/components/sanctuary/SoulArchiveModal';
import { sound } from '@/lib/sound';
import { localStore } from '@/lib/storage';
import { getRandomCard, OracleCardData } from '@/lib/presets/cardsData';

export default function Home() {
  const [currentView, setCurrentView] = useState<'home' | 'release' | 'manifest'>('home');
  const [isArchiveOpen, setIsArchiveOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [starCredits, setStarCredits] = useState(365);

  // 快速抽卡狀態
  const [quickCard, setQuickCard] = useState<OracleCardData | null>(null);

  useEffect(() => {
    setStarCredits(localStore.getStarCredits());
  }, [currentView, isArchiveOpen]);

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
      {/* ================= 頂部導覽列 (Header) ================= */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between z-20">
        <div
          onClick={() => setCurrentView('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Sparkles className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-light tracking-widest text-amber-100 flex items-center gap-1.5">
              <span>靈魂之境</span>
              <span className="text-[10px] text-amber-300/50 uppercase tracking-widest hidden sm:inline">
                SOUL ORACLE
              </span>
            </h1>
          </div>
        </div>

        {/* 頂部功能區 */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* 星光能量指示器 (體現「花不完」的豐盛感) */}
          <div
            onClick={() => setIsArchiveOpen(true)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/25 text-amber-200 text-xs tracking-wider cursor-pointer hover:bg-amber-400/20 transition-colors shadow-sm"
          >
            <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
            <span>{starCredits} 顆星光</span>
          </div>

          {/* 音效開關 */}
          <button
            onClick={toggleSound}
            aria-label="切換音效"
            className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-amber-200/70 hover:text-white transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* 靈魂信箱與願望牆 */}
          <button
            onClick={() => setIsArchiveOpen(true)}
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-amber-100 tracking-wider transition-all"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">星空檔案庫</span>
          </button>
        </div>
      </header>

      {/* ================= 主體內容區 ================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 sm:py-8 z-10 w-full max-w-5xl mx-auto">
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
              <div className="my-4 sm:my-6">
                <SmilingCosmicOrb
                  size="md"
                  themeColor="amber"
                  guideText="宇宙正溫柔地微笑著看著你，放鬆下來..."
                />
              </div>

              {/* 雙門戶選擇區 (Dual Sanctuary) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 w-full max-w-3xl mt-6 sm:mt-10">
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
                      倒出積壓的心事與煩惱，在文字散去的星塵中放手，透過 4-4 呼吸調頻，接收宇宙智者的三層溫暖回信與覺察卡。
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
                      在宇宙中心種下你的渴望，金種入球，透過高頻肯定句冥想對齊心輪，接收宇宙盟友的豐盛祝福、心態盲點提醒與豐盛卡。
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-1.5 text-xs text-amber-300 font-medium group-hover:translate-x-1 transition-transform">
                    <span>推開顯化之門 ➔</span>
                  </div>
                </motion.div>
              </div>

              {/* 快速直覺抽卡入口 */}
              <div className="mt-8 sm:mt-10">
                <button
                  onClick={handleQuickDraw}
                  className="flex items-center gap-2 py-2.5 px-5 rounded-full bg-white/5 hover:bg-white/10 border border-amber-300/30 text-xs text-amber-200 tracking-widest transition-all shadow-md group"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform" />
                  <span>✦ 快速抽取今日靈魂指引卡 ✦</span>
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
      <footer className="w-full max-w-5xl mx-auto px-4 py-6 text-center text-amber-200/40 text-[11px] tracking-wider z-20">
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

      {/* ================= 星空靈魂檔案庫 Modal ================= */}
      <SoulArchiveModal
        isOpen={isArchiveOpen}
        onClose={() => setIsArchiveOpen(false)}
      />
    </div>
  );
}
