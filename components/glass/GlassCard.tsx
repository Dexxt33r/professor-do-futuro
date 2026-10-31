'use client';

import { cn } from '@/lib/cn';
import { useEffect, useRef, useState } from 'react';

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  blur?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  opacity?: 'light' | 'medium' | 'dark';
  shine?: boolean;
  children: React.ReactNode;
}

export function GlassCard({
  className,
  blur = 'lg',
  opacity = 'medium',
  shine = true,
  children,
  ...props
}: GlassCardProps) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Efeito de brilho que segue o cursor dentro do card
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mouse-x', `${x}%`);
      el.style.setProperty('--mouse-y', `${y}%`);
    };

    el.addEventListener('mousemove', handleMove);
    return () => el.removeEventListener('mousemove', handleMove);
  }, []);

  const blurClasses: Record<string, string> = {
    sm: 'backdrop-blur-sm -webkit-backdrop-blur-sm',
    md: 'backdrop-blur-md -webkit-backdrop-blur-md',
    lg: 'backdrop-blur-lg -webkit-backdrop-blur-lg',
    xl: 'backdrop-blur-xl -webkit-backdrop-blur-xl',
    '2xl': 'backdrop-blur-2xl -webkit-backdrop-blur-2xl',
  };

  const opacityClasses: Record<string, string> = {
    light: 'bg-[rgba(255,255,255,0.72)] dark:bg-[rgba(18,44,33,0.78)]',
    medium: 'bg-[rgba(255,255,255,0.55)] dark:bg-[rgba(18,44,33,0.62)]',
    dark: 'bg-[rgba(255,255,255,0.40)] dark:bg-[rgba(18,44,33,0.50)]',
  };

  const borderClasses = {
    light: 'border-[rgba(255,255,255,0.35)] dark:border-[rgba(255,255,255,0.12)]',
    weak:
      'border-[rgba(255,255,255,0.18)] dark:border-[rgba(255,255,255,0.06)]',
  };

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative overflow-hidden rounded-[28px] transition-all duration-500',
        opacityClasses[opacity],
        borderClasses[opacity === 'dark' ? 'weak' : 'light'],
        blurClasses[blur],
        'shadow-[0_24px_60px_-12px_rgba(0,0,0,0.14)] dark:shadow-[0_24px_60px_-12px_rgba(0,0,0,0.55)]',
        hovered &&
          'shadow-[0_30px_70px_-15px_rgba(0,0,0,0.18)] dark:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.45)] -translate-y-2 border-[rgba(255,255,255,0.55)] dark:border-[rgba(255,255,255,0.35)]',
        className,
      )}
      {...props}
    >
      {shine && (
        <div
          className={cn(
            'absolute inset-0 pointer-events-none',
            'bg-[linear-gradient(135deg,_rgba(255,255,255,0.4)_0%_,_rgba(255,255,255,0)_40%_,_rgba(255,255,255,0.15)_100%)]',
            'translate-x-[var(--mouse-x,-100%)] translate-y-[var(--mouse-y,0%)]',
            'transition-transform duration-800 ease-out',
            hovered ? 'translate-x-100' : 'translate-x-[-100%]',
          )}
        />
      )}
      {children}
    </div>
  );
}
