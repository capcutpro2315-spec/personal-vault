import React from 'react';
import { ShieldCheck, Lock, Info } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const SecurityCard: React.FC = () => {
  return (
    <Card glowColor="green" className="p-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-[#34D399]/20 text-[#34D399] border border-[#34D399]/30 shadow-glow-cyan">
            <ShieldCheck size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-display text-white">Your vault is secured</h3>
              <Badge variant="green" size="sm" icon={<Lock size={10} />}>
                Protected
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Zero-knowledge identity index & client-side Row Level Security architecture.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2 text-xs font-mono text-slate-200 w-full sm:w-auto justify-between sm:justify-start">
            <span className="text-slate-400">Encryption standard:</span>
            <span className="text-[#34D399] font-bold">AES-256</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
            <Info size={12} className="text-[#00D1FF] shrink-0" />
            <span>Security Concept / UI Indicator</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
