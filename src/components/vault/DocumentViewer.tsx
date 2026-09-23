import React from 'react';
import { 
  FileText, 
  Calendar, 
  Tag, 
  Download, 
  ExternalLink, 
  Edit3, 
  Trash2, 
  CheckCircle2,
  FileCheck,
  Lock
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { DocumentItem } from '../../types';

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  document: DocumentItem | null;
  onDelete?: (id: string) => void;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  isOpen,
  onClose,
  document: doc,
  onDelete,
}) => {
  if (!doc) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={doc.title} maxWidth="xl">
      <div className="space-y-6">
        {/* Identity Verified Badge */}
        <div className="p-3.5 rounded-2xl bg-[#34D399]/10 border border-[#34D399]/30 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-[#34D399] shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white">Identity Verified</h4>
            <p className="text-[11px] text-slate-300">Decrypted payload via biometric verification session key.</p>
          </div>
        </div>

        {/* File Preview Placeholder */}
        <div className="relative h-48 rounded-2xl bg-[#121829] border border-white/10 flex flex-col items-center justify-center p-6 text-center shadow-inner">
          <div className="p-4 rounded-2xl bg-gradient-to-tr from-[#6C63FF]/30 to-[#00D1FF]/30 text-[#00D1FF] mb-3 shadow-glow-violet">
            <FileText size={36} />
          </div>
          <p className="text-sm font-bold text-white font-mono">{doc.fileName}</p>
          <p className="text-xs text-slate-400 mt-0.5">{doc.fileType} • {doc.fileSize}</p>
          <span className="text-[10px] font-mono text-slate-500 mt-2">
            [ Encrypted Document Payload Preview Available ]
          </span>
        </div>

        {/* Extracted Metadata Fields */}
        {doc.extractedData && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 font-sans">
              Verified Extracted Information
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-white/5 border border-white/10">
              {Object.entries(doc.extractedData).map(([key, val]) => (
                <div key={key} className="p-2.5 rounded-xl bg-[#0B0F1A]/70 border border-white/5">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">{key}</span>
                  <span className="text-xs font-semibold text-white mt-0.5 block">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Metadata Details */}
        <div className="space-y-2 text-xs font-mono text-slate-300 p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Category:</span>
            <span className="text-[#00D1FF] font-bold">{doc.category}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-white/5">
            <span className="text-slate-400">Uploaded Date:</span>
            <span className="text-slate-200">{doc.uploadDate}</span>
          </div>
          {doc.expiryDate && (
            <div className="flex justify-between py-1 border-b border-white/5">
              <span className="text-slate-400">Expiry Date:</span>
              <span className="text-yellow-400 font-bold">{doc.expiryDate}</span>
            </div>
          )}
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Security Standard:</span>
            <span className="text-[#34D399] font-bold">{doc.securityStatus}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
          {onDelete && (
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                onDelete(doc.id);
                onClose();
              }}
              leftIcon={<Trash2 size={14} />}
            >
              Delete
            </Button>
          )}

          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" onClick={() => alert('Editing metadata mode...')}>
              <Edit3 size={14} className="mr-1" /> Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert(`Opening ${doc.fileName}...`)}
              leftIcon={<ExternalLink size={14} />}
            >
              Open
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => alert(`Downloading payload for ${doc.fileName}...`)}
              leftIcon={<Download size={14} />}
            >
              Download
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
