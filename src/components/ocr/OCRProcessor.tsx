import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, Scan } from 'lucide-react';

interface OCRProcessorProps {
  step: number; // 1 to 4
  fileName?: string;
}

export const OCRProcessor: React.FC<OCRProcessorProps> = ({ step, fileName = 'Uploaded Scan' }) => {
  const steps = [
    { num: 1, title: 'Analyzing document...' },
    { num: 2, title: 'Extracting text...' },
    { num: 3, title: 'Identifying important information...' },
    { num: 4, title: 'Preparing your vault entry...' },
  ];

  return (
    <div className="p-6 rounded-3xl bg-[#121829] border border-[#6C63FF]/30 space-y-4 shadow-glow-violet">
      <div className="flex items-center gap-3">
        <Sparkles className="w-5 h-5 text-[#00D1FF] animate-spin shrink-0" />
        <div>
          <h4 className="text-sm font-bold font-display text-white">Smart OCR Extraction Active</h4>
          <p className="text-[11px] text-slate-400 font-mono">Processing payload: {fileName}</p>
        </div>
      </div>

      <div className="space-y-2.5 pt-2 font-mono text-xs">
        {steps.map((s) => (
          <div
            key={s.num}
            className={`flex items-center gap-2.5 transition-colors ${
              step >= s.num ? 'text-[#34D399] font-bold' : 'text-slate-500'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step >= s.num
                  ? 'bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/40'
                  : 'bg-white/5 text-slate-600 border border-white/10'
              }`}
            >
              {step >= s.num ? <CheckCircle2 size={12} /> : s.num}
            </div>
            <span>{s.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
