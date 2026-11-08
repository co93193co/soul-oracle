'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowLeft, Sun, CheckCircle2 } from 'lucide-react';
import SmilingCosmicOrb from '@/components/shared/SmilingCosmicOrb';
import OracleCard from '@/components/shared/OracleCard';
import { getRandomCard, OracleCardData } from '@/lib/presets/cardsData';
import { getRandomAffirmation } from '@/lib/presets/affirmations';
import { sound } from '@/lib/sound';
import { localStore } from '@/lib/storage';

interface ManifestSanctuaryProps {
  onBack: () => void;
  onOpenArchive: () => void;
}

const WISH_CATEGORIES = ['事業與志業', '金錢與豐盛', '靈魂伴侶與愛', '身心活力', '自我成長與夢想'];

export default function ManifestSanctuary({ onBack, onOpenArchive }: ManifestSanctuaryProps) {
  const [step, setStep] = useState<'input' | 'seeding' | 'affirming' | 'revealing'>('input');
  const [category, setCategory] = useState(WISH_CATEGORIES[0]);
  const [wishText, setWishText] = useState('');
  const [universeBlessing, setUniverseBlessing] = useState('');
  const [drawnCard, setDrawnCard] = useState<OracleCardData | null>(null);
  const [currentAffirmation, setCurrentAffirmation] = useState('');

  const handleManifest = async () => {
    if (!wishText.trim()) return;

    // 1. 播放 528Hz 奇蹟顯化頻率音效
    sound.playSingingBowl528();
    setStep('seeding');

    // 2. 隨機選取一張豐盛顯化卡與調頻肯定句
    const card = getRandomCard('manifest');
    setDrawnCard(card);
    const aff = getRandomAffirmation('manifest');
    setCurrentAffirmation(aff.quote);

    // 3. 在背景呼叫 AI API 產生宇宙祝福與提醒
    const apiPromise = fetch('/api/universe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: 'manifest', input: wishText, tag: category }),
    })
      .then((res) => res.json())
      .catch(() => ({ reply: '宇宙已欣喜接下你的願望種子，請信任這份流動，奇蹟已然在路上...' }));

    // 4. 金種凝聚 1.2 秒後進入肯定句調頻冥想階段
    setTimeout(() => {
      setStep('affirming');
      sound.playSparkle();

      // 5. 肯定句停留 7 秒對齊心輪後，揭曉宇宙加持與卡片
      setTimeout(async () => {
        const data = await apiPromise;
        const blessingText = data.reply || '';
        setUniverseBlessing(blessingText);

        // 存入本機願望庫
        localStore.saveWish({
          category,
          wishText,
          universeBlessing: blessingText,
          card,
        });

        sound.playSingingBowl528();
        setStep('revealing');
      }, 7500);
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
        <span className="text-xs tracking-widest text-amber-300 font-light flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-amber-400" />
          ☀️ 顯化之門 ‧ 願望播種
        </span>
      </div>

      <AnimatePresence mode="wait">
        {/* ================= 階段一：願望書寫 ================= */}
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
                themeColor="amber"
                guideText="在宇宙中心種下純粹的渴望，感受它已經為你盛開"
              />
            </div>

            {/* 願望類別選擇 */}
            <div className="w-full mb-4">
              <label className="text-xs text-amber-100/70 block mb-2 tracking-wider">
                選擇你想顯化的生命領域：
              </label>
              <div className="flex flex-wrap gap-2">
                {WISH_CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`text-xs py-1.5 px-3.5 rounded-full transition-all ${
                      category === c
                        ? 'bg-amber-500/90 text-slate-950 font-medium shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-300'
                        : 'bg-white/5 text-amber-100/60 hover:bg-white/10 border border-white/10'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 願望文字框 */}
            <div className="w-full relative mb-6">
              <textarea
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                rows={5}
                placeholder="以感謝、篤定的心態寫下你的願望（例如：「我允許並感謝自己輕鬆吸引理想的合作機會...」）"
                className="w-full rounded-2xl bg-black/40 border border-amber-400/30 p-4 text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 backdrop-blur-md text-sm md:text-base resize-none shadow-inner leading-relaxed"
              />
              <span className="absolute bottom-3 right-4 text-xs text-amber-200/40">
                {wishText.length} 字
              </span>
            </div>

            {/* 播種按鈕 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!wishText.trim()}
              onClick={handleManifest}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-medium tracking-wider text-sm md:text-base transition-all shadow-xl ${
                wishText.trim()
                  ? 'bg-gradient-to-r from-amber-500 via-rose-400 to-amber-600 text-slate-950 font-semibold shadow-[0_0_25px_rgba(251,191,36,0.5)] cursor-pointer'
                  : 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>向宇宙播種心願種子</span>
            </motion.button>
          </motion.div>
        )}

        {/* ================= 階段二：金光種子注入動畫 ================= */}
        {step === 'seeding' && (
          <motion.div
            key="seeding"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="w-full flex flex-col items-center justify-center py-20 text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.3, 0.4], y: [0, -30] }}
              transition={{ duration: 1.2 }}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 shadow-[0_0_35px_rgba(251,191,36,0.9)] flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 text-slate-900" />
            </motion.div>
            <p className="text-amber-200/80 text-base tracking-widest font-light mt-6">
              ✧ 心願凝聚為金色種子，已注入宇宙之心 ✧
            </p>
          </motion.div>
        )}

        {/* ================= 階段三：肯定句共振冥想 ================= */}
        {step === 'affirming' && (
          <motion.div
            key="affirming"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full flex flex-col items-center justify-center py-12"
          >
            <SmilingCosmicOrb
              mode="affirming"
              size="lg"
              themeColor="amber"
              guideText="感受這顆願望在量子場域中早已為你實現..."
            />
            {/* 肯定句卡片 */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 max-w-md p-5 rounded-2xl bg-amber-400/10 border border-amber-300/30 backdrop-blur-md text-center shadow-[0_0_30px_rgba(251,191,36,0.2)]"
            >
              <span className="text-[11px] text-amber-300 uppercase tracking-widest block mb-1">
                ✦ 顯化頻率肯定句 ✦
              </span>
              <p className="text-amber-50 text-sm md:text-base leading-relaxed font-light">
                「{currentAffirmation}」
              </p>
              <span className="text-xs text-amber-200/50 block mt-2 tracking-wider">
                請在心裡真誠默念三次，讓能量共振
              </span>
            </motion.div>
          </motion.div>
        )}

        {/* ================= 階段四：接收祝福與顯化卡 ================= */}
        {step === 'revealing' && (
          <motion.div
            key="revealing"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full flex flex-col items-center gap-8"
          >
            {/* 宇宙豐盛祝福卡片 */}
            <div className="w-full p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#241a12]/90 via-[#18120d]/90 to-[#0c0805]/90 border border-amber-400/40 shadow-2xl backdrop-blur-xl relative">
              <div className="flex items-center gap-2 mb-4 text-amber-300 text-xs tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>☀️ 宇宙盟友的豐盛加持與提醒</span>
              </div>
              <p className="text-amber-50/95 text-sm sm:text-base leading-relaxed font-light whitespace-pre-line tracking-wide">
                {universeBlessing}
              </p>
            </div>

            {/* 抽到的豐盛種子卡 */}
            {drawnCard && (
              <div className="w-full flex flex-col items-center">
                <p className="text-xs text-amber-200/70 tracking-widest mb-4">
                  ✦ 宇宙賜予這份心願的豐盛種子卡 ✦
                </p>
                <OracleCard card={drawnCard} />
              </div>
            )}

            {/* 底部操作 */}
            <div className="w-full flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => {
                  setWishText('');
                  setStep('input');
                }}
                className="flex-1 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-amber-100 text-xs tracking-wider border border-white/10 transition-colors"
              >
                播種另一個心願
              </button>
              <button
                onClick={onOpenArchive}
                className="flex-1 py-3.5 rounded-xl bg-amber-500/90 hover:bg-amber-500 text-slate-950 font-medium text-xs tracking-wider border border-amber-300/40 shadow-lg transition-all"
              >
                前往願望顯化牆查看
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
