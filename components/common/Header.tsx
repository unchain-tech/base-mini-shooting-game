import { Address, Avatar, EthBalance, Identity, Name } from '@coinbase/onchainkit/identity';
import { useAddFrame, useMiniKit } from '@coinbase/onchainkit/minikit';
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import { useCallback, useMemo, useState } from 'react';
import { Button, Icon } from '@/components/common';

/**
 * ヘッダーコンポーネント
 */
export const Header = () => {
  const { context } = useMiniKit();
  const addFrame = useAddFrame();

  const [frameAdded, setFrameAdded] = useState(false);

  // フレームをユーザーに追加してもらう（クライアントで保存操作を促す）
  const handleAddFrame = useCallback(async () => {
    const frameAdded = await addFrame();
    setFrameAdded(Boolean(frameAdded));
  }, [addFrame]);

  // ヘッダー右上の「Save Frame」ボタンの表示制御
  const saveFrameButton = useMemo(() => {
    if (context && !context.client.added) {
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddFrame}
          className="p-4 text-[var(--app-accent)]"
          icon={<Icon name="plus" size="sm" />}
        >
          Save Frame
        </Button>
      );
    }

    if (frameAdded) {
      return (
        <div className="flex animate-fade-out items-center space-x-1 text-sm font-medium text-[#0052FF]">
          <Icon name="check" size="sm" className="text-[#0052FF]" />
          <span>Saved</span>
        </div>
      );
    }

    return null;
  }, [context, frameAdded, handleAddFrame]);

  return (
    <header className="mb-3 flex h-11 items-center justify-between">
      <div>
        <div className="flex items-center space-x-2">
          <Wallet className="z-10">
            <ConnectWallet>
              <Name className="text-inherit" />
            </ConnectWallet>
            <WalletDropdown>
              <Identity className="px-4 pb-2 pt-3" hasCopyAddressOnClick>
                <Avatar />
                <Name />
                <Address />
                <EthBalance />
              </Identity>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      </div>
      <div>{saveFrameButton}</div>
    </header>
  );
};
