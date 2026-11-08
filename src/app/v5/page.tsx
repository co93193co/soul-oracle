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

// 首頁底部慢速流動的匿名願望星河數據
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

  // 開啟願望牆
  const handleOpenWishWall = () => {
    sound.playSparkle();
    setManifestInitialSubView('wall');
    setCurrentView('manifest');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-400/20 bg-[#070919] text-amber-50">
      {/* ================= 頂部區域：左上角 (憶起 Logo + 微笑圓臉光球 + 引導小字) ＆ 右上角 (垂直排列之四連結) ================= */}
      <header className="w-full max-w-5xl mx-auto px-3.5 sm:px-6 pt-3 sm:pt-4 pb-1 sm:pb-2 flex items-stretch justify-between gap-3 sm:gap-4 z-20 h-[170px] sm:h-[184px]">
        {/* 左上角：憶起 Logo + 微笑光球 + 引導小字 (高度與右側完全對齊) */}
        <div
          onClick={() => {
            if (currentView !== 'home') setCurrentView('home');
          }}
          className={`flex-1 h-full min-w-0 max-w-[calc(100%-68px)] sm:max-w-md ${
            currentView !== 'home' ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
          }`}
          title={currentView !== 'home' ? '點擊返回首頁' : '憶起'}
        >
          <SmilingCosmicOrb
            size="sm"
            themeColor="amber"
            logoText="憶起"
            logoPosition="left"
            align="left"
            onLogoClick={() => {
              if (currentView !== 'home') setCurrentView('home');
            }}
            onOrbClick={() => {
              sound.playHeartbeat();
              if (currentView !== 'home') setCurrentView('home');
            }}
            guideText={
              currentView === 'home'
                ? '宇宙正溫柔地微笑著看著你，放鬆下來...'
                : '✦ 點擊返回首頁靈魂殿堂 ✦'
            }
          />
        </div>

        {/* 右上角：四個按鈕由上而下垂直排列 (1.登入 2.聲音 3.記錄 4.星光點數)，高度大小兩邊依樣 */}
        <div className="flex flex-col justify-between items-center shrink-0 h-full w-[54px] sm:w-[60px] py-0.5">
          {/* 1. 👤 登入 */}
          <button
            onClick={() => {
              sound.playSparkle();
              setIsAuthOpen(true);
            }}
            title={currentUser.isLoggedIn ? currentUser.nickname : '會員登入'}
            className="w-full h-[36px] sm:h-[39px] rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 flex flex-col items-center justify-center gap-0.5 text-amber-200/80 hover:text-white transition-all shadow-sm active:scale-95 group cursor-pointer"
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
            className="w-full h-[36px] sm:h-[39px] rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 flex flex-col items-center justify-center gap-0.5 text-amber-200/80 hover:text-white transition-all shadow-sm active:scale-95 group cursor-pointer"
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
            className="w-full h-[36px] sm:h-[39px] rounded-xl sm:rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 flex flex-col items-center justify-center gap-0.5 text-amber-200/80 hover:text-white transition-all shadow-sm active:scale-95 group cursor-pointer"
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
            className="w-full h-[36px] sm:h-[39px] rounded-xl sm:rounded-2xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-300/30 flex flex-col items-center justify-center gap-0.5 text-amber-200 transition-all shadow-sm active:scale-95 group cursor-pointer"
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

      {/* ================= 主體內容區 ================= */}
      <main className="flex-1 flex flex-col items-center justify-center px-3.5 sm:px-6 py-2 sm:py-4 z-10 w-full max-w-5xl mx-auto">
        <AnimatePresence mode="wait">
          {/* ================= 視圖：首頁四方神聖門戶 ================= */}
          {currentView === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full flex flex-col items-center text-center"
            >
              {/* 快速直覺抽卡按鈕 (隨時一鍵接收宇宙訊息) */}
              <div className="my-2 sm:my-3">
                <button
                  onClick={handleQuickDraw}
                  className="flex items-center gap-2 py-2 px-5 rounded-full bg-gradient-to-r from-white/10 to-amber-400/10 hover:from-white/20 hover:to-amber-400/20 border border-amber-300/35 text-xs text-amber-200 tracking-widest transition-all shadow-md group active:scale-95"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-45 transition-transform" />
                  <span>✦ 快速抽取今日宇宙靈魂牌卡 ✦</span>
                </button>
              </div>

              {/* ================= 四方神聖門戶 (四大方框 統一規格 大小一致) ================= */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mt-3 sm:mt-5 text-left">
                {/* 左欄：1. 釋放之門 + 2. 提問之門 (在釋放之門下面) */}
                <div className="flex flex-col gap-4 sm:gap-6">
                  {/* 1. 🌙 釋放之門 (Gate of Release) */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      sound.playSingingBowl432();
                      setCurrentView('release');
                    }}
                    className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#111636]/85 via-[#0d1028]/85 to-[#070919]/95 border border-indigo-400/30 hover:border-indigo-400/70 shadow-2xl backdrop-blur-xl cursor-pointer flex flex-col justify-between transition-all overflow-hidden min-h-[260px] sm:min-h-[280px]"
                  >
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl group-hover:bg-indigo-500/20 transition-all pointer-events-none" />

                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 mb-4 group-hover:scale-110 transition-transform">
                        <Moon className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] text-indigo-300/70 tracking-widest block uppercase mb-1 font-mono">
                        RELEASE & SURRENDER
                      </span>
                      <h2 className="text-xl sm:text-2xl font-light text-white mb-2 tracking-wide">
                        🌙 釋放之門 ‧ 心靈傾訴
                      </h2>
                      <p className="text-xs sm:text-sm text-indigo-200/70 leading-relaxed font-light min-h-[66px] sm:min-h-[72px]">
                        倒出積壓的心事與煩惱，在文字散去的星塵中放手，透過 4-4 呼吸調頻，接收宇宙智者的三層溫暖回信與解憂覺察卡。
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 text-xs text-indigo-300 font-medium group-hover:translate-x-1 transition-transform">
                      <span>推開釋放之門 ➔</span>
                    </div>
                  </motion.div>

                  {/* 2. 🔮 提問之門 (Gate of Inquiry) - 在釋放之門下面 */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      sound.playSingingBowl432();
                      setCurrentView('inquire');
                    }}
                    className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#1d1135]/85 via-[#130a24]/85 to-[#090513]/95 border border-purple-400/30 hover:border-purple-400/70 shadow-2xl backdrop-blur-xl cursor-pointer flex flex-col justify-between transition-all overflow-hidden min-h-[260px] sm:min-h-[280px]"
                  >
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none" />

                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300 mb-4 group-hover:scale-110 transition-transform">
                        <Compass className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] text-purple-300/70 tracking-widest block uppercase mb-1 font-mono">
                        INQUIRE & CLARIFY
                      </span>
                      <h2 className="text-xl sm:text-2xl font-light text-white mb-2 tracking-wide">
                        🔮 提問之門 ‧ 靈魂探問
                      </h2>
                      <p className="text-xs sm:text-sm text-purple-200/70 leading-relaxed font-light min-h-[66px] sm:min-h-[72px]">
                        帶著你心中最核心的困惑與抉擇，向浩瀚宇宙提出真誠探問。撥開盲點迷霧，看見事件背後的深層學習與靈魂方向指引。
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 text-xs text-purple-300 font-medium group-hover:translate-x-1 transition-transform">
                      <span>推開提問之門 ➔</span>
                    </div>
                  </motion.div>
                </div>

                {/* 右欄：3. 接收之門 (在顯化之門上面) + 4. 顯化之門 */}
                <div className="flex flex-col gap-4 sm:gap-6">
                  {/* 3. 🕊️ 接收之門 (Gate of Receiving) - 進入 V4 冥想殿堂 */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      sound.playSingingBowl432();
                      setIsMeditationOpen(true);
                    }}
                    className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#0a2328]/85 via-[#07171b]/85 to-[#030d10]/95 border border-teal-400/30 hover:border-teal-400/70 shadow-2xl backdrop-blur-xl cursor-pointer flex flex-col justify-between transition-all overflow-hidden min-h-[260px] sm:min-h-[280px]"
                  >
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-teal-500/10 blur-2xl group-hover:bg-teal-500/20 transition-all pointer-events-none" />

                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300 mb-4 group-hover:scale-110 transition-transform">
                        <Flame className="w-5 h-5 text-teal-300" />
                      </div>
                      <span className="text-[11px] text-teal-300/70 tracking-widest block uppercase mb-1 font-mono">
                        RECEIVE & MEDITATE
                      </span>
                      <h2 className="text-xl sm:text-2xl font-light text-white mb-2 tracking-wide flex items-center gap-2">
                        <span>🕊️ 接收之門 ‧ 靈感聆聽</span>
                        <span className="text-[10px] text-teal-300 font-mono px-1.5 py-0.2 rounded bg-teal-400/20 border border-teal-300/30">
                          +{meditationStats.streakDays}天
                        </span>
                      </h2>
                      <p className="text-xs sm:text-sm text-teal-200/70 leading-relaxed font-light min-h-[66px] sm:min-h-[72px]">
                        放下掌控與內在緊繃，將心輪完全敞開如同一只純淨空杯。透過四方神聖箱型呼吸冥想與心靈音樂，盛接宇宙的高頻靈感與恩典卡。
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 text-xs text-teal-300 font-medium group-hover:translate-x-1 transition-transform">
                      <span>推開接收之門 (進入冥想與音樂) ➔</span>
                    </div>
                  </motion.div>

                  {/* 4. ☀️ 顯化之門 (Gate of Manifestation) - 包含願望播種、肯定句能量艙、集體願望星河 */}
                  <motion.div
                    whileHover={{ y: -4, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => {
                      sound.playSingingBowl528();
                      setManifestInitialSubView('menu');
                      setCurrentView('manifest');
                    }}
                    className="group relative p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#251910]/85 via-[#18110b]/85 to-[#0c0805]/95 border border-amber-400/30 hover:border-amber-400/70 shadow-2xl backdrop-blur-xl cursor-pointer flex flex-col justify-between transition-all overflow-hidden min-h-[260px] sm:min-h-[280px]"
                  >
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-amber-500/10 blur-2xl group-hover:bg-amber-500/20 transition-all pointer-events-none" />

                    <div>
                      <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 mb-4 group-hover:scale-110 transition-transform">
                        <Sun className="w-5 h-5" />
                      </div>
                      <span className="text-[11px] text-amber-300/70 tracking-widest block uppercase mb-1 font-mono">
                        MANIFEST & ALIGN
                      </span>
                      <h2 className="text-xl sm:text-2xl font-light text-white mb-2 tracking-wide">
                        ☀️ 顯化之門 ‧ 願望播種
                      </h2>
                      <p className="text-xs sm:text-sm text-amber-200/70 leading-relaxed font-light min-h-[66px] sm:min-h-[72px]">
                        在宇宙中心種下你的渴望，金種入球，透過高頻肯定句冥想對齊心輪，接收宇宙盟友的豐盛祝福、心態盲點提醒與豐盛卡。
                      </p>
                    </div>

                    <div className="mt-6 flex items-center gap-1.5 text-xs text-amber-300 font-medium group-hover:translate-x-1 transition-transform">
                      <span>推開顯化之門 ➔</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* ================= 底部：慢速流動的匿名願望星河光帶 ================= */}
              <div
                onClick={handleOpenWishWall}
                className="w-full max-w-4xl mt-6 sm:mt-8 p-3 rounded-2xl bg-black/40 border border-teal-400/25 hover:border-teal-400/50 cursor-pointer transition-all shadow-md overflow-hidden relative group"
                title="點擊展開宇宙集體願望星河"
              >
                <div className="flex items-center gap-2 text-xs text-teal-300 mb-1.5 px-1 font-mono">
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

          {/* ================= 視圖：釋放之門流程頁 ================= */}
          {currentView === 'release' && (
            <ReleaseSanctuary
              onBack={() => setCurrentView('home')}
              onOpenArchive={() => setIsArchiveOpen(true)}
            />
          )}

          {/* ================= 視圖：提問之門流程頁 ================= */}
          {currentView === 'inquire' && (
            <InquireSanctuary
              onBack={() => setCurrentView('home')}
              onOpenArchive={() => setIsArchiveOpen(true)}
            />
          )}

          {/* ================= 視圖：顯化之門流程頁 (含肯定句音檔與匿名願望星河) ================= */}
          {currentView === 'manifest' && (
            <ManifestSanctuaryV5
              onBack={() => setCurrentView('home')}
              onOpenArchive={() => setIsArchiveOpen(true)}
              initialSubView={manifestInitialSubView}
            />
          )}
        </AnimatePresence>
      </main>

      {/* ================= 底部資訊 (Footer) ================= */}
      <footer className="w-full max-w-5xl mx-auto px-4 py-4 sm:py-6 text-center text-amber-200/40 text-[11px] tracking-wider z-20">
        <p>宇宙永遠在傾聽，你所渴望的美好正以超越想像的方式走向你 ✨</p>
      </footer>

      {/* ================= 接收之門：V4 冥想殿堂全螢幕彈窗 (含心靈音樂) ================= */}
      <DailyMeditationModalV4
        isOpen={isMeditationOpen}
        onClose={() => setIsMeditationOpen(false)}
        onPointsUpdated={(newPts) => setPoints(newPts)}
        onOpenMusic={() => setIsMusicOpen(true)}
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
