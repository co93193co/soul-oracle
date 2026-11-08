'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sound } from '@/lib/sound';

export type OrbMode = 'idle' | 'breathing' | 'affirming' | 'transmitting';

interface SmilingCosmicOrbProps {
  mode?: OrbMode;
  guideText?: string;
  subGuideText?: string;
  guideTextClassName?: string;
  themeColor?: 'amber' | 'indigo' | 'rose' | 'purple' | 'teal';
  onOrbClick?: () => void;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  sparkleStyle?: 'original' | 'star' | 'heartCore';
  logoText?: string;
  logoPosition?: 'left' | 'right';
  align?: 'left' | 'center';
  onLogoClick?: () => void;
  className?: string;
}

export default function SmilingCosmicOrb({
  mode = 'idle',
  guideText,
  subGuideText,
  guideTextClassName,
  themeColor = 'amber',
  onOrbClick,
  size = 'md',
  sparkleStyle = 'star',
  logoText,
  logoPosition = 'left',
  align = 'center',
  onLogoClick,
  className = '',
}: SmilingCosmicOrbProps) {
  const handleClick = () => {
    sound.playHeartbeat();
    if (onOrbClick) onOrbClick();
  };

  const handleLogoClick = () => {
    if (onLogoClick) onLogoClick();
  };

  const sizeClasses = {
    xs: 'w-10 h-10 sm:w-12 sm:h-12',
    sm: 'w-[68px] h-[68px] sm:w-[78px] sm:h-[78px]',
    md: 'w-[120px] h-[120px] sm:w-[138px] sm:h-[138px]',
    lg: 'w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52',
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
    <div
      className={`flex flex-col select-none ${
        align === 'left'
          ? 'items-start text-left justify-between'
          : 'items-center justify-between text-center'
      } ${className}`}
    >
      {/* 圓臉圖案與旁邊的 Logo 文字組合 */}
      <div
        className={`flex items-center gap-2.5 sm:gap-3.5 ${
          align === 'left' ? 'justify-start' : 'justify-center'
        }`}
      >
        {/* 旁邊的 Logo 主要名稱 (如：憶起) - 位於左側，全頁字體最大 */}
        {logoText && logoPosition === 'left' && (
          <div
            onClick={handleLogoClick}
            className={`flex flex-col select-none items-center text-center ${
              onLogoClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''
            }`}
          >
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-amber-100 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)] leading-tight text-center">
              {logoText}
            </h1>
            <span className="text-[10px] sm:text-xs text-amber-200/90 font-mono tracking-[0.2em] mt-0.5 text-center">
              ✦ RECALLING ✦
            </span>
            {guideText && (
              <p className="text-[12px] sm:text-[13.5px] md:text-sm text-amber-50/95 font-light tracking-wide mt-1 text-center whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                {guideText}
              </p>
            )}
          </div>
        )}

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

            {/* 呼吸微星光點裝飾：支援 原本 / 方案 A (四芒星) / 方案 C (粉晶心輪) */}
            {sparkleStyle === 'original' && (
              <div className="absolute top-3 right-5 w-2 h-2 rounded-full bg-white/90 blur-[0.5px] animate-ping pointer-events-none" />
            )}

            {sparkleStyle === 'star' && (
              <motion.div
                animate={{
                  scale: [0.95, 1.25, 1.1, 1.3, 0.95],
                  opacity: [0.85, 1, 0.9, 1, 0.85],
                  rotate: [0, 90, 180, 270, 360],
                }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-2 right-4 sm:top-2.5 sm:right-5 pointer-events-none drop-shadow-[0_0_12px_rgba(251,191,36,0.95)] drop-shadow-[0_0_24px_rgba(254,240,138,0.85)]"
              >
                <svg viewBox="0 0 24 24" className="w-6 h-6 sm:w-7 sm:h-7 overflow-visible">
                  <path
                    d="M12 1 C12 7.5 7.5 12 1 12 C7.5 12 12 16.5 12 23 C12 16.5 16.5 12 23 12 C16.5 12 12 7.5 12 1 Z"
                    fill="url(#starGradientV5)"
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="0.6"
                  />
                  {/* 中央高頻微型鑽石核心 */}
                  <circle cx="12" cy="12" r="2.2" fill="#FFFFFF" />
                  <defs>
                    <linearGradient id="starGradientV5" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="50%" stopColor="#FEF08A" />
                      <stop offset="100%" stopColor="#F59E0B" />
                    </linearGradient>
                  </defs>
                </svg>
              </motion.div>
            )}

            {sparkleStyle === 'heartCore' && (
              <motion.div
                animate={{
                  scale: [0.95, 1.25, 1.15, 1.28, 0.95],
                  opacity: [0.75, 1, 0.85, 1, 0.75],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute bottom-2.5 flex items-center justify-center pointer-events-none drop-shadow-[0_0_8px_rgba(244,114,182,0.9)]"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-pink-300 text-pink-300">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* 旁邊的 Logo 主要名稱 (如：憶起) - 位於右側，全頁字體最大 */}
        {logoText && logoPosition === 'right' && (
          <div className="flex flex-col items-center text-center select-none">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-light tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-yellow-300 drop-shadow-[0_0_25px_rgba(251,191,36,0.5)] leading-tight text-center">
              {logoText}
            </h1>
            <span className="text-[10px] sm:text-xs text-amber-200/90 font-mono tracking-[0.2em] mt-0.5 text-center">
              ✦ RECALLING ✦
            </span>
            {guideText && (
              <p className="text-[12px] sm:text-[13.5px] md:text-sm text-amber-50/95 font-light tracking-wide mt-1 text-center whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]">
                {guideText}
              </p>
            )}
          </div>
        )}
      </div>

      {/* 呼吸或肯定句引導小字 (無 logoText 時於光球下方顯示) */}
      {!logoText && (guideText || mode !== 'idle') && (
        <AnimatePresence mode="wait">
          <motion.div
            key={guideText || mode}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.6 }}
            className={`mt-1.5 sm:mt-2 w-full flex flex-col items-center justify-center ${
              align === 'left' ? 'text-left max-w-full' : 'text-center max-w-full px-1'
            }`}
          >
            <p className={guideTextClassName || "text-amber-50/95 text-[13px] sm:text-[15px] md:text-base font-light tracking-wide leading-relaxed whitespace-pre-line drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"}>
              {guideText ||
                (mode === 'breathing'
                  ? '深呼吸... 感受宇宙的心跳與接納'
                  : mode === 'affirming'
                  ? '在心中默念這份肯定，對齊豐盛頻率'
                  : '允許自己成為自己')}
            </p>
            {subGuideText && (
              <span className="text-[10px] sm:text-[11.5px] text-amber-300 font-medium block mt-1 tracking-wider whitespace-nowrap drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]">
                {subGuideText}
              </span>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
