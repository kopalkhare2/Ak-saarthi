'use client';

import Sidebar from '@/components/ui/sidebar';
import Topbar from '@/components/ui/topbar';
import { AppProvider } from '@/contexts/app-context';

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden ml-[240px] transition-all duration-300">
          <Topbar />
          <main className="flex-1 overflow-y-auto p-6 gradient-surface">
            {children}
          </main>
        </div>
      </div>
    </AppProvider>
  );
}
