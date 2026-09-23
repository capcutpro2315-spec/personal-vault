import React from 'react';
import { motion } from 'framer-motion';

interface VoiceWaveformProps {
  isListening: boolean;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isListening }) => {
  return (
    <div className="flex items-center justify-center gap-1.5 h-12 my-2">
      {[0.4, 0.9, 0.6, 1.2, 0.7, 1, 0.5, 0.8, 1.1, 0.4].map((scale, i) => (
        <motion.div
          key={i}
          animate={
            isListening
              ? { height: ['20%', '100%', '30%'] }
              : { height: '25%' }
          }
          transition={{
            duration: 0.35 + i * 0.08,
            repeat: isListening ? Infinity : 0,
            repeatType: 'reverse',
          }}
          className={`w-1.5 rounded-full transition-colors ${
            isListening ? 'bg-[#00D1FF] shadow-glow-cyan' : 'bg-slate-700'
          }`}
        />
      ))}
    </div>
  );
};
