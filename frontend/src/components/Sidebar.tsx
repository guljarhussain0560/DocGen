'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FolderGit2, BookOpen, MessageSquare, Settings, GitPullRequest } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Repositories', href: '/repositories', icon: FolderGit2 },
  { name: 'API Docs', href: '/api-docs', icon: BookOpen },
  { name: 'Codebase Chat', href: '/chat', icon: MessageSquare },
  { name: 'Pull Requests', href: '/pull-requests', icon: GitPullRequest },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-[#0d1117] font-mono text-sm">
      <div className="flex h-14 shrink-0 items-center px-4 border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#c9d1d9] tracking-tight">DocGen.cli</span>
        </div>
      </div>
      
      <div className="flex flex-1 flex-col overflow-y-auto pt-4 px-2">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-2 py-1.5 rounded transition-all duration-200
                  ${isActive 
                    ? 'bg-[#1f6feb]/10 text-[#58a6ff]' 
                    : 'text-[#8b949e] hover:bg-[#161b22] hover:text-[#c9d1d9]'}
                `}
              >
                <item.icon
                  className={`mr-2 h-4 w-4 flex-shrink-0 ${
                    isActive ? 'text-[#58a6ff]' : 'text-[#8b949e] group-hover:text-[#c9d1d9]'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-2 border-t border-[#30363d]">
        <button className="flex items-center w-full px-2 py-1.5 text-[#8b949e] rounded hover:bg-[#161b22] hover:text-[#c9d1d9] transition-all duration-200">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
