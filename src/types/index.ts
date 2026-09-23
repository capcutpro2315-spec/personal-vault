export type VaultCategory = 
  | 'Identity Documents' 
  | 'Financial' 
  | 'Medical' 
  | 'Insurance' 
  | 'Education' 
  | 'Legal' 
  | 'Personal';

export type TimelineCategory = 
  | 'Memory' 
  | 'Travel' 
  | 'Document' 
  | 'Note' 
  | 'Project';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  isBiometricEnabled: boolean;
}

export interface DocumentItem {
  id: string;
  userId: string;
  title: string;
  fileName: string;
  fileSize: string;
  fileType: string;
  fileUrl?: string;
  category: VaultCategory;
  uploadDate: string;
  expiryDate?: string;
  securityStatus: 'AES-256 Encrypted' | 'Protected' | 'Restricted';
  extractedData?: Record<string, string>;
  tags: string[];
}

export interface MemoryItem {
  id: string;
  userId: string;
  title: string;
  location?: string;
  date: string;
  imageUrl: string;
  description: string;
  category: string;
  tags: string[];
}

export interface TimelineEntry {
  id: string;
  userId: string;
  year: number;
  month: string;
  date: string;
  title: string;
  category: TimelineCategory;
  location?: string;
  description: string;
  imageUrl?: string;
  tags: string[];
}

export interface NoteItem {
  id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  updatedAt: string;
  tags: string[];
}

export interface TripLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

export interface TripItem {
  id: string;
  userId: string;
  destination: string;
  dates: string;
  memoryCount: number;
  coverImage: string;
  photos: string[];
  notes: string;
  placesVisited: string[];
  expenses: { item: string; cost: string }[];
  coordinates: { lat: number; lng: number };
}

export interface ReminderItem {
  id: string;
  userId: string;
  title: string;
  dueDate: string;
  category: 'Document Expiry' | 'Meeting' | 'Travel Checklist' | 'Personal';
  status: 'Pending' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
}

export interface AiSuggestionItem {
  id: string;
  userId: string;
  icon: string;
  type: 'photo_detected' | 'receipt_grouping' | 'expiry_alert' | 'memory_relive';
  description: string;
  timestamp: string;
  actionText: string;
}

export interface VoiceNoteItem {
  id: string;
  userId: string;
  title: string;
  duration: string;
  transcript: string;
  createdAt: string;
  audioUrl?: string;
}

export interface SearchResult {
  id: string;
  title: string;
  type: 'Document' | 'Memory' | 'Timeline' | 'Note' | 'Trip';
  date: string;
  description: string;
  tags: string[];
  link: string;
}
