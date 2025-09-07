import { useNotification } from '@coinbase/onchainkit/minikit';
import {
  Transaction,
  TransactionButton,
  TransactionError,
  TransactionResponse,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
} from '@coinbase/onchainkit/transaction';
import { useCallback } from 'react';
import { Abi } from 'viem';
import { useAccount } from 'wagmi';

type TransactionProps = {
  calls: {
    address: `0x${string}`;
    abi: Abi;
    functionName: string;
    args: (string | number | bigint | boolean | `0x${string}`)[];
  }[];
};

/**
 * トランザクションカードコンポーネント
 * @returns
 */
export function TransactionCard({ calls }: TransactionProps) {
  const { address } = useAccount();

  const sendNotification = useNotification();

  /**
   * トランザクションが正常に実行された時に実行するコールバック関数
   */
  const handleSuccess = useCallback(
    async (response: TransactionResponse) => {
      const transactionHash = response.transactionReceipts[0].transactionHash;

      console.log(`Transaction successful: ${transactionHash}`);

      // トランザクション成功時に MiniKit 通知を送る
      await sendNotification({
        title: 'Congratulations!',
        body: `You sent your a transaction, ${transactionHash}!`,
      });
    },
    [sendNotification]
  );

  return (
    <div className="w-full">
      {address ? (
        <Transaction
          calls={calls}
          onSuccess={handleSuccess}
          onError={(error: TransactionError) => console.error('Transaction failed:', error)}
        >
          <TransactionButton className="text-md text-white" text="Mint NFT" />
          <TransactionStatus>
            <TransactionStatusAction />
            <TransactionStatusLabel />
          </TransactionStatus>
          <TransactionToast className="mb-4">
            <TransactionToastIcon />
            <TransactionToastLabel />
            <TransactionToastAction />
          </TransactionToast>
        </Transaction>
      ) : (
        <p className="mt-2 text-center text-sm text-yellow-400">
          Connect your wallet to send a transaction
        </p>
      )}
    </div>
  );
}
