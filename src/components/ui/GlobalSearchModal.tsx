import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, FileText, Image as ImageIcon, MapPin, Calendar, ArrowRight, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Badge } from './Badge';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { globalSearch } = useData();
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  const results = globalSearch(query);

  const handleSelectResult = (link: string) => {
    navigate(link);
    onClose();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Document': return <FileText size={16} className="text-[#6C63FF]" />;
      case 'Memory': return <ImageIcon size={16} className="text-[#FF7A50]" />;
      case 'Trip': return <MapPin size={16} className="text-[#00D1FF]" />;
      default: return <Calendar size={16} className="text-[#34D399]" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-[#0B0F1A]/85 backdrop-blur-md" onClick={onClose} />

      {/* Container */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="relative z-10 w-full max-w-2xl glass-panel border border-white/15 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Search Header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/10">
          <Search size={20} className="text-[#6C63FF]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents, memories, travel trips, notes, PAN card..."
            className="w-full bg-transparent text-slate-100 placeholder-slate-500 font-sans text-sm focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-slate-400 hover:text-white p-1">
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/5 border border-white/10 rounded">
            ESC
          </kbd>
        </div>

        {/* Quick Suggestion Chips */}
        {!query && (
          <div className="p-4 border-b border-white/5 bg-white/[0.02]">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Try searching for</p>
            <div className="flex flex-wrap gap-2">
              {['Manali', 'PAN Card', 'Goa Trip', 'Passport', 'Project Notes', 'Receipts'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => setQuery(chip)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white/5 hover:bg-[#6C63FF]/20 hover:text-[#A5B4FC] text-slate-300 transition-colors border border-white/10 flex items-center gap-1.5"
                >
                  <Search size={12} className="text-slate-400" />
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2">
          {query && results.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <Search className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              <p className="text-sm">No vault items found matching "{query}"</p>
              <p className="text-xs text-slate-500 mt-1">Try searching with tags like "Travel", "Identity", or "Goa"</p>
            </div>
          ) : (
            results.map((res) => (
              <div
                key={res.id}
                onClick={() => handleSelectResult(res.link)}
                className="group flex items-start justify-between p-3.5 rounded-xl hover:bg-white/5 transition-all duration-200 cursor-pointer border border-transparent hover:border-white/10"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-[#6C63FF]/20 transition-colors">
                    {getIcon(res.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-semibold text-white group-hover:text-[#00D1FF] transition-colors">
                        {res.title}
                      </h4>
                      <Badge variant="muted" size="sm">
                        {res.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-1">{res.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {res.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-slate-400 flex items-center gap-0.5">
                          <Tag size={10} className="text-slate-500" /> #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-500 group-hover:text-white transition-colors text-xs font-mono">
                  <span>{res.date}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};
