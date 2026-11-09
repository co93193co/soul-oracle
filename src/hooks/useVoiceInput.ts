'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { sound } from '@/lib/sound';

export interface UseVoiceInputOptions {
  /**
   * 當語音辨識有新文字產出時的回調（傳回目前整段文字：既有文字 + 新語音輸入）
   */
  onTextChange?: (fullText: string) => void;
  /**
   * 當語音辨識完成一段時產出的片段
   */
  onSegment?: (segment: string) => void;
  /**
   * 語言代碼，預設為臺灣中文 'zh-TW'
   */
  lang?: string;
}

export function useVoiceInput(
  getCurrentText: () => string,
  options: UseVoiceInputOptions = {}
) {
  const { lang = 'zh-TW', onTextChange, onSegment } = options;

  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');
  const sessionFinalsRef = useRef<string>('');

  // 偵測瀏覽器支援度
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hasSupport = !!(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
    setIsSupported(hasSupport);
  }, []);

  // 停止辨識
  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // 忽略已停止的錯誤
      }
      recognitionRef.current = null;
    }
    setIsListening(false);
    try {
      sound.playSparkle();
    } catch {
      // 容錯防禦
    }
  }, []);

  // 開始辨識
  const startListening = useCallback(() => {
    setErrorMessage(null);

    if (typeof window === 'undefined') return;
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      setErrorMessage('您的瀏覽器目前未開啟語音辨識功能，建議使用 Google Chrome 或 Safari 瀏覽器。');
      return;
    }

    // 記錄開始聆聽前原本已有的文字
    const current = getCurrentText();
    baseTextRef.current = current ? current.trim() : '';
    sessionFinalsRef.current = '';

    try {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = lang;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        try {
          sound.playSparkle();
        } catch {
          // 容錯
        }
      };

      recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let currentFinals = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const item = event.results[i];
          const transcript = item[0]?.transcript || '';
          if (item.isFinal) {
            currentFinals += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (currentFinals) {
          sessionFinalsRef.current += (sessionFinalsRef.current ? ' ' : '') + currentFinals.trim();
          if (onSegment) {
            onSegment(currentFinals.trim());
          }
        }

        const activeVoiceText = (
          sessionFinalsRef.current +
          (interimTranscript ? (sessionFinalsRef.current ? ' ' : '') + interimTranscript.trim() : '')
        ).trim();

        if (activeVoiceText && onTextChange) {
          const base = baseTextRef.current;
          let combined = '';
          if (base) {
            // 自動補上自然空格或標點連接
            const endsWithPunctuation = /[，。！？；：、]$/.test(base);
            combined = endsWithPunctuation ? `${base}${activeVoiceText}` : `${base} ${activeVoiceText}`;
          } else {
            combined = activeVoiceText;
          }
          onTextChange(combined);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition event:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          setErrorMessage('請點擊網址列麥克風圖示「允許麥克風權限」以使用語音打字。');
          stopListening();
        } else if (event.error === 'no-speech') {
          // 靜音無語音，保持繼續聆聽
        } else if (event.error === 'network') {
          setErrorMessage('語音辨識網路訊號不穩，請稍候再試。');
          stopListening();
        } else {
          // 其他錯誤平穩處理
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      setErrorMessage('無法啟動麥克風，請確認瀏覽器支援與權限設定。');
      setIsListening(false);
    }
  }, [getCurrentText, lang, onSegment, onTextChange, stopListening]);

  // 切換開關
  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  // 清除資源
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // 容錯
        }
      }
    };
  }, []);

  return {
    isListening,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
    setErrorMessage,
  };
}
