import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  Mic, 
  MicOff,
  FileText, 
  Paperclip, 
  Link as LinkIcon, 
  Sparkles, 
  Scan, 
  CheckCircle2, 
  Tag, 
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  Square,
  Play
} from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ocrService, OcrResult } from '../services/ocrService';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { VaultCategory } from '../types';

export const CapturePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab') || searchParams.get('type') || 'upload';

  const [activeTab, setActiveTab] = useState<'camera' | 'upload' | 'voice' | 'note' | 'file' | 'link'>(
    (tabParam as any) || 'upload'
  );

  const navigate = useNavigate();
  const { addDocument, addMemory, addNote, addVoiceNote } = useData();

  // 1. WebRTC Camera State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string>('');

  // 2. Upload Image & Simulated AI Analysis State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    detected: string;
    category: string;
    location: string;
    tags: string[];
  } | null>(null);

  // 3. Voice Note Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // 4. Note Editor State
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [noteCategory, setNoteCategory] = useState('General');
  const [noteTags, setNoteTags] = useState('');

  // 5. Upload File State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // 6. Link Bookmark State
  const [linkUrl, setLinkUrl] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [linkDesc, setLinkDesc] = useState('');

  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  // Clean up camera stream when leaving tab
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // WebRTC Camera Handlers
  const startCamera = async () => {
    setCameraError('');
    setCapturedPhoto(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err: any) {
      setCameraError('Camera access denied or unavailable. You can use file upload below as a fallback.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const takeSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedPhoto(dataUrl);
      stopCamera();
    }
  };

  // Image Upload Simulated AI Processing
  const handleImageSelect = async (file: File) => {
    setSelectedImage(file);
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulated AI analysis sequence
    await new Promise((r) => setTimeout(r, 1800));

    setAnalysisResult({
      detected: 'Image detected',
      category: 'Memory',
      location: 'Manali',
      tags: ['Travel', 'Mountain', '2026'],
    });

    setIsAnalyzing(false);
  };

  // Voice Note Handlers
  useEffect(() => {
    let timer: any;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const startVoiceRecording = async () => {
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const url = URL.createObjectURL(audioBlob);
          setAudioBlobUrl(url);
          stream.getTracks().forEach((t) => t.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } else {
        // Fallback simulation
        setIsRecording(true);
      }
    } catch (err) {
      // Fallback timer simulation
      setIsRecording(true);
    }
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else if (!audioBlobUrl) {
      setAudioBlobUrl('simulated-voice-payload');
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Submit Actions
  const handleSaveCapturedImage = () => {
    if (capturedPhoto || imagePreviewUrl) {
      addMemory({
        title: analysisResult?.location ? `${analysisResult.location} Capture` : 'Quick Image Capture',
        location: analysisResult?.location || 'Manali',
        date: new Date().toISOString().split('T')[0],
        imageUrl: capturedPhoto || imagePreviewUrl || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800',
        description: 'Captured image added to LifeVault memory stream.',
        category: analysisResult?.category || 'Memory',
        tags: analysisResult?.tags || ['Travel', '2026'],
      });
      navigate('/timeline');
    }
  };

  const handleSaveVoiceNote = () => {
    addVoiceNote({
      title: `Voice Memo (${new Date().toLocaleDateString()})`,
      duration: formatTimer(recordingSeconds || 24),
      transcript: 'Recorded voice memo transcript generated by LifeVault Audio Engine.',
    });
    navigate('/dashboard');
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle || !noteContent) return;

    addNote({
      title: noteTitle,
      content: noteContent,
      category: noteCategory,
      tags: noteTags ? noteTags.split(',').map((t) => t.trim()) : ['Note'],
    });

    navigate('/dashboard');
  };

  const handleSaveFile = () => {
    if (!selectedFile) return;
    addDocument({
      title: selectedFile.name.replace(/\.[^/.]+$/, ''),
      fileName: selectedFile.name,
      fileSize: `${(selectedFile.size / 1024).toFixed(1)} KB`,
      fileType: selectedFile.type || 'Document File',
      category: 'Personal',
      securityStatus: 'Protected',
      tags: ['Uploaded', 'File'],
    });
    navigate('/vault');
  };

  const handleSaveLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUrl) return;
    addNote({
      title: linkTitle || linkUrl,
      content: `Bookmarked Link: ${linkUrl}\n\n${linkDesc}`,
      category: 'Web Bookmark',
      tags: ['Bookmark', 'Link'],
    });
    navigate('/dashboard');
  };

  const captureOptions = [
    { id: 'camera', label: 'Capture Photo', icon: Camera, color: 'text-[#FF7A50]' },
    { id: 'upload', label: 'Upload Image', icon: Upload, color: 'text-[#00D1FF]' },
    { id: 'voice', label: 'Voice Note', icon: Mic, color: 'text-[#6C63FF]' },
    { id: 'note', label: 'Add Note', icon: FileText, color: 'text-[#34D399]' },
    { id: 'file', label: 'Upload File', icon: Paperclip, color: 'text-[#A5B4FC]' },
    { id: 'link', label: 'Add Link', icon: LinkIcon, color: 'text-[#F43F5E]' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
          Quick Capture
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Save anything important in seconds.
        </p>
      </div>

      {/* Capture Options Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {captureOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = activeTab === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => {
                setActiveTab(opt.id as any);
                stopCamera();
              }}
              className={`glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${
                isActive
                  ? 'bg-gradient-to-tr from-[#6C63FF]/30 to-[#00D1FF]/20 border-[#00D1FF]/50 shadow-glow-violet'
                  : 'hover:bg-white/10 border-white/10'
              }`}
            >
              <div className={`p-2.5 rounded-xl bg-white/5 ${opt.color}`}>
                <Icon size={20} />
              </div>
              <span className="text-xs font-bold text-white font-sans">{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Action Stage Panel */}
      <Card glowColor="violet" className="p-8">
        {/* 1. CAMERA TAB */}
        {activeTab === 'camera' && (
          <div className="space-y-6 max-w-xl mx-auto text-center">
            <h3 className="text-xl font-bold font-display text-white">Browser Camera Interface</h3>

            {cameraError && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-400 font-medium">
                {cameraError}
              </div>
            )}

            <div className="relative w-full h-72 sm:h-80 rounded-3xl overflow-hidden glass-panel border border-white/15 flex items-center justify-center bg-black">
              {capturedPhoto ? (
                <img src={capturedPhoto} alt="Captured" className="w-full h-full object-cover" />
              ) : isCameraActive ? (
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 space-y-3">
                  <Camera size={44} className="text-[#FF7A50] mx-auto" />
                  <p className="text-xs text-slate-400">Click below to activate your browser camera stream</p>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              {!isCameraActive && !capturedPhoto && (
                <Button variant="gradient" onClick={startCamera} leftIcon={<Camera size={16} />}>
                  Start Camera
                </Button>
              )}

              {isCameraActive && (
                <Button variant="gradient" onClick={takeSnapshot} leftIcon={<Camera size={16} />}>
                  Snap Photo
                </Button>
              )}

              {capturedPhoto && (
                <>
                  <Button variant="outline" onClick={startCamera} leftIcon={<RefreshCw size={16} />}>
                    Retake Photo
                  </Button>
                  <Button variant="gradient" onClick={handleSaveCapturedImage} rightIcon={<ArrowRight size={16} />}>
                    Save Photo to Memories
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* 2. UPLOAD IMAGE TAB */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {!imagePreviewUrl ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleImageSelect(e.dataTransfer.files[0]);
                }}
                className="border-2 border-dashed border-white/20 hover:border-[#00D1FF]/60 rounded-3xl p-10 text-center transition-colors bg-white/[0.02] cursor-pointer flex flex-col items-center justify-center"
              >
                <input
                  type="file"
                  id="image-input"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                />
                <label htmlFor="image-input" className="cursor-pointer flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#6C63FF]/30 to-[#00D1FF]/30 flex items-center justify-center text-[#00D1FF] mb-4 shadow-glow-cyan">
                    <Upload size={28} />
                  </div>
                  <h3 className="text-lg font-bold font-display text-white">Select or drop an image</h3>
                  <p className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WebP</p>
                  <div className="mt-4">
                    <Button variant="outline" size="sm" type="button">
                      Browse Image
                    </Button>
                  </div>
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="relative h-64 sm:h-80 rounded-3xl overflow-hidden glass-panel border border-white/15">
                  <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>

                {isAnalyzing ? (
                  <div className="p-6 rounded-2xl bg-[#121829] border border-[#6C63FF]/30 space-y-3">
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-[#00D1FF] animate-spin" />
                      <h4 className="text-sm font-bold font-display text-white">Analyzing your capture...</h4>
                    </div>
                    <p className="text-xs text-slate-400 font-mono">Running category recognition and location tagging...</p>
                  </div>
                ) : (
                  analysisResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4"
                    >
                      <div className="flex items-center gap-2 text-xs font-mono text-[#34D399]">
                        <CheckCircle2 size={16} /> {analysisResult.detected}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3 rounded-xl bg-[#0B0F1A] border border-white/5">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Category</span>
                          <p className="text-xs font-bold text-white mt-0.5">{analysisResult.category}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0B0F1A] border border-white/5">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Suggested Location</span>
                          <p className="text-xs font-bold text-[#00D1FF] mt-0.5">{analysisResult.location}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-[#0B0F1A] border border-white/5">
                          <span className="text-[10px] font-mono text-slate-400 uppercase">Suggested Tags</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {analysisResult.tags.map((tg) => (
                              <span key={tg} className="text-[10px] text-slate-300 font-mono px-1.5 py-0.5 bg-white/10 rounded">
                                #{tg}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-2">
                        <Button variant="outline" onClick={() => setImagePreviewUrl(null)}>
                          Discard
                        </Button>
                        <Button variant="gradient" onClick={handleSaveCapturedImage}>
                          Save Memory
                        </Button>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            )}
          </div>
        )}

        {/* 3. VOICE NOTE TAB */}
        {activeTab === 'voice' && (
          <div className="space-y-6 max-w-md mx-auto text-center py-6">
            <h3 className="text-xl font-bold font-display text-white">Voice Note Recorder</h3>

            <div className="p-8 rounded-3xl bg-[#121829] border border-[#6C63FF]/30 space-y-6 relative overflow-hidden shadow-glow-violet">
              {/* Dynamic Waveform Bars */}
              <div className="flex items-center justify-center gap-1.5 h-16">
                {[0.4, 0.9, 0.6, 1, 0.7, 1.2, 0.5, 0.8, 1.1, 0.4].map((scale, i) => (
                  <motion.div
                    key={i}
                    animate={
                      isRecording
                        ? { height: ['20%', '90%', '30%'] }
                        : { height: '25%' }
                    }
                    transition={{
                      duration: 0.4 + i * 0.08,
                      repeat: isRecording ? Infinity : 0,
                      repeatType: 'reverse',
                    }}
                    className={`w-2 rounded-full ${isRecording ? 'bg-[#00D1FF] shadow-glow-cyan' : 'bg-slate-700'}`}
                  />
                ))}
              </div>

              {/* Timer */}
              <div className="text-3xl font-mono font-bold text-white tracking-widest">
                {formatTimer(recordingSeconds)}
              </div>

              {/* Record / Stop Button */}
              <div className="flex items-center justify-center gap-4">
                {!isRecording ? (
                  <Button
                    variant="gradient"
                    size="lg"
                    onClick={startVoiceRecording}
                    leftIcon={<Mic size={18} />}
                  >
                    Start Recording
                  </Button>
                ) : (
                  <Button
                    variant="danger"
                    size="lg"
                    onClick={stopVoiceRecording}
                    leftIcon={<Square size={18} />}
                  >
                    Stop Recording
                  </Button>
                )}
              </div>
            </div>

            {audioBlobUrl && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <p className="text-xs font-mono text-[#34D399]">Voice note recorded successfully!</p>
                <Button variant="gradient" className="w-full" onClick={handleSaveVoiceNote}>
                  Save Voice Note
                </Button>
              </motion.div>
            )}
          </div>
        )}

        {/* 4. ADD NOTE TAB */}
        {activeTab === 'note' && (
          <form onSubmit={handleSaveNote} className="space-y-4 max-w-xl mx-auto">
            <h3 className="text-xl font-bold font-display text-white">Add Note</h3>

            <Input
              label="Title"
              placeholder="Goa Trip Preparation Checklist"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={noteCategory}
                onChange={(e) => setNoteCategory(e.target.value)}
                className="w-full glass-input rounded-xl text-sm text-slate-100 p-3"
              >
                {['General', 'Travel', 'Project', 'Personal', 'Docs'].map((c) => (
                  <option key={c} value={c} className="bg-[#121829] text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Content
              </label>
              <textarea
                rows={5}
                placeholder="Type your notes here..."
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                className="w-full glass-input rounded-xl text-sm text-slate-100 p-3"
                required
              />
            </div>

            <Input
              label="Tags (Comma Separated)"
              placeholder="Goa, Travel, Checklist"
              value={noteTags}
              onChange={(e) => setNoteTags(e.target.value)}
            />

            <div className="flex justify-end gap-3 pt-3">
              <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                Cancel
              </Button>
              <Button type="submit" variant="gradient">
                Save Note
              </Button>
            </div>
          </form>
        )}

        {/* 5. UPLOAD FILE TAB */}
        {activeTab === 'file' && (
          <div className="space-y-6 max-w-lg mx-auto">
            <h3 className="text-xl font-bold font-display text-white text-center">Upload File</h3>

            <div className="border-2 border-dashed border-white/20 rounded-3xl p-8 text-center bg-white/[0.02]">
              <input
                type="file"
                id="generic-file"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && setSelectedFile(e.target.files[0])}
              />
              <label htmlFor="generic-file" className="cursor-pointer flex flex-col items-center">
                <Paperclip size={36} className="text-[#A5B4FC] mb-3" />
                <span className="text-sm font-bold text-white">Click to select document or file</span>
              </label>
            </div>

            {selectedFile && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">File Name:</span>
                  <span className="text-white font-bold">{selectedFile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">File Type:</span>
                  <span className="text-[#00D1FF]">{selectedFile.type || 'Binary Document'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">File Size:</span>
                  <span className="text-[#34D399]">{(selectedFile.size / 1024).toFixed(1)} KB</span>
                </div>

                <Button variant="gradient" className="w-full mt-4" onClick={handleSaveFile}>
                  Save File to Vault
                </Button>
              </div>
            )}
          </div>
        )}

        {/* 6. ADD LINK TAB */}
        {activeTab === 'link' && (
          <form onSubmit={handleSaveLink} className="space-y-4 max-w-xl mx-auto">
            <h3 className="text-xl font-bold font-display text-white">Add Link Bookmark</h3>

            <Input
              label="URL"
              type="url"
              placeholder="https://lifevault.ai/docs"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              required
            />

            <Input
              label="Title"
              placeholder="LifeVault Documentation"
              value={linkTitle}
              onChange={(e) => setLinkTitle(e.target.value)}
            />

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of why you saved this bookmark..."
                value={linkDesc}
                onChange={(e) => setLinkDesc(e.target.value)}
                className="w-full glass-input rounded-xl text-sm text-slate-100 p-3"
              />
            </div>

            <Button type="submit" variant="gradient" className="w-full">
              Save Link
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
};
