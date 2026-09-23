import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Bot, 
  Sparkles, 
  Scan, 
  Compass, 
  Clock, 
  FileText, 
  Image as ImageIcon, 
  Bell, 
  Lock, 
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { AiOrb } from '../components/ui/AiOrb';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const floatingCards = [
    { title: 'Identity Documents', desc: 'PAN, Passport, Aadhaar (AES-256)', icon: ShieldCheck, color: 'border-[#6C63FF]/30 text-[#A5B4FC]', pos: 'top-4 -left-6 sm:-left-20' },
    { title: 'Goa & Manali Memories', desc: '24 Photos & Scuba Dive logs', icon: ImageIcon, color: 'border-[#FF7A50]/30 text-[#FF8C66]', pos: 'top-10 -right-6 sm:-right-24' },
    { title: 'Himalayan Trek', desc: 'July 12–17, 2026 Travel Log', icon: Compass, color: 'border-[#00D1FF]/30 text-[#38BDF8]', pos: 'bottom-16 -left-8 sm:-left-24' },
    { title: 'Project Notes', desc: 'LifeVault Architecture Specs', icon: FileText, color: 'border-[#34D399]/30 text-[#6EE7B7]', pos: 'bottom-8 -right-6 sm:-right-20' },
    { title: 'Passport Expiry', desc: 'Renewal Alert in 8 months', icon: Bell, color: 'border-yellow-500/30 text-yellow-400', pos: '-bottom-12 left-1/2 -translate-x-1/2' },
  ];

  const features = [
    { title: 'AI-Powered Organization', desc: 'Automatic tagging, contextual linking, and zero-effort indexing for all your life assets.', icon: Bot, badge: 'Smart Core' },
    { title: 'Smart OCR Extraction', desc: 'Instantly scan PAN cards, Passports, and receipts with field detection and expiry tracking.', icon: Scan, badge: 'OCR Engine' },
    { title: 'Voice Assistant Orb', desc: 'Ask natural questions like "Where did I travel last year?" or "When does my PAN expire?"', icon: Sparkles, badge: 'Interactive' },
    { title: 'AES-256 Secure Vault', desc: 'Biometric verification & encryption for sensitive identity, medical, and legal documents.', icon: Lock, badge: 'High Security' },
    { title: 'Chronological Timeline', desc: 'Relive your life milestones, projects, and family moments in a beautiful visual stream.', icon: Clock, badge: 'Milestones' },
    { title: 'Travel Memories & Map', desc: 'Interactive geographic trip logs, expense breakdowns, and photo carousels.', icon: Compass, badge: 'Interactive Map' },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-100 selection:bg-[#6C63FF]/30 overflow-x-hidden">
      {/* Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F1A]/70 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto rounded-b-2xl">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#00D1FF] p-0.5 shadow-glow-violet">
            <div className="w-full h-full bg-[#0B0F1A] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#00D1FF]" />
            </div>
          </div>
          <span className="text-xl font-extrabold font-display tracking-tight">
            Life<span className="text-[#6C63FF]">Vault</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
            Sign In
          </Button>
          <Button variant="gradient" size="sm" onClick={() => navigate('/signup')}>
            Unlock Vault
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 px-6 max-w-6xl mx-auto text-center flex flex-col items-center">
        {/* Top Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6C63FF]/15 border border-[#6C63FF]/30 text-xs font-semibold text-[#A5B4FC] mb-6 shadow-glow-violet"
        >
          <Sparkles size={14} className="text-[#00D1FF]" />
          <span>Your Intelligent Second Brain</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.1] max-w-4xl"
        >
          Everything important in your life.{' '}
          <span className="text-gradient-violet-cyan">One secure place.</span>
        </motion.h1>

        {/* Supporting Text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-slate-300 font-sans mt-6 max-w-2xl leading-relaxed"
        >
          Organize your memories, documents, travels, notes and important life information with intelligent assistance.
        </motion.p>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-8"
        >
          <Button
            variant="gradient"
            size="lg"
            onClick={() => navigate('/dashboard')}
            rightIcon={<ArrowRight size={18} />}
          >
            Unlock My Vault
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => navigate('/signup')}
          >
            Explore LifeVault
          </Button>
        </motion.div>

        {/* Animated AI Orb Hero Display */}
        <div className="relative mt-20 mb-16 flex items-center justify-center w-full max-w-2xl py-12">
          <AiOrb size="hero" onClick={() => navigate('/dashboard')} />

          {/* Floating Glass Cards around AI Orb */}
          {floatingCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 + i * 0.15 }}
                className={`hidden md:flex items-center gap-3 glass-panel p-3.5 rounded-2xl border ${card.color} shadow-2xl absolute ${card.pos} z-20 hover:scale-105 transition-transform duration-300 pointer-events-auto`}
              >
                <div className="p-2 rounded-xl bg-white/5">
                  <Icon size={18} />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-bold text-white font-display">{card.title}</h4>
                  <p className="text-[10px] text-slate-400 font-sans">{card.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Feature Grid Section */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10 relative">
        <div className="text-center mb-16">
          <Badge variant="cyan" size="md" className="mb-3">
            Intelligent Features
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight">
            Designed for Security & Intelligence
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 max-w-xl mx-auto">
            LifeVault unifies your digital memory, identity, and personal knowledge with state-of-the-art privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card key={feat.title} glowColor="violet" className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#6C63FF]/20 to-[#00D1FF]/20 border border-[#6C63FF]/30">
                      <Icon className="w-6 h-6 text-[#00D1FF]" />
                    </div>
                    <Badge variant="violet" size="sm">
                      {feat.badge}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold font-display text-white mb-2">{feat.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">{feat.desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center text-xs font-semibold text-[#00D1FF] group cursor-pointer" onClick={() => navigate('/dashboard')}>
                  <span>Explore module</span>
                  <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Bottom Strong Call to Action */}
      <section className="py-24 px-6 text-center max-w-4xl mx-auto">
        <div className="glass-panel p-12 rounded-3xl border border-[#6C63FF]/40 shadow-glow-violet relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#6C63FF]/20 rounded-full blur-3xl" />
          <div className="absolute -left-10 -top-10 w-48 h-48 bg-[#00D1FF]/20 rounded-full blur-3xl" />

          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white tracking-tight relative z-10">
            Your life, organized intelligently.
          </h2>
          <p className="text-slate-300 text-base mt-4 max-w-lg mx-auto relative z-10">
            Step into the future of personal memory, document management, and AI second brain assistance today.
          </p>
          <div className="mt-8 relative z-10">
            <Button
              variant="gradient"
              size="lg"
              onClick={() => navigate('/dashboard')}
              rightIcon={<ArrowRight size={18} />}
            >
              Get Started with LifeVault
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-6 text-center text-xs text-slate-500 font-mono">
        LifeVault © 2026 — Intelligent Second Brain System. AES-256 Security Architecture.
      </footer>
    </div>
  );
};
