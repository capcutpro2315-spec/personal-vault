import React, { useState } from 'react';
import { Upload, Sparkles, Scan, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { VaultCategory } from '../../types';
import { ocrService } from '../../services/ocrService';

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: {
    title: string;
    fileName: string;
    fileSize: string;
    fileType: string;
    category: VaultCategory;
    expiryDate?: string;
    securityStatus: 'AES-256 Encrypted' | 'Protected';
    tags: string[];
    extractedData?: Record<string, string>;
  }) => void;
}

export const DocumentUploadModal: React.FC<DocumentUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const [docName, setDocName] = useState('');
  const [category, setCategory] = useState<VaultCategory>('Identity Documents');
  const [expiryDate, setExpiryDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Simulated OCR state
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [extractedData, setExtractedData] = useState<Record<string, string> | null>(null);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    if (!docName) {
      setDocName(file.name.replace(/\.[^/.]+$/, ''));
    }

    setIsScanning(true);
    setScanStep(1); // Analyzing document...
    await new Promise((r) => setTimeout(r, 600));

    setScanStep(2); // Extracting text...
    await new Promise((r) => setTimeout(r, 600));

    setScanStep(3); // Identifying important information...
    await new Promise((r) => setTimeout(r, 600));

    setScanStep(4); // Preparing your vault entry...
    const result = await ocrService.processFile(file);

    setExtractedData(result.extractedFields);
    if (result.title) setDocName(result.title);
    if (result.category) setCategory(result.category);
    if (result.expiryDate) setExpiryDate(result.expiryDate);
    if (result.suggestedTags) setTagsInput(result.suggestedTags.join(', '));
    setIsScanning(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    onSave({
      title: docName,
      fileName: selectedFile?.name || `${docName.replace(/\s+/g, '_')}.pdf`,
      fileSize: selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : '1.8 MB',
      fileType: selectedFile?.type || 'PDF Document',
      category,
      expiryDate: expiryDate || undefined,
      securityStatus: category === 'Identity Documents' ? 'AES-256 Encrypted' : 'Protected',
      tags: tagsInput ? tagsInput.split(',').map((t) => t.trim()) : ['Vault', category],
      extractedData: extractedData || undefined,
    });

    // Reset
    setDocName('');
    setExpiryDate('');
    setTagsInput('');
    setSelectedFile(null);
    setExtractedData(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Document to Vault" maxWidth="lg">
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {/* File Dropzone */}
        <div className="border-2 border-dashed border-white/20 hover:border-[#00D1FF]/60 rounded-2xl p-6 text-center bg-white/[0.02] cursor-pointer">
          <input
            type="file"
            id="modal-doc-file"
            className="hidden"
            accept="image/*,.pdf"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
          />
          <label htmlFor="modal-doc-file" className="cursor-pointer flex flex-col items-center">
            <Upload size={28} className="text-[#00D1FF] mb-2" />
            <span className="text-xs font-bold text-white">
              {selectedFile ? selectedFile.name : 'Click to select file or drag & drop'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1">Supports PDF, PNG, JPG scans up to 25MB</span>
          </label>
        </div>

        {/* OCR Step-by-Step Processing Overlay */}
        {isScanning && (
          <div className="p-4 rounded-xl bg-[#121829] border border-[#6C63FF]/30 space-y-2 font-mono text-xs">
            <div className="flex items-center gap-2 text-white font-bold mb-1">
              <Sparkles size={14} className="text-[#00D1FF] animate-spin" /> Running OCR Smart Extraction...
            </div>
            <div className={scanStep >= 1 ? 'text-[#34D399]' : 'text-slate-500'}>1. Analyzing document...</div>
            <div className={scanStep >= 2 ? 'text-[#34D399]' : 'text-slate-500'}>2. Extracting text...</div>
            <div className={scanStep >= 3 ? 'text-[#34D399]' : 'text-slate-500'}>3. Identifying important information...</div>
            <div className={scanStep >= 4 ? 'text-[#34D399]' : 'text-slate-500'}>4. Preparing your vault entry...</div>
          </div>
        )}

        <Input
          label="Document Name"
          placeholder="PAN Card — Official Copy"
          value={docName}
          onChange={(e) => setDocName(e.target.value)}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as VaultCategory)}
              className="w-full glass-input rounded-xl text-sm text-slate-100 p-3"
            >
              {[
                'Identity Documents',
                'Financial',
                'Medical',
                'Insurance',
                'Education',
                'Legal',
                'Personal',
              ].map((c) => (
                <option key={c} value={c} className="bg-[#121829] text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Expiry Date (Optional)"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />
        </div>

        <Input
          label="Tags (Comma Separated)"
          placeholder="Identity, Government, PAN"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="gradient">
            Save Document
          </Button>
        </div>
      </form>
    </Modal>
  );
};
