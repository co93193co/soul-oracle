import type { Metadata } from 'next';
import './globals.css';
import CosmicBackground from '@/components/shared/CosmicBackground';

export const metadata: Metadata = {
  title: '靈魂之境 ‧ 宇宙迴響 (Soul Oracle)',
  description: '融合心靈傾訴釋放與願望豐盛顯化的雙軌心靈科技殿堂',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW" className="dark h-full antialiased">
      <body className="min-h-full flex flex-col relative text-amber-50">
        <CosmicBackground />
        {children}
      </body>
    </html>
  );
}
