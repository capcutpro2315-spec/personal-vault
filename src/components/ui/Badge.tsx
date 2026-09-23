import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'violet' | 'cyan' | 'orange' | 'green' | 'muted' | 'outline';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'violet',
  size = 'md',
  icon,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md gap-1 font-medium',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 font-semibold',
  };

  const variantStyles = {
    violet: 'bg-[#6C63FF]/15 text-[#A5B4FC] border border-[#6C63FF]/30',
    cyan: 'bg-[#00D1FF]/15 text-[#38BDF8] border border-[#00D1FF]/30',
    orange: 'bg-[#FF7A50]/15 text-[#FF8C66] border border-[#FF7A50]/30',
    green: 'bg-[#34D399]/15 text-[#6EE7B7] border border-[#34D399]/30',
    muted: 'bg-slate-800/60 text-slate-300 border border-slate-700/50',
    outline: 'bg-transparent text-slate-300 border border-white/20',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center tracking-wide uppercase font-sans',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </span>
  );
};
