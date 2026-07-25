'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AppProvider, useApp } from '@/contexts/app-context';
import { getFullName, getInitials } from '@/lib/utils';
import {
  LayoutDashboard, Shield, TrendingUp, Calendar, FolderOpen,
  User, Sparkles, LogOut, Bot,
} from 'lucide-react';

const navItems = [
  { href: '/client/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { href: '/client/policies', label: 'My Policies', icon: <Shield size={20} /> },
  { href: '/client/investments', label: 'My Investments', icon: <TrendingUp size={20} /> },
  { href: '/client/profile', label: 'My Profile', icon: <User size={20} /> },
];

function ClientPortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { clients } = useApp();
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const activeId = localStorage.getItem('ak_logged_in_client_id');
    const role = localStorage.getItem('ak_logged_in_role');
    
    if (!activeId || role !== 'client') {
      // No active client session, redirect to login
      router.push('/login');
    } else {
      setClientId(activeId);
      setLoading(false);
    }
  }, [router]);

  const activeClient = clients.find((c) => c.id === clientId);
  
  const clientName = activeClient ? getFullName(activeClient.firstName, activeClient.lastName) : 'Client';
  const initials = activeClient ? getInitials(activeClient.firstName, activeClient.lastName) : 'C';

  const handleSignOut = () => {
    localStorage.removeItem('ak_logged_in_role');
    localStorage.removeItem('ak_logged_in_client_id');
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--navy-950)] text-white">
        <div className="text-center space-y-2 animate-pulse">
          <Sparkles size={32} className="text-blue-500 mx-auto" />
          <p className="text-sm text-slate-400">Loading portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-[240px] flex flex-col border-r border-slate-800 bg-[var(--navy-950)] z-40">
        <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-800 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center shrink-0">
            <Sparkles size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">Client Portal</h1>
            <p className="text-[10px] text-slate-500">AK Saarthi AI</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2">
          <nav className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <span className="sidebar-icon shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="border-t border-slate-800 py-3 px-2">
          <button onClick={handleSignOut} className="sidebar-link w-full text-left text-red-400 hover:text-red-300">
            <LogOut size={20} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden ml-[240px]">
        <header className="h-16 border-b border-slate-800 flex items-center justify-between px-6 bg-[var(--navy-950)]/80 backdrop-blur-sm">
          <h2 className="font-semibold text-sm text-slate-400">Welcome, {clientName}</h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400">
              {initials}
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6 gradient-surface">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ClientPortalShell>{children}</ClientPortalShell>
    </AppProvider>
  );
}

