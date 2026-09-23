import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Calendar, 
  Compass, 
  ShieldCheck, 
  Bell, 
  Camera, 
  Upload, 
  Mic, 
  FileText, 
  Check, 
  X, 
  ArrowRight,
  Clock,
  ChevronRight,
  AlertTriangle,
  Receipt,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    suggestions, 
    dismissSuggestion, 
    acceptSuggestion, 
    memories, 
    reminders, 
    toggleReminder
  } = useData();
  const navigate = useNavigate();

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'photo_detected': return <Camera size={18} className="text-[#00D1FF]" />;
      case 'receipt_grouping': return <Receipt size={18} className="text-[#FF7A50]" />;
      default: return <AlertTriangle size={18} className="text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Good morning, <span className="text-gradient-violet-cyan">{user?.fullName.split(' ')[0] || 'Vishnu'}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Here's what needs your attention today.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="gradient"
            size="md"
            onClick={() => navigate('/capture')}
            leftIcon={<Upload size={16} />}
          >
            Quick Capture
          </Button>
        </div>
      </div>

      {/* Quick Capture 4 Large Buttons */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-sans mb-3">Quick Capture</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Capture Photo', icon: Camera, color: 'text-[#FF7A50] hover:border-[#FF7A50]/40', tab: 'camera' },
            { label: 'Upload Image', icon: Upload, color: 'text-[#00D1FF] hover:border-[#00D1FF]/40', tab: 'upload' },
            { label: 'Voice Note', icon: Mic, color: 'text-[#6C63FF] hover:border-[#6C63FF]/40', tab: 'voice' },
            { label: 'Add Note', icon: FileText, color: 'text-[#34D399] hover:border-[#34D399]/40', tab: 'note' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => navigate(`/capture?tab=${item.tab}`)}
                className={`glass-panel p-5 rounded-2xl flex flex-col items-center justify-center gap-2.5 hover:bg-white/10 transition-all duration-200 border border-white/10 ${item.color} group shadow-md`}
              >
                <div className="p-3 rounded-2xl bg-white/5 group-hover:scale-110 transition-transform">
                  <Icon size={24} />
                </div>
                <span className="text-xs font-bold text-white font-sans">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Today Card, AI Suggestions & Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Today Card */}
          <Card glowColor="violet" className="p-6">
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-bold font-display text-white">
                  <Calendar className="text-[#6C63FF]" size={22} /> Today
                </CardTitle>
                <CardDescription>Key events, document alerts, and tasks scheduled for today</CardDescription>
              </div>
              <Badge variant="violet" size="sm">
                Active Items
              </Badge>
            </CardHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
              {/* Item 1: Calendar */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5 hover:bg-white/[0.08] transition-colors">
                <div className="p-2.5 rounded-xl bg-[#6C63FF]/20 text-[#A5B4FC] shrink-0">
                  <Calendar size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#A5B4FC]">10:30 AM</span>
                  <p className="text-sm font-bold text-white mt-0.5">Project Review</p>
                  <p className="text-[11px] text-slate-400">Final presentation sync with reviewers</p>
                </div>
              </div>

              {/* Item 2: Travel */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5 hover:bg-white/[0.08] transition-colors">
                <div className="p-2.5 rounded-xl bg-[#00D1FF]/20 text-[#38BDF8] shrink-0">
                  <Compass size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#38BDF8]">Travel</span>
                  <p className="text-sm font-bold text-white mt-0.5">Goa Trip Checklist</p>
                  <p className="text-[11px] text-slate-400">Scuba dive medical clearance & scooty rental</p>
                </div>
              </div>

              {/* Item 3: Document */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5 hover:bg-white/[0.08] transition-colors">
                <div className="p-2.5 rounded-xl bg-[#FF7A50]/20 text-[#FF8C66] shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#FF8C66]">Document</span>
                  <p className="text-sm font-bold text-white mt-0.5">PAN Card Renewal</p>
                  <p className="text-[11px] text-slate-400">Verify updated tax document copy in Vault</p>
                </div>
              </div>

              {/* Item 4: Reminder */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3.5 hover:bg-white/[0.08] transition-colors">
                <div className="p-2.5 rounded-xl bg-[#34D399]/20 text-[#6EE7B7] shrink-0">
                  <Bell size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-[#6EE7B7]">Reminder</span>
                  <p className="text-sm font-bold text-white mt-0.5">Complete project documentation</p>
                  <p className="text-[11px] text-slate-400">Finish LifeVault phase 2 architecture docs</p>
                </div>
              </div>
            </div>
          </Card>

          {/* AI Suggestions Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Sparkles className="text-[#00D1FF]" size={20} /> AI Suggestions
              </h3>
              <span className="text-xs text-slate-400 font-mono">{suggestions.length} available</span>
            </div>

            <div className="space-y-3">
              {suggestions.length === 0 ? (
                <div className="glass-panel p-6 rounded-2xl text-center text-slate-400 text-xs">
                  All AI suggestions processed. LifeVault is up to date!
                </div>
              ) : (
                suggestions.map((sug) => (
                  <motion.div
                    key={sug.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="glass-panel p-4 sm:p-5 rounded-2xl border border-[#6C63FF]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#00D1FF]/40 transition-colors shadow-lg"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="p-2.5 rounded-xl bg-[#121829] border border-white/10 shrink-0">
                        {getSuggestionIcon(sug.type)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{sug.description}</p>
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">{sug.timestamp}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => dismissSuggestion(sug.id)}
                        className="text-xs"
                      >
                        Dismiss
                      </Button>
                      <Button
                        variant="gradient"
                        size="sm"
                        onClick={() => acceptSuggestion(sug.id)}
                        rightIcon={<Check size={14} />}
                        className="text-xs"
                      >
                        Add to Vault
                      </Button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Recent Memories */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-display text-white">Recent Memories</h3>
              <button
                onClick={() => navigate('/timeline')}
                className="text-xs font-semibold text-[#00D1FF] hover:underline flex items-center gap-1"
              >
                View Timeline <ArrowRight size={14} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  onClick={() => navigate('/timeline')}
                  className="glass-panel p-3.5 rounded-2xl glass-panel-hover cursor-pointer group flex flex-col justify-between"
                >
                  <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                    <img
                      src={mem.imageUrl}
                      alt={mem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-80" />
                    <Badge variant="violet" size="sm" className="absolute top-2.5 left-2.5">
                      {mem.category}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white group-hover:text-[#00D1FF] transition-colors">
                      {mem.title}
                    </h4>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{mem.description}</p>
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-3 pt-2 border-t border-white/5">
                      <span>{mem.location}</span>
                      <span>{mem.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Upcoming List */}
        <div className="space-y-6">
          <Card glowColor="cyan" className="p-6">
            <CardHeader>
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-bold font-display text-white">
                  <Clock className="text-[#00D1FF]" size={20} /> Upcoming
                </CardTitle>
                <CardDescription>Scheduled priorities & renewals</CardDescription>
              </div>
            </CardHeader>

            <div className="space-y-3 mt-3">
              {[
                { title: 'Project Review', desc: 'Mini Project Sprint Sync', date: 'Today, 10:30 AM', category: 'Meeting', badge: 'orange' },
                { title: 'Document Renewal', desc: 'PAN Card verification', date: 'Sept 20, 2026', category: 'Document', badge: 'violet' },
                { title: 'Travel Checklist', desc: 'Goa Trip Preparation', date: 'Sept 12, 2026', category: 'Travel', badge: 'cyan' },
                { title: 'Family Reminder', desc: 'Call family for weekend plan', date: 'Today, 7:00 PM', category: 'Personal', badge: 'green' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors flex items-start justify-between"
                >
                  <div>
                    <h5 className="text-xs font-bold text-white">{item.title}</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.desc}</p>
                    <span className="text-[10px] font-mono text-slate-500 mt-1 block">{item.date}</span>
                  </div>
                  <Badge variant={item.badge as any} size="sm">
                    {item.category}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
