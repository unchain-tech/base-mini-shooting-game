import ShootingGame from '@/components/Game';

/**
 * Home コンポーネント
 * @param param0
 * @returns
 */
export function Home() {
  return (
    <div className="animate-fade-in space-y-6">
      {/* シューティングゲーム コンポーネント */}
      <ShootingGame />
    </div>
  );
}
