// Upstash Redis クライアントの初期化
import { Redis } from '@upstash/redis';

// 環境変数が未設定の場合はコンソール警告を出し、
// redis は null として動作（通知・Webhook 等の永続化は無効）
if (!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
  console.warn(
    'REDIS_URL or REDIS_TOKEN environment variable is not defined, please add to enable background notifications and webhooks.'
  );
}

export const redis =
  process.env.REDIS_URL && process.env.REDIS_TOKEN
    ? new Redis({
        url: process.env.REDIS_URL,
        token: process.env.REDIS_TOKEN,
      })
    : null;
