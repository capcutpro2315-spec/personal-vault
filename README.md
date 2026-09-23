# LifeVault — Your Intelligent Second Brain

**LifeVault** is a modern, premium full-stack web application designed as a secure, intelligent personal life management platform ("Second Brain"). It allows users to organize memories, identity documents, travel experiences, notes, reminders, financial information, and digital assets with AI assistance, OCR document processing, voice interactivity, and secure vault encryption workflows.

---

## Features

- **Intelligent Dashboard**: Today's focus summary (events, checklists, PAN card renewal, reminders), AI suggestions feed with accept/dismiss actions, recent memories carousel, and quick capture actions.
- **Life Timeline**: Chronological life stream with vertical connecting node lines, category filter pills (*All, Memories, Travel, Documents, Notes, Projects*), live search filter, and milestone creation modal.
- **Quick Capture**: WebRTC browser camera feed & snap, drag-and-drop image preview + simulated 4-step AI analysis pipeline, MediaRecorder API voice recorder with live audio timer & waveform animation, note editor, file metadata display, and link bookmarking.
- **Travel Memories & Map**: Summary statistic cards (Total Trips, Places Visited, Memories, Countries), interactive map canvas with location pins (*Hyderabad, Goa, Manali*), trip filters, and detailed trip breakdown modal (photos, notes, places, itemized expense ledger).
- **Secure Vault**: Security status indicator with shield graphic and disclaimer (`AES-256` concept UI indicator), category tiles, document cards, attention required expiry alerts (*Health Insurance in 32 days*, *Passport in 2 years*), document upload modal, document viewer, and biometric verification gate.
- **AI Assistant**: 3D animated particle AI Voice Orb with Violet & Cyan glow, conversational chat interface, suggested questions chips, voice mode with live waveform bars, and cross-page deep link cards.
- **OCR Smart Extraction**: 4-phase step-by-step document analysis pipeline (*Analyzing → Extracting text → Identifying info → Preparing entry*) with an interactive extraction result editor.
- **Voice Assistant**: Web Speech API integration with graceful fallback simulation and voice command parsing.
- **Supabase Backend**: Auth (Email/password, Google OAuth, password reset), PostgreSQL database with Row Level Security (RLS) enforcing `auth.uid() = user_id`, private storage buckets (`documents`, `memories`, `voice-notes`), and JSON data export.

---

## Tech Stack

- **Frontend**: React (v18+), TypeScript, Vite, React Router DOM (v6+)
- **Styling & Design System**: Tailwind CSS, Obsidian background (`#0B0F1A`), Violet (`#6C63FF`), Cyan (`#00D1FF`), Orange (`#FF7A50`), Green (`#34D399`), Google Fonts (`Syne` display headings, `DM Sans` body text), Glassmorphism utilities
- **Animations & Icons**: Framer Motion, Lucide React icons
- **Backend & Storage**: Supabase JS Client, PostgreSQL DDL with RLS, Storage Buckets

---

## Installation & Local Development

1. **Clone or navigate to repository**:
   ```bash
   cd "c:/vishnu/Personal LIfe vault"
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start Vite Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

5. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## Supabase Setup & Database Migrations

Run the SQL migration script located at `supabase/schema.sql` in your Supabase SQL Editor:

1. **Database Tables**:
   - `profiles`
   - `documents`
   - `memories`
   - `timeline_entries`
   - `notes`
   - `trips`
   - `trip_locations`
   - `reminders`
   - `ai_suggestions`
   - `voice_notes`

2. **Row Level Security (RLS)**:
   - All tables enforce strict ownership: `auth.uid() = user_id`.

3. **Storage Buckets**:
   Create 3 private buckets in Supabase Dashboard → Storage:
   - `documents`
   - `memories`
   - `voice-notes`
   Apply policy: `(storage.foldername(name))[1] = auth.uid()::text`.

---

## Environment Variables

| Variable Name | Description | Required |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Supabase Project API URL | Yes (for live backend) |
| `VITE_SUPABASE_ANON_KEY` | Supabase Anonymous Client Key | Yes (for live backend) |
| `VITE_OPENAI_API_KEY` | Optional server-side LLM API key | No |

---

## Project Structure

```
├── public/
├── src/
│   ├── components/       # Reusable UI, Navigation, Vault, Assistant, and OCR components
│   │   ├── assistant/    # AI Orb, ChatWindow, SuggestionChips, VoiceWaveform
│   │   ├── navigation/   # Sidebar, Navbar, MobileBottomNav
│   │   ├── ocr/          # OCRProcessor, ExtractionEditor
│   │   ├── ui/           # Button, Card, Modal, Input, Badge, AiOrb, BiometricModal, GlobalSearchModal, Skeleton, EmptyState
│   │   └── vault/        # SecurityCard, DocumentCard, DocumentViewer, DocumentUploadModal, ExpiringDocs
│   ├── context/          # AuthContext and DataContext
│   ├── data/             # Sample initial data fixtures (mockData.ts)
│   ├── layouts/          # DashboardLayout shell
│   ├── lib/              # Supabase client & utility functions
│   ├── pages/            # LandingPage, LoginPage, SignupPage, DashboardPage, TimelinePage, CapturePage, TravelPage, VaultPage, AiAssistantPage, SettingsPage
│   ├── services/         # Decoupled data & AI services (authService, documentService, memoryService, timelineService, noteService, tripService, reminderService, suggestionService, voiceNoteService, aiService, ocrService, voiceService)
│   ├── types/            # TypeScript interfaces (index.ts)
│   ├── App.tsx           # Router & protected route guards
│   ├── main.tsx          # React DOM entrypoint
│   └── index.css         # Tailwind directives & glassmorphism utilities
├── supabase/
│   └── schema.sql        # PostgreSQL DDL migrations & RLS policies
├── vercel.json           # Vercel SPA routing rewrite rules
├── tailwind.config.js    # Design system color tokens & animations
├── vite.config.ts        # Vite configuration & @ alias
└── package.json
```

---

## Current Limitations & Prototype Notice

The application includes a dual live/mock service layer:
- **AES-256 & Biometric Verification**: Represents the intended security architecture & prototype UI flow. Real WebAuthn passkey registration can be attached in future releases.
- **AI & OCR Services**: When live external API keys are unattached, `aiService.ts` and `ocrService.ts` provide Second Brain context retrieval and simulated 4-step OCR extraction.
- **Geographic Map**: Uses an interactive visual map canvas with clickable location pins for Goa, Manali, and Hyderabad.

---

## Vercel Deployment

The application includes `vercel.json` with single-page application (SPA) rewrite rules to guarantee that refreshing nested routes (e.g. `/assistant` or `/vault`) works seamlessly without 404 errors:

1. Push your code to GitHub / GitLab.
2. Import the project into Vercel.
3. Configure Environment Variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
4. Vercel will automatically build and deploy using `npm run build`.
