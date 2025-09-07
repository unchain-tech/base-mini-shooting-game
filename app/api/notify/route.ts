// 通知送信用 API エンドポイント
// リクエストで渡された fid と通知内容を使って Farcaster 通知を送信します。
import { sendFrameNotification } from '@/lib/notification-client';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fid, notification } = body;

    // 通知送信。通知詳細（トークン情報）が明示されていない場合、サーバ側で取得します。
    const result = await sendFrameNotification({
      fid,
      title: notification.title,
      body: notification.body,
      notificationDetails: notification.notificationDetails,
    });

    if (result.state === 'error') {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 400 }
    );
  }
}
