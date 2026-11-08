'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  Music,
  Star,
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { localStore, MusicTrack, DEFAULT_MUSIC_TRACKS } from '@/lib/storage';
import { sound } from '@/lib/sound';

interface SoulMusicPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPoints: number;
  onPointsUpdated: (newPoints: number) => void;
  onOpenMeditation: () => void;
}

export default function SoulMusicPlayerModal({
  isOpen,
  onClose,
  currentPoints,
  onPointsUpdated,
  onOpenMeditation,
}: SoulMusicPlayerModalProps) {
  const [tracks, setTracks] = useState<MusicTrack[]>(DEFAULT_MUSIC_TRACKS);
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [confirmUnlockTrack, setConfirmUnlockTrack] = useState<MusicTrack | null>(null);
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTracks(localStore.getMusicTracks());
      setUnlockedIds(localStore.getUnlockedMusicTrackIds());
      if (!currentTrack) {
        setCurrentTrack(DEFAULT_MUSIC_TRACKS[0]);
      }
    }
  }, [isOpen]);

  const handleTrackSelect = (track: MusicTrack) => {
    const isUnlocked = unlockedIds.includes(track.id) || track.pricePoints === 0;

    if (!isUnlocked) {
      // 點擊未解鎖音樂，跳出確認提示
      setConfirmUnlockTrack(track);
      return;
    }

    // 播放音樂
    setCurrentTrack(track);
    setIsPlaying(true);
    sound.playSparkle();

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play().catch(() => {
        // 音訊若受瀏覽器限制，安全處理
      });
    }
  };

  const handleConfirmUnlock = () => {
    if (!confirmUnlockTrack) return;

    const result = localStore.unlockMusicTrack(confirmUnlockTrack);
    if (result.success) {
      sound.playSingingBowl528();
      setUnlockedIds(localStore.getUnlockedMusicTrackIds());
      onPointsUpdated(result.newPoints);
      setUnlockMessage(`🎉 成功解鎖「${confirmUnlockTrack.title}」！`);
      setTimeout(() => setUnlockMessage(null), 3000);

      // 自動切換並播放新解鎖的音樂
      handleTrackSelect(confirmUnlockTrack);
      setConfirmUnlockTrack(null);
    } else {
      alert(result.message);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#131733] via-[#0d1024] to-[#070914] border border-amber-300/30 p-5 sm:p-7 flex flex-col shadow-2xl relative text-amber-50"
        >
          {/* 隱藏的原生 Audio 元件 */}
          <audio
            ref={audioRef}
            loop
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              // 音訊載入安全 fallback
            }}
          />

          {/* 關閉按鈕 */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-amber-200/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 頂部標題與點數餘額 */}
          <div className="text-center mb-6">
            <span className="text-[11px] text-amber-300 tracking-widest uppercase block mb-1">
              Soul Sound Healing
            </span>
            <h2 className="text-xl sm:text-2xl font-light text-white tracking-wide flex items-center justify-center gap-2">
              <Music className="w-5 h-5 text-indigo-400" />
              <span>心靈音樂殿堂</span>
            </h2>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-400/10 border border-amber-300/30 text-amber-200 text-xs tracking-wider mt-2.5">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              <span>你的心靈點數：<strong>{currentPoints}</strong> 點 (可用於解鎖音樂)</span>
            </div>
          </div>

          {/* 解鎖成功提示 */}
          {unlockMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-950/70 border border-emerald-400/40 text-center text-xs text-emerald-200 font-medium"
            >
              {unlockMessage}
            </motion.div>
          )}

          {/* 當前正在播放的音樂展示卡 */}
          {currentTrack && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/70 via-purple-950/50 to-amber-950/40 border border-indigo-400/40 shadow-inner mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-slate-950 flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.5)] hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-slate-950" />
                  ) : (
                    <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
                  )}
                </button>
                <div>
                  <h4 className="text-sm font-medium text-white">{currentTrack.title}</h4>
                  <p className="text-xs text-amber-200/60 mt-0.5 line-clamp-1">
                    {currentTrack.description}
                  </p>
                </div>
              </div>

              {/* 音波動畫 */}
              {isPlaying && (
                <div className="flex items-end gap-1 h-6">
                  <span className="w-1 bg-amber-400 rounded-full animate-bounce h-4" />
                  <span className="w-1 bg-pink-400 rounded-full animate-bounce h-6 delay-75" />
                  <span className="w-1 bg-indigo-400 rounded-full animate-bounce h-3 delay-150" />
                  <span className="w-1 bg-amber-300 rounded-full animate-bounce h-5 delay-200" />
                </div>
              )}
            </div>
          )}

          {/* 音樂列表清單 */}
          <div className="space-y-2.5">
            <h4 className="text-xs text-amber-200/70 tracking-wider mb-2">
              ✦ 選擇心靈頻率與冥想音樂：
            </h4>

            {tracks.map((track) => {
              const isUnlocked = unlockedIds.includes(track.id) || track.pricePoints === 0;
              const isSelected = currentTrack?.id === track.id;

              return (
                <div
                  key={track.id}
                  onClick={() => handleTrackSelect(track)}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-900/40 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]'
                      : 'bg-white/5 border-white/10 hover:border-amber-300/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm ${
                        isUnlocked
                          ? 'bg-indigo-500/20 text-indigo-300'
                          : 'bg-white/5 text-amber-200/40'
                      }`}
                    >
                      {isUnlocked ? <Music className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-300" />}
                    </div>
                    <div>
                      <h5 className="text-xs sm:text-sm font-medium text-white flex items-center gap-2">
                        <span>{track.title}</span>
                        {isSelected && isPlaying && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-300">
                            播放中
                          </span>
                        )}
                      </h5>
                      <span className="text-[11px] text-amber-200/50 block mt-0.5">
                        時長：{track.durationLabel}
                      </span>
                    </div>
                  </div>

                  {/* 標籤：免費 vs 解鎖點數 */}
                  <div>
                    {track.pricePoints === 0 ? (
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        免費
                      </span>
                    ) : isUnlocked ? (
                      <span className="text-[11px] px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        已解鎖
                      </span>
                    ) : (
                      <button className="text-[11px] px-2.5 py-1 rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-300/40 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>{track.pricePoints} 點解鎖</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 解鎖確認 Modal 彈窗 */}
          <AnimatePresence>
            {confirmUnlockTrack && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="w-full max-w-sm rounded-2xl bg-[#161a38] border border-amber-300/40 p-5 text-center shadow-2xl relative"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 mx-auto mb-3">
                    <Sparkles className="w-5 h-5" />
                  </div>

                  <h3 className="text-base font-light text-white mb-2">解鎖心靈音樂</h3>
                  <p className="text-xs text-amber-100/80 leading-relaxed mb-4">
                    是否消耗 <strong className="text-amber-300">{confirmUnlockTrack.pricePoints} 點</strong> 心靈星光，永久解鎖：
                    <br />
                    <span className="text-indigo-200 font-medium">「{confirmUnlockTrack.title}」</span>？
                  </p>

                  <div className="text-[11px] text-amber-200/60 mb-5">
                    當前點數餘額：{currentPoints} 點
                    {currentPoints < confirmUnlockTrack.pricePoints && (
                      <div className="text-rose-400 mt-1 font-medium">
                        ⚠️ 點數不足，可透過「每日冥想」免費賺取點數！
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmUnlockTrack(null)}
                      className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-amber-100 transition-colors"
                    >
                      暫時不要
                    </button>
                    {currentPoints >= confirmUnlockTrack.pricePoints ? (
                      <button
                        onClick={handleConfirmUnlock}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-300 text-slate-950 font-medium text-xs shadow-md"
                      >
                        確認扣點解鎖
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setConfirmUnlockTrack(null);
                          onClose();
                          onOpenMeditation();
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md"
                      >
                        去冥想賺點數
                      </button>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
