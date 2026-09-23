import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { VaultCategory } from '../../types';
import { OcrResult } from '../../services/ocrService';

interface ExtractionEditorProps {
  ocrResult: OcrResult;
  onSave: (editedData: {
    title: string;
    category: VaultCategory;
    name: string;
    docNumber: string;
    expiryDate?: string;
    tags: string[];
  }) => void;
  onDiscard: () => void;
}

export const ExtractionEditor: React.FC<ExtractionEditorProps> = ({
  ocrResult,
  onSave,
  onDiscard,
}) => {
  const [title, setTitle] = useState(ocrResult.title);
  const [category, setCategory] = useState<VaultCategory>(ocrResult.category);
  const [name, setName] = useState(ocrResult.extractedFields['Full Name'] || ocrResult.extractedFields['Name'] || 'Vishnu Sharma');
  const [docNumber, setDocNumber] = useState(ocrResult.extractedFields['PAN Number'] || ocrResult.extractedFields['Passport No'] || 'ABCDE1234F');
  const [expiryDate, setExpiryDate] = useState(ocrResult.expiryDate || '');
  const [tagsInput, setTagsInput] = useState(ocrResult.suggestedTags.join(', '));

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      category,
      name,
      docNumber,
      expiryDate: expiryDate || undefined,
      tags: tagsInput ? tagsInput.split(',').map((t) => t.trim()) : ocrResult.suggestedTags,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-3xl glass-panel border border-[#6C63FF]/30 space-y-6 shadow-2xl"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-[#00D1FF]" size={20} />
          <h3 className="text-lg font-bold font-display text-white">Review Extracted Information</h3>
        </div>
        <Badge variant="green" size="sm" icon={<ShieldCheck size={12} />}>
          Simulated OCR Verified
        </Badge>
      </div>

      {/* OCR Key Value Summary Table */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
        {Object.entries(ocrResult.extractedFields).map(([key, val]) => (
          <div key={key} className="p-2.5 rounded-xl bg-[#0B0F1A]/70 border border-white/5">
            <span className="text-[10px] font-mono text-slate-400 block uppercase">{key}</span>
            <span className="text-xs font-semibold text-white mt-0.5 block">{val}</span>
          </div>
        ))}
      </div>

      {/* Editable Fields Form */}
      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Document Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 font-sans">
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
              ].map((cat) => (
                <option key={cat} value={cat} className="bg-[#121829] text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Extracted Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Input
            label="Document Number"
            value={docNumber}
            onChange={(e) => setDocNumber(e.target.value)}
          />

          <Input
            label="Expiry Date"
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
          />

          <Input
            label="Tags (Comma Separated)"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
          <Button type="button" variant="outline" onClick={onDiscard}>
            Discard
          </Button>
          <Button type="submit" variant="gradient">
            Save to Vault
          </Button>
        </div>
      </form>
    </motion.div>
  );
};
