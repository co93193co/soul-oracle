'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, AlertCircle, X, Check, Copy } from 'lucide-react';
import { useVoiceInput } from '@/hooks/useVoiceInput';

export interface VoiceInputButtonProps {
  /**
   * 當前輸入框的文字值
   */
  value: string;
  /**
   * 當文字透過語音更新時的回調
   */
  onChange: (newValue: string) => void;
  /**
   * 按鈕外觀模式：'pill'（附帶文字標籤）或 'icon'（僅純圓形圖示）
   */
  variant?: 'pill' | 'icon';
  /**
   * 色彩主題
   */
  themeColor?: 'indigo' | 'amber' | 'purple' | 'teal' | 'rose';
  /**
   * 尺寸
   */
  size?: 'sm' | 'md';
  /**
   * 自訂 class
   */
  className?: string;
  /**
   * 自訂閒置時標籤
   */
  label?: string;
}

const THEME_STYLES = {
  indigo: {
    idle: 'bg-indigo-500/15 hover:bg-indigo-500/25 border-indigo-400/40 text-indigo-200 hover:text-white',
    listening: 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-[0_0_18px_rgba(244,63,94,0.6)] animate-pulse',
    dot: 'bg-rose-400',
  },
  amber: {
    idle: 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/40 text-amber-200 hover:text-white',
    listening: 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-[0_0_18px_rgba(244,63,94,0.6)] animate-pulse',
    dot: 'bg-rose-400',
  },
  purple: {
    idle: 'bg-purple-500/15 hover:bg-purple-500/25 border-purple-400/40 text-purple-200 hover:text-white',
    listening: 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-[0_0_18px_rgba(244,63,94,0.6)] animate-pulse',
    dot: 'bg-rose-400',
  },
  teal: {
    idle: 'bg-teal-500/15 hover:bg-teal-500/25 border-teal-400/40 text-teal-200 hover:text-white',
    listening: 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-[0_0_18px_rgba(244,63,94,0.6)] animate-pulse',
    dot: 'bg-rose-400',
  },
  rose: {
    idle: 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-400/40 text-rose-200 hover:text-white',
    listening: 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-[0_0_18px_rgba(244,63,94,0.6)] animate-pulse',
    dot: 'bg-rose-400',
  },
};

export default function VoiceInputButton({
  value,
  onChange,
  variant = 'pill',
  themeColor = 'indigo',
  size = 'sm',
  className = '',
  label = '語音輸入',
}: VoiceInputButtonProps) {
  const [copied, setCopied] = useState(false);

  const {
    isListening,
    isSupported,
    errorMessage,
    showUnsupportedModal,
    setShowUnsupportedModal,
    toggleListening,
    stopListening,
    setErrorMessage,
  } = useVoiceInput(() => value, {
    onTextChange: onChange,
  });

  const theme = THEME_STYLES[themeColor] || THEME_STYLES.indigo;

  // 尺寸設定
  const isSm = size === 'sm';
  const iconSize = isSm ? 'w-3 h-3' : 'w-3.5 h-3.5';

  const handleCopyCurrentUrl = () => {
    if (typeof window !== 'undefined') {
      try {
        navigator.clipboard?.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch {
        // 容錯
      }
    }
  };

  return (
    <>
      <div className="relative inline-flex items-center">
        <motion.button
          type="button"
          whileTap={{ scale: 0.94 }}
          onClick={toggleListening}
          title={
            isListening
              ? '正在聆聽中... 點擊可停止並完成輸入'
              : isSupported
              ? '點擊啟動語音輸入（用講的即可自動打字）'
              : '此瀏覽器暫未開啟語音辨識支援，建議使用 Chrome 或 Safari'
          }
          className={`relative inline-flex items-center justify-center gap-1.5 border transition-all cursor-pointer select-none ${
            isListening ? theme.listening : theme.idle
          } ${
            variant === 'pill'
              ? isSm
                ? 'px-2.5 py-1 rounded-full text-[11px]'
                : 'px-3.5 py-1.5 rounded-full text-xs'
              : isSm
              ? 'p-1.5 rounded-full'
              : 'p-2 rounded-full'
          } ${className}`}
        >
          {/* 聆聽中的波紋擴散光環 */}
          {isListening && (
            <motion.span
              animate={{ scale: [1, 1.45, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border border-rose-400 pointer-events-none"
            />
          )}

          {/* 麥克風圖示 / 聆聽中紅點 */}
          {isListening ? (
            <span className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 relative" />
            </span>
          ) : (
            <Mic className={`${iconSize} shrink-0 opacity-90`} />
          )}

          {/* 標籤文字 (若為 pill 模式) */}
          {variant === 'pill' && (
            <span className="font-medium tracking-tight">
              {isListening ? '聆聽中... 請說話' : label}
            </span>
          )}
        </motion.button>
      </div>

      {/* ================= 全螢幕固定圖層：確保錯誤與提示永遠不會被 overflow 裁切 ================= */}
      {/* 1. 聆聽中底部浮動通知（點擊也可一鍵停止完成） */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={stopListening}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] px-4 py-2.5 rounded-full bg-gradient-to-r from-rose-950/95 via-purple-950/95 to-slate-950/95 border-2 border-rose-400/80 text-rose-100 text-xs sm:text-sm font-medium shadow-[0_0_30px_rgba(244,63,94,0.5)] backdrop-blur-md flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all select-none"
          >
            <span className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400 relative" />
            </span>
            <span>正在聆聽中... 請開口說話（點此完成打字）</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. 頂部錯誤提示橫幅（例如拒絕麥克風、網路異常） */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[9999] max-w-md w-[92%] p-3.5 sm:p-4 rounded-2xl bg-slate-950/95 border-2 border-amber-400/80 text-amber-100 text-xs sm:text-sm shadow-[0_0_35px_rgba(251,191,36,0.35)] backdrop-blur-md flex items-start gap-2.5 leading-relaxed"
          >
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-amber-200 mb-0.5">語音輸入提示</p>
              <p className="text-amber-100/90 text-xs">{errorMessage}</p>
            </div>
            <button
              type="button"
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300 hover:text-white transition-colors cursor-pointer shrink-0"
              aria-label="關閉提示"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. 不支援瀏覽器（如 LINE 內嵌瀏覽器或 Firefox）的友善彈窗引導 */}
      <AnimatePresence>
        {showUnsupportedModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-950 border border-amber-400/50 p-5 sm:p-6 rounded-3xl max-w-sm w-full text-center shadow-2xl text-amber-50 relative"
            >
              <button
                type="button"
                onClick={() => setShowUnsupportedModal(false)}
                className="absolute top-3.5 right-3.5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-amber-200 transition-colors cursor-pointer"
                aria-label="關閉"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-3 text-2xl">
                🎙️
              </div>

              <h3 className="text-base sm:text-lg font-bold text-white mb-2 tracking-wide">
                開啟瀏覽器語音輸入
              </h3>

              <p className="text-xs text-amber-200/85 mb-4 leading-relaxed font-light">
                您目前使用的瀏覽器環境（例如 LINE 內建瀏覽器、Facebook 瀏覽器或部分舊核心）暫未開放系統語音辨識 API。<br /><br />
                請使用 <strong>Google Chrome</strong> 或 <strong>Safari</strong> 瀏覽器開啟，即可立即享受「用講的自動打字」！
              </p>

              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={handleCopyCurrentUrl}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-bold text-xs tracking-wider shadow-[0_0_15px_rgba(251,191,36,0.4)] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-800" />
                      <span>已複製網址！請至 Chrome / Safari 開啟</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>一鍵複製網址到 Chrome / Safari 開啟</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowUnsupportedModal(false)}
                  className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-amber-200/90 text-xs cursor-pointer transition-colors"
                >
                  我知道了，繼續手動打字
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
