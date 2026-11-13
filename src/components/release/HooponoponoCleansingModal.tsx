'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Heart,
  Headphones,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import SmilingCosmicOrb from '@/components/shared/SmilingCosmicOrb';
import VoiceInputButton from '@/components/shared/VoiceInputButton';
import { sound } from '@/lib/sound';

interface HooponoponoCleansingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPointsUpdated?: (newPoints: number) => void;
}

export type CleansingVersion = 'zen' | 'voice' | 'classic';

// 夏威夷四句真言設定（柔和溫暖流動、專屬神聖頻率與心靈引導）
const MANTRAS = [
  {
    phrase: '對不起',
    hawaiian: 'E kala mai iaʻu',
    freq: 396, // 396 Hz 釋放自責與恐懼
    zenSoul: '看見傷痛，承認記憶',
    meaning: '看見並承認內在重播的記憶與傷痛，向神性全然坦承',
    guide: '溫和地看見自己，放下心中的對抗與防備',
    voiceSpeech: '對不起。看見傷痛，承認記憶，向神性坦承。',
    glowColor: 'rgba(251, 191, 36, 0.45)', // 溫暖晨曦暖金
    glowRadial: 'radial-gradient(circle, rgba(251,191,36,0.35) 0%, rgba(245,158,11,0.12) 50%, transparent 75%)',
  },
  {
    phrase: '請原諒我',
    hawaiian: 'E kala mai',
    freq: 417, // 417 Hz 化解過去傷痛、促進情感轉化
    zenSoul: '釋懷苛責，允許寬恕',
    meaning: '祈求神性原諒自己的執念與苛責，讓內心重新回到柔軟寬恕',
    guide: '允許寬恕如甘霖般流過心田，融化一切心結',
    voiceSpeech: '請原諒我。釋懷過去的苛責與執念，允許寬恕流過心田。',
    glowColor: 'rgba(244, 114, 182, 0.45)', // 柔和粉晶玫瑰
    glowRadial: 'radial-gradient(circle, rgba(244,114,182,0.35) 0%, rgba(251,113,133,0.12) 50%, transparent 75%)',
  },
  {
    phrase: '謝謝你',
    hawaiian: 'Mahalo',
    freq: 528, // 528 Hz 愛的奇蹟與和諧
    zenSoul: '感謝相遇，感恩照見',
    meaning: '感謝這段相遇與經歷帶來的照見，感謝生命給予的成長功課',
    guide: '心懷純粹的感激，感謝所有相遇讓愛得以圓滿',
    voiceSpeech: '謝謝你。感謝生命的一切照見與經歷，讓愛得以圓滿。',
    glowColor: 'rgba(251, 146, 60, 0.45)', // 溫暖夕陽琥珀
    glowRadial: 'radial-gradient(circle, rgba(251,146,60,0.35) 0%, rgba(234,88,12,0.12) 50%, transparent 75%)',
  },
  {
    phrase: '我愛你',
    hawaiian: 'Aloha wau iā ʻoe',
    freq: 639, // 639 Hz 心輪連結、人際和諧與無條件大愛
    zenSoul: '回歸純淨，大愛圓滿',
    meaning: '以神性無條件的純粹大愛融化沉重記憶，回歸零的純淨與和平',
    guide: '送出無條件的光與愛，擁抱對方，也深愛自己',
    voiceSpeech: '我愛你。以無條件的大愛融化沉重記憶，回歸零的原點與和平。',
    glowColor: 'rgba(244, 63, 94, 0.5)', // 神聖愛心金紅玫瑰
    glowRadial: 'radial-gradient(circle, rgba(244,63,94,0.35) 0%, rgba(236,72,153,0.12) 50%, transparent 75%)',
  },
];

// 推薦快速和解對象
const QUICK_TARGETS_CLASSIC = [
  '內在受傷的自己',
  '某位在乎的人',
  '過去遺憾的經歷',
  '身體的病痛不適',
  '金錢匱乏的恐懼',
  '對未來的焦慮',
];

const QUICK_TARGETS_ZEN = [
  '內心苛責的自己',
  '某位在乎的人',
  '過去遺憾的經歷',
  '未來的焦慮恐懼',
];

export default function HooponoponoCleansingModal({
  isOpen,
  onClose,
}: HooponoponoCleansingModalProps) {
  const [step, setStep] = useState<'intro' | 'cleansing' | 'completed'>('intro');
  const [cleansingVersion, setCleansingVersion] = useState<CleansingVersion>('zen');
  const [cleansingTarget, setCleansingTarget] = useState('');

  // 清理計時（累計靜心秒數）與真言輪播
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [currentMantraIndex, setCurrentMantraIndex] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mantraTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 播放語音導引 (TTS)
  const speakMantra = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (sound.isMuted || isAudioMuted) return;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-TW';
      utterance.rate = 0.82; // 舒緩放鬆語速
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const targetVoice =
        voices.find((v) => v.lang.includes('zh-TW') || v.lang.includes('cmn-Hant-TW')) ||
        voices.find((v) => v.lang.includes('zh-HK')) ||
        voices.find((v) => v.lang.startsWith('zh'));
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // 容錯防禦
    }
  };

  // 初始化重設
  useEffect(() => {
    if (isOpen) {
      setStep('intro');
      setSecondsElapsed(0);
      setIsPaused(false);
      setCurrentMantraIndex(0);
      setIsAudioMuted(sound.isMuted);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mantraTimerRef.current) clearInterval(mantraTimerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isOpen]);

  // 切換版本
  const handleSwitchVersion = (ver: CleansingVersion) => {
    sound.playSparkle();
    setCleansingVersion(ver);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (step === 'cleansing' && ver === 'voice' && !isAudioMuted && !sound.isMuted) {
      speakMantra(MANTRAS[currentMantraIndex].voiceSpeech);
    }
  };

  // 開始清理體驗（100% 免費體驗，直接開啟）
  const handleStartCleansing = () => {
    sound.playSparkle();
    setStep('cleansing');
    setSecondsElapsed(0);
    setIsPaused(false);
    setCurrentMantraIndex(0);

    // 播放初始真言音效 (396Hz)
    sound.playCleansingChime(MANTRAS[0].freq, 3.8);

    // 若為第二版語音導引，溫柔朗讀
    if (cleansingVersion === 'voice' && !isAudioMuted && !sound.isMuted) {
      setTimeout(() => {
        speakMantra(MANTRAS[0].voiceSpeech);
      }, 500);
    }
  };

  // 計時器邏輯（記錄靜心秒數）
  useEffect(() => {
    if (step === 'cleansing' && !isPaused) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [step, isPaused]);

  // 真言輪播邏輯
  useEffect(() => {
    if (step === 'cleansing' && !isPaused) {
      // 語音版本給予 6.8 秒舒緩念誦時間，禪意與經典版為 5.5 秒
      const intervalMs = cleansingVersion === 'voice' ? 6800 : 5500;

      mantraTimerRef.current = setInterval(() => {
        setCurrentMantraIndex((prev) => {
          const nextIndex = (prev + 1) % MANTRAS.length;
          // 播放下一句對應的音頻
          sound.playCleansingChime(MANTRAS[nextIndex].freq, 3.8);

          // 若為第二版語音導引，同步朗讀
          if (cleansingVersion === 'voice' && !isAudioMuted && !sound.isMuted) {
            speakMantra(MANTRAS[nextIndex].voiceSpeech);
          }

          return nextIndex;
        });
      }, intervalMs);
    } else {
      if (mantraTimerRef.current) clearInterval(mantraTimerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }

    return () => {
      if (mantraTimerRef.current) clearInterval(mantraTimerRef.current);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [step, isPaused, cleansingVersion, isAudioMuted]);

  // 暫停切換
  const handleTogglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    if (nextPaused) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else if (cleansingVersion === 'voice' && !isAudioMuted && !sound.isMuted) {
      speakMantra(MANTRAS[currentMantraIndex].voiceSpeech);
    }
  };

  // 完成清理
  const handleCompleteCleansing = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mantraTimerRef.current) clearInterval(mantraTimerRef.current);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }

    setStep('completed');
    sound.playSingingBowl528(5);

    // 施放祝福星塵特效
    try {
      confetti({
        particleCount: 75,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#2dd4bf', '#38bdf8', '#fbbf24', '#f472b6', '#a855f7'],
      });
    } catch {
      // 容錯防禦
    }
  };

  // 音訊切換
  const handleToggleAudio = () => {
    const nextMuted = !isAudioMuted;
    setIsAudioMuted(nextMuted);
    sound.isMuted = nextMuted;
    if (nextMuted) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      sound.playSparkle();
      if (step === 'cleansing' && cleansingVersion === 'voice') {
        speakMantra(MANTRAS[currentMantraIndex].voiceSpeech);
      }
    }
  };

  // 時間格式轉換
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 當前真言與進度
  const currentMantra = MANTRAS[currentMantraIndex];
  const progressRatio = (currentMantraIndex + 1) / MANTRAS.length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        className="w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-gradient-to-b from-[#16122c]/98 via-[#0e0b1d]/98 to-[#070510] border border-amber-400/35 shadow-[0_0_60px_rgba(251,191,36,0.2)] p-4 sm:p-6 relative flex flex-col text-amber-50"
      >
        {/* ================= 頂部狀態列 ================= */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-400/20 mb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xl">🌊</span>
            <div>
              <h2 className="text-sm sm:text-base font-medium text-amber-100 tracking-wider flex items-center gap-1.5">
                夏威夷零極限 ‧ 清理之門
              </h2>
              <p className="text-[10.5px] sm:text-[11px] text-amber-200/80 font-light tracking-wide">
                Hoʻoponopono 和解與清空潛意識殿堂
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* 全程免費徽章 */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/35 text-emerald-300 text-xs font-medium">
              <Heart className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300/30" />
              <span>全程免費</span>
            </div>

            {/* 靜音切換 */}
            <button
              type="button"
              onClick={handleToggleAudio}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-amber-200 transition-colors cursor-pointer"
              aria-label={isAudioMuted ? '開啟聲音' : '靜音'}
            >
              {isAudioMuted ? (
                <VolumeX className="w-4 h-4 text-rose-300" />
              ) : (
                <Volume2 className="w-4 h-4 text-amber-300" />
              )}
            </button>

            {/* 關閉按鈕 */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-amber-200 hover:text-white transition-colors cursor-pointer"
              aria-label="關閉清理之門"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ================= 核心：三版本切換器（一鍵切換比較體驗） ================= */}
        <div className="flex items-center justify-center p-1 rounded-2xl bg-black/50 border border-amber-400/25 mb-3.5 text-[11px] sm:text-xs shrink-0 select-none">
          <button
            type="button"
            onClick={() => handleSwitchVersion('zen')}
            className={`flex-1 py-1.5 px-1.5 sm:px-2 rounded-xl transition-all cursor-pointer font-medium flex items-center justify-center gap-1 ${
              cleansingVersion === 'zen'
                ? 'bg-gradient-to-r from-amber-500/35 via-rose-500/25 to-amber-600/35 text-white border border-amber-300/60 shadow-[0_0_12px_rgba(251,191,36,0.3)] scale-[1.02]'
                : 'text-amber-200/65 hover:text-amber-100 hover:bg-white/5'
            }`}
          >
            <span>✨ 第一版：極淨禪意</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchVersion('voice')}
            className={`flex-1 py-1.5 px-1.5 sm:px-2 rounded-xl transition-all cursor-pointer font-medium flex items-center justify-center gap-1 ${
              cleansingVersion === 'voice'
                ? 'bg-gradient-to-r from-rose-500/35 via-purple-500/25 to-rose-600/35 text-white border border-rose-300/60 shadow-[0_0_12px_rgba(244,63,94,0.3)] scale-[1.02]'
                : 'text-amber-200/65 hover:text-amber-100 hover:bg-white/5'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-rose-300" />
            <span>第二版：語音導引</span>
          </button>
          <button
            type="button"
            onClick={() => handleSwitchVersion('classic')}
            className={`flex-1 py-1.5 px-1.5 sm:px-2 rounded-xl transition-all cursor-pointer font-medium flex items-center justify-center gap-1 ${
              cleansingVersion === 'classic'
                ? 'bg-gradient-to-r from-teal-500/35 via-cyan-500/25 to-teal-600/35 text-white border border-teal-300/60 shadow-[0_0_12px_rgba(45,212,191,0.3)] scale-[1.02]'
                : 'text-amber-200/65 hover:text-amber-100 hover:bg-white/5'
            }`}
          >
            <span>📜 第三版：經典詳解</span>
          </button>
        </div>

        {/* ================= 階段一：介紹與準備 (intro) ================= */}
        {step === 'intro' && (
          <div className="flex flex-col gap-3.5 sm:gap-4">
            {/* --- 根據所選版本顯示不同的說明卡片 --- */}
            {/* 1. 第一版（極淨禪意版）：極簡留白、呼吸純淨 */}
            {cleansingVersion === 'zen' && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-rose-500/10 to-indigo-950/30 border border-amber-400/30 text-left shadow-sm">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs sm:text-[13px] mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>夏威夷零極限 ‧ 極淨和解心法</span>
                </div>
                <p className="text-xs text-amber-100/90 leading-relaxed font-light mb-2.5">
                  外在感知的一切紛擾皆是潛意識的「重播記憶」。為體驗的一切負起{' '}
                  <span className="text-amber-300 font-medium">100% 全然責任</span>
                  ，以無條件純粹之愛洗滌歸零，回歸神聖的平靜：
                </p>
                <div className="flex items-center justify-between gap-1.5 text-center text-xs">
                  <div className="flex-1 py-1.5 px-1 rounded-xl bg-amber-400/15 border border-amber-300/30 text-amber-100 font-medium">
                    對不起
                  </div>
                  <div className="flex-1 py-1.5 px-1 rounded-xl bg-rose-400/15 border border-rose-300/30 text-rose-100 font-medium">
                    請原諒我
                  </div>
                  <div className="flex-1 py-1.5 px-1 rounded-xl bg-orange-400/15 border border-orange-300/30 text-orange-100 font-medium">
                    謝謝你
                  </div>
                  <div className="flex-1 py-1.5 px-1 rounded-xl bg-pink-400/15 border border-pink-300/30 text-pink-100 font-medium">
                    我愛你
                  </div>
                </div>
              </div>
            )}

            {/* 2. 第二版（極淨畫面 ＋ 語音導引版）：同第一版極淨，但提示語音朗讀 */}
            {cleansingVersion === 'voice' && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-rose-500/15 via-purple-500/15 to-indigo-950/35 border border-rose-400/35 text-left shadow-sm">
                <div className="flex items-center gap-2 text-rose-200 font-semibold text-xs sm:text-[13px] mb-1.5">
                  <Headphones className="w-4 h-4 text-rose-300 animate-pulse" />
                  <span>夏威夷零極限 ‧ 溫柔語音導引</span>
                </div>
                <p className="text-xs text-rose-100/90 leading-relaxed font-light mb-2">
                  進入清理之門後，系統將以<span className="text-rose-200 font-medium">溫和慢速語音</span>
                  自動為您朗讀四句真言與心靈引導。您可以放鬆雙眼、跟隨聲音在心中默念和解。
                </p>
                <div className="p-2 rounded-xl bg-black/40 border border-rose-300/25 text-center text-[11px] sm:text-xs text-rose-200/90 font-light">
                  ✦ 畫面維持極致純淨無雜訊 ‧ 戴上耳機聆聽效果更佳 ✦
                </div>
              </div>
            )}

            {/* 3. 第三版（經典詳解版 / 原始保留版）：完整多色四方塊與長文 */}
            {cleansingVersion === 'classic' && (
              <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-teal-900/20 to-purple-950/25 border border-amber-400/30 shadow-md text-left">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs sm:text-[13px] mb-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
                  <span>夏威夷零極限和解智慧（Hoʻoponopono）</span>
                </div>
                <p className="text-[11.5px] sm:text-xs text-amber-100/90 leading-relaxed font-light mb-2.5">
                  外在所感知的一切紛擾、糾結與人事，本質皆是潛意識深處的「重播記憶」。
                  當我們由內在為自己所體驗的一切負起 <span className="text-amber-300 font-semibold">100% 全然責任</span>，
                  在心中默念四句神聖真言，以無條件純粹之愛將重播記憶徹底洗滌歸零，回歸神聖的平靜：
                </p>
                <div className="grid grid-cols-4 gap-1.5 sm:gap-2 text-center">
                  <div className="py-1.5 px-1 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-200">
                    <div className="text-xs sm:text-[13px] font-bold text-amber-100">對不起</div>
                    <div className="text-[9.5px] sm:text-[10px] text-amber-300/80 mt-0.5 font-light">承擔記憶</div>
                  </div>
                  <div className="py-1.5 px-1 rounded-xl bg-rose-500/15 border border-rose-400/30 text-rose-200">
                    <div className="text-xs sm:text-[13px] font-bold text-rose-100">請原諒我</div>
                    <div className="text-[9.5px] sm:text-[10px] text-rose-300/80 mt-0.5 font-light">祈求寬恕</div>
                  </div>
                  <div className="py-1.5 px-1 rounded-xl bg-orange-500/15 border border-orange-400/30 text-orange-200">
                    <div className="text-xs sm:text-[13px] font-bold text-orange-100">謝謝你</div>
                    <div className="text-[9.5px] sm:text-[10px] text-orange-300/80 mt-0.5 font-light">感恩照見</div>
                  </div>
                  <div className="py-1.5 px-1 rounded-xl bg-pink-500/15 border border-pink-400/30 text-pink-200">
                    <div className="text-xs sm:text-[13px] font-bold text-pink-100">我愛你</div>
                    <div className="text-[9.5px] sm:text-[10px] text-pink-300/80 mt-0.5 font-light">大愛歸零</div>
                  </div>
                </div>
              </div>
            )}

            {/* 和解對象設定（選填） */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs text-amber-200 font-medium">
                  想著和解的那個人、那件事（選填）：
                </label>
                <VoiceInputButton
                  value={cleansingTarget}
                  onChange={setCleansingTarget}
                  themeColor="amber"
                  size="sm"
                  label="語音輸入"
                />
              </div>

              {/* 快捷點選 */}
              <div className="flex flex-wrap gap-1.5">
                {(cleansingVersion === 'classic' ? QUICK_TARGETS_CLASSIC : QUICK_TARGETS_ZEN).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      sound.playSparkle();
                      setCleansingTarget(t);
                    }}
                    className={`text-[11px] py-1 px-2.5 rounded-full border transition-all cursor-pointer ${
                      cleansingTarget === t
                        ? 'bg-amber-500/30 border-amber-300 text-white font-medium shadow-[0_0_10px_rgba(251,191,36,0.35)]'
                        : 'bg-white/5 border-white/10 text-amber-200/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* 自訂書寫 */}
              <input
                type="text"
                value={cleansingTarget}
                onChange={(e) => setCleansingTarget(e.target.value)}
                placeholder="例如：內在苛責的自己、父親、伴侶、主管、某次挫折遺憾..."
                maxLength={40}
                className="w-full px-3.5 py-2.5 rounded-xl bg-black/40 border border-amber-500/30 text-amber-50 placeholder-amber-300/30 text-xs sm:text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
              />
            </div>

            {/* 最底下鏈接按鈕：準備開啟清理之門 */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleStartCleansing}
              className="w-full py-3.5 sm:py-4 rounded-2xl flex items-center justify-center gap-2 font-medium tracking-wider text-xs sm:text-sm text-white bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 hover:from-amber-400 hover:via-rose-400 hover:to-amber-500 shadow-[0_0_24px_rgba(251,191,36,0.4)] border border-amber-300/50 cursor-pointer transition-all mt-1"
            >
              <Sparkles className="w-4 h-4 text-amber-100 animate-pulse" />
              <span className="font-semibold text-sm sm:text-base">
                {cleansingVersion === 'voice'
                  ? '開啟清理之門 ‧ 進入語音導引 ➔'
                  : '準備開啟清理之門 ➔'}
              </span>
            </motion.button>
          </div>
        )}

        {/* ================= 階段二：清理進行中 (cleansing) ================= */}
        {step === 'cleansing' && (
          <div className="flex flex-col items-center justify-between min-h-[440px] sm:min-h-[470px] py-2 sm:py-3 relative">
            {/* 背景溫暖心光柔和光暈 (如溫暖心跳與朝陽微風般緩緩呼吸) */}
            <motion.div
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.35, 0.6, 0.35],
              }}
              transition={{
                duration: cleansingVersion === 'voice' ? 6.8 : 5.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 pointer-events-none rounded-3xl blur-3xl transition-all duration-1000"
              style={{
                background: currentMantra.glowRadial,
              }}
            />

            {/* 頂部和解引導：想著和解的那個人、那件事，開始念著... */}
            <div className="w-full flex flex-col items-center justify-center text-center mb-2 z-10 px-2">
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/25 via-rose-500/25 to-amber-500/25 border border-amber-300/50 text-amber-100 shadow-[0_0_20px_rgba(251,191,36,0.25)]"
              >
                <Heart className="w-4 h-4 text-rose-300 fill-rose-300/40 animate-pulse shrink-0" />
                <span className="text-xs sm:text-sm font-medium tracking-wide">
                  {cleansingTarget.trim()
                    ? `想著要和解的【${cleansingTarget.trim()}】，開始念著...`
                    : '想著和解的那個人、那件事，開始念著...'}
                </span>
              </motion.div>
              <div className="text-[11px] text-amber-200/70 font-mono mt-1 flex items-center gap-2">
                <span>已和解靜心：{formatTime(secondsElapsed)}</span>
              </div>
            </div>

            {/* 溫暖金粉進度條 */}
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-3 z-10">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 via-rose-300 to-amber-200"
                style={{ width: `${progressRatio * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* 僅第三版（經典詳解版）顯示上方四句標籤流動條 */}
            {cleansingVersion === 'classic' && (
              <div className="w-full flex items-center justify-center gap-1.5 sm:gap-2 my-1 z-10">
                {MANTRAS.map((m, idx) => {
                  const isCurrent = idx === currentMantraIndex;
                  return (
                    <div
                      key={m.phrase}
                      className={`px-2.5 sm:px-3 py-1 rounded-full transition-all duration-700 flex items-center gap-1 text-[11px] sm:text-xs select-none ${
                        isCurrent
                          ? 'bg-amber-400/25 border border-amber-300/80 text-white font-semibold shadow-[0_0_12px_rgba(251,191,36,0.45)] scale-105'
                          : 'bg-white/5 border border-white/10 text-amber-100/40 font-light'
                      }`}
                    >
                      {isCurrent && <span className="w-1.5 h-1.5 rounded-full bg-amber-300 animate-pulse" />}
                      <span>{m.phrase}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ================= 中央四句神聖箴言 ================= */}
            <div className="w-full flex-1 flex flex-col items-center justify-center text-center my-3 relative min-h-[220px] z-10">
              {/* 核心柔和暖陽光暈 */}
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.55, 0.85, 0.55],
                }}
                transition={{
                  duration: cleansingVersion === 'voice' ? 6.8 : 5.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute w-52 h-52 sm:w-64 sm:h-64 rounded-full pointer-events-none blur-2xl"
                style={{
                  background: currentMantra.glowRadial,
                }}
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMantra.phrase}
                  initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
                  transition={{
                    duration: 1.2,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="flex flex-col items-center justify-center z-10 max-w-md px-3"
                >
                  {/* 第三版（經典版）才顯示夏威夷聖名 */}
                  {cleansingVersion === 'classic' && (
                    <span className="text-[11.5px] sm:text-xs text-amber-200/90 font-mono tracking-[0.25em] uppercase mb-1 drop-shadow-sm select-none">
                      ✦ {currentMantra.hawaiian} ✦
                    </span>
                  )}

                  {/* 核心真言：超大溫暖字體，隨呼吸微幅緩慢起伏 */}
                  <motion.h1
                    animate={{
                      scale: [1, 1.03, 1],
                    }}
                    transition={{
                      duration: cleansingVersion === 'voice' ? 6.8 : 5.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="text-5xl xs:text-6xl sm:text-7xl font-light text-amber-50 tracking-[0.2em] sm:tracking-[0.25em] whitespace-nowrap select-none my-2.5 drop-shadow-[0_0_25px_rgba(251,191,36,0.45)]"
                  >
                    {currentMantra.phrase}
                  </motion.h1>

                  {/* 第一版與第二版：極簡靈魂短語 */}
                  {cleansingVersion !== 'classic' && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm sm:text-base text-amber-200 font-light tracking-widest mt-1 drop-shadow-sm"
                    >
                      {currentMantra.zenSoul}
                    </motion.p>
                  )}

                  {/* 第二版：語音導引動態提示標籤 */}
                  {cleansingVersion === 'voice' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-200 text-[11px] mt-2.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                      <span>語音溫柔導引中 ‧ 請閉眼呼吸</span>
                    </motion.div>
                  )}

                  {/* 第三版（經典版）：完整雙層詳細釋義 */}
                  {cleansingVersion === 'classic' && (
                    <>
                      <p className="text-xs sm:text-[13.5px] text-amber-100 font-normal leading-relaxed max-w-sm mt-2 px-2 drop-shadow-sm">
                        {currentMantra.meaning}
                      </p>
                      <span className="text-[11px] sm:text-xs text-amber-300 font-medium mt-1.5 tracking-wide">
                        {currentMantra.guide}
                      </span>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* 僅第三版（經典版）顯示底部兩行提示語 */}
            {cleansingVersion === 'classic' && (
              <div className="w-full text-center mb-3 z-10">
                <motion.p
                  animate={{ opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-xs sm:text-[12.5px] text-amber-200/95 font-light tracking-wider"
                >
                  ✦ 請在心中溫柔默念，將這份純淨之光送給需要和解的人事物 ✦
                </motion.p>
                <p className="text-[10px] sm:text-[11px] text-amber-200/60 font-mono mt-1">
                  Solfeggio 聖音和解頻率溫潤調頻中
                </p>
              </div>
            )}

            {/* 底部控制欄 */}
            <div className="w-full flex items-center justify-center gap-3 z-10 mt-1">
              <button
                type="button"
                onClick={handleTogglePause}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/15 text-xs text-amber-100 border border-white/15 transition-all cursor-pointer shadow-sm"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                <span>{isPaused ? '繼續清理' : '暫停'}</span>
              </button>

              <button
                type="button"
                onClick={handleCompleteCleansing}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500/25 via-rose-500/25 to-amber-500/25 hover:from-amber-500/35 hover:via-rose-500/35 hover:to-amber-500/35 text-xs text-amber-100 border border-amber-300/50 transition-all cursor-pointer shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:scale-[1.02]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                <span>圓滿完成和解</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= 階段三：完成祝禱與歸零 (completed) ================= */}
        {step === 'completed' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center text-center py-6 px-2 gap-5"
          >
            {/* 圓滿微笑光球 */}
            <div className="my-2">
              <SmilingCosmicOrb
                size="md"
                themeColor="teal"
                sparkleStyle="original"
                guideText="一切沉重記憶已在愛中融化，回歸零的和平"
              />
            </div>

            <div className="flex flex-col items-center gap-2 max-w-md">
              <span className="text-xs text-teal-300 font-mono tracking-widest">
                ✦ 零極限 ‧ 和解圓滿 ✦
              </span>
              <h3 className="text-xl sm:text-2xl font-light text-white tracking-widest">
                一切記憶已被愛洗滌釋放
              </h3>
              <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed font-light mt-1">
                「對不起、請原諒我、謝謝你、我愛你」
                <br />
                當你由心底為感知的一切負起責任，神聖的靈光便已取代糾結。
                你已回到潔淨無瑕的「零」的原點，願純粹的平靜永遠與你同在。
              </p>
            </div>

            {/* 底部按鈕 */}
            <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  sound.playSparkle();
                  setStep('intro');
                }}
                className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-teal-100 text-xs tracking-wider border border-white/10 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>為另一人事物再次清理</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white text-xs tracking-wider border border-teal-300/40 shadow-lg transition-all cursor-pointer"
              >
                圓滿返回釋放之門
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
