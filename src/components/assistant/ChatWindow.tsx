import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AiCardResult } from '../../services/aiService';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';

export interface ChatMessageItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  cardResult?: AiCardResult;
  sources?: string[];
  followups?: string[];
  timestamp: string;
}

interface ChatWindowProps {
  messages: ChatMessageItem[];
  isThinking: boolean;
  onSelectFollowup: (text: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  messages,
  isThinking,
  onSelectFollowup,
}) => {
  const navigate = useNavigate();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          {msg.sender === 'ai' && (
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#00D1FF] p-0.5 shrink-0 shadow-glow-violet">
              <div className="w-full h-full bg-[#0B0F1A] rounded-[10px] flex items-center justify-center">
                <Bot size={16} className="text-[#00D1FF]" />
              </div>
            </div>
          )}

          <div className={`max-w-xl space-y-2.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm font-sans leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#5b52e0] text-white rounded-tr-none shadow-glow-violet'
                  : 'bg-white/10 text-slate-100 rounded-tl-none border border-white/10'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {/* Cross-Page Result Card */}
              {msg.cardResult && (
                <div className="mt-3 p-3.5 rounded-2xl bg-[#0B0F1A]/80 border border-[#6C63FF]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#00D1FF]">{msg.cardResult.subtitle}</span>
                    <Badge variant="violet" size="sm">{msg.cardResult.badge}</Badge>
                  </div>
                  <h4 className="text-sm font-bold text-white font-display">{msg.cardResult.title}</h4>
                  <p className="text-xs text-slate-300 font-sans">{msg.cardResult.description}</p>
                  <Button
                    variant="gradient"
                    size="sm"
                    className="w-full mt-2 text-xs"
                    onClick={() => navigate(msg.cardResult!.actionRoute)}
                    rightIcon={<ArrowRight size={14} />}
                  >
                    {msg.cardResult.actionText}
                  </Button>
                </div>
              )}

              {/* Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/10 flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] font-mono text-slate-400 uppercase">Context Index:</span>
                  {msg.sources.map((src) => (
                    <span key={src} className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-[#00D1FF]">
                      {src}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Followup suggestion pills */}
            {msg.followups && msg.followups.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {msg.followups.map((f) => (
                  <button
                    key={f}
                    onClick={() => onSelectFollowup(f)}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#6C63FF]/20 text-[11px] font-sans text-[#A5B4FC] border border-white/10 transition-colors"
                  >
                    {f}
                  </button>
                ))}
              </div>
            )}

            <span className="text-[10px] font-mono text-slate-500 block px-1">{msg.timestamp}</span>
          </div>

          {msg.sender === 'user' && (
            <div className="w-8 h-8 rounded-xl bg-white/10 p-0.5 shrink-0 flex items-center justify-center border border-white/20">
              <User size={16} className="text-white" />
            </div>
          )}
        </motion.div>
      ))}

      {isThinking && (
        <div className="flex items-center gap-3 text-xs text-[#00D1FF] font-mono p-2">
          <Bot size={16} className="animate-spin" />
          <span>LifeVault Second Brain is processing...</span>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};
