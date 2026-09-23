import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glowColor?: 'violet' | 'cyan' | 'orange' | 'green' | 'none';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  glowColor = 'none',
  ...props
}) => {
  const glowStyles = {
    violet: 'hover:shadow-glow-violet hover:border-[#6C63FF]/40',
    cyan: 'hover:shadow-glow-cyan hover:border-[#00D1FF]/40',
    orange: 'hover:shadow-glow-orange hover:border-[#FF7A50]/40',
    green: 'hover:border-[#34D399]/40',
    none: '',
  };

  return (
    <div
      className={cn(
        'glass-panel rounded-2xl p-6 transition-all duration-300 relative overflow-hidden',
        hoverEffect && 'glass-panel-hover',
        glowStyles[glowColor],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className, ...props }) => (
  <div className={cn('flex items-center justify-between mb-4', className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className, ...props }) => (
  <h3 className={cn('text-lg font-bold font-display text-white tracking-tight', className)} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className, ...props }) => (
  <p className={cn('text-xs text-slate-400 font-sans mt-0.5', className)} {...props}>
    {children}
  </p>
);
