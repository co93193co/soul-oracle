'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart, Lock, CheckCircle2, Send, Flame, Globe } from 'lucide-react';
import confetti from 'canvas-confetti';
import VoiceInputButton from '@/components/shared/VoiceInputButton';
import { localStore, WishWallItem, MeditationStats } from '@/lib/storage';
import { sound } from '@/lib/sound';

interface CosmicWishWallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMeditation: () => void;
}

export default function CosmicWishWallModal({
  isOpen,
  onClose,
  onOpenMeditation,
}: CosmicWishWallModalProps) {
  const [wishes, setWishes] = useState<WishWallItem[]>([]);
  const [stats, setStats] = useState<MeditationStats>({
    streakDays: 0,
    totalMinutes: 0,
    lastMeditationDate: null,
    badges: [],
    canPostWishWall: false,
  });

  const [newWishContent, setNewWishContent] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen) {
      setWishes(localStore.getWishWall());
      setStats(localStore.getMeditationStats());
    }
  }, [isOpen]);

  const handlePostWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWishContent.trim()) return;

    setIsSubmitting(true);
    sound.playSingingBowl528(6);

    const item = localStore.postWishWall(newWishContent, isPublic);
    setWishes(localStore.getWishWall());
    setNewWishContent('');
    setIsSubmitting(false);

    try {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#F59E0B', '#F472B6', '#FCD34D', '#818CF8'],
      });
    } catch {
      // ignore
    }
  };

  const handleLike = (id: string) => {
    if (likedMap[id]) return;
    sound.playSparkle();
    localStore.likeWishWallItem(id);
    setLikedMap((prev) => ({ ...prev, [id]: true }));
    setWishes(localStore.getWishWall());
  };

  if (!isOpen) return null;

  const canPost = stats.streakDays >= 21 || stats.canPostWishWall;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#16122d] via-[#0f0e21] to-[#070712] border border-amber-300/35 p-5 sm:p-8 flex flex-col shadow-2xl relative text-amber-50"
        >
          {/* 關閉按鈕 */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-amber-200/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 頂部標題 */}
          <div className="text-center mb-6">
            <span className="text-[11px] text-amber-300 tracking-widest uppercase block mb-1">
              Consecutive 21 Days Sanctuary
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span>宇宙願望牆 (Cosmic Wish Wall)</span>
            </h2>
            <p className="text-xs text-amber-200/60 mt-1.5 tracking-wider">
              唯有完成連續 21 天每日冥想、身心徹底歸位的靈魂，方可在此烙下恆久心願
            </p>
          </div>

          {/* 21天資格狀態檢驗區 */}
          {canPost ? (
            /* 已達成 21 天：開放願望發表 */
            <form
              onSubmit={handlePostWish}
              className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-indigo-950/40 border border-amber-400/50 shadow-inner"
            >
              <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>🌟 恭喜已達成連續 21 天冥想！你已獲得宇宙願望牆的許願特權</span>
              </div>

              <div className="flex items-center justify-between mb-1.5 px-0.5">
                <span className="text-xs text-amber-200/90 font-light">
                  21天神聖心願（直接書寫或語音烙下）：
                </span>
                <VoiceInputButton
                  value={newWishContent}
                  onChange={setNewWishContent}
                  themeColor="amber"
                  size="sm"
                  label="語音輸入"
                />
              </div>

              <textarea
                value={newWishContent}
                onChange={(e) => setNewWishContent(e.target.value)}
                rows={3}
                required
                placeholder="寫下你調頻 21 天後，最純粹、最宏大、渴望在生命中顯化的神聖心願..."
                className="w-full rounded-xl bg-black/40 border border-amber-300/30 p-3.5 text-xs sm:text-sm text-amber-50 placeholder-amber-200/30 focus:outline-none focus:border-amber-400 resize-none leading-relaxed"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                <label className="flex items-center gap-2 text-xs text-amber-200/80 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="rounded border-amber-300/40 text-amber-500 focus:ring-0"
                  />
                  <Globe className="w-3.5 h-3.5 text-indigo-400" />
                  <span>公開展示在願望牆上，接收眾人靈魂祝福</span>
                </label>

                <button
                  type="submit"
                  disabled={isSubmitting || !newWishContent.trim()}
                  className="py-2 px-5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-medium text-xs tracking-wider shadow-lg flex items-center gap-1.5 hover:scale-105 transition-transform"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>向宇宙願望牆烙下心願</span>
                </button>
              </div>
            </form>
          ) : (
            /* 未達 21 天：鎖定提示 */
            <div className="mb-8 p-5 rounded-2xl bg-white/5 border border-white/10 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-400/15 border border-amber-300/30 flex items-center justify-center text-amber-300 mb-2">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-medium text-white">許願特權鎖定中</h4>
              <p className="text-xs text-amber-200/70 max-w-sm mt-1 leading-relaxed">
                完成 <strong className="text-amber-300">連續 21 天每日冥想</strong> 即可永久解鎖在宇宙願望牆留下你的願望！
              </p>

              <div className="flex items-center gap-2 my-3 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-300/25 text-xs text-amber-300">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span>當前進度：連續 {stats.streakDays} / 21 天</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onOpenMeditation();
                }}
                className="py-1.5 px-4 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-medium tracking-wider transition-colors shadow-md"
              >
                前往今日冥想累積天數 ➔
              </button>
            </div>
          )}

          {/* 公開願望牆展示區 */}
          <div className="space-y-3.5">
            <h3 className="text-xs text-amber-200/70 tracking-wider flex items-center gap-1.5 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>✧ 宇宙願望牆上的同修心願（點擊愛心送上光與祝福）：</span>
            </h3>

            {wishes.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-300/40 transition-all flex flex-col gap-2.5 relative overflow-hidden group"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-amber-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    {item.authorNickname}
                  </span>
                  <span className="text-[11px] text-amber-200/40 font-mono">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-light whitespace-pre-line">
                  「{item.wishContent}」
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-indigo-300/60 uppercase tracking-widest">
                    ✦ 21 Days Aligned Soul ✦
                  </span>
                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1 py-1 px-2.5 rounded-full text-xs transition-colors ${
                      likedMap[item.id]
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-400/40'
                        : 'bg-white/5 hover:bg-white/10 text-amber-200/70 border border-white/10'
                    }`}
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        likedMap[item.id] ? 'fill-rose-400 text-rose-400' : 'text-amber-300'
                      }`}
                    />
                    <span>{item.likesCount} 個靈魂祝福</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
