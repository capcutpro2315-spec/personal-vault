import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Scan, CheckCircle2, Lock } from 'lucide-react';
import { Button } from './Button';

interface BiometricModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
  documentTitle?: string;
}

export const BiometricModal: React.FC<BiometricModalProps> = ({
  isOpen,
  onSuccess,
  onCancel,
  documentTitle = 'Protected Vault Document',
}) => {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'verified'>('idle');

  useEffect(() => {
    if (isOpen) {
      setStatus('idle');
    }
  }, [isOpen]);

  const handleScan = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('verified');
      setTimeout(() => {
        onSuccess();
      }, 900);
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-[#0B0F1A]/85 backdrop-blur-lg" onClick={onCancel} />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="relative z-10 glass-panel border border-[#6C63FF]/30 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl overflow-hidden"
      >
        {/* Glow Header Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6C63FF] via-[#00D1FF] to-[#34D399]" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6C63FF]/15 border border-[#6C63FF]/30 text-xs font-semibold text-[#A5B4FC] mb-4">
          <Lock size={13} /> AES-256 Verification Required
        </div>

        <h3 className="text-xl font-bold font-display text-white tracking-tight mb-1">
          Verify Your Identity
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Accessing encrypted item: <span className="text-slate-200 font-medium">{documentTitle}</span>
        </p>

        {/* Biometric Scanner Visual */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="w-28 h-28 rounded-full border-2 border-white/10 flex items-center justify-center relative bg-[#121829]">
            {status === 'idle' && (
              <Fingerprint className="w-14 h-14 text-[#6C63FF] animate-pulse" />
            )}

            {status === 'scanning' && (
              <>
                <Scan className="w-14 h-14 text-[#00D1FF]" />
                <motion.div
                  animate={{ top: ['15%', '85%', '15%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute left-4 right-4 h-0.5 bg-[#00D1FF] shadow-glow-cyan"
                />
              </>
            )}

            {status === 'verified' && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 className="w-16 h-16 text-[#34D399]" />
              </motion.div>
            )}
          </div>
        </div>

        <p className="text-xs font-medium text-slate-300 min-h-[20px] mb-6">
          {status === 'idle' && 'Tap fingerprint scanner or press authenticate to verify'}
          {status === 'scanning' && 'Reading biometric hash & matching key signature...'}
          {status === 'verified' && 'Identity Verified! Unlocking Vault Item...'}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="gradient"
            size="md"
            className="flex-1"
            onClick={handleScan}
            disabled={status !== 'idle'}
          >
            {status === 'idle' ? 'Authenticate' : status === 'scanning' ? 'Verifying...' : 'Unlocked'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
