'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Star,
  ChevronLeft,
  Settings,
  RotateCcw,
  BookOpen,
  Check,
  AlertCircle,
  Plus,
} from 'lucide-react';
import {
  OracleDeck,
  OracleDeckCard,
  getOracleDecks,
  saveOracleDecks,
  resetOracleDecksToDefault,
  drawCardFromDeck,
} from '@/lib/presets/oracleDecks';
import { sound } from '@/lib/sound';
import { localStore } from '@/lib/storage';

interface MultiDeckDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPoints: number;
  onPointsUpdated: (newPoints: number) => void;
  onOpenArchive?: () => void;
}

export default function MultiDeckDrawModal({
  isOpen,
  onClose,
  currentPoints,
  onPointsUpdated,
  onOpenArchive,
}: MultiDeckDrawModalProps) {
  const [decks, setDecks] = useState<OracleDeck[]>([]);
  const [selectedDeck, setSelectedDeck] = useState<OracleDeck | null>(null);
  const [drawnCard, setDrawnCard] = useState<OracleDeckCard | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [savedSuccessMsg, setSavedSuccessMsg] = useState('');
  const [insufficientError, setInsufficientError] = useState<string | null>(null);
  const [isSavedToArchive, setIsSavedToArchive] = useState(false);

  // 載入牌組
  useEffect(() => {
    if (isOpen) {
      setDecks(getOracleDecks());
      setDrawnCard(null);
      setSelectedDeck(null);
      setIsSettingsOpen(false);
      setInsufficientError(null);
      setIsSavedToArchive(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 處理抽卡
  const handleDrawCard = (deck: OracleDeck) => {
    // 檢查點數
    if (currentPoints < deck.costPerDraw) {
      setInsufficientError(`點數不足！抽取「${deck.name}」需要 ${deck.costPerDraw} 點，您目前擁有 ${currentPoints} 點。您可以透過四方箱型冥想或每日登入獲取點數 ✨`);
      sound.playSparkle();
      return;
    }

    setInsufficientError(null);
    setSelectedDeck(deck);
    setIsDrawing(true);
    sound.playSingingBowl432();

    // 扣除點數
    const newPoints = Math.max(0, currentPoints - deck.costPerDraw);
    localStore.setPoints(newPoints);
    onPointsUpdated(newPoints);

    // 模擬洗牌神秘延遲
    setTimeout(() => {
      const card = drawCardFromDeck(deck.id, decks);
      setDrawnCard(card);
      setIsDrawing(false);
      setIsSavedToArchive(false);
      sound.playSparkle();
    }, 650);
  };

  // 收藏至檔案庫
  const handleSaveToArchive = () => {
    if (!drawnCard || !selectedDeck) return;
    try {
      localStore.saveInquiry({
        moodTag: selectedDeck.name,
        journalText: `從【${selectedDeck.name}】抽取指引`,
        universeReply: drawnCard.guide,
        card: {
          id: drawnCard.id,
          code: drawnCard.id.toUpperCase(),
          deckType: 'receive',
          category: drawnCard.category,
          title: drawnCard.title,
          quote: drawnCard.quote,
          guide: drawnCard.guide,
          colorGradient: drawnCard.colorGradient,
        },
      });
      setIsSavedToArchive(true);
      sound.playSparkle();
    } catch (e) {
      console.error(e);
    }
  };

  // 修改點數設定
  const handleUpdateCost = (deckId: string, newCost: number) => {
    const updated = decks.map((d) => (d.id === deckId ? { ...d, costPerDraw: Math.max(0, newCost) } : d));
    setDecks(updated);
    saveOracleDecks(updated);
    setSavedSuccessMsg('✓ 牌組抽卡點數設定已成功儲存！');
    setTimeout(() => setSavedSuccessMsg(''), 2500);
  };

  // 重設牌組
  const handleResetDefaults = () => {
    const defaults = resetOracleDecksToDefault();
    setDecks(defaults);
    setSavedSuccessMsg('✓ 已成功重設回預設牌組與點數！');
    setTimeout(() => setSavedSuccessMsg(''), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-gradient-to-b from-[#131024] via-[#0c0a18] to-[#06050d] border border-amber-300/30 rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden my-auto"
      >
        {/* 背景氛圍光 */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* 頂部導覽列 */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-amber-300 flex items-center justify-center text-slate-950 text-xs font-bold shadow-md">
              ✦
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-light text-white tracking-wider flex items-center gap-1.5">
                <span>神聖牌卡殿堂</span>
              </h2>
              <p className="text-[10px] sm:text-xs text-amber-200/60 font-mono tracking-widest">
                SACRED ORACLE SANCTUARY
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 點數餘額 */}
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-300/30 text-amber-200 text-xs font-mono shadow-sm">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300 animate-pulse" />
              <span>{currentPoints} 點</span>
            </div>

            {/* 後台點數設定開關 */}
            <button
              onClick={() => {
                sound.playSparkle();
                setIsSettingsOpen(!isSettingsOpen);
              }}
              title="牌組點數管理與設定"
              className={`p-1.5 rounded-full border transition-all ${
                isSettingsOpen
                  ? 'bg-amber-400/20 border-amber-300 text-amber-200'
                  : 'bg-white/5 border-white/10 hover:bg-white/15 text-white/70'
              }`}
            >
              <Settings className="w-4 h-4" />
            </button>

            {/* 關閉按鈕 */}
            <button
              onClick={() => {
                sound.playSparkle();
                onClose();
              }}
              className="p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/20 text-white/80 transition-all active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 點數不足警告訊息 */}
        {insufficientError && (
          <div className="mt-3 p-2.5 rounded-xl bg-rose-950/60 border border-rose-400/40 text-xs text-rose-200 flex items-start gap-2 animate-fade-in relative z-10">
            <AlertCircle className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p>{insufficientError}</p>
            </div>
            <button onClick={() => setInsufficientError(null)} className="text-rose-300 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 設定模式：自訂修改扣除點數與重設 */}
        {isSettingsOpen && (
          <div className="mt-3 p-3 sm:p-4 rounded-2xl bg-black/60 border border-amber-300/30 relative z-10 animate-fade-in">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
              <span className="text-xs text-amber-200 font-medium flex items-center gap-1.5">
                <Settings className="w-3.5 h-3.5 text-amber-300" />
                <span>⚙️ 牌組抽卡點數後台管理 (隨時可修改)</span>
              </span>
              <button
                onClick={handleResetDefaults}
                className="flex items-center gap-1 text-[11px] text-white/60 hover:text-amber-200 transition-colors"
                title="恢復預設點數與牌卡"
              >
                <RotateCcw className="w-3 h-3" />
                <span>恢復原廠預設</span>
              </button>
            </div>

            {savedSuccessMsg && (
              <div className="mb-2.5 text-xs text-emerald-300 flex items-center gap-1 font-mono">
                <Check className="w-3.5 h-3.5" />
                <span>{savedSuccessMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {decks.map((deck) => (
                <div
                  key={deck.id}
                  className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span>{deck.icon}</span>
                    <span className="text-white font-medium truncate">{deck.name}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-white/60 text-[11px]">扣除:</span>
                    <input
                      type="number"
                      min="0"
                      max="999"
                      value={deck.costPerDraw}
                      onChange={(e) => handleUpdateCost(deck.id, parseInt(e.target.value) || 0)}
                      className="w-14 px-2 py-0.5 rounded-lg bg-black/80 border border-amber-300/40 text-amber-200 text-center font-mono text-xs focus:outline-none focus:ring-1 focus:ring-amber-300"
                    />
                    <span className="text-amber-300 text-[11px]">點</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-white/40 mt-2 text-right">
              ※ 修改立即生效，資料儲存於瀏覽器專屬空間，可自由隨時調整
            </p>
          </div>
        )}

        {/* 主畫面：卡片揭曉 (狀態 1) 或 牌組選擇 (狀態 2) */}
        <div className="mt-4 relative z-10">
          {/* ================= 狀態 1：牌卡揭曉 ================= */}
          {drawnCard && selectedDeck && !isDrawing ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center text-center space-y-3 sm:space-y-4"
            >
              {/* 所屬牌組標籤 */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-xs text-amber-200">
                <span>{selectedDeck.icon}</span>
                <span>{selectedDeck.name}</span>
                <span className="text-white/40">‧</span>
                <span className="text-white/80">{drawnCard.category}</span>
              </div>

              {/* 卡片本體 (立體光澤卡) */}
              <div
                className={`w-full max-w-md p-5 sm:p-6 rounded-3xl bg-gradient-to-b ${drawnCard.colorGradient} border border-amber-300/40 shadow-2xl relative overflow-hidden text-left`}
              >
                <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-amber-400/10 blur-2xl pointer-events-none" />

                <div className="flex items-center justify-between text-xs text-amber-200/60 font-mono mb-2">
                  <span>✦ SACRED CARD REVEALED ✦</span>
                  <span>扣除 {selectedDeck.costPerDraw} 點</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-light text-white tracking-wide mb-3 flex items-center gap-2">
                  <span>{drawnCard.title}</span>
                </h3>

                <div className="my-3 py-2.5 px-3 rounded-2xl bg-black/40 border border-white/10 shadow-inner">
                  <p className="text-sm sm:text-base font-light text-amber-100 tracking-wider leading-relaxed">
                    「{drawnCard.quote}」
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-white/80 leading-relaxed font-light mt-2">
                  {drawnCard.guide}
                </p>
              </div>

              {/* 互動按鈕 */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 w-full">
                <button
                  onClick={() => handleDrawCard(selectedDeck)}
                  className="flex items-center gap-1.5 py-2 px-5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold text-xs tracking-wider transition-all shadow-md active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>再抽一張 (扣 {selectedDeck.costPerDraw} 點)</span>
                </button>

                <button
                  onClick={handleSaveToArchive}
                  disabled={isSavedToArchive}
                  className={`flex items-center gap-1.5 py-2 px-4 rounded-full border text-xs tracking-wider transition-all ${
                    isSavedToArchive
                      ? 'bg-emerald-500/20 border-emerald-400/40 text-emerald-200'
                      : 'bg-white/10 hover:bg-white/20 border-white/20 text-white active:scale-95'
                  }`}
                >
                  {isSavedToArchive ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" />
                      <span>已收藏至檔案庫</span>
                    </>
                  ) : (
                    <>
                      <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                      <span>收藏此牌卡</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    sound.playSparkle();
                    setDrawnCard(null);
                    setSelectedDeck(null);
                  }}
                  className="flex items-center gap-1 py-2 px-3 rounded-full text-xs text-white/60 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>更換其他牌卡套組</span>
                </button>
              </div>
            </motion.div>
          ) : isDrawing ? (
            /* ================= 洗牌中動畫 ================= */
            <div className="py-14 sm:py-16 flex flex-col items-center justify-center text-center space-y-4">
              <motion.div
                animate={{ rotate: 360, scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400/30 via-purple-400/30 to-indigo-400/30 border border-amber-300/60 flex items-center justify-center text-2xl shadow-[0_0_35px_rgba(251,191,36,0.3)]"
              >
                <span>{selectedDeck?.icon || '✨'}</span>
              </motion.div>
              <div className="space-y-1">
                <p className="text-sm text-white font-light tracking-widest">
                  正在洗牌並連結高頻訊息...
                </p>
                <p className="text-xs text-amber-200/60 font-mono">
                  ALIGNING FREQUENCY & DEDUCTING {selectedDeck?.costPerDraw} PTS
                </p>
              </div>
            </div>
          ) : (
            /* ================= 狀態 2：多套組牌卡選擇列表 ================= */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-amber-200/70 px-1">
                <span>請選擇您想連結的神聖牌卡套組：</span>
                <span className="text-[11px] text-white/50">共 {decks.length} 組神諭卡</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                {decks.map((deck) => (
                  <motion.div
                    key={deck.id}
                    whileHover={{ scale: 1.01 }}
                    className={`p-3.5 sm:p-4 rounded-2xl bg-gradient-to-b ${deck.themeGradient} border ${deck.borderClass} shadow-lg transition-all flex flex-col justify-between gap-3 text-left group`}
                  >
                    <div>
                      {/* 標題與圖示 */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xl sm:text-2xl">{deck.icon}</span>
                          <div>
                            <h4 className="text-sm sm:text-base font-light text-white tracking-wide group-hover:text-amber-200 transition-colors">
                              {deck.name}
                            </h4>
                            <span className="text-[9px] font-mono text-white/40 block">
                              {deck.english}
                            </span>
                          </div>
                        </div>

                        {/* 消耗點數 Badge */}
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-300/30 text-amber-200 text-xs font-mono shrink-0 shadow-sm">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                          <span>{deck.costPerDraw} 點/張</span>
                        </div>
                      </div>

                      {/* 說明文字 */}
                      <p className="text-xs text-white/70 font-light leading-relaxed line-clamp-2">
                        {deck.description}
                      </p>
                    </div>

                    {/* 底部按鈕 */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                      <span className="text-[11px] text-white/40 font-mono">
                        內含 {deck.cards.length} 張指引卡
                      </span>

                      <button
                        onClick={() => handleDrawCard(deck)}
                        className={`inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full font-medium text-xs transition-all shadow-sm active:scale-95 ${
                          currentPoints >= deck.costPerDraw
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-bold'
                            : 'bg-white/10 text-white/50 border border-white/10 hover:bg-white/15'
                        }`}
                      >
                        <span>{currentPoints >= deck.costPerDraw ? '洗牌抽取' : '點數不足'}</span>
                        <Sparkles className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
