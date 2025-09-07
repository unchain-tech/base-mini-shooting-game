import { ReactNode } from 'react';

// Card コンポーネント（枠付きコンテナ）
type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

/**
 * Card コンポーネント
 * @param param0
 * @returns
 */
export function Card({ title, children, className = '', onClick }: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`overflow-hidden rounded-xl border border-[var(--app-card-border)] bg-[var(--app-card-bg)] shadow-lg backdrop-blur-md transition-all hover:shadow-xl ${className} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
    >
      {title && (
        <div className="border-b border-[var(--app-card-border)] px-5 py-3">
          <h3 className="text-lg font-medium text-[var(--app-foreground)]">{title}</h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}
