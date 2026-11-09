'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Compass, CheckCircle2, HelpCircle } from 'lucide-react';
import SmilingCosmicOrb from '@/components/shared/SmilingCosmicOrb';
import OracleCard from '@/components/shared/OracleCard';
import VoiceInputButton from '@/components/shared/VoiceInputButton';
import { getRandomCard, OracleCardData } from '@/lib/presets/cardsData';
import { sound } from '@/lib/sound';
import { localStore } from '@/lib/storage';

interface InquireSanctuaryProps {
  onBack: () => void;
  onOpenArchive: () => void;
}

const INQUIRE_TAGS = ['人生方向', '靈魂天賦', '關係抉擇', '內在卡點', '事業靈感', '深層覺察'];

const CLASSIC_QUESTIONS = [
  '如果這裡沒有任何需要修復的，會有什麼新可能性？',
  '我現在最需要看見的潛意識盲點是什麼？',
  '是什麼在阻礙我向前，而我該如何跨越？',
  '如果我完全信任宇宙，我現在會做出什麼選擇？',
];

export default function InquireSanctuary({ onBack, onOpenArchive }: InquireSanctuaryProps) {
  const [step, setStep] = useState<'input' | 'inquiring' | 'revealing'>('input');
  const [tag, setTag] = useState(INQUIRE_TAGS[0]);
  const [inputText, setInputText] = useState('');
  const [universeReply, setUniverseReply] = useState('');
  const [drawnCard, setDrawnCard] = useState<OracleCardData | null>(null);

  const handleInquire = async () => {
    if (!inputText.trim()) return;

    sound.playSingingBowl432();
    setStep('inquiring');

    const card = getRandomCard('inquire');
    setDrawnCard(card);

    const apiPromise = fetch('/api/universe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'inquire', input: inputText, tag }),
    })
      .then((res) => res.json())
      .catch(() => ({
        reply: `看見你心中真誠的探問，宇宙的智慧星光正在為你照亮盲點迷霧。
【🔮 洞悉表象】：你此刻感受到的困惑，並非事情本身無解，而是你正站在舊有經驗的邊界，準備跨入新的知曉。
【💡 盲點啟明提問】：試著問自己：「如果我完全不需要向任何人證明我的選擇是正確的，我靈魂最自在的方向會是哪裡？」
【🧭 靈魂羅盤微步】：閉上雙眼十秒鐘，將右手放在心口，信任那份超越大腦邏輯的第一直覺。`,
      }));

    setTimeout(async () => {
      const data = await apiPromise;
      const replyText = data.reply || '';
      setUniverseReply(replyText);

      localStore.saveInquiry({
        moodTag: `【探問】${tag}`,
        journalText: inputText,
        universeReply: replyText,
        card,
      });

      sound.playSparkle();
      setStep('revealing');
    }, 4500);
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center px-3.5 sm:px-4 py-4 sm:py-8 relative selection:bg-purple-400/20">
      {/* 頂部返回與狀態欄 */}
      <div className="w-full flex justify-between items-center mb-5 sm:mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-purple-200/80 hover:text-white transition-colors py-1.5 px-3 rounded-full bg-white/5 border border-white/10 active:scale-95"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回殿堂</span>
        </button>
        <span className="text-xs tracking-widest text-purple-300 font-light flex items-center gap-1.5">
          <Compass className="w-3.5 h-3.5 text-purple-400 animate-spin" style={{ animationDuration: '12s' }} />
          🔮 提問之門 ‧ 靈魂探問
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* ================= 階段一：靈魂探問輸入 ================= */}
        {step === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            className="w-full flex flex-col items-center text-center"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 mb-3 sm:mb-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Compass className="w-6 h-6" />
            </div>

            <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide mb-2">
              向浩瀚宇宙提出真實探問
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/70 max-w-md mx-auto leading-relaxed mb-5">
              好的提問能鬆動固化觀點，撥開盲點迷霧。宇宙不批判任何問題，靜心寫下你此刻最深的困惑或抉擇。
            </p>

            {/* 主題標籤選擇 */}
            <div className="flex flex-wrap justify-center gap-2 mb-4 w-full">
              {INQUIRE_TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setTag(t)}
                  className={`text-xs py-1.5 px-3.5 rounded-full transition-all ${
                    tag === t
                      ? 'bg-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                      : 'bg-white/5 text-purple-200/70 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>

            {/* 經典靈魂提問庫 (一鍵填入) */}
            <div className="w-full mb-3 text-left">
              <span className="text-[11px] text-purple-300/80 mb-1.5 flex items-center gap-1 font-mono">
                <HelpCircle className="w-3 h-3" />
                ✦ 經典靈魂提問（點擊可快速填入）：
              </span>
              <div className="flex flex-wrap gap-1.5">
                {CLASSIC_QUESTIONS.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInputText(q)}
                    className="text-[11px] py-1 px-2.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-400/30 text-purple-200 text-left transition-colors truncate max-w-full"
                  >
                    「{q}」
                  </button>
                ))}
              </div>
            </div>

            {/* 書寫文字框 */}
            <div className="w-full relative mb-6">
              <div className="flex items-center justify-between mb-1.5 px-1">
                <span className="text-xs text-purple-200/80 font-light">
                  問題探問（直接輸入或語音發問）：
                </span>
                <VoiceInputButton
                  value={inputText}
                  onChange={setInputText}
                  themeColor="purple"
                  size="sm"
                  label="語音輸入"
                />
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="寫下你心中最渴望獲得指引的問題...（例如：我該如何面對這份關係？我在這份工作中迷茫了...）"
                rows={4}
                className="w-full p-4 rounded-2xl bg-black/40 border border-purple-400/30 focus:border-purple-400/80 focus:ring-1 focus:ring-purple-400/80 outline-none text-purple-100 placeholder:text-purple-300/30 text-sm leading-relaxed resize-none transition-all shadow-inner"
              />
            </div>

            {/* 提問確認按鈕 */}
            <button
              onClick={handleInquire}
              disabled={!inputText.trim()}
              className="w-full sm:w-auto py-3 px-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm tracking-widest transition-all shadow-[0_0_25px_rgba(168,85,247,0.4)] active:scale-95"
            >
              ✦ 推開提問之門 ‧ 向宇宙發起探問 ✦
            </button>
          </motion.div>
        )}

        {/* ================= 階段二：星光凝聚解構盲點 ================= */}
        {step === 'inquiring' && (
          <motion.div
            key="inquiring"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-10"
          >
            <SmilingCosmicOrb
              size="lg"
              themeColor="purple"
              guideText="宇宙正在解構你的提問，撥開盲點迷霧，為你凝聚深層指引..."
            />
            <p className="mt-8 text-xs text-purple-300/70 tracking-widest animate-pulse font-mono">
              ✦ ALIGNING INTUITION & COSMIC WISDOM ✦
            </p>
          </motion.div>
        )}

        {/* ================= 階段三：揭曉回信與靈魂啟明卡 ================= */}
        {step === 'revealing' && drawnCard && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center space-y-6"
          >
            {/* 成功探問標章 */}
            <div className="flex items-center gap-1.5 text-xs text-purple-300 bg-purple-500/15 border border-purple-400/30 px-3.5 py-1.5 rounded-full shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
              <span>探問已發送 ‧ 宇宙指路明燈已為你點亮</span>
            </div>

            {/* 牌卡本體 */}
            <div className="w-full flex justify-center py-2">
              <OracleCard card={drawnCard} isInitiallyRevealed={false} />
            </div>

            {/* 宇宙智者回信卷軸 */}
            <div className="w-full p-5 sm:p-7 rounded-3xl bg-gradient-to-b from-[#1c1236]/90 via-[#130b24]/90 to-[#090514]/95 border border-purple-400/40 text-left shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-purple-500/10 blur-3xl pointer-events-none" />

              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-purple-400/20">
                <Sparkles className="w-4 h-4 text-purple-300" />
                <h3 className="text-sm font-medium text-purple-200 tracking-wider">
                  宇宙智者的洞察視角與提問
                </h3>
              </div>

              <div className="text-xs sm:text-sm text-purple-100/90 leading-relaxed space-y-3 font-light whitespace-pre-line">
                {universeReply}
              </div>
            </div>

            {/* 底部功能操作按鈕群 */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2 w-full">
              <button
                onClick={() => {
                  sound.playSparkle();
                  onOpenArchive();
                }}
                className="py-2.5 px-5 rounded-full bg-purple-400/20 hover:bg-purple-400/30 border border-purple-400/40 text-xs text-purple-100 transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>查看星空檔案庫</span>
              </button>

              <button
                onClick={() => {
                  setInputText('');
                  setStep('input');
                }}
                className="py-2.5 px-5 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs text-purple-200 transition-all active:scale-95"
              >
                再問一個問題
              </button>

              <button
                onClick={onBack}
                className="py-2.5 px-5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/70 hover:text-white transition-all active:scale-95"
              >
                返回靈魂之境
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
