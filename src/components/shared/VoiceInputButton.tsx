'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, AlertCircle } from 'lucide-react';
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
    listening: 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.5)]',
    dot: 'bg-rose-400',
  },
  amber: {
    idle: 'bg-amber-500/15 hover:bg-amber-500/25 border-amber-400/40 text-amber-200 hover:text-white',
    listening: 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.5)]',
    dot: 'bg-rose-400',
  },
  purple: {
    idle: 'bg-purple-500/15 hover:bg-purple-500/25 border-purple-400/40 text-purple-200 hover:text-white',
    listening: 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.5)]',
    dot: 'bg-rose-400',
  },
  teal: {
    idle: 'bg-teal-500/15 hover:bg-teal-500/25 border-teal-400/40 text-teal-200 hover:text-white',
    listening: 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.5)]',
    dot: 'bg-rose-400',
  },
  rose: {
    idle: 'bg-rose-500/15 hover:bg-rose-500/25 border-rose-400/40 text-rose-200 hover:text-white',
    listening: 'bg-rose-500/30 border-rose-400 text-rose-100 shadow-[0_0_15px_rgba(244,63,94,0.5)]',
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
  const {
    isListening,
    isSupported,
    errorMessage,
    toggleListening,
    setErrorMessage,
  } = useVoiceInput(() => value, {
    onTextChange: onChange,
  });

  const theme = THEME_STYLES[themeColor] || THEME_STYLES.indigo;

  // 尺寸設定
  const isSm = size === 'sm';
  const iconSize = isSm ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
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
              ? 'px-2.5 py-0.5 rounded-full text-[11px]'
              : 'px-3 py-1 rounded-full text-xs'
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
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-rose-400 relative" />
          </span>
        ) : (
          <Mic className={`${iconSize} shrink-0 opacity-90`} />
        )}

        {/* 標籤文字 (若為 pill 模式) */}
        {variant === 'pill' && (
          <span className="font-medium tracking-tight">
            {isListening ? '聆聽中... (講完點我)' : label}
          </span>
        )}
      </motion.button>

      {/* 錯誤提示氣泡 */}
      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.92 }}
            className="absolute bottom-full mb-1.5 right-0 z-50 w-56 p-2 rounded-xl bg-slate-900/95 border border-amber-400/40 text-amber-200 text-[11px] leading-relaxed shadow-xl backdrop-blur-md flex items-start gap-1.5"
          >
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="block text-[10px] text-amber-300/80 hover:text-white underline mt-1 cursor-pointer"
              >
                我知道了
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
