'use client';

// アプリ全体のプロバイダー（MiniKitProvider）
// - OnchainKit の設定（API Key / Chain / 外観）
// - フレームの文脈や Wagmi のコネクタを内部で設定
import { MiniKitProvider } from '@coinbase/onchainkit/minikit';
import { type ReactNode } from 'react';
import { baseSepolia } from 'wagmi/chains';

/**
 * Providers コンポーネント
 * @param props
 * @returns
 */
export function Providers(props: { children: ReactNode }) {
  return (
    <MiniKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia}
      config={{
        appearance: {
          mode: 'auto',
          theme: 'mini-app-theme',
          name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
          logo: process.env.NEXT_PUBLIC_ICON_URL,
        },
      }}
    >
      {props.children}
    </MiniKitProvider>
  );
}
