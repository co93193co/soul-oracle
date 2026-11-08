'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Wind, CheckCircle2 } from 'lucide-react';
import SmilingCosmicOrb from '@/components/shared/SmilingCosmicOrb';
import OracleCard from '@/components/shared/OracleCard';
import HooponoponoCleansingModal from './HooponoponoCleansingModal';
import { getRandomCard, OracleCardData } from '@/lib/presets/cardsData';
import { sound } from '@/lib/sound';
import { localStore } from '@/lib/storage';

interface ReleaseSanctuaryProps {
  onBack: () => void;
  onOpenArchive: () => void;
  onPointsUpdated?: (newPoints: number) => void;
}

const MOOD_TAGS = [
  '迷茫焦慮',
  '心力交瘁',
  '關係卡關',
  '自我懷疑',
  '憤怒委屈',
  '悲傷失落',
  '執著過去',
  '渴望理解',
  '金錢匱乏',
  '習慣討好',
];

export default function ReleaseSanctuary({ onBack, onOpenArchive, onPointsUpdated }: ReleaseSanctuaryProps) {
  const [step, setStep] = useState<'input' | 'dissolving' | 'breathing' | 'revealing'>('input');
  const [mood, setMood] = useState(MOOD_TAGS[0]);
  const [inputText, setInputText] = useState('');
  const [universeReply, setUniverseReply] = useState('');
  const [drawnCard, setDrawnCard] = useState<OracleCardData | null>(null);
  const [breathText, setBreathText] = useState('深吸一口氣... 吸入平靜');
  const [isCleansingOpen, setIsCleansingOpen] = useState(false);

  const handleRelease = async () => {
    // 支援直接點選標籤放手，或書寫文字後放手
    const finalContent = inputText.trim() || `此刻內在的感受：${mood}`;

    // 1. 播放 432Hz 接地磬聲
    sound.playSingingBowl432();
    setStep('dissolving');

    // 2. 挑選一張解憂覺察卡
    const card = getRandomCard('release');
    setDrawnCard(card);

    // 3. 在背景呼叫 AI API
    const apiPromise = fetch('/api/universe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'release', input: finalContent, tag: mood }),
    })
      .then((res) => res.json())
      .catch(() => ({ reply: '宇宙已全然聽見你的心事，在無條件的愛中，答案已靜靜來到...' }));

    // 4. 文字消散 1.2 秒後進入 4-4 呼吸調頻階段
    setTimeout(() => {
      setStep('breathing');
      setBreathText('深吸一口氣... 吸入宇宙的平靜與理解');

      setTimeout(() => {
        sound.playHeartbeat();
        setBreathText('屏息停留... 感受心口當下的溫度');
      }, 3500);

      setTimeout(() => {
        setBreathText('緩緩吐氣... 放下所有的緊抓與擔憂');
      }, 5500);

      // 5. 呼吸完成後揭曉宇宙信件與卡片
      setTimeout(async () => {
        const data = await apiPromise;
        const replyText = data.reply || '';
        setUniverseReply(replyText);

        // 存入本機歷史紀錄
        localStore.saveInquiry({
          moodTag: mood,
          journalText: finalContent,
          universeReply: replyText,
          card,
        });

        sound.playSparkle();
        setStep('revealing');
      }, 8500);
    }, 1400);
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center px-3 sm:px-4 py-2 sm:py-3 relative">
      {/* 頂部返回與狀態欄 (極簡緊湊，圓臉往上移) */}
      <div className="w-full flex justify-between items-center mb-2 sm:mb-2.5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-amber-200/80 hover:text-amber-100 transition-colors py-1 px-3 rounded-full bg-white/5 border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回殿堂</span>
        </button>
        <span className="text-xs tracking-widest text-indigo-300 font-light flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-indigo-400" />
          🌙 釋放之門 ‧ 放手清理
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* ================= 階段一：心事書寫 ================= */}
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col items-center"
          >
            {/* 圓臉微幅往上移動、整體高度緊緻 */}
            <div className="mb-2 sm:mb-2.5 w-full flex justify-center">
              <SmilingCosmicOrb
                size="sm"
                themeColor="indigo"
                sparkleStyle="original"
                guideText="將心事 疑惑 恐懼 交付宇宙，在這，你被全然包容，允許放手"
                guideTextClassName="text-[11px] xs:text-[11.5px] sm:text-[13px] md:text-sm text-amber-50/95 font-light tracking-tight sm:tracking-normal whitespace-nowrap drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] text-center select-none"
              />
            </div>

            {/* 心情標籤選擇 (定案：固定橫排 5×2，共2行，每行5個，左右完全對齊) */}
            <div className="w-full mb-2 sm:mb-2.5">
              {/* 「點選...」放在「此刻...」的下一行，分層清晰，字體加大清晰更舒適 */}
              <div className="flex flex-col items-center sm:items-start mb-2 px-0.5">
                <label className="text-[13.5px] xs:text-[14px] sm:text-base font-bold text-amber-100 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] whitespace-nowrap">
                  此刻內心最貼近的感受
                </label>
                <span className="text-[11.5px] xs:text-[12px] sm:text-[13px] text-indigo-200 font-medium tracking-wide mt-0.5 whitespace-nowrap">
                  ✦ 點選感受即可一鍵放手，無須打字 ✦
                </span>
              </div>

              {/* 橫排 5 各 1 行 (共2排，每排5個) */}
              <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                {MOOD_TAGS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      sound.playSparkle();
                      setMood(t);
                    }}
                    className={`w-full py-2 sm:py-2.5 px-0.5 rounded-xl transition-all cursor-pointer flex items-center justify-center text-center ${
                      mood === t
                        ? 'bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 text-white font-bold shadow-[0_0_14px_rgba(99,102,241,0.7)] border border-indigo-200 scale-[1.02] z-10'
                        : 'bg-white/12 text-amber-50 hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/35 font-medium shadow-sm'
                    }`}
                  >
                    <span className="text-[11.5px] xs:text-[12px] sm:text-[13px] tracking-tight font-semibold whitespace-nowrap drop-shadow-sm select-none">
                      {t}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 中間書寫文字框：右側自訂紫色光感上下滾輪，方便寫長文滾動 */}
            <div className="w-full relative mb-2.5 sm:mb-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={3}
                placeholder="（選填）寫下任何卡住的情緒、疲憊念頭或委屈... 亦可直接點選上方感受，一鍵交給宇宙放手"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(129, 140, 248, 0.7) rgba(15, 23, 42, 0.45)',
                }}
                className="w-full h-20 sm:h-24 rounded-2xl bg-black/45 border border-indigo-400/35 p-3 pr-4 text-amber-50 placeholder-amber-200/40 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 backdrop-blur-md text-xs sm:text-sm resize-none shadow-inner leading-relaxed overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-black/40 [&::-webkit-scrollbar-track]:rounded-r-2xl [&::-webkit-scrollbar-thumb]:bg-indigo-500/70 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb:hover]:bg-indigo-400"
              />
              <span className="absolute bottom-2 right-3 text-[10px] sm:text-[11px] text-amber-200/40 select-none pointer-events-none">
                {inputText.length > 0 ? `${inputText.length} 字` : '已選定感受，可直接交託'}
              </span>
            </div>

            {/* 放手按鈕 (永遠可點選，有寫字或直接點標籤皆能一鍵放手) */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleRelease}
              className="w-full py-3 sm:py-3.5 rounded-xl flex items-center justify-center gap-2 font-medium tracking-wider text-xs sm:text-sm transition-all shadow-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-300/40 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>交給宇宙並放手</span>
            </motion.button>

            {/* 夏威夷零極限清理之門入口 (加大、加亮、高對比醒目呈現) */}
            <div className="w-full mt-2.5 sm:mt-3 text-center">
              <button
                type="button"
                onClick={() => {
                  sound.playSparkle();
                  setIsCleansingOpen(true);
                }}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-gradient-to-r from-teal-500/25 via-cyan-500/30 to-teal-500/25 hover:from-teal-500/40 hover:via-cyan-500/45 hover:to-teal-500/40 border-2 border-teal-300/60 hover:border-teal-200 text-teal-100 hover:text-white text-xs sm:text-sm font-semibold tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(20,184,166,0.35)] hover:shadow-[0_0_28px_rgba(20,184,166,0.6)] hover:scale-[1.02] active:scale-[0.98] group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-teal-300 animate-pulse group-hover:rotate-12 transition-transform" />
                <span className="whitespace-nowrap">請點擊「清理之門」‧ 夏威夷零極限和解 ➔</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* ================= 階段二：星塵消散動畫 ================= */}
        {step === 'dissolving' && (
          <motion.div
            key="dissolving"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="w-full flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.div
              animate={{ y: -40, opacity: [1, 0.4, 0] }}
              transition={{ duration: 1.2 }}
              className="text-amber-200/80 text-base tracking-widest font-light"
            >
              ✧ {inputText.trim() ? '心事化作星塵' : `「${mood}」化作星塵`}，回歸浩瀚虛空 ✧
            </motion.div>
            <div className="flex gap-1.5 mt-4">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping delay-150" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping delay-300" />
            </div>
          </motion.div>
        )}

        {/* ================= 階段三：4-4 呼吸調頻冥想 ================= */}
        {step === 'breathing' && (
          <motion.div
            key="breathing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center justify-center py-12"
          >
            <SmilingCosmicOrb
              mode="breathing"
              size="lg"
              themeColor="indigo"
              sparkleStyle="original"
              guideText={breathText}
            />
            <p className="mt-8 text-xs text-amber-200/50 tracking-widest uppercase">
              Sacred Heart Resonance 432 Hz
            </p>
          </motion.div>
        )}

        {/* ================= 階段四：接收回信與抽卡揭曉 ================= */}
        {step === 'revealing' && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center gap-8"
          >
            {/* 宇宙智者回信卡片 */}
            <div className="w-full p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#161a38]/90 via-[#0e122b]/90 to-[#070919]/90 border border-indigo-400/40 shadow-2xl backdrop-blur-xl relative">
              <div className="flex items-center gap-2 mb-4 text-indigo-300 text-xs tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>🌌 宇宙智者的溫暖回信</span>
              </div>
              <p className="text-amber-50/95 text-sm sm:text-base leading-relaxed font-light whitespace-pre-line tracking-wide">
                {universeReply}
              </p>
            </div>

            {/* 呼應抽取到的解憂覺察卡 */}
            {drawnCard && (
              <div className="w-full flex flex-col items-center">
                <p className="text-xs text-amber-200/70 tracking-widest mb-4">
                  ✦ 宇宙呼應此心事的命定覺察卡 ✦
                </p>
                <OracleCard card={drawnCard} />
              </div>
            )}

            {/* 請點擊清理之門 */}
            <div className="w-full text-center py-2">
              <button
                type="button"
                onClick={() => {
                  sound.playSparkle();
                  setIsCleansingOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-teal-500/20 via-cyan-500/25 to-teal-500/20 border border-teal-300/50 hover:border-teal-200 text-teal-100 text-xs sm:text-sm tracking-wider transition-all shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:scale-[1.02] cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
                <span>🌊 請點擊「清理之門」‧ 夏威夷零極限和解 ➔</span>
              </button>
            </div>

            {/* 底部操作 */}
            <div className="w-full flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => {
                  setInputText('');
                  setStep('input');
                }}
                className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 text-xs tracking-wider border border-white/10 transition-colors"
              >
                再次放手清理
              </button>
              <button
                onClick={onOpenArchive}
                className="flex-1 py-3.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs tracking-wider border border-indigo-400/40 shadow-lg transition-all"
              >
                前往星空信箱查看紀錄
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 夏威夷零極限 ‧ 清理之門獨立彈窗 */}
      <HooponoponoCleansingModal
        isOpen={isCleansingOpen}
        onClose={() => setIsCleansingOpen(false)}
        onPointsUpdated={onPointsUpdated}
      />
    </div>
  );
}
