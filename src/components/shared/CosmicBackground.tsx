'use client';

import React, { useMemo } from 'react';

export default function CosmicBackground() {
  // 使用確定性虛擬隨機分佈計算 45 顆星辰座標，避免 SSR / prerender Hydration 不一致
  const stars = useMemo(() => {
    return Array.from({ length: 45 }).map((_, i) => ({
      id: i,
      x: (i * 37 + 13) % 100,
      y: (i * 53 + 7) % 100,
      size: ((i * 19) % 2) + 1.2,
      duration: ((i * 23) % 4) + 3,
      delay: (i * 17) % 5,
      opacity: (((i * 29) % 50) + 50) / 100,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden bg-[#060814]">
      {/* 宇宙深邃星雲漸層 */}
      <div 
        className="absolute -top-[25%] -left-[10%] w-[60vw] h-[60vw] rounded-full blur-[130px] opacity-25 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.45) 0%, rgba(168, 85, 247, 0.2) 60%, transparent 100%)',
          animationDuration: '14s'
        }}
      />
      <div 
        className="absolute top-[40%] -right-[15%] w-[55vw] h-[55vw] rounded-full blur-[140px] opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(244, 114, 182, 0.35) 0%, rgba(251, 191, 36, 0.15) 60%, transparent 100%)',
        }}
      />
      <div 
        className="absolute -bottom-[20%] left-[20%] w-[50vw] h-[50vw] rounded-full blur-[120px] opacity-20 animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.3) 0%, rgba(99, 102, 241, 0.15) 70%, transparent 100%)',
          animationDuration: '18s'
        }}
      />

      {/* 閃爍微星辰粒子 */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white transition-opacity"
          style={{
            top: `${star.y}%`,
            left: `${star.x}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            boxShadow: `0 0 ${star.size * 3}px rgba(255, 255, 255, 0.9)`,
            animation: `twinkle ${star.duration}s infinite ease-in-out ${star.delay}s`,
          }}
        />
      ))}

      {/* 柔和雜訊或暗角暈映 */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(6,8,20,0.75)_100%)]" />
    </div>
  );
}
