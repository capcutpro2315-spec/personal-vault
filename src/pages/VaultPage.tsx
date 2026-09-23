import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Upload, 
  Search, 
  FileText, 
  Calendar, 
  Eye, 
  FolderOpen,
  UserCheck,
  CreditCard,
  HeartPulse,
  Award,
  BookOpen,
  Briefcase,
  User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { SecurityCard } from '../components/vault/SecurityCard';
import { DocumentCard } from '../components/vault/DocumentCard';
import { ExpiringDocs } from '../components/vault/ExpiringDocs';
import { DocumentViewer } from '../components/vault/DocumentViewer';
import { DocumentUploadModal } from '../components/vault/DocumentUploadModal';
import { BiometricModal } from '../components/ui/BiometricModal';
import { EmptyState } from '../components/ui/EmptyState';
import { DocumentItem, VaultCategory } from '../types';

export const VaultPage: React.FC = () => {
  const { documents, addDocument, deleteDocument } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [isBiometricOpen, setIsBiometricOpen] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const navigate = useNavigate();

  const categoryConfigs: { name: string; categoryKey: string; icon: any; color: string }[] = [
    { name: 'Identity', categoryKey: 'Identity Documents', icon: UserCheck, color: 'text-[#6C63FF]' },
    { name: 'Financial', categoryKey: 'Financial', icon: CreditCard, color: 'text-[#00D1FF]' },
    { name: 'Medical', categoryKey: 'Medical', icon: HeartPulse, color: 'text-[#FF7A50]' },
    { name: 'Insurance', categoryKey: 'Insurance', icon: Award, color: 'text-[#34D399]' },
    { name: 'Education', categoryKey: 'Education', icon: BookOpen, color: 'text-[#A5B4FC]' },
    { name: 'Legal', categoryKey: 'Legal', icon: Briefcase, color: 'text-yellow-400' },
    { name: 'Personal', categoryKey: 'Personal', icon: User, color: 'text-purple-400' },
  ];

  const filterTabs = ['All', 'Identity', 'Financial', 'Education', 'Insurance', 'Legal', 'Personal'];

  const filteredDocs = documents.filter((doc) => {
    const matchesTab =
      activeCategory === 'All' ||
      doc.category.toLowerCase().includes(activeCategory.toLowerCase());

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      doc.title.toLowerCase().includes(q) ||
      doc.fileName.toLowerCase().includes(q) ||
      doc.category.toLowerCase().includes(q) ||
      doc.tags.some((t) => t.toLowerCase().includes(q));

    return matchesTab && matchesSearch;
  });

  const handleCardClick = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setIsBiometricOpen(true);
  };

  const handleBiometricVerified = () => {
    setIsBiometricOpen(false);
    setIsViewerOpen(true);
  };

  const handleSaveUploadedDocument = async (docData: any) => {
    await addDocument(docData);
    setIsUploadOpen(false);
  };

  const handleDeleteDocument = async (id: string) => {
    if (window.confirm('Delete this document? This will remove the metadata and storage payload.')) {
      await deleteDocument(id);
      setIsViewerOpen(false);
      setSelectedDoc(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
            Secure Vault
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Keep your important documents protected and organized.
          </p>
        </div>

        <Button
          variant="gradient"
          size="md"
          onClick={() => setIsUploadOpen(true)}
          leftIcon={<Upload size={16} />}
        >
          Upload Document
        </Button>
      </div>

      {/* Top Security Status Card */}
      <SecurityCard />

      {/* Attention Required Expiries Section */}
      <ExpiringDocs
        onViewDoc={(docName) => {
          const found = documents.find((d) => d.title.toLowerCase().includes(docName.toLowerCase()));
          if (found) handleCardClick(found);
          else handleCardClick(documents[0]);
        }}
      />

      {/* Document Categories Overview Grid */}
      <div>
        <h3 className="text-lg font-bold font-display text-white mb-4">Document Categories</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {categoryConfigs.map((cat) => {
            const Icon = cat.icon;
            const count = documents.filter((d) =>
              d.category.toLowerCase().includes(cat.categoryKey.toLowerCase())
            ).length;

            return (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`glass-panel p-4 rounded-2xl flex flex-col items-center justify-center gap-2 text-center transition-all ${
                  activeCategory === cat.name
                    ? 'bg-gradient-to-tr from-[#6C63FF]/30 to-[#00D1FF]/20 border-[#00D1FF]/50 shadow-glow-violet'
                    : 'hover:bg-white/10 border-white/10'
                }`}
              >
                <div className={`p-2.5 rounded-xl bg-white/5 ${cat.color}`}>
                  <Icon size={20} />
                </div>
                <span className="text-xs font-bold text-white font-sans">{cat.name}</span>
                <span className="text-[10px] font-mono text-slate-400">{count} documents</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveCategory(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold font-sans transition-all ${
                activeCategory === tab
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#34D399] text-white shadow-glow-violet'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="w-full md:w-72">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
      </div>

      {/* Documents Cards Grid */}
      {filteredDocs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents yet."
          description="Upload your first important document and LifeVault will organize and protect it."
          actionText="Upload Document"
          onAction={() => setIsUploadOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.map((doc) => (
            <DocumentCard key={doc.id} document={doc} onClick={() => handleCardClick(doc)} />
          ))}
        </div>
      )}

      {/* Biometric Verification Modal */}
      <BiometricModal
        isOpen={isBiometricOpen}
        documentTitle={selectedDoc?.title}
        onCancel={() => setIsBiometricOpen(false)}
        onSuccess={handleBiometricVerified}
      />

      {/* Document Viewer Modal */}
      <DocumentViewer
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        document={selectedDoc}
        onDelete={handleDeleteDocument}
      />

      {/* Upload Document Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        onSave={handleSaveUploadedDocument}
      />
    </div>
  );
};
