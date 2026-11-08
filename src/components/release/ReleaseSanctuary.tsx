'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Wind, CheckCircle2 } from 'lucide-react';
import SmilingCosmicOrb from '@/components/shared/SmilingCosmicOrb';
import OracleCard from '@/components/shared/OracleCard';
import { getRandomCard, OracleCardData } from '@/lib/presets/cardsData';
import { sound } from '@/lib/sound';
import { localStore } from '@/lib/storage';

interface ReleaseSanctuaryProps {
  onBack: () => void;
  onOpenArchive: () => void;
}

const MOOD_TAGS = ['迷茫焦慮', '心力交瘁', '關係卡關', '自我懷疑', '憤怒委屈', '需要指引'];

export default function ReleaseSanctuary({ onBack, onOpenArchive }: ReleaseSanctuaryProps) {
  const [step, setStep] = useState<'input' | 'dissolving' | 'breathing' | 'revealing'>('input');
  const [mood, setMood] = useState(MOOD_TAGS[0]);
  const [inputText, setInputText] = useState('');
  const [universeReply, setUniverseReply] = useState('');
  const [drawnCard, setDrawnCard] = useState<OracleCardData | null>(null);
  const [breathText, setBreathText] = useState('深吸一口氣... 吸入平靜');

  const handleRelease = async () => {
    if (!inputText.trim()) return;

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
      body: JSON.stringify({ mode: 'release', input: inputText, tag: mood }),
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
          journalText: inputText,
          universeReply: replyText,
          card,
        });

        sound.playSparkle();
        setStep('revealing');
      }, 8500);
    }, 1400);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center px-4 py-8 relative">
      {/* 頂部返回與狀態欄 */}
      <div className="w-full flex justify-between items-center mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-amber-200/70 hover:text-amber-100 transition-colors py-1.5 px-3 rounded-full bg-white/5 border border-white/10"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回殿堂</span>
        </button>
        <span className="text-xs tracking-widest text-indigo-300/80 font-light flex items-center gap-1.5">
          <Wind className="w-3.5 h-3.5 text-indigo-400" />
          🌙 釋放之門 ‧ 心靈傾訴
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* ================= 階段一：心事書寫 ================= */}
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full flex flex-col items-center"
          >
            <div className="mb-6">
              <SmilingCosmicOrb
                size="sm"
                themeColor="indigo"
                guideText="將心中的緊繃交給我，這裡完全包容你的一切"
              />
            </div>

            {/* 心情標籤選擇 */}
            <div className="w-full mb-4">
              <label className="text-xs text-amber-100/70 block mb-2 tracking-wider">
                此刻內心最接近的感受：
              </label>
              <div className="flex flex-wrap gap-2">
                {MOOD_TAGS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setMood(t)}
                    className={`text-xs py-1.5 px-3.5 rounded-full transition-all ${
                      mood === t
                        ? 'bg-indigo-600/90 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] border border-indigo-400'
                        : 'bg-white/5 text-amber-100/60 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* 書寫文字框 */}
            <div className="w-full relative mb-6">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={5}
                placeholder="寫下讓你感到沉重的煩惱、卡住的念頭，或想對宇宙說的心裡話..."
                className="w-full rounded-2xl bg-black/40 border border-indigo-400/30 p-4 text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400/50 backdrop-blur-md text-sm md:text-base resize-none shadow-inner leading-relaxed"
              />
              <span className="absolute bottom-3 right-4 text-xs text-amber-200/40">
                {inputText.length} 字
              </span>
            </div>

            {/* 放手按鈕 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!inputText.trim()}
              onClick={handleRelease}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-medium tracking-wider text-sm md:text-base transition-all shadow-xl ${
                inputText.trim()
                  ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-[0_0_25px_rgba(99,102,241,0.4)] cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>交給宇宙並放手釋懷</span>
            </motion.button>
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
              ✧ 文字化作星塵，回歸浩瀚虛空 ✧
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

            {/* 底部操作 */}
            <div className="w-full flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => {
                  setInputText('');
                  setStep('input');
                }}
                className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 text-xs tracking-wider border border-white/10 transition-colors"
              >
                再次傾訴或提問
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
    </div>
  );
}
