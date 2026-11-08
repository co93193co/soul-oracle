'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/lib/sound';

export type OrbMode = 'idle' | 'breathing' | 'affirming' | 'transmitting';

interface SmilingCosmicOrbProps {
  mode?: OrbMode;
  guideText?: string;
  themeColor?: 'amber' | 'indigo' | 'rose' | 'purple' | 'teal';
  onOrbClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  logoText?: string;
}

export default function SmilingCosmicOrb({
  mode = 'idle',
  guideText,
  themeColor = 'amber',
  onOrbClick,
  size = 'md',
  logoText,
}: SmilingCosmicOrbProps) {
  const handleClick = () => {
    sound.playHeartbeat();
    if (onOrbClick) onOrbClick();
  };

  const sizeClasses = {
    sm: 'w-20 h-20 sm:w-24 sm:h-24',
    md: 'w-24 h-24 sm:w-36 sm:h-36 md:w-44 md:h-44',
    lg: 'w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56',
  }[size];

  // 顏色與漸變配置
  const gradientStyles = {
    amber: 'from-amber-200 via-yellow-100 to-amber-300',
    indigo: 'from-indigo-300 via-purple-200 to-sky-200',
    rose: 'from-pink-300 via-rose-200 to-pink-200',
    purple: 'from-purple-300 via-pink-200 to-indigo-200',
    teal: 'from-teal-300 via-cyan-200 to-emerald-200',
  }[themeColor];

  const glowColors = {
    amber: [
      'drop-shadow(0 0 25px rgba(251, 191, 36, 0.55)) drop-shadow(0 0 50px rgba(234, 179, 8, 0.45))',
      'drop-shadow(0 0 45px rgba(251, 191, 36, 0.85)) drop-shadow(0 0 80px rgba(234, 179, 8, 0.7))',
      'drop-shadow(0 0 30px rgba(251, 191, 36, 0.6)) drop-shadow(0 0 55px rgba(234, 179, 8, 0.5))',
      'drop-shadow(0 0 25px rgba(251, 191, 36, 0.55)) drop-shadow(0 0 50px rgba(234, 179, 8, 0.45))',
    ],
    indigo: [
      'drop-shadow(0 0 25px rgba(129, 140, 248, 0.45)) drop-shadow(0 0 50px rgba(168, 85, 247, 0.4))',
      'drop-shadow(0 0 45px rgba(129, 140, 248, 0.75)) drop-shadow(0 0 80px rgba(168, 85, 247, 0.6))',
      'drop-shadow(0 0 30px rgba(129, 140, 248, 0.5)) drop-shadow(0 0 55px rgba(168, 85, 247, 0.45))',
      'drop-shadow(0 0 25px rgba(129, 140, 248, 0.45)) drop-shadow(0 0 50px rgba(168, 85, 247, 0.4))',
    ],
    rose: [
      'drop-shadow(0 0 25px rgba(244, 114, 182, 0.55)) drop-shadow(0 0 50px rgba(251, 113, 133, 0.45))',
      'drop-shadow(0 0 45px rgba(244, 114, 182, 0.85)) drop-shadow(0 0 80px rgba(251, 113, 133, 0.7))',
      'drop-shadow(0 0 30px rgba(244, 114, 182, 0.6)) drop-shadow(0 0 55px rgba(251, 113, 133, 0.5))',
      'drop-shadow(0 0 25px rgba(244, 114, 182, 0.55)) drop-shadow(0 0 50px rgba(251, 113, 133, 0.45))',
    ],
    purple: [
      'drop-shadow(0 0 25px rgba(168, 85, 247, 0.45)) drop-shadow(0 0 50px rgba(236, 72, 153, 0.4))',
      'drop-shadow(0 0 45px rgba(168, 85, 247, 0.75)) drop-shadow(0 0 80px rgba(236, 72, 153, 0.6))',
      'drop-shadow(0 0 30px rgba(168, 85, 247, 0.5)) drop-shadow(0 0 55px rgba(236, 72, 153, 0.45))',
      'drop-shadow(0 0 25px rgba(168, 85, 247, 0.45)) drop-shadow(0 0 50px rgba(236, 72, 153, 0.4))',
    ],
    teal: [
      'drop-shadow(0 0 25px rgba(20, 184, 166, 0.45)) drop-shadow(0 0 50px rgba(52, 211, 153, 0.4))',
      'drop-shadow(0 0 45px rgba(20, 184, 166, 0.75)) drop-shadow(0 0 80px rgba(52, 211, 153, 0.6))',
      'drop-shadow(0 0 30px rgba(20, 184, 166, 0.5)) drop-shadow(0 0 55px rgba(52, 211, 153, 0.45))',
      'drop-shadow(0 0 25px rgba(20, 184, 166, 0.45)) drop-shadow(0 0 50px rgba(52, 211, 153, 0.4))',
    ],
  }[themeColor];

  return (
    <div className="flex flex-col items-center justify-center select-none">
      {/* 圓臉圖案與旁邊的 Logo 文字組合 */}
      <div className="flex items-center justify-center gap-3 sm:gap-4">
        <div className="relative flex items-center justify-center">
          {/* 光暈外層波紋 (心跳共鳴時向外擴散) */}
          <motion.div
            animate={{
              scale: mode === 'breathing' ? [1, 1.45, 1] : [1, 1.25, 1],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: mode === 'breathing' ? 8 : 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`absolute rounded-full ${sizeClasses} bg-white/20 blur-xl pointer-events-none`}
          />

          {/* 微笑光球主體 */}
          <motion.div
            onClick={handleClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              scale:
                mode === 'breathing'
                  ? [1, 1.2, 1.15, 1] // 吸氣 4s -> 微心跳 1s -> 呼氣 3s
                  : mode === 'affirming'
                  ? [1, 1.12, 1.08, 1]
                  : [1, 1.08, 1.04, 1],
              filter: glowColors,
            }}
            transition={{
              duration: mode === 'breathing' ? 8 : 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className={`relative ${sizeClasses} rounded-full bg-gradient-to-tr ${gradientStyles} flex items-center justify-center cursor-pointer shadow-2xl backdrop-blur-sm`}
          >
            {/* 內核柔白光心 */}
            <div className="absolute inset-2 rounded-full bg-white/35 blur-sm" />

            {/* 極簡神聖微笑 SVG */}
            <svg
              viewBox="0 0 100 100"
              className="w-1/2 h-1/2 text-slate-700/80 drop-shadow-sm z-10 transition-transform duration-700"
            >
              {/* 左眼 (安詳垂閉之眼 ⌒) */}
              <path
                d="M 28 42 Q 35 33 42 42"
                stroke="currentColor"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />
              {/* 右眼 (安詳垂閉之眼 ⌒) */}
              <path
                d="M 58 42 Q 65 33 72 42"
                stroke="currentColor"
                strokeWidth="3.2"
                fill="none"
                strokeLinecap="round"
              />
              {/* 左臉頰腮紅 */}
              <ellipse
                cx="24"
                cy="51"
                rx="6.5"
                ry="4.5"
                fill="#F472B6"
                opacity="0.55"
              />
              {/* 右臉頰腮紅 */}
              <ellipse
                cx="76"
                cy="51"
                rx="6.5"
                ry="4.5"
                fill="#F472B6"
                opacity="0.55"
              />

              {/* 溫潤慈悲微笑弧度 ‿ */}
              <motion.path
                animate={{
                  d:
                    mode === 'breathing'
                      ? 'M 35 60 Q 50 74 65 60'
                      : 'M 36 60 Q 50 70 64 60',
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                stroke="currentColor"
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </svg>

            {/* 呼吸微星光點裝飾 */}
            <div className="absolute top-3 right-5 w-2 h-2 rounded-full bg-white/90 blur-[0.5px] animate-ping" />
          </motion.div>
        </div>

        {/* 旁邊的 Logo 主要名稱 (如：憶起) */}
        {logoText && (
          <div className="flex flex-col items-start text-left select-none">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-300 drop-shadow-[0_0_20px_rgba(251,191,36,0.35)] leading-tight">
              {logoText}
            </h1>
            <span className="text-[10px] sm:text-xs text-amber-300/70 font-mono tracking-widest mt-0.5">
              ✦ RECALL ✦
            </span>
          </div>
        )}
      </div>

      {/* 呼吸或肯定句引導小字 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={guideText || mode}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.6 }}
          className="mt-1 sm:mt-3 text-center max-w-sm px-2"
        >
          <p className="text-amber-100/90 text-[10.5px] sm:text-xs md:text-sm font-light tracking-wide whitespace-nowrap leading-tight">
            {guideText ||
              (mode === 'breathing'
                ? '深呼吸... 感受宇宙的心跳與接納'
                : mode === 'affirming'
                ? '在心中默念這份肯定，對齊豐盛頻率'
                : '宇宙正溫柔地微笑著看著你')}
          </p>
          <span className="text-[9px] sm:text-[10px] text-amber-200/50 block mt-0.5 tracking-wider">
            (點擊光球可感受平靜心跳)
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
