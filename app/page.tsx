'use client';

// MiniKit の各種フックを用いたメインの画面コンポーネント。
// - フレームの保存（addFrame）
// - Wallet 連携 UI（OnchainKit）
// - 簡易的なタブ切り替え（Home / Features）

import { Footer, Header } from '@/components/common';
import { Home } from '@/components/DemoComponents';
import { useMiniKit } from '@coinbase/onchainkit/minikit';
import { useEffect } from 'react';

/**
 * App コンポーネント
 * @returns
 */
export default function App() {
  // MiniKit のコンテキスト（フレーム準備完了フラグやクライアント状態）
  const { setFrameReady, isFrameReady } = useMiniKit();

  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  return (
    <div className="mini-app-theme flex min-h-screen flex-col from-[var(--app-background)] to-[var(--app-gray)] font-sans text-[var(--app-foreground)]">
      <div className="mx-auto w-full max-w-md px-4 py-3">
        {/* ヘッダー */}
        <Header />
        {/* メインコンポーネント */}
        <main className="flex-1">
          <Home />
        </main>
        {/* フッター */}
        <Footer />
      </div>
    </div>
  );
}
