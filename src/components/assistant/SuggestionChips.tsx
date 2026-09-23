import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface SuggestionChipsProps {
  onSelect: (question: string) => void;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onSelect }) => {
  const suggestions = [
    'Where did I travel recently?',
    'What documents are expiring?',
    'Show my recent memories',
    'What did I save about my project?',
    'Find my insurance document',
    'What reminders do I have?',
  ];

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
        <Sparkles size={12} className="text-[#00D1FF]" /> Suggested Questions
      </div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((chip) => (
          <button
            key={chip}
            onClick={() => onSelect(chip)}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#6C63FF]/20 hover:text-[#A5B4FC] text-xs font-sans text-slate-300 transition-colors border border-white/10 flex items-center gap-1.5 group"
          >
            <span>{chip}</span>
            <ArrowRight size={12} className="text-slate-500 group-hover:text-[#00D1FF] transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
};
