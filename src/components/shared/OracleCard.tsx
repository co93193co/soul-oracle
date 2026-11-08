'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Moon, Sun, Bookmark } from 'lucide-react';
import { OracleCardData } from '@/lib/presets/cardsData';
import { sound } from '@/lib/sound';

interface OracleCardProps {
  card: OracleCardData;
  isInitiallyRevealed?: boolean;
  onReveal?: () => void;
}

export default function OracleCard({
  card,
  isInitiallyRevealed = false,
  onReveal,
}: OracleCardProps) {
  const [isFlipped, setIsFlipped] = useState(isInitiallyRevealed);

  const handleCardClick = () => {
    if (!isFlipped) {
      sound.playSingingBowl432();
      setIsFlipped(true);
      if (onReveal) onReveal();
    } else {
      sound.playSparkle();
    }
  };

  const isRelease = card.deckType === 'release';

  return (
    <div
      onClick={handleCardClick}
      className="w-full max-w-[320px] sm:max-w-[340px] h-[480px] sm:h-[500px] cursor-pointer perspective-1000 mx-auto select-none"
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.85, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: 'preserve-3d' }}
        className="w-full h-full relative rounded-2xl shadow-2xl transition-shadow hover:shadow-[0_0_35px_rgba(251,191,36,0.35)]"
      >
        {/* ================= 牌卡背面 (未翻開) ================= */}
        <div
          style={{ backfaceVisibility: 'hidden' }}
          className="absolute inset-0 w-full h-full rounded-2xl p-6 bg-gradient-to-b from-[#111633] via-[#0b0e24] to-[#070a1a] border border-amber-300/30 flex flex-col items-center justify-between overflow-hidden"
        >
          {/* 金色神聖幾何邊框 */}
          <div className="absolute inset-2 border border-amber-300/20 rounded-xl pointer-events-none" />
          <div className="absolute inset-3 border border-amber-300/10 rounded-lg pointer-events-none" />

          {/* 四角星紋 */}
          <div className="w-full flex justify-between items-center text-amber-300/40 text-xs tracking-widest">
            <span>✧ SOUL ORACLE ✧</span>
            <span>{isRelease ? '🌙 釋放' : '☀️ 顯化'}</span>
          </div>

          {/* 中央神秘徽章 */}
          <div className="relative flex flex-col items-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="w-28 h-28 rounded-full border border-dashed border-amber-300/30 flex items-center justify-center"
            >
              <div className="w-20 h-20 rounded-full border border-amber-300/40 flex items-center justify-center bg-amber-400/5">
                {isRelease ? (
                  <Moon className="w-8 h-8 text-indigo-300 animate-pulse" />
                ) : (
                  <Sun className="w-8 h-8 text-amber-300 animate-pulse" />
                )}
              </div>
            </motion.div>
            <p className="mt-6 text-amber-100/80 tracking-widest text-sm font-light">
              宇宙在此刻為你揀選
            </p>
            <span className="text-xs text-amber-300/60 mt-1">點擊卡片翻開啟示 ✨</span>
          </div>

          <div className="w-full text-center text-[11px] text-amber-200/30 tracking-widest uppercase">
            Trust The Divine Timing
          </div>
        </div>

        {/* ================= 牌卡正面 (已翻開) ================= */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
          className={`absolute inset-0 w-full h-full rounded-2xl p-6 bg-gradient-to-b ${card.colorGradient} border border-amber-300/50 flex flex-col justify-between overflow-hidden shadow-inner text-amber-50`}
        >
          {/* 細緻內飾框 */}
          <div className="absolute inset-2 border border-amber-200/20 rounded-xl pointer-events-none" />

          {/* 卡片頂部資訊 */}
          <div className="flex justify-between items-center text-xs tracking-wider z-10">
            <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-amber-200">
              {card.category}
            </span>
            <span className="text-amber-200/60 font-mono text-xs">{card.code}</span>
          </div>

          {/* 卡片中央核心金句 */}
          <div className="my-auto text-center flex flex-col items-center px-2 z-10">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center mb-4 text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xl sm:text-2xl font-normal tracking-wide text-amber-100 mb-4 drop-shadow">
              {card.title}
            </h3>
            <p className="text-base sm:text-lg font-light text-amber-50/95 leading-relaxed tracking-wider border-y border-amber-200/20 py-4 my-2">
              「{card.quote}」
            </p>
          </div>

          {/* 卡片底部延伸覺察指引 */}
          <div className="z-10 bg-black/30 backdrop-blur-md rounded-xl p-3.5 border border-white/10 text-left">
            <p className="text-xs sm:text-[13px] text-amber-100/90 leading-relaxed font-light">
              <span className="text-amber-300 font-medium mr-1">✦ 覺察小練習：</span>
              {card.guide}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
