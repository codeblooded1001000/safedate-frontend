import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
}

export function Card({ className, padding = 'md', children, style, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl',
        {
          'p-3': padding === 'sm',
          'p-4': padding === 'md',
          'p-6': padding === 'lg',
        },
        className,
      )}
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
