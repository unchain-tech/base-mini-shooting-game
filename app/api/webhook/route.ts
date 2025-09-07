// Farcaster の Webhook を受け取り、
// フレームの追加・削除、通知の有効化・無効化等のイベントに応じて
// ユーザーの通知設定を保存・削除し、必要に応じて歓迎通知を送ります。
import { deleteUserNotificationDetails, setUserNotificationDetails } from '@/lib/notification';
import { sendFrameNotification } from '@/lib/notification-client';
import { createPublicClient, http } from 'viem';
import { baseSepolia } from 'viem/chains';

const appName = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME;

const KEY_REGISTRY_ADDRESS = '0x00000000Fc1237824fb747aBDE0FF18990E59b7e';

// Farcaster Key Registry（FID とアプリ鍵の紐付け確認に使用）
const KEY_REGISTRY_ABI = [
  {
    inputs: [
      { name: 'fid', type: 'uint256' },
      { name: 'key', type: 'bytes' },
    ],
    name: 'keyDataOf',
    outputs: [
      {
        components: [
          { name: 'state', type: 'uint8' },
          { name: 'keyType', type: 'uint32' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// FID が該当のアプリ鍵（key）を所有しているかチェーン上で検証
async function verifyFidOwnership(fid: number, appKey: `0x${string}`) {
  const client = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  try {
    const result = await client.readContract({
      address: KEY_REGISTRY_ADDRESS,
      abi: KEY_REGISTRY_ABI,
      functionName: 'keyDataOf',
      args: [BigInt(fid), appKey],
    });

    // state=1(有効), keyType=1(アプリキー) の場合に所有とみなす
    return result.state === 1 && result.keyType === 1;
  } catch (error) {
    console.error('Key Registry verification failed:', error);
    return false;
  }
}

function decode(encoded: string) {
  return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8'));
}

export async function POST(request: Request) {
  const requestJson = await request.json();

  const { header: encodedHeader, payload: encodedPayload } = requestJson;

  // Base64URL 文字列のヘッダ・ペイロードを復号
  const headerData = decode(encodedHeader);
  const event = decode(encodedPayload);

  const { fid, key } = headerData;

  // Webhook が偽装でないか、FID と key の所有関係を検証
  const valid = await verifyFidOwnership(fid, key);

  if (!valid) {
    return Response.json({ success: false, error: 'Invalid FID ownership' }, { status: 401 });
  }

  switch (event.event) {
    case 'frame_added':
      console.log('frame_added', 'event.notificationDetails', event.notificationDetails);
      if (event.notificationDetails) {
        // ユーザーがフレームを追加し、通知を許可している場合
        await setUserNotificationDetails(fid, event.notificationDetails);
        await sendFrameNotification({
          fid,
          title: `Welcome to ${appName}`,
          body: `Thank you for adding ${appName}`,
        });
      } else {
        // 通知情報が無い場合は念のため削除
        await deleteUserNotificationDetails(fid);
      }

      break;
    case 'frame_removed': {
      console.log('frame_removed');
      // フレーム削除 → 通知設定も削除
      await deleteUserNotificationDetails(fid);
      break;
    }
    case 'notifications_enabled': {
      console.log('notifications_enabled', event.notificationDetails);
      // 通知有効化 → トークン保存 + 歓迎通知
      await setUserNotificationDetails(fid, event.notificationDetails);
      await sendFrameNotification({
        fid,
        title: `Welcome to ${appName}`,
        body: `Thank you for enabling notifications for ${appName}`,
      });

      break;
    }
    case 'notifications_disabled': {
      console.log('notifications_disabled');
      // 通知無効化 → 通知設定削除
      await deleteUserNotificationDetails(fid);

      break;
    }
  }

  return Response.json({ success: true });
}
