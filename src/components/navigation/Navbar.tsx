import React, { useState } from 'react';
import { Search, Bell, Bot, Sparkles, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const { user } = useAuth();
  const { reminders, suggestions, documents } = useData();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);

  const pendingReminders = reminders.filter((r) => r.status === 'Pending');

  // Documents requiring attention (expiring in 8 months or 32 days)
  const expiringDocs = documents.filter((d) => d.expiryDate && d.expiryDate.startsWith('2026') || d.title.includes('Insurance'));

  const totalNotifications = pendingReminders.length + suggestions.length + expiringDocs.length;

  return (
    <header className="sticky top-0 z-20 w-full border-b border-white/10 bg-[#0B0F1A]/70 backdrop-blur-xl px-4 sm:px-8 py-3 flex items-center justify-between">
      {/* Search Input Trigger */}
      <button
        onClick={onOpenSearch}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-slate-400 text-sm hover:border-[#6C63FF]/40 hover:bg-white/[0.08] transition-all w-full max-w-sm"
      >
        <Search size={16} className="text-[#6C63FF]" />
        <span className="truncate">Search documents, memories, travel...</span>
        <kbd className="ml-auto hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white/10 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Quick AI Voice Assistant Button */}
        <button
          onClick={() => navigate('/assistant')}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#6C63FF]/20 to-[#00D1FF]/20 border border-[#6C63FF]/40 text-xs font-semibold text-white hover:shadow-glow-violet transition-all"
        >
          <Bot size={16} className="text-[#00D1FF] animate-pulse" />
          <span className="hidden sm:inline">Ask AI</span>
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Bell size={18} />
            {totalNotifications > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF7A50] text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                {totalNotifications}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel border border-white/15 rounded-2xl shadow-2xl p-4 z-40 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white">Vault Alerts & Notifications</h4>
                <span className="text-[10px] text-[#00D1FF] font-mono">{totalNotifications} Active</span>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                {/* Expiring Docs Warning */}
                {expiringDocs.map((doc) => (
                  <div key={doc.id} onClick={() => { navigate('/vault'); setShowNotifications(false); }} className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30 cursor-pointer flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-[#FF7A50] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">Attention: {doc.title}</p>
                      <p className="text-[10px] text-red-300 mt-0.5">Expires soon ({doc.expiryDate}). Tap to view in Vault.</p>
                    </div>
                  </div>
                ))}

                {pendingReminders.map((rem) => (
                  <div key={rem.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                    <ShieldCheck size={16} className="text-[#34D399] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">{rem.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Category: {rem.category}</p>
                    </div>
                  </div>
                ))}

                {suggestions.map((sug) => (
                  <div key={sug.id} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                    <Sparkles size={16} className="text-[#00D1FF] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-white">{sug.description}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{sug.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar Badge */}
        <div 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-white/5 transition-colors"
        >
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
            alt="Avatar"
            className="w-8 h-8 rounded-lg object-cover border border-white/20"
          />
        </div>
      </div>
    </header>
  );
};
