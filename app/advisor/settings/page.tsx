'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/app-context';
import { Settings as SettingsIcon, User, Bell, Palette, Database, Save, Trash2, RefreshCw, Download } from 'lucide-react';

export default function SettingsPage() {
  const { refresh } = useApp();
  const [profile, setProfile] = useState({
    name: 'Advisor Kumar',
    email: 'advisor@aksaarthi.com',
    phone: '9876543210',
    company: 'AK Investments & Financial Services',
    arnNumber: 'ARN-123456',
    licenseNumber: 'LIC-AGT-789012',
  });
  const [notifications, setNotifications] = useState({
    premiumReminders: true,
    renewalAlerts: true,
    birthdayWishes: true,
    sipReminders: true,
    taskDeadlines: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedProfile = localStorage.getItem('ak_advisor_profile');
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {}
    }
    const savedNotifications = localStorage.getItem('ak_advisor_notifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (e) {}
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('ak_advisor_profile', JSON.stringify(profile));
    localStorage.setItem('ak_advisor_notifications', JSON.stringify(notifications));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDownloadBackup = () => {
    // Triggers the server-side backup endpoint which creates and downloads a full SQLite DB copy
    const link = document.createElement('a');
    link.href = '/api/backup';
    link.download = `aksaarthi-backup-${new Date().toISOString().split('T')[0]}.db`;
    link.click();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile */}
      <div className="card p-6 animate-fade-in">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <User size={18} className="text-yellow-400" /> Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Full Name</label>
            <input className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div>
            <label className="label">Company</label>
            <input className="input" value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
          </div>
          <div>
            <label className="label">ARN Number</label>
            <input className="input" value={profile.arnNumber} onChange={(e) => setProfile({ ...profile, arnNumber: e.target.value })} />
          </div>
          <div>
            <label className="label">License Number</label>
            <input className="input" value={profile.licenseNumber} onChange={(e) => setProfile({ ...profile, licenseNumber: e.target.value })} />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={handleSave} className="btn btn-primary">
            <Save size={16} /> {saved ? 'Saved ✓' : 'Save Profile'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6 animate-fade-in">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Bell size={18} className="text-yellow-400" /> Notifications
        </h2>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, val]) => {
            const labels: Record<string, string> = {
              premiumReminders: 'Premium Due Reminders',
              renewalAlerts: 'Renewal Alerts',
              birthdayWishes: 'Client Birthday Wishes',
              sipReminders: 'SIP Date Reminders',
              taskDeadlines: 'Task Deadline Alerts',
            };
            return (
              <div key={key} className="flex items-center justify-between py-2">
                <span className="text-sm">{labels[key]}</span>
                <button
                  onClick={() => setNotifications((prev) => ({ ...prev, [key]: !val }))}
                  className={`w-11 h-6 rounded-full transition-colors relative ${val ? 'bg-yellow-500' : 'bg-slate-700'}`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${val ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Data Management */}
      <div className="card p-6 animate-fade-in">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Database size={18} className="text-yellow-400" /> Data Management & Backups
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Your data is stored in a secure SQLite database on the server. Download a full backup anytime to keep a safe copy.
          Deleted clients and documents are moved to Trash first — they can be restored unless permanently deleted.
        </p>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleDownloadBackup} className="btn btn-primary">
            <Download size={16} /> Download Database Backup
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-3">
          Backup includes all clients, policies, investments, commissions, appointments, tasks, and document metadata.
          Uploaded files are stored separately in the uploads/ directory on the server.
        </p>
      </div>
    </div>
  );
}
