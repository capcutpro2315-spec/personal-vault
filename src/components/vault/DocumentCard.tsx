import React from 'react';
import { FileText, Lock, Calendar, KeyRound, Eye } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DocumentItem } from '../../types';

interface DocumentCardProps {
  document: DocumentItem;
  onClick: () => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ document: doc, onClick }) => {
  return (
    <Card
      glowColor="violet"
      onClick={onClick}
      className="cursor-pointer group flex flex-col justify-between p-6"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-[#6C63FF]/20 to-[#00D1FF]/20 border border-[#6C63FF]/30 text-[#00D1FF]">
            <FileText size={22} />
          </div>
          <Badge
            variant={doc.securityStatus === 'AES-256 Encrypted' ? 'green' : 'violet'}
            size="sm"
            icon={<Lock size={10} />}
          >
            {doc.securityStatus}
          </Badge>
        </div>

        <h3 className="text-base font-bold font-display text-white group-hover:text-[#00D1FF] transition-colors">
          {doc.title}
        </h3>
        <div className="flex items-center gap-2 mt-1 font-mono text-xs text-slate-400">
          <span>{doc.fileType}</span>
          <span>•</span>
          <span>{doc.fileSize}</span>
        </div>

        <div className="mt-4 pt-3 border-t border-white/5 space-y-1 text-[11px] font-mono text-slate-400">
          <div className="flex justify-between">
            <span>Category:</span>
            <span className="text-white font-semibold">{doc.category}</span>
          </div>
          <div className="flex justify-between">
            <span>Uploaded:</span>
            <span className="text-slate-300">{doc.uploadDate}</span>
          </div>
          {doc.expiryDate && (
            <div className="flex justify-between">
              <span>Expires:</span>
              <span className="text-yellow-400 font-semibold">{doc.expiryDate}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs font-semibold text-[#00D1FF]">
        <span className="flex items-center gap-1.5">
          <KeyRound size={14} /> Biometric Verification
        </span>
        <Eye size={14} className="group-hover:scale-110 transition-transform" />
      </div>
    </Card>
  );
};
