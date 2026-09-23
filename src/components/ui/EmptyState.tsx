import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
}) => {
  return (
    <div className="glass-panel p-10 sm:p-14 rounded-3xl text-center flex flex-col items-center justify-center max-w-lg mx-auto border border-white/10 my-6">
      <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#6C63FF]/20 to-[#00D1FF]/20 text-[#00D1FF] mb-4 border border-[#6C63FF]/30 shadow-glow-violet">
        <Icon size={32} />
      </div>
      <h3 className="text-xl font-bold font-display text-white">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1.5 max-w-md leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button variant="gradient" size="sm" className="mt-6" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
