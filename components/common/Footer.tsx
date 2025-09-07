import { useOpenUrl } from '@coinbase/onchainkit/minikit';
import { Button } from '@/components/common';
/**
 * フッターコンポーネント
 */
export const Footer = () => {
  const openUrl = useOpenUrl();

  return (
    <footer className="mt-2 flex justify-center pt-4">
      {/* Base（Onchain）公式ドキュメントへ遷移 */}
      <Button
        variant="ghost"
        size="sm"
        className="text-xs text-[var(--ock-text-foreground-muted)]"
        onClick={() => openUrl('https://base.org/builders/minikit')}
      >
        Built on Base with MiniKit
      </Button>
    </footer>
  );
};
