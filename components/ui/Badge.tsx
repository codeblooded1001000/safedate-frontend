import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'verified' | 'category' | 'warning';
}

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        {
          'bg-gray-100 text-gray-600': variant === 'default',
          'bg-safety-50 text-safety-600': variant === 'verified',
          'bg-primary-50 text-primary-600': variant === 'category',
          'bg-yellow-50 text-yellow-700': variant === 'warning',
        },
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
