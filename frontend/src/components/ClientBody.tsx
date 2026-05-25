'use client';

import Sidebar from '@/components/Sidebar';

export default function ClientBody({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Sidebar />
      <main className="flex-1 overflow-y-auto border-l border-[#30363d] bg-[#0d1117]">
        <div className="p-6 max-w-7xl mx-auto font-mono">
          {children}
        </div>
      </main>
    </>
  );
}
