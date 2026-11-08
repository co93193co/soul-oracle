'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/lib/sound';

export type BoxPhase = 'inhale' | 'hold1' | 'exhale' | 'hold2';

interface BoxBreathingSmilingOrbProps {
  isPlaying?: boolean;
  soundEnabled?: boolean;
  onPhaseChange?: (phase: BoxPhase) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function BoxBreathingSmilingOrb({
  isPlaying = true,
  soundEnabled = true,
  onPhaseChange,
  size = 'md',
}: BoxBreathingSmilingOrbProps) {
  // 16秒完整循環：0~4s 吸氣 -> 4~8s 憋氣(漲紅) -> 8~12s 吐氣(粉紅) -> 12~16s 憋氣(平靜)
  const [secondsInCycle, setSecondsInCycle] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSecondsInCycle((prev) => {
        const next = (prev + 1) % 16;
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // 計算當前階段
  let phase: BoxPhase = 'inhale';
  let phaseName = '吸氣 (Inhale)';
  let phaseInstruction = '圓形放大 ‧ 充滿溫暖黃光';
  let phaseSecondsLeft = 4 - (secondsInCycle % 4);

  if (secondsInCycle >= 0 && secondsInCycle < 4) {
    phase = 'inhale';
    phaseName = '吸氣（4秒）';
    phaseInstruction = '圓臉化為溫暖的黃光緩緩膨脹，象徵將宇宙的能量與清新空氣吸入體內。';
  } else if (secondsInCycle >= 4 && secondsInCycle < 8) {
    phase = 'hold1';
    phaseName = '憋氣（4秒）';
    phaseInstruction = '光球維持飽滿，臉色因專注與能量凝聚而漸漸漲紅，象徵力量在體內安住、匯聚。';
  } else if (secondsInCycle >= 8 && secondsInCycle < 12) {
    phase = 'exhale';
    phaseName = '吐氣（4秒）';
    phaseInstruction = '光球轉為柔和的粉紅光慢慢縮小，象徵將疲憊與壓力溫柔地釋放出去。';
  } else {
    phase = 'hold2';
    phaseName = '憋氣（4秒）';
    phaseInstruction = '光球維持最小、回歸平靜，顏色回到如首頁圖案顏色，腮紅粉紅，安住於空無一物的當下，準備迎接下一個循環。';
  }

  useEffect(() => {
    if (onPhaseChange) onPhaseChange(phase);
    // 每階段轉換時敲響微弱音效 (若啟用音效)
    if (soundEnabled) {
      if (secondsInCycle === 0) sound.playSingingBowl432(4);
      if (secondsInCycle === 4) sound.playHeartbeat();
      if (secondsInCycle === 8) sound.playSingingBowl528(4);
      if (secondsInCycle === 12) sound.playSparkle();
    }
  }, [phase, secondsInCycle, onPhaseChange, soundEnabled]);

  const sizeClasses = {
    sm: 'w-28 h-28',
    md: 'w-44 h-44 sm:w-52 sm:h-52',
    lg: 'w-56 h-56 sm:w-64 sm:h-64',
  }[size];

  // 依據四個階段動態計算視覺色彩與陰影
  const getOrbVisuals = () => {
    switch (phase) {
      case 'inhale':
        // 吸氣 (4秒)：腮紅為粉紅色，圓臉化為溫暖的黃光緩緩膨脹
        return {
          scale: 1.25,
          bgGradient: 'from-amber-300 via-yellow-200 to-amber-400',
          blushOpacity: 0.6,
          blushColor: '#F472B6',
          glowFilter: 'drop-shadow(0 0 40px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 70px rgba(245, 158, 11, 0.5))',
          textColor: 'text-amber-300',
        };
      case 'hold1':
        // 憋氣 (4秒)：光球維持飽滿，臉色因專注與能量凝聚而漸漸漲紅 (越變越紅)
        return {
          scale: 1.25,
          bgGradient: 'from-rose-400 via-red-300 to-amber-300',
          blushOpacity: 0.95,
          blushColor: '#E11D48',
          glowFilter: 'drop-shadow(0 0 50px rgba(244, 63, 94, 0.85)) drop-shadow(0 0 90px rgba(225, 29, 72, 0.6))',
          textColor: 'text-rose-400',
        };
      case 'exhale':
        // 吐氣 (4秒)：腮紅為粉紅色，光球轉為柔和的粉紅光慢慢縮小
        return {
          scale: 0.95,
          bgGradient: 'from-pink-300 via-rose-200 to-pink-400',
          blushOpacity: 0.6,
          blushColor: '#F472B6',
          glowFilter: 'drop-shadow(0 0 35px rgba(244, 114, 182, 0.8)) drop-shadow(0 0 65px rgba(251, 113, 133, 0.5))',
          textColor: 'text-pink-300',
        };
      case 'hold2':
        // 憋氣 (4秒)：光球維持最小、回歸平靜，腮紅因能量凝聚再度漸漸漲紅 (越變越紅)
        return {
          scale: 0.95,
          bgGradient: 'from-amber-200 via-rose-200 to-indigo-200',
          blushOpacity: 0.95,
          blushColor: '#E11D48',
          glowFilter: 'drop-shadow(0 0 25px rgba(251, 191, 36, 0.45)) drop-shadow(0 0 50px rgba(244, 114, 182, 0.4))',
          textColor: 'text-amber-200',
        };
    }
  };

  const visuals = getOrbVisuals();

  return (
    <div className="flex flex-col items-center justify-center select-none relative my-4">
      {/* 箱型呼吸 4 邊框導引環 */}
      <div className="relative flex items-center justify-center">
        {/* 外圍箱型脈衝光波 */}
        <motion.div
          animate={{
            scale: visuals.scale * 1.15,
            opacity: [0.15, 0.45, 0.15],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className={`absolute rounded-full ${sizeClasses} bg-white/20 blur-2xl pointer-events-none`}
        />

        {/* 閉眼微笑笑臉圓球 (😌) */}
        <motion.div
          animate={{
            scale: visuals.scale,
            filter: visuals.glowFilter,
          }}
          transition={{ duration: 4, ease: 'easeInOut' }}
          className={`relative ${sizeClasses} rounded-full bg-gradient-to-tr ${visuals.bgGradient} flex items-center justify-center cursor-pointer shadow-2xl backdrop-blur-sm transition-colors duration-1000`}
          onClick={() => sound.playHeartbeat()}
        >
          {/* 內層柔光擴散 */}
          <div className="absolute inset-2 rounded-full bg-white/40 blur-sm pointer-events-none" />

          {/* 圓形閉眼笑臉 SVG (安詳無眉，僅眼、腮紅與慈悲微笑) */}
          <svg
            viewBox="0 0 100 100"
            className="w-1/2 h-1/2 text-slate-800/85 drop-shadow-sm z-10 transition-transform duration-700"
          >


            {/* 左眼 (安詳閉目長弧線 ⌒) */}
            <path
              d="M 26 44 Q 34 35 42 44"
              stroke="currentColor"
              strokeWidth="3.2"
              fill="none"
              strokeLinecap="round"
            />
            {/* 右眼 (安詳閉目長弧線 ⌒) */}
            <path
              d="M 58 44 Q 66 35 74 44"
              stroke="currentColor"
              strokeWidth="3.2"
              fill="none"
              strokeLinecap="round"
            />

            {/* 左臉頰腮紅 (吸氣與吐氣為粉紅色，兩個憋氣都越變越紅) */}
            <motion.ellipse
              cx="24"
              cy="52"
              rx="7"
              ry="5"
              animate={{
                fill:
                  phase === 'hold1' || phase === 'hold2'
                    ? ['#F472B6', '#FB7185', '#E11D48', '#BE123C']
                    : '#F472B6',
                opacity:
                  phase === 'hold1' || phase === 'hold2'
                    ? [0.6, 0.78, 0.9, 1]
                    : 0.6,
              }}
              transition={{
                duration: phase === 'hold1' || phase === 'hold2' ? 4 : 1,
                ease: 'easeInOut',
              }}
            />
            {/* 右臉頰腮紅 (吸氣與吐氣為粉紅色，兩個憋氣都越變越紅) */}
            <motion.ellipse
              cx="76"
              cy="52"
              rx="7"
              ry="5"
              animate={{
                fill:
                  phase === 'hold1' || phase === 'hold2'
                    ? ['#F472B6', '#FB7185', '#E11D48', '#BE123C']
                    : '#F472B6',
                opacity:
                  phase === 'hold1' || phase === 'hold2'
                    ? [0.6, 0.78, 0.9, 1]
                    : 0.6,
              }}
              transition={{
                duration: phase === 'hold1' || phase === 'hold2' ? 4 : 1,
                ease: 'easeInOut',
              }}
            />

            {/* 滿足放鬆的慈悲微笑 ‿ */}
            <path
              d="M 36 60 Q 50 72 64 60"
              stroke="currentColor"
              strokeWidth="3.6"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* 頂部微星光亮點 */}
          <div className="absolute top-4 right-7 w-2.5 h-2.5 rounded-full bg-white/95 blur-[0.5px] animate-pulse" />
        </motion.div>
      </div>

      {/* 箱型呼吸階段提示與倒數 */}
      <div className="mt-6 text-center w-full max-w-md px-2">
        {/* 四階段指示器點 (4個循環一列，無小圖示) */}
        <div className="grid grid-cols-4 w-full gap-1.5 sm:gap-2 mb-3">
          <span
            className={`py-1 px-1 rounded-full text-center text-[11px] sm:text-xs font-medium transition-all ${
              phase === 'inhale'
                ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(251,191,36,0.6)] font-bold'
                : 'bg-white/10 text-white/50'
            }`}
          >
            1. 吸氣 4秒
          </span>
          <span
            className={`py-1 px-1 rounded-full text-center text-[11px] sm:text-xs font-medium transition-all ${
              phase === 'hold1'
                ? 'bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)] font-bold'
                : 'bg-white/10 text-white/50'
            }`}
          >
            2. 憋氣 4秒
          </span>
          <span
            className={`py-1 px-1 rounded-full text-center text-[11px] sm:text-xs font-medium transition-all ${
              phase === 'exhale'
                ? 'bg-pink-400 text-slate-950 shadow-[0_0_15px_rgba(244,114,182,0.6)] font-bold'
                : 'bg-white/10 text-white/50'
            }`}
          >
            3. 吐氣 4秒
          </span>
          <span
            className={`py-1 px-1 rounded-full text-center text-[11px] sm:text-xs font-medium transition-all ${
              phase === 'hold2'
                ? 'bg-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.6)] font-bold'
                : 'bg-white/10 text-white/50'
            }`}
          >
            4. 憋氣 4秒
          </span>
        </div>

        <motion.p
          key={phase}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm sm:text-base font-medium tracking-wider ${visuals.textColor}`}
        >
          {phaseName} ── 剩餘 {phaseSecondsLeft} 秒
        </motion.p>

        <p className="text-xs text-amber-100/60 mt-1 tracking-wide leading-relaxed">
          {phaseInstruction}
        </p>
      </div>
    </div>
  );
}
