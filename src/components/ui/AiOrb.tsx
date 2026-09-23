import React from 'react';
import { motion } from 'framer-motion';

interface AiOrbProps {
  size?: 'sm' | 'md' | 'lg' | 'hero';
  isListening?: boolean;
  isThinking?: boolean;
  onClick?: () => void;
}

export const AiOrb: React.FC<AiOrbProps> = ({
  size = 'md',
  isListening = false,
  isThinking = false,
  onClick,
}) => {
  const dimensions = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-48 h-48',
    hero: 'w-64 h-64 sm:w-80 sm:h-80',
  };

  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer flex items-center justify-center select-none group ${dimensions[size]}`}
    >
      {/* Outer Pulsing Glow Atmosphere */}
      <motion.div
        animate={{
          scale: isListening ? [1, 1.25, 1] : [1, 1.1, 1],
          opacity: isListening ? [0.6, 0.9, 0.6] : [0.4, 0.7, 0.4],
        }}
        transition={{
          duration: isListening ? 1.5 : 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-[#6C63FF] via-[#00D1FF] to-[#FF7A50] blur-2xl opacity-60"
      />

      {/* Orbit Ring 1 */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[-12%] rounded-full border border-[#00D1FF]/30 border-dashed"
      />

      {/* Orbit Ring 2 */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[-25%] rounded-full border border-[#6C63FF]/20"
      />

      {/* Core Glowing Orb Sphere */}
      <motion.div
        animate={
          isListening
            ? { scale: [1, 1.06, 1], rotate: [0, 180, 360] }
            : isThinking
            ? { rotate: 360, scale: [1, 0.95, 1] }
            : { y: [0, -10, 0] }
        }
        transition={{
          duration: isListening ? 2 : isThinking ? 1.2 : 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-full h-full rounded-full bg-orb-gradient shadow-orb-pulse border border-white/40 overflow-hidden flex items-center justify-center"
      >
        {/* Internal Dynamic Plasma Shimmer */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-80 animate-pulse" />

        {/* Audio Waveform Bars (When Listening) */}
        {isListening ? (
          <div className="flex items-center gap-1 z-10">
            {[0.4, 1, 0.7, 1.2, 0.6, 0.9, 0.5].map((scale, i) => (
              <motion.div
                key={i}
                animate={{ height: ['20%', '85%', '30%'] }}
                transition={{
                  duration: 0.5 + i * 0.1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
                className="w-1.5 bg-white rounded-full shadow-glow-cyan"
              />
            ))}
          </div>
        ) : (
          <div className="z-10 text-white font-display text-xs tracking-widest uppercase opacity-75 font-semibold">
            {isThinking ? 'Thinking...' : 'AI Active'}
          </div>
        )}
      </motion.div>
    </div>
  );
};
