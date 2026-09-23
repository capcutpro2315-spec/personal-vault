import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Clock, PlusCircle, Compass, ShieldCheck, Bot } from 'lucide-react';
import { cn } from '../../lib/utils';

export const MobileBottomNav: React.FC = () => {
  const navItems = [
    { name: 'Home', path: '/dashboard', icon: Home },
    { name: 'Timeline', path: '/timeline', icon: Clock },
    { name: 'Capture', path: '/capture', icon: PlusCircle, isPrimary: true },
    { name: 'Travel', path: '/travel', icon: Compass },
    { name: 'Vault', path: '/vault', icon: ShieldCheck },
    { name: 'AI', path: '/assistant', icon: Bot },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F1A]/90 backdrop-blur-2xl border-t border-white/10 px-2 py-2 flex items-center justify-around">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex flex-col items-center justify-center p-1.5 rounded-xl transition-all',
                item.isPrimary
                  ? 'bg-gradient-to-tr from-[#6C63FF] to-[#00D1FF] text-white p-2.5 -mt-5 shadow-glow-violet rounded-full border border-white/20'
                  : isActive
                  ? 'text-[#00D1FF]'
                  : 'text-slate-400 hover:text-white'
              )
            }
          >
            <Icon size={item.isPrimary ? 22 : 18} />
            {!item.isPrimary && <span className="text-[10px] font-medium mt-1 font-sans">{item.name}</span>}
          </NavLink>
        );
      })}
    </nav>
  );
};
