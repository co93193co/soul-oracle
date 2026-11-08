'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Heart,
  ShieldCheck,
  Clock,
  Coins,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SmilingCosmicOrb from '@/components/shared/SmilingCosmicOrb';
import { sound } from '@/lib/sound';
import { localStore } from '@/lib/storage';

interface HooponoponoCleansingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPointsUpdated?: (newPoints: number) => void;
}

// 4 種時長與點數設定 (依照規定：1分免費、3分扣1點、5分扣3點、10分扣5點)
const DURATION_OPTIONS = [
  {
    minutes: 1,
    seconds: 60,
    cost: 0,
    label: '1 分鐘',
    tag: '快速調頻 ‧ 免費體驗',
    description: '輕柔撫平當下浮動思緒，快速回歸平靜中心',
  },
  {
    minutes: 3,
    seconds: 180,
    cost: 1,
    label: '3 分鐘',
    tag: '深度放手 ‧ 扣 1 點',
    description: '深入潛意識底層，融化日常糾結與緊繃執著',
  },
  {
    minutes: 5,
    seconds: 300,
    cost: 3,
    label: '5 分鐘',
    tag: '靈魂洗滌 ‧ 扣 3 點',
    description: '全面清理生生世世的重播記憶，喚醒內在神聖光芒',
  },
  {
    minutes: 10,
    seconds: 600,
    cost: 5,
    label: '10 分鐘',
    tag: '極限歸零 ‧ 扣 5 點',
    description: '極致深度和解，與人事物全然和好，體驗無上和平',
  },
];

// 夏威夷四句真言設定（單獨放大跳出、專屬神聖頻率與修復導引）
const MANTRAS = [
  {
    phrase: '對不起',
    hawaiian: 'E kala mai iaʻu',
    freq: 396, // 396 Hz 解放內疚、恐懼與自責
    meaning: '承認並看見自己內在有這份傷痛記憶在重播，向神性全然坦承',
    guide: '請跟著出聲朗讀，或在心裡溫柔默念',
    glowColor: 'rgba(56, 189, 248, 0.65)',
  },
  {
    phrase: '請原諒我',
    hawaiian: 'E kala mai',
    freq: 417, // 417 Hz 化解過去創傷、促進情感轉化
    meaning: '祈求神性與內在自我的寬恕，放下苛責與掌控的執念',
    guide: '允許寬恕如甘霖般流過心田，融化一切心結',
    glowColor: 'rgba(168, 85, 247, 0.65)',
  },
  {
    phrase: '謝謝你',
    hawaiian: 'Mahalo',
    freq: 528, // 528 Hz 愛的奇蹟、DNA修復與細胞和諧
    meaning: '感謝這份經歷帶來的覺察與靈魂功課，感恩所有的照見',
    guide: '心懷純粹的感激，感謝這段相遇讓愛得以圓滿',
    glowColor: 'rgba(251, 191, 36, 0.7)',
  },
  {
    phrase: '我愛你',
    hawaiian: 'Aloha wau iā ʻoe',
    freq: 639, // 639 Hz 心輪連結、人際和諧與無條件之愛
    meaning: '以神性無條件的純粹大愛，包容融化一切，回歸零的原點',
    guide: '送出無條件的光與愛，擁抱對方，也深愛自己',
    glowColor: 'rgba(244, 114, 182, 0.7)',
  },
];

// 推薦快速和解對象
const QUICK_TARGETS = [
  '內在受傷的自己',
  '某位在乎的人',
  '過去遺憾的經歷',
  '身體的病痛不適',
  '金錢匱乏的恐懼',
  '對未來的焦慮',
];

export default function HooponoponoCleansingModal({
  isOpen,
  onClose,
  onPointsUpdated,
}: HooponoponoCleansingModalProps) {
  const [step, setStep] = useState<'intro' | 'cleansing' | 'completed'>('intro');
  const [selectedDuration, setSelectedDuration] = useState(DURATION_OPTIONS[0]);
  const [cleansingTarget, setCleansingTarget] = useState('');
  const [showMethodDetails, setShowMethodDetails] = useState(false);

  // 點數與狀態
  const [currentPoints, setCurrentPoints] = useState(365);
  const [insufficientPointsNotice, setInsufficientPointsNotice] = useState(false);

  // 清理計時與真言輪播
  const [timeLeft, setTimeLeft] = useState(selectedDuration.seconds);
  const [isPaused, setIsPaused] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [currentMantraIndex, setCurrentMantraIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mantraTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化點數與重設
  useEffect(() => {
    if (isOpen) {
      const p = localStore.getPoints();
      setCurrentPoints(p);
      setStep('intro');
      setSelectedDuration(DURATION_OPTIONS[0]);
      setTimeLeft(DURATION_OPTIONS[0].seconds);
      setIsPaused(false);
      setCurrentMantraIndex(0);
      setInsufficientPointsNotice(false);
      setIsAudioMuted(sound.isMuted);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mantraTimerRef.current) clearInterval(mantraTimerRef.current);
    }
  }, [isOpen]);

  // 切換時長選項
  const handleSelectOption = (opt: typeof DURATION_OPTIONS[number]) => {
    sound.playSparkle();
    setSelectedDuration(opt);
    setTimeLeft(opt.seconds);
    setInsufficientPointsNotice(false);
  };

  // 開始清理體驗
  const handleStartCleansing = () => {
    const cost = selectedDuration.cost;

    // 檢查點數
    if (cost > 0) {
      const hasEnough = localStore.getPoints() >= cost;
      if (!hasEnough) {
        setInsufficientPointsNotice(true);
        sound.playSparkle();
        return;
      }
      // 扣除點數
      const success = localStore.deductPoints(cost);
      if (success) {
        const remaining = localStore.getPoints();
        setCurrentPoints(remaining);
        if (onPointsUpdated) onPointsUpdated(remaining);
      }
    }

    setStep('cleansing');
    setTimeLeft(selectedDuration.seconds);
    setIsPaused(false);
    setCurrentMantraIndex(0);

    // 播放初始真言音效 (396Hz)
    sound.playCleansingChime(MANTRAS[0].freq, 3.8);
  };

  // 計時器邏輯
  useEffect(() => {
    if (step === 'cleansing' && !isPaused) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleCompleteCleansing();
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
  }, [step, isPaused]);

  // 真言輪播邏輯 (每 4.5 秒放大跳出下一句真言並發出神聖音頻)
  useEffect(() => {
    if (step === 'cleansing' && !isPaused) {
      mantraTimerRef.current = setInterval(() => {
        setCurrentMantraIndex((prev) => {
          const nextIndex = (prev + 1) % MANTRAS.length;
          // 播放下一句對應的音頻
          sound.playCleansingChime(MANTRAS[nextIndex].freq, 3.8);
          return nextIndex;
        });
      }, 4500);
    } else {
      if (mantraTimerRef.current) clearInterval(mantraTimerRef.current);
    }

    return () => {
      if (mantraTimerRef.current) clearInterval(mantraTimerRef.current);
    };
  }, [step, isPaused]);

  // 完成清理
  const handleCompleteCleansing = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mantraTimerRef.current) clearInterval(mantraTimerRef.current);

    setStep('completed');
    sound.playSingingBowl528(5);

    // 施放祝福星塵特效
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2dd4bf', '#38bdf8', '#fbbf24', '#f472b6', '#a855f7'],
      });
    } catch {
      // 容錯防禦
    }
  };

  // 音訊切換
  const handleToggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    sound.isMuted = nextMuted;
    if (!nextMuted) {
      sound.playSparkle();
    }
  };

  // 時間格式轉換
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 當前真言
  const currentMantra = MANTRAS[currentMantraIndex];
  const progressRatio = (selectedDuration.seconds - timeLeft) / selectedDuration.seconds;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#0c142b]/95 via-[#080d1e]/98 to-[#030611] border border-teal-400/30 shadow-[0_0_50px_rgba(20,184,166,0.25)] p-5 sm:p-7 relative flex flex-col text-amber-50"
      >
        {/* ================= 頂部狀態列 ================= */}
        <div className="flex items-center justify-between pb-4 border-b border-teal-400/20 mb-5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌊</span>
            <div>
              <h2 className="text-sm sm:text-base font-medium text-white tracking-wider flex items-center gap-1.5">
                夏威夷零極限 ‧ 清理之門
              </h2>
              <p className="text-[11px] text-teal-300/80 font-light tracking-wide">
                Hoʻoponopono 和解與清空潛意識殿堂
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 點數徽章 */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/25 text-amber-300 text-xs font-mono">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentPoints} 點</span>
            </div>

            {/* 靜音切換 */}
            <button
              type="button"
              onClick={handleToggleAudio}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-teal-200 transition-colors cursor-pointer"
              aria-label={isAudioMuted ? '開啟聲音' : '靜音'}
            >
              {isAudioMuted ? (
                <VolumeX className="w-4 h-4 text-red-300" />
              ) : (
                <Volume2 className="w-4 h-4 text-teal-300" />
              )}
            </button>

            {/* 關閉按鈕 */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-teal-200 hover:text-white transition-colors cursor-pointer"
              aria-label="關閉清理之門"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= 階段一：介紹與時長設定 (intro - 精簡單頁，免滾動) ================= */}
        {step === 'intro' && (
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* 和解對象設定（選填） */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-teal-200 font-medium flex items-center justify-between">
                <span>此刻想與誰、或哪件事和解清理？（選填）</span>
                <span className="text-[10.5px] text-teal-400/80 font-light">集中意念效果更佳</span>
              </label>

              {/* 快捷點選 */}
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TARGETS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      sound.playSparkle();
                      setCleansingTarget(t);
                    }}
                    className={`text-[11px] py-1 px-2.5 rounded-full border transition-all cursor-pointer ${
                      cleansingTarget === t
                        ? 'bg-teal-500/30 border-teal-300 text-white font-medium shadow-[0_0_10px_rgba(45,212,191,0.4)]'
                        : 'bg-white/5 border-white/10 text-teal-200/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* 自訂書寫 */}
              <input
                type="text"
                value={cleansingTarget}
                onChange={(e) => setCleansingTarget(e.target.value)}
                placeholder="例如：內在苛責的自己、父親、前任、工作專案的無力感..."
                maxLength={40}
                className="w-full px-3.5 py-2 rounded-xl bg-black/40 border border-teal-500/30 text-amber-50 placeholder-teal-300/35 text-xs sm:text-sm focus:outline-none focus:border-teal-400 focus:ring-1 focus:ring-teal-400/50"
              />
            </div>

            {/* 清理時長與扣點方案選擇 */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-teal-200 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-teal-300" />
                  <span>選擇和解清理時長：</span>
                </label>
                <span className="text-[10.5px] text-amber-300 font-mono">
                  1分免費 ‧ 3分1點 ‧ 5分3點 ‧ 10分5點
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {DURATION_OPTIONS.map((opt) => {
                  const isSelected = selectedDuration.minutes === opt.minutes;
                  return (
                    <button
                      key={opt.minutes}
                      type="button"
                      onClick={() => handleSelectOption(opt)}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-br from-teal-500/25 via-cyan-500/20 to-teal-900/40 border-teal-300 shadow-[0_0_15px_rgba(20,184,166,0.35)] scale-[1.02]'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-teal-500/30 text-teal-100/80'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-0.5">
                        <span className="text-xs sm:text-sm font-semibold text-white">{opt.label}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-medium ${
                            opt.cost === 0
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
                              : isSelected
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                              : 'bg-white/10 text-amber-200/80'
                          }`}
                        >
                          {opt.cost === 0 ? '免費 0 點' : `扣 ${opt.cost} 點`}
                        </span>
                      </div>
                      <p className="text-[9.5px] sm:text-[10px] text-teal-200/70 font-light leading-tight line-clamp-1">
                        {opt.tag}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 點數不足警告 */}
            {insufficientPointsNotice && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-400/40 text-amber-200 text-xs flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  星心點數不足（目前 {currentPoints} 點，需 {selectedDuration.cost} 點）。
                  您可以選擇 1 分鐘免費體驗，或前往「02 靜心之門」呼吸集點。
                </span>
              </motion.div>
            )}

            {/* 進入清理殿堂按鈕 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleStartCleansing}
              className="w-full py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-2 font-medium tracking-wider text-xs sm:text-sm text-white bg-gradient-to-r from-teal-500 via-cyan-500 to-teal-600 hover:from-teal-400 hover:via-cyan-400 hover:to-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.45)] border border-teal-300/40 cursor-pointer transition-all mt-1"
            >
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              <span>
                開啟清理之門 ‧ 進入和解真言冥想
                {selectedDuration.cost > 0 ? `（扣 ${selectedDuration.cost} 點）` : '（免費）'}
              </span>
            </motion.button>
          </div>
        )}

        {/* ================= 階段二：清理進行中 (cleansing) ================= */}
        {step === 'cleansing' && (
          <div className="flex flex-col items-center justify-between min-h-[420px] sm:min-h-[460px] py-4 relative">
            {/* 頂部和解對象與時間倒數 */}
            <div className="w-full flex items-center justify-between text-xs text-teal-200/80 mb-2">
              <div className="flex items-center gap-1.5 bg-teal-950/50 px-3 py-1.5 rounded-full border border-teal-500/20">
                <Heart className="w-3.5 h-3.5 text-pink-400 fill-pink-400/30" />
                <span>
                  {cleansingTarget.trim()
                    ? `此刻專注和解：${cleansingTarget}`
                    : '此刻專注和解：內在重播的一切記憶'}
                </span>
              </div>

              <div className="text-base font-mono font-medium text-white tracking-widest bg-black/40 px-3 py-1 rounded-full border border-teal-400/30">
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* 進度條 */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-6">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-400 via-cyan-300 to-pink-400"
                style={{ width: `${progressRatio * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* ================= 中央四句神聖真言（單獨放大跳出動畫） ================= */}
            <div className="w-full flex-1 flex flex-col items-center justify-center text-center my-6 relative min-h-[200px]">
              {/* 背景神聖光暈擴散動畫 */}
              <motion.div
                key={`halo-${currentMantraIndex}`}
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 4.5, ease: 'easeOut' }}
                className="absolute w-44 h-44 rounded-full pointer-events-none"
                style={{
                  background: `radial-gradient(circle, ${currentMantra.glowColor} 0%, rgba(0,0,0,0) 70%)`,
                }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMantra.phrase}
                  initial={{ scale: 0.65, opacity: 0, y: 15 }}
                  animate={{ scale: [0.65, 1.15, 1], opacity: 1, y: 0 }}
                  exit={{ scale: 1.25, opacity: 0, filter: 'blur(8px)' }}
                  transition={{
                    duration: 0.85,
                    times: [0, 0.45, 1],
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex flex-col items-center justify-center z-10"
                >
                  {/* 夏威夷聖名 */}
                  <span className="text-xs sm:text-sm text-teal-300/80 font-mono tracking-[0.25em] uppercase mb-2">
                    ✦ {currentMantra.hawaiian} ✦
                  </span>

                  {/* 核心真言：單獨放大跳出，極具神聖張力 */}
                  <h1
                    className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-extralight text-white tracking-[0.2em] sm:tracking-[0.25em] whitespace-nowrap select-none my-2"
                    style={{
                      filter: `drop-shadow(0 0 16px ${currentMantra.glowColor}) drop-shadow(0 0 35px rgba(255,255,255,0.7))`,
                    }}
                  >
                    {currentMantra.phrase}
                  </h1>

                  {/* 心法釋義 */}
                  <p className="text-xs sm:text-sm text-teal-100/90 font-light max-w-sm mt-3 px-4 leading-relaxed">
                    {currentMantra.meaning}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 下方靈性低語引導 */}
            <div className="w-full text-center mb-6">
              <motion.p
                animate={{ opacity: [0.75, 1, 0.75] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="text-xs text-amber-200/90 font-light tracking-wider"
              >
                ✦ 請跟著出聲朗讀，或在心裡溫柔默念，將神聖之愛送給這段緣分 ✦
              </motion.p>
              <p className="text-[10.5px] text-teal-300/60 font-mono mt-1">
                432Hz ~ 639Hz Solfeggio 和解音頻同步調頻中
              </p>
            </div>

            {/* 底部控制欄 */}
            <div className="w-full flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs text-teal-100 border border-white/10 transition-all cursor-pointer"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? '繼續清理' : '暫停'}</span>
              </button>

              <button
                type="button"
                onClick={handleCompleteCleansing}
                className="flex items-center gap-1.5 px-5 py-2 rounded-full bg-teal-500/20 hover:bg-teal-500/30 text-xs text-teal-200 border border-teal-400/40 transition-all cursor-pointer shadow-[0_0_12px_rgba(20,184,166,0.3)]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-teal-300" />
                <span>提早完成清理</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 階段三：完成祝禱與歸零 (completed) ================= */}
        {step === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-6 px-2 gap-5"
          >
            {/* 圓滿微笑光球 */}
            <div className="my-2">
              <SmilingCosmicOrb
                size="md"
                themeColor="teal"
                sparkleStyle="original"
                guideText="一切沉重記憶已在愛中融化，回歸零的和平"
              />
            </div>

            <div className="flex flex-col items-center gap-2 max-w-md">
              <span className="text-xs text-teal-300 font-mono tracking-widest">
                ✦ 零極限 ‧ 和解圓滿 ✦
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-white tracking-widest">
                一切記憶已被愛洗滌釋放
              </h3>
              <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed font-light mt-1">
                「對不起、請原諒我、謝謝你、我愛你」
                <br />
                當你由心底為感知的一切負起責任，神聖的靈光便已取代糾結。
                你已回到潔淨無瑕的「零」的原點，願純粹的平靜永遠與你同在。
              </p>
            </div>

            {/* 底部按鈕 */}
            <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  sound.playSparkle();
                  setStep('intro');
                }}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-teal-100 text-xs tracking-wider border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>為另一人事物再次清理</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white text-xs tracking-wider border border-teal-300/40 shadow-lg transition-all cursor-pointer"
              >
                圓滿返回釋放之門
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
