// Farcaster Frame SDK の通知送信関連型／バリデーション
import {
  MiniAppNotificationDetails,
  type SendNotificationRequest,
  sendNotificationResponseSchema,
} from '@farcaster/frame-sdk';
// ユーザーの通知設定（トークン等）を Redis から取得
import { getUserNotificationDetails } from '@/lib/notification';

// 通知からの遷移先（MiniApp の URL）
const appUrl = process.env.NEXT_PUBLIC_URL || '';

// 通知送信の結果を表すユニオン型
type SendFrameNotificationResult =
  | {
      state: 'error';
      error: unknown;
    }
  | { state: 'no_token' }
  | { state: 'rate_limit' }
  | { state: 'success' };

/**
 * Farcaster の通知エンドポイントに対し、ユーザーのトークンを用いて通知を送信します。
 * - notificationDetails が未指定の場合は Redis から取得します。
 * - 成功時／レート制限時／トークン未登録時／エラー時で状態を返します。
 */
export async function sendFrameNotification({
  fid,
  title,
  body,
  notificationDetails,
}: {
  fid: number;
  title: string;
  body: string;
  notificationDetails?: MiniAppNotificationDetails | null;
}): Promise<SendFrameNotificationResult> {
  if (!notificationDetails) {
    notificationDetails = await getUserNotificationDetails(fid);
  }
  if (!notificationDetails) {
    return { state: 'no_token' };
  }

  // Farcaster の通知エンドポイントへリクエスト
  const response = await fetch(notificationDetails.url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      notificationId: crypto.randomUUID(),
      title,
      body,
      targetUrl: appUrl,
      tokens: [notificationDetails.token],
    } satisfies SendNotificationRequest),
  });

  const responseJson = await response.json();

  if (response.status === 200) {
    const responseBody = sendNotificationResponseSchema.safeParse(responseJson);
    if (responseBody.success === false) {
      return { state: 'error', error: responseBody.error.errors };
    }

    if (responseBody.data.result.rateLimitedTokens.length) {
      return { state: 'rate_limit' };
    }

    return { state: 'success' };
  }

  return { state: 'error', error: responseJson };
}
