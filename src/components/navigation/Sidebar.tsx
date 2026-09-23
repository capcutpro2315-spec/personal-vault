import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  Clock, 
  PlusCircle, 
  Compass, 
  ShieldCheck, 
  Bot, 
  Settings, 
  LogOut,
  Sparkles,
  Lock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../lib/utils';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const mainNavItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Timeline', path: '/timeline', icon: Clock },
    { name: 'Capture', path: '/capture', icon: PlusCircle, badge: 'AI OCR' },
    { name: 'Travel Map', path: '/travel', icon: Compass },
    { name: 'Secure Vault', path: '/vault', icon: ShieldCheck, badge: 'AES-256' },
    { name: 'AI Assistant', path: '/assistant', icon: Bot, highlight: true },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-[#0B0F1A]/80 backdrop-blur-xl h-screen sticky top-0 z-30 select-none">
      {/* Brand Header */}
      <div className="p-6 pb-4 flex items-center justify-between border-b border-white/5">
        <div 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6C63FF] to-[#00D1FF] p-0.5 shadow-glow-violet group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0F1A] rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#00D1FF]" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-extrabold font-display tracking-tight text-white flex items-center gap-1">
              Life<span className="text-[#6C63FF]">Vault</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
              <Lock size={10} className="text-[#34D399]" /> Intelligent Brain
            </p>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2 font-sans">
          Vault Command
        </div>

        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group',
                  isActive
                    ? 'bg-gradient-to-r from-[#6C63FF]/20 to-[#00D1FF]/10 text-white border border-[#6C63FF]/40 shadow-glow-violet'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={cn(
                        'transition-colors',
                        isActive
                          ? 'text-[#00D1FF]'
                          : 'text-slate-400 group-hover:text-slate-200'
                      )}
                    />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#6C63FF]/20 text-[#A5B4FC] border border-[#6C63FF]/30">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>

      {/* Footer Navigation & Profile */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm font-medium transition-colors',
              isActive ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            )
          }
        >
          <Settings size={18} />
          <span>Settings</span>
        </NavLink>

        {/* User Card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] border border-white/5">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
              alt="User Avatar"
              className="w-8 h-8 rounded-lg object-cover border border-white/20"
            />
            <div className="truncate">
              <p className="text-xs font-semibold text-white truncate">{user?.fullName || 'Vishnu Sharma'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Sign Out"
            className="text-slate-400 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
