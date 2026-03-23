import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
  style,
  children,
  ...props
}: ButtonProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FFC837 100%)',
      color: 'white',
      boxShadow: '0 4px 20px rgba(255,107,107,0.25)',
    },
    secondary: {
      background: 'rgba(255,255,255,0.05)',
      border: '1px solid rgba(255,255,255,0.2)',
      color: 'rgba(255,255,255,0.8)',
    },
    danger: {
      background: '#ef4444',
      color: 'white',
    },
    ghost: {
      background: 'transparent',
      color: 'rgba(255,255,255,0.7)',
    },
  };

  return (
    <button
      className={cn(
        'font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-5 py-2.5 text-sm': size === 'md',
          'px-6 py-3 text-base': size === 'lg',
          'w-full': fullWidth,
        },
        className,
      )}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
