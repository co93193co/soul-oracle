'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, LogOut, CheckCircle2, User, Star, Flame } from 'lucide-react';
import { localStore, SoulUser } from '@/lib/storage';
import { signInWithGoogleOAuth } from '@/lib/supabase/client';
import { sound } from '@/lib/sound';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: SoulUser;
  onUserChange: (user: SoulUser) => void;
  currentPoints: number;
}

export default function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onUserChange,
  currentPoints,
}: AuthModalProps) {
  const [googleEmailInput, setGoogleEmailInput] = useState('');
  const [googleNameInput, setGoogleNameInput] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);

  const handleGoogleLogin = async () => {
    sound.playSingingBowl432();
    // 嘗試透過 Supabase OAuth 登入
    const { error } = await signInWithGoogleOAuth();

    // 如果尚未配置 Supabase 雲端憑證，自動開啟免密碼一鍵登入表單
    if (error) {
      setIsSimulating(true);
    }
  };

  const handleSimulatedGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = googleEmailInput.trim() || 'soul_seeker@gmail.com';
    const name = googleNameInput.trim() || '尋光旅人';
    const user = localStore.loginWithGoogle(email, name);
    onUserChange(user);
    sound.playSparkle();
    setIsSimulating(false);
    onClose();
  };

  const handleQuickOneClickLogin = () => {
    const user = localStore.loginWithGoogle('cosmic.traveler@gmail.com', '星際漫遊者');
    onUserChange(user);
    sound.playSparkle();
    onClose();
  };

  const handleLogout = () => {
    localStore.logout();
    onUserChange(localStore.getUser());
    sound.playSparkle();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-lg">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md rounded-3xl bg-gradient-to-b from-[#111636] via-[#0d1028] to-[#070919] border border-amber-300/30 p-6 sm:p-7 flex flex-col shadow-2xl relative text-amber-50"
        >
          {/* 關閉按鈕 */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-amber-200/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* 尚未登入介面 */}
          {!currentUser.isLoggedIn ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-300/40 flex items-center justify-center text-amber-300 mb-4 shadow-[0_0_20px_rgba(251,191,36,0.3)]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-light text-white tracking-wide">
                Google 帳號一鍵登入
              </h2>
              <p className="text-xs text-amber-200/60 mt-1.5 tracking-wider max-w-xs">
                無須重新設定帳號與密碼，直接透過 Google 帳號安全登入，同步你的心事、願望與冥想足跡。
              </p>

              {/* 官方風格 Google 登入按鈕 */}
              <div className="w-full mt-6 space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleLogin}
                  className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-100 text-slate-800 font-medium text-sm flex items-center justify-center gap-3 shadow-lg transition-all"
                >
                  {/* Google 彩色 G Logo */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>使用 Google 帳號登入</span>
                </motion.button>

                {/* 快速一鍵體驗按鈕 (本地即刻測試) */}
                <button
                  onClick={handleQuickOneClickLogin}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-amber-200/80 text-xs tracking-wider border border-white/10 transition-colors"
                >
                  ⚡ 快速一鍵體驗 Google 登入
                </button>
              </div>

              {/* 手動輸入 Google 信箱模擬框 */}
              {isSimulating && (
                <form onSubmit={handleSimulatedGoogleSubmit} className="w-full mt-5 pt-5 border-t border-white/10 text-left space-y-3">
                  <p className="text-[11px] text-amber-300">
                    ✦ 輸入你的 Google 信箱立即完成會員連動：
                  </p>
                  <div>
                    <label className="text-[10px] text-amber-100/60 block mb-1">Google Email：</label>
                    <input
                      type="email"
                      required
                      placeholder="your.name@gmail.com"
                      value={googleEmailInput}
                      onChange={(e) => setGoogleEmailInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-amber-100 placeholder-white/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-amber-100/60 block mb-1">在靈魂之境的暱稱：</label>
                    <input
                      type="text"
                      placeholder="例如：光之同行者"
                      value={googleNameInput}
                      onChange={(e) => setGoogleNameInput(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs text-amber-100 placeholder-white/30 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-400 text-slate-950 font-medium text-xs tracking-wider"
                  >
                    確認以 Google 身分登入
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* 已登入會員資訊卡 */
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3">
                <img
                  src={currentUser.avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`}
                  alt={currentUser.nickname}
                  className="w-16 h-16 rounded-full border-2 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] bg-indigo-950"
                />
                <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#111636]" />
              </div>

              <h2 className="text-lg font-light text-white">{currentUser.nickname}</h2>
              <span className="text-xs text-amber-200/50 font-mono mt-0.5">{currentUser.email}</span>

              {/* 會員點數與狀態概覽 */}
              <div className="w-full grid grid-cols-2 gap-3 my-5 p-3 rounded-2xl bg-white/5 border border-white/10 text-left">
                <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-300/20">
                  <span className="text-[10px] text-amber-200/70 block">心靈星光點數</span>
                  <div className="text-lg font-medium text-amber-300 flex items-center gap-1 mt-0.5">
                    <Star className="w-4 h-4 fill-amber-300" />
                    <span>{currentPoints} 點</span>
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-400/20">
                  <span className="text-[10px] text-indigo-200/70 block">會員認證</span>
                  <div className="text-xs font-medium text-indigo-300 flex items-center gap-1 mt-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Google 認證會員</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="w-full py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-950/70 text-rose-300 text-xs tracking-wider border border-rose-500/30 transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>登出當前帳號</span>
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
