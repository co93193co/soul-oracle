'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

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
  const [showUnsupportedModal, setShowUnsupportedModal] = useState(false);

  const isListeningRef = useRef(false);
  const recognitionRef = useRef<any>(null);
  const baseTextRef = useRef<string>('');
  const sessionFinalsRef = useRef<string>('');

  const getCurrentTextRef = useRef(getCurrentText);
  getCurrentTextRef.current = getCurrentText;
  const onTextChangeRef = useRef(onTextChange);
  onTextChangeRef.current = onTextChange;
  const onSegmentRef = useRef(onSegment);
  onSegmentRef.current = onSegment;

  // 偵測環境支援度
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
    isListeningRef.current = false;
    setIsListening(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // 容錯
      }
      recognitionRef.current = null;
    }
  }, []);

  // 開始辨識（同步啟動，避免 Safari 使用者手勢超時失效）
  const startListening = useCallback(() => {
    setErrorMessage(null);

    if (typeof window === 'undefined') return;
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      setShowUnsupportedModal(true);
      return;
    }

    // 判斷是否為 iOS Safari / WebKit 環境
    const isIOS =
      typeof navigator !== 'undefined' &&
      /iPad|iPhone|iPod/.test(navigator.userAgent);

    // 取得開始前的文字
    const current = getCurrentTextRef.current ? getCurrentTextRef.current() : '';
    baseTextRef.current = current ? current.trim() : '';
    sessionFinalsRef.current = '';

    // 立即更新狀態，給使用者最迅速的介面響應
    isListeningRef.current = true;
    setIsListening(true);

    try {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // 容錯
        }
        recognitionRef.current = null;
      }

      const recognition = new SpeechRecognitionClass();
      // 在 iOS Safari 上，continuous 設為 true 會導致 WebKit 引擎中斷或報錯，因此採單句自動循環重啟
      recognition.continuous = !isIOS;
      recognition.interimResults = true;
      recognition.lang = lang;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
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
          if (onSegmentRef.current) {
            onSegmentRef.current(currentFinals.trim());
          }
        }

        const activeVoiceText = (
          sessionFinalsRef.current +
          (interimTranscript ? (sessionFinalsRef.current ? ' ' : '') + interimTranscript.trim() : '')
        ).trim();

        if (activeVoiceText && onTextChangeRef.current) {
          const base = baseTextRef.current;
          let combined = '';
          if (base) {
            // 自動補上自然空格或標點連接
            const endsWithPunctuation = /[，。！？；：、]$/.test(base);
            combined = endsWithPunctuation ? `${base}${activeVoiceText}` : `${base} ${activeVoiceText}`;
          } else {
            combined = activeVoiceText;
          }
          onTextChangeRef.current(combined);
        }
      };

      recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          isListeningRef.current = false;
          setIsListening(false);
          setErrorMessage('請點擊網址列麥克風圖示「允許麥克風權限」；若使用 iPhone，請至手機「設定 > 一般 > 鍵盤」開啟「聽寫功能」。');
        } else if (event.error === 'no-speech') {
          // 靜音無語音，不中斷，等待使用者開口
        } else if (event.error === 'network') {
          setErrorMessage('語音辨識網路訊號不穩，請確認網路連線後再試。');
          stopListening();
        } else if (event.error === 'audio-capture') {
          setErrorMessage('未偵測到可用麥克風設備，請確認裝置麥克風已連接。');
          stopListening();
        }
      };

      recognition.onend = () => {
        // 如果使用者尚未手動點擊停止（例如在 iOS 單句結束或短暫停頓），自動無縫重啟以支援連續說話
        if (isListeningRef.current) {
          try {
            recognition.start();
          } catch {
            // 若瀏覽器安全限制停止重啟，則平順結束
            isListeningRef.current = false;
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      isListeningRef.current = false;
      setIsListening(false);
      setErrorMessage('無法啟動麥克風，請確認瀏覽器支援與麥克風權限設定。');
    }
  }, [lang, stopListening]);

  // 切換開關
  const toggleListening = useCallback(() => {
    if (isListeningRef.current) {
      stopListening();
    } else {
      startListening();
    }
  }, [startListening, stopListening]);

  // 清除資源
  useEffect(() => {
    return () => {
      isListeningRef.current = false;
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
    showUnsupportedModal,
    setShowUnsupportedModal,
    startListening,
    stopListening,
    toggleListening,
    setErrorMessage,
  };
}
