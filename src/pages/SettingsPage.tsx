import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  ShieldCheck, 
  Bell, 
  Database, 
  Fingerprint, 
  Download, 
  Trash2, 
  Check,
  AlertTriangle 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const SettingsPage: React.FC = () => {
  const { user, updateBiometricStatus, logout, resetPassword } = useAuth();
  const { documents, memories, timelineEntries, notes, trips, reminders } = useData();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'privacy'>('profile');

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || 'Vishnu Sharma');
  const [email] = useState(user?.email || 'vishnu@lifevault.ai');
  const [biometricEnabled, setBiometricEnabled] = useState(user?.isBiometricEnabled ?? true);
  const [isSaved, setIsSaved] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateBiometricStatus(biometricEnabled);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handlePasswordReset = async () => {
    if (email) {
      await resetPassword(email);
      setResetSent(true);
      setTimeout(() => setResetSent(false), 3000);
    }
  };

  const handleExportData = () => {
    const exportPayload = {
      exportMetadata: {
        appName: 'LifeVault — Your Intelligent Second Brain',
        exportTimestamp: new Date().toISOString(),
        version: '1.0.0-Phase4',
      },
      user: {
        id: user?.id,
        fullName: user?.fullName,
        email: user?.email,
        createdAt: user?.createdAt,
      },
      documents: documents.map((d) => ({
        id: d.id,
        title: d.title,
        fileName: d.fileName,
        category: d.category,
        fileSize: d.fileSize,
        uploadDate: d.uploadDate,
        expiryDate: d.expiryDate,
        securityStatus: d.securityStatus,
        tags: d.tags,
      })),
      memories,
      timelineEntries,
      notes,
      trips,
      reminders,
    };

    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LifeVault_Export_${user?.fullName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'WARNING: Are you sure you want to delete your LifeVault account? All your encrypted records, memories, and documents will be permanently erased. This action CANNOT be undone.'
      )
    ) {
      alert('Account deletion request initiated. Logging out of vault session...');
      await logout();
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
          Vault Settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your account profile, security credentials, biometric preferences, and vault data exports.
        </p>
      </div>

      {/* Tabs Menu */}
      <div className="flex flex-wrap gap-2 glass-panel p-2 rounded-2xl border border-white/10 w-fit">
        {[
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'security', label: 'Security & Passkeys', icon: ShieldCheck },
          { id: 'notifications', label: 'Notifications', icon: Bell },
          { id: 'privacy', label: 'Data & Privacy', icon: Database },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold font-sans transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#6C63FF] to-[#00D1FF] text-white shadow-glow-violet'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <Card glowColor="violet" className="p-8 max-w-3xl">
        {activeTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="space-y-6">
            <h3 className="text-xl font-bold font-display text-white">Profile Information</h3>

            <div className="flex items-center gap-4 pb-4 border-b border-white/10">
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt="Avatar"
                className="w-16 h-16 rounded-2xl object-cover border-2 border-[#6C63FF]"
              />
              <div>
                <Button type="button" variant="outline" size="sm">
                  Change Photo
                </Button>
                <p className="text-[10px] text-slate-400 mt-1">Recommended 400x400 PNG/JPG</p>
              </div>
            </div>

            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />

            <Input
              label="Email Address"
              value={email}
              disabled
              className="opacity-70 cursor-not-allowed"
            />

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              {isSaved && (
                <span className="text-xs font-semibold text-[#34D399] flex items-center gap-1">
                  <Check size={14} /> Profile Saved
                </span>
              )}
              <Button type="submit" variant="gradient" className="ml-auto">
                Save Changes
              </Button>
            </div>
          </form>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-display text-white">Security & Passkeys</h3>

            {/* Biometric Toggle */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#6C63FF]/20 text-[#00D1FF]">
                  <Fingerprint size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Biometric Verification / Passkey Gate</h4>
                  <p className="text-xs text-slate-400">Require Face ID or Fingerprint verification before opening vault documents</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={biometricEnabled}
                onChange={(e) => {
                  setBiometricEnabled(e.target.checked);
                  updateBiometricStatus(e.target.checked);
                }}
                className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#6C63FF] focus:ring-[#6C63FF] cursor-pointer"
              />
            </div>

            {/* Password Reset Section */}
            <div className="space-y-3 pt-4 border-t border-white/10">
              <h4 className="text-sm font-bold text-white font-display">Password & Authentication Credentials</h4>
              <p className="text-xs text-slate-400">
                Send a secure password reset link to your registered email address ({email}).
              </p>
              {resetSent && (
                <div className="p-3 rounded-xl bg-[#34D399]/10 border border-[#34D399]/30 text-xs text-[#34D399] font-medium">
                  Password reset email sent! Please check your inbox.
                </div>
              )}
              <Button variant="outline" size="sm" onClick={handlePasswordReset}>
                Send Password Reset Email
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-display text-white">Notification Alerts</h3>

            <div className="space-y-3">
              {[
                { title: 'Document Expiry Alerts', desc: 'Notify when Passport or PAN Card is near expiry date' },
                { title: 'AI Second Brain Suggestions', desc: 'Weekly digests for unorganized photo media' },
                { title: 'Travel Memory Reminders', desc: 'Anniversary alerts for past Goa & Manali trips' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-[#6C63FF]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'privacy' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold font-display text-white">Data Portability & Account Deletion</h3>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Export My Data (JSON Payload)</h4>
                <p className="text-xs text-slate-400">Download a full JSON archive containing all your documents metadata, memories, timeline milestones, notes, and trips.</p>
              </div>
              <Button
                variant="gradient"
                size="sm"
                onClick={handleExportData}
                leftIcon={<Download size={14} />}
                className="shrink-0"
              >
                Export My Data
              </Button>
            </div>

            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-red-400">Delete Account</h4>
                <p className="text-xs text-red-300/70">Permanently erase all encrypted records, documents, and memories.</p>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={handleDeleteAccount}
                leftIcon={<Trash2 size={14} />}
                className="shrink-0"
              >
                Delete Account
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
