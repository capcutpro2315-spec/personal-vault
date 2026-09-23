import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DocumentItem, 
  MemoryItem, 
  TimelineEntry, 
  NoteItem, 
  TripItem, 
  ReminderItem, 
  AiSuggestionItem,
  VoiceNoteItem,
  SearchResult
} from '../types';
import { 
  INITIAL_DOCUMENTS, 
  INITIAL_MEMORIES, 
  INITIAL_TIMELINE, 
  INITIAL_NOTES, 
  INITIAL_TRIPS, 
  INITIAL_REMINDERS, 
  INITIAL_SUGGESTIONS,
  INITIAL_VOICE_NOTES
} from '../data/mockData';
import { isSupabaseConfigured } from '../lib/supabase';
import { documentService } from '../services/documentService';
import { memoryService } from '../services/memoryService';
import { timelineService } from '../services/timelineService';
import { noteService } from '../services/noteService';
import { tripService } from '../services/tripService';
import { reminderService } from '../services/reminderService';
import { suggestionService } from '../services/suggestionService';
import { voiceNoteService } from '../services/voiceNoteService';

const LOCAL_STORAGE_KEY = 'lifevault_phase4_data';

interface DataContextType {
  documents: DocumentItem[];
  memories: MemoryItem[];
  timelineEntries: TimelineEntry[];
  notes: NoteItem[];
  trips: TripItem[];
  reminders: ReminderItem[];
  suggestions: AiSuggestionItem[];
  voiceNotes: VoiceNoteItem[];
  isLoadingData: boolean;
  addDocument: (doc: Omit<DocumentItem, 'id' | 'userId' | 'uploadDate'>, file?: File) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;
  addMemory: (mem: Omit<MemoryItem, 'id' | 'userId'>, imageFile?: File) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
  addTimelineEntry: (entry: Omit<TimelineEntry, 'id' | 'userId'>) => Promise<void>;
  deleteTimelineEntry: (id: string) => Promise<void>;
  addNote: (note: Omit<NoteItem, 'id' | 'userId' | 'updatedAt'>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  addTrip: (trip: Omit<TripItem, 'id' | 'userId'>) => Promise<void>;
  deleteTrip: (id: string) => Promise<void>;
  addVoiceNote: (vn: Omit<VoiceNoteItem, 'id' | 'userId' | 'createdAt'>, audioBlob?: Blob) => Promise<void>;
  dismissSuggestion: (id: string) => Promise<void>;
  acceptSuggestion: (id: string) => Promise<void>;
  toggleReminder: (id: string) => Promise<void>;
  globalSearch: (query: string) => SearchResult[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse localStorage lifevault data', e);
    }
    return {
      documents: INITIAL_DOCUMENTS,
      memories: INITIAL_MEMORIES,
      timelineEntries: INITIAL_TIMELINE,
      notes: INITIAL_NOTES,
      trips: INITIAL_TRIPS,
      reminders: INITIAL_REMINDERS,
      suggestions: INITIAL_SUGGESTIONS,
      voiceNotes: INITIAL_VOICE_NOTES,
    };
  });

  const [isLoadingData, setIsLoadingData] = useState(false);

  const { documents, memories, timelineEntries, notes, trips, reminders, suggestions, voiceNotes } = data;

  // Persist state changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to write to localStorage', e);
    }
  }, [data]);

  // Load live Supabase data on mount if configured
  useEffect(() => {
    if (isSupabaseConfigured) {
      setIsLoadingData(true);
      Promise.all([
        documentService.fetchDocuments(),
        memoryService.fetchMemories(),
        timelineService.fetchTimelineEntries(),
        noteService.fetchNotes(),
        tripService.fetchTrips(),
        reminderService.fetchReminders(),
        suggestionService.fetchSuggestions(),
        voiceNoteService.fetchVoiceNotes(),
      ])
        .then(([docs, mems, times, nts, trps, rems, sugs, vns]) => {
          setData((prev: any) => ({
            ...prev,
            documents: docs.length > 0 ? docs : prev.documents,
            memories: mems.length > 0 ? mems : prev.memories,
            timelineEntries: times.length > 0 ? times : prev.timelineEntries,
            notes: nts.length > 0 ? nts : prev.notes,
            trips: trps.length > 0 ? trps : prev.trips,
            reminders: rems.length > 0 ? rems : prev.reminders,
            suggestions: sugs.length > 0 ? sugs : prev.suggestions,
            voiceNotes: vns.length > 0 ? vns : prev.voiceNotes,
          }));
        })
        .catch((err) => console.warn('Supabase fetch error:', err))
        .finally(() => setIsLoadingData(false));
    }
  }, []);

  const addDocument = async (doc: Omit<DocumentItem, 'id' | 'userId' | 'uploadDate'>, file?: File) => {
    let createdDoc: DocumentItem | null = null;
    if (isSupabaseConfigured && file) {
      createdDoc = await documentService.uploadDocument(file, doc);
    }

    const newDoc: DocumentItem = createdDoc || {
      ...doc,
      id: `doc-${Date.now()}`,
      userId: 'user-demo',
      uploadDate: new Date().toISOString().split('T')[0],
    };

    const newTimelineEntry: TimelineEntry = {
      id: `time-${Date.now()}`,
      userId: 'user-demo',
      year: new Date().getFullYear(),
      month: new Date().toLocaleString('en-US', { month: 'long' }) + ' ' + new Date().getFullYear(),
      date: new Date().toISOString().split('T')[0],
      title: doc.title,
      category: 'Document',
      description: `Uploaded ${doc.fileName} (${doc.category})`,
      tags: doc.tags,
    };

    if (isSupabaseConfigured) {
      timelineService.addTimelineEntry(newTimelineEntry);
    }

    setData((prev: any) => ({
      ...prev,
      documents: [newDoc, ...prev.documents],
      timelineEntries: [newTimelineEntry, ...prev.timelineEntries],
    }));
  };

  const deleteDocument = async (id: string) => {
    if (isSupabaseConfigured) {
      const found = documents.find((d: DocumentItem) => d.id === id);
      await documentService.deleteDocument(id, (found as any)?.filePath);
    }
    setData((prev: any) => ({
      ...prev,
      documents: prev.documents.filter((d: DocumentItem) => d.id !== id),
    }));
  };

  const addMemory = async (mem: Omit<MemoryItem, 'id' | 'userId'>, imageFile?: File) => {
    let createdMemory: MemoryItem | null = null;
    if (isSupabaseConfigured) {
      createdMemory = await memoryService.addMemory(mem, imageFile);
    }

    const newMem: MemoryItem = createdMemory || {
      ...mem,
      id: `mem-${Date.now()}`,
      userId: 'user-demo',
    };

    const newTimelineEntry: TimelineEntry = {
      id: `time-${Date.now()}`,
      userId: 'user-demo',
      year: new Date().getFullYear(),
      month: mem.date || 'September 2026',
      date: new Date().toISOString().split('T')[0],
      title: mem.title,
      category: 'Memory',
      location: mem.location,
      description: mem.description,
      imageUrl: mem.imageUrl,
      tags: mem.tags,
    };

    if (isSupabaseConfigured) {
      timelineService.addTimelineEntry(newTimelineEntry);
    }

    setData((prev: any) => ({
      ...prev,
      memories: [newMem, ...prev.memories],
      timelineEntries: [newTimelineEntry, ...prev.timelineEntries],
    }));
  };

  const deleteMemory = async (id: string) => {
    if (isSupabaseConfigured) {
      await memoryService.deleteMemory(id);
    }
    setData((prev: any) => ({
      ...prev,
      memories: prev.memories.filter((m: MemoryItem) => m.id !== id),
    }));
  };

  const addTimelineEntry = async (entry: Omit<TimelineEntry, 'id' | 'userId'>) => {
    let createdEntry: TimelineEntry | null = null;
    if (isSupabaseConfigured) {
      createdEntry = await timelineService.addTimelineEntry(entry);
    }

    const newEntry: TimelineEntry = createdEntry || {
      ...entry,
      id: `time-${Date.now()}`,
      userId: 'user-demo',
    };

    setData((prev: any) => ({
      ...prev,
      timelineEntries: [newEntry, ...prev.timelineEntries],
    }));
  };

  const deleteTimelineEntry = async (id: string) => {
    if (isSupabaseConfigured) {
      await timelineService.deleteTimelineEntry(id);
    }
    setData((prev: any) => ({
      ...prev,
      timelineEntries: prev.timelineEntries.filter((t: TimelineEntry) => t.id !== id),
    }));
  };

  const addNote = async (note: Omit<NoteItem, 'id' | 'userId' | 'updatedAt'>) => {
    let createdNote: NoteItem | null = null;
    if (isSupabaseConfigured) {
      createdNote = await noteService.addNote(note);
    }

    const newNote: NoteItem = createdNote || {
      ...note,
      id: `note-${Date.now()}`,
      userId: 'user-demo',
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setData((prev: any) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));
  };

  const deleteNote = async (id: string) => {
    if (isSupabaseConfigured) {
      await noteService.deleteNote(id);
    }
    setData((prev: any) => ({
      ...prev,
      notes: prev.notes.filter((n: NoteItem) => n.id !== id),
    }));
  };

  const addTrip = async (trip: Omit<TripItem, 'id' | 'userId'>) => {
    let createdTrip: TripItem | null = null;
    if (isSupabaseConfigured) {
      createdTrip = await tripService.addTrip(trip);
    }

    const newTrip: TripItem = createdTrip || {
      ...trip,
      id: `trip-${Date.now()}`,
      userId: 'user-demo',
    };

    setData((prev: any) => ({
      ...prev,
      trips: [newTrip, ...prev.trips],
    }));
  };

  const deleteTrip = async (id: string) => {
    if (isSupabaseConfigured) {
      await tripService.deleteTrip(id);
    }
    setData((prev: any) => ({
      ...prev,
      trips: prev.trips.filter((t: TripItem) => t.id !== id),
    }));
  };

  const addVoiceNote = async (vn: Omit<VoiceNoteItem, 'id' | 'userId' | 'createdAt'>, audioBlob?: Blob) => {
    let createdVn: VoiceNoteItem | null = null;
    if (isSupabaseConfigured) {
      createdVn = await voiceNoteService.addVoiceNote(vn.title, vn.transcript, audioBlob);
    }

    const newVn: VoiceNoteItem = createdVn || {
      ...vn,
      id: `voice-${Date.now()}`,
      userId: 'user-demo',
      createdAt: new Date().toISOString(),
    };

    setData((prev: any) => ({
      ...prev,
      voiceNotes: [newVn, ...prev.voiceNotes],
    }));
  };

  const dismissSuggestion = async (id: string) => {
    if (isSupabaseConfigured) {
      await suggestionService.updateSuggestionStatus(id, 'dismissed');
    }
    setData((prev: any) => ({
      ...prev,
      suggestions: prev.suggestions.filter((s: AiSuggestionItem) => s.id !== id),
    }));
  };

  const acceptSuggestion = async (id: string) => {
    if (isSupabaseConfigured) {
      await suggestionService.updateSuggestionStatus(id, 'accepted');
    }
    dismissSuggestion(id);
  };

  const toggleReminder = async (id: string) => {
    const found = reminders.find((r: ReminderItem) => r.id === id);
    if (isSupabaseConfigured && found) {
      await reminderService.toggleReminder(id, found.status === 'Completed');
    }
    setData((prev: any) => ({
      ...prev,
      reminders: prev.reminders.map((r: ReminderItem) =>
        r.id === id ? { ...r, status: r.status === 'Pending' ? 'Completed' : 'Pending' } : r
      ),
    }));
  };

  const globalSearch = (query: string): SearchResult[] => {
    if (!query || query.trim() === '') return [];
    const q = query.toLowerCase().trim();

    const results: SearchResult[] = [];

    // Search Documents
    documents.forEach((d: DocumentItem) => {
      if (
        d.title.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push({
          id: d.id,
          title: d.title,
          type: 'Document',
          date: d.uploadDate,
          description: `${d.category} — ${d.fileName} (${d.securityStatus})`,
          tags: d.tags,
          link: '/vault',
        });
      }
    });

    // Search Memories
    memories.forEach((m: MemoryItem) => {
      if (
        m.title.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q))
      ) {
        results.push({
          id: m.id,
          title: m.title,
          type: 'Memory',
          date: m.date,
          description: m.description,
          tags: m.tags,
          link: '/timeline',
        });
      }
    });

    // Search Timeline
    timelineEntries.forEach((t: TimelineEntry) => {
      if (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tg) => tg.toLowerCase().includes(q))
      ) {
        results.push({
          id: t.id,
          title: t.title,
          type: 'Timeline',
          date: t.date,
          description: t.description,
          tags: t.tags,
          link: '/timeline',
        });
      }
    });

    // Search Trips
    trips.forEach((tr: TripItem) => {
      if (
        tr.destination.toLowerCase().includes(q) ||
        tr.notes.toLowerCase().includes(q) ||
        tr.placesVisited.some((p) => p.toLowerCase().includes(q))
      ) {
        results.push({
          id: tr.id,
          title: tr.destination,
          type: 'Trip',
          date: tr.dates,
          description: tr.notes,
          tags: tr.placesVisited,
          link: '/travel',
        });
      }
    });

    // Search Notes
    notes.forEach((n: NoteItem) => {
      if (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((tg) => tg.toLowerCase().includes(q))
      ) {
        results.push({
          id: n.id,
          title: n.title,
          type: 'Note',
          date: n.updatedAt,
          description: n.content.substring(0, 80) + '...',
          tags: n.tags,
          link: '/dashboard',
        });
      }
    });

    return results;
  };

  return (
    <DataContext.Provider
      value={{
        documents,
        memories,
        timelineEntries,
        notes,
        trips,
        reminders,
        suggestions,
        voiceNotes,
        isLoadingData,
        addDocument,
        deleteDocument,
        addMemory,
        deleteMemory,
        addTimelineEntry,
        deleteTimelineEntry,
        addNote,
        deleteNote,
        addTrip,
        deleteTrip,
        addVoiceNote,
        dismissSuggestion,
        acceptSuggestion,
        toggleReminder,
        globalSearch,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
