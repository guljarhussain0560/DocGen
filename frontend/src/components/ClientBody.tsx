'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import SettingsModal from '@/components/SettingsModal';

export default function ClientBody({ children }: { children: React.ReactNode }) {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      <Sidebar onSettingsClick={() => setIsSettingsOpen(true)} />
      <main className="flex-1 overflow-y-auto border-l border-[#30363d] bg-[#0d1117]">
        <div className="p-6 max-w-7xl mx-auto font-mono">
          {children}
        </div>
      </main>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
