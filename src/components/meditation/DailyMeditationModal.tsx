'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Flame, Clock, CheckCircle2, Award, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';
import SmilingCosmicOrb from '@/components/shared/SmilingCosmicOrb';
import { sound } from '@/lib/sound';
import { localStore, MeditationStats, BadgeRecord } from '@/lib/storage';
import { CosmicOneLinerCard } from '@/lib/presets/cosmicOneLiners';

interface DailyMeditationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPointsUpdated: (newPoints: number) => void;
  onOpenWishWall?: () => void;
}

// 嚴格依照使用者要求：1分=1點、3分=3點、5分=5點
const TIMER_OPTIONS = [
  { label: '1 分鐘 ‧ 快速調頻', minutes: 1 as const, seconds: 60, points: 1 },
  { label: '3 分鐘 ‧ 深度舒壓', minutes: 3 as const, seconds: 180, points: 3 },
  { label: '5 分鐘 ‧ 靈魂歸位', minutes: 5 as const, seconds: 300, points: 5 },
];

export default function DailyMeditationModal({
  isOpen,
  onClose,
  onPointsUpdated,
  onOpenWishWall,
}: DailyMeditationModalProps) {
  const [selectedDuration, setSelectedDuration] = useState(TIMER_OPTIONS[0]);
  const [timeLeft, setTimeLeft] = useState(TIMER_OPTIONS[0].seconds);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [earnedPoints, setEarnedPoints] = useState(0);
  const [newBadges, setNewBadges] = useState<BadgeRecord[]>([]);
  const [stats, setStats] = useState<MeditationStats>({
    streakDays: 0,
    totalMinutes: 0,
    lastMeditationDate: null,
    badges: [],
    canPostWishWall: false,
  });
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStats(localStore.getMeditationStats());
      setIsActive(false);
      setIsCompleted(false);
      setTimeLeft(selectedDuration.seconds);
      setNewBadges([]);
    }
  }, [isOpen, selectedDuration]);

  // 倒數計時
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // 4-4 呼吸引導文字循環
  useEffect(() => {
    if (!isActive) return;
    const interval = setInterval(() => {
      setBreathPhase((prev) => {
        if (prev === 'inhale') return 'hold';
        if (prev === 'hold') return 'exhale';
        return 'inhale';
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [isActive]);

  const startMeditation = () => {
    sound.playSingingBowl432(6);
    setIsActive(true);
    setIsCompleted(false);
  };

  const handleComplete = () => {
    setIsActive(false);
    setIsCompleted(true);
    sound.playSingingBowl528(6);

    // 依據分鐘數紀錄點數：1分=1點、3分=3點、5分=5點
    const result = localStore.recordMeditation(selectedDuration.minutes);
    setEarnedPoints(result.pointsEarned);
    setNewBadges(result.unlockedBadges);
    setStats(localStore.getMeditationStats());
    onPointsUpdated(result.newPointsTotal);

    try {
      confetti({
        particleCount: 110,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F472B6', '#818CF8', '#34D399'],
      });
    } catch {
      // ignore
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#111636] via-[#0d1028] to-[#070919] border border-amber-300/30 p-6 sm:p-8 flex flex-col items-center shadow-2xl relative text-amber-50"
        >
          {/* 關閉按鈕 */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-amber-200/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 標題與打卡徽章 */}
          <div className="text-center mb-5">
            <span className="text-[11px] text-amber-300 tracking-widest uppercase block mb-1">
              Daily Soul Alignment
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>每日冥想共修室</span>
            </h2>

            {/* 連續打卡與累計天數 */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              <span className="text-xs px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/30 text-amber-200 flex items-center gap-1.5 shadow-sm">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                連續打卡 <strong>{stats.streakDays}</strong> 天
              </span>
              <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-400/30 text-indigo-200 flex items-center gap-1.5 shadow-sm">
                <Clock className="w-3.5 h-3.5 text-indigo-300" />
                累計冥想 {stats.totalMinutes} 分鐘
              </span>
            </div>

            {/* 里程碑進度提示條 */}
            <div className="mt-3 text-left w-full max-w-xs mx-auto p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-amber-200/70 space-y-1">
              <div className="flex justify-between items-center">
                <span>🎯 7天里程碑（解鎖金句卡）：</span>
                <span className={stats.streakDays >= 7 ? 'text-emerald-400 font-medium' : 'text-amber-300'}>
                  {stats.streakDays >= 7 ? '✓ 已達成' : `${stats.streakDays}/7 天`}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>🌟 21天里程碑（解鎖願望牆）：</span>
                <span className={stats.streakDays >= 21 ? 'text-emerald-400 font-medium' : 'text-amber-300'}>
                  {stats.streakDays >= 21 ? '✓ 已解鎖' : `${stats.streakDays}/21 天`}
                </span>
              </div>
            </div>
          </div>

          {/* 冥想中微笑光球與倒數視覺 */}
          <div className="my-3 flex flex-col items-center relative">
            <SmilingCosmicOrb
              mode={isActive ? 'breathing' : 'idle'}
              size="md"
              themeColor="indigo"
              guideText={
                isActive
                  ? breathPhase === 'inhale'
                    ? '深吸一口氣... 吸入平靜與宇宙之愛'
                    : breathPhase === 'hold'
                    ? '輕輕屏息... 感受內在心輪的溫暖'
                    : '緩緩吐氣... 放下一切焦慮與緊抓'
                  : '點擊下方開始，給心靈幾分鐘神聖的沉靜'
              }
            />

            {/* 倒數時間大字 */}
            <div className="mt-4 text-3xl sm:text-4xl font-mono tracking-widest text-amber-200 drop-shadow">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* 冥想完成慶祝畫面 */}
          {isCompleted && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full my-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 to-indigo-950/70 border border-emerald-400/40 text-center space-y-3"
            >
              <div className="flex items-center justify-center gap-1.5 text-emerald-300 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>今日冥想調頻圓滿完成！</span>
              </div>
              <p className="text-xs text-amber-100/90">
                已自動為你累積 <strong className="text-amber-300 text-sm">+{earnedPoints} 點</strong> 心靈星光（1分=1點、3分=3點、5分=5點）
              </p>

              {/* 解鎖 7 天里程碑獎勵 */}
              {newBadges.some((b) => b.badgeType === '7_days_quote') && (
                <div className="p-3 rounded-xl bg-purple-950/70 border border-pink-400/50 text-left">
                  <div className="flex items-center gap-1.5 text-xs text-pink-300 font-medium mb-1">
                    <Award className="w-4 h-4 text-amber-300" />
                    <span>🎉 恭喜達成連續 7 天冥想！獲贈【宇宙給你的一句話卡】</span>
                  </div>
                  <p className="text-xs text-amber-100 italic">
                    「你所尋找的，正急切地在尋找你。允許一切如其所是，你便成為了自由的風。」
                  </p>
                </div>
              )}

              {/* 解鎖 21 天里程碑獎勵 */}
              {newBadges.some((b) => b.badgeType === '21_days_wish') && (
                <div className="p-3 rounded-xl bg-amber-950/70 border border-amber-400/50 text-left">
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
            </motion.div>
          )}

          {/* 時長選擇 (1分=1點、3分=3點、5分=5點) */}
          {!isActive && !isCompleted && (
            <div className="w-full space-y-4 mt-2">
              <div className="grid grid-cols-3 gap-2">
                {TIMER_OPTIONS.map((opt) => (
                  <button
                    key={opt.seconds}
                    onClick={() => {
                      setSelectedDuration(opt);
                      setTimeLeft(opt.seconds);
                    }}
                    className={`py-2.5 px-2 rounded-xl text-xs tracking-wider transition-all border ${
                      selectedDuration.seconds === opt.seconds
                        ? 'bg-amber-400/20 border-amber-300 text-amber-100 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                        : 'bg-white/5 border-white/10 text-amber-100/60 hover:bg-white/10'
                    }`}
                  >
                    <div>{opt.label.split('‧')[0]}</div>
                    <div className="text-[10px] text-amber-300 font-medium mt-0.5">
                      +{opt.points} 點數
                    </div>
                  </button>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={startMeditation}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 text-white font-medium text-sm tracking-widest shadow-[0_0_25px_rgba(129,140,248,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>開始冥想調頻（獲取 {selectedDuration.points} 點）</span>
              </motion.button>
            </div>
          )}

          {isActive && (
            <button
              onClick={() => {
                setIsActive(false);
                setTimeLeft(selectedDuration.seconds);
              }}
              className="mt-4 text-xs text-amber-200/50 hover:text-amber-200 transition-colors py-1.5 px-4 rounded-full bg-white/5 border border-white/10"
            >
              暫停 / 重新調頻
            </button>
          )}

          {isCompleted && (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-amber-400/90 hover:bg-amber-400 text-slate-950 font-medium text-xs tracking-widest transition-all mt-2"
            >
              帶著平靜能量返回殿堂
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
