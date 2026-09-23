import { 
  DocumentItem, 
  MemoryItem, 
  TimelineEntry, 
  NoteItem, 
  TripItem, 
  ReminderItem, 
  AiSuggestionItem,
  VoiceNoteItem 
} from '../types';

export const INITIAL_SUGGESTIONS: AiSuggestionItem[] = [
  {
    id: 'sug-1',
    userId: 'user-demo',
    icon: 'Camera',
    type: 'photo_detected',
    description: '3 photos from Manali detected',
    timestamp: '2 hours ago',
    actionText: 'Add to Vault'
  },
  {
    id: 'sug-2',
    userId: 'user-demo',
    icon: 'Receipt',
    type: 'receipt_grouping',
    description: 'These receipts may belong to your Goa trip',
    timestamp: '5 hours ago',
    actionText: 'Add to Vault'
  },
  {
    id: 'sug-3',
    userId: 'user-demo',
    icon: 'AlertTriangle',
    type: 'expiry_alert',
    description: 'Your PAN card may need attention soon',
    timestamp: '1 day ago',
    actionText: 'Add to Vault'
  }
];

export const INITIAL_REMINDERS: ReminderItem[] = [
  {
    id: 'rem-1',
    userId: 'user-demo',
    title: 'Project Review',
    dueDate: '2026-09-07T10:30:00',
    category: 'Meeting',
    status: 'Pending',
    priority: 'High'
  },
  {
    id: 'rem-2',
    userId: 'user-demo',
    title: 'Document Renewal',
    dueDate: '2026-09-20T17:00:00',
    category: 'Document Expiry',
    status: 'Pending',
    priority: 'High'
  },
  {
    id: 'rem-3',
    userId: 'user-demo',
    title: 'Travel Checklist',
    dueDate: '2026-09-12T09:00:00',
    category: 'Travel Checklist',
    status: 'Pending',
    priority: 'Medium'
  },
  {
    id: 'rem-4',
    userId: 'user-demo',
    title: 'Family Reminder',
    dueDate: '2026-09-07T19:00:00',
    category: 'Personal',
    status: 'Pending',
    priority: 'Low'
  }
];

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem-1',
    userId: 'user-demo',
    title: 'Manali',
    location: 'Solang Valley, Himachal Pradesh',
    date: 'July 2026',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800',
    description: 'Crisp mountain air, snowcapped peaks, and trekking through Solang valley.',
    category: 'Memory',
    tags: ['Manali', 'Mountains', 'Snow', 'Trek']
  },
  {
    id: 'mem-2',
    userId: 'user-demo',
    title: 'Goa',
    location: 'Palolem Beach, South Goa',
    date: 'August 2026',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
    description: 'Golden sunsets over the Arabian sea and beach scuba diving.',
    category: 'Travel',
    tags: ['Goa', 'Beach', 'Ocean', 'Sunset']
  },
  {
    id: 'mem-3',
    userId: 'user-demo',
    title: 'College Project',
    location: 'Tech Innovation Lab',
    date: 'September 2026',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    description: 'Final presentation of LifeVault Intelligent Second Brain system.',
    category: 'Project',
    tags: ['College', 'Project', 'AI', 'Review']
  },
  {
    id: 'mem-4',
    userId: 'user-demo',
    title: 'Family',
    location: 'Heritage Villa, Hyderabad',
    date: 'May 2026',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
    description: 'Annual family gathering and feast with cousins and grandparents.',
    category: 'Memory',
    tags: ['Family', 'Reunion', 'Hyderabad', 'Home']
  }
];

export const INITIAL_TIMELINE: TimelineEntry[] = [
  {
    id: 'time-1',
    userId: 'user-demo',
    year: 2026,
    month: 'September 2026',
    date: '2026-09-02',
    title: 'Mini Project Review',
    category: 'Project',
    location: 'Tech Innovation Hub',
    description: 'Successfully presented LifeVault architecture to faculty and project reviewers.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
    tags: ['Project', 'College', 'Review', 'AI']
  },
  {
    id: 'time-2',
    userId: 'user-demo',
    year: 2026,
    month: 'August 2026',
    date: '2026-08-12',
    title: 'Goa Trip',
    category: 'Travel',
    location: 'Palolem Beach, Goa',
    description: 'Coastal vacation, water sports, scooty rides along Anjuna, and beach sunsets.',
    imageUrl: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
    tags: ['Goa', 'Travel', 'Beach', 'Vacation']
  },
  {
    id: 'time-3',
    userId: 'user-demo',
    year: 2026,
    month: 'July 2026',
    date: '2026-07-15',
    title: 'Manali Memories',
    category: 'Memory',
    location: 'Solang Valley, Himachal',
    description: 'Mountain trek through Old Manali cafes, Atal Tunnel, and Solang valley.',
    imageUrl: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800',
    tags: ['Manali', 'Himalayas', 'Trek', 'Memory']
  },
  {
    id: 'time-4',
    userId: 'user-demo',
    year: 2026,
    month: 'June 2026',
    date: '2026-06-20',
    title: 'Important College Notes',
    category: 'Note',
    location: 'University Library',
    description: 'Archived system design notes and database schemas into LifeVault.',
    tags: ['Note', 'College', 'Study', 'Docs']
  }
];

export const INITIAL_TRIPS: TripItem[] = [
  {
    id: 'trip-goa',
    userId: 'user-demo',
    destination: 'Goa',
    dates: 'June 12–17, 2026',
    memoryCount: 24,
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
    photos: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800'
    ],
    notes: 'Resort stay at Palolem Beach. Scuba diving at Grand Island, visit to Aguada Fort and Anjuna beach cafes.',
    placesVisited: ['Palolem Beach', 'Fort Aguada', 'Anjuna Beach', 'Grand Island Scuba', 'Fontainhas'],
    expenses: [
      { item: 'Flight Tickets', cost: '₹12,400' },
      { item: 'Beach Resort (5 Nights)', cost: '₹18,500' },
      { item: 'Scuba Package', cost: '₹4,500' },
      { item: 'Scooty Rental & Fuel', cost: '₹2,200' },
      { item: 'Dining & Seafood', cost: '₹8,900' }
    ],
    coordinates: { lat: 15.2993, lng: 74.1240 }
  },
  {
    id: 'trip-manali',
    userId: 'user-demo',
    destination: 'Manali',
    dates: 'July 05–10, 2026',
    memoryCount: 18,
    coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800',
    photos: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'
    ],
    notes: 'Trekking through Solang valley and Atal tunnel to Sissu waterfall. Local Siddu dish and Old Manali cafes.',
    placesVisited: ['Solang Valley', 'Rohtang Pass', 'Atal Tunnel', 'Sissu Waterfall', 'Old Manali Cafe'],
    expenses: [
      { item: 'Volvo Bus', cost: '₹3,600' },
      { item: 'Homestay in Old Manali', cost: '₹9,800' },
      { item: 'Paragliding', cost: '₹3,200' },
      { item: 'Cafes & Local Food', cost: '₹4,300' }
    ],
    coordinates: { lat: 32.2432, lng: 77.1892 }
  },
  {
    id: 'trip-hyderabad',
    userId: 'user-demo',
    destination: 'Hyderabad',
    dates: 'Multiple visits',
    memoryCount: 32,
    coverImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=800',
    photos: [
      'https://images.unsplash.com/photo-1605379399642-870262d3d051?auto=format&fit=crop&q=80&w=800'
    ],
    notes: 'Family visits, historic Golconda fort exploration, Charminar market shopping, and Hyderabadi Biryani.',
    placesVisited: ['Charminar', 'Golconda Fort', 'Hussain Sagar Lake', 'Chowmahalla Palace'],
    expenses: [
      { item: 'Hotel Stay', cost: '₹7,500' },
      { item: 'Food & Dining', cost: '₹3,400' }
    ],
    coordinates: { lat: 17.3850, lng: 78.4867 }
  }
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-1',
    userId: 'user-demo',
    title: 'Permanent Account Number (PAN Card)',
    fileName: 'PAN_Card_Verified.pdf',
    fileSize: '1.2 MB',
    fileType: 'PDF Document',
    category: 'Identity Documents',
    uploadDate: '2026-01-10',
    expiryDate: '2031-12-31',
    securityStatus: 'AES-256 Encrypted',
    extractedData: {
      'PAN Number': 'ABCDE1234F',
      'Name': 'Vishnu Sharma',
      'Father Name': 'R. K. Sharma',
      'Date of Birth': '1998-05-14'
    },
    tags: ['PAN', 'Identity', 'Tax', 'Government']
  },
  {
    id: 'doc-2',
    userId: 'user-demo',
    title: 'International Passport',
    fileName: 'Passport_Scan_Official.pdf',
    fileSize: '3.4 MB',
    fileType: 'PDF Document',
    category: 'Identity Documents',
    uploadDate: '2022-05-10',
    expiryDate: '2027-05-09',
    securityStatus: 'AES-256 Encrypted',
    extractedData: {
      'Passport No': 'Z8394019',
      'Nationality': 'INDIAN',
      'Date of Issue': '2017-05-10',
      'Date of Expiry': '2027-05-09'
    },
    tags: ['Passport', 'Travel', 'Identity', 'Visa']
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    userId: 'user-demo',
    title: 'Goa Trip Preparation Checklist',
    content: `1. Scuba diving medical clearance form
2. Waterproof phone pouch & GoPro charger
3. Driving License for scooty rental
4. Sunscreen SPF 50+
5. Emergency contact printout`,
    category: 'Travel',
    updatedAt: '2026-08-10',
    tags: ['Goa', 'Checklist', 'Travel']
  },
  {
    id: 'note-2',
    userId: 'user-demo',
    title: 'LifeVault Architecture Specs',
    content: `Core Principles:
- AES-256 Vault level security for sensitive identity documents
- OCR field extraction for automatic expiry reminders
- AI Voice Assistant for instant semantic queries over personal timeline`,
    category: 'Project',
    updatedAt: '2026-09-01',
    tags: ['Architecture', 'AI', 'Project']
  }
];

export const INITIAL_VOICE_NOTES: VoiceNoteItem[] = [
  {
    id: 'voice-1',
    userId: 'user-demo',
    title: 'Manali Solang Valley Audio Log',
    duration: '0:45',
    transcript: 'Standing right under the snow peaks at Solang Valley. Crisp mountain air and hot chai.',
    createdAt: '2026-07-15T16:30:00'
  }
];
