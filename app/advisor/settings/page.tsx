'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/contexts/app-context';
import { User, Bell, Database, Save, Download, CheckCircle2, XCircle, Clock, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { tasks, updateTask, deleteTask } = useApp();
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

  // Filter access request tasks
  const pendingRequests = tasks.filter(
    (t) => t.title.startsWith('Advisor Access Request') && t.status !== 'done'
  );

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
    const link = document.createElement('a');
    link.href = '/api/backup';
    link.download = `aksaarthi-backup-${new Date().toISOString().split('T')[0]}.db`;
    link.click();
  };

  const handleApproveRequest = async (taskId: string, reqDescription?: string) => {
    // Extract email from description e.g. "Email: user@email.com | Phone: 9876543210..."
    const emailMatch = reqDescription?.match(/Email:\s*([^\s|]+)/i);
    const email = emailMatch ? emailMatch[1] : '';

    const targetEmail = prompt('Confirm Email for new Advisor account:', email || '');
    if (!targetEmail) return;

    const tempPassword = prompt('Set temporary password for new Advisor account:', 'password123');
    if (!tempPassword) return;

    try {
      const res = await fetch('/api/advisor/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail, password: tempPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(`Failed to approve: ${data.error || 'Error creating account'}`);
        return;
      }

      // Mark task as done
      const taskObj = tasks.find((t) => t.id === taskId);
      if (taskObj) {
        updateTask({ ...taskObj, status: 'done' });
      }

      alert(`✅ Advisor account successfully created for ${targetEmail}! Temporary password: ${tempPassword}`);
    } catch (err) {
      alert('Failed to process approval.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings & Administration</h1>
        <p className="text-sm text-slate-400 mt-1">Manage profile, preferences, backups, and advisor access control</p>
      </div>

      {/* Profile */}
      <div className="card p-6 animate-fade-in">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <User size={18} className="text-yellow-400" /> Administrator Profile
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

      {/* Advisor Access Control & Pending Requests */}
      <div className="card p-6 animate-fade-in border-yellow-500/20">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-2">
          <ShieldCheck size={20} className="text-yellow-400" /> Advisor Access Control & Requests
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          You are the system administrator. Public sign-ups create Client accounts only. All Advisor access requests require your approval here.
        </p>

        {/* Pending Requests List */}
        <div className="mb-6 space-y-3">
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Clock size={14} className="text-amber-400" />
            Pending Advisor Access Requests ({pendingRequests.length})
          </h3>

          {pendingRequests.length === 0 ? (
            <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
              No pending advisor access requests at this time.
            </div>
          ) : (
            <div className="space-y-2">
              {pendingRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white">{req.title}</p>
                    <p className="text-xs text-slate-400 mt-1">{req.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApproveRequest(req.id, req.description)}
                      className="btn btn-primary text-xs py-1.5 px-3"
                    >
                      <CheckCircle2 size={14} /> Approve & Grant
                    </button>
                    <button
                      onClick={() => deleteTask(req.id)}
                      className="btn btn-danger text-xs py-1.5 px-3"
                    >
                      <XCircle size={14} /> Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Manual Creation Form */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const formEl = e.currentTarget;
            const emailInput = formEl.elements.namedItem('advisorEmail') as HTMLInputElement;
            const passInput = formEl.elements.namedItem('advisorPassword') as HTMLInputElement;
            const msgEl = formEl.querySelector('#advisorMsg') as HTMLDivElement;

            try {
              const res = await fetch('/api/advisor/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailInput.value, password: passInput.value }),
              });
              const data = await res.json();
              if (!res.ok) {
                msgEl.innerText = `❌ ${data.error || 'Failed to create'}`;
                msgEl.className = 'text-xs text-red-400 mt-2';
              } else {
                msgEl.innerText = `✅ Advisor account created for ${emailInput.value}!`;
                msgEl.className = 'text-xs text-emerald-400 mt-2';
                emailInput.value = '';
                passInput.value = '';
              }
            } catch (err) {
              msgEl.innerText = '❌ Request failed';
              msgEl.className = 'text-xs text-red-400 mt-2';
            }
          }}
          className="space-y-3 max-w-md bg-slate-900/60 p-4 rounded-xl border border-slate-800"
        >
          <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Manually Create Advisor Account</h3>
          <div>
            <label className="label">Advisor Email</label>
            <input className="input" name="advisorEmail" type="email" placeholder="new.advisor@firm.com" required />
          </div>
          <div>
            <label className="label">Temporary Password</label>
            <input className="input" name="advisorPassword" type="password" placeholder="••••••••" required minLength={6} />
          </div>
          <button type="submit" className="btn btn-primary w-full py-2 text-xs">
            Create Advisor Account
          </button>
          <div id="advisorMsg"></div>
        </form>
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
        </p>
      </div>
    </div>
  );
}
