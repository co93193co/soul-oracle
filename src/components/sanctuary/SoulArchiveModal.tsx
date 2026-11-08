'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Sun, Sparkles, CheckCircle, Heart, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { localStore, SoulInquiryRecord, SoulWishRecord } from '@/lib/storage';
import { sound } from '@/lib/sound';

interface SoulArchiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'inquiries' | 'wishes';
}

export default function SoulArchiveModal({
  isOpen,
  onClose,
  defaultTab = 'inquiries',
}: SoulArchiveModalProps) {
  const [activeTab, setActiveTab] = useState<'inquiries' | 'wishes'>(defaultTab);
  const [inquiries, setInquiries] = useState<SoulInquiryRecord[]>([]);
  const [wishes, setWishes] = useState<SoulWishRecord[]>([]);
  const [stars, setStars] = useState<number>(365);
  const [selectedItemNotes, setSelectedItemNotes] = useState<{ id: string; type: 'inquiry' | 'wish'; text: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setInquiries(localStore.getInquiries());
      setWishes(localStore.getWishes());
      setStars(localStore.getPoints());
    }
  }, [isOpen]);

  const handleMarkTransformed = (id: string) => {
    const note = prompt('寫下你此時此刻的釋懷感悟或能量轉變（選填）：') || '';
    localStore.markTransformed(id, note);
    sound.playSingingBowl432();
    setInquiries(localStore.getInquiries());
  };

  const handleMarkManifested = (id: string) => {
    const note = prompt('恭喜奇蹟顯化！寫下一句對宇宙與自己的感謝之語（選填）：') || '';
    localStore.markManifested(id, note);
    sound.playSingingBowl528();

    // 綻放金色星光紙花慶賀！
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#FCD34D', '#F472B6', '#6366F1'],
      });
    } catch {
      // ignore
    }

    setWishes(localStore.getWishes());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl max-h-[88vh] rounded-3xl bg-[#0c1024] border border-amber-300/30 flex flex-col overflow-hidden shadow-2xl relative text-amber-50"
        >
          {/* Modal Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between bg-black/30">
            <div>
              <h2 className="text-lg font-medium text-amber-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>個人星空靈魂檔案庫</span>
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-300/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  星光能量：{stars} 顆 (無拘暢玩)
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/10 text-amber-200/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 分頁切換 (Tabs) */}
          <div className="flex border-b border-white/10 bg-black/20 text-xs">
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex-1 py-3.5 flex items-center justify-center gap-2 font-medium transition-all ${
                activeTab === 'inquiries'
                  ? 'text-indigo-300 border-b-2 border-indigo-400 bg-indigo-950/30'
                  : 'text-amber-100/50 hover:text-amber-100/80'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>🌙 心事轉化信箱 ({inquiries.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('wishes')}
              className={`flex-1 py-3.5 flex items-center justify-center gap-2 font-medium transition-all ${
                activeTab === 'wishes'
                  ? 'text-amber-300 border-b-2 border-amber-400 bg-amber-950/30'
                  : 'text-amber-100/50 hover:text-amber-100/80'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>☀️ 願望顯化牆 ({wishes.length})</span>
            </button>
          </div>

          {/* 列表內容區 */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {activeTab === 'inquiries' ? (
              inquiries.length === 0 ? (
                <div className="py-16 text-center text-amber-200/40 text-xs tracking-wider">
                  目前尚未有心事記錄，點擊「釋放之門」寫下第一份傾訴吧。
                </div>
              ) : (
                inquiries.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/40 transition-all flex flex-col gap-3"
                  >
                    <div className="flex justify-between items-center text-xs">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {item.moodTag}
                      </span>
                      <span className="text-amber-200/40 text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="text-sm text-amber-100/90 leading-relaxed font-light">
                      「{item.journalText}」
                    </p>

                    <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-400/20 text-xs text-indigo-200/90 leading-relaxed">
                      <span className="text-indigo-400 font-medium block mb-1">
                        🌌 宇宙回信：
                      </span>
                      {item.universeReply}
                    </div>

                    {item.card && (
                      <div className="text-[11px] text-amber-200/60 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>抽得覺察卡：【{item.card.title}】{item.card.quote}</span>
                      </div>
                    )}

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      {item.isTransformed ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>✨ 能量已流動釋懷</span>
                          {item.transformationNotes && (
                            <span className="text-amber-200/60 italic ml-2">
                              「{item.transformationNotes}」
                            </span>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => handleMarkTransformed(item.id)}
                          className="text-xs text-amber-300/80 hover:text-amber-300 flex items-center gap-1 py-1 px-2.5 rounded-lg bg-amber-400/10 border border-amber-300/20 transition-all"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>標記：這件事已釋懷/轉化</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )
            ) : wishes.length === 0 ? (
              <div className="py-16 text-center text-amber-200/40 text-xs tracking-wider">
                目前尚未有願望記錄，點擊「顯化之門」播下第一顆種子吧。
              </div>
            ) : (
              wishes.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col gap-3 ${
                    item.isManifested
                      ? 'bg-gradient-to-r from-amber-950/40 via-yellow-950/30 to-amber-900/20 border-amber-400/60 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                      : 'bg-white/5 border-white/10 hover:border-amber-400/40'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {item.category}
                    </span>
                    <span className="text-amber-200/40 text-[11px]">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-sm text-amber-100/90 leading-relaxed font-light">
                    「{item.wishText}」
                  </p>

                  <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-400/20 text-xs text-amber-200/90 leading-relaxed">
                    <span className="text-amber-400 font-medium block mb-1">
                      ☀️ 宇宙加持與提醒：
                    </span>
                    {item.universeBlessing}
                  </div>

                  {item.card && (
                    <div className="text-[11px] text-amber-200/60 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>抽得豐盛卡：【{item.card.title}】{item.card.quote}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    {item.isManifested ? (
                      <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium">
                        <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                        <span>🌟 奇蹟已顯化成真！</span>
                        {item.gratitudeNotes && (
                          <span className="text-amber-200/70 italic ml-2">
                            感恩心得：「{item.gratitudeNotes}」
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleMarkManifested(item.id)}
                        className="text-xs text-amber-950 font-semibold flex items-center gap-1 py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-400 to-yellow-300 hover:from-amber-300 hover:to-yellow-200 transition-all shadow-md"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>✨ 標記：奇蹟顯化成真！</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
