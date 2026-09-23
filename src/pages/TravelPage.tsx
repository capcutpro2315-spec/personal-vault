import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Compass, 
  MapPin, 
  Calendar, 
  Image as ImageIcon, 
  DollarSign, 
  FileText, 
  Plus, 
  ChevronRight, 
  Sparkles,
  Navigation,
  Globe,
  Layers,
  Star,
  X
} from 'lucide-react';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { TripItem } from '../types';

export const TravelPage: React.FC = () => {
  const { trips } = useData();
  const [activeFilter, setActiveFilter] = useState<string>('All Trips');
  const [selectedTrip, setSelectedTrip] = useState<TripItem | null>(null);
  const [activeMapPin, setActiveMapPin] = useState<{
    location: string;
    tripName: string;
    memories: number;
    date: string;
  } | null>({
    location: 'Goa',
    tripName: 'Goa Coastal Getaway',
    memories: 24,
    date: 'June 12–17, 2026'
  });

  const travelStats = [
    { title: 'Total Trips', value: '5', icon: Compass, color: 'text-[#6C63FF]' },
    { title: 'Places Visited', value: '12', icon: MapPin, color: 'text-[#00D1FF]' },
    { title: 'Memories', value: '86', icon: ImageIcon, color: 'text-[#FF7A50]' },
    { title: 'Countries', value: '3', icon: Globe, color: 'text-[#34D399]' },
  ];

  const travelFilters = ['All Trips', 'Recent', 'Most Memories', 'Favorites'];

  // Filter trips logic
  const filteredTrips = trips.filter((trip) => {
    if (activeFilter === 'Most Memories') return trip.memoryCount >= 20;
    if (activeFilter === 'Recent') return trip.dates.includes('2026');
    if (activeFilter === 'Favorites') return trip.destination.includes('Goa') || trip.destination.includes('Manali');
    return true;
  });

  const mapPins = [
    {
      id: 'hyderabad',
      location: 'Hyderabad',
      tripName: 'Hyderabad Cultural Heritage',
      memories: 32,
      date: 'Multiple visits',
      pos: 'bottom-1/3 right-1/3',
      color: 'bg-[#FF7A50]',
      textColor: 'text-[#FF8C66]',
      borderColor: 'border-[#FF7A50]/40'
    },
    {
      id: 'goa',
      location: 'Goa',
      tripName: 'Goa Coastal Getaway',
      memories: 24,
      date: 'June 12–17, 2026',
      pos: 'top-1/2 left-1/3',
      color: 'bg-[#00D1FF]',
      textColor: 'text-[#00D1FF]',
      borderColor: 'border-[#00D1FF]/40'
    },
    {
      id: 'manali',
      location: 'Manali',
      tripName: 'Manali Himalayan Trek',
      memories: 18,
      date: 'July 05–10, 2026',
      pos: 'top-1/4 left-1/2',
      color: 'bg-[#6C63FF]',
      textColor: 'text-[#A5B4FC]',
      borderColor: 'border-[#6C63FF]/40'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Your Travels
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Explore the places and memories you've collected.
          </p>
        </div>

        <Button variant="gradient" size="md" leftIcon={<Plus size={16} />}>
          Log New Trip
        </Button>
      </div>

      {/* Travel Summary Statistic Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {travelStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="glass-panel p-5 rounded-2xl border border-white/10 flex items-center gap-4 hover:border-white/20 transition-all"
            >
              <div className={`p-3 rounded-2xl bg-white/5 ${stat.color} shrink-0`}>
                <Icon size={24} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold font-mono text-slate-400 block">{stat.title}</span>
                <span className="text-2xl font-extrabold font-display text-white mt-0.5 block">{stat.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Map Section */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden glass-panel border border-white/15 p-4 shadow-2xl">
        {/* Mock Map Canvas Background */}
        <div className="absolute inset-0 bg-[#0B0F1A] opacity-95">
          <div className="absolute inset-0 bg-[radial-gradient(#1A233A_1.5px,transparent_1.5px)] [background-size:24px_24px] opacity-40" />
        </div>

        {/* Disclaimer Overlay */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-[#0B0F1A]/85 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 text-xs font-mono text-slate-300">
          <Navigation size={14} className="text-[#00D1FF] animate-pulse" />
          <span>Interactive Map Preview (Simulated Locations — Not Real GPS)</span>
        </div>

        {/* Interactive Location Pins */}
        {mapPins.map((pin) => (
          <div key={pin.id} className={`absolute ${pin.pos} transform -translate-x-1/2 -translate-y-1/2 z-20`}>
            <motion.div
              whileHover={{ scale: 1.2 }}
              onClick={() => {
                setActiveMapPin({
                  location: pin.location,
                  tripName: pin.tripName,
                  memories: pin.memories,
                  date: pin.date,
                });
                const t = trips.find((item) => item.destination.toLowerCase().includes(pin.location.toLowerCase()));
                if (t) setSelectedTrip(t);
              }}
              className="cursor-pointer flex flex-col items-center group"
            >
              <div className={`p-2.5 rounded-full ${pin.color} text-white shadow-glow-cyan font-bold border-2 border-white animate-bounce`}>
                <MapPin size={18} />
              </div>
              <span className={`mt-1 px-2.5 py-0.5 rounded-md bg-[#0B0F1A]/90 border ${pin.borderColor} text-[10px] font-mono ${pin.textColor} font-bold shadow-lg`}>
                {pin.location}
              </span>
            </motion.div>
          </div>
        ))}

        {/* Pin Details Floating Tooltip Display */}
        {activeMapPin && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 right-4 z-30 glass-panel p-4 rounded-2xl border border-white/20 shadow-2xl max-w-xs space-y-2 bg-[#0B0F1A]/90 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-1.5">
              <span className="text-xs font-bold text-[#00D1FF] font-mono flex items-center gap-1">
                <MapPin size={12} /> {activeMapPin.location}
              </span>
              <button onClick={() => setActiveMapPin(null)} className="text-slate-400 hover:text-white p-0.5">
                <X size={14} />
              </button>
            </div>
            <h4 className="text-sm font-bold text-white font-display">{activeMapPin.tripName}</h4>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 pt-1">
              <span>{activeMapPin.memories} memories</span>
              <span>{activeMapPin.date}</span>
            </div>
          </motion.div>
        )}
      </div>

      {/* Travel Filters & Trip Cards Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-bold font-display text-white">Your Trip Collection</h2>

          {/* Travel Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {travelFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-sans transition-all ${
                  activeFilter === filter
                    ? 'bg-gradient-to-r from-[#6C63FF] to-[#00D1FF] text-white shadow-glow-violet'
                    : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Trip Cards Grid */}
        {filteredTrips.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="No trips added yet."
            description="Start logging your travel memories, photos, and expense logs with LifeVault."
            actionText="+ Log First Trip"
            onAction={() => alert('New trip logging form coming up!')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card
                key={trip.id}
                glowColor="cyan"
                className="flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                    <img
                      src={trip.coverImage}
                      alt={trip.destination}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F1A] via-transparent to-transparent opacity-80" />
                    <Badge variant="cyan" size="sm" className="absolute top-3 left-3">
                      {trip.memoryCount} memories
                    </Badge>
                  </div>

                  <h3 className="text-xl font-bold font-display text-white group-hover:text-[#00D1FF] transition-colors">
                    {trip.destination}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-1.5">
                    <Calendar size={12} className="text-[#6C63FF]" /> {trip.dates}
                  </p>

                  <div className="mt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider font-mono text-slate-400 block mb-1">
                      Places Visited
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {trip.placesVisited.slice(0, 3).map((place) => (
                        <span key={place} className="text-[10px] font-sans px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                          {place}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <Button
                    variant="gradient"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedTrip(trip)}
                    rightIcon={<ChevronRight size={14} />}
                  >
                    View Trip
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Trip Details Modal */}
      {selectedTrip && (
        <Modal
          isOpen={Boolean(selectedTrip)}
          onClose={() => setSelectedTrip(null)}
          title={`Trip Details — ${selectedTrip.destination}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#00D1FF] pb-3 border-b border-white/10">
              <span className="flex items-center gap-1.5"><Calendar size={14} /> {selectedTrip.dates}</span>
              <span className="flex items-center gap-1.5"><ImageIcon size={14} /> {selectedTrip.memoryCount} Memories</span>
            </div>

            {/* Photos */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-[#00D1FF]" /> Photos
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {selectedTrip.photos.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Trip memory photo"
                    className="w-full h-28 object-cover rounded-xl border border-white/10 hover:opacity-90 transition-opacity"
                  />
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                <FileText size={14} className="text-[#6C63FF]" /> Notes
              </h4>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">{selectedTrip.notes}</p>
            </div>

            {/* Places Visited */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <MapPin size={14} className="text-[#34D399]" /> Places Visited
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedTrip.placesVisited.map((place) => (
                  <Badge key={place} variant="muted" size="sm">
                    {place}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Expenses */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <DollarSign size={14} className="text-[#FF7A50]" /> Expenses Breakdown
              </h4>
              <div className="space-y-1.5 p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-xs">
                {selectedTrip.expenses.map((exp, i) => (
                  <div key={i} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                    <span className="text-slate-300">{exp.item}</span>
                    <span className="font-bold text-[#34D399]">{exp.cost}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
