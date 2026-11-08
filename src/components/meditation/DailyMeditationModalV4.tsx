'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Flame,
  Clock,
  CheckCircle2,
  Award,
  Gift,
  ArrowLeft,
  Infinity as InfinityIcon,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import BoxBreathingSmilingOrb, { BoxPhase } from '@/components/shared/BoxBreathingSmilingOrb';
import { sound } from '@/lib/sound';
import { localStore, MeditationStats, BadgeRecord } from '@/lib/storage';

interface DailyMeditationModalV4Props {
  isOpen: boolean;
  onClose: () => void;
  onPointsUpdated: (newPoints: number) => void;
  onOpenWishWall?: () => void;
}

// V4 冥想選項：1分=1點、3分=3點、5分=5點，另提供 10分封頂 與 自由不限時模式 (最高10點)
const PRESET_OPTIONS = [
  { label: '1 分鐘 ‧ 快速調頻', minutes: 1, seconds: 60, points: 1 },
  { label: '3 分鐘 ‧ 深度舒壓', minutes: 3, seconds: 180, points: 3 },
  { label: '5 分鐘 ‧ 靈魂歸位', minutes: 5, seconds: 300, points: 5 },
  { label: '10 分鐘 ‧ 滿額封頂', minutes: 10, seconds: 600, points: 10 },
];

export default function DailyMeditationModalV4({
  isOpen,
  onClose,
  onPointsUpdated,
  onOpenWishWall,
}: DailyMeditationModalV4Props) {
  const [mode, setMode] = useState<'preset' | 'open'>('preset'); // preset: 倒數計時, open: 自由不限時正向計時
  const [selectedPreset, setSelectedPreset] = useState(PRESET_OPTIONS[0]);
  const [timeLeft, setTimeLeft] = useState(PRESET_OPTIONS[0].seconds);
  const [elapsedSeconds, setElapsedSeconds] = useState(0); // 自由不限時累積秒數
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [earnedPoints, setEarnedPoints] = useState(0);
  const [todayPointsTotal, setTodayPointsTotal] = useState(0);
  const [isDailyCapReached, setIsDailyCapReached] = useState(false);
  const [meditatedMinutes, setMeditatedMinutes] = useState(0);
  const [newBadges, setNewBadges] = useState<BadgeRecord[]>([]);
  const [currentBoxPhase, setCurrentBoxPhase] = useState<BoxPhase>('inhale');
  const [stats, setStats] = useState<MeditationStats>({
    streakDays: 0,
    totalMinutes: 0,
    lastMeditationDate: null,
    badges: [],
    canPostWishWall: false,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStats(localStore.getMeditationStats());
      setIsActive(false);
      setIsCompleted(false);
      setTimeLeft(selectedPreset.seconds);
      setElapsedSeconds(0);
      setNewBadges([]);
    }
  }, [isOpen, selectedPreset, mode]);

  // 計時器邏輯
  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        if (mode === 'preset') {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              handleCompleteSession(selectedPreset.minutes);
              return 0;
            }
            return prev - 1;
          });
        } else {
          // 自由不限時模式 (正向累積秒數)
          setElapsedSeconds((prev) => prev + 1);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, mode, selectedPreset]);

  const startMeditation = () => {
    sound.playSingingBowl432(6);
    setIsActive(true);
    setIsCompleted(false);
  };

  // 結算冥想時長與點數 (1分1點、3分3點、5分5點，時間不限，單次最高 10 點)
  const handleCompleteSession = (totalMinutes: number) => {
    setIsActive(false);
    setIsCompleted(true);
    sound.playSingingBowl528(6);

    const actualMinutes = Math.max(1, totalMinutes);
    setMeditatedMinutes(actualMinutes);

    // 呼叫 V4 專屬點數計算 (每日上限 10 點)
    const result = localStore.recordMeditationV4(actualMinutes);
    setEarnedPoints(result.pointsEarned);
    setTodayPointsTotal(result.todayPointsTotal);
    setIsDailyCapReached(result.isDailyCapReached);
    setNewBadges(result.unlockedBadges);
    setStats(localStore.getMeditationStats());
    onPointsUpdated(result.newPointsTotal);

    try {
      confetti({
        particleCount: 130,
        spread: 95,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F472B6', '#818CF8', '#34D399'],
      });
    } catch {
      // ignore
    }
  };

  const handleStopOpenMeditation = () => {
    // 依據累積秒數換算分鐘數 (至少 1 分鐘)
    const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
    handleCompleteSession(minutes);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden bg-black/90 backdrop-blur-2xl flex items-center justify-center p-0 sm:p-4 md:p-6 selection:bg-amber-400/20">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="w-full sm:max-w-5xl h-full sm:h-auto sm:min-h-[88vh] sm:max-h-[92vh] overflow-y-auto rounded-none sm:rounded-3xl bg-gradient-to-b from-[#111636]/95 via-[#0d1028]/95 to-[#070919]/95 border-0 sm:border sm:border-amber-300/35 p-3.5 sm:p-6 md:p-8 flex flex-col justify-between shadow-2xl relative text-amber-50 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] sm:pb-8"
        >
          {/* ================= 頂部導覽列：返回按鈕、連續天數、關閉按鈕 ================= */}
          <div className="w-full flex items-center justify-between pb-2.5 sm:pb-4 border-b border-white/10 gap-2 shrink-0">
            {/* 左側：回到前頁按鈕選項 */}
            <button
              onClick={onClose}
              className="flex items-center gap-1 sm:gap-1.5 py-1 sm:py-1.5 px-2.5 sm:px-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-[11px] sm:text-xs text-amber-200 hover:text-white transition-all shadow-sm group shrink-0 active:scale-95"
            >
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              <span>回到前頁</span>
            </button>

            {/* 中央：連續天數與打卡狀態 */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/30 text-amber-200 flex items-center gap-1 shadow-sm">
                <Flame className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-orange-400" />
                連續 <strong>{stats.streakDays}</strong> 天
              </span>
              <span className="hidden sm:flex text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-200 items-center gap-1.5 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-indigo-300" />
                累計 {stats.totalMinutes} 分鐘
              </span>
            </div>

            {/* 右側：X 關閉回到前頁 */}
            <button
              onClick={onClose}
              title="回到前頁"
              className="p-1.5 sm:p-2 rounded-full hover:bg-white/15 text-amber-200/70 hover:text-white transition-colors border border-white/10 bg-white/5 shrink-0 active:scale-95"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* ================= 神聖主標題與能量方框引言 ================= */}
          <div className="text-center my-2 sm:my-3 space-y-1 sm:space-y-1.5 shrink-0">
            <span className="text-[10px] sm:text-[11px] text-amber-300 tracking-widest uppercase block font-mono">
              ✦ SACRED FOUR-FOLD BOX BREATHING ✦
            </span>

            {/* 用戶指定的四方能量神聖標題 */}
            <h2 className="text-[11px] sm:text-xs md:text-sm font-light text-amber-100/95 tracking-wide max-w-3xl mx-auto leading-relaxed text-center px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/5 border border-amber-300/25 shadow-inner">
              「如同四方穩固的能量方框，每一個停留都是對當下的完全臨在。吸氣聚集光芒、閉氣凝聚力量、吐氣釋放緊繃、閉氣回歸空白。」
            </h2>

            {/* 點數規則清晰標示 */}
            <div className="text-[10px] sm:text-xs px-2.5 py-0.5 sm:py-1 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 inline-block font-medium">
              ✨ 1分=1點 ‧ 3分=3點 ‧ 5分=5點 ‧ 10分=10點 (每日冥想上限 10 點)
            </div>
          </div>

          {/* ================= 中央區域：16秒箱型呼吸笑臉與計時大字 ================= */}
          <div className="flex flex-col items-center justify-center my-1 sm:my-2 shrink-0">
            {/* 模式切換：指定時長 vs 自由不限時 */}
            {!isActive && !isCompleted && (
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mb-2 sm:mb-3 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl bg-black/40 border border-white/10 text-xs">
                <button
                  onClick={() => setMode('preset')}
                  className={`py-1 sm:py-1.5 px-3 sm:px-4 rounded-xl text-xs transition-all ${
                    mode === 'preset'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                      : 'text-amber-100/60 hover:text-white'
                  }`}
                >
                  固定時長 (1/3/5/10分)
                </button>
                <button
                  onClick={() => setMode('open')}
                  className={`py-1 sm:py-1.5 px-3 sm:px-4 rounded-xl text-xs transition-all flex items-center gap-1.5 ${
                    mode === 'open'
                      ? 'bg-purple-500 text-white font-bold shadow-sm'
                      : 'text-amber-100/60 hover:text-white'
                  }`}
                >
                  <InfinityIcon className="w-3.5 h-3.5" />
                  <span>自由不限時 (最高10點)</span>
                </button>
              </div>
            )}

            {/* 16秒箱型呼吸笑臉 (V3 經典呼吸畫面，無眉毛，眼、腮紅、嘴巴) */}
            <BoxBreathingSmilingOrb
              isPlaying={true}
              soundEnabled={isActive}
              size="md"
              onPhaseChange={(phase) => setCurrentBoxPhase(phase)}
            />

            {/* 計時器時間大字 */}
            <div className="mt-1.5 sm:mt-3 text-3xl sm:text-5xl font-mono tracking-widest text-amber-200 drop-shadow">
              {mode === 'preset' ? formatTime(timeLeft) : formatTime(elapsedSeconds)}
            </div>
            {mode === 'open' && isActive && (
              <span className="text-[11px] sm:text-xs text-purple-300 mt-1 font-mono">
                已沉浸 {Math.floor(elapsedSeconds / 60)} 分鐘 (預計可獲{' '}
                {Math.min(10, Math.max(1, Math.floor(elapsedSeconds / 60)))} 點)
              </span>
            )}
          </div>

          {/* ================= 四階段引導說明卡片群 (響應式：手機2x2，桌機1列4欄) ================= */}
          <div className="w-full max-w-4xl mx-auto my-1.5 sm:my-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-3 text-left">
              {/* 1. 吸氣（4秒） */}
              <div
                className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-500 flex flex-col justify-between ${
                  currentBoxPhase === 'inhale'
                    ? 'bg-amber-400/20 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] ring-1 ring-amber-300'
                    : 'bg-white/5 border-white/10 opacity-70'
                }`}
              >
                <div className="text-[11px] sm:text-xs font-semibold text-amber-300 mb-1">
                  <span>吸氣（4秒）</span>
                </div>
                <p className="text-[10px] sm:text-[11px] leading-relaxed text-amber-100/90 font-light">
                  圓臉化為溫暖的黃光緩緩膨脹，象徵將宇宙的能量與清新空氣吸入體內。
                </p>
              </div>

              {/* 2. 憋氣（4秒） */}
              <div
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-500 ${
                  currentBoxPhase === 'hold1'
                    ? 'bg-rose-500/20 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.3)] ring-1 ring-rose-400'
                    : 'bg-white/5 border-white/10 opacity-70'
                }`}
              >
                <div className="text-[11px] sm:text-xs font-semibold text-rose-300 mb-1">
                  <span>憋氣（4秒）</span>
                </div>
                <p className="text-[10px] sm:text-[11px] leading-relaxed text-amber-100/90 font-light">
                  光球維持飽滿，臉色因專注與能量凝聚而漸漸漲紅，象徵力量在體內安住、匯聚。
                </p>
              </div>

              {/* 3. 吐氣（4秒） */}
              <div
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-500 ${
                  currentBoxPhase === 'exhale'
                    ? 'bg-pink-400/20 border-pink-300 shadow-[0_0_20px_rgba(244,114,182,0.3)] ring-1 ring-pink-300'
                    : 'bg-white/5 border-white/10 opacity-70'
                }`}
              >
                <div className="text-[11px] sm:text-xs font-semibold text-pink-300 mb-1">
                  <span>吐氣（4秒）</span>
                </div>
                <p className="text-[10px] sm:text-[11px] leading-relaxed text-amber-100/90 font-light">
                  光球轉為柔和的粉紅光慢慢縮小，象徵將疲憊與壓力溫柔地釋放出去。
                </p>
              </div>

              {/* 4. 憋氣（4秒） */}
              <div
                className={`p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-500 ${
                  currentBoxPhase === 'hold2'
                    ? 'bg-rose-600/20 border-rose-400 shadow-[0_0_20px_rgba(225,29,72,0.3)] ring-1 ring-rose-400'
                    : 'bg-white/5 border-white/10 opacity-70'
                }`}
              >
                <div className="text-[11px] sm:text-xs font-semibold text-rose-300 mb-1">
                  <span>憋氣（4秒）</span>
                </div>
                <p className="text-[10px] sm:text-[11px] leading-relaxed text-amber-100/90 font-light">
                  光球維持最小、回歸平靜，顏色回到如首頁圖案顏色，腮紅粉紅，安住於空無一物的當下，準備迎接下一個循環。
                </p>
              </div>
            </div>
          </div>

          {/* ================= 冥想完成慶祝畫面 ================= */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-xl mx-auto my-3 p-5 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-indigo-950/80 border border-emerald-400/40 text-center space-y-3"
            >
              <div className="flex items-center justify-center gap-2 text-emerald-300 text-base font-medium">
                <CheckCircle2 className="w-5 h-5" />
                <span>今日冥想調頻圓滿完成！</span>
              </div>
              <div className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                你沉浸了 <strong className="text-amber-200">{meditatedMinutes} 分鐘</strong>
                {earnedPoints > 0 ? (
                  <>
                    ，獲得 <strong className="text-amber-300 text-base">+{earnedPoints} 點</strong> 心靈星光！
                    <span className="block text-[11px] text-amber-200/80 mt-1 font-mono">
                      (今日冥想累計已獲 {todayPointsTotal}/10 點{isDailyCapReached && ' ‧ 今日已達上限 🎉'})
                    </span>
                  </>
                ) : (
                  <>
                    ！<br />
                    <span className="text-amber-300 font-medium">今日冥想點數已達上限 (10/10 點)</span>
                    <span className="block text-[11px] text-amber-200/80 mt-1">
                      本次冥想已為你持續累積連續打卡天數（{stats.streakDays} 天）與里程碑勳章！
                    </span>
                  </>
                )}
              </div>

              {/* 解鎖 7 天里程碑獎勵 */}
              {newBadges.some((b) => b.badgeType === '7_days_quote') && (
                <div className="p-3.5 rounded-xl bg-purple-950/70 border border-pink-400/50 text-left">
                  <div className="flex items-center gap-1.5 text-xs text-pink-300 font-medium mb-1">
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>🎉 恭喜達成連續 7 天冥想！獲贈【宇宙告訴你的一句話卡】</span>
                  </div>
                  <p className="text-xs text-amber-100 italic">
                    「你所尋找的，正急切地在尋找你。允許一切如其所是，你便成為了自由的風。」
                  </p>
                </div>
              )}

              {/* 解鎖 21 天里程碑獎勵 */}
              {newBadges.some((b) => b.badgeType === '21_days_wish') && (
                <div className="p-3.5 rounded-xl bg-amber-950/70 border border-amber-400/50 text-left">
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium mb-1">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <span>🌟 奇蹟達成！連續 21 天神聖調頻，已解鎖【宇宙願望牆】許願特權！</span>
                  </div>
                  {onOpenWishWall && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenWishWall();
                      }}
                      className="mt-2 py-1.5 px-3 rounded-lg bg-amber-400 text-slate-950 text-xs font-semibold"
                    >
                      立刻前往願望牆留下你的願望 ➔
                    </button>
                  )}
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-amber-400/90 hover:bg-amber-400 text-slate-950 font-bold text-xs tracking-widest transition-all mt-2"
              >
                帶著平靜能量回到前頁 ➔
              </button>
            </motion.div>
          )}

          {/* ================= 里程碑進度與控制操作列 ================= */}
          {!isCompleted && (
            <div className="w-full max-w-xl mx-auto space-y-3 mt-2">
              {/* 里程碑進度提示條 (V3 經典里程碑連結) */}
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-amber-200/70 flex justify-between items-center gap-2">
                <div>
                  <span>🎯 7天金句卡：</span>
                  <span className={stats.streakDays >= 7 ? 'text-emerald-400 font-medium ml-1' : 'text-amber-300 ml-1'}>
                    {stats.streakDays >= 7 ? '✓ 已達成' : `${stats.streakDays}/7 天`}
                  </span>
                </div>
                <div>
                  <span>🌟 21天願望牆：</span>
                  <span className={stats.streakDays >= 21 ? 'text-emerald-400 font-medium ml-1' : 'text-amber-300 ml-1'}>
                    {stats.streakDays >= 21 ? '✓ 已解鎖' : `${stats.streakDays}/21 天`}
                  </span>
                </div>
              </div>

              {!isActive ? (
                <div className="space-y-3">
                  {mode === 'preset' ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PRESET_OPTIONS.map((opt) => (
                        <button
                          key={opt.seconds}
                          onClick={() => {
                            setSelectedPreset(opt);
                            setTimeLeft(opt.seconds);
                          }}
                          className={`py-2.5 px-2 rounded-xl text-xs tracking-wider transition-all border ${
                            selectedPreset.seconds === opt.seconds
                              ? 'bg-amber-400/20 border-amber-300 text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                              : 'bg-white/5 border-white/10 text-amber-100/60 hover:bg-white/10'
                          }`}
                        >
                          <div>{opt.label.split('‧')[0]}</div>
                          <div className="text-[10px] text-amber-300 font-bold mt-0.5">
                            +{opt.points} 點數
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-400/20 text-center text-xs text-purple-200">
                      <p>不限時間長度，隨心靜坐，每冥想滿 1 分鐘獲 1 點，單次上限 10 點！</p>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startMeditation}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 text-white font-medium text-sm tracking-widest shadow-[0_0_25px_rgba(129,140,248,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>
                      {mode === 'preset'
                        ? `開始冥想（獲取 ${selectedPreset.points} 點）`
                        : '開始自由不限時冥想 (最高10點)'}
                    </span>
                  </motion.button>

                  {/* 額外返回前頁選項 */}
                  <div className="text-center pt-1">
                    <button
                      onClick={onClose}
                      className="text-xs text-amber-200/50 hover:text-amber-200 underline tracking-wider transition-colors"
                    >
                      暫不冥想，回到前頁
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                  {mode === 'open' ? (
                    <button
                      onClick={handleStopOpenMeditation}
                      className="w-full sm:w-auto py-2.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-bold text-xs tracking-wider shadow-lg hover:scale-105 transition-transform"
                    >
                      ✓ 結束冥想並結算點數 (最高10點)
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setIsActive(false);
                        setTimeLeft(selectedPreset.seconds);
                      }}
                      className="text-xs text-amber-200/60 hover:text-amber-200 transition-colors py-2 px-4 rounded-full bg-white/5 border border-white/10"
                    >
                      暫停 / 重新調頻
                    </button>
                  )}

                  <button
                    onClick={onClose}
                    className="text-xs text-amber-200/50 hover:text-white transition-colors py-2 px-4 rounded-full hover:bg-white/10"
                  >
                    回到前頁
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
