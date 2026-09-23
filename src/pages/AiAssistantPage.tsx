import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Mic, MicOff, Send, Sparkles, MessageSquare, ArrowRight } from 'lucide-react';
import { aiService, AiAnswerResponse } from '../services/aiService';
import { voiceService } from '../services/voiceService';
import { useData } from '../context/DataContext';
import { AiOrb } from '../components/ui/AiOrb';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ChatWindow, ChatMessageItem } from '../components/assistant/ChatWindow';
import { SuggestionChips } from '../components/assistant/SuggestionChips';
import { VoiceWaveform } from '../components/assistant/VoiceWaveform';

export const AiAssistantPage: React.FC = () => {
  const dataContext = useData();

  const [messages, setMessages] = useState<ChatMessageItem[]>([
    {
      id: 'msg-init-1',
      sender: 'ai',
      text: "Hello Vishnu! Your AI Assistant is ready. Ask about your documents, memories, travel trips, or reminders.",
      followups: [
        'Where did I travel recently?',
        'When does my insurance expire?',
        'Show my Manali memories.',
        'What documents are expiring?'
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceStatusText, setVoiceStatusText] = useState('Tap to speak');
  const [isThinking, setIsThinking] = useState(false);

  const handleSendMessage = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim()) return;

    const userMsg: ChatMessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsThinking(true);

    // AI Response query
    const response: AiAnswerResponse = await aiService.answerQuestion(q, dataContext);

    setIsThinking(false);

    const aiMsg: ChatMessageItem = {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: response.answer,
      cardResult: response.cardResult,
      sources: response.sourceDocuments,
      followups: response.suggestedFollowups,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, aiMsg]);
  };

  // Mic voice toggle
  const toggleVoiceMode = () => {
    if (!isListening) {
      setIsListening(true);
      setVoiceStatusText('Listening...');

      if (voiceService.isSupported()) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setVoiceStatusText('Processing...');
          setTimeout(() => {
            setVoiceStatusText('Here\'s what I found...');
            setIsListening(false);
            const parsed = voiceService.parseVoiceCommand(transcript);
            handleSendMessage(parsed.transcript);
          }, 600);
        };
        recognition.onerror = () => {
          setIsListening(false);
          setVoiceStatusText('Tap to speak');
        };
        recognition.start();
      } else {
        // Fallback simulation sequence
        setTimeout(() => {
          setVoiceStatusText('Processing...');
          setTimeout(() => {
            setVoiceStatusText('Here\'s what I found...');
            setIsListening(false);
            handleSendMessage('Where did I travel recently?');
          }, 1000);
        }, 1500);
      }
    } else {
      setIsListening(false);
      setVoiceStatusText('Tap to speak');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            AI Assistant
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ask anything about your LifeVault.
          </p>
        </div>

        <Badge variant="cyan" size="md" icon={<Sparkles size={12} />}>
          Second Brain Intelligence
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left AI Orb & Voice Controller Stage */}
        <div className="lg:col-span-4 glass-panel p-8 rounded-3xl border border-[#6C63FF]/30 flex flex-col items-center justify-center text-center space-y-6 shadow-glow-violet sticky top-24">
          <AiOrb
            size="lg"
            isListening={isListening}
            isThinking={isThinking}
            onClick={toggleVoiceMode}
          />

          <div>
            <h3 className="text-lg font-bold font-display text-white">{voiceStatusText}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Tap the glowing AI orb or microphone button to speak naturally.
            </p>
          </div>

          <VoiceWaveform isListening={isListening} />

          <Button
            variant={isListening ? 'danger' : 'gradient'}
            size="md"
            onClick={toggleVoiceMode}
            className="w-full"
            leftIcon={isListening ? <MicOff size={16} /> : <Mic size={16} />}
          >
            {isListening ? 'Stop Listening' : 'Tap to Speak'}
          </Button>

          {/* Clickable Suggestion Chips */}
          <div className="w-full pt-4 border-t border-white/10 text-left">
            <SuggestionChips onSelect={(q) => handleSendMessage(q)} />
          </div>
        </div>

        {/* Right Chat History & Response Panel */}
        <div className="lg:col-span-8 glass-panel rounded-3xl border border-white/15 overflow-hidden flex flex-col h-[650px] shadow-2xl">
          {/* Chat Messages Stream */}
          <ChatWindow
            messages={messages}
            isThinking={isThinking}
            onSelectFollowup={(text) => handleSendMessage(text)}
          />

          {/* Chat Input Bar */}
          <div className="p-4 border-t border-white/10 bg-[#0B0F1A]/80 flex items-center gap-3">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask your LifeVault..."
              className="flex-1 glass-input rounded-xl text-sm text-slate-100 px-4 py-3"
            />

            <button
              onClick={toggleVoiceMode}
              title="Voice Input"
              className={`p-3 rounded-xl border transition-colors ${
                isListening
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse'
                  : 'bg-white/5 text-slate-300 hover:text-white border-white/10 hover:bg-white/10'
              }`}
            >
              <Mic size={18} />
            </button>

            <Button
              variant="gradient"
              size="md"
              onClick={() => handleSendMessage()}
              rightIcon={<Send size={16} />}
            >
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
