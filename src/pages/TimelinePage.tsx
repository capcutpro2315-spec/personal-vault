import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Plus, 
  Search, 
  Calendar, 
  MapPin, 
  Tag, 
  MoreVertical,
  FileText, 
  Image as ImageIcon, 
  Compass,
  Sparkles
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { TimelineCategory } from '../types';

export const TimelinePage: React.FC = () => {
  const { timelineEntries, addTimelineEntry } = useData();
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Timeline Entry Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('September 2026');
  const [category, setCategory] = useState<TimelineCategory>('Memory');
  const [location, setLocation] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const categories = ['All', 'Memories', 'Travel', 'Documents', 'Notes', 'Projects'];

  // Map display filter category to entry category
  const filterMap: Record<string, string> = {
    'Memories': 'Memory',
    'Travel': 'Travel',
    'Documents': 'Document',
    'Notes': 'Note',
    'Projects': 'Project',
  };

  const filteredEntries = timelineEntries.filter((entry) => {
    const targetCat = filterMap[activeFilter] || activeFilter;
    const matchesFilter = activeFilter === 'All' || entry.category === targetCat;
    
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || (
      entry.title.toLowerCase().includes(q) ||
      entry.description.toLowerCase().includes(q) ||
      entry.category.toLowerCase().includes(q) ||
      (entry.location && entry.location.toLowerCase().includes(q)) ||
      entry.tags.some((t) => t.toLowerCase().includes(q))
    );

    return matchesFilter && matchesSearch;
  });

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    const tags = tagsInput ? tagsInput.split(',').map((t) => t.trim()) : [category];

    addTimelineEntry({
      year: new Date().getFullYear(),
      month: date || 'September 2026',
      date: new Date().toISOString().split('T')[0],
      title,
      category,
      location: location || undefined,
      description,
      imageUrl: imageUrl || undefined,
      tags,
    });

    setTitle('');
    setDescription('');
    setDate('September 2026');
    setLocation('');
    setImageUrl('');
    setTagsInput('');
    setIsAddModalOpen(false);
  };

  const getCategoryBadgeVariant = (cat: string) => {
    switch (cat) {
      case 'Travel': return 'cyan';
      case 'Memory': return 'orange';
      case 'Document': return 'violet';
      case 'Project': return 'green';
      default: return 'muted';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Your Life Timeline
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Everything important, organized by time.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus size={16} />}
        >
          + Add Entry
        </Button>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10">
        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-sans transition-all ${
                activeFilter === cat
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#00D1FF] text-white shadow-glow-violet'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Timeline Input */}
        <div className="w-full md:w-72">
          <Input
            placeholder="Search your timeline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
      </div>

      {/* Vertical Timeline Stream */}
      {filteredEntries.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No memories yet."
          description={
            searchQuery || activeFilter !== 'All'
              ? `No timeline entries match search query "${searchQuery}".`
              : "Capture your first life memory, travel experience, or project note."
          }
          actionText="+ Add First Entry"
          onAction={() => setIsAddModalOpen(true)}
        />
      ) : (
        <div className="relative pl-6 sm:pl-10 space-y-8 before:absolute before:left-3 sm:before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-[#6C63FF] before:via-[#00D1FF] before:to-[#FF7A50]">
          {filteredEntries.map((entry, index) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="relative group"
            >
              {/* Connecting Bullet Node */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-4 w-6 h-6 rounded-full bg-[#0B0F1A] border-2 border-[#00D1FF] flex items-center justify-center shadow-glow-cyan group-hover:scale-125 transition-transform z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-[#6C63FF]" />
              </div>

              {/* Timeline Entry Card */}
              <div className="glass-panel p-6 rounded-3xl border border-white/10 glass-panel-hover grid grid-cols-1 md:grid-cols-3 gap-6 relative overflow-hidden">
                {entry.imageUrl && (
                  <div className="relative h-48 md:h-full rounded-2xl overflow-hidden">
                    <img
                      src={entry.imageUrl}
                      alt={entry.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A]/80 via-transparent to-transparent" />
                  </div>
                )}

                <div className={`${entry.imageUrl ? 'md:col-span-2' : 'md:col-span-3'} flex flex-col justify-between`}>
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={getCategoryBadgeVariant(entry.category)} size="sm">
                          {entry.category}
                        </Badge>
                        {entry.location && (
                          <span className="text-xs text-slate-400 flex items-center gap-1 font-sans">
                            <MapPin size={12} className="text-[#00D1FF]" /> {entry.location}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-[#00D1FF] font-semibold">
                          {entry.month}
                        </span>
                        <button className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold font-display text-white group-hover:text-[#00D1FF] transition-colors mb-2">
                      {entry.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                      {entry.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5">
                    {entry.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-slate-400 font-mono bg-white/5 px-2.5 py-0.5 rounded-md border border-white/10 flex items-center gap-1"
                      >
                        <Tag size={10} className="text-[#6C63FF]" /> #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Entry Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Timeline Entry">
        <form onSubmit={handleSaveEntry} className="space-y-4 pt-2">
          <Input
            label="Title"
            placeholder="Goa Trip Memories"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Date / Time Period"
              placeholder="August 2026"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TimelineCategory)}
                className="w-full glass-input rounded-xl text-sm text-slate-100 p-3"
              >
                {['Memory', 'Travel', 'Document', 'Note', 'Project'].map((c) => (
                  <option key={c} value={c} className="bg-[#121829] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Input
            label="Location (Optional)"
            placeholder="Palolem Beach, Goa"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Describe what made this moment special..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full glass-input rounded-xl text-sm text-slate-100 p-3"
              required
            />
          </div>

          <Input
            label="Image URL (Optional)"
            placeholder="https://images.unsplash.com/..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />

          <Input
            label="Tags (Comma Separated)"
            placeholder="Goa, Beach, Scuba, Vacation"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient">
              Save Entry
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
