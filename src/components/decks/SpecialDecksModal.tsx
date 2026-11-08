'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Star, Lock, Heart, RefreshCw } from 'lucide-react';
import { getRandomUnicornCard, UnicornCardData } from '@/lib/presets/unicornCards';
import { getRandomCosmicOneLiner, CosmicOneLinerCard } from '@/lib/presets/cosmicOneLiners';
import { sound } from '@/lib/sound';
import { localStore } from '@/lib/storage';

interface SpecialDecksModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPoints: number;
  onPointsUpdated: (newPoints: number) => void;
  onOpenMeditation: () => void;
}

const COST_PER_DRAW = 5;

export default function SpecialDecksModal({
  isOpen,
  onClose,
  currentPoints,
  onPointsUpdated,
  onOpenMeditation,
}: SpecialDecksModalProps) {
  const [activeDeck, setActiveDeck] = useState<'unicorn' | 'cosmic'>('unicorn');
  const [drawnUnicorn, setDrawnUnicorn] = useState<UnicornCardData | null>(null);
  const [drawnCosmic, setDrawnCosmic] = useState<CosmicOneLinerCard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [notEnoughPoints, setNotEnoughPoints] = useState(false);

  const handleDraw = (deckType: 'unicorn' | 'cosmic') => {
    // 檢查點數
    const success = localStore.deductPoints(COST_PER_DRAW);
    if (!success) {
      setNotEnoughPoints(true);
      return;
    }

    setNotEnoughPoints(false);
    onPointsUpdated(localStore.getPoints());

    if (deckType === 'unicorn') {
      sound.playSingingBowl528();
      const card = getRandomUnicornCard();
      setDrawnUnicorn(card);
      setDrawnCosmic(null);
    } else {
      sound.playSingingBowl432();
      const card = getRandomCosmicOneLiner();
      setDrawnCosmic(card);
      setDrawnUnicorn(null);
    }

    setIsFlipped(false);
    setTimeout(() => {
      setIsFlipped(true);
      sound.playSparkle();
    }, 600);
  };

  const handleResetDraw = () => {
    setDrawnUnicorn(null);
    setDrawnCosmic(null);
    setIsFlipped(false);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-xl max-h-[90vh] rounded-3xl bg-gradient-to-b from-[#16122a] via-[#0f0e20] to-[#070712] border border-amber-300/30 p-5 sm:p-7 flex flex-col shadow-2xl relative text-amber-50 overflow-y-auto"
        >
          {/* 關閉按鈕 */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-amber-200/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 頂部資訊與點數餘額 */}
          <div className="text-center mb-6">
            <span className="text-[11px] text-amber-300 tracking-widest uppercase block mb-1">
              Divine Oracle Sanctuary
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>靈魂專屬牌卡館</span>
            </h2>

            {/* 點數餘額 */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-300/30 text-amber-200 text-xs tracking-wider mt-3">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>心靈星光餘額：{currentPoints} 點 (每次抽取扣除 {COST_PER_DRAW} 點)</span>
            </div>
          </div>

          {/* 點數不足提示 */}
          {notEnoughPoints && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 rounded-2xl bg-rose-950/60 border border-rose-400/40 text-center text-xs text-rose-200 space-y-2"
            >
              <p>心靈星光點數不足（尚需 {COST_PER_DRAW} 點），你可以：</p>
              <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onOpenMeditation();
                  }}
                  className="py-1.5 px-3 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium"
                >
                  🧘 前往每日冥想免費賺取點數
                </button>
                <button
                  onClick={() => {
                    localStore.addPoints(365);
                    onPointsUpdated(localStore.getPoints());
                    setNotEnoughPoints(false);
                    sound.playSingingBowl528();
                  }}
                  className="py-1.5 px-3 rounded-lg bg-amber-400 text-slate-950 text-xs font-semibold"
                >
                  🌟 領取星光福袋 (+365 點)
                </button>
              </div>
            </motion.div>
          )}

          {/* 兩套專屬牌卡切換 Tabs */}
          {!drawnUnicorn && !drawnCosmic && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 🦄 獨角獸牌卡 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDraw('unicorn')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-purple-950/70 via-pink-950/50 to-slate-950/80 border border-pink-400/40 hover:border-pink-300 shadow-xl cursor-pointer flex flex-col justify-between text-left group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-pink-500/20 border border-pink-400/30 flex items-center justify-center text-pink-300 mb-3 group-hover:scale-110 transition-transform text-lg">
                      🦄
                    </div>
                    <span className="text-[10px] text-pink-300/80 tracking-widest block uppercase">
                      Unicorn Miracles
                    </span>
                    <h3 className="text-lg font-light text-white mb-1.5">魔法獨角獸指引卡</h3>
                    <p className="text-xs text-pink-200/70 leading-relaxed font-light">
                      連結純真與奇蹟的高頻光體，為靈魂召喚、心輪療癒與純淨願望提供溫柔指引。
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-pink-300 font-medium">
                    <span>消耗 {COST_PER_DRAW} 點心靈星光</span>
                    <span className="group-hover:translate-x-1 transition-transform">抽取啟示 ➔</span>
                  </div>
                </motion.div>

                {/* 🌌 宇宙給你的一句話 */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleDraw('cosmic')}
                  className="p-5 rounded-2xl bg-gradient-to-b from-indigo-950/70 via-slate-900/60 to-slate-950/80 border border-indigo-400/40 hover:border-indigo-300 shadow-xl cursor-pointer flex flex-col justify-between text-left group"
                >
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 mb-3 group-hover:scale-110 transition-transform text-lg">
                      🌌
                    </div>
                    <span className="text-[10px] text-indigo-300/80 tracking-widest block uppercase">
                      Cosmic Whisper
                    </span>
                    <h3 className="text-lg font-light text-white mb-1.5">宇宙給你的一句話</h3>
                    <p className="text-xs text-indigo-200/70 leading-relaxed font-light">
                      直擊心靈核心的宏大視角，一句破除思維牢籠的頓悟金句，讓能量瞬間歸於平靜。
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-indigo-300 font-medium">
                    <span>消耗 {COST_PER_DRAW} 點心靈星光</span>
                    <span className="group-hover:translate-x-1 transition-transform">抽取金句 ➔</span>
                  </div>
                </motion.div>
              </div>
            </div>
          )}

          {/* 牌卡翻開展示區 */}
          {(drawnUnicorn || drawnCosmic) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-2"
            >
              {/* 獨角獸卡面 */}
              {drawnUnicorn && (
                <div className="w-full max-w-[320px] rounded-3xl p-6 bg-gradient-to-b from-[#2a1338] via-[#1a0c24] to-[#0d0614] border border-pink-400/60 shadow-[0_0_35px_rgba(244,114,182,0.3)] flex flex-col justify-between text-center relative overflow-hidden">
                  <div className="text-xs tracking-widest text-pink-300 flex justify-between items-center mb-4">
                    <span>🦄 獨角獸高頻指引</span>
                    <span className="font-mono">{drawnUnicorn.code}</span>
                  </div>

                  <div className="my-6">
                    <span className="text-xs px-3 py-1 rounded-full bg-pink-400/20 border border-pink-300/30 text-pink-200">
                      {drawnUnicorn.theme}
                    </span>
                    <h3 className="text-2xl font-light text-white mt-4 mb-3">
                      {drawnUnicorn.title}
                    </h3>
                    <p className="text-base text-pink-100 font-light leading-relaxed border-y border-pink-400/20 py-4 my-2">
                      「{drawnUnicorn.quote}」
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-left text-xs text-pink-200/90 leading-relaxed font-light">
                    <span className="text-pink-300 font-medium block mb-1">✧ 獨角獸光之叮嚀：</span>
                    {drawnUnicorn.guidance}
                  </div>
                </div>
              )}

              {/* 宇宙一句話卡面 */}
              {drawnCosmic && (
                <div className="w-full max-w-[320px] rounded-3xl p-6 bg-gradient-to-b from-[#131b38] via-[#0c1226] to-[#070914] border border-indigo-400/60 shadow-[0_0_35px_rgba(129,140,248,0.3)] flex flex-col justify-between text-center relative overflow-hidden">
                  <div className="text-xs tracking-widest text-indigo-300 flex justify-between items-center mb-4">
                    <span>🌌 宇宙給你的一句話</span>
                    <span className="font-mono">{drawnCosmic.code}</span>
                  </div>

                  <div className="my-8">
                    <span className="text-xs px-3 py-1 rounded-full bg-indigo-400/20 border border-indigo-300/30 text-indigo-200">
                      {drawnCosmic.vibe}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-light text-white mt-6 mb-4 leading-relaxed tracking-wider border-y border-indigo-400/20 py-5">
                      「{drawnCosmic.quote}」
                    </h3>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-left text-xs text-indigo-200/90 leading-relaxed font-light">
                    <span className="text-indigo-300 font-medium block mb-1">✧ 宇宙的深意：</span>
                    {drawnCosmic.subtext}
                  </div>
                </div>
              )}

              {/* 重新抽卡按鈕 */}
              <div className="flex gap-3 mt-6 w-full max-w-[320px]">
                <button
                  onClick={handleResetDraw}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 text-xs tracking-wider border border-white/10 transition-colors flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>更換牌卡類別</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-amber-400/90 hover:bg-amber-400 text-slate-950 font-medium text-xs tracking-wider transition-all"
                >
                  收下這份指引
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
