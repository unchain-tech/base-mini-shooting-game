// Farcaster Frame SDK が提供する通知トークン等の型
import type { MiniAppNotificationDetails } from '@farcaster/frame-sdk';
// Upstash Redis クライアント
import { redis } from './redis';

// このアプリ（MiniApp）用の通知サービス名。
// ユーザーごとの通知設定を保存する際の Redis キー接頭辞として使用します。
const notificationServiceKey = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME ?? 'minikit';

// 指定した fid（Farcaster ID）に対する通知設定の Redis キーを生成
function getUserNotificationDetailsKey(fid: number): string {
  return `${notificationServiceKey}:user:${fid}`;
}

/**
 * 指定した fid のユーザーに紐づく通知設定（MiniAppNotificationDetails）を取得します。
 * Redis が未設定の場合は null を返します。
 */
export async function getUserNotificationDetails(
  fid: number
): Promise<MiniAppNotificationDetails | null> {
  if (!redis) {
    return null;
  }

  return await redis.get<MiniAppNotificationDetails>(getUserNotificationDetailsKey(fid));
}

/**
 * 指定した fid のユーザーに通知設定を保存します。
 * Webhook（notifications_enabled など）で受け取ったトークンを保存する想定です。
 */
export async function setUserNotificationDetails(
  fid: number,
  notificationDetails: MiniAppNotificationDetails
): Promise<void> {
  if (!redis) {
    return;
  }

  await redis.set(getUserNotificationDetailsKey(fid), notificationDetails);
}

/**
 * 指定した fid のユーザーに紐づく通知設定を削除します。
 * ユーザーが通知を無効化したり、フレームを削除した際に呼び出します。
 */
export async function deleteUserNotificationDetails(fid: number): Promise<void> {
  if (!redis) {
    return;
  }

  await redis.del(getUserNotificationDetailsKey(fid));
}
